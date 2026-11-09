# Legacy `onrender.com` hostname decommission report

Date: 9 November 2026
Repository: `Delkay-byte/BloomCore-Technologies` (this document)
Scope: SchemeKnit, MaaCash, TillProof and the shared BloomCore-One service
Change type: production configuration and Render subdomain policy

## A. Executive summary

Two legacy hostnames are retired. Two are retained because a production
dependency still points at them. TillProof has no deployment to retire.

| Hostname | Service | Status |
| --- | --- | --- |
| `schemeknit-frontend.onrender.com` | `schemeknit-frontend` | **Decommissioned** (404) |
| `schemeknit-api.onrender.com` | `schemeknit-api` | **Retained** (blocked) |
| `maacash.onrender.com` | `maacash` | **Retained temporarily** (offline records) |
| `bloomcore-one.onrender.com` | `bloomcore-one` | **Decommissioned** (service deleted, 404) |
| `tillproof.bloomcoretech.com` | none | **Not deployed** |

No Render database, disk, environment variable, worker, cron job or custom
domain was deleted. The duplicate `bloomcore-one` web service was deleted after
its responsibilities were migrated; see section M. No secret was printed. No
DNS record was changed, because this workspace has no write access to the
Cloudflare zone.

Branded endpoints remain live:

- `https://schemeknit.bloomcoretech.com/` returns `200`.
- `https://schemeknit.bloomcoretech.com/login/` returns `200`.
- `https://schemeknit-api.onrender.com/api/health` returns `200`.
- `https://maacash.bloomcoretech.com/` returns `200`.
- `https://bloomcore-one.onrender.com/` returns `200`.

## B. Scope and constraints

In scope:

- Render service inventory and custom domain verification state.
- Render subdomain policy per service.
- Production environment variables that contain public origins.
- Live checks for DNS, TLS, HTTP, CORS, authentication and payment routes.
- Written record of what was changed and what remains blocked.

Out of scope and untouched:

- Deletion or suspension of any Render resource.
- DNS record creation or deletion.
- Paystack dashboard configuration.
- Application source changes in the SchemeKnit, MaaCash or TillProof
  repositories.

Constraints applied:

- A hostname is disabled only when no production dependency still points at it.
- A valid CNAME target that ends in `.onrender.com` is preserved. Such a record
  is a correct target, not a legacy link.
- No blind search and replace of URLs.
- TillProof is not described as publicly ready.

## C. Service inventory

Inventory read from the Render API on 9 November 2026.

| Service | ID | Type | Subdomain policy | Custom domain |
| --- | --- | --- | --- | --- |
| `schemeknit-frontend` | `srv-damt6sjm8hqs7398lfl0` | web | `disabled` | `schemeknit.bloomcoretech.com` (verified) |
| `schemeknit-api` | `srv-damsbb1ntn7c73d7eg10` | web | `enabled` | none |
| `maacash` | `srv-dbnaciff3r2c7382tjgg` | web | `enabled` | `maacash.bloomcoretech.com` (verified) |
| `bloomcore-one` | `srv-dbjalrk9v7es739ifkp0` | web | deleted | none |
| `schemeknit-staging-frontend` | `srv-dbl5ors9v7es73caicpg` | web | `enabled` | none |
| `schemeknit-staging-api` | `srv-dbl5ore7bikc73f2stvg` | web | `enabled` | none |
| `bloomcore-one-staging` | `srv-dbl3vb3l550s73efh03g` | web | `enabled` | none |

All seven services report `not_suspended`. Other services in the account
(`bik-prestige-legacy`, `kwamoso-presby-basic-school`, `harvconnect-api`,
`queue-ease-ml-engine`) are outside this migration and were not modified.

## D. Pre-change verification

Before any change, these checks passed:

- Branded frontends returned `200`.
- API health endpoint returned `200`.
- TLS chain verification returned result `0` for the branded hosts.

## E. Changes made

### E.1 SchemeKnit production environment

Applied through the Render API, then both services were redeployed. Both are
live at commit `3c23e71`.

`schemeknit-api`:

