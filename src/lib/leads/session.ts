import { headers } from "next/headers";
import { getLeadEnv, type LeadEnv } from "./db";
import { getStaffIdentity, type StaffIdentity } from "./auth";

export type CurrentStaff = { env: LeadEnv; identity: StaffIdentity | null };

/** Resolve the signed-in staff member for server-rendered console pages. */
export async function currentStaff(): Promise<CurrentStaff> {
  const requestHeaders = await headers();
  const env = await getLeadEnv();
  const identity = await getStaffIdentity({ headers: requestHeaders }, env);
  return { env, identity };
}
