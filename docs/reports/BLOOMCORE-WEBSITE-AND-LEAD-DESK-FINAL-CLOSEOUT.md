# BloomCore Website and Lead Desk — Final Closeout

**Date:** 13 November 2026  
**Repository:** `Delkay-byte/BloomCore-Technologies`  
**Production domain:** `https://bloomcoretech.com`  
**Worker:** `bloomcore-technologies-page`  
**Status:** **GREEN — BloomCore website and Lead Desk released and verified.**

---

## 1. Summary

The BloomCore public website and the multi-user Lead Desk are released to production. The reported production defect — `/internal/leads/staff` returning 404 — is fixed and verified. The fix is deployed on `main`, and the server-side role boundaries for the owner, staff member and read-only accountant were exercised end to end against the built Worker and a local D1 database.

Production data was not modified during this closeout:

| Check | Value |
| --- | --- |
| Leads | `0` |
| Staff rows | `0` |
| Notifications | `0` |
| `lead_number` sequence | `6` |

These values were read with `wrangler d1 execute LEADS_DB --remote` and the query reported `"changed_db": false`, `"rows_written": 0`.

No production lead, staff account, Access policy, DNS record, email setting or unrelated repository was changed.

---

## 2. Released revision and deployment

| Item | Value |
| --- | --- |
| Merge commit on `main` | `b47c05df3747f40d1e53a72e06abec36e28f8d7e` |
| Defect-fix commit | `02d03a81ea839711460129640ce103304ae928a0` |
| Multi-user Lead Desk commit | `c4daa1d32e3071ff0512e88fe6bbec4986ae89b4` |
| Pull request | `#1`, merged 2026-11-13 15:42:46 UTC |
| Worker deployment ID | `5f3a9f1d-a2b4-46fb-abf7-82130d169619` |
| Worker version | `b00d7a0a-a58d-4e40-9a2c-a9fb85e83367` at 100% |
| Deployed at | 2026-11-13 15:45:37 UTC |

The deployed Worker was built from `main` with `npx opennextjs-cloudflare build` and released with `npx wrangler deploy`. Production `wrangler whoami` does not work because no API token is configured, but `wrangler deploy`, `wrangler deployments list` and D1 commands all work through the owner OAuth session.

---

## 3. Production route verification

Tested anonymously against `https://bloomcoretech.com` after deployment.

### Public website

| Route | Result |
| --- | --- |
| `/` | `200` |
| `/about` | `200` |
| `/services` | `200` |
| `/products` | `200` |
| `/products/maacash` | `200` |
| `/products/schemeknit` | `200` |
| `/products/tillproof` | `200` |
| `/work` | `200` |
| `/contact` | `200` |
| `/resources` | `200` |
| `/resources/mobile-money-business-recordkeeping` | `200` |
| `/privacy` | `200` |
| `/founder` | `200` |
| `/sitemap.xml` | `200` |
| `/robots.txt` | `200` |

### Console and API boundaries

Every console route and every internal API route is behind Cloudflare Access. Unauthenticated requests redirect to the Access login page with the expected application audience.

| Route | Result | Access application |
| --- | --- | --- |
| `/internal` | `302` | dashboard `kid=e539cbaf…` |
| `/internal/leads` | `302` | dashboard `kid=e539cbaf…` |
| `/internal/staff` | `302` | dashboard `kid=e539cbaf…` |
| `/internal/leads/staff` | `302` | dashboard `kid=e539cbaf…` |
| `/internal/notifications` | `302` | dashboard `kid=e539cbaf…` |
| `/internal/api/leads` | `302` | dashboard `kid=e539cbaf…` |
| `/internal/api/staff` | `302` | dashboard `kid=e539cbaf…` |
| `/api/internal/leads` | `302` | internal API `kid=3ce614a6…` |

The previously failing legacy URL `/internal/leads/staff` now returns `302` to Access and resolves to the canonical staff page after authentication. It no longer reaches the dynamic lead-detail route and no longer renders a 404.

