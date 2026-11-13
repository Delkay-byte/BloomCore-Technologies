import { CONTACT } from "@/lib/brand";
import { errorResponse, json, readJsonBounded } from "@/lib/http";
import { denyUnless, forbiddenResponse, requireStaff } from "@/lib/leads/guard";
import {
  isStage,
  isValidStageTransition,
  STAGES_REQUIRING_REASON,
  type PipelineStage,
} from "@/lib/leads/domain";
import { can, canViewLead } from "@/lib/leads/permissions";
import { parseLeadFields } from "@/lib/leads/patch";
import { drainOutbox } from "@/lib/leads/notifications";
import { actorLabel, getLeadDetail, updateLead, type LeadPatch } from "@/lib/leads/repository";
import { resolveAssignableStaff } from "@/lib/leads/staff";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  const detail = await getLeadDetail(guard.env, id);
  if (!detail) return errorResponse("That lead was not found.", 404);
  if (!canViewLead(guard.staff.role, guard.staff.email, detail.lead)) {
    // A worker must not be able to probe which lead ids exist outside their
    // assignments, so the response is the same as an unknown lead.
    return errorResponse("That lead was not found.", 404);
  }
  return json({ ok: true, ...detail });
}

export async function PATCH(request: Request, context: Context): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  // The accountant's read-only role stops here, before any field is read.
  const denied = denyUnless(
    guard,
    "leads.update",
    "The read-only accountant account cannot change leads.",
  );
  if (denied) return denied;

  const { id } = await context.params;
  const body = await readJsonBounded(request, 16 * 1024);
  if (!body.ok) return errorResponse("The change could not be read.", 400);

  const raw = body.value as Record<string, unknown>;
  if ("assignedTo" in raw && !can(guard.staff.role, "leads.assign")) {
    return forbiddenResponse("Only the owner can assign or reassign a lead.");
  }
  if ("archived" in raw && !can(guard.staff.role, "leads.archive")) {
    return forbiddenResponse("Only the owner can archive or restore a lead.");
  }

  const current = await getLeadDetail(guard.env, id);
  if (!current) return errorResponse("That lead was not found.", 404);
  if (!canViewLead(guard.staff.role, guard.staff.email, current.lead)) {
    return errorResponse("That lead was not found.", 404);
  }

  const patch: LeadPatch = {};

  if (typeof raw.status === "string") {
    if (!isStage(raw.status)) return errorResponse("Unknown pipeline stage.", 422);
    const transition = isValidStageTransition(current.lead.status as PipelineStage, raw.status);
    if (!transition.ok) return errorResponse(transition.reason ?? "That change is not allowed.", 422);

    const reason = typeof raw.outcomeReason === "string" ? raw.outcomeReason.trim() : "";
    if (STAGES_REQUIRING_REASON.includes(raw.status) && reason.length < 3) {
      return errorResponse("Record a short reason before closing the lead.", 422);
    }
    patch.status = raw.status;
    patch.outcomeReason = reason || null;
  }

  const parsed = parseLeadFields(raw, { allowEmpty: Object.keys(patch).length > 0 });
  if (!parsed.ok) return errorResponse(parsed.message, 422);
  Object.assign(patch, parsed.patch);

  // An assignment must point at a registered, active Lead Desk worker. The
  // assignment control offers only these, but the server never trusts what a
  // form sent.
  if (patch.assignedTo) {
    const target = await resolveAssignableStaff(guard.env, patch.assignedTo);
    if (!target) {
      return errorResponse(
        "Choose a registered, active BloomCore staff member. Inactive or unknown accounts cannot be assigned leads.",
        422,
      );
    }
    patch.assignedTo = target.email;
  }

  try {
    const lead = await updateLead(guard.env, id, patch, actorLabel(guard.identity.email));
    if (!lead) return errorResponse("That lead was not found.", 404);

    // Assignment mail is already durable in the outbox; this best-effort drain
    // only saves the worker a wait. A failure here leaves the row pending for
    // the owner's retry control and never undoes the assignment.
    if (patch.assignedTo) {
      await drainOutbox(guard.env, { limit: 5, contactEmail: CONTACT.email }).catch(() => undefined);
    }

    return json({ ok: true, lead });
  } catch {
    return errorResponse("The change could not be saved. Please try again.", 500);
  }
}
