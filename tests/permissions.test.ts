import assert from "node:assert/strict";
import { test } from "node:test";
import {
  can,
  canViewLead,
  leadScopeEmail,
  normalizeRole,
  notificationScopeEmail,
  parseOwnerEmails,
  resolveStaffAccess,
} from "../src/lib/leads/permissions.ts";

/**
 * The permission matrix is the server's single answer to "may this role do
 * that?". These tests pin the accountant's read-only boundary and the worker's
 * assigned-lead boundary so a UI change can never quietly widen either.
 */

const OWNER = "bloomcoretechnologies@gmail.com";

test("the legacy member role is treated as staff_member", () => {
  assert.equal(normalizeRole("member"), "staff_member");
  assert.equal(normalizeRole("STAFF"), "staff_member");
  assert.equal(normalizeRole("accountant"), "accountant_read_only");
  assert.equal(normalizeRole("admin"), null, "a legacy alias must not grant owner");
  assert.equal(normalizeRole("unknown-role"), null);
  assert.equal(normalizeRole(null), null);
});

test("the configured owner is resolved without a staff row and cannot be locked out", () => {
  const access = resolveStaffAccess(OWNER, [OWNER], null);
  assert.equal(access?.role, "owner");
  assert.equal(access?.active, true);

  const deactivated = resolveStaffAccess(OWNER, [OWNER], {
    id: "staff-1",
    display_name: "Owner",
    role: "staff_member",
    active: 0,
  });
  assert.equal(deactivated?.role, "owner", "the owner allowlist wins over a stale row");
});

test("an inactive or unknown staff record resolves to no access", () => {
  assert.equal(
    resolveStaffAccess(
      "kwame@example.com",
      [OWNER],
      { id: "s1", display_name: "Kwame", role: "staff_member", active: 0 },
      null,
    ),
    null,
  );
  assert.equal(resolveStaffAccess("stranger@example.com", [OWNER], null, null), null);
  assert.equal(
    resolveStaffAccess(
      "stranger@example.com",
      [OWNER],
      { id: "s2", display_name: "Stranger", role: "something_else", active: 1 },
      null,
    ),
    null,
    "an unrecognised stored role is never granted a default role",
  );
});

test("the accountant can read everything but mutate nothing", () => {
  const role = "accountant_read_only" as const;
  assert.equal(can(role, "leads.read.all"), true);
  assert.equal(can(role, "notifications.read.all"), true);
  for (const permission of [
    "leads.update",
    "leads.assign",
    "leads.note",
    "leads.archive",
    "leads.export",
    "notifications.mark_read",
    "notifications.retry",
    "staff.manage",
  ] as const) {
    assert.equal(can(role, permission), false, `accountant must not have ${permission}`);
  }
});

test("a staff member can work assigned leads but not administer the desk", () => {
  const role = "staff_member" as const;
  assert.equal(can(role, "leads.read.assigned"), true);
  assert.equal(can(role, "leads.update"), true);
  assert.equal(can(role, "leads.note"), true);
  for (const permission of [
    "leads.read.all",
    "leads.assign",
    "leads.archive",
    "leads.export",
    "notifications.read.all",
    "notifications.retry",
    "staff.manage",
  ] as const) {
    assert.equal(can(role, permission), false, `staff must not have ${permission}`);
  }
});

test("the owner retains every permission", () => {
  for (const permission of [
    "leads.read.all",
    "leads.update",
    "leads.assign",
    "leads.note",
    "leads.archive",
    "leads.export",
    "notifications.read.all",
    "notifications.mark_read",
    "notifications.retry",
    "staff.manage",
  ] as const) {
    assert.equal(can("owner", permission), true, `owner must have ${permission}`);
  }
});

test("lead visibility follows assignment for staff and is unrestricted for oversight", () => {
  const lead = { assigned_to: "kwame@example.com" };
  assert.equal(canViewLead("owner", OWNER, lead), true);
  assert.equal(canViewLead("accountant_read_only", "accountant@example.com", lead), true);
  assert.equal(canViewLead("staff_member", "kwame@example.com", lead), true);
  assert.equal(canViewLead("staff_member", "KWAME@example.com", lead), true);
  assert.equal(canViewLead("staff_member", "other@example.com", lead), false);
  assert.equal(canViewLead("staff_member", "kwame@example.com", { assigned_to: null }), false);
});

test("query scopes match the role boundary", () => {
  assert.equal(leadScopeEmail("owner", OWNER), undefined);
  assert.equal(leadScopeEmail("accountant_read_only", "a@example.com"), undefined);
  assert.equal(leadScopeEmail("staff_member", "Kwame@Example.com"), "kwame@example.com");
  assert.equal(notificationScopeEmail("staff_member", "Kwame@Example.com"), "kwame@example.com");
  assert.equal(notificationScopeEmail("accountant_read_only", "a@example.com"), undefined);
});

test("owner emails are parsed defensively", () => {
  assert.deepEqual(parseOwnerEmails(" A@Example.com, b@example.com ,, "), [
    "a@example.com",
    "b@example.com",
  ]);
  assert.deepEqual(parseOwnerEmails(undefined), []);
});
