import { errorResponse } from "@/lib/http";
import { getLeadEnv, type LeadEnv } from "./db";
import { getStaffIdentity, type StaffIdentity } from "./auth";

export type GuardResult =
  | { ok: true; env: LeadEnv; identity: StaffIdentity }
  | { ok: false; response: Response };

/**
 * Gate every internal API route. Cloudflare Access should already have
 * blocked anonymous traffic at the edge; this re-checks the signed identity
 * server-side so a direct Worker hostname cannot bypass the policy.
 */
export async function requireStaff(request: Request): Promise<GuardResult> {
  let env: LeadEnv;
  try {
    env = await getLeadEnv();
  } catch {
    return { ok: false, response: errorResponse("Service unavailable.", 503) };
  }

  const identity = await getStaffIdentity(request, env);
  if (!identity) {
    return {
      ok: false,
      response: errorResponse("Sign in with the authorised BloomCore account.", 401),
    };
  }

  return { ok: true, env, identity };
}
