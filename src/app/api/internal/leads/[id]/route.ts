import { errorResponse, json, readJsonBounded } from "@/lib/http";
import { requireStaff } from "@/lib/leads/guard";
import {
  isStage,
  isValidStageTransition,
  STAGES_REQUIRING_REASON,
  type PipelineStage,
} from "@/lib/leads/domain";
import { actorLabel, getLeadDetail, updateLead, type LeadPatch } from "@/lib/leads/repository";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  const detail = await getLeadDetail(guard.env, id);
  if (!detail) return errorResponse("That lead was not found.", 404);
  return json({ ok: true, ...detail });
}

export async function PATCH(request: Request, context: Context): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const { id } = await context.params;
  const body = await readJsonBounded(request, 16 * 1024);
  if (!body.ok) return errorResponse("The change could not be read.", 400);

  const raw = body.value as Record<string, unknown>;
  const patch: LeadPatch = {};

  if (typeof raw.status === "string") {
    if (!isStage(raw.status)) return errorResponse("Unknown pipeline stage.", 422);
    const current = await getLeadDetail(guard.env, id);
    if (!current) return errorResponse("That lead was not found.", 404);
    const transition = isValidStageTransition(current.lead.status as PipelineStage, raw.status);
    if (!transition.ok) return errorResponse(transition.reason ?? "That change is not allowed.", 422);

    const reason = typeof raw.outcomeReason === "string" ? raw.outcomeReason.trim() : "";
    if (STAGES_REQUIRING_REASON.includes(raw.status) && reason.length < 3) {
      return errorResponse("Record a short reason before closing the lead.", 422);
    }
    patch.status = raw.status;
    patch.outcomeReason = reason || null;
  }

  if ("assignedTo" in raw) {
    patch.assignedTo = typeof raw.assignedTo === "string" ? raw.assignedTo.trim().slice(0, 160) : null;
  }
  if ("nextAction" in raw) {
    patch.nextAction = typeof raw.nextAction === "string" ? raw.nextAction.trim().slice(0, 300) : null;
  }
  if ("nextFollowUpAt" in raw) {
    const value = typeof raw.nextFollowUpAt === "string" ? raw.nextFollowUpAt.trim() : "";
    if (value && Number.isNaN(Date.parse(value))) {
      return errorResponse("Enter a valid follow-up date.", 422);
    }
    patch.nextFollowUpAt = value || null;
  }
  if ("archived" in raw) {
    patch.archived = raw.archived === true;
  }

  try {
    const lead = await updateLead(guard.env, id, patch, actorLabel(guard.identity.email));
    if (!lead) return errorResponse("That lead was not found.", 404);
    return json({ ok: true, lead });
  } catch {
    return errorResponse("The change could not be saved.", 500);
  }
}
