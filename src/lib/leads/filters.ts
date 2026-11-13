/**
 * Pure lead-filter helpers.
 *
 * Kept free of database and framework imports so the console, the internal API
 * and the Node test runner all build their queries from the same rules.
 */

export type LeadFilters = {
  search?: string;
  product?: string;
  enquiryType?: string;
  status?: string;
  assigned?: string;
  from?: string;
  to?: string;
  followUpDue?: boolean;
  archived?: boolean;
  sort?: "newest" | "oldest" | "follow_up";
  page?: number;
  pageSize?: number;
};

export type DateRange = {
  /** Inclusive UTC start, as an ISO timestamp. */
  from?: string;
  /** Exclusive UTC end (start of the day after the selected `to` date). */
  toExclusive?: string;
  /** Set when a supplied date is malformed or the range is reversed. */
  error?: string;
};

export const INVALID_DATE_MESSAGE = "Enter a valid date (YYYY-MM-DD).";
export const REVERSED_DATE_MESSAGE = "The From date must be on or before the To date.";

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Parse a `YYYY-MM-DD` calendar day. Returns null for a malformed or impossible day. */
export function parseCalendarDay(value: string): string | null {
  const day = value.trim();
  if (!DAY_PATTERN.test(day)) return null;
  const [year, month, date] = day.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, date));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== date
  ) {
    return null;
  }
  return day;
}

/**
 * Turn the two `date` inputs into a half-open UTC range.
 *
 * The `to` date is inclusive for the whole day: the query uses
 * `created_at < <start of next day>`, so a lead received at 18:00 on the
 * selected end date is included. Dates are interpreted as UTC calendar days,
 * which matches the ISO-8601 UTC timestamps stored in D1.
 */
export function normalizeDateRange(fromRaw?: string, toRaw?: string): DateRange {
  const fromValue = (fromRaw ?? "").trim();
  const toValue = (toRaw ?? "").trim();

  const from = fromValue ? parseCalendarDay(fromValue) : null;
  const to = toValue ? parseCalendarDay(toValue) : null;

  if ((fromValue && !from) || (toValue && !to)) {
    return { error: INVALID_DATE_MESSAGE };
  }
  if (from && to && from > to) {
    return { error: REVERSED_DATE_MESSAGE };
  }

  const range: DateRange = {};
  if (from) range.from = `${from}T00:00:00.000Z`;
  if (to) {
    const end = new Date(`${to}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    range.toExclusive = end.toISOString();
  }
  return range;
}

/** True when a non-empty date input is not a real calendar day. */
export function isInvalidDateInput(value: string): boolean {
  return Boolean(value.trim()) && parseCalendarDay(value) === null;
}

/** A lead with no product is stored as NULL; the console calls that "none". */
export function isProductlessFilter(value: string): boolean {
  return value.trim().toLowerCase() === "none";
}

/**
 * Build the WHERE clause for a lead query. Exported for regression tests: the
 * console, the list API and the CSV export all use this function.
 */
export function buildLeadWhere(
  filters: LeadFilters,
  now: Date = new Date(),
): { sql: string; params: unknown[]; dateError?: string } {
  const clauses: string[] = [];
  const params: unknown[] = [];

  clauses.push(filters.archived ? "archived_at IS NOT NULL" : "archived_at IS NULL");

  const search = filters.search?.trim();
  if (search) {
    const like = `%${search.toLowerCase()}%`;
    clauses.push(
      "(lower(full_name) LIKE ? OR lower(email) LIKE ? OR lower(coalesce(organization,'')) LIKE ? OR lower(lead_number) LIKE ? OR lower(coalesce(product,'')) LIKE ?)",
    );
    params.push(like, like, like, like, like);
  }

  const product = filters.product?.trim();
  if (product) {
    if (isProductlessFilter(product)) {
      clauses.push("(product IS NULL OR product = '' OR product = 'none')");
    } else {
      clauses.push("product = ?");
      params.push(product);
    }
  }

  if (filters.enquiryType?.trim()) {
    clauses.push("enquiry_type = ?");
    params.push(filters.enquiryType.trim());
  }
  if (filters.status?.trim()) {
    clauses.push("status = ?");
    params.push(filters.status.trim());
  }
  if (filters.assigned?.trim()) {
    // Owner addresses are stored lower-case where the write path normalises
    // them, but older rows may not be; compare case-insensitively.
    clauses.push("lower(coalesce(assigned_to, '')) = ?");
    params.push(filters.assigned.trim().toLowerCase());
  }

  const range = normalizeDateRange(filters.from, filters.to);
  if (range.error) {
    // A malformed range must never quietly return the unfiltered list.
    return { sql: "1 = 0", params: [], dateError: range.error };
  }
  if (range.from) {
    clauses.push("created_at >= ?");
    params.push(range.from);
  }
  if (range.toExclusive) {
    clauses.push("created_at < ?");
    params.push(range.toExclusive);
  }

  if (filters.followUpDue) {
    clauses.push("next_follow_up_at IS NOT NULL AND next_follow_up_at <= ?");
    params.push(now.toISOString());
  }

  return { sql: clauses.join(" AND "), params };
}

/** Sort order. Follow-up sort keeps leads with no date at the end. */
export function orderFor(sort: LeadFilters["sort"]): string {
  switch (sort) {
    case "oldest":
      return "created_at ASC";
    case "follow_up":
      return "next_follow_up_at IS NULL, next_follow_up_at ASC";
    default:
      return "created_at DESC";
  }
}

/** True when any list restriction is active, so the console can offer Clear. */
export function hasActiveFilters(filters: LeadFilters): boolean {
  return Boolean(
    filters.search?.trim() ||
      filters.product?.trim() ||
      filters.enquiryType?.trim() ||
      filters.status?.trim() ||
      filters.assigned?.trim() ||
      filters.from?.trim() ||
      filters.to?.trim() ||
      filters.followUpDue ||
      filters.archived,
  );
}
