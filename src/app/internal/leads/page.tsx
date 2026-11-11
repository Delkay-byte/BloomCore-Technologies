import Link from "next/link";
import { ConsoleSignInRequired } from "@/components/internal/ConsoleGuard";
import {
  ENQUIRY_CATEGORIES,
  LEAD_PRODUCTS,
  PIPELINE_STAGES,
  STAGE_LABELS,
  categoryLabel,
  productLabel,
  type PipelineStage,
} from "@/lib/leads/domain";
import { getMetrics, listLeads, type LeadFilters } from "@/lib/leads/repository";
import { currentStaff } from "@/lib/leads/session";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const asString = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "won"
      ? "bg-accent text-accent-contrast"
      : status === "lost" || status === "unqualified"
        ? "bg-surface-3 text-foreground-subtle"
        : status === "new"
          ? "bg-gold text-gold-contrast"
          : "bg-surface-2 text-foreground ring-1 ring-inset ring-line-strong";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-bold ${tone}`}>
      {STAGE_LABELS[status as PipelineStage] ?? status}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius)] bg-surface p-4">
      <p className="text-[0.75rem] font-semibold tracking-wide text-foreground-faint uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-[1.9rem] leading-none text-foreground">{value}</p>
    </div>
  );
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { env, identity } = await currentStaff();
  if (!identity) return <ConsoleSignInRequired />;

  const params = await searchParams;
  const filters: LeadFilters = {
    search: asString(params.q) || undefined,
    product: asString(params.product) || undefined,
    enquiryType: asString(params.type) || undefined,
    status: asString(params.status) || undefined,
    from: asString(params.from) || undefined,
    to: asString(params.to) || undefined,
    followUpDue: asString(params.due) === "1",
    archived: asString(params.archived) === "1",
    sort:
      asString(params.sort) === "oldest"
        ? "oldest"
        : asString(params.sort) === "follow_up"
          ? "follow_up"
          : "newest",
    page: Number(asString(params.page) || "1") || 1,
    pageSize: 25,
  };

  const [{ rows, total }, metrics] = await Promise.all([
    listLeads(env, filters),
    getMetrics(env),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / 25));
  const page = filters.page ?? 1;
  const hasFilters = Boolean(
    filters.search || filters.product || filters.enquiryType || filters.status || filters.followUpDue,
  );

  const pageQuery = (target: number): string => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      const single = asString(value);
      if (single) next.set(key, single);
    }
    next.set("page", String(target));
    return `/internal/leads?${next.toString()}`;
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h3 text-[1.7rem] text-foreground">Leads</h1>
          <p className="mt-1 text-[0.9375rem] text-foreground-subtle">
            {total} {total === 1 ? "enquiry" : "enquiries"} {hasFilters ? "match the filters" : "recorded"}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/internal/notifications"
            className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Notifications
            {metrics.unreadNotifications > 0 && (
              <span className="ml-2 inline-flex min-w-[1.4rem] justify-center rounded-full bg-gold px-1.5 py-0.5 text-[0.75rem] font-bold text-gold-contrast">
                {metrics.unreadNotifications}
              </span>
            )}
          </Link>
          <a
            href="/api/internal/export"
            className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Total" value={metrics.total} />
        <Metric label="New" value={metrics.new} />
        <Metric label="This week" value={metrics.thisWeek} />
        <Metric label="Qualified" value={metrics.qualified} />
        <Metric label="Follow-ups due" value={metrics.followUpsDue} />
        <Metric label="Unread" value={metrics.unreadNotifications} />
      </div>

      <form
        method="get"
        action="/internal/leads"
        className="mt-6 rounded-[var(--radius)] bg-surface p-4"
        role="search"
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Search
            <input
              type="search"
              name="q"
              defaultValue={filters.search ?? ""}
              placeholder="Name, email, organisation or lead number"
              className="field mt-1.5"
            />
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Status
            <select name="status" defaultValue={filters.status ?? ""} className="field mt-1.5">
              <option value="">Any status</option>
              {PIPELINE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Product
            <select name="product" defaultValue={filters.product ?? ""} className="field mt-1.5">
              <option value="">Any product</option>
              {LEAD_PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Enquiry type
            <select name="type" defaultValue={filters.enquiryType ?? ""} className="field mt-1.5">
              <option value="">Any type</option>
              {ENQUIRY_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            From date
            <input type="date" name="from" defaultValue={filters.from ?? ""} className="field mt-1.5" />
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            To date
            <input type="date" name="to" defaultValue={filters.to ?? ""} className="field mt-1.5" />
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Sort
            <select name="sort" defaultValue={filters.sort ?? "newest"} className="field mt-1.5">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="follow_up">Next follow-up</option>
            </select>
          </label>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-[0.875rem] font-medium text-foreground">
              <input
                type="checkbox"
                name="due"
                value="1"
                defaultChecked={filters.followUpDue}
                className="h-4 w-4"
              />
              Follow-ups due
            </label>
            <label className="flex items-center gap-2 text-[0.875rem] font-medium text-foreground">
              <input
                type="checkbox"
                name="archived"
                value="1"
                defaultChecked={filters.archived}
                className="h-4 w-4"
              />
              Archived
            </label>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-[7px] bg-accent px-5 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong"
          >
            Apply filters
          </button>
          {hasFilters && (
            <Link
              href="/internal/leads"
              className="text-[0.875rem] font-semibold text-foreground-subtle underline underline-offset-4 hover:text-foreground"
            >
              Clear filters
            </Link>
          )}
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius)] bg-surface p-10 text-center">
          <p className="font-display text-[1.6rem] text-foreground">No leads to show</p>
          <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-6 text-foreground-subtle">
            {hasFilters
              ? "No enquiries match these filters. Clear them to see everything."
              : "No enquiries have been received yet. New submissions appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[var(--radius)] bg-surface">
          <table className="w-full border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-line text-[0.75rem] tracking-wide text-foreground-faint uppercase">
                <th className="px-4 py-3 font-semibold">Lead</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Enquiry</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Received</th>
                <th className="px-4 py-3 font-semibold">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id} className="border-b border-line last:border-0 hover:bg-surface-2">
                  <td className="px-4 py-3 align-top">
                    <Link
                      href={`/internal/leads/${lead.id}`}
                      className="font-semibold text-foreground underline-offset-4 hover:underline"
                    >
                      {lead.lead_number}
                    </Link>
                    {lead.archived_at && (
                      <span className="ml-2 text-[0.75rem] text-foreground-faint">archived</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="font-medium text-foreground">{lead.full_name}</span>
                    <span className="mt-0.5 block break-all text-[0.8125rem] text-foreground-subtle">
                      {lead.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-foreground-subtle">
                    {categoryLabel(lead.enquiry_type)}
                    <span className="mt-0.5 block text-[0.8125rem]">
                      {lead.product ? productLabel(lead.product) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 align-top text-foreground-subtle">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-4 py-3 align-top text-foreground-subtle">
                    {formatDate(lead.next_follow_up_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between">
          {page > 1 ? (
            <Link
              href={pageQuery(page - 1)}
              className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground hover:bg-surface-2"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <p className="text-[0.875rem] text-foreground-subtle">
            Page {page} of {totalPages}
          </p>
          {page < totalPages ? (
            <Link
              href={pageQuery(page + 1)}
              className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground hover:bg-surface-2"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
