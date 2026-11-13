import { errorResponse, json } from "@/lib/http";
import { requireStaff } from "@/lib/leads/guard";
import { leadScopeEmail } from "@/lib/leads/permissions";
import { listLeads, type LeadFilters } from "@/lib/leads/repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const params = new URL(request.url).searchParams;
  const sortParam = params.get("sort");
  const filters: LeadFilters = {
    search: params.get("q")?.trim() || undefined,
    product: params.get("product")?.trim() || undefined,
    enquiryType: params.get("type")?.trim() || undefined,
    status: params.get("status")?.trim() || undefined,
    assigned: params.get("assigned")?.trim() || undefined,
    from: params.get("from")?.trim() || undefined,
    to: params.get("to")?.trim() || undefined,
    followUpDue: params.get("due") === "1",
    archived: params.get("archived") === "1",
    sort: sortParam === "oldest" || sortParam === "follow_up" ? sortParam : "newest",
    page: Number(params.get("page") ?? "1") || 1,
    pageSize: Number(params.get("pageSize") ?? "25") || 25,
  };

  try {
    const { rows, total } = await listLeads(guard.env, filters, {
      assignedTo: leadScopeEmail(guard.staff.role, guard.staff.email),
    });
    return json({ ok: true, leads: rows, total, page: filters.page, pageSize: filters.pageSize });
  } catch {
    return errorResponse("The lead list could not be loaded.", 500);
  }
}
