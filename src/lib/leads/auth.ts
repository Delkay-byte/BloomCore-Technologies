import type { LeadEnv } from "./db";

/**
 * Server-side Cloudflare Access enforcement.
 *
 * Cloudflare Access terminates authentication at the edge and forwards a
 * signed JWT in the `Cf-Access-Jwt-Assertion` header. That header is only
 * trusted when it verifies against the team's published signing keys, so an
 * attacker cannot forge it, and the frontend never decides authorisation.
 */

export type StaffIdentity = {
  email: string;
  name: string | null;
  source: "access" | "dev";
};

/** Anything that can read request headers (a Request or `next/headers`). */
export type HeaderCarrier = { headers: { get(name: string): string | null } };

type AccessPayload = {
  email?: string;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  identity_nonce?: string;
  name?: string;
};

type Jwk = { kid?: string; kty: string; n?: string; e?: string; alg?: string; use?: string };

const CERT_TTL_MS = 60 * 60 * 1000;
let certCache: { fetchedAt: number; keys: Jwk[] } | null = null;

function base64UrlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJson<T>(segment: string): T | null {
  try {
    const bytes = base64UrlToBytes(segment);
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

export function normalizeTeamDomain(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withScheme.replace(/\/+$/, "");
}

async function fetchCertificates(teamDomain: string): Promise<Jwk[]> {
  if (certCache && Date.now() - certCache.fetchedAt < CERT_TTL_MS) return certCache.keys;
  const response = await fetch(`${teamDomain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error("access_certs_unavailable");
  const payload = (await response.json()) as { keys?: Jwk[] };
  const keys = payload.keys ?? [];
  certCache = { fetchedAt: Date.now(), keys };
  return keys;
}

/** Verify the Access JWT and return its payload, or null when invalid. */
export async function verifyAccessJwt(
  token: string,
  teamDomain: string,
  audience: string,
): Promise<AccessPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerSegment, payloadSegment, signatureSegment] = parts;

  const header = decodeJson<{ alg?: string; kid?: string }>(headerSegment);
  const payload = decodeJson<AccessPayload>(payloadSegment);
  if (!header || !payload || header.alg !== "RS256") return null;

  let keys: Jwk[];
  try {
    keys = await fetchCertificates(teamDomain);
  } catch {
    return null;
  }

  const jwk = keys.find((key) => key.kid === header.kid) ?? keys[0];
  if (!jwk?.n || !jwk.e) return null;

  let valid = false;
  try {
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );
    valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      base64UrlToBytes(signatureSegment),
      new TextEncoder().encode(`${headerSegment}.${payloadSegment}`),
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && payload.exp <= nowSeconds) return null;
  if (typeof payload.nbf === "number" && payload.nbf > nowSeconds + 60) return null;

  const issuer = normalizeTeamDomain(payload.iss);
  if (!issuer || issuer !== teamDomain) return null;

  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(audience)) return null;

  return payload;
}

function allowedEmails(env: LeadEnv): string[] {
  return (env.INTERNAL_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Resolve the signed-in staff member, or null when the request is not
 * authorised. Fails closed: if Access is not configured this returns null
 * unless an explicit local development bypass is enabled.
 */
export async function getStaffIdentity(
  request: HeaderCarrier,
  env: LeadEnv,
): Promise<StaffIdentity | null> {
  const teamDomain = normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN);
  const audience = env.CF_ACCESS_AUD?.trim();

  if (teamDomain && audience) {
    const token = request.headers.get("cf-access-jwt-assertion");
    if (!token) return null;
    const payload = await verifyAccessJwt(token, teamDomain, audience);
    if (!payload?.email) return null;

    const email = payload.email.toLowerCase();
    const allow = allowedEmails(env);
    if (allow.length > 0 && !allow.includes(email)) return null;

    return { email, name: payload.name ?? null, source: "access" };
  }

  // Local development only. Never set INTERNAL_DEV_BYPASS in production.
  if (env.INTERNAL_DEV_BYPASS === "true") {
    const devEmail = allowedEmails(env)[0] ?? "owner@localhost";
    return { email: devEmail, name: "Local development", source: "dev" };
  }

  return null;
}

export async function isAccessConfigured(env: LeadEnv): Promise<boolean> {
  return Boolean(normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN) && env.CF_ACCESS_AUD?.trim());
}
