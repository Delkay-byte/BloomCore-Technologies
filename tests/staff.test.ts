import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createTestDatabase, type TestDatabase } from "./helpers/d1.ts";
import {
  createStaff,
  findStaffByEmail,
  listAssignableStaff,
  listStaff,
  listStaffAudit,
  resolveAssignableStaff,
  updateStaff,
} from "../src/lib/leads/staff.ts";
import type { LeadEnv } from "../src/lib/leads/db.ts";

/**
 * Staff records are the trusted source of a role. These tests cover creation,
 * duplicate handling, deactivation, role changes, the audit trail, and the
 * assignment validation that prevents unregistered or inactive accounts from
 * being assigned a lead.
 */

const OWNER = "bloomcoretechnologies@gmail.com";
const ACTOR = OWNER;

let database: TestDatabase;
let env: LeadEnv;

beforeEach(() => {
  database = createTestDatabase();
  env = { LEADS_DB: database, LEAD_OWNER_EMAILS: OWNER } as unknown as LeadEnv;
});

test("creating a staff member normalises the email and records an audit entry", async () => {
  const result = await createStaff(
    env,
    { email: " Kwame.Mensah@Example.com ", displayName: "Kwame Mensah", role: "staff_member" },
    ACTOR,
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.staff.email, "kwame.mensah@example.com");
  assert.equal(result.staff.display_name, "Kwame Mensah");
  assert.equal(result.staff.role, "staff_member");
  assert.equal(result.staff.active, 1);

  const audit = await listStaffAudit(env);
  assert.equal(audit.length, 1);
  assert.equal(audit[0].action, "created");
  assert.match(audit[0].detail ?? "", /kwame\.mensah@example\.com/);
  assert.equal(audit[0].actor, ACTOR);
});

test("a duplicate email is refused rather than silently overwritten", async () => {
  await createStaff(env, { email: "kwame@example.com", displayName: "Kwame", role: "staff_member" }, ACTOR);
  const duplicate = await createStaff(
    env,
    { email: "KWAME@example.com", displayName: "Someone Else", role: "accountant_read_only" },
    ACTOR,
  );
  assert.equal(duplicate.ok, false);
  if (duplicate.ok) return;
  assert.equal(duplicate.status, 409);

  const stored = await findStaffByEmail(database, "kwame@example.com");
  assert.equal(stored?.display_name, "Kwame", "the original record is untouched");
});

test("invalid roles and malformed addresses are rejected", async () => {
  const badRole = await createStaff(
    env,
    { email: "worker@example.com", displayName: "Worker", role: "owner" },
    ACTOR,
  );
  assert.equal(badRole.ok, false);

  const badEmail = await createStaff(
    env,
    { email: "not-an-email", displayName: "Worker", role: "staff_member" },
    ACTOR,
  );
  assert.equal(badEmail.ok, false);

  const noName = await createStaff(
    env,
    { email: "worker@example.com", displayName: " ", role: "staff_member" },
    ACTOR,
  );
  assert.equal(noName.ok, false);
});

test("deactivation is recorded and blocks new assignments, while reactivation restores it", async () => {
  const created = await createStaff(
    env,
    { email: "kwame@example.com", displayName: "Kwame Mensah", role: "staff_member" },
    ACTOR,
  );
  assert.ok(created.ok);
  if (!created.ok) return;

  const deactivated = await updateStaff(env, created.staff.id, { active: false }, ACTOR);
  assert.ok(deactivated.ok);
  if (!deactivated.ok) return;
  assert.equal(deactivated.staff.active, 0);

  assert.equal(await resolveAssignableStaff(env, "kwame@example.com"), null);
  const assignable = await listAssignableStaff(env);
  assert.ok(!assignable.some((option) => option.email === "kwame@example.com"));

  const audit = await listStaffAudit(env);
  assert.ok(audit.some((entry) => entry.action === "deactivated"));

  const reactivated = await updateStaff(env, created.staff.id, { active: true }, ACTOR);
  assert.ok(reactivated.ok);
  if (!reactivated.ok) return;
  assert.equal(reactivated.staff.active, 1);
  assert.ok(await resolveAssignableStaff(env, "kwame@example.com"));
});

test("role changes and display-name changes are audited", async () => {
  const created = await createStaff(
    env,
    { email: "kwame@example.com", displayName: "Kwame", role: "staff_member" },
    ACTOR,
  );
  assert.ok(created.ok);
  if (!created.ok) return;

  const changed = await updateStaff(
    env,
    created.staff.id,
    { role: "accountant_read_only", displayName: "Kwame Mensah" },
    ACTOR,
  );
  assert.ok(changed.ok);
  if (!changed.ok) return;
  assert.equal(changed.staff.role, "accountant_read_only");
  assert.equal(changed.staff.display_name, "Kwame Mensah");

  const actions = (await listStaffAudit(env)).map((entry) => entry.action);
  assert.ok(actions.includes("role_changed"));
  assert.ok(actions.includes("updated"));

  // The accountant role is oversight only, so it can hold no assignments.
  assert.equal(await resolveAssignableStaff(env, "kwame@example.com"), null);
});

test("the configuration-backed owner appears once in the assignment list", async () => {
  await createStaff(
    env,
    { email: "kwame@example.com", displayName: "Kwame Mensah", role: "staff_member" },
    ACTOR,
  );
  const assignable = await listAssignableStaff(env);
  assert.deepEqual(
    assignable.map((option) => option.email).sort(),
    [OWNER, "kwame@example.com"].sort(),
  );

  const owner = await resolveAssignableStaff(env, OWNER);
  assert.equal(owner?.role, "owner");
});

test("a second owner row is treated as configuration-derived, not editable here", async () => {
  // Simulate a legacy row whose role reads owner.
  await database
    .prepare(
      "INSERT INTO staff (id, email, display_name, role, active, created_at, updated_at) VALUES (?,?,?,?,1,?,?)",
    )
    .bind("owner-row", OWNER, "BloomCore", "owner", "2026-11-01T00:00:00.000Z", "2026-11-01T00:00:00.000Z")
    .run();

  const result = await updateStaff(env, "owner-row", { active: false }, ACTOR);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.status, 409);
});

test("the staff list is ordered and includes inactive accounts", async () => {
  const a = await createStaff(
    env,
    { email: "zoe@example.com", displayName: "Zoe", role: "staff_member" },
    ACTOR,
  );
  assert.ok(a.ok);
  if (!a.ok) return;
  await createStaff(
    env,
    { email: "ama@example.com", displayName: "Ama", role: "staff_member" },
    ACTOR,
  );
  await updateStaff(env, a.staff.id, { active: false }, ACTOR);

  const all = await listStaff(env, {});
  assert.equal(all.length, 2);
  assert.equal(all[0].display_name, "Ama", "active accounts sort first");

  const activeOnly = await listStaff(env, { activeOnly: true });
  assert.deepEqual(activeOnly.map((row) => row.email), ["ama@example.com"]);
});
