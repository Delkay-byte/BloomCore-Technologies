import type { LeadEnv } from "@/lib/leads/db";

export type SendEmailInput = {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; retryable: boolean; reason: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Sends one transactional email through Resend's HTTP API.
 *
 * The Worker cannot open SMTP connections, so an HTTP provider is required.
 * When the API key is absent the caller keeps the notification queued rather
 * than losing it, and reports a safe failure reason.
 */
export async function sendEmail(env: LeadEnv, input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, retryable: true, reason: "provider_not_configured" };
  }

  let response: Response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
  } catch {
    return { ok: false, retryable: true, reason: "network_error" };
  }

  if (!response.ok) {
    const retryable = response.status >= 500 || response.status === 429;
    return { ok: false, retryable, reason: `http_${response.status}` };
  }

  const payload = (await response.json().catch(() => ({}))) as { id?: string };
  return { ok: true, id: payload.id ?? "unknown" };
}
