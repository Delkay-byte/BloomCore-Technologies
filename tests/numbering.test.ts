import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createTestDatabase, type TestDatabase } from "./helpers/d1.ts";
import { createLead, nextLeadNumber } from "../src/lib/leads/repository.ts";
import type { LeadEnv } from "../src/lib/leads/db.ts";
import type { EnquiryInput } from "../src/lib/leads/domain.ts";

/**
 * Lead numbering.
 *
 * The sequence is the source of truth: it is never reset after cleanup, never
 * derived from COUNT(*), and a duplicate or idempotent retry never consumes a
 * second number.
 */

let database: TestDatabase;
let env: LeadEnv;

beforeEach(() => {
  database = createTestDatabase();
  env = { LEADS_DB: database } as unknown as LeadEnv;
});

const YEAR = new Date().getUTCFullYear();

function enquiry(email: string, message = "A genuine enquiry about a product."): EnquiryInput {
  return {
    fullName: "Test Contact",
    email,
    organization: "",
    phone: "",
    countryOrRegion: "",
    enquiryType: "custom_software",
    product: "tillproof",
    message,
    preferredContactMethod: "",
    projectTimeline: "",
    budgetRange: "",
    landingPage: "",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    privacyAck: true,
  };
}

async function sequenceValue(): Promise<number> {
  const row = await database
    .prepare("SELECT value FROM sequences WHERE name = 'lead_number'")
    .first<{ value: number }>();
  return row?.value ?? 0;
}

test("the next number follows the stored sequence, not the row count", async () => {
  await database.prepare("UPDATE sequences SET value = 6 WHERE name = 'lead_number'").run();
  assert.equal(await nextLeadNumber(env), `BC-${YEAR}-000007`);
  assert.equal(await sequenceValue(), 7);
});

test("a duplicate submission returns the original lead and consumes no number", async () => {
  const first = await createLead(env, enquiry("repeat@example.com"), { source: "website" });
  assert.equal(first.duplicate, false);
  assert.equal(first.lead.lead_number, `BC-${YEAR}-000001`);

  const second = await createLead(env, enquiry("repeat@example.com"), { source: "website" });
  assert.equal(second.duplicate, true);
  assert.equal(second.lead.id, first.lead.id);
  assert.equal(await sequenceValue(), 1);
});

test("an idempotent retry with the same key consumes no number", async () => {
  const first = await createLead(env, enquiry("retry@example.com"), {
    source: "website",
    idempotencyKey: "submission-1",
  });
  const retry = await createLead(env, enquiry("different@example.com"), {
    source: "website",
    idempotencyKey: "submission-1",
  });

  assert.equal(retry.duplicate, true);
  assert.equal(retry.lead.id, first.lead.id);
  assert.equal(await sequenceValue(), 1);
});

test("deleting the newest QA lead does not reset or reuse its number", async () => {
  const first = await createLead(env, enquiry("qa-one@example.com"), { source: "website" });
  await database.prepare("DELETE FROM leads WHERE id = ?").bind(first.lead.id).run();

  const second = await createLead(env, enquiry("qa-two@example.com"), { source: "website" });
  assert.equal(second.lead.lead_number, `BC-${YEAR}-000002`);
  assert.equal(await sequenceValue(), 2);

  const count = await database
    .prepare("SELECT COUNT(*) AS total FROM leads")
    .first<{ total: number }>();
  assert.equal(count?.total, 1, "cleanup removed only the deleted record");
});

test("concurrent submissions receive unique numbers", async () => {
  const results = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      createLead(env, enquiry(`concurrent-${index}@example.com`), { source: "website" }),
    ),
  );

  const numbers = results.map((result) => result.lead.lead_number);
  assert.equal(new Set(numbers).size, 12);
  assert.equal(await sequenceValue(), 12);
  assert.ok(numbers.every((number) => number.startsWith(`BC-${YEAR}-`)));
});

test("a failed submission leaves a gap but never reuses a number", async () => {
  // Force the insert itself to fail after the sequence has been allocated.
  await database.exec(
    "CREATE TRIGGER fail_lead_insert BEFORE INSERT ON leads BEGIN SELECT RAISE(ABORT, 'boom'); END;",
  );
  await assert.rejects(
    createLead(env, enquiry("failing@example.com"), { source: "website" }),
    /boom/,
  );
  await database.exec("DROP TRIGGER fail_lead_insert");

  assert.equal(await sequenceValue(), 1, "the sequence is not rolled back into reuse");

  const next = await createLead(env, enquiry("after-failure@example.com"), { source: "website" });
  assert.equal(next.lead.lead_number, `BC-${YEAR}-000002`);
});
