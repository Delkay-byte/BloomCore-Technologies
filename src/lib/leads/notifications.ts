import { sendEmail } from "@/lib/email/resend";
import { acknowledgementEmail, companyEmail, notificationSummary } from "@/lib/email/templates";
import { all, first, run, type LeadEnv } from "./db";
import type { LeadRow, NotificationRow } from "./repository";

const MAX_ATTEMPTS = 5;
const DEFAULT_DASHBOARD_ORIGIN = "https://bloomcoretech.com";

const nowIso = () => new Date().toISOString();

function dashboardUrl(env: LeadEnv, leadId: string): string {
  const origin = (env.DASHBOARD_ORIGIN || env.SITE_URL || DEFAULT_DASHBOARD_ORIGIN).replace(
    /\/+$/,
    "",
  );
  return `${origin}/internal/leads/${leadId}`;
}

/**
 * Queues every notification a new enquiry needs: the company alert, the
 * visitor acknowledgement and the in-dashboard entry. Queued rows are the
 * durable record; email delivery happens later and can be retried.
 */
export async function enqueueForLead(
  env: LeadEnv,
  lead: LeadRow,
  contactEmail: string,
): Promise<void> {
  const database = env.LEADS_DB;
  const timestamp = nowIso();
  const companyRecipient = env.LEAD_NOTIFICATION_EMAIL?.trim() || contactEmail;

  const statements = [
    database
      .prepare(
        `INSERT INTO notifications (id, lead_id, type, recipient, channel, subject, status, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        crypto.randomUUID(),
        lead.id,
        "new_enquiry",
        companyRecipient,
        "email",
        `New enquiry ${lead.lead_number}`,
        "pending",
        timestamp,
        timestamp,
      ),
    database
      .prepare(
        `INSERT INTO notifications (id, lead_id, type, recipient, channel, subject, status, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        crypto.randomUUID(),
        lead.id,
        "acknowledgement",
        lead.email,
        "email",
        `We have received your enquiry — ${lead.lead_number}`,
        "pending",
        timestamp,
        timestamp,
      ),
    database
      .prepare(
        `INSERT INTO notifications (id, lead_id, type, recipient, channel, subject, status, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        crypto.randomUUID(),
        lead.id,
        "new_enquiry",
        "dashboard",
        "dashboard",
        notificationSummary(lead),
        "sent",
        timestamp,
        timestamp,
      ),
  ];

  await database.batch(statements);
}

export async function listNotifications(
  env: LeadEnv,
  options: { unreadOnly?: boolean; limit?: number } = {},
): Promise<NotificationRow[]> {
  const limit = Math.min(200, Math.max(1, options.limit ?? 50));
  const where = options.unreadOnly ? "WHERE read_at IS NULL" : "";
  return all<NotificationRow>(
    env.LEADS_DB.prepare(
      `SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT ?`,
    ).bind(limit),
  );
}

export async function markNotificationRead(env: LeadEnv, id: string): Promise<void> {
  await run(
    env.LEADS_DB.prepare("UPDATE notifications SET read_at = ?, updated_at = ? WHERE id = ?").bind(
      nowIso(),
      nowIso(),
      id,
    ),
  );
}

export async function markAllNotificationsRead(env: LeadEnv): Promise<void> {
  const timestamp = nowIso();
  await run(
    env.LEADS_DB.prepare(
      "UPDATE notifications SET read_at = ?, updated_at = ? WHERE read_at IS NULL",
    ).bind(timestamp, timestamp),
  );
}

/** Move pending, still-retryable email notifications into the sending state. */
async function claimPending(env: LeadEnv, limit: number): Promise<NotificationRow[]> {
  const timestamp = nowIso();
  const rows = await all<NotificationRow>(
    env.LEADS_DB.prepare(
      `UPDATE notifications
         SET status = 'sending', attempt_count = attempt_count + 1,
             last_attempt_at = ?, updated_at = ?
       WHERE id IN (
         SELECT id FROM notifications
         WHERE status = 'pending' AND channel = 'email' AND attempt_count < ?
         ORDER BY created_at ASC LIMIT ?
       )
       RETURNING *`,
    ).bind(timestamp, timestamp, MAX_ATTEMPTS, limit),
  );
  return rows;
}

async function fetchLead(env: LeadEnv, leadId: string): Promise<LeadRow | null> {
  return first<LeadRow>(env.LEADS_DB.prepare("SELECT * FROM leads WHERE id = ?").bind(leadId));
}

async function finish(
  env: LeadEnv,
  id: string,
  status: "sent" | "failed",
  providerRef: string | null,
  failureReason: string | null,
): Promise<void> {
  await run(
    env.LEADS_DB.prepare(
      "UPDATE notifications SET status = ?, provider_ref = ?, failure_reason = ?, updated_at = ? WHERE id = ?",
    ).bind(status, providerRef, failureReason, nowIso(), id),
  );
}

async function deliverOne(
  env: LeadEnv,
  notification: NotificationRow,
  contactEmail: string,
): Promise<void> {
  if (!notification.lead_id) {
    await finish(env, notification.id, "failed", null, "missing_lead");
    return;
  }
  const lead = await fetchLead(env, notification.lead_id);
  if (!lead) {
    await finish(env, notification.id, "failed", null, "lead_not_found");
    return;
  }

  const from = env.EMAIL_FROM?.trim();
  if (!from) {
    await finish(env, notification.id, "failed", null, "sender_not_configured");
    return;
  }

  const content =
    notification.type === "acknowledgement"
      ? acknowledgementEmail(lead, contactEmail)
      : companyEmail(lead, dashboardUrl(env, lead.id));

  const result = await sendEmail(env, {
    to: notification.recipient,
    from,
    replyTo: env.EMAIL_REPLY_TO?.trim() || contactEmail,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (result.ok) {
    await finish(env, notification.id, "sent", result.id, null);
    return;
  }

  // Keep the queue honest: a retryable failure goes back to pending while
  // attempts remain, otherwise it is recorded as failed and surfaced.
  if (result.retryable && notification.attempt_count < MAX_ATTEMPTS) {
    await run(
      env.LEADS_DB.prepare(
        "UPDATE notifications SET status = 'pending', failure_reason = ?, updated_at = ? WHERE id = ?",
      ).bind(result.reason, nowIso(), notification.id),
    );
  } else {
    await finish(env, notification.id, "failed", null, result.reason);
  }
}

/**
 * Drains queued email notifications. Safe to call after a submission and from
 * a manual retry button. Does nothing when no provider key is configured, so
 * nothing is lost while the owner finishes the email setup.
 */
export async function drainOutbox(
  env: LeadEnv,
  options: { limit?: number; contactEmail?: string } = {},
): Promise<{ processed: number }> {
  if (!env.RESEND_API_KEY?.trim()) return { processed: 0 };

  const contactEmail = options.contactEmail?.trim() || env.EMAIL_REPLY_TO?.trim() || "";
  const limit = Math.min(20, Math.max(1, options.limit ?? 5));

  await run(
    env.LEADS_DB.prepare(
      `UPDATE notifications SET status = 'failed', failure_reason = 'retry_limit_reached', updated_at = ?
       WHERE status = 'pending' AND channel = 'email' AND attempt_count >= ?`,
    ).bind(nowIso(), MAX_ATTEMPTS),
  );

  const claimed = await claimPending(env, limit);
  for (const notification of claimed) {
    await deliverOne(env, notification, contactEmail);
  }
  return { processed: claimed.length };
}

/** Requeue notifications that previously failed, for a manual retry. */
export async function requeueFailed(env: LeadEnv): Promise<number> {
  const timestamp = nowIso();
  const rows = await all<{ id: string }>(
    env.LEADS_DB.prepare(
      `UPDATE notifications
         SET status = 'pending', attempt_count = 0, failure_reason = NULL, updated_at = ?
       WHERE status = 'failed'
       RETURNING id`,
    ).bind(timestamp),
  );
  return rows.length;
}
