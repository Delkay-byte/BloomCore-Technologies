import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Console client regressions for defect 1.
 *
 * The browser console is signed in to the `/internal` Access application. Any
 * client request to `/api/internal/**` is answered by the *other* application
 * with a redirect `fetch` cannot follow, which is why every save used to fail.
 * These assertions keep console traffic on the dashboard path, keep the request
 * options that detect a re-challenge, and keep the save payload in the shape
 * the validated endpoint accepts.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function source(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

const CLIENT_COMPONENTS = [
  "src/components/internal/LeadActions.tsx",
  "src/components/internal/NotificationActions.tsx",
  "src/components/internal/NotificationOpen.tsx",
];

test("console components never call the API application path directly", () => {
  for (const file of CLIENT_COMPONENTS) {
    assert.doesNotMatch(
      source(file),
      /(fetch|staffFetch)(?:<[^>]*>)?\(\s*[`"]\/api\/internal/,
      `${file} must use /internal/api`,
    );
  }
});

test("every console request targets the same-origin dashboard twin", () => {
  for (const file of CLIENT_COMPONENTS) {
    const text = source(file);
    const calls = [...text.matchAll(/staffFetch(?:<[^>]*>)?\(\s*[`"]([^`"]+)[`"]/g)].map((m) => m[1]);
    assert.ok(calls.length > 0, `${file} should call staffFetch`);
    for (const url of calls) {
      assert.match(url, /^\/internal\/api\//, `${file} calls ${url}`);
    }
  }
});

test("staffFetch refuses to follow a silent redirect and never caches", () => {
  const client = source("src/lib/leads/staff-client.ts");
  assert.match(client, /credentials:\s*"same-origin"/);
  assert.match(client, /redirect:\s*"manual"/);
  assert.match(client, /cache:\s*"no-store"/);
  assert.match(client, /opaqueredirect/, "a re-challenge must be recognised");
  assert.match(client, /401|403/, "an expired session must be distinguished from a failure");
});

test("the follow-up input is converted with the shared timezone helpers", () => {
  const actions = source("src/components/internal/LeadActions.tsx");
  assert.match(actions, /toLocalInputValue\(nextFollowUpAt\)/);
  assert.match(actions, /fromLocalInputValue\(followUp\)/);
  // A cleared field must send "", not an invalid date.
  assert.match(actions, /fromLocalInputValue\(followUp\) \?\? ""/);
});

test("the save payload sends exactly the fields the endpoint validates", () => {
  const actions = source("src/components/internal/LeadActions.tsx");
  const patchCall = actions.slice(actions.indexOf("assignedTo: assignee"));
  const body = patchCall.slice(0, patchCall.indexOf("})"));
  for (const key of ["assignedTo", "nextAction", "nextFollowUpAt"]) {
    assert.ok(body.includes(`${key}:`), `the save body must include ${key}`);
  }
});

test("input survives a failed save and a second click is refused", () => {
  const actions = source("src/components/internal/LeadActions.tsx");
  assert.match(
    actions,
    /if \(inFlight\.current\) return/,
    "a double click must not send twice",
  );
  // The failure path must set an error and leave the controlled values intact.
  const failure = actions.slice(actions.indexOf("setError("));
  assert.ok(failure.includes("setError("), "failures are surfaced");
  assert.doesNotMatch(actions, /setAssignee\(""\)\s*;\s*setAction\(""\)/, "input is not reset on error");
});

test("opening an unread notification marks it read before navigating", () => {
  const open = source("src/components/internal/NotificationOpen.tsx");
  assert.match(open, /preventDefault\(\)/);
  assert.match(open, /method:\s*"PATCH"/);
  const navigate = open.indexOf("router.push");
  const markRead = open.indexOf("staffFetch");
  assert.ok(markRead >= 0 && navigate > markRead, "navigation happens only after the mark-read call");
});
