import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createTestDatabase, insertLead, type TestDatabase } from "./helpers/d1.ts";
import {
  countUnreadNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../src/lib/leads/notifications.ts";
import { getMetrics } from "../src/lib/leads/repository.ts";

/**
 * Unread-notification lifecycle.
 *
 * Production showed a badge stuck at 12: the count came from a page-sized
 * slice, and opening a notification never wrote `read_at`. These tests pin the
 * new contract — one COUNT for every surface, idempotent mark-read, and a
 * dashboard metric that agrees with the page.
 */

let database: TestDatabase;
let env: { LEADS_DB: TestDatabase };
let leadId: string;

beforeEach(async () => {
  database = createTestDatabase();
  env = { LEADS_DB: database };
  leadId = await insertLead(env, { leadNumber: "BC-2026-990001" });
});

async function addNotification(options: { read?: boolean; index?: number } = {}): Promise<string> {
  const id = crypto.randomUUID();
  const createdAt = `2026-11-${String((options.index ?? 1) + 1).padStart(2, "0")}T09:00:00.000Z`;
  await database
    .prepare(
      `INSERT INTO notifications (id, lead_id, type, recipient, channel, subject, status, read_at, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      id,
      leadId,
      "new_enquiry",
      "dashboard",
      "dashboard",
      "New enquiry",
      "sent",
      options.read ? createdAt : null,
      createdAt,
      createdAt,
    )
    .run();
  return id;
}

async function readAt(id: string): Promise<string | null> {
  const row = await database
    .prepare("SELECT read_at FROM notifications WHERE id = ?")
    .bind(id)
    .first<{ read_at: string | null }>();
  return row?.read_at ?? null;
}

test("the unread count covers every row, not the newest page", async () => {
  for (let index = 0; index < 130; index += 1) {
    await addNotification({ index: index % 28 });
  }

  assert.equal((await listNotifications(env, { limit: 100 })).length, 100);
  assert.equal(await countUnreadNotifications(env), 130);
});

test("a read notification is not counted", async () => {
  await addNotification({ read: true });
  const unread = await addNotification();

  assert.equal(await countUnreadNotifications(env), 1);
  assert.equal((await listNotifications(env, { unreadOnly: true })).length, 1);
  assert.equal((await listNotifications(env, { unreadOnly: true }))[0].id, unread);
});

test("opening an unread notification marks it read exactly once", async () => {
  const id = await addNotification();
  assert.equal(await countUnreadNotifications(env), 1);

  assert.equal(await markNotificationRead(env, id), "marked");
  assert.ok(await readAt(id), "read_at is persisted");
  assert.equal(await countUnreadNotifications(env), 0);

  // A double click, or a second tab, must not move the timestamp again.
  const firstReadAt = await readAt(id);
  assert.equal(await markNotificationRead(env, id), "already_read");
  assert.equal(await readAt(id), firstReadAt);
  assert.equal(await countUnreadNotifications(env), 0);
});

test("an unknown notification id is reported, not silently counted", async () => {
  await addNotification();
  assert.equal(
    await markNotificationRead(env, "00000000-0000-4000-8000-000000000000"),
    "not_found",
  );
  assert.equal(await countUnreadNotifications(env), 1);
});

test("mark-all returns the exact number changed and is safe to repeat", async () => {
  for (let index = 0; index < 12; index += 1) await addNotification({ index });
  await addNotification({ read: true });

  assert.equal(await markAllNotificationsRead(env), 12);
  assert.equal(await countUnreadNotifications(env), 0);
  assert.equal(await markAllNotificationsRead(env), 0);
});

test("the dashboard badge and the notifications page count the same rows", async () => {
  for (let index = 0; index < 7; index += 1) await addNotification({ index });
  await addNotification({ read: true });

  const metrics = await getMetrics(env);
  assert.equal(metrics.unreadNotifications, 7);
  assert.equal(metrics.unreadNotifications, await countUnreadNotifications(env));

  const [first] = await listNotifications(env, { unreadOnly: true, limit: 1 });
  await markNotificationRead(env, first.id);

  assert.equal((await getMetrics(env)).unreadNotifications, 6);
  assert.equal(await countUnreadNotifications(env), 6);
});
