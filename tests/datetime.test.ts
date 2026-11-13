import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fromLocalInputValue,
  isValidInstant,
  toLocalInputValue,
} from "../src/lib/leads/datetime.ts";

/**
 * Follow-up timezone regressions.
 *
 * The stored value is a UTC instant; the input is a local wall-clock time.
 * These tests are timezone-independent: they assert an exact round trip rather
 * than hard-coding an offset, so they pass in Accra, London and Lagos alike.
 */

test("an instant survives the datetime-local round trip", () => {
  const instants = [
    "2026-11-19T10:00:00.000Z",
    "2026-01-01T00:00:00.000Z",
    "2026-06-30T23:59:00.000Z",
    "2027-03-28T01:30:00.000Z",
  ];
  for (const iso of instants) {
    const wallClock = toLocalInputValue(iso);
    assert.match(wallClock, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    assert.equal(fromLocalInputValue(wallClock), iso);
  }
});

test("the wall-clock value is the viewer's local time, not the UTC slice", () => {
  const local = new Date(2026, 10, 19, 10, 0, 0);
  const iso = local.toISOString();
  assert.equal(toLocalInputValue(iso), "2026-11-19T10:00");
});

test("empty and malformed values clear or refuse instead of inventing a date", () => {
  assert.equal(toLocalInputValue(null), "");
  assert.equal(toLocalInputValue(""), "");
  assert.equal(toLocalInputValue("not-a-date"), "");
  assert.equal(fromLocalInputValue(""), null);
  assert.equal(fromLocalInputValue("   "), null);
  assert.equal(fromLocalInputValue("not-a-date"), null);
});

test("stored values are validated as real instants", () => {
  assert.equal(isValidInstant("2026-11-19T10:00:00.000Z"), true);
  assert.equal(isValidInstant("19/11/2026 10:00"), false);
  assert.equal(isValidInstant(""), false);
});
