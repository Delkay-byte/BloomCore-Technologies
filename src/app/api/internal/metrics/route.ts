import { errorResponse, json } from "@/lib/http";
import { requireStaff } from "@/lib/leads/guard";
import { getMetrics } from "@/lib/leads/repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;
  try {
    return json({ ok: true, metrics: await getMetrics(guard.env) });
  } catch {
    return errorResponse("Metrics could not be loaded.", 500);
  }
}