- `CORS_ORIGINS` = `["https://schemeknit.bloomcoretech.com","https://schemeknit-frontend.onrender.com"]`
- `PUBLIC_WEB_URL` = `https://schemeknit.bloomcoretech.com`
- `TURNSTILE_ALLOWED_HOSTNAMES` = `schemeknit.bloomcoretech.com,schemeknit-frontend.onrender.com`

`schemeknit-frontend`:

- `NEXT_PUBLIC_SITE_URL` = `https://schemeknit.bloomcoretech.com`

The old frontend origin stays in the CORS and Turnstile allowlists on purpose.
A browser tab that is still open on the old host can finish its request. The
allowlist entry is inert once the old host returns `404`.

### E.2 SchemeKnit frontend subdomain disabled

`schemeknit-frontend` subdomain policy was set to `disabled` only after the
branded frontend and the API were verified live.

Result:

| URL | Before | After |
| --- | --- | --- |
| `https://schemeknit-frontend.onrender.com/` | `200` | `404` |
| `https://schemeknit-frontend.onrender.com/login/` | `200` | `404` |
| `https://schemeknit.bloomcoretech.com/` | `200` | `200` |
| `https://schemeknit.bloomcoretech.com/login/` | `200` | `200` |
| `https://schemeknit-api.onrender.com/api/health` | `200` | `200` |

The `404` is the Render edge response for a disabled subdomain. It is the
expected result, not an application error.

### E.3 Reverted test on a staging service

`bloomcore-one-staging` subdomain policy was briefly set to `disabled` to
confirm the API behaviour. It was restored to `enabled` and verified `200` in
the same session. No staging hostname is retired.

## F. Post-change verification

SchemeKnit production:

- Branded frontend canonical and Open Graph URLs now use
  `https://schemeknit.bloomcoretech.com/`.
- No browser console errors on the branded site.
- Browser API calls to `schemeknit-api.onrender.com` return `200` with the
  expected CORS response header.
- `/api/health`, `/api/ready`, `/api/service-status` and
  `/api/auth/setup/status` all return `200`.
- Login preflight returns `200`.
- An invalid login `POST` returns `422`, which confirms validation runs before
  authentication.

Corporate site:

- `src/lib/brand.ts` links to branded product subdomains.
- No runtime `.onrender.com` links remain in the corporate site.
- The TillProof page states that the product is in development.

## G. Retained hostnames and blockers

### G.1 `schemeknit-api.onrender.com`

Retained. Reasons:

1. Render refuses a third custom domain on the account with
   `a payment method is required to add more than 2 custom domains`. The
   service therefore has no branded API hostname.
2. The Paystack dashboard is logged out. Paystack exposes no API to read or
   update the dashboard webhook URL, so the webhook target cannot be confirmed
   or migrated from this workspace.
3. The SchemeKnit frontend CSP in `frontend/next.config.js` still allows
   `schemeknit-api.onrender.com`. Changing that before the API has a branded
   host would break API calls.

Required before retirement:

- Add `api.schemeknit.bloomcoretech.com` as a custom domain on
  `schemeknit-api`.
- Create the DNS record in section H.
- Point the Paystack webhook at the branded API host and verify a test event.
- Replace `NEXT_PUBLIC_API_URL` and the CSP `connect-src` entry.
- Redeploy, verify the full SchemeKnit flow, then disable the subdomain.

### G.2 `maacash.onrender.com`

Retained temporarily. Reason:

1. MaaCash stores offline records in origin-scoped IndexedDB. Two devices are
   enrolled in production and both have `lastSyncAt: null`, so unsent records
   may still exist on the old origin. The origin stops resolving only after the
   owner confirms those records are synchronized.

Resolved since the first report:

- The Paystack webhook does not target `bloomcore-one.onrender.com`. The live
  dashboard webhook is `https://schemeknit-api.onrender.com/api/paystack/webhook`
  for the shared integration `2081654`. A MaaCash endpoint now also exists; see
  section M.C.
- A migration page (`/migrate`) drains pending records through the existing
  authenticated sync route before the origin retires.

