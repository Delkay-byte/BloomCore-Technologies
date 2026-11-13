import { all, first, type D1Database, type LeadEnv } from "./db";
import { isValidEmail, normalizeEmail } from "./domain";
import {
  MANAGED_ROLES,
  normalizeRole,
  parseOwnerEmails,
  ASSIGNABLE_ROLES,
  type StaffRole,
} from "./permissions";

/**
 * Registered Lead Desk staff.
 *
 * A staff record is the only place a role is stored. Records are created by the
 * owner through the console; entering an email into the assignment field never
 * creates one. Every create/update is written to `staff_audit` in the same
 * batch as the change.
 */

export type StaffRow = {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  active: number;
  created_at: string;
  updated_at: string | null;
};

export type StaffAuditRow = {
  id: string;
  staff_id: string;
  action: string;
  detail: string | null;
  actor: string | null;
  created_at: string;
};

const nowIso = () => new Date().toISOString();
const DISPLAY_NAME_MAX = 120;

export async function findStaffByEmail(
  database: D1Database,
  email: string,
): Promise<StaffRow | null> {
  return first<StaffRow>(
    database.prepare("SELECT * FROM staff WHERE lower(email) = ?").bind(email.trim().toLowerCase()),
  );
}

export async function findStaffById(
  database: D1Database,
  id: string,
): Promise<StaffRow | null> {
  return first<StaffRow>(database.prepare("SELECT * FROM staff WHERE id = ?").bind(id));
}

