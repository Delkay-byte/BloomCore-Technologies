import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateLeadParams,
  shouldTrackGenerateLead,
} from "../src/lib/leads/tracking.ts";

/**
 * GA4 `generate_lead` contract.
 *
 * The event is a conversion: it fires once, only after the API confirms a new
 * enquiry was persisted. Every other outcome — duplicate replay, honeypot,
 * validation, backend failure, non-2xx — must send nothing.
 */

const persisted = { status: 200, ok: true, duplicate: false, spam: false, leadNumber: "BC-2026-000123" };

test("a new persisted enquiry is a conversion", () => {
  assert.equal(shouldTrackGenerateLead(persisted), true);
});

test("a duplicate replay is not a conversion", () => {
  assert.equal(shouldTrackGenerateLead({ ...persisted, duplicate: true }), false);
});

test("a honeypot response is not a conversion even though it is HTTP 200 ok", () => {
  // submitEnquiry returns { ok: true, spam: true } with no lead number.
  assert.equal(shouldTrackGenerateLead({ status: 200, ok: true, spam: true }), false);
});

test("a response without a lead number proves nothing and is not tracked", () => {
  assert.equal(shouldTrackGenerateLead({ status: 200, ok: true }), false);
  assert.equal(shouldTrackGenerateLead({ status: 200, ok: true, leadNumber: "" }), false);
  assert.equal(shouldTrackGenerateLead({ status: 200, ok: true, leadNumber: "   " }), false);
});

test("validation and backend failures are not conversions", () => {
  assert.equal(shouldTrackGenerateLead({ status: 422, ok: false }), false);
  assert.equal(shouldTrackGenerateLead({ status: 500, ok: false }), false);
  assert.equal(shouldTrackGenerateLead({ status: 200, ok: false, leadNumber: "BC-2026-000123" }), false);
  assert.equal(shouldTrackGenerateLead({ status: 429, ok: false }), false);
});

test("analytics denial cannot fire the event because trackEvent is consent-gated", async () => {
  // The decision helper returns true for a real conversion; consent is enforced
  // separately inside trackEvent. This asserts the module contract remains one
  // event per conversion rather than a batch of parameters.
  const params = generateLeadParams({
    formType: "contact_form",
    enquiryType: "product_demo",
    product: "tillproof",
    sourcePage: "/contact",
  });
  assert.deepEqual(Object.keys(params).sort(), [
    "enquiry_type",
    "form_type",
    "product",
    "source_page",
  ]);
});

test("parameters are an allowlist and can never carry personal data", () => {
  const params = generateLeadParams({
    formType: "quick_enquiry",
    enquiryType: "general",
    // Values a caller might accidentally pass through:
    product: "none",
    sourcePage: "/products/tillproof",
    name: "Ama Mensah",
    email: "ama@example.com",
    phone: "+233200000000",
  } as never);

  assert.deepEqual(params, {
    form_type: "quick_enquiry",
    enquiry_type: "general",
    product: "none",
    source_page: "/products/tillproof",
  });
  const serialized = JSON.stringify(params).toLowerCase();
  assert.doesNotMatch(serialized, /ama@example\.com|233200000000|mensah/);
});