Required before retirement:

- Owner or device-holder confirmation that the two enrolled devices have
  synchronized, or an explicit acceptance of local record loss.
- Then set `renderSubdomainPolicy: disabled` on `maacash` and confirm `404`.

### G.3 `bloomcore-one.onrender.com`

Decommissioned. The duplicate `bloomcore-one` web service
(`srv-dbjalrk9v7es739ifkp0`) was deleted after verification. The hostname now
returns `404` and no longer serves the application. It had no custom domain, no
Render Postgres, no disk and no live Paystack target. The Neon database it shared
with `maacash` is preserved. See section M.G.

### G.4 TillProof

Not deployed. There is no Render service, no DNS record and no branded
environment. `https://tillproof.bloomcoretech.com` does not resolve, and the
TillProof repository has no Render configuration. Its README states that it is
not an approved production deployment. There is no hostname to decommission,
and TillProof is not publicly ready.

## H. DNS records still required

These records are pending. The Cloudflare token available here can read zones
but cannot read or write DNS records, and the dashboard session is logged out.
Create each record in the Cloudflare zone for `bloomcoretech.com`.

| Type | Name | Target | Proxy | Purpose |
| --- | --- | --- | --- | --- |
| CNAME | `api.schemeknit` | `schemeknit-api.onrender.com` | DNS only | Branded SchemeKnit API |
| CNAME | `api.maacash` | `maacash.onrender.com` | DNS only | Optional branded MaaCash API |

Use DNS only, not proxied. Render terminates TLS for the custom domain and
issues the certificate after the domain is added in the Render dashboard.

Each Render custom domain must be added in the dashboard before the DNS record
is created. `api.schemeknit` is currently blocked by the account custom domain
limit described in G.1.

## I. Rollback

Every change is reversible without data loss.

Restore a disabled subdomain:

```bash
curl -X PATCH "https://api.render.com/v1/services/<SERVICE_ID>" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"serviceDetails":{"renderSubdomainPolicy":"enabled"}}'
```

Restore the previous SchemeKnit environment values from the Render dashboard
history, then redeploy. The previous values are recorded in section E.1.

## J. Remaining work

1. Add a payment method or reduce the custom domain count so
   `api.schemeknit.bloomcoretech.com` can be added.
2. Create the DNS records in section H.
3. Migrate the SchemeKnit Paystack webhook target and verify a test event.
   The MaaCash webhook is migrated and verified; see section M.C.
4. Obtain owner confirmation that the two enrolled MaaCash devices have
   synchronized, then disable `maacash.onrender.com`.
5. Replace remaining SchemeKnit source references to the old hostnames:
   `README`, `.env.example`, `frontend/src/lib/site-url.ts`, signup copy,
   `frontend/next.config.js` CSP and the end-to-end test defaults.
6. Re-run this verification after each migration, then disable the next
   subdomain.

## M. MaaCash infrastructure consolidation (9 November 2026)

This part supersedes the MaaCash findings in sections G.2 and G.3. It records the
completed consolidation of MaaCash onto `https://maacash.bloomcoretech.com`.

### M.A. Identity consolidation

BloomCore One was the former product identity of MaaCash. It was not a separate
product, a separate customer base or a separate dataset. Both Render services
ran the same repository (`Delkay-byte/BloomCore-One`), the same branch (`main`)
and the same Neon PostgreSQL database. The product rename changed the public
identity only; accounts, transactions and financial history are unchanged.

The `bloomcore-one` string remains in three internal contracts and was
deliberately not renamed:

- JWT issuer and audiences (`bloomcore-one`, `bloomcore-one:session`,
  `bloomcore-one:workspace-selection`, `bloomcore-one:platform`,
  `bloomcore-one:mfa-challenge`).
- The Control Center OIDC product slug (`PRODUCT_SLUG = "bloomcore-one"`).
- Historical documentation, reports and database identifiers.

Renaming those without a coordinated migration would invalidate live sessions
and the registered OIDC product.

### M.B. Render service inventory

