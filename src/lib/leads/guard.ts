import { errorResponse } from "@/lib/http";
import { getLeadEnv, type LeadEnv } from "./db";
import {
  getStaffIdentityForSurfaces,
  type AccessSlot,
  type StaffIdentity,
} from "./auth";

export type GuardResult =
  | { ok: true; env: LeadEnv; identity: StaffIdentity }
  | { ok: false; response: Response };

/**
 * Gate every internal API route. Cloudflare Access should already have
 * blocked anonymous traffic at the edge; this re-checks the signed identity
 * server-side so a direct Worker hostname cannot bypass the policy.
 *
 * A request may carry a token minted for either BloomCore staff application:
 * the dashboard (`/internal`) or the internal API (`/api/internal`). Both
 * surfaces are served from the same hostname and are limited to the same
 * allowlisted staff, and the console's own requests are answered under
 * `/internal/api/**`, where the browser holds a dashboard token. A token from
 * any other Access application, or from an email outside the allowlist, is
 * still rejected. Callers that must be strict can pass a single slot.
 */
export async function requireStaff(
  request: Request,
  slots: AccessSlot[] = ["internal", "api"],
): Promise<GuardResult> {
  let env: LeadEnv;
  try {
    env = await getLeadEnv();
  } catch {
    return { ok: false, response: errorResponse("Service unavailable.", 503) };
  }

  const identity = await getStaffIdentityForSurfaces(request, env, slots);
  if (!identity) {
    return {
      ok: false,
      response: errorResponse("Sign in with the authorised BloomCore account.", 401),
    };
  }

  return { ok: true, env, identity };
}
