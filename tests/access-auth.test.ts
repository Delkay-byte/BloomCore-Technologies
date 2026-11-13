import assert from "node:assert/strict";
import { test } from "node:test";
import { createSign, generateKeyPairSync } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  accessAudience,
  accessAudiences,
  getStaffIdentity,
  getStaffIdentityForSurfaces,
  isAccessConfigured,
  verifyAccessJwt,
} from "../src/lib/leads/auth.ts";

/**
 * Cloudflare Access audience and JWT tests.
 *
 * Covers the 16 required security cases. Real RSA keys sign real tokens and
 * the public key is injected into the verifier, so the signature check runs
 * without any network access.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const TEAM = "https://bloomcore.cloudflareaccess.com";
const AUD_INTERNAL = "aud-internal-0001";
const AUD_API = "aud-api-0002";
const OWNER = "bloomcoretechnologies@gmail.com";
const KID = "test-signing-key";

const now = () => Math.floor(Date.now() / 1000);

// Primary signing key pair used for valid tokens.
const primary = generateKeyPairSync("rsa", { modulusLength: 2048 });
const attacker = generateKeyPairSync("rsa", { modulusLength: 2048 });

const publicJwk = { ...primary.publicKey.export({ format: "jwk" }), kid: KID, alg: "RS256", use: "sig" };
const KEYS = [publicJwk];

const b64url = (value) => Buffer.from(value).toString("base64url");

function signToken(payload, { key = primary.privateKey, kid = KID } = {}) {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid }));
  const body = b64url(JSON.stringify(payload));
  const signature = createSign("RSA-SHA256").update(`${header}.${body}`).sign(key);
  return `${header}.${body}.${b64url(signature)}`;
}

function claims(overrides = {}) {
  const t = now();
  return {
    email: OWNER,
    sub: "owner",
    iss: TEAM,
    aud: AUD_INTERNAL,
    exp: t + 3600,
    nbf: t - 60,
    iat: t - 60,
    name: "BloomCore Owner",
    ...overrides,
  };
}

function envFor(overrides = {}) {
  return {
    CF_ACCESS_TEAM_DOMAIN: TEAM,
    CF_ACCESS_AUD_INTERNAL: AUD_INTERNAL,
    CF_ACCESS_AUD_API: AUD_API,
    INTERNAL_ALLOWED_EMAILS: OWNER,
    ...overrides,
  };
}

function requestWith(token) {
  return {
    headers: {
      get: (name) => (name.toLowerCase() === "cf-access-jwt-assertion" ? token : null),
    },
  };
}

// --- Requirement 1 & 3: dashboard token cannot authorise the API ------------

test("1. a dashboard token cannot authorise an API route", async () => {
  const token = signToken(claims({ aud: AUD_INTERNAL }));
  const identity = await getStaffIdentity(requestWith(token), envFor(), "api", { keys: KEYS });
  assert.equal(identity, null);
});

test("3. the correct dashboard token authorises only the dashboard", async () => {
  const token = signToken(claims({ aud: AUD_INTERNAL }));
  const env = envFor();
  const internal = await getStaffIdentity(requestWith(token), env, "internal", { keys: KEYS });
  const api = await getStaffIdentity(requestWith(token), env, "api", { keys: KEYS });
  assert.equal(internal?.email, OWNER);
  assert.equal(api, null);
});

// --- Requirement 2 & 4: API token cannot authorise the dashboard ------------

test("2. an API token cannot authorise the dashboard", async () => {
  const token = signToken(claims({ aud: AUD_API }));
  const identity = await getStaffIdentity(requestWith(token), envFor(), "internal", { keys: KEYS });
  assert.equal(identity, null);
});

test("4. the correct API token authorises only the API", async () => {
  const token = signToken(claims({ aud: AUD_API }));
  const env = envFor();
  const api = await getStaffIdentity(requestWith(token), env, "api", { keys: KEYS });
  const internal = await getStaffIdentity(requestWith(token), env, "internal", { keys: KEYS });
  assert.equal(api?.email, OWNER);
  assert.equal(internal, null);
});

test("audience selection is per-surface and rejects a shared-token mix-up", () => {
  const env = envFor();
  assert.equal(accessAudience(env, "internal"), AUD_INTERNAL);
  assert.equal(accessAudience(env, "api"), AUD_API);
  assert.equal(isAccessConfigured(env, "internal"), true);
  assert.equal(isAccessConfigured(env, "api"), true);
});

// --- Requirement 5: missing configuration fails closed ----------------------

test("5. missing audience configuration fails closed", async () => {
  const token = signToken(claims({ aud: AUD_INTERNAL }));
  const noInternalAud = envFor({ CF_ACCESS_AUD_INTERNAL: "" });
  const noApiAud = envFor({ CF_ACCESS_AUD_API: "" });
  const noTeam = envFor({ CF_ACCESS_TEAM_DOMAIN: "" });

  assert.equal(await getStaffIdentity(requestWith(token), noInternalAud, "internal", { keys: KEYS }), null);
  assert.equal(await getStaffIdentity(requestWith(token), noApiAud, "api", { keys: KEYS }), null);
  assert.equal(await getStaffIdentity(requestWith(token), noTeam, "internal", { keys: KEYS }), null);
  assert.equal(isAccessConfigured(noInternalAud, "internal"), false);
  assert.equal(isAccessConfigured(noApiAud, "api"), false);
});

// --- Requirement 6: invalid signature ---------------------------------------

test("6. an invalid signature is rejected", async () => {
  const forged = signToken(claims({ aud: AUD_INTERNAL }), { key: attacker.privateKey });
  assert.equal(await verifyAccessJwt(forged, TEAM, AUD_INTERNAL, { keys: KEYS }), null);

  const valid = signToken(claims({ aud: AUD_INTERNAL }));
  const [h, p, s] = valid.split(".");
  const tampered = `${h}.${p}.${s.slice(0, -2)}${s.slice(-2) === "AA" ? "BB" : "AA"}`;
  assert.equal(await verifyAccessJwt(tampered, TEAM, AUD_INTERNAL, { keys: KEYS }), null);

  // "alg: none" is never accepted, even with a well-formed token.
  const noneToken = `${b64url(JSON.stringify({ alg: "none", kid: KID }))}.${b64url(
    JSON.stringify(claims({ aud: AUD_INTERNAL })),
  )}.`;
  assert.equal(await verifyAccessJwt(noneToken, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
});

// --- Requirement 7: invalid issuer ------------------------------------------

test("7. an invalid issuer is rejected", async () => {
  const token = signToken(claims({ iss: "https://not-bloomcore.cloudflareaccess.com" }));
  assert.equal(await verifyAccessJwt(token, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
});

// --- Requirement 8: invalid audience ----------------------------------------

test("8. an invalid audience is rejected", async () => {
  const token = signToken(claims({ aud: "some-other-application" }));
  assert.equal(await verifyAccessJwt(token, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
  assert.equal(await verifyAccessJwt(token, TEAM, AUD_API, { keys: KEYS }), null);
});

// --- Requirement 9 & 10: time claims ----------------------------------------

test("9. an expired JWT is rejected", async () => {
  const t = now();
  const token = signToken(claims({ aud: AUD_INTERNAL, exp: t - 3600, iat: t - 7200, nbf: t - 7200 }));
  assert.equal(await verifyAccessJwt(token, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
});

test("10. invalid or missing time claims are handled securely", async () => {
  const t = now();
  const missingExp = signToken(claims({ aud: AUD_INTERNAL, exp: undefined }));
  const futureNbf = signToken(claims({ aud: AUD_INTERNAL, nbf: t + 3600 }));
  const futureIat = signToken(claims({ aud: AUD_INTERNAL, iat: t + 3600 }));
  const badExp = signToken(claims({ aud: AUD_INTERNAL, exp: "soon" }));

  assert.equal(await verifyAccessJwt(missingExp, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
  assert.equal(await verifyAccessJwt(futureNbf, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
  assert.equal(await verifyAccessJwt(futureIat, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
  assert.equal(await verifyAccessJwt(badExp, TEAM, AUD_INTERNAL, { keys: KEYS }), null);
});

test("a token for an unauthorised email is rejected", async () => {
  const token = signToken(claims({ aud: AUD_INTERNAL, email: "intruder@example.com" }));
  assert.equal(await getStaffIdentity(requestWith(token), envFor(), "internal", { keys: KEYS }), null);
});

// --- Requirement 11 & 12: every internal route is guarded -------------------

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
}

const sourceFiles = () => walk(join(ROOT, "src")).filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));

test("11 & 12. every internal API route enforces Access server-side", () => {
  const apiRoot = join(ROOT, "src", "app", "api", "internal");
  const routes = walk(apiRoot).filter((f) => f.endsWith("route.ts"));
  assert.ok(routes.length >= 6, "expected the internal API route files to be present");
  for (const file of routes) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /requireStaff\(/, `${file} must call requireStaff`);
  }
});

test("11 & 12. every internal dashboard page is gated", () => {
  const pages = walk(join(ROOT, "src", "app", "internal")).filter((f) => f.endsWith("page.tsx"));
  assert.ok(pages.length >= 4, "expected the internal dashboard pages to be present");
  for (const file of pages) {
    const source = readFileSync(file, "utf8");
    const isRedirectStub = /redirect\(/.test(source) && !/repository|notifications/.test(source);
    if (isRedirectStub) continue;
    assert.match(source, /currentStaff\(/, `${file} must resolve the Access identity`);
    assert.match(source, /ConsoleSignInRequired/, `${file} must refuse to render without identity`);
  }
});

// --- Requirement 13 & 14: public surfaces stay public -----------------------

test("13. no public page is gated by the internal guard", () => {
  const publicPages = walk(join(ROOT, "src", "app", "(site)")).filter((f) => f.endsWith("page.tsx"));
  assert.ok(publicPages.length >= 10, "expected the public pages to be present");
  for (const file of publicPages) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /requireStaff|getStaffIdentity|currentStaff/, `${file} must stay public`);
  }
});

test("14. the public enquiry endpoint is not gated", () => {
  const file = join(ROOT, "src", "app", "api", "enquiries", "route.ts");
  assert.ok(existsSync(file), "the public enquiry endpoint must exist");
  const source = readFileSync(file, "utf8");
  assert.doesNotMatch(source, /requireStaff|getStaffIdentity/, "the enquiry endpoint must stay public");
});

// --- Requirement 15: no development bypass ----------------------------------

test("15. no development authentication bypass is present", () => {
  for (const file of sourceFiles()) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /INTERNAL_DEV_BYPASS/, `${file} must not reference a dev bypass`);
  }
  const auth = readFileSync(join(ROOT, "src", "lib", "leads", "auth.ts"), "utf8");
  assert.doesNotMatch(auth, /source:\s*"dev"/, "auth must not expose a dev identity");
  assert.match(auth, /source:\s*"access"/, "the only accepted identity source is Access");
});

// --- Requirement 16: no lead data in auth errors ----------------------------

test("16. authentication errors expose no lead information", () => {
  const guard = readFileSync(join(ROOT, "src", "lib", "leads", "guard.ts"), "utf8");
  const message = "Sign in with the authorised BloomCore account.";
  assert.ok(guard.includes(`errorResponse("${message}", 401)`), "the 401 message must be static");
  // The failure branch must not interpolate identity or lead fields.
  const failBranch = guard.slice(guard.indexOf("if (!identity)"));
  assert.doesNotMatch(failBranch, /identity\.|lead|email|payload/, "auth failure must not leak data");
});

// --- Same-origin dashboard fetches: both staff applications accepted --------
//
// Defect 1: the console is signed in to the dashboard Access application, but
// its XHRs pointed at `/api/internal`. Access challenged that with the *other*
// application and answered with a cross-origin redirect, which `fetch` cannot
// follow — the browser reported "check your connection". Client requests are
// now served from `/internal/api` (dashboard path) and the guard accepts either
// BloomCore staff audience. These tests pin that relaxation, and its limits.

test("a dashboard token authorises same-origin client requests", async () => {
  const token = signToken(claims({ aud: AUD_INTERNAL }));
  const identity = await getStaffIdentityForSurfaces(requestWith(token), envFor(), [
    "internal",
    "api",
  ], { keys: KEYS });
  assert.equal(identity?.email, OWNER);
});

test("an API token also authorises same-origin client requests", async () => {
  const token = signToken(claims({ aud: AUD_API }));
  const identity = await getStaffIdentityForSurfaces(requestWith(token), envFor(), [
    "internal",
    "api",
  ], { keys: KEYS });
  assert.equal(identity?.email, OWNER);
});

test("the relaxation never accepts an unrelated Access application", async () => {
  const token = signToken(claims({ aud: "some-other-application" }));
  assert.equal(
    await getStaffIdentityForSurfaces(requestWith(token), envFor(), ["internal", "api"], {
      keys: KEYS,
    }),
    null,
  );
});

test("the relaxation still rejects an unauthorised email", async () => {
  const token = signToken(claims({ aud: AUD_INTERNAL, email: "intruder@example.com" }));
  assert.equal(
    await getStaffIdentityForSurfaces(requestWith(token), envFor(), ["internal", "api"], {
      keys: KEYS,
    }),
    null,
  );
});

test("with no audience configured the relaxed guard still fails closed", async () => {
  const token = signToken(claims({ aud: AUD_INTERNAL }));
  const env = envFor({ CF_ACCESS_AUD_INTERNAL: "", CF_ACCESS_AUD_API: "" });
  assert.equal(
    await getStaffIdentityForSurfaces(requestWith(token), env, ["internal", "api"], { keys: KEYS }),
    null,
  );
});

test("a token minted for both applications is accepted", async () => {
  const token = signToken(claims({ aud: [AUD_INTERNAL, AUD_API] }));
  assert.ok(await getStaffIdentityForSurfaces(requestWith(token), envFor(), ["internal", "api"], { keys: KEYS }));
});

test("accessAudiences deduplicates identical configuration", () => {
  const shared = envFor({ CF_ACCESS_AUD_API: AUD_INTERNAL });
  assert.deepEqual(accessAudiences(shared, ["internal", "api"]), [AUD_INTERNAL]);
  assert.deepEqual(accessAudiences(envFor(), ["internal", "api"]), [AUD_INTERNAL, AUD_API]);
  assert.deepEqual(accessAudiences(envFor({ CF_ACCESS_AUD_API: "" }), ["internal", "api"]), [
    AUD_INTERNAL,
  ]);
});

test("the /internal/api routes only re-export guarded handlers", () => {
  const clientRoot = join(ROOT, "src", "app", "internal", "api");
  const routes = walk(clientRoot).filter((f) => f.endsWith("route.ts"));
  assert.ok(routes.length >= 6, "expected the same-origin client routes to exist");

  for (const file of routes) {
    const source = readFileSync(file, "utf8");
    const targets = [...source.matchAll(/from "@\/app\/api\/internal\/([^"]+)"/g)].map((m) => m[1]);
    assert.ok(targets.length > 0, `${file} must re-export a server handler`);
    assert.match(source, /export const dynamic = "force-dynamic"/, `${file} must stay dynamic`);
    assert.doesNotMatch(source, /LEADS_DB|requireStaff\(\)/, `${file} must not query D1 directly`);

    for (const target of targets) {
      const handler = join(ROOT, "src", "app", "api", "internal", `${target}.ts`);
      assert.ok(existsSync(handler), `${file} points at a missing handler: ${handler}`);
      assert.match(
        readFileSync(handler, "utf8"),
        /requireStaff\(/,
        `${handler} must enforce Access`,
      );
    }
  }
});
