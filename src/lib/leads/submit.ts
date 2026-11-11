import { CONTACT } from "@/lib/brand";
import {
  coerceEnquiry,
  hasErrors,
  LIMITS,
  validateEnquiry,
  type EnquiryErrors,
} from "./domain";
import type { LeadEnv } from "./db";
import { bumpRateLimit, createLead } from "./repository";
import { drainOutbox, enqueueForLead } from "./notifications";

const IP_LIMIT = { max: 6, windowSeconds: 600 } as const;
const EMAIL_LIMIT = { max: 3, windowSeconds: 3600 } as const;
const MIN_FORM_FILL_MS = 1200;

export type SubmitParams = {
  payload: unknown;
  idempotencyKey?: string;
  ip: string;
  source: string;
};

export type SubmitResult = { status: number; body: Record<string, unknown> };

/**
 * The single public entry point for every website enquiry. Validates on the
 * server, stores durably, queues notifications and only then reports success.
 * Analytics never sees anything from here; it fires client-side afterwards.
 */
export async function submitEnquiry(env: LeadEnv, params: SubmitParams): Promise<SubmitResult> {
  const raw = (typeof params.payload === "object" && params.payload !== null
    ? params.payload
    : {}) as Record<string, unknown>;

  // Low-friction spam controls. A bot that fills the hidden field or submits
  // instantly gets an ordinary success response so it learns nothing.
  const honeypot = typeof raw.website === "string" ? raw.website.trim() : "";
  const openedAt = typeof raw.formOpenedAt === "number" ? raw.formOpenedAt : 0;
  const tooFast = openedAt > 0 && Date.now() - openedAt < MIN_FORM_FILL_MS;

  const input = coerceEnquiry(raw);

  if (honeypot || tooFast) {
    return { status: 200, body: { ok: true, spam: true } };
  }

  const errors: EnquiryErrors = validateEnquiry(input);
  if (hasErrors(errors)) {
    return {
      status: 422,
      body: {
        ok: false,
        error: "Some details need attention.",
        errors,
      },
    };
  }

  const ipCount = await bumpRateLimit(env.LEADS_DB, `ip:${params.ip}`, IP_LIMIT.windowSeconds);
  if (ipCount > IP_LIMIT.max) {
    return {
      status: 429,
      body: {
        ok: false,
        error: "Too many submissions from this connection. Please try again a little later.",
      },
    };
  }
  const emailCount = await bumpRateLimit(
    env.LEADS_DB,
    `email:${input.email}`,
    EMAIL_LIMIT.windowSeconds,
  );
  if (emailCount > EMAIL_LIMIT.max) {
    return {
      status: 429,
      body: {
        ok: false,
        error: "This email address has submitted several enquiries already. Please reply to the acknowledgement instead.",
      },
    };
  }

  const { lead, duplicate } = await createLead(env, input, {
    source: params.source,
    idempotencyKey: params.idempotencyKey,
  });

  if (!duplicate) {
    await enqueueForLead(env, lead, CONTACT.email);
  }

  // Deliver queued mail without blocking the visitor's response. A failure
  // here never loses the lead: the notification row stays queued for retry.
  await drainOutbox(env, { limit: 4, contactEmail: CONTACT.email }).catch(() => ({ processed: 0 }));

  return {
    status: 200,
    body: {
      ok: true,
      duplicate,
      leadNumber: lead.lead_number,
      enquiryType: lead.enquiry_type,
      product: lead.product,
      messageLength: Math.min(lead.message.length, LIMITS.messageMax),
    },
  };
}
