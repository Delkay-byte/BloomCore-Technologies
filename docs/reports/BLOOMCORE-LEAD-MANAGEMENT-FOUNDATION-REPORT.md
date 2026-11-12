# BloomCore lead management foundation — report

**Project:** BloomCore Technologies — first-party lead management
**Repository:** `C:\Users\SAVIOUR\Documents\DScience\BloomCore Web`
**Branch:** `feat/lead-management-foundation`
**Baseline commit:** `9f2ce2f`
**Production target:** `https://bloomcoretech.com`
**Worker:** `bloomcore-technologies-page`
**Private console:** `https://bloomcoretech.com/internal/leads`
**Date:** 11–12 November 2026
**Stack:** Next.js 16.4.6 App Router, React 19.3.0, Tailwind CSS v4, OpenNext Cloudflare, Cloudflare D1, Cloudflare Access, Resend

> **Revision 1 — Access audience correction.** The original build validated a single
> `CF_ACCESS_AUD` for both surfaces. Two Access applications have two different AUD tags, so
> this revision splits the configuration into `CF_ACCESS_AUD_INTERNAL` (dashboard) and
> `CF_ACCESS_AUD_API` (internal API), removes the `INTERNAL_DEV_BYPASS` development bypass
> entirely, and adds `tests/access-auth.test.ts`. See §4.8, §6 and §7.2.
>
> **Revision 2 — owner-gated provisioning attempt (12 Nov 2026).** D1 binding, Access
> audiences and team domain are configured; the `RESEND_API_KEY` secret is confirmed on the
> Worker. Two items remain and block deployment: the API token cannot apply the D1 migration
> (missing D1 permission), and Resend domain verification is incomplete (SPF/MX not
> published). See §6.1, §7 and §9. **Not deployed.**

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

### 6.1 Owner-gated provisioning attempt — 12 November 2026

**D1 binding.** `wrangler.jsonc` now carries the production database:

- `binding` = `LEADS_DB`
- `database_name` = `bloomcore-leads-prod`
- `database_id` = `97c348f1-57b6-41cb-8d1c-33ea1b6c4955`

