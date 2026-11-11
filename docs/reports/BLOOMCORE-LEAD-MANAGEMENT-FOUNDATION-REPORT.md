# BloomCore lead management foundation — report

**Project:** BloomCore Technologies — first-party lead management
**Repository:** `C:\Users\SAVIOUR\Documents\DScience\BloomCore Web`
**Branch:** `feat/lead-management-foundation`
**Baseline commit:** `9f2ce2f`
**Production target:** `https://bloomcoretech.com`
**Worker:** `bloomcore-technologies-page`
**Private console:** `https://bloomcoretech.com/internal/leads`
**Date:** 11 November 2026
**Stack:** Next.js 16.4.6 App Router, React 19.3.0, Tailwind CSS v4, OpenNext Cloudflare, Cloudflare D1, Cloudflare Access, Resend

> **Revision — Access audience correction.** The original build validated a single
> `CF_ACCESS_AUD` for both surfaces. Two Access applications have two different AUD tags, so
> this revision splits the configuration into `CF_ACCESS_AUD_INTERNAL` (dashboard) and
> `CF_ACCESS_AUD_API` (internal API), removes the `INTERNAL_DEV_BYPASS` development bypass
> entirely, and adds `tests/access-auth.test.ts`. See §4.8, §6 and §7.2.

## 1. Objective

Give BloomCore a first-party enquiry system: capture public enquiries durably, notify the
team by email and in a private dashboard, and measure conversions in GA4 — without a
third-party CRM licence, without exposing any lead record publicly, and without disturbing
the existing public site, SEO or analytics.

## 2. What the site was before

The public site was 100% static. There were no route handlers and no server actions. Both
enquiry components (`QuickEnquiry`, `ContactForm`) only built a `mailto:` link and opened
the visitor's own mail client. Nothing was stored; the contact copy said so explicitly.

## 3. Architecture decisions

| Area | Decision | Why |
| --- | --- | --- |
| Storage | Dedicated Cloudflare D1 `bloomcore-leads-prod`, binding `LEADS_DB` | Serverless, cost-efficient, SQLite semantics, same platform as the Worker. No new vendor. |
| Migrations | Versioned SQL in `migrations/` | Reviewable, replayable, applied with `wrangler d1 migrations apply`. |
| Public API | `POST /api/enquiries` only | Keeps the write path separate from every private endpoint. |
| Console auth | Cloudflare Access (Cloudflare IdP) **plus** server-side JWT check | Edge blocks anonymous traffic; the Worker independently verifies the signed identity so a direct `workers.dev` host cannot bypass the policy. |
| Email | Resend free tier over HTTP | Workers cannot open SMTP connections; HTTP API is the supported route. |
| Acknowledgement | Durable outbox in D1 | Delivery failures never lose a lead; a failed send stays queued and retryable. |
| Analytics | Existing GTM container, `generate_lead` after confirmed save | No new tag, no PII, no duplicate page view. |

## 4. What was built

### 4.1 Route-group split

All marketing pages moved to `src/app/(site)/`. The root `src/app/layout.tsx` now carries
only `html`/`body`, fonts, metadata and the theme bootstrap. The public chrome (header,
footer, help chat, back-to-top, analytics, JSON-LD) moved into `src/components/SiteChrome.tsx`
and is applied by `src/app/(site)/layout.tsx` and `src/app/not-found.tsx`. The private
console at `/internal` therefore renders its own chrome with no public navigation.

Every public URL is unchanged.

### 4.2 Database schema — `migrations/0001_init.sql`

Tables: `leads`, `lead_activity`, `lead_notes`, `notifications`, `staff`, `rate_limits`,
`sequences`. Timestamps are ISO-8601 UTC strings. Indexes cover lead number, status, email,
product, enquiry type, follow-up, dedupe digest and idempotency key.

The `sequences` table issues human-quotable lead numbers of the form `BC-<year>-<000000>`.

### 4.3 Domain layer — `src/lib/leads/domain.ts`

Dependency-free and unit-tested. Holds enquiry categories, products, pipeline stages,
terminal stages, activities, length limits, text/email normalisation, validation, anti-spam
signals, the lead-number formatter and the stage-transition rules. Imported by the app, the
API and the tests.

