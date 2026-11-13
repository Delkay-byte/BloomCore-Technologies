/**
 * Lead domain vocabulary and validation.
 *
 * This module is intentionally dependency-free: it is imported by the app,
 * by the public submission API and by the unit tests that run under Node's
 * type-stripping test runner. Keep every import out of it.
 */

/* --------------------------------------------------------------- vocabulary */

export const ENQUIRY_CATEGORIES = [
  { id: "custom_software", label: "Custom software development" },
  { id: "product_enquiry", label: "Existing product enquiry" },
  { id: "automation_integration", label: "Business automation & system integration" },
  { id: "partnership", label: "Partnership" },
  { id: "demo_request", label: "Product demonstration request" },
  { id: "other", label: "Other" },
] as const;

export type EnquiryCategoryId = (typeof ENQUIRY_CATEGORIES)[number]["id"];

export const ENQUIRY_CATEGORY_IDS = ENQUIRY_CATEGORIES.map((c) => c.id);

export const LEAD_PRODUCTS = [
  { id: "schemeknit", label: "SchemeKnit" },
  { id: "maacash", label: "MaaCash" },
  { id: "tillproof", label: "TillProof" },
  { id: "custom_solution", label: "Custom solution" },
  { id: "none", label: "Not product-specific" },
] as const;

export type LeadProductId = (typeof LEAD_PRODUCTS)[number]["id"];

export const LEAD_PRODUCT_IDS = LEAD_PRODUCTS.map((p) => p.id);

/**
 * Normalise a product selection for storage.
 *
 * "Not product-specific" is stored as NULL, never as the literal `"none"`, so
 * the console filter, the CSV export and the detail view all agree. Unknown
 * values are rejected by validation before this is called.
 */
export function normalizeProductId(value: unknown): LeadProductId | null {
  if (typeof value !== "string") return null;
  const id = value.trim().toLowerCase();
  if (!id || id === "none") return null;
  return (LEAD_PRODUCT_IDS as ReadonlyArray<string>).includes(id)
    ? (id as LeadProductId)
    : null;
}

export const PREFERRED_CONTACT_METHODS = ["email", "phone", "whatsapp"] as const;
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

/** Pipeline order. Terminal stages are won, lost and unqualified. */
export const PIPELINE_STAGES = [
  "new",
  "contacted",
  "qualified",
  "discovery_scheduled",
  "demo_requested",
  "demo_completed",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
  "unqualified",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  discovery_scheduled: "Discovery scheduled",
  demo_requested: "Demo requested",
  demo_completed: "Demo completed",
  proposal_sent: "Proposal sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  unqualified: "Unqualified",
};

export const TERMINAL_STAGES: ReadonlyArray<PipelineStage> = ["won", "lost", "unqualified"];

/** Stages that require a recorded outcome/reason before they may be set. */
export const STAGES_REQUIRING_REASON: ReadonlyArray<PipelineStage> = ["lost", "unqualified"];

export const ACTIVITY_KINDS = [
  "created",
  "stage_changed",
  "note_added",
  "conversation_recorded",
  "follow_up_scheduled",
  "assigned",
  "updated",
  "notification_sent",
  "notification_failed",
  "archived",
  "exported",
] as const;

export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

export const categoryLabel = (id: string): string =>
  ENQUIRY_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const productLabel = (id: string): string =>
  LEAD_PRODUCTS.find((p) => p.id === id)?.label ?? (id === "none" ? "Not product-specific" : id);

export const stageLabel = (id: string): string =>
  STAGE_LABELS[id as PipelineStage] ?? id;

export const isStage = (value: string): value is PipelineStage =>
  (PIPELINE_STAGES as ReadonlyArray<string>).includes(value);

/* ------------------------------------------------------------------ limits */

export const LIMITS = {
  fullNameMax: 120,
  emailMax: 254,
  organizationMax: 160,
  phoneMax: 40,
  countryMax: 80,
  timelineMax: 120,
  budgetMax: 120,
  messageMin: 20,
  messageMax: 5000,
  noteMax: 4000,
  requestBytes: 32 * 1024,
} as const;

/* -------------------------------------------------------------- normalising */

/** Remove control characters and collapse runs of whitespace. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Normalise an email address for storage and duplicate comparison. */
export function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().slice(0, LIMITS.emailMax);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/* --------------------------------------------------------------- public API */