Migration review (`migrations/0001_init.sql`): a single migration, fully idempotent
(`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, `INSERT OR IGNORE`), no
`DROP`/`ALTER`/`DELETE`, foreign keys declared with `ON DELETE CASCADE`. Safe to apply.

`npx wrangler deploy --dry-run` resolved every binding correctly, including
`env.LEADS_DB (bloomcore-leads-prod)`.

**Production migration — BLOCKED.** `npx wrangler d1 migrations apply LEADS_DB --remote`
(and `list`) fail before touching the schema:

```
/accounts/da77cc158dfdf586558f4f81a059a23d/d1/database/97c348f1-57b6-41cb-8d1c-33ea1b6c4955/query
The given account is not valid or is not authorized to access this service [code: 7403]
```

`npx wrangler d1 list` separately returns `Authentication error [code: 10000]`. The command
resolves to the correct named database (the failing URL names it), so this is purely a token
permission gap, not a wrong target. Required permission: **D1 Edit** (add **D1 Read** for
`d1 list`). Not bypassed.

**Local migration + end-to-end (local D1, this run).** `npx wrangler d1 migrations apply
LEADS_DB --local` applied `0001_init.sql` (`22 commands executed successfully`). Through the
OpenNext Worker preview:

| Test | Result |
| --- | --- |
| `POST /api/enquiries` (product-specific, valid) | 200 `{"ok":true,"duplicate":false,"leadNumber":"BC-2026-000001",...}` |
| Same `Idempotency-Key` resubmitted | 200 `duplicate:true` — one lead row |
| `GET /api/enquiries` | 405 |
| `GET /api/internal/leads`, `/metrics` | 401 (fail closed) |
| `GET /internal/leads` (anonymous) | sign-in prompt, `leaksLead=False leaksEmail=False` |
| `GET /` | 200 |

Persisted rows: 1 lead; 3 notifications (`new_enquiry`/email `pending`, `acknowledgement`/email
`pending`, `new_enquiry`/dashboard `sent`); 1 `created` activity. Email rows stay `pending`
locally because no Resend key is configured locally — the lead is never lost. All local QA rows
were then deleted; local D1 is empty again.

**Cloudflare Access — verified active at the edge.** Requesting the protected paths returns
`302` to the Access login for the correct application, confirming both applications exist,
cover the base path and descendants, and use distinct audiences:

| Request | Result | `kid` in login redirect |
| --- | --- | --- |
| `GET /internal` | 302 | `e539cbafaba1…` (dashboard AUD) |
| `GET /internal/leads` | 302 | `e539cbafaba1…` |
| `GET /api/internal` | 302 | `3ce614a6d610…` (API AUD) |
| `GET /api/internal/leads` | 302 | `3ce614a6d610…` |

Team domain: `https://red-boat-3eb2.cloudflareaccess.com`.

**Resend.** `npx wrangler secret list --name bloomcore-technologies-page` shows
`RESEND_API_KEY` (`secret_text`) on the correct Worker. DNS (Cloudflare DoH):

- `resend._domainkey.bloomcoretech.com` → DKIM key present.
- `resend._domainkey.notify.bloomcoretech.com` → DKIM key present.
- `notify.bloomcoretech.com` → **no SPF TXT**, **no MX**.
- `bloomcoretech.com` → **no SPF TXT** (only `google-site-verification`), **no MX**.
- `_dmarc.bloomcoretech.com` → `v=DMARC1; p=none;` (present, untouched).
- `send.bloomcoretech.com` → Cloudflare Email Routing (`send.forge.rmta.net`); not Resend.

Domain verification is therefore **incomplete**: the DKIM key exists but the SPF (and the
feedback MX Resend expects) are missing. No real email was sent, so delivery is **not**
claimed.

## 7. Owner action checklist

These are the only remaining steps to go live. The code is complete and committed on
`feat/lead-management-foundation`; it is **not** deployed.

### 7.1 Cloudflare D1

1. ~~Create the database in the dashboard~~ — done (`bloomcore-leads-prod`).
2. ~~Set the `database_id`~~ — done (`97c348f1-57b6-41cb-8d1c-33ea1b6c4955` in `wrangler.jsonc`).
3. **Remaining:** grant the API token the **D1: Edit** permission (add **D1: Read** for
   `d1 list`), then run `npx wrangler d1 migrations apply LEADS_DB --remote`. This currently
   fails with `code: 7403` / `code: 10000` because the token cannot access D1. The command
   already resolves to the correct named database, so this is a permission gap only — not
   bypassed.

### 7.2 Cloudflare Access

**Done and verified at the edge.** Two self-hosted applications exist on `bloomcoretech.com`,
each covering the base path and descendants, with distinct audiences:

| Surface | Paths | Worker var | AUD |
| --- | --- | --- | --- |
| Dashboard | `/internal`, `/internal/*` | `CF_ACCESS_AUD_INTERNAL` | `e539cbafaba15f541c87c642f59101df19ef50b568e85d6b418be6c3f61af72b` |
| Internal API | `/api/internal`, `/api/internal/*` | `CF_ACCESS_AUD_API` | `3ce614a6d610b892ffc0ff9ccedc07525c12e251c0373d5f9cf2adf917ffd991` |

- `CF_ACCESS_TEAM_DOMAIN` = `https://red-boat-3eb2.cloudflareaccess.com`
- `INTERNAL_ALLOWED_EMAILS` = `bloomcoretechnologies@gmail.com`

Remaining owner confirmation (cannot be read with the current token — Zero Trust API returns
403): confirm each application's policy is **Allow → email `bloomcoretechnologies@gmail.com`**,
deny by default, finite session, and MFA on the owner identity. Optionally add an Access
application for the `*.workers.dev` hostname too (defence in depth).

### 7.3 Resend (email)

1. ~~Upload the API key~~ — done; `RESEND_API_KEY` is present on `bloomcore-technologies-page`.
2. **Remaining:** finish domain verification by publishing the exact DNS records Resend shows
   for the sending domain. DNS currently has the DKIM key but **no SPF TXT and no MX** on
   `bloomcoretech.com` and on `notify.bloomcoretech.com`. Typical Resend records (use the
   values in the Resend dashboard):
   - `notify` (or apex) TXT: `v=spf1 include:amazonses.com ~all`
   - `notify` (or apex) MX: `feedback-smtp.<region>.amazonses.com` priority 10
   Do not alter the existing apex MX/SPF/DMARC or the Cloudflare Email Routing records on
   `send.bloomcoretech.com`.
3. `EMAIL_FROM` is set to the owner's preferred sender
   `BloomCore Technologies <notifications@notify.bloomcoretech.com>`; `EMAIL_REPLY_TO` and
   `LEAD_NOTIFICATION_EMAIL` remain `bloomcoretechnologies@gmail.com`. Change `EMAIL_FROM` if
   Resend verifies a different domain.

### 7.4 Deploy

`npx opennextjs-cloudflare build && npx wrangler deploy`. **Blocked, not executed.** Do not
deploy until 7.1 (production migration) and 7.3 (email verification) are complete: deploying
now would expose `POST /api/enquiries` against a database with no schema, and email delivery
would be rejected. All other prerequisites (bindings, Access, secret, build) are in place.

## 8. Netlify caveat

`next.config.ts` switches to `output: "export"` when `NETLIFY=true`. A static export cannot
contain route handlers, so the lead system cannot run on the Netlify fallback. The lead
system is **Cloudflare-only**. Never build a production Cloudflare deploy with `NETLIFY=true`.

## 9. Status

| Area | Status | Note |
| --- | --- | --- |
| Code, schema, tests, builds | GREEN | Type, lint, unit (28), Next, OpenNext and `wrangler deploy --dry-run` all pass. |
| Local end-to-end behaviour | GREEN | Verified against local D1 and the Worker preview, including fail-closed auth. |
| Production D1 | AMBER | Binding and id configured, migration reviewed; `migrations apply --remote` blocked by missing **D1: Edit** (`code: 7403`). |
| Cloudflare Access | GREEN | Both apps verified live at the edge with distinct AUDs; team domain set. Owner to confirm policy/MFA (dashboard-side). |
| Resend email | AMBER | `RESEND_API_KEY` present on the Worker; DKIM published but SPF/MX missing, so domain verification is incomplete. |
| Public site, SEO, analytics | GREEN | Routes unchanged; GTM/GA4 and consent behaviour untouched. |

**Overall: AMBER — partially configured.** Not deployed. Remaining owner actions: grant D1
Edit/Read and run the migration; finish Resend domain verification (SPF + MX). No production
change has been made. No DNS, subscription or purchase action was taken.

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
`tests/domain.test.ts`, `tests/access-auth.test.ts`, `docs/plans/lead-management-foundation.md`,
`docs/reports/BLOOMCORE-LEAD-MANAGEMENT-FOUNDATION-REPORT.md`.

**Moved:** all public pages under `src/app/(site)/` (URLs unchanged).

**Modified:** `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/robots.ts`,
`src/components/ContactForm.tsx`, `src/components/QuickEnquiry.tsx`,
`src/components/ProductPageShell.tsx`, `wrangler.jsonc`, `package.json`, `tsconfig.json`.

**Untouched:** `src/lib/analytics.ts`, all brand/SEO helpers, all public page content except
the contact and privacy copy that described the old `mailto:` behaviour.