export async function listStaff(
  env: LeadEnv,
  options: { activeOnly?: boolean; assignable?: boolean } = {},
): Promise<StaffRow[]> {
  const clauses: string[] = [];
  if (options.activeOnly || options.assignable) clauses.push("active = 1");
  if (options.assignable) {
    clauses.push("lower(role) IN ('owner','staff_member','member','staff','admin')");
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return all<StaffRow>(
    env.LEADS_DB.prepare(
      `SELECT * FROM staff ${where}
       ORDER BY active DESC, lower(coalesce(display_name, email)) ASC`,
    ),
  );
}

export async function listStaffAudit(env: LeadEnv, limit = 100): Promise<StaffAuditRow[]> {
  return all<StaffAuditRow>(
    env.LEADS_DB.prepare(
      "SELECT * FROM staff_audit ORDER BY created_at DESC LIMIT ?",
    ).bind(Math.min(200, Math.max(1, limit))),
  );
}

/** Owner addresses may be assigned leads even though they have no staff row. */
export function ownerEmails(env: LeadEnv): string[] {
  const configured = parseOwnerEmails(env.LEAD_OWNER_EMAILS);
  if (configured.length > 0) return configured;
  // Bootstrap fallback: before LEAD_OWNER_EMAILS existed, the company
  // notification address was the owner's address. Keeping it as a fallback
  // means a deployment that predates the new variable cannot lock the owner out.
  return parseOwnerEmails(env.LEAD_NOTIFICATION_EMAIL);
}

export type AssignableStaff = {
  email: string;
  displayName: string | null;
  role: StaffRole;
  staffId: string | null;
};

export async function listAssignableStaff(env: LeadEnv): Promise<AssignableStaff[]> {
  const owners = ownerEmails(env);
  const rows = await listStaff(env, { assignable: true });
  const options: AssignableStaff[] = [];

  for (const owner of owners) {
    const record = rows.find((row) => row.email.toLowerCase() === owner);
    if (record) continue;
    options.push({ email: owner, displayName: null, role: "owner", staffId: null });
  }

  for (const row of rows) {
    const role = normalizeRole(row.role);
    if (!role || !ASSIGNABLE_ROLES.includes(role)) continue;
    options.push({
      email: row.email.toLowerCase(),
      displayName: row.display_name,
      role,
      staffId: row.id,
    });
  }

  return options.sort((a, b) =>
    (a.displayName ?? a.email).localeCompare(b.displayName ?? b.email),
  );
}

/**
 * Validate an assignment target before it is saved. An inactive or unknown
 * account is rejected; the assignment is never stored against an email that
 * cannot receive the assignment notification.
 */
export async function resolveAssignableStaff(
  env: LeadEnv,
  email: string,
): Promise<AssignableStaff | null> {
  const normalized = normalizeEmail(email);
  if (!normalized || !isValidEmail(normalized)) return null;

  const owners = ownerEmails(env);
  if (owners.includes(normalized)) {
    const record = await findStaffByEmail(env.LEADS_DB, normalized);
    return {
      email: normalized,
      displayName: record?.display_name ?? null,
      role: "owner",
      staffId: record?.id ?? null,
    };
  }

  const record = await findStaffByEmail(env.LEADS_DB, normalized);
  if (!record || record.active === 0) return null;
  const role = normalizeRole(record.role);
  if (!role || !ASSIGNABLE_ROLES.includes(role)) return null;

  return {
    email: normalized,
    displayName: record.display_name,
    role,
    staffId: record.id,
  };
}

/* ------------------------------------------------------------- management */

export type CreateStaffInput = {
  email: string;
  displayName: string;
  role: string;
};

export type StaffMutationResult =
  | { ok: true; staff: StaffRow }
  | { ok: false; status: number; error: string };

export async function createStaff(
  env: LeadEnv,
  input: CreateStaffInput,
  actor: string,
): Promise<StaffMutationResult> {
  const email = normalizeEmail(input.email);
  const displayName = input.displayName.trim().replace(/\s+/g, " ").slice(0, DISPLAY_NAME_MAX);
  const role = normalizeRole(input.role);

  if (!isValidEmail(email)) {
    return { ok: false, status: 422, error: "Enter a valid staff email address." };
  }
  if (displayName.length < 2) {
    return { ok: false, status: 422, error: "Enter the staff member's display name." };
  }
  if (!role || !MANAGED_ROLES.includes(role)) {
    return { ok: false, status: 422, error: "Choose a read-only or staff-member role." };
  }

  const existing = await findStaffByEmail(env.LEADS_DB, email);
  if (existing) {
    return {
      ok: false,
      status: 409,
      error: existing.active === 0
        ? "That email already has an inactive staff record. Reactivate it instead."
        : "That email is already registered as staff.",
    };
  }

  const id = crypto.randomUUID();
  const timestamp = nowIso();
  const database = env.LEADS_DB;
  await database.batch([
    database
      .prepare(
        `INSERT INTO staff (id, email, display_name, role, active, created_at, updated_at)
         VALUES (?,?,?,?,1,?,?)`,
      )
      .bind(id, email, displayName, role, timestamp, timestamp),
    database
      .prepare(
        `INSERT INTO staff_audit (id, staff_id, action, detail, actor, created_at)
         VALUES (?,?,?,?,?,?)`,
      )
      .bind(
        crypto.randomUUID(),
        id,
        "created",
        `Created ${role} account for ${email}`,
        actor,
        timestamp,
      ),
  ]);

  const staff = await findStaffById(database, id);
  if (!staff) return { ok: false, status: 500, error: "The staff record could not be saved." };
  return { ok: true, staff };
}

export type UpdateStaffInput = {
  displayName?: string;
  role?: string;
  active?: boolean;
};

export async function updateStaff(
  env: LeadEnv,
  id: string,
  input: UpdateStaffInput,
  actor: string,
): Promise<StaffMutationResult> {
  const database = env.LEADS_DB;
  const current = await findStaffById(database, id);
  if (!current) return { ok: false, status: 404, error: "That staff record was not found." };
  if (normalizeRole(current.role) === "owner") {
    return {
      ok: false,
      status: 409,
      error: "The owner account is managed by configuration and cannot be edited here.",
    };
  }

  const sets: string[] = [];
  const params: unknown[] = [];
  const audits: Array<{ action: string; detail: string }> = [];
  const timestamp = nowIso();

  if (input.displayName !== undefined) {
    const displayName = input.displayName.trim().replace(/\s+/g, " ").slice(0, DISPLAY_NAME_MAX);
    if (displayName.length < 2) {
      return { ok: false, status: 422, error: "Enter the staff member's display name." };
    }
    if (displayName !== current.display_name) {
      sets.push("display_name = ?");
      params.push(displayName);
      audits.push({
        action: "updated",
        detail: `Display name changed from ${current.display_name ?? "—"} to ${displayName}`,
      });
    }
  }

  if (input.role !== undefined) {
    const role = normalizeRole(input.role);
    if (!role || !MANAGED_ROLES.includes(role)) {
      return { ok: false, status: 422, error: "Choose a read-only or staff-member role." };
    }
    if (role !== normalizeRole(current.role)) {
      sets.push("role = ?");
      params.push(role);
      audits.push({
        action: "role_changed",
        detail: `Role changed from ${current.role} to ${role}`,
      });
    }
  }

  if (input.active !== undefined) {
    const active = input.active ? 1 : 0;
    if (active !== Number(current.active)) {
      sets.push("active = ?");
      params.push(active);
      audits.push({
        action: active ? "activated" : "deactivated",
        detail: active
          ? "Staff account activated"
          : "Staff account deactivated; existing assignments are preserved",
      });
    }
  }

  if (sets.length === 0) return { ok: true, staff: current };

  sets.push("updated_at = ?");
  params.push(timestamp, id);

  await database.batch([
    database.prepare(`UPDATE staff SET ${sets.join(", ")} WHERE id = ?`).bind(...params),
    ...audits.map((entry) =>
      database
        .prepare(
          `INSERT INTO staff_audit (id, staff_id, action, detail, actor, created_at)
           VALUES (?,?,?,?,?,?)`,
        )
        .bind(crypto.randomUUID(), id, entry.action, entry.detail, actor, timestamp),
    ),
  ]);

  const staff = await findStaffById(database, id);
  if (!staff) return { ok: false, status: 500, error: "The staff record could not be read." };
  return { ok: true, staff };
}

/** Used by tests and the console to show who an assignment belongs to. */
export async function staffDirectory(env: LeadEnv): Promise<Map<string, StaffRow>> {
  const rows = await listStaff(env, {});
  const byEmail = new Map<string, StaffRow>();
  for (const row of rows) byEmail.set(row.email.toLowerCase(), row);
  return byEmail;
}

/** Housekeeping helper kept here so the staff table has one write path. */
export async function countActiveStaff(env: LeadEnv): Promise<number> {
  const row = await first<{ total: number }>(
    env.LEADS_DB.prepare("SELECT COUNT(*) AS total FROM staff WHERE active = 1"),
  );
  return row?.total ?? 0;
}
