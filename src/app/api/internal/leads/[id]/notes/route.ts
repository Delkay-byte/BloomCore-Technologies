import { errorResponse, json, readJsonBounded } from "@/lib/http";
import { denyUnless, requireStaff } from "@/lib/leads/guard";
import { canViewLead } from "@/lib/leads/permissions";
import { addNote, actorLabel, getLeadDetail } from "@/lib/leads/repository";
import { LIMITS } from "@/lib/leads/domain";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const denied = denyUnless(
    guard,
    "leads.note",
    "The read-only accountant account cannot add notes.",
  );
  if (denied) return denied;

  const { id } = await context.params;
  const body = await readJsonBounded(request, 16 * 1024);
  if (!body.ok) return errorResponse("The note could not be read.", 400);

  const raw = body.value as Record<string, unknown>;
  const text = typeof raw.body === "string" ? raw.body.trim() : "";
  if (text.length < 2) return errorResponse("Write something before saving the note.", 422);
  if (text.length > LIMITS.noteMax) {
    return errorResponse(`Keep the note under ${LIMITS.noteMax} characters.`, 422);
  }

  const lead = await getLeadDetail(guard.env, id);
  if (!lead || !canViewLead(guard.staff.role, guard.staff.email, lead.lead)) {
    return errorResponse("That lead was not found.", 404);
  }

  const note = await addNote(guard.env, id, actorLabel(guard.identity.email), text);
  if (!note) return errorResponse("That lead was not found.", 404);
  return json({ ok: true, note });
}
