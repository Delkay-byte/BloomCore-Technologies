import { errorResponse } from "@/lib/http";
import { requireStaff } from "@/lib/leads/guard";
import {
  actorLabel,
  getVisibleLeadsForExport,
  recordActivity,
  type LeadFilters,
  type LeadRow,
} from "@/lib/leads/repository";

export const dynamic = "force-dynamic";

const COLUMNS: ReadonlyArray<{ header: string; key: keyof LeadRow }> = [
  { header: "Lead number", key: "lead_number" },
  { header: "Received", key: "created_at" },
  { header: "Name", key: "full_name" },
  { header: "Email", key: "email" },
  { header: "Phone", key: "phone" },
  { header: "Organisation", key: "organization" },
  { header: "Country/region", key: "country_or_region" },
  { header: "Enquiry type", key: "enquiry_type" },
  { header: "Product", key: "product" },
  { header: "Status", key: "status" },
  { header: "Assigned to", key: "assigned_to" },
  { header: "Next action", key: "next_action" },
  { header: "Next follow-up", key: "next_follow_up_at" },
  { header: "Message", key: "message" },
];

function csvCell(value: unknown): string {
  const textValue = value == null ? "" : String(value);
  return `"${textValue.replace(/"/g, '""')}"`;
}

export async function GET(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const params = new URL(request.url).searchParams;
  const filters: LeadFilters = {
    search: params.get("q")?.trim() || undefined,
    product: params.get("product")?.trim() || undefined,
    enquiryType: params.get("type")?.trim() || undefined,
    status: params.get("status")?.trim() || undefined,
    archived: params.get("archived") === "1",
    sort: "newest",
    pageSize: 500,
  };

  try {
    const rows = await getVisibleLeadsForExport(guard.env, filters, 500);
    const header = COLUMNS.map((column) => csvCell(column.header)).join(",");
    const body = rows.map((row) => COLUMNS.map((column) => csvCell(row[column.key])).join(","));
    const csv = [header, ...body].join("\r\n");

    const actor = actorLabel(guard.identity.email);
    await Promise.all(
      rows.slice(0, 200).map((row) =>
        recordActivity(
          guard.env.LEADS_DB,
          row.id,
          "exported",
          "Lead exported to CSV",
          null,
          actor,
        ),
      ),
    );

    const filename = `bloomcore-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return errorResponse("The export could not be generated.", 500);
  }
}
