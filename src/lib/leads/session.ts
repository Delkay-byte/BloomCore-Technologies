import { headers } from "next/headers";
import { getLeadEnv, type LeadEnv } from "./db";
import { getStaffIdentity, type StaffIdentity } from "./auth";
import { resolveStaffAccess, type StaffAccess } from "./permissions";
import { findStaffByEmail, ownerEmails } from "./staff";

export type CurrentStaff = {
  env: LeadEnv;
  identity: StaffIdentity | null;
  staff: StaffAccess | null;
};

/**
 * Resolve the signed-in staff member for server-rendered console pages.
 *
 * Pages render only when both the Access identity and an active staff record
 * agree on authorisation; `staff` is null when the account is not registered,
 * which each page renders as a refusal rather than an empty console.
 */
export async function currentStaff(): Promise<CurrentStaff> {
  const requestHeaders = await headers();
  const env = await getLeadEnv();
  const identity = await getStaffIdentity({ headers: requestHeaders }, env, "internal");
  if (!identity) return { env, identity: null, staff: null };

  let staff: StaffAccess | null = null;
  try {
    const record = await findStaffByEmail(env.LEADS_DB, identity.email);
    staff = resolveStaffAccess(identity.email, ownerEmails(env), record, identity.name);
  } catch {
    staff = null;
  }
  return { env, identity, staff };
}
