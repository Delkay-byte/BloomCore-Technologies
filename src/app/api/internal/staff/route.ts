import { errorResponse, json, readJsonBounded } from "@/lib/http";
import { denyUnless, requireStaff } from "@/lib/leads/guard";
import { actorLabel } from "@/lib/leads/repository";
import { createStaff, listStaff, listStaffAudit } from "@/lib/leads/staff";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const denied = denyUnless(
    guard,
    "staff.manage",
    "Only the owner can manage Lead Desk staff.",
  );
  if (denied) return denied;

  const includeAudit = new URL(request.url).searchParams.get("audit") === "1";
  try {
    const [staff, audit] = await Promise.all([
      listStaff(guard.env, {}),
      includeAudit ? listStaffAudit(guard.env) : Promise.resolve([]),
    ]);
    return json({ ok: true, staff, audit });
  } catch {
    return errorResponse("The staff list could not be loaded.", 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const denied = denyUnless(
    guard,
    "staff.manage",
    "Only the owner can manage Lead Desk staff.",
  );
  if (denied) return denied;

  const body = await readJsonBounded(request, 8 * 1024);
  if (!body.ok) return errorResponse("The staff details could not be read.", 400);

  const raw = body.value as Record<string, unknown>;
  try {
    const result = await createStaff(
      guard.env,
      {
        email: typeof raw.email === "string" ? raw.email : "",
        displayName: typeof raw.displayName === "string" ? raw.displayName : "",
        role: typeof raw.role === "string" ? raw.role : "",
      },
      actorLabel(guard.identity.email),
    );
    if (!result.ok) return errorResponse(result.error, result.status);
    return json({ ok: true, staff: result.staff }, 201);
  } catch {
    return errorResponse("The staff record could not be saved.", 500);
  }
}