| Resource | ID | Final state |
| --- | --- | --- |
| `maacash` web service | `srv-dbnaciff3r2c7382tjgg` | Active, canonical |
| `bloomcore-one` web service | `srv-dbjalrk9v7es739ifkp0` | **Deleted** |
| Neon PostgreSQL (external) | `ep-lively-mode-b4jimg0y-pooler...` | Preserved, shared |
| Render Postgres | none | Not used |
| Persistent disks | none | Not used |

Both web services were `web_service` type, `oregon` region, `free` plan, branch
`main`, repository `https://github.com/Delkay-byte/BloomCore-One`.
`bloomcore-one` had no custom domain. Its last live deployment was
`dep-dbp1fkd9el5s739po52g` at commit `7a35b15`.

The canonical service exposes one verified custom domain,
`maacash.bloomcoretech.com` (`cdm-dboefs6c6qcc73de4ijg`), and keeps
`renderSubdomainPolicy: enabled` for the transition address.

### M.C. Webhook migration

The first report was wrong about the webhook target. Live verification through
the Paystack Webhook Events API showed:

- Live integration: `2081654`, shared with SchemeKnit.
- Previous dashboard webhook URL:
  `https://schemeknit-api.onrender.com/api/paystack/webhook`.
- Last recorded delivery: `charge.success` event
  `6aeb6c3512cc761e035f3e54`, status `Delivered`, response `200`, on
  4 November 2026.
- No event was delivered to `bloomcore-one.onrender.com`.

A dedicated MaaCash endpoint was then created through the Webhook Endpoints API:

| Field | Value |
| --- | --- |
| Code | `WHK_ec82ce0e` |
| Name | MaaCash production |
| URL | `https://maacash.bloomcoretech.com/api/payments/paystack/webhook` |
| Enabled | yes |
| Events | `charge.success`, `charge.failed`, `refund.processed`, `refund.pending`, `refund.failed`, `subscription.create`, `subscription.disable`, `subscription.not_renew`, `invoice.payment_failed` |

Verification performed:

- `POST /integration/webhooks/endpoints/WHK_ec82ce0e/ping` returned
  `ok: true`, `http_status: 200`, `latency_ms: 1103`.
- An unsigned request to the branded route returned `401` with
  `decision: invalid_signature`.
- Two identical signed `charge.success` events with the same reference were
  posted. Both returned `200` with `decision: ignored`, and exactly one
  `ZeliPaymentEvent` row was written. Duplicate protection held.
- The unknown-reference probe was recorded as `ignored / unknown_reference`, so
  events from the shared SchemeKnit integration do not grant MaaCash value.
- `/api/health` and `/api/health/ready` returned `200` with
  `app: "maacash"` and commit `a7f8026`.

The handler was not changed. It still verifies `x-paystack-signature` as an
HMAC-SHA512 of the raw body, uses the canonical event id for idempotency and
fulfils only a matching subscription reference.

Test-mode configuration was not verified: no test secret key is available in
this workspace and the Paystack dashboard session is logged out. This is
recorded as an owner action in M.I.

### M.D. Offline data migration

Origin-scoped storage discovered:

- Per-account IndexedDB database name
  `bik-prestige-offline:v2:<tenantId>:<userId>`, with a legacy name
  `bik-prestige-offline`.
- Object stores: `transactions` (unique `idempotencyKey` index), `customers`,
  `drafts` and `meta`.
- Device trust database `bloomcore-offline-device:v1`, store `state`.
- The queue is not encrypted; it is ordinary browser storage, and the UI says
  so.

Production state at migration time:

- 2 active `DeviceEnrollment` rows, tenants `BIK-HQ-001` (collector) and
  `BT-27HT2U` (worker).
- Both have `lastSyncAt: null`, so unsynchronized local records may exist.
- 0 server-side `OfflineTransaction` rows, so no queued record was ever synced.

Design implemented:

- A new `/migrate` page runs on the old origin and reads only the signed-in
  user's scoped database.
- It reports pending, syncing, confirmed and failed counts.
- "Synchronize now" calls the existing `syncPendingTransactions()`, which posts
  each record to `POST /api/offline/sync-contribution` with its original
  idempotency key.