export type EnquiryInput = {
  fullName: string;
  email: string;
  organization: string;
  phone: string;
  countryOrRegion: string;
  enquiryType: string;
  product: string;
  message: string;
  preferredContactMethod: string;
  projectTimeline: string;
  budgetRange: string;
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  privacyAck: boolean;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryInput, string>>;

export const EMPTY_ENQUIRY: EnquiryInput = {
  fullName: "",
  email: "",
  organization: "",
  phone: "",
  countryOrRegion: "",
  enquiryType: "",
  product: "",
  message: "",
  preferredContactMethod: "",
  projectTimeline: "",
  budgetRange: "",
  landingPage: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  privacyAck: false,
};

/**
 * Coerce an untrusted payload into a clean EnquiryInput. Unknown fields are
 * dropped; every string is length-limited; nothing is trusted for storage.
 */
export function coerceEnquiry(raw: unknown): EnquiryInput {
  const source = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const preferred = cleanText(source.preferredContactMethod, 20);
  return {
    fullName: cleanText(source.fullName ?? source.name, LIMITS.fullNameMax),
    email: normalizeEmail(source.email),
    organization: cleanText(source.organization ?? source.organisation, LIMITS.organizationMax),
    phone: cleanText(source.phone, LIMITS.phoneMax),
    countryOrRegion: cleanText(source.countryOrRegion ?? source.country, LIMITS.countryMax),
    enquiryType: cleanText(source.enquiryType, 40),
    product: cleanText(source.product, 40),
    message: cleanText(source.message ?? source.description, LIMITS.messageMax),
    preferredContactMethod: (PREFERRED_CONTACT_METHODS as ReadonlyArray<string>).includes(preferred)
      ? preferred
      : "",
    projectTimeline: cleanText(source.projectTimeline ?? source.timeline, LIMITS.timelineMax),
    budgetRange: cleanText(source.budgetRange ?? source.budget, LIMITS.budgetMax),
    landingPage: cleanText(source.landingPage, 300),
    referrer: cleanText(source.referrer, 300),
    utmSource: cleanText(source.utmSource, 120),
    utmMedium: cleanText(source.utmMedium, 120),
    utmCampaign: cleanText(source.utmCampaign, 160),
    privacyAck: source.privacyAck === true || source.privacyAck === "true",
  };
}

/** Required fields only. Optional fields are validated for shape when present. */
export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (input.fullName.length < 2) {
    errors.fullName = "Enter your name, so the reply can be addressed to you.";
  }
  if (!isValidEmail(input.email)) {
    errors.email = "Enter a valid email address, for example name@example.com.";
  }
  if (!ENQUIRY_CATEGORY_IDS.includes(input.enquiryType as EnquiryCategoryId)) {
    errors.enquiryType = "Choose the type of enquiry.";
  }
  if (input.product && !LEAD_PRODUCT_IDS.includes(input.product as LeadProductId)) {
    errors.product = "Choose one of the listed products, or leave it blank.";
  }
  if (input.message.length < LIMITS.messageMin) {
    errors.message = `Describe the enquiry in at least ${LIMITS.messageMin} characters.`;
  }
  if (!input.privacyAck) {
    errors.privacyAck = "Please confirm you have read how the enquiry is handled.";
  }
  return errors;
}

export function hasErrors(errors: EnquiryErrors): boolean {
  return Object.keys(errors).length > 0;
}

/* --------------------------------------------------------------- anti-spam */

/**
 * A short, stable digest used only to spot an identical repeat submission.
 * Not a cryptographic hash and never exposed.
 */
export function contentDigest(value: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const text = value.toLowerCase();
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x01000193) >>> 0;
    h2 = Math.imul(h2 + code, 0x85ebca6b) >>> 0;
  }
  return (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).slice(0, 16);
}

/** Lead numbers are human-quotable: BC-<year>-<sequence>. */
export function formatLeadNumber(year: number, sequence: number): string {
  return `BC-${year}-${String(sequence).padStart(6, "0")}`;
}

/** Best-effort link spam signals. Never blocks; only flags for review. */
export function looksLikeSpam(message: string, email: string): boolean {
  const links = (message.match(/https?:\/\//gi) ?? []).length;
  if (links >= 6) return true;
  const emailDomain = email.split("@")[1] ?? "";
  if (/^(mailinator|guerrillamail|sharklasers|trashmail|tempmail)\./i.test(emailDomain)) return true;
  return false;
}

export function isValidStageTransition(
  from: PipelineStage,
  to: PipelineStage,
): { ok: boolean; reason?: string } {
  if (from === to) return { ok: false, reason: "The lead is already at that stage." };
  if (TERMINAL_STAGES.includes(from)) {
    return { ok: false, reason: "A closed lead must be reopened before its stage can change." };
  }
  if (!isStage(to)) return { ok: false, reason: "Unknown stage." };
  return { ok: true };
}
