import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cleanText,
  coerceEnquiry,
  contentDigest,
  EMPTY_ENQUIRY,
  formatLeadNumber,
  hasErrors,
  isValidStageTransition,
  looksLikeSpam,
  normalizeEmail,
  validateEnquiry,
} from "../src/lib/leads/domain.ts";

const valid = () => ({
  ...EMPTY_ENQUIRY,
  fullName: "Ama Mensah",
  email: "ama@example.com",
  enquiryType: "custom_software",
  message: "We need a system to track stock across two shops in Akatsi.",
  privacyAck: true,
});

test("normalizeEmail lowercases and trims", () => {
  assert.equal(normalizeEmail("  Ama@Example.COM "), "ama@example.com");
  assert.equal(normalizeEmail(undefined), "");
});

test("cleanText strips control characters and collapses whitespace", () => {
  assert.equal(cleanText("  hello\u0000\n\tworld  ", 100), "hello world");
  assert.equal(cleanText("abcdef", 3), "abc");
  assert.equal(cleanText(42, 10), "");
});

test("coerceEnquiry accepts aliases and drops unknown fields", () => {
  const input = coerceEnquiry({
    name: "Kofi",
    email: "KOFI@example.com",
    organisation: "Shop",
    description: "A long enough description of the work required.",
    product: "not-a-product",
    extra: "ignore me",
  });
  assert.equal(input.fullName, "Kofi");
  assert.equal(input.email, "kofi@example.com");
  assert.equal(input.organization, "Shop");
  assert.equal(input.message, "A long enough description of the work required.");
  // Shape errors are reported by the validator, not silently accepted.
  const errors = validateEnquiry({ ...input, privacyAck: true, enquiryType: "other" });
  assert.equal(errors.product?.length ? true : false, true);
});

test("validation passes for a complete enquiry and fails for a blank one", () => {
  assert.equal(hasErrors(validateEnquiry(valid())), false);

  const errors = validateEnquiry(EMPTY_ENQUIRY);
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.enquiryType);
  assert.ok(errors.message);
  assert.ok(errors.privacyAck);
});

test("optional fields stay optional", () => {
  const errors = validateEnquiry(valid());
  assert.equal(errors.phone, undefined);
  assert.equal(errors.organization, undefined);
  assert.equal(errors.budgetRange, undefined);
});

test("privacy acknowledgement is required", () => {
  const errors = validateEnquiry({ ...valid(), privacyAck: false });
  assert.ok(errors.privacyAck);
});

test("content digest is stable and distinguishes different text", () => {
  const a = contentDigest("ama@example.com|hello");
  const b = contentDigest("ama@example.com|hello");
  const c = contentDigest("ama@example.com|different");
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(a, /^[0-9a-f]{16}$/);
});

test("lead numbers are zero padded and year scoped", () => {
  assert.equal(formatLeadNumber(2026, 1), "BC-2026-000001");
  assert.equal(formatLeadNumber(2026, 123456), "BC-2026-123456");
});

test("terminal stages cannot transition without reopening", () => {
  assert.equal(isValidStageTransition("new", "contacted").ok, true);
  assert.equal(isValidStageTransition("lost", "contacted").ok, false);
  assert.equal(isValidStageTransition("won", "negotiation").ok, false);
  assert.equal(isValidStageTransition("new", "new").ok, false);
});

test("link spam is flagged, ordinary messages are not", () => {
  assert.equal(looksLikeSpam("short message with no links", "a@b.com"), false);
  assert.equal(looksLikeSpam("a http://x b http://x c http://x d http://x e http://x f http://x", "a@b.com"), true);
  assert.equal(looksLikeSpam("hello", "bot@mailinator.com"), true);
});
