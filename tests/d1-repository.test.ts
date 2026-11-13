import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createTestDatabase, insertLead, type TestDatabase } from "./helpers/d1.ts";
import {
  getLeadDetail,
  listLeads,
  updateLead,
  type LeadRow,
} from "../src/lib/leads/repository.ts";

/**
 * Repository regressions against real SQLite.
 *
 * These exercise the exact SQL the console and the API run: date-range
 * inclusivity, NULL product handling, archive scoping, pagination clamping and
 * the update path that the "Save" button calls.
 */

let database: TestDatabase;
let env: { LEADS_DB: TestDatabase };

beforeEach(() => {
  database = createTestDatabase();
  env = { LEADS_DB: database };
});

async function readLead(id: string): Promise<LeadRow> {
  const detail = await getLeadDetail(env, id);
  assert.ok(detail, "lead should exist");
  return detail.lead;
}

async function activityCount(id: string): Promise<number> {
  const detail = await getLeadDetail(env, id);
  return detail?.activity.length ?? 0;
}

/* ------------------------------------------------------------ updateLead */

test("saving only the owner persists it and records one assignment", async () => {
  const id = await insertLead(env, { leadNumber: "BC-2026-900001" });
  const before = await activityCount(id);

  const updated = await updateLead(
    env,
    id,
    { assignedTo: "saviour.amegayie.ds@gmail.com" },
    "saviour.amegayie.ds@gmail.com",
  );

  assert.equal(updated?.assigned_to, "saviour.amegayie.ds@gmail.com");
  const persisted = await readLead(id);
  assert.equal(persisted.assigned_to, "saviour.amegayie.ds@gmail.com");
  assert.equal(await activityCount(id), before + 1);
});

test("saving only the follow-up persists the exact UTC instant", async () => {
  const id = await insertLead(env, { leadNumber: "BC-2026-900002" });

  const updated = await updateLead(
    env,
    id,
    { nextFollowUpAt: "2026-11-19T10:00:00.000Z" },
    "saviour.amegayie.ds@gmail.com",
  );

  assert.equal(updated?.next_follow_up_at, "2026-11-19T10:00:00.000Z");
  assert.equal((await readLead(id)).next_follow_up_at, "2026-11-19T10:00:00.000Z");
});

test("saving only the next action persists its text", async () => {
  const id = await insertLead(env, { leadNumber: "BC-2026-900003" });

  await updateLead(env, id, { nextAction: "Pricing will be discussed" }, "staff@example.com");

  assert.equal((await readLead(id)).next_action, "Pricing will be discussed");
});

test("saving owner, follow-up and action together persists all three", async () => {
  const id = await insertLead(env, { leadNumber: "BC-2026-900004" });

  const updated = await updateLead(
    env,
    id,
    {
      assignedTo: "saviour.amegayie.ds@gmail.com",
      nextFollowUpAt: "2026-11-19T10:00:00.000Z",
      nextAction: "Pricing will be discussed",
    },
    "saviour.amegayie.ds@gmail.com",
  );

  assert.deepEqual(
    {
      assigned: updated?.assigned_to,
      followUp: updated?.next_follow_up_at,
      action: updated?.next_action,
    },
    {
      assigned: "saviour.amegayie.ds@gmail.com",
      followUp: "2026-11-19T10:00:00.000Z",
      action: "Pricing will be discussed",
    },
  );
});

test("clearing every field writes NULL, not an empty string", async () => {
  const id = await insertLead(env, {
    leadNumber: "BC-2026-900005",
    assignedTo: "staff@example.com",
    nextAction: "Call back",
    nextFollowUpAt: "2026-11-19T10:00:00.000Z",
  });

  const updated = await updateLead(
    env,
    id,
    { assignedTo: "", nextAction: "", nextFollowUpAt: "" },
    "staff@example.com",
  );

  assert.equal(updated?.assigned_to, null);
  assert.equal(updated?.next_action, null);
  assert.equal(updated?.next_follow_up_at, null);
});

test("re-saving identical values is a no-op, so retries cannot duplicate history", async () => {
  const id = await insertLead(env, {
    leadNumber: "BC-2026-900006",
    assignedTo: "staff@example.com",
  });
  await updateLead(env, id, { nextAction: "Send proposal" }, "staff@example.com");

  const snapshot = await readLead(id);
  const before = await activityCount(id);

  const again = await updateLead(
    env,
    id,
    {
      assignedTo: "staff@example.com",
      nextAction: "Send proposal",
      nextFollowUpAt: null,
    },
    "staff@example.com",
  );

  assert.equal(await activityCount(id), before, "no new activity for an unchanged save");
  assert.equal(again?.updated_at, snapshot.updated_at);
  assert.equal((await readLead(id)).next_action, "Send proposal");
});