`GET /api/enquiries` returns `405`, which is expected because the public enquiry endpoint only accepts `POST`.

---

## 4. Defects fixed

1. **Staff URL 404.** `/internal/leads/staff` matched the dynamic `[id]` route and called `notFound()`. A static alias page now redirects the legacy URL to `/internal/staff`.
2. **Internal 404 chrome.** Unknown or deleted records now render `src/app/internal/not-found.tsx` inside the console layout instead of the public site 404.
3. **Owner-row escalation.** A staff row that stores `role=owner` no longer grants owner access unless the address is also present in the configured `LEAD_OWNER_EMAILS` allowlist.
4. **Accountant notification navigation.** The read-only accountant can open an unread notification with a plain link. The console no longer attempts the forbidden mark-read `PATCH` for that role.
5. **Follow-up after deactivation.** An unchanged assignment to a now-inactive worker no longer blocks editing the follow-up fields. New assignments to inactive workers are still rejected.
6. **Form input preservation.** The staff add form keeps entered values after a failed submission.
7. **Staff empty state.** The staff page shows a clear empty state when no accounts exist.
8. **JSON body normalisation.** Internal API routes normalise non-object JSON bodies instead of assuming an object.
9. **Notification query validation.** The notifications list endpoint validates `limit` and `unreadOnly` query parameters.

---

## 5. Role boundary verification

Roles are enforced on the server. Hiding a control in the browser is not treated as authorisation.

| Capability | Owner | Staff member | Read-only accountant |
| --- | --- | --- | --- |
| View all leads | Yes | No, only assigned leads | Yes |
| View lead detail | Yes | Assigned only | Yes |
| Edit follow-up fields | Yes | Assigned only | No |
| Assign or reassign a lead | Yes | No | No |
| Add notes | Yes | Assigned only | No |
| Export leads | Yes | No | No |
| Manage staff | Yes | No | No |
| Mark notifications read | Yes | Own only | No |
| Retry failed notifications | Yes | No | No |

Verified refusals returned HTTP `403`:

- Staff member calling `GET /api/internal/staff`.
- Staff member reassigning a lead.
- Accountant adding a note.
- Accountant editing a lead.
- Accountant calling `GET /api/internal/staff`.

Verified allowances:

- Staff member reading the assigned lead and updating its follow-up.
- Accountant reading every lead and opening an unread notification.
- Owner managing staff, assignments, notes, exports and notifications.

---

## 6. Build and test evidence

All commands ran from the repository root at `main` commit `b47c05d`.

| Gate | Command | Result |
| --- | --- | --- |
| Unit and integration tests | `npm test` | `140` passed, `0` failed |
| TypeScript | `npx tsc --noEmit` | Pass, no output |
| Lint | `npm run lint` | Pass, no output |
| Next production build | `npm run build` | Pass; `/internal/leads/staff` present in the route manifest |
| OpenNext bundle | `npx opennextjs-cloudflare build` | Pass; `.open-next/worker.js` created |
| Wrangler dry run | `npx wrangler deploy --dry-run` | Pass; D1, Worker, assets and variables resolved |
| Migration status | `npx wrangler d1 migrations list LEADS_DB --remote` | `No migrations to apply!` |

`0002_staff_and_assignment.sql` was already applied before this closeout and was not re-run.

---

## 7. Authenticated browser verification

Production has no interactive Cloudflare Access session available to this environment, so an authenticated owner journey could not be driven against `bloomcoretech.com`. Instead, the built OpenNext Worker was run locally with Wrangler and a local D1 database. Cloudflare Access was simulated with a locally generated RSA key pair, a local JWKS endpoint and signed Access JWTs carrying the configured audiences.

This exercises the same Worker bundle, the same route handlers, the same authentication code path and the same D1 schema as production. It does not exercise the Cloudflare Access edge itself.

### Main journey — 12 checks passed