Pipeline stages: `new → contacted → qualified → discovery_scheduled → demo_requested →
demo_completed → proposal_sent → negotiation → won | lost | unqualified`. `won`, `lost`
and `unqualified` are terminal; a closed lead must be reopened before its stage changes, and
`lost`/`unqualified` require a recorded reason.

### 4.4 Data layer — `src/lib/leads/repository.ts`

Lead creation with idempotency-key replay, 24-hour content dedupe, rate limiting
(per-IP and per-email sliding buckets), filtering and pagination, activity history, notes,
metrics, and CSV-ready export queries. Local D1 types are declared in `src/lib/leads/db.ts`
so the repository does not depend on the git-ignored generated `cloudflare-env.d.ts`.

### 4.5 Email layer — `src/lib/email/`

- `resend.ts` — minimal Resend HTTP client; returns a retryable/terminal result, never throws
  provider detail into the response.
- `templates.ts` — company alert and visitor acknowledgement, HTML and plain text. Subjects
  carry the lead number and category only. All interpolated values are HTML-escaped.

### 4.6 Notification outbox — `src/lib/leads/notifications.ts`

Each new enquiry queues three rows: company email, visitor acknowledgement, and an
in-dashboard entry. Email rows are drained with bounded retries (max 5 attempts). While
`RESEND_API_KEY` is absent the drain no-ops and rows stay `pending`, so nothing is lost.
A manual **Retry failed emails** action requeues terminal failures.

### 4.7 Public submission — `POST /api/enquiries` + `src/lib/leads/submit.ts`

Order of operations: origin check → bounded body read → honeypot and fill-time checks →
server-side validation → per-IP then per-email rate limit → idempotent create → queue
notifications → drain outbox → success response. A bot that trips the honeypot receives an
ordinary `{"ok":true,"spam":true}` and nothing is stored.

### 4.8 Auth — `src/lib/leads/auth.ts`, `guard.ts`, `session.ts`

Two Access applications front the system, and each has its own Application Audience (AUD)
tag. The verifier never shares one audience across both surfaces:

| Surface | Routes | Env var | Audience validated |
| --- | --- | --- | --- |
| Dashboard | `/internal` and descendants | `CF_ACCESS_AUD_INTERNAL` | the dashboard application |
| Internal API | `/api/internal` and descendants | `CF_ACCESS_AUD_API` | the internal API application |

`getStaffIdentity(request, env, slot)` takes the slot (`"internal"` or `"api"`),
`accessAudience(env, slot)` resolves the matching env var, and
`verifyAccessJwt(token, teamDomain, audience, options?)` verifies the token. `guard.ts`
(`requireStaff`) and `session.ts` (`currentStaff`) pass the correct slot, so a dashboard
token cannot authorise an API route and an API token cannot authorise the dashboard.

JWT validation with WebCrypto:

1. Structure: three segments; header `alg` must be exactly `RS256` (`alg: none` is rejected).
2. Signature: RS256 against the team's published certs (`/cdn-cgi/access/certs`). When the
   token names a `kid`, only the matching key is accepted.
3. Issuer: `iss` normalized and required to equal `CF_ACCESS_TEAM_DOMAIN`.
4. Audience: `aud` (string or array) must contain the surface's AUD.
5. Time claims: `exp` is **mandatory**; `exp <= now` is rejected with no backward leeway.
   `nbf` and `iat`, when present, must not be more than 60 s ahead of now.
6. Identity: an optional `INTERNAL_ALLOWED_EMAILS` allowlist is a second gate.

**Fails closed**: with no team domain or no audience for the surface, every internal route
returns 401 and every console page renders "Sign in required". **There is no development
bypass** — `INTERNAL_DEV_BYPASS` and the `source: "dev"` identity were removed, and the same
verification path runs locally and in production. `verifyAccessJwt` accepts injected signing
keys so tests can verify real signatures without network access.

### 4.9 Private API

