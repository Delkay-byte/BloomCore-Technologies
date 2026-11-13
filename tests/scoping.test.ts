import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createTestDatabase, insertLead, type TestDatabase } from "./helpers/d1.ts";
import { getMetrics, listLeads } from "../src/lib/leads/repository.ts";
import {
  countUnreadNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../src/lib/leads/notifications.ts";
import type { LeadEnv } from "../src/lib/leads/db.ts";

/**
 * Role scoping runs in SQL, not in the component: a worker's list, metrics and
 * notification queries are restricted to leads assigned to them.
 */

let database: TestDatabase;
let env: LeadEnv;

beforeEach(() => {
  database = createTestDatabase();
  env = { LEADS_DB: database } as unknown as LeadEnv;
});

async function notify(leadId: string, readAt: string | null = null): Promise<string> {
  const id = crypto.randomUUID();
  const timestamp = "2026-11-13T09:00:00.000Z";
  await database
    .prepare(
      `INSERT INTO notifications (id, lead_id, type, recipient, channel, subject, status, read_at, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(id, leadId, "assignment", "dashboard", "dashboard", "Assigned", "sent", readAt, timestamp, timestamp)
    .run();
  return id;
}

test("a worker's lead list excludes leads assigned elsewhere", async () => {
  const mine = await insertLead(env, {
    leadNumber: "BC-2026-000101",
    assignedTo: "kwame@example.com",
  });
  const other = await insertLead(env, {
    leadNumber: "BC-2026-000102",
    assignedTo: "ama@example.com",
  });
  const unassigned = await insertLead(env, { leadNumber: "BC-2026-000103" });

  const scoped = await listLeads(env, {}, { assignedTo: "kwame@example.com" });
  assert.deepEqual(scoped.rows.map((row) => row.id), [mine]);
  assert.equal(scoped.total, 1);
  assert.equal(scoped.totalUnfiltered, 1, "the scope total also excludes other workers");

  const unscoped = await listLeads(env, {});
  assert.equal(unscoped.total, 3);
  assert.ok([other, unassigned].every((id) => unscoped.rows.some((row) => row.id === id)));
});

test("a hand-edited owner filter cannot widen a worker's scope", async () => {
  const mine = await insertLead(env, {
    leadNumber: "BC-2026-000104",
    assignedTo: "kwame@example.com",
  });
  await insertLead(env, {
    leadNumber: "BC-2026-000105",
    assignedTo: "ama@example.com",
  });

  const result = await listLeads(
    env,
    { assigned: "ama@example.com" },
    { assignedTo: "kwame@example.com" },
  );

  assert.deepEqual(result.rows.map((row) => row.id), [mine]);
});

test("worker metrics describe only their own workload", async () => {
  await insertLead(env, {
    leadNumber: "BC-2026-000106",
    assignedTo: "kwame@example.com",
    status: "new",
  });
  await insertLead(env, {
    leadNumber: "BC-2026-000107",
    assignedTo: "kwame@example.com",
    status: "won",
  });
  await insertLead(env, {
    leadNumber: "BC-2026-000108",
    assignedTo: "ama@example.com",
    status: "won",
  });

  const scoped = await getMetrics(env, { assignedTo: "kwame@example.com" });
  assert.equal(scoped.total, 2);
  assert.equal(scoped.new, 1);
  assert.equal(scoped.won, 1);

  const all = await getMetrics(env);
  assert.equal(all.total, 3);
  assert.equal(all.won, 2);
});

test("worker notifications are limited to their assigned leads", async () => {
  const mineLead = await insertLead(env, {
    leadNumber: "BC-2026-000109",
    assignedTo: "kwame@example.com",
  });
  const otherLead = await insertLead(env, {
    leadNumber: "BC-2026-000110",
    assignedTo: "ama@example.com",
  });
  const mine = await notify(mineLead);
  const other = await notify(otherLead);

  const scoped = await listNotifications(env, { assignedTo: "kwame@example.com" });
  assert.deepEqual(scoped.map((row) => row.id), [mine]);

  assert.equal(await countUnreadNotifications(env, { assignedTo: "kwame@example.com" }), 1);
  assert.equal(await countUnreadNotifications(env), 2);

  assert.equal(
    await markNotificationRead(env, other, { assignedTo: "kwame@example.com" }),
    "not_found",
    "a worker cannot mark another worker's notification read",
  );
  assert.equal(await countUnreadNotifications(env), 2, "the refused update changed nothing");
});

test("marking all read is scoped so it cannot clear other workers' badges", async () => {
  const mineLead = await insertLead(env, {
    leadNumber: "BC-2026-000111",
    assignedTo: "kwame@example.com",
  });
  const otherLead = await insertLead(env, {
    leadNumber: "BC-2026-000112",
    assignedTo: "ama@example.com",
  });
  await notify(mineLead);
  await notify(otherLead);

  const marked = await markAllNotificationsRead(env, { assignedTo: "kwame@example.com" });
  assert.equal(marked, 1);
  assert.equal(await countUnreadNotifications(env, { assignedTo: "kwame@example.com" }), 0);
  assert.equal(await countUnreadNotifications(env, { assignedTo: "ama@example.com" }), 1);
});
