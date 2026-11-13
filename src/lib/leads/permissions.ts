/**
 * Staff roles and the permissions they carry.
 *
 * This module is dependency-free so the guard, the route handlers, the console
 * and the Node test runner all answer authorisation questions from one matrix.
 * A role is never read from the client: it is resolved from the verified
 * Cloudflare Access email plus the trusted `staff` record (or the owner
 * allowlist in the Worker configuration).
 */

export const STAFF_ROLES = ["owner", "accountant_read_only", "staff_member"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const ASSIGNABLE_ROLES: ReadonlyArray<StaffRole> = ["owner", "staff_member"];

export const ROLE_LABELS: Record<StaffRole, string> = {
  owner: "Owner",
  accountant_read_only: "Read-only",
  staff_member: "Staff member",
};

/** Roles the owner may assign through staff management. */
export const MANAGED_ROLES: ReadonlyArray<StaffRole> = ["accountant_read_only", "staff_member"];

export type Permission =
  | "leads.read.all"
  | "leads.read.assigned"
  | "leads.update"
  | "leads.assign"
  | "leads.note"
  | "leads.archive"
  | "leads.export"
  | "notifications.read.all"
  | "notifications.read.assigned"
  | "notifications.mark_read"
  | "notifications.retry"
  | "staff.manage";

const MATRIX: Record<StaffRole, ReadonlyArray<Permission>> = {
  owner: [
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
  ],
  accountant_read_only: ["leads.read.all", "notifications.read.all"],
  staff_member: [
    "leads.read.assigned",
    "leads.update",
    "leads.note",
    "notifications.read.assigned",
    "notifications.mark_read",
  ],
};

/**
 * Normalise a stored or submitted role. `member` is the legacy schema default
 * and means the same as `staff_member`; anything unrecognised is rejected
 * rather than silently granted a role.
 */
export function normalizeRole(value: unknown): StaffRole | null {
  if (typeof value !== "string") return null;
  const role = value.trim().toLowerCase();
  if (role === "member" || role === "staff" || role === "staff_member") return "staff_member";
  // Only the exact owner role is honoured here; the owner allowlist in the
  // Worker configuration is the authority. A stray legacy alias must never
  // promote a staff row to owner.
  if (role === "owner") return "owner";
  if (role === "accountant" || role === "read_only" || role === "accountant_read_only") {
    return "accountant_read_only";
  }
  return null;
}

export function isReadOnly(role: StaffRole): boolean {
  return role === "accountant_read_only";
}

export function can(role: StaffRole, permission: Permission): boolean {
  return MATRIX[role].includes(permission);
}

export type LeadAssignmentShape = { assigned_to: string | null };

/** Whether this identity may open a particular lead. */
export function canViewLead(
  role: StaffRole,
  email: string,
  lead: LeadAssignmentShape,
): boolean {
  if (can(role, "leads.read.all")) return true;
  return (lead.assigned_to ?? "").trim().toLowerCase() === email.trim().toLowerCase();
}

/**
 * The owner and accountant see every lead; a staff member is restricted to
 * their own assignments. `undefined` means "no restriction".
 */
export function leadScopeEmail(role: StaffRole, email: string): string | undefined {
  return can(role, "leads.read.all") ? undefined : email.trim().toLowerCase();
}

export function notificationScopeEmail(role: StaffRole, email: string): string | undefined {
  return can(role, "notifications.read.all") ? undefined : email.trim().toLowerCase();
}

export type StaffAccess = {
  /** `null` for the configuration-backed owner, who has no staff row. */
  staffId: string | null;
  email: string;
  displayName: string | null;
  role: StaffRole;
  active: boolean;
};

export type StaffRecordShape = {
  id: string;
  display_name: string | null;
  role: string;
  active: number | boolean;
};

/**
 * Resolve a trusted role from the authenticated email.
 *
 * The configured owner allowlist wins, so the owner can never be locked out by
 * a missing or deactivated row. Everyone else must have an active staff record
 * with a recognised role; there is no implicit default role.
 */
export function resolveStaffAccess(
  email: string,
  ownerEmails: ReadonlyArray<string>,
  record: StaffRecordShape | null,
  fallbackName: string | null = null,
): StaffAccess | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  if (ownerEmails.some((owner) => owner.trim().toLowerCase() === normalized)) {
    return {
      staffId: record?.id ?? null,
      email: normalized,
      displayName: record?.display_name ?? fallbackName,
      role: "owner",
      active: true,
    };
  }

  if (!record) return null;
  if (record.active === 0 || record.active === false) return null;
  const role = normalizeRole(record.role);
  if (!role) return null;

  return {
    staffId: record.id,
    email: normalized,
    displayName: record.display_name ?? fallbackName,
    role,
    active: true,
  };
}

export function parseOwnerEmails(value: string | undefined | null): string[] {
  return (value ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
