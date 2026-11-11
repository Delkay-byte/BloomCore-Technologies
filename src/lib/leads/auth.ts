import type { LeadEnv } from "./db";

/**
 * Server-side Cloudflare Access enforcement.
 *
 * Cloudflare Access terminates authentication at the edge and forwards a
 * signed JWT in the `Cf-Access-Jwt-Assertion` header. That header is only
 * trusted when it verifies against the team's published signing keys, so an
 * attacker cannot forge it, and the frontend never decides authorisation.
 *
 * The system is fronted by two separate Access applications, each with its own
 * Application Audience (AUD) tag:
 *
 * - `CF_ACCESS_AUD_INTERNAL` guards the dashboard at `/internal`.
 * - `CF_ACCESS_AUD_API` guards the internal API at `/api/internal`.
 *
 * A token minted for one application must never authorise the other, so the
 * expected audience is chosen per surface and never shared.
 */

/** The two Access applications, each with a distinct audience. */
export type AccessSlot = "internal" | "api";

export type StaffIdentity = {
  email: string;
  name: string | null;
  source: "access";
};

/** Anything that can read request headers (a Request or `next/headers`). */
export type HeaderCarrier = { headers: { get(name: string): string | null } };

/** Published Cloudflare Access signing key (JSON Web Key). */
export type Jwk = {
  kid?: string;
  kty: string;
  n?: string;
  e?: string;
  alg?: string;
  use?: string;
};

export type AccessVerifyOptions = {
  /**
   * Pre-fetched signing keys. Tests inject these to verify real signatures
   * without network access. Production never sets this and the keys are
   * fetched from the team's published JWKS endpoint.
   */
  keys?: Jwk[];
};

type AccessPayload = {
  email?: string;
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  identity_nonce?: string;
  name?: string;
};

const CERT_TTL_MS = 60 * 60 * 1000;
const CLOCK_SKEW_SECONDS = 60;

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

/**
 * Verify the Access JWT and return its payload, or null when invalid.
 *
 * Checks the RS256 signature against the team's signing keys, the issuer, the
 * expected audience, and the expiry/not-before time claims. Every failure
 * returns null so the caller fails closed.
 */
export async function verifyAccessJwt(
  token: string,
  teamDomain: string,
  audience: string,
  options: AccessVerifyOptions = {},
): Promise<AccessPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerSegment, payloadSegment, signatureSegment] = parts;

  const header = decodeJson<{ alg?: string; kid?: string }>(headerSegment);
  const payload = decodeJson<AccessPayload>(payloadSegment);
  if (!header || !payload || header.alg !== "RS256") return null;

  let keys: Jwk[];
  if (options.keys) {
    keys = options.keys;
  } else {
    try {
      keys = await fetchCertificates(teamDomain);
    } catch {
      return null;
    }
  }

  // When the token names a key, require that exact key. Never fall back to an
  // unrelated key for a keyed token.
  const jwk = header.kid ? keys.find((key) => key.kid === header.kid) : keys[0];
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
  // `exp` is mandatory: a token without an expiry is not accepted. There is
  // no backward leeway, so an already-expired token is always rejected.
  if (typeof payload.exp !== "number") return null;
  if (payload.exp <= nowSeconds) return null;
  if (typeof payload.nbf === "number" && payload.nbf > nowSeconds + CLOCK_SKEW_SECONDS) return null;
  if (typeof payload.iat === "number" && payload.iat > nowSeconds + CLOCK_SKEW_SECONDS) return null;

  const issuer = normalizeTeamDomain(payload.iss);
  if (!issuer || issuer !== teamDomain) return null;

  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(audience)) return null;

  return payload;
}

const AUDIENCE_ENV: Record<AccessSlot, keyof LeadEnv> = {
  internal: "CF_ACCESS_AUD_INTERNAL",
  api: "CF_ACCESS_AUD_API",
};

/** The configured audience for a surface, or null when it is not configured. */
export function accessAudience(env: LeadEnv, slot: AccessSlot): string | null {
  const value = env[AUDIENCE_ENV[slot]];
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function allowedEmails(env: LeadEnv): string[] {
  return (env.INTERNAL_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Resolve the signed-in staff member for a surface, or null when the request
 * is not authorised. Fails closed: if Access is not configured for that
 * surface this returns null. There is no development bypass.
 */
export async function getStaffIdentity(
  request: HeaderCarrier,
  env: LeadEnv,
  slot: AccessSlot,
  options: AccessVerifyOptions = {},
): Promise<StaffIdentity | null> {
  const teamDomain = normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN);
  const audience = accessAudience(env, slot);
  if (!teamDomain || !audience) return null;

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return null;

  const payload = await verifyAccessJwt(token, teamDomain, audience, options);
  if (!payload?.email) return null;

  const email = payload.email.toLowerCase();
  const allow = allowedEmails(env);
  if (allow.length > 0 && !allow.includes(email)) return null;

  return { email, name: payload.name ?? null, source: "access" };
}

/** True when Access is fully configured for the given surface. */
export function isAccessConfigured(env: LeadEnv, slot: AccessSlot): boolean {
  return Boolean(normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN) && accessAudience(env, slot));
}