`GET /api/internal/leads`, `GET|PATCH /api/internal/leads/[id]`,
`POST /api/internal/leads/[id]/notes`, `GET /api/internal/metrics`,
`GET /api/internal/notifications`, `PATCH /api/internal/notifications`,
`POST /api/internal/notifications/retry`, `GET /api/internal/export` (CSV).
All are `force-dynamic` and pass through `requireStaff`.

### 4.10 Console UI — `src/app/internal/`

Dashboard with metric tiles and a filter bar; leads table; lead detail with enquiry, contact,
source, activity, notes and notification panels plus an actions pane (stage, owner, follow-up,
note, archive); notifications page with mark-all-read and retry. Styled from BloomCore
tokens (forest `#0c3b30`, brass `#c69a3e`, Source Serif 4 + Inter). `robots: noindex`.

### 4.11 Public wiring

- `ContactForm.tsx` posts to `/api/enquiries` with an idempotency key, honeypot, fill-time
  check, privacy acknowledgement, inline field errors, and a success state that shows the
  lead reference. It reads `?product=` and `?type=` to preselect.
- `QuickEnquiry.tsx` is now a compact API form (name, email, type, message) instead of a
  `mailto:` builder.
- Product page CTAs link to `/contact?product=<slug>&type=product_enquiry`.
- Contact and privacy copy updated to describe storage and the acknowledgement.
- `robots.ts` disallows `/internal`, `/api/internal` and `/api/enquiries`.

### 4.12 Analytics

`src/lib/analytics.ts` is untouched: one GTM container (`GTM-PMZ6ZSVT`), GA4
(`G-GDBL5SNHKL`) inside it, consent-gated `trackEvent`. `generate_lead` fires **only** in the
success branch of each form, carries no PII, and is suppressed when the API reports the
submission was a recognised duplicate, so a repeat does not inflate conversions.

## 5. Security model

- Anonymous traffic cannot read leads, notes, metrics or notifications: the API returns 401
  and the console renders a sign-in prompt with no data.
- Access is enforced at two layers. Cloudflare Access should block first; the Worker check
  is the backstop that makes a `workers.dev` or direct-origin hit fail closed.
- No lead record, PII or note is ever returned from a public endpoint. `POST /api/enquiries`
  returns only `ok`, `duplicate`, `leadNumber`, `enquiryType`, `product` and a bounded
  `messageLength`.
- Errors are human-readable and never leak stack traces, SQL or provider responses.
- Security headers (`no-store`, `nosniff`, referrer policy) are set on all JSON and CSV.

## 6. Verification evidence

All commands run locally on Windows against local Miniflare D1.

| Gate | Command | Result |
| --- | --- | --- |
| Types | `npx tsc --noEmit` | clean |
| Lint | `npm run lint` | clean |
| Unit tests | `npm run test` | 28 passed, 0 failed (10 domain + 18 Access) |
| Next build | `npm run build` | public routes static, `/internal/*` and `/api/*` dynamic |
| Worker build | `npx opennextjs-cloudflare build` | `Worker saved in .open-next\worker.js` |
| Migration | `npx wrangler d1 migrations apply LEADS_DB --local` | `0001_init.sql` applied |

Integration (earlier pass, via `wrangler dev --local` while a dev bypass still existed; that
bypass has since been removed):

- Valid submit → `{"ok":true,"duplicate":false,"leadNumber":"BC-2026-000001",...}`.
- Same idempotency key → `duplicate:true`, one lead row.
- Same content, new key → `duplicate:true` (24-hour dedupe).
- Honeypot field filled → `{"ok":true,"spam":true}`, nothing stored.
- Invalid payload → HTTP 422 with per-field messages.
- Stage change, assignment, follow-up, note → activity history grew to 5 entries; 3
  notification rows created (company, acknowledgement, dashboard).
- `lost` without a reason → HTTP 422; with a reason → saved; reopen after close → HTTP 422.
- Metrics, list, CSV header and console render all correct.
- Per-IP rate limit triggered after repeated submissions → HTTP 429.
- Challenge-only `GET /api/enquiries` → HTTP 405.

Fail-closed auth (no bypass exists; `.dev.vars` has empty team domain and audiences):