- The page refuses to claim success while any record is unresolved. It never
  deletes local data and never moves data across origins.
- On the branded origin the page states that it cannot read the old origin's
  IndexedDB and links back to the old address.
- The transition notice on `maacash.onrender.com` now links to `/migrate`.

Limitations:

- JavaScript on `maacash.bloomcoretech.com` cannot read
  `maacash.onrender.com` IndexedDB. Migration must run on the old origin, by
  each account that used that browser.
- A device that never reopens the old origin while online remains unmigrated.
- Enrollment records do not store the origin a device used. Deletion of the
  `bloomcore-one` service therefore relies on the absence of any evidence that
  devices used that host, plus the explicit owner authorization for that
  deletion. The primary documented old origin, `maacash.onrender.com`, stays
  live.

### M.E. Branded application migration

Updated in `Delkay-byte/BloomCore-One`:

- `SITE_URL`, `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` are
  `https://maacash.bloomcoretech.com`.
- `TURNSTILE_ALLOWED_HOSTNAMES` is now
  `maacash.bloomcoretech.com,maacash.onrender.com`, in Render and in the
  Turnstile defaults.
- `bloomcore-one.onrender.com` was removed from `LEGACY_PUBLIC_HOSTNAMES`, the
  Turnstile defaults, `render.yaml` and `.env.example`.
- Health endpoints report `app: "maacash"`.
- `render.yaml` now describes only the `maacash` service.
- README, runbook and pilot onboarding point at the branded origin.

Production checks after deployment `dep-dbp4ptrrjlhs73erjni0` (commit
`a7f8026`) and the follow-up deployment `dep-dbp4uh3bc2fs7395j6sg` (commit
`12cfaa7`):

| Check | Result |
| --- | --- |
| `GET /api/health` | `200`, `app: maacash`, correct commit |
| `GET /api/health/ready` | `200`, database `ok` |
| `GET /` | `200` |
| `GET /login` | `200`, title starts with MaaCash |
| `GET /migrate` | `200` after the middleware fix |
| `GET /manifest.json` | `200`, MaaCash name and icons |
| `GET /robots.txt` | `200` |
| `POST /api/offline/sync-contribution` | `405` on GET, route present |
| `POST /api/payments/paystack/webhook` | `401` invalid signature, `200` signed |

No service worker is registered by this application, so there is no
service-worker cache to migrate.

### M.F. Old MaaCash hostname retirement

`maacash.onrender.com` is **retained temporarily**.

- Previous policy: `enabled`.
- Current policy: `enabled`.
- `GET https://maacash.onrender.com/` returns `200` and renders the migration
  notice.
- `GET https://maacash.bloomcoretech.com/` returns `200` without the notice.

It is not disabled because the two enrolled devices have never synchronized and
no server-side record proves their local queues are empty. Disabling it now
could strand financial records on that origin. The supported retirement step is:

```bash
curl -X PATCH "https://api.render.com/v1/services/srv-dbnaciff3r2c7382tjgg" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"serviceDetails":{"renderSubdomainPolicy":"disabled"}}'
```

The CNAME from `maacash.bloomcoretech.com` to Render is unchanged.

### M.G. BloomCore One deletion

| Item | Value |
| --- | --- |
| Service name | `bloomcore-one` |
| Service ID | `srv-dbjalrk9v7es739ifkp0` |
| Final deployment | `dep-dbp1fkd9el5s739po52g`, commit `7a35b15` |
| Custom domains | none |
| Render Postgres | none |
| Disks | none |

Former responsibilities and how each was cleared:

- Payment webhook host: not a live Paystack target. A MaaCash endpoint now
  exists and responds correctly.
- Application runtime: duplicate of `maacash`, same repository and commit
  history, same database.
- Authentication callbacks: no external integration referenced its hostname;
  internal JWT/OIDC identifiers are not hostnames.
- Background or scheduled jobs: none attached to the service.

