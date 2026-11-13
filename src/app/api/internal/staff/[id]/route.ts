import { asRecord, errorResponse, json, readJsonBounded } from "@/lib/http";
import { denyUnless, requireStaff } from "@/lib/leads/guard";
import { actorLabel } from "@/lib/leads/repository";
import { updateStaff } from "@/lib/leads/staff";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const denied = denyUnless(
    guard,
    "staff.manage",
    "Only the owner can manage Lead Desk staff.",
  );
  if (denied) return denied;

  const { id } = await context.params;
  const body = await readJsonBounded(request, 8 * 1024);
  if (!body.ok) return errorResponse("The staff change could not be read.", 400);

  const raw = asRecord(body.value);
  const input: { displayName?: string; role?: string; active?: boolean } = {};
  if (typeof raw.displayName === "string") input.displayName = raw.displayName;
  if (typeof raw.role === "string") input.role = raw.role;
  if (typeof raw.active === "boolean") input.active = raw.active;

  if (Object.keys(input).length === 0) {
    return errorResponse("There is nothing to update.", 422);
  }

  try {
    const result = await updateStaff(guard.env, id, input, actorLabel(guard.identity.email));
    if (!result.ok) return errorResponse(result.error, result.status);
    return json({ ok: true, staff: result.staff });
  } catch {
    return errorResponse("The staff change could not be saved.", 500);
  }
}
