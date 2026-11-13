import assert from "node:assert/strict";
import { test } from "node:test";
import { ASSIGNEE_MAX, NEXT_ACTION_MAX, parseLeadFields } from "../src/lib/leads/patch.ts";

/**
 * The save endpoint's validation contract.
 *
 * Defect 1 reported "The change could not be saved" for every save. Once the
 * Access problem was fixed, the remaining risk was a validation message that
 * neither names the field nor says what to do. These tests pin the exact text
 * and the clearing behaviour the console depends on.
 */

function parse(raw: Record<string, unknown>, allowEmpty = false) {
  const result = parseLeadFields(raw, { allowEmpty });
  assert.equal(result.ok, true, "expected the body to be accepted");
  if (!result.ok) throw new Error(result.message);
  return result.patch;
}

function reject(raw: Record<string, unknown>): string {
  const result = parseLeadFields(raw);
  assert.equal(result.ok, false, "expected the body to be rejected");
  if (result.ok) throw new Error("expected a validation error");
  return result.message;
}

test("an owner address is trimmed and stored in canonical lower case", () => {
  assert.deepEqual(parse({ assignedTo: "  Saviour.Amegayie.DS@Gmail.com  " }), {
    assignedTo: "saviour.amegayie.ds@gmail.com",
  });
});

test("an empty owner clears the field instead of saving an empty string", () => {
  assert.deepEqual(parse({ assignedTo: "   " }), { assignedTo: null });
});

test("an unusable owner address explains how to proceed", () => {
  assert.equal(
    reject({ assignedTo: "saviour at gmail" }),
    "Enter a valid email address for the owner, or clear the field.",
  );
});

test("an over-long owner address names its limit", () => {
  const message = reject({ assignedTo: `${"a".repeat(ASSIGNEE_MAX)}@example.com` });
  assert.equal(message, `An owner email address must be ${ASSIGNEE_MAX} characters or fewer.`);
});

test("the next action is trimmed and can be cleared", () => {
  assert.deepEqual(parse({ nextAction: "  Pricing will be discussed  " }), {
    nextAction: "Pricing will be discussed",
  });
  assert.deepEqual(parse({ nextAction: "" }), { nextAction: null });
});

test("an over-long next action names its limit", () => {
  assert.equal(
    reject({ nextAction: "x".repeat(NEXT_ACTION_MAX + 1) }),
    `The next action must be ${NEXT_ACTION_MAX} characters or fewer.`,
  );
});

test("a valid follow-up is stored as one canonical UTC instant", () => {
  const wallClock = "2026-11-19T10:00";
  assert.deepEqual(parse({ nextFollowUpAt: wallClock }), {
    nextFollowUpAt: new Date(wallClock).toISOString(),
  });
});

test("an empty follow-up clears the reminder", () => {
  assert.deepEqual(parse({ nextFollowUpAt: "   " }), { nextFollowUpAt: null });
});

test("a malformed follow-up explains how to proceed", () => {
  assert.equal(
    reject({ nextFollowUpAt: "next tuesday" }),
    "Enter a valid follow-up date and time, or clear the field.",
  );
});

test("a save with no recognised fields is refused, not silently ignored", () => {
  assert.equal(reject({}), "There is nothing to save.");
  assert.equal(reject({ fullName: "Ignored" }), "There is nothing to save.");
});

test("a stage change alone is a valid save body", () => {
  // The route passes allowEmpty when the stage branch already recorded a change.
  assert.deepEqual(parseLeadFields({}, { allowEmpty: true }), { ok: true, patch: {} });
});

test("the combined save the console sends produces exactly three fields", () => {
  const patch = parse({
    assignedTo: "saviour.amegayie.ds@gmail.com",
    nextFollowUpAt: "2026-11-19T10:00",
    nextAction: "Pricing will be discussed",
  });

  assert.deepEqual(Object.keys(patch).sort(), ["assignedTo", "nextAction", "nextFollowUpAt"]);
  assert.equal(patch.assignedTo, "saviour.amegayie.ds@gmail.com");
  assert.equal(patch.nextAction, "Pricing will be discussed");
  assert.equal(patch.nextFollowUpAt, new Date("2026-11-19T10:00").toISOString());
});

test("unexpected fields are never copied into the update", () => {
  const patch = parse({ assignedTo: "owner@example.com", status: undefined, fullName: "Nope" });
  assert.equal("status" in patch, false);
  assert.equal("fullName" in patch, false);
});