1. Owner: `/internal/leads/staff` redirects to `/internal/staff` and shows the empty state.
2. Owner: adds a staff member through the console.
3. Owner: adds the read-only accountant; audit history records both accounts.
4. Public form: creates `BC-2026-000001` and `BC-2026-000002`.
5. Owner: assigns the first lead to the worker and persists the follow-up.
6. Assignment: queues a pending `assignment` notification for `worker@example.com` with no Resend key configured.
7. Worker: sees the assigned lead and not the unassigned lead.
8. Worker: staff management page refuses the worker.
9. Worker: server returns `403` for staff management and reassignment, `200` for an own follow-up update.
10. Accountant: reads every lead.
11. Accountant: opens an unread notification without a forbidden mark-read call.
12. Accountant: server refuses notes, lead edits and staff management.

### Deactivation journey — 3 checks passed

1. Owner deactivates the assigned worker.
2. Owner edits the follow-up while the inactive assignee remains unchanged.
3. Deactivated worker has no console or API access; `/internal/api/leads` returns `403`.

Representative browser screenshots were captured during the run but are local artefacts and are not committed.

---

## 8. Notification and outbox behaviour

Assignment creates a durable outbox row before any delivery attempt:

- `channel=email`, `recipient=worker@example.com`, `status=pending`, `attempt_count=0`.
- A companion `channel=dashboard` row is written as `sent`.
- Delivery drains only when `RESEND_API_KEY` is present.
- A drain failure never undoes the assignment; the row remains available to the owner retry control.

The local run verified the durable pending row and the dashboard row. It did not send real email because no Resend key was configured locally. Production email delivery was therefore not exercised in this closeout.

---

## 9. Production data and configuration

| Item | State |
| --- | --- |
| Production D1 database | `bloomcore-leads-prod`, `97c348f1-57b6-41cb-8d1c-33ea1b6c4955` |
| Applied migrations | `0001_init.sql`, `0002_staff_and_assignment.sql` |
| Leads | `0` |
| Staff | `0` |
| Notifications | `0` |
| Lead sequence | `6` |
| Owner email | `bloomcoretechnologies@gmail.com` via `LEAD_OWNER_EMAILS` |
| Access policies | Unchanged |
| DNS, SEO, favicon, analytics | Unchanged |
| Resend configuration | Unchanged |
| Public website design | Unchanged |

No test staff, leads or addresses were created in production.

---

## 10. Limitations

1. **No production authenticated browser session.** Cloudflare Access requires an interactive login that this environment does not have. The authenticated journey ran against the built Worker locally with signed Access JWTs, not against the production edge. Unauthenticated production routes and Access redirects were verified directly.
2. **No real production email delivery.** `RESEND_API_KEY` was not available locally, so the assignment email stayed in the durable outbox as `pending`. Production delivery must be confirmed by the owner on the first real assignment.
3. **No production data journey.** Creating production leads or staff would have changed live data, so the production database remains empty. The first real lead and first staff account will be the owner's live acceptance check.
4. **Local runtime restarts.** The local Wrangler runtime logged occasional crash-and-restart messages during long browser runs. The final complete runs passed all checks, and the production Worker is stable.

---

## 11. Final verification checklist

- [x] Defect fix committed to `main`.
- [x] Pull request merged.
- [x] Production Worker deployed from `main`.
- [x] Public routes return `200`.
- [x] Console routes and internal APIs redirect to Cloudflare Access.
- [x] `/internal/leads/staff` no longer returns `404`.
- [x] Server-side owner, staff and accountant boundaries verified.
- [x] Assignment outbox row created and durable.
- [x] Follow-up edit works with an inactive unchanged assignee.
- [x] Deactivated worker loses console and API access.
- [x] `140` tests pass.
- [x] Typecheck, lint, Next build, OpenNext build and Wrangler dry run pass.
- [x] Production D1 counts unchanged.
- [x] No Access policy, DNS or production data change.

**Final status: GREEN — BloomCore website and Lead Desk released and verified.**