import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { createTestDatabase, insertLead, type TestDatabase } from "./helpers/d1.ts";
import {
  addNote,
  updateLead,
  type NotificationRow,
} from "../src/lib/leads/repository.ts";
import { drainOutbox } from "../src/lib/leads/notifications.ts";
import { createStaff } from "../src/lib/leads/staff.ts";
import type { LeadEnv } from "../src/lib/leads/db.ts";

/**
 * Assignment email behaviour.
 *
 * The assignment and its queued notification commit together; delivery is a
 * later, retryable step. Re-saving an unchanged assignment must never produce
 * another email, and a Resend failure must never undo the assignment.
 */

const OWNER = "bloomcoretechnologies@gmail.com";

let database: TestDatabase;
let env: LeadEnv;

beforeEach(async () => {
  database = createTestDatabase();
  env = {
    LEADS_DB: database,
    LEAD_OWNER_EMAILS: OWNER,
    EMAIL_FROM: "BloomCore Technologies <notifications@notify.bloomcoretech.com>",
    DASHBOARD_ORIGIN: "https://bloomcoretech.com",
    RESEND_API_KEY: "test-key",
  } as unknown as LeadEnv;

  await createStaff(
    env,
    { email: "kwame@example.com", displayName: "Kwame Mensah", role: "staff_member" },
    OWNER,
  );
  await createStaff(
    env,
    { email: "ama@example.com", displayName: "Ama Owusu", role: "staff_member" },
    OWNER,
  );
});

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

async function notificationsFor(leadId: string): Promise<NotificationRow[]> {
  const result = await database
    .prepare("SELECT * FROM notifications WHERE lead_id = ? ORDER BY channel, recipient")
    .bind(leadId)
    .all<NotificationRow>();
  return result.results;
}

type Outgoing = { to: string[]; subject: string; html: string; text: string };

