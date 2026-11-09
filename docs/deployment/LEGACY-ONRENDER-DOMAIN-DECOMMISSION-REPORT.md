# Legacy `onrender.com` hostname decommission report

Date: 9 November 2026
Repository: `Delkay-byte/BloomCore-Technologies` (this document)
Scope: SchemeKnit, MaaCash, TillProof and the shared BloomCore-One service
Change type: production configuration and Render subdomain policy

## A. Executive summary

One legacy hostname is retired. Three are retained because a production
dependency still points at them. TillProof has no deployment to retire.

| Hostname | Service | Status |
| --- | --- | --- |
| `schemeknit-frontend.onrender.com` | `schemeknit-frontend` | **Decommissioned** (404) |
| `schemeknit-api.onrender.com` | `schemeknit-api` | **Retained** (blocked) |
| `maacash.onrender.com` | `maacash` | **Retained** (blocked) |
| `bloomcore-one.onrender.com` | `bloomcore-one` | **Retained** (blocked) |
| `tillproof.bloomcoretech.com` | none | **Not deployed** |

No Render service, database, disk, environment variable, worker, cron job or
custom domain was deleted. No secret was printed. No DNS record was changed,
because this workspace has no write access to the Cloudflare zone.

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
| `bloomcore-one` | `srv-dbjalrk9v7es739ifkp0` | web | `enabled` | none |
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

Retained. Reasons:

1. MaaCash stores offline records in origin-scoped IndexedDB. Existing users
   with unsent records on the old origin lose access to those records if the
   origin stops resolving. The MaaCash migration report requires explicit owner
   confirmation before retirement.
2. The Paystack webhook for the MaaCash payment route still targets
   `https://bloomcore-one.onrender.com/api/payments/paystack/webhook`, and the
   dashboard cannot be read or changed from this workspace.
3. `maacash` has no branded API hostname. Its branded web host
   `maacash.bloomcoretech.com` is verified and live.

Required before retirement:

- Owner sign-off on the offline record loss.
- A migration or drain path for pending IndexedDB records.
- Webhook migration and a verified test event.
- Then disable the subdomain.

### G.3 `bloomcore-one.onrender.com`

Retained. Reasons:

1. The service has no custom domain. Disabling its subdomain would leave it with
   no public endpoint at all.
2. It hosts the Paystack webhook route used by the payment flow.
3. It shares the origin-scoped storage concern described in G.2.

Required before retirement:

- Add a branded custom domain, for example `one.bloomcoretech.com`.
- Create the DNS record in section H.
- Migrate the webhook and verify it.
- Then disable the subdomain.

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
| CNAME | `one` | `bloomcore-one.onrender.com` | DNS only | Branded BloomCore-One host |
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
3. Migrate both Paystack webhook targets and verify a test event each.
4. Obtain owner confirmation for the MaaCash offline record loss.
5. Replace remaining SchemeKnit source references to the old hostnames:
   `README`, `.env.example`, `frontend/src/lib/site-url.ts`, signup copy,
   `frontend/next.config.js` CSP and the end-to-end test defaults.
6. Re-run this verification after each migration, then disable the next
   subdomain.

## K. References

- `src/lib/brand.ts` in this repository: branded product links.
- `docs/seo/PRODUCT-SUBDOMAIN-AND-ANALYTICS-REPORT.md`: earlier subdomain move.
- `BloomCore-One/docs/reports/MAACASH-CUSTOM-DOMAIN-MIGRATION-REPORT.md`:
  offline record blocker and old host retention.
- `BloomCore-One/render.yaml`: hostname contracts for `bloomcore-one` and
  `maacash`.
- `SchemeKnit/frontend/next.config.js`: CSP allowlist.
- `SchemeKnit/backend/src/routers/paystack.py`: webhook route.
