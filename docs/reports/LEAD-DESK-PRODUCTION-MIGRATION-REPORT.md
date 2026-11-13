# BloomCore Lead Desk — Production Migration Report

**Date:** 13 November 2026  
**Scope:** Apply and verify `0002_staff_and_assignment.sql` on the production D1 database only.  
**Status:** **GREEN — Migration applied and production schema verified.**

## 1. Repository and revision

| Item | Value |
| --- | --- |
| Repository | `Delkay-byte/BloomCore-Technologies` |
| Working directory | BloomCore Web repository root |
| Branch | `fix/lead-management-defects` |
| Commit inspected | `c4daa1d32e3071ff0512e88fe6bbec4986ae89b4` |
| Remote branch | `origin/fix/lead-management-defects` at the same commit |
| Working tree before migration | Clean |

The branch was fetched and fast-forwarded from origin. Git reported `Already up to date.` at `c4daa1d`, which contains the multi-user staff and assignment implementation.

## 2. Migration review

**File:** `migrations/0002_staff_and_assignment.sql`  
**SHA-256:** `d4ed0905323ce4457b7d256c756ea8addef99b9d790aa432639aa78a2437cb66`

The migration was reviewed in full against `0001_init.sql`. It performs only additive schema work:

1. Adds `staff.active INTEGER NOT NULL DEFAULT 1`.
2. Adds `staff.updated_at TEXT`.
3. Backfills `staff.updated_at` from `created_at` where it is null.
4. Creates `staff_audit` with a foreign key to `staff(id)` and `ON DELETE CASCADE`.
5. Creates `idx_staff_audit_staff`.
6. Adds nullable `notifications.payload TEXT`.
7. Creates `idx_leads_assigned` on `leads(assigned_to)`.
8. Creates `idx_notifications_created` on `notifications(created_at DESC)`.

Review findings:

- **No destructive operations.** There is no `DROP`, `DELETE`, `TRUNCATE`, table rebuild or change to any existing lead value.
- **No lead writes.** The only statement referencing `leads` is the new index.
- **The only existing-row write** is the `staff.updated_at` backfill. It does not change staff identity, email, role or timestamps; it copies `created_at`. Production contained no staff rows at migration time.
- **Safe defaults.** `active` is non-null with default `1`, so any existing staff row would remain active. `updated_at` and `payload` are nullable and do not break existing inserts.
- **Compatible with `0001`.** The referenced `staff`, `notifications` and `leads` tables and their columns all exist in the applied initial schema. The new foreign-key target `staff(id)` is the existing primary key.
- **Non-idempotent by design.** The two `ALTER TABLE ... ADD COLUMN` statements cannot be re-run safely. D1 migration tracking was used, rather than direct SQL or manual history edits.

No migration defect was found. The file was **not modified**.

## 3. Cloudflare account and database target

The shell had `CLOUDFLARE_API_TOKEN` set, so it was unset for every Wrangler command (`env -u CLOUDFLARE_API_TOKEN`). Wrangler then used the existing OAuth session rather than the token that previously returned error `7403`. No token value was read, printed or recorded.

`npx wrangler whoami` confirmed:

- Wrangler version: `4.160.0`
- Authentication: OAuth session for the BloomCore owner account
- Account ID: `da77cc158dfdf586558f4f81a059a23d`
- D1 permission: `d1 (write)`

`npx wrangler d1 info LEADS_DB --json` confirmed the production target:

| Field | Value |
| --- | --- |
| Name | `bloomcore-leads-prod` |
| UUID | `97c348f1-57b6-41cb-8d1c-33ea1b6c4955` |
| Region | `WEUR` |
| Read replication | Disabled |

`wrangler.jsonc` binds `LEADS_DB` to the same name and UUID, so the command targeted the expected production database.

## 4. Migration status before execution

`npx wrangler d1 migrations list LEADS_DB --remote` returned:

```text
Migrations to be applied:
┌───────────────────────────────┐
│ Name                          │
├───────────────────────────────┤
│ 0002_staff_and_assignment.sql │
└───────────────────────────────┘
```

Only `0002` was pending; `0001_init.sql` was not listed because it was already applied. This matched the required condition exactly, so no other migration was applied and no workaround was used.

Read-only production baseline before applying:

- `staff` had `id`, `email`, `display_name`, `role`, `created_at`; it lacked `active` and `updated_at`.
- `notifications` had its original 14 columns; it lacked `payload`.
- `staff_audit`, `idx_staff_audit_staff`, `idx_leads_assigned` and `idx_notifications_created` did not exist.
- Row counts: `leads=0`, `staff=0`, `notifications=0`, `lead_notes=0`, `lead_activity=0`.
- `sequences`: `lead_number=6`.