Evidence was captured before deletion in a sanitized JSON file containing the
service metadata, final deployment, environment key names and custom-domain
list. No secret value was stored.

Deletion: `DELETE /v1/services/srv-dbjalrk9v7es739ifkp0` returned `204`.
Afterwards:

- `GET /v1/services/srv-dbjalrk9v7es739ifkp0` returned `404`.
- `https://bloomcore-one.onrender.com/` returned `404`.
- `https://bloomcore-one.onrender.com/api/health` returned `404`.
- The Neon database still reports the same row counts: 2 active devices and 0
  offline transactions.

### M.H. Repository and deployment changes

| Item | Value |
| --- | --- |
| Repository | `Delkay-byte/BloomCore-One` |
| Branch | `main` |
| PR #35 | Consolidate canonical infrastructure and offline migration |
| Merge commit | `a7f8026` |
| PR #36 | Keep the offline migration page public |
| Merge commit | `12cfaa7` |
| Production deployments | `dep-dbp4ptrrjlhs73erjni0` (`a7f8026`), `dep-dbp4uh3bc2fs7395j6sg` (`12cfaa7`) |

Checks run locally on PR #35: `npm run typecheck`, `npm run lint` (0 errors,
70 pre-existing warnings), `npm test` (73 files, 737 tests) and `npm run build`.

CI on both PRs: SQLite lint/typecheck/test/build, PostgreSQL migration rehearsal
and integration tests, and mobile browser/offline-shell tests all passed.

The authenticated production browser walkthrough (login, dashboard, offline
queue preparation) was not executed because no production credentials are
available in this workspace. CI browser tests and the unauthenticated route
checks above are the available evidence.

### M.I. Outstanding blockers

1. `maacash.onrender.com` stays enabled until the owner confirms the two
   enrolled devices have synchronized, or accepts local record loss.
2. Paystack test-mode webhook configuration is unverified: no test secret key
   and the dashboard session is logged out.
3. The legacy Paystack dashboard URL
   (`schemeknit-api.onrender.com/api/paystack/webhook`) remains for SchemeKnit;
   the API cannot clear it. MaaCash now also receives its events through
   `WHK_ec82ce0e`.
4. One authenticated production walkthrough remains an owner action.
5. If any device used `bloomcore-one.onrender.com` for offline storage, that
   origin can no longer be read. Enrollment records do not record origins. No
   evidence of such use was found, and the deletion was explicitly authorized.

### M.J. Final status

| Target | Status | Reason |
| --- | --- | --- |
| `https://maacash.bloomcoretech.com` | **COMPLETED** | Serves `200`, healthy, correct commit |
| MaaCash Paystack webhook | **COMPLETED** | `WHK_ec82ce0e` enabled, ping `200`, duplicate-safe |
| Offline migration mechanism | **COMPLETED** | `/migrate` drains through the existing idempotent sync route |
| `bloomcore-one` Render service | **COMPLETED** | Deleted, API and hostname return `404` |
| `bloomcore-one.onrender.com` | **COMPLETED** | No longer serves the application |
| `maacash.onrender.com` | **RETAINED TEMPORARILY** | Two devices never synchronized |
| Paystack test-mode webhook | **BLOCKED** | No test key, dashboard logged out |
| MaaCash database and records | **COMPLETED** | Neon preserved, row counts unchanged |
| Canonical `maacash` service | **COMPLETED** | Active, no billing or plan change |

## N. References

- `src/lib/brand.ts` in this repository: branded product links.
- `docs/seo/PRODUCT-SUBDOMAIN-AND-ANALYTICS-REPORT.md`: earlier subdomain move.
- `BloomCore-One/docs/reports/MAACASH-CUSTOM-DOMAIN-MIGRATION-REPORT.md`:
  offline record blocker and old host retention.
- `BloomCore-One/render.yaml`: canonical `maacash` blueprint.
- `BloomCore-One/src/app/migrate/page.tsx`: old-origin offline migration page.
- `SchemeKnit/frontend/next.config.js`: CSP allowlist.
- `SchemeKnit/backend/src/routers/paystack.py`: webhook route.