| Endpoint | Expected | Observed |
| --- | --- | --- |
| `GET /api/internal/leads` | 401 | `{"ok":false,"error":"Sign in with the authorised BloomCore account."}` |
| `GET /api/internal/metrics` | 401 | 401 |
| `GET /api/internal/export` | 401 | 401 |
| `GET /api/internal/notifications` | 401 | 401 |
| `POST /api/internal/notifications/retry` | 401 | 401 |
| `GET /internal/leads` | sign-in prompt, no data | `signInRequired=True leaksLead=False leaksEmail=False` |

Access audience and JWT suite (`tests/access-auth.test.ts`, real RSA keys, injected into the
verifier) — the 16 required cases:

| # | Case | Result |
| --- | --- | --- |
| 1 | Dashboard token rejected on an API route | pass |
| 2 | API token rejected on the dashboard | pass |
| 3 | Correct dashboard token authorises only the dashboard | pass |
| 4 | Correct API token authorises only the API | pass |
| 5 | Missing audience configuration fails closed | pass |
| 6 | Invalid signature (forged key, tampered signature, `alg: none`) rejected | pass |
| 7 | Invalid issuer rejected | pass |
| 8 | Invalid audience rejected | pass |
| 9 | Expired JWT rejected | pass |
| 10 | Missing/`nbf`/`iat` time claims handled securely | pass |
| 11 | Anonymous access denied on every internal API route | pass |
| 12 | Base and descendant routes both guarded | pass |
| 13 | Public site pages stay public | pass |
| 14 | Public enquiry endpoint stays public | pass |
| 15 | No development bypass present anywhere in `src` | pass |
| 16 | Auth errors contain no lead information | pass |

`generate_lead` placement was confirmed by inspection: the call sits inside
`if (response.ok && data.ok)` in both `ContactForm.tsx` and `QuickEnquiry.tsx`, guarded by
`!data.duplicate`. No automated browser run was performed for the client event.

Local QA rows (`qa.lead@example.com`, `qa2@example.com` and their notifications, notes,
activity and rate-limit rows) were deleted from local D1 after testing.

## 7. Owner action checklist

These are the only remaining steps to go live. The code is complete and committed on
`feat/lead-management-foundation`; it is **not** deployed.

### 7.1 Cloudflare D1

1. Create the database in the dashboard: **Workers & Pages → D1 → Create**, name
   `bloomcore-leads-prod`.
2. Copy its `database_id` and replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.jsonc`.
3. Apply the schema: `npx wrangler d1 migrations apply LEADS_DB --remote`.
4. For this and the steps below the API token needs the **D1** edit permission (currently
   401) and **DNS** edit for Resend (currently 403).

### 7.2 Cloudflare Access

1. In **Zero Trust**, note the team domain (`<team>.cloudflareaccess.com`) and, if needed,
   set up the Cloudflare identity provider. Confirm the owner can sign in with
   `bloomcoretechnologies@gmail.com` (the Cloudflare account email shown by
   `wrangler whoami`).
2. Create **two** self-hosted Access applications on `bloomcoretech.com`. Enter **both** the
   bare path and the wildcard so the base route and descendants are covered:
   - Dashboard: domain `bloomcoretech.com`, path `/internal` **and** `/internal/*`
   - Internal API: domain `bloomcoretech.com`, path `/api/internal` **and** `/api/internal/*`
3. For each application, add an **Allow** policy for the single owner email
   (`bloomcoretechnologies@gmail.com`), deny everyone else, set a finite session duration
   (for example 8–24 h), and require MFA on the owner's Cloudflare identity.
4. Copy each application's **Application Audience (AUD) tag** and set the Worker vars:
   - `CF_ACCESS_TEAM_DOMAIN` = the team domain, e.g. `https://<team>.cloudflareaccess.com`
   - `CF_ACCESS_AUD_INTERNAL` = the **dashboard** application's AUD tag
   - `CF_ACCESS_AUD_API` = the **internal API** application's AUD tag
   The two AUD values are different. Do not reuse one value for both.
5. Optionally disable the `*.workers.dev` route, or add an Access application for it too.
   (The Worker already returns 401 there without a valid JWT, so this is defence in depth.)

`INTERNAL_ALLOWED_EMAILS` is already set to `bloomcoretechnologies@gmail.com`. Add any
additional staff emails there as a comma-separated list.

### 7.3 Resend (email)

1. Create a Resend account and add the domain `bloomcoretech.com`.
2. Add the SPF and DKIM DNS records Resend provides. Send from `enquiries@bloomcoretech.com`.
3. Create an API key and store it as a Worker secret:
   `npx wrangler secret put RESEND_API_KEY`
4. `EMAIL_FROM`, `EMAIL_REPLY_TO` and `LEAD_NOTIFICATION_EMAIL` are already set in
   `wrangler.jsonc`; adjust if the addresses differ.

### 7.4 Deploy

`npx opennextjs-cloudflare build && npx wrangler deploy`. Do **not** deploy before 7.1–7.3
are complete: with an empty `database_id` the deploy fails, and with no Access config the
console is unreachable (fail closed) rather than exposed.

## 8. Netlify caveat

`next.config.ts` switches to `output: "export"` when `NETLIFY=true`. A static export cannot
contain route handlers, so the lead system cannot run on the Netlify fallback. The lead
system is **Cloudflare-only**. Never build a production Cloudflare deploy with `NETLIFY=true`.

## 9. Status

| Area | Status | Note |
| --- | --- | --- |
| Code, schema, tests, builds | GREEN | Type, lint, unit (28), Next and Worker builds all pass. |
| Local end-to-end behaviour | GREEN | Verified against local D1 and the Worker preview, including fail-closed auth. |
| Production D1 | AMBER | Code complete; owner must create the database and paste the id. |
| Cloudflare Access | AMBER | Two-audience code complete and fail-closed; owner must create **both** apps, policies and the two AUD vars. |
| Resend email | AMBER | Code complete and durable; owner must verify the domain, add DNS and set the key. |
| Public site, SEO, analytics | GREEN | Routes unchanged; GTM/GA4 and consent behaviour untouched. |

No production change has been made. No DNS, subscription or purchase action was taken.

## 10. Files

**Added — data and services:** `migrations/0001_init.sql`, `src/lib/leads/domain.ts`,
`src/lib/leads/db.ts`, `src/lib/leads/repository.ts`, `src/lib/leads/notifications.ts`,
`src/lib/leads/submit.ts`, `src/lib/leads/auth.ts`, `src/lib/leads/guard.ts`,
`src/lib/leads/session.ts`, `src/lib/email/resend.ts`, `src/lib/email/templates.ts`,
`src/lib/http.ts`.

**Added — API:** `src/app/api/enquiries/route.ts`, `src/app/api/internal/leads/route.ts`,
`src/app/api/internal/leads/[id]/route.ts`, `src/app/api/internal/leads/[id]/notes/route.ts`,
`src/app/api/internal/metrics/route.ts`, `src/app/api/internal/notifications/route.ts`,
`src/app/api/internal/notifications/retry/route.ts`, `src/app/api/internal/export/route.ts`.

**Added — console:** `src/app/internal/layout.tsx`, `src/app/internal/page.tsx`,
`src/app/internal/leads/page.tsx`, `src/app/internal/leads/[id]/page.tsx`,
`src/app/internal/notifications/page.tsx`, `src/components/internal/ConsoleGuard.tsx`,
`src/components/internal/LeadActions.tsx`, `src/components/internal/NotificationActions.tsx`.

**Added — shell and tests:** `src/components/SiteChrome.tsx`, `src/app/(site)/layout.tsx`,
`tests/domain.test.ts`, `tests/access-auth.test.ts`, `docs/plans/lead-management-foundation.md`.

**Moved:** all public pages under `src/app/(site)/` (URLs unchanged).

**Modified:** `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/robots.ts`,
`src/components/ContactForm.tsx`, `src/components/QuickEnquiry.tsx`,
`src/components/ProductPageShell.tsx`, `wrangler.jsonc`, `package.json`, `tsconfig.json`.

**Untouched:** `src/lib/analytics.ts`, all brand/SEO helpers, all public page content except
the contact and privacy copy that described the old `mailto:` behaviour.
