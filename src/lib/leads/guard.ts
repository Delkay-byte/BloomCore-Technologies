import { errorResponse } from "@/lib/http";
import { getLeadEnv, type LeadEnv } from "./db";
import {
  getStaffIdentityForSurfaces,
  type AccessSlot,
  type StaffIdentity,
} from "./auth";
import { can, resolveStaffAccess, type Permission, type StaffAccess } from "./permissions";
import { findStaffByEmail, ownerEmails } from "./staff";

export type AuthorizedGuard = {
  ok: true;
  env: LeadEnv;
  identity: StaffIdentity;
  staff: StaffAccess;
};

export type GuardResult = AuthorizedGuard | { ok: false; response: Response };

/**
 * Gate every internal API route. Cloudflare Access should already have
 * blocked anonymous traffic at the edge; this re-checks the signed identity
 * server-side so a direct Worker hostname cannot bypass the policy.
 *
 * The verified email is then resolved to a role from the trusted staff table
 * (or the configured owner allowlist). A caller who passes Access but has no
 * active staff record is refused with 403 — being allowed through the edge is
 * never sufficient on its own.
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

  let staff: StaffAccess | null;
  try {
    const record = await findStaffByEmail(env.LEADS_DB, identity.email);
    staff = resolveStaffAccess(identity.email, ownerEmails(env), record, identity.name);
  } catch {
    return { ok: false, response: errorResponse("Service unavailable.", 503) };
  }

  if (!staff) {
    return {
      ok: false,
      response: errorResponse(
        "This account is not registered for the BloomCore Lead Desk. Ask the owner to add it.",
        403,
      ),
    };
  }

  return { ok: true, env, identity, staff };
}

/** 403 for an authenticated identity whose role does not permit the action. */
export function forbiddenResponse(
  message = "Your role does not allow that action.",
): Response {
  return errorResponse(message, 403);
}

/** Returns a 403 response when the role lacks the permission, otherwise null. */
export function denyUnless(
  guard: AuthorizedGuard,
  permission: Permission,
  message?: string,
): Response | null {
  return can(guard.staff.role, permission) ? null : forbiddenResponse(message);
}