/** Capture outgoing Resend calls and answer with the supplied status. */
function stubResend(statuses: number[] = [200]): Outgoing[] {
  const sent: Outgoing[] = [];
  let call = 0;
  globalThis.fetch = (async (_url: string, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as Outgoing;
    sent.push(body);
    const status = statuses[Math.min(call, statuses.length - 1)];
    call += 1;
    if (status >= 400) {
      return new Response(JSON.stringify({ message: "provider error" }), { status });
    }
    return new Response(JSON.stringify({ id: `email_${call}` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
  return sent;
}

test("assigning an unassigned lead queues one email and one dashboard entry", async () => {
  const leadId = await insertLead(env, {
    leadNumber: "BC-2026-000007",
    nextAction: "Arrange an initial discovery conversation",
    nextFollowUpAt: "2026-11-14T09:00:00.000Z",
  });

  const updated = await updateLead(
    env,
    leadId,
    { assignedTo: "kwame@example.com" },
    OWNER,
  );
  assert.equal(updated?.assigned_to, "kwame@example.com");

  const rows = await notificationsFor(leadId);
  assert.equal(rows.length, 2, "one email and one in-app notification");

  const email = rows.find((row) => row.channel === "email");
  assert.ok(email);
  assert.equal(email.type, "assignment");
  assert.equal(email.recipient, "kwame@example.com");
  assert.equal(email.status, "pending");
  assert.match(email.subject ?? "", /New lead assigned — BC-2026-000007/);

  const payload = JSON.parse(email.payload ?? "{}");
  assert.equal(payload.assigneeName, "Kwame Mensah");
  assert.equal(payload.assigner, OWNER);
  assert.equal(payload.reassigned, false);

  const dashboard = rows.find((row) => row.channel === "dashboard");
  assert.ok(dashboard);
  assert.equal(dashboard.status, "sent");
  assert.match(dashboard.subject ?? "", /assigned to Kwame Mensah/);
});

test("re-saving the same assignment creates no duplicate notification", async () => {
  const leadId = await insertLead(env, { leadNumber: "BC-2026-000007" });
  await updateLead(env, leadId, { assignedTo: "kwame@example.com" }, OWNER);

  await updateLead(env, leadId, { assignedTo: "kwame@example.com" }, OWNER);
  await updateLead(env, leadId, { assignedTo: "KWAME@example.com" }, OWNER);

  assert.equal((await notificationsFor(leadId)).length, 2);
});

test("a follow-up-only update sends no assignment email", async () => {
  const leadId = await insertLead(env, {
    leadNumber: "BC-2026-000008",
    assignedTo: "kwame@example.com",
  });

  await updateLead(
    env,
    leadId,
    { nextAction: "Send the proposal", nextFollowUpAt: "2026-11-20T10:00:00.000Z" },
    OWNER,
  );

  assert.equal((await notificationsFor(leadId)).length, 0);
});

test("reassignment notifies the new worker once and not the previous worker", async () => {
  const leadId = await insertLead(env, { leadNumber: "BC-2026-000009" });
  await updateLead(env, leadId, { assignedTo: "kwame@example.com" }, OWNER);
  await updateLead(env, leadId, { assignedTo: "ama@example.com" }, OWNER);

  const rows = await notificationsFor(leadId);
  const emails = rows.filter((row) => row.channel === "email");
  assert.equal(emails.length, 2);
  assert.equal(emails.filter((row) => row.recipient === "kwame@example.com").length, 1);
  const toAma = emails.find((row) => row.recipient === "ama@example.com");
  assert.ok(toAma);
  assert.match(toAma.subject ?? "", /Lead reassigned — BC-2026-000009/);
  assert.equal(JSON.parse(toAma.payload ?? "{}").reassigned, true);
});

test("delivery sends the assignment email to the registered worker with a secure link", async () => {
  const leadId = await insertLead(env, {
    leadNumber: "BC-2026-000007",
    name: "Akosua Boateng",
    organization: "ABC School",
    nextAction: "Arrange an initial discovery conversation",
    nextFollowUpAt: "2026-11-14T09:00:00.000Z",
  });
  await updateLead(env, leadId, { assignedTo: "kwame@example.com" }, OWNER);
  await addNote(env, leadId, OWNER, "Private note that must not leave the Lead Desk");

  const sent = stubResend([200]);
  const { processed } = await drainOutbox(env);

  assert.equal(processed, 1);
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].to, ["kwame@example.com"]);
  assert.match(sent[0].subject, /New lead assigned to you — BC-2026-000007/);
  assert.match(sent[0].text, /Hello Kwame/);
  assert.match(sent[0].text, /ABC School/);
  assert.match(sent[0].text, /https:\/\/bloomcoretech\.com\/internal\/leads\//);
  assert.match(sent[0].text, /14 November 2026/);
  assert.match(sent[0].text, /BloomCore Technologies/);
  assert.ok(!sent[0].html.includes("Private note"), "internal notes never appear in email");

  const rows = await notificationsFor(leadId);
  const email = rows.find((row) => row.channel === "email");
  assert.equal(email?.status, "sent");
  assert.equal(email?.provider_ref, "email_1");

  // A second drain must not resend an accepted email.
  const again = await drainOutbox(env);
  assert.equal(again.processed, 0);
  assert.equal(sent.length, 1);
});

test("a Resend failure keeps the assignment and the queued email for retry", async () => {
  const leadId = await insertLead(env, { leadNumber: "BC-2026-000010" });
  await updateLead(env, leadId, { assignedTo: "kwame@example.com" }, OWNER);

  stubResend([500]);
  await drainOutbox(env);

  const afterFailure = await notificationsFor(leadId);
  const email = afterFailure.find((row) => row.channel === "email");
  assert.equal(email?.status, "pending", "a transient failure is retried");
  assert.equal(email?.attempt_count, 1);
  assert.equal(email?.failure_reason, "http_500");
  assert.equal((await getAssignment(leadId))?.assigned_to, "kwame@example.com");

  const sent = stubResend([200]);
  await drainOutbox(env);
  assert.equal(sent.length, 1, "the retry sends exactly once");
  const afterRetry = await notificationsFor(leadId);
  assert.equal(afterRetry.find((row) => row.channel === "email")?.status, "sent");
});

async function getAssignment(leadId: string): Promise<{ assigned_to: string | null } | null> {
  return database
    .prepare("SELECT assigned_to FROM leads WHERE id = ?")
    .bind(leadId)
    .first<{ assigned_to: string | null }>();
}

test("a permanent provider rejection is recorded and the assignment survives", async () => {
  const leadId = await insertLead(env, { leadNumber: "BC-2026-000011" });
  await updateLead(env, leadId, { assignedTo: "ama@example.com" }, OWNER);

  stubResend([422]);
  await drainOutbox(env);

  const email = (await notificationsFor(leadId)).find((row) => row.channel === "email");
  assert.equal(email?.status, "failed");
  assert.equal(email?.failure_reason, "http_422");
  assert.equal((await getAssignment(leadId))?.assigned_to, "ama@example.com");
});
