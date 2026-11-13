import assert from "node:assert/strict";
import { test } from "node:test";
import {
  INVALID_DATE_MESSAGE,
  REVERSED_DATE_MESSAGE,
  buildLeadWhere,
  hasActiveFilters,
  isProductlessFilter,
  normalizeDateRange,
  orderFor,
  parseCalendarDay,
} from "../src/lib/leads/filters.ts";

/**
 * Filter-building regressions.
 *
 * The console, the list API and the CSV export all build their WHERE clause
 * here, so these assertions cover the three production complaints directly:
 * the end date dropped its final day, "Not product-specific" matched nothing,
 * and Clear/URL state ignored the date and archive filters.
 */

test("the To date includes the whole selected day", () => {
  const range = normalizeDateRange("2026-11-01", "2026-11-19");
  assert.equal(range.error, undefined);
  assert.equal(range.from, "2026-11-01T00:00:00.000Z");
  // Half-open: the 20th at 00:00 is excluded, everything on the 19th included.
  assert.equal(range.toExclusive, "2026-11-20T00:00:00.000Z");
});

test("a single-day range is not empty", () => {
  const range = normalizeDateRange("2026-11-19", "2026-11-19");
  assert.equal(range.from, "2026-11-19T00:00:00.000Z");
  assert.equal(range.toExclusive, "2026-11-20T00:00:00.000Z");
});

test("the To date alone also covers its full day", () => {
  const range = normalizeDateRange(undefined, "2026-12-31");
  assert.equal(range.from, undefined);
  assert.equal(range.toExclusive, "2027-01-01T00:00:00.000Z");
});

test("impossible calendar days are rejected instead of silently dropped", () => {
  assert.equal(parseCalendarDay("2026-02-30"), null);
  assert.equal(parseCalendarDay("19/11/2026"), null);
  assert.equal(parseCalendarDay(""), null);
  assert.equal(parseCalendarDay("2026-02-28"), "2026-02-28");
  assert.deepEqual(normalizeDateRange("2026-02-30", ""), { error: INVALID_DATE_MESSAGE });
});

test("a reversed range is reported", () => {
  assert.deepEqual(normalizeDateRange("2026-11-20", "2026-11-19"), {
    error: REVERSED_DATE_MESSAGE,
  });
});

test("an invalid date can never fall back to the unfiltered list", () => {
  const where = buildLeadWhere({ from: "not-a-date" });
  assert.equal(where.sql, "1 = 0");
  assert.deepEqual(where.params, []);
  assert.equal(where.dateError, INVALID_DATE_MESSAGE);
});

test("dates and archive state are part of the active-filter test", () => {
  assert.equal(hasActiveFilters({}), false);
  assert.equal(hasActiveFilters({ from: "2026-11-01" }), true);
  assert.equal(hasActiveFilters({ to: "2026-11-01" }), true);
  assert.equal(hasActiveFilters({ archived: true }), true);
  assert.equal(hasActiveFilters({ followUpDue: true }), true);
  assert.equal(hasActiveFilters({ search: "   " }), false);
});

test("Not product-specific matches NULL, empty and legacy 'none'", () => {
  const where = buildLeadWhere({ product: "none" });
  assert.match(where.sql, /product IS NULL/);
  assert.match(where.sql, /product = 'none'/);
  assert.equal(where.params.length, 0);
  assert.equal(isProductlessFilter("None"), true);
  assert.equal(isProductlessFilter("tillproof"), false);
});

test("a real product filter is parameterised", () => {
  const where = buildLeadWhere({ product: "tillproof" });
  assert.ok(where.sql.includes("product = ?"));
  assert.deepEqual(where.params, ["tillproof"]);
});

test("the default list excludes archived leads and archived=1 selects them", () => {
  assert.match(buildLeadWhere({}).sql, /archived_at IS NULL/);
  assert.match(buildLeadWhere({ archived: true }).sql, /archived_at IS NOT NULL/);
});

test("search is case-insensitive across the documented fields", () => {
  const where = buildLeadWhere({ search: "  QA@Example.COM " });
  assert.match(where.sql, /lower\(email\) LIKE \?/);
  assert.match(where.sql, /lower\(full_name\) LIKE \?/);
  assert.match(where.sql, /lower\(lead_number\) LIKE \?/);
  assert.equal(where.params.length, 5);
  for (const param of where.params) assert.equal(param, "%qa@example.com%");
});

test("owner filtering compares case-insensitively", () => {
  const where = buildLeadWhere({ assigned: "Saviour.Amegayie@Example.com" });
  assert.match(where.sql, /lower\(coalesce\(assigned_to, ''\)\) = \?/);
  assert.deepEqual(where.params, ["saviour.amegayie@example.com"]);
});

test("follow-ups due compares against the supplied instant", () => {
  const now = new Date("2026-11-19T10:00:00.000Z");
  const where = buildLeadWhere({ followUpDue: true }, now);
  assert.match(where.sql, /next_follow_up_at <= \?/);
  assert.ok(where.params.includes("2026-11-19T10:00:00.000Z"));
});

test("sort orders put undated follow-ups last", () => {
  assert.equal(orderFor("newest"), "created_at DESC");
  assert.equal(orderFor("oldest"), "created_at ASC");
  assert.equal(orderFor("follow_up"), "next_follow_up_at IS NULL, next_follow_up_at ASC");
});