test("an unknown lead is reported as missing rather than invented", async () => {
  const result = await updateLead(
    env,
    "00000000-0000-4000-8000-000000000000",
    { nextAction: "anything" },
    "staff@example.com",
  );
  assert.equal(result, null);
});

/* -------------------------------------------------------------- listLeads */

test("the To date includes leads created later that same day", async () => {
  const early = await insertLead(env, {
    leadNumber: "BC-2026-910001",
    createdAt: "2026-11-19T00:00:00.000Z",
  });
  const evening = await insertLead(env, {
    leadNumber: "BC-2026-910002",
    createdAt: "2026-11-19T18:00:00.000Z",
  });
  const nextDay = await insertLead(env, {
    leadNumber: "BC-2026-910003",
    createdAt: "2026-11-20T00:00:00.000Z",
  });

  const result = await listLeads(env, { from: "2026-11-19", to: "2026-11-19" });

  assert.deepEqual(result.rows.map((row) => row.id).sort(), [early, evening].sort());
  assert.equal(result.total, 2);
  assert.ok(!result.rows.some((row) => row.id === nextDay));
});

test("Not product-specific finds NULL products, not unrelated ones", async () => {
  const none = await insertLead(env, { leadNumber: "BC-2026-920001", product: null });
  await insertLead(env, { leadNumber: "BC-2026-920002", product: "tillproof" });

  const result = await listLeads(env, { product: "none" });

  assert.deepEqual(result.rows.map((row) => row.id), [none]);
});

test("archived leads are hidden by default and selectable explicitly", async () => {
  const active = await insertLead(env, { leadNumber: "BC-2026-930001" });
  const archived = await insertLead(env, {
    leadNumber: "BC-2026-930002",
    archivedAt: "2026-11-12T09:00:00.000Z",
  });

  const activeList = await listLeads(env, {});
  assert.deepEqual(activeList.rows.map((row) => row.id), [active]);
  assert.equal(activeList.totalUnfiltered, 1);

  const archivedList = await listLeads(env, { archived: true });
  assert.deepEqual(archivedList.rows.map((row) => row.id), [archived]);
  assert.equal(archivedList.totalUnfiltered, 1);
});

test("the owner filter ignores letter case", async () => {
  const id = await insertLead(env, {
    leadNumber: "BC-2026-940001",
    assignedTo: "saviour.amegayie.ds@gmail.com",
  });

  const result = await listLeads(env, { assigned: "Saviour.Amegayie.DS@Gmail.com" });
  assert.deepEqual(result.rows.map((row) => row.id), [id]);
});

test("an out-of-range page shows the last real page instead of an empty table", async () => {
  for (let index = 0; index < 3; index += 1) {
    await insertLead(env, { leadNumber: `BC-2026-95000${index + 1}` });
  }

  const result = await listLeads(env, { page: 9, pageSize: 5 });
  assert.equal(result.total, 3);
  assert.equal(result.rows.length, 3);
});

test("pagination splits results without losing the filtered total", async () => {
  for (let index = 0; index < 12; index += 1) {
    await insertLead(env, {
      leadNumber: `BC-2026-96${String(index).padStart(4, "0")}`,
      createdAt: `2026-11-${String(index + 1).padStart(2, "0")}T09:00:00.000Z`,
    });
  }

  const first = await listLeads(env, { page: 1, pageSize: 5, sort: "oldest" });
  const second = await listLeads(env, { page: 2, pageSize: 5, sort: "oldest" });

  assert.equal(first.total, 12);
  assert.equal(first.rows.length, 5);
  assert.equal(second.rows.length, 5);
  assert.equal(new Set([...first.rows, ...second.rows].map((row) => row.id)).size, 10);
});

test("a malformed date returns nothing and an explanation", async () => {
  await insertLead(env, { leadNumber: "BC-2026-970001" });

  const result = await listLeads(env, { from: "2026-02-30" });

  assert.equal(result.rows.length, 0);
  assert.equal(result.dateError, "Enter a valid date (YYYY-MM-DD).");
});

test("follow-ups due only returns leads whose reminder time has passed", async () => {
  const due = await insertLead(env, {
    leadNumber: "BC-2026-980001",
    nextFollowUpAt: "2020-01-01T00:00:00.000Z",
  });
  await insertLead(env, {
    leadNumber: "BC-2026-980002",
    nextFollowUpAt: "2099-01-01T00:00:00.000Z",
  });
  await insertLead(env, { leadNumber: "BC-2026-980003", nextFollowUpAt: null });

  const result = await listLeads(env, { followUpDue: true });
  assert.deepEqual(result.rows.map((row) => row.id), [due]);
});