## 5. Application of the migration

Wrangler 4.160 does not accept `--yes`; an initial attempt with that flag exited with `Unknown argument: yes` before applying anything. The documented non-interactive path was then used:

```bash
env -u CLOUDFLARE_API_TOKEN CI=true npx wrangler d1 migrations apply LEADS_DB --remote
```

Wrangler reported:

```text
Migrations to be applied:
│ 0002_staff_and_assignment.sql │
About to apply 1 migration(s)
Executing on remote database LEADS_DB (97c348f1-57b6-41cb-8d1c-33ea1b6c4955)
Executed 9 commands in 3.25ms
│ 0002_staff_and_assignment.sql │ ✅ │
```

The migration was applied once through Wrangler's normal migration tracking. No SQL was executed directly, no migration-history row was inserted manually, and no partially failed migration was retried.

## 6. Migration status after execution

`npx wrangler d1 migrations list LEADS_DB --remote` returned:

```text
✅ No migrations to apply!
```

The production `d1_migrations` table contains:

| id | name | applied_at |
| --- | --- | --- |
| 1 | `0001_init.sql` | `2026-11-12 14:55:53` |
| 2 | `0002_staff_and_assignment.sql` | `2026-11-13 13:50:38` |

## 7. Production schema verification

Read-only queries against the remote production database confirmed:

### `staff`

| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| `active` | `INTEGER` | No | `1` |
| `updated_at` | `TEXT` | Yes | None |

The original `staff` columns (`id`, `email`, `display_name`, `role`, `created_at`) remain present and unchanged.

### `notifications`

| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| `payload` | `TEXT` | Yes | None |

The original 14 `notifications` columns remain present and unchanged.

### `staff_audit`

The table exists with:

| Column | Type | `notnull` | Key |
| --- | --- | --- | --- |
| `id` | `TEXT` | 0 | Primary key |
| `staff_id` | `TEXT` | 1 | References `staff(id)` |
| `action` | `TEXT` | 1 |  |
| `detail` | `TEXT` | 0 |  |
| `actor` | `TEXT` | 0 |  |
| `created_at` | `TEXT` | 1 |  |

As in `0001`'s other tables, `id TEXT PRIMARY KEY` does not declare `NOT NULL` at the SQLite level; the application always supplies the id. `PRAGMA foreign_key_list(staff_audit)` confirms `staff_id → staff.id` with `ON DELETE CASCADE`.

### Indexes

The following indexes exist with the expected definitions:

- `idx_staff_audit_staff` on `staff_audit(staff_id, created_at DESC)`
- `idx_leads_assigned` on `leads(assigned_to)`
- `idx_notifications_created` on `notifications(created_at DESC)`

All seven tables defined by `0001` remain present alongside the Wrangler-owned `d1_migrations` table and the new `staff_audit` table. No unexpected table or index was created, and no existing object was dropped.

## 8. Preservation of existing data

The same read-only counts were taken before and after the migration:

| Object | Before | After |
| --- | --- | --- |
| `leads` | 0 | 0 |
| `staff` | 0 | 0 |
| `notifications` | 0 | 0 |
| `lead_notes` | 0 | 0 |
| `lead_activity` | 0 | 0 |
| `staff_audit` | did not exist | 0 |
| `sequences.lead_number` | 6 | 6 |

- **Leads:** no lead rows existed at migration time, so no lead could be deleted or overwritten. The migration contains no lead `INSERT`, `UPDATE` or `DELETE`; the only lead operation is the new `assigned_to` index.
- **Staff:** no staff rows existed, so the `updated_at` backfill changed zero rows. `staff_without_updated_at = 0` after migration.
- **Sequences:** `lead_number` remained exactly `6`; it was not reset or incremented.
- **Notifications and notes:** counts remained zero.

The available evidence therefore shows that existing lead, staff and sequence data were preserved. Production currently has no lead rows, which is a pre-existing state and not a result of this migration.

## 9. Limitations and remaining scope

- This task changed the production D1 schema only. The application was **not deployed**, merged to `main`, or otherwise released. The live Worker continues to run the previously deployed version; the migration is additive and does not remove or rename anything the old Worker reads.
- No staff or accountant accounts were created.
- No Cloudflare Access policy, `INTERNAL_ALLOWED_EMAILS` value or `LEAD_OWNER_EMAILS` value was changed.
- No lead record was created, edited or deleted, and no numbering exercise was performed. Verifying the next live lead number would require creating a real lead, which was outside this task's scope; the stored sequence remains `6`.
- The report documents the database state at the time of migration. Account provisioning and application deployment remain separate owner-controlled steps.

**GREEN — Migration applied and production schema verified.**
