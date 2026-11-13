import { all, first, run, type D1PreparedStatement, type D1Database, type LeadEnv } from "./db";
import {
  contentDigest,
  formatLeadNumber,
  looksLikeSpam,
  normalizeProductId,
  type EnquiryInput,
  type PipelineStage,
} from "./domain";
import { buildLeadWhere, orderFor, type LeadFilters } from "./filters";
import { findStaffByEmail } from "./staff";

export type { LeadFilters } from "./filters";

export type LeadRow = {
  id: string;
  lead_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  country_or_region: string | null;
  enquiry_type: string;
  product: string | null;
  message: string;
  preferred_contact_method: string | null;
  project_timeline: string | null;
  budget_range: string | null;
  status: string;
  source: string | null;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  assigned_to: string | null;
  next_action: string | null;
  next_follow_up_at: string | null;
  outcome_reason: string | null;
  spam_score: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityRow = {
  id: string;
  kind: string;
  summary: string;
  detail: string | null;
  actor: string | null;
  created_at: string;
};

export type NoteRow = {
  id: string;
  author: string;
  body: string;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  lead_id: string | null;
  type: string;
  recipient: string;
  channel: string;
  subject: string | null;
  status: string;
  attempt_count: number;
  last_attempt_at: string | null;
  failure_reason: string | null;
  payload: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

const ACTIVITY_PREVIEW = 5;

const nowIso = () => new Date().toISOString();

/** Best-effort human label for a runner; never a secret. */
export function actorLabel(email: string | null | undefined): string {
  return email && email.includes("@") ? email : "system";
}

export async function nextLeadNumber(env: LeadEnv): Promise<string> {
  const statement = env.LEADS_DB.prepare(
    `INSERT INTO sequences (name, value) VALUES ('lead_number', 1)
     ON CONFLICT (name) DO UPDATE SET value = value + 1
     RETURNING value`,
  );
  const row = await first<{ value: number }>(statement);
  const value = row?.value ?? 1;
  return formatLeadNumber(new Date().getUTCFullYear(), value);
}

/* ------------------------------------------------------------- rate limiting */

export async function bumpRateLimit(
  database: D1Database,
  bucket: string,
  windowSeconds: number,
): Promise<number> {
  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds);
  const statement = database
    .prepare(
      `INSERT INTO rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT (bucket, window_start) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(bucket, windowStart);
  const row = await first<{ count: number }>(statement);
  return row?.count ?? 1;
}

/** Housekeeping for the rate-limit table; safe to call opportunistically. */
export async function pruneRateLimits(database: D1Database): Promise<void> {
  const cutoff = Math.floor(Date.now() / 1000) - 86_400;
  await run(database.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(cutoff));
}

/* ---------------------------------------------------------------- creating */

export type CreateLeadResult = {
  lead: LeadRow;
  duplicate: boolean;
};

export async function findByIdempotencyKey(
  database: D1Database,
  key: string,
): Promise<LeadRow | null> {
  return first<LeadRow>(
    database.prepare("SELECT * FROM leads WHERE idempotency_key = ?").bind(key),
  );
}

export async function findRecentDuplicate(
  database: D1Database,
  digest: string,
  sinceIso: string,
): Promise<LeadRow | null> {
  return first<LeadRow>(
    database
      .prepare(
        `SELECT * FROM leads
         WHERE dedupe_digest = ? AND created_at >= ?
         ORDER BY created_at DESC LIMIT 1`,
      )
      .bind(digest, sinceIso),
  );
}

export async function createLead(
  env: LeadEnv,
  input: EnquiryInput,
  options: { source: string; idempotencyKey?: string },
): Promise<CreateLeadResult> {
  const database = env.LEADS_DB;
  const digest = contentDigest(`${input.email}|${input.message}`);

  if (options.idempotencyKey) {
    const existing = await findByIdempotencyKey(database, options.idempotencyKey);
    if (existing) return { lead: existing, duplicate: true };
  }

  const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await findRecentDuplicate(database, digest, sinceIso);
  if (recent) return { lead: recent, duplicate: true };

  const leadNumber = await nextLeadNumber(env);
  const id = crypto.randomUUID();
  const timestamp = nowIso();
  const spam = looksLikeSpam(input.message, input.email) ? 1 : 0;

  const insert = database
    .prepare(
      `INSERT INTO leads (
         id, lead_number, full_name, email, phone, organization, country_or_region,
         enquiry_type, product, message, preferred_contact_method, project_timeline,
         budget_range, status, source, landing_page, referrer, utm_source, utm_medium,
         utm_campaign, dedupe_digest, spam_score, idempotency_key, created_at, updated_at
       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      id,
      leadNumber,
      input.fullName,
      input.email,
      input.phone || null,
      input.organization || null,
      input.countryOrRegion || null,
      input.enquiryType,
      normalizeProductId(input.product),
      input.message,
      input.preferredContactMethod || null,
      input.projectTimeline || null,
      input.budgetRange || null,
      "new",
      options.source,
      input.landingPage || null,
      input.referrer || null,
      input.utmSource || null,
      input.utmMedium || null,
      input.utmCampaign || null,
      digest,
      spam,
      options.idempotencyKey ?? null,
      timestamp,
      timestamp,
    );

  const activity = database
    .prepare(
      `INSERT INTO lead_activity (id, lead_id, kind, summary, detail, actor, created_at)
       VALUES (?,?,?,?,?,?,?)`,
    )
    .bind(
      crypto.randomUUID(),
      id,
      "created",
      "Enquiry received from the website",
      `Category: ${input.enquiryType}${input.product ? ` · Product: ${input.product}` : ""}`,
      "website",
      timestamp,
    );

  await database.batch([insert, activity]);

  const lead = await first<LeadRow>(database.prepare("SELECT * FROM leads WHERE id = ?").bind(id));
  if (!lead) throw new Error("Lead insert did not persist.");
  return { lead, duplicate: false };
}

/* ------------------------------------------------------------------ reading */

export async function listLeads(
  env: LeadEnv,
  filters: LeadFilters,
  options: { assignedTo?: string } = {},
): Promise<{ rows: LeadRow[]; total: number; totalUnfiltered: number; dateError?: string }> {
  const database = env.LEADS_DB;
  // A staff member's scope is applied after their own filter choices, so a
  // hand-edited `?owner=` URL can never widen it to another worker's leads.
  const scoped: LeadFilters = options.assignedTo
    ? { ...filters, assigned: options.assignedTo }
    : filters;
  const where = buildLeadWhere(scoped);
  const pageSize = Math.min(100, Math.max(5, scoped.pageSize ?? 25));

  // Count first so a stale `?page=` beyond the last page shows real rows
  // instead of an empty table with a "Page 4 of 1" label.
  const [countRow, scopeRow] = await Promise.all([
    first<{ total: number }>(
      database.prepare(`SELECT COUNT(*) AS total FROM leads WHERE ${where.sql}`).bind(...where.params),
    ),
    first<{ total: number }>(
      database
        .prepare(
          scoped.archived
            ? `SELECT COUNT(*) AS total FROM leads WHERE archived_at IS NOT NULL${options.assignedTo ? " AND lower(coalesce(assigned_to,'')) = ?" : ""}`
            : `SELECT COUNT(*) AS total FROM leads WHERE archived_at IS NULL${options.assignedTo ? " AND lower(coalesce(assigned_to,'')) = ?" : ""}`,
        )
        .bind(...(options.assignedTo ? [options.assignedTo.toLowerCase()] : [])),
    ),
  ]);

  const total = countRow?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, scoped.page ?? 1), totalPages);
  const offset = (page - 1) * pageSize;

  const rows = await all<LeadRow>(
    database
      .prepare(
        `SELECT * FROM leads WHERE ${where.sql}
         ORDER BY ${orderFor(scoped.sort)} LIMIT ? OFFSET ?`,
      )
      .bind(...where.params, pageSize, offset),
  );

  return {
    rows,
    total,
    totalUnfiltered: scopeRow?.total ?? 0,
    dateError: where.dateError,
  };
}

export type LeadDetail = {
  lead: LeadRow;
  activity: ActivityRow[];
  notes: NoteRow[];
  notifications: NotificationRow[];
};

export async function getLeadDetail(env: LeadEnv, id: string): Promise<LeadDetail | null> {
  const database = env.LEADS_DB;
  const lead = await first<LeadRow>(database.prepare("SELECT * FROM leads WHERE id = ?").bind(id));
  if (!lead) return null;

  const [activity, notes, notifications] = await Promise.all([
    all<ActivityRow>(
      database
        .prepare(
          "SELECT id, kind, summary, detail, actor, created_at FROM lead_activity WHERE lead_id = ? ORDER BY created_at DESC LIMIT 200",
        )
        .bind(id),
    ),
    all<NoteRow>(
      database
        .prepare(
          "SELECT id, author, body, created_at FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC LIMIT 200",
        )
        .bind(id),
    ),
    all<NotificationRow>(
      database
        .prepare(
          "SELECT * FROM notifications WHERE lead_id = ? ORDER BY created_at DESC LIMIT 50",
        )
        .bind(id),
    ),
  ]);

  return { lead, activity, notes, notifications };
}

/* ------------------------------------------------------------------ writing */

export async function recordActivity(
  database: D1Database,
  leadId: string,
  kind: string,
  summary: string,
  detail: string | null,
  actor: string,
): Promise<void> {
  await run(
    database
      .prepare(
        `INSERT INTO lead_activity (id, lead_id, kind, summary, detail, actor, created_at)
         VALUES (?,?,?,?,?,?,?)`,
      )
      .bind(crypto.randomUUID(), leadId, kind, summary, detail, actor, nowIso()),
  );
}

export async function touchLead(database: D1Database, leadId: string): Promise<void> {
  await run(
    database.prepare("UPDATE leads SET updated_at = ? WHERE id = ?").bind(nowIso(), leadId),
  );
}

/** Prepared INSERT for one notification/outbox row. */
function notification(
  database: D1Database,
  input: {
    leadId: string;
    type: string;
    recipient: string;
    channel: string;
    subject: string;
    payload: string | null;
    timestamp: string;
  },
): D1PreparedStatement {
  return database
    .prepare(
      `INSERT INTO notifications (id, lead_id, type, recipient, channel, subject, status, payload, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      crypto.randomUUID(),
      input.leadId,
      input.type,
      input.recipient,
      input.channel,
      input.subject,
      input.channel === "dashboard" ? "sent" : "pending",
      input.payload,
      input.timestamp,
      input.timestamp,
    );
}

/** Prepared INSERT for one activity-history row. */
function activity(
  database: D1Database,
  leadId: string,
  kind: string,
  summary: string,
  detail: string | null,
  actor: string,
  timestamp: string,
): D1PreparedStatement {
  return database
    .prepare(
      `INSERT INTO lead_activity (id, lead_id, kind, summary, detail, actor, created_at)
       VALUES (?,?,?,?,?,?,?)`,
    )
    .bind(crypto.randomUUID(), leadId, kind, summary, detail, actor, timestamp);
}

export type LeadPatch = {
  status?: PipelineStage;
  outcomeReason?: string | null;
  assignedTo?: string | null;
  nextAction?: string | null;
  nextFollowUpAt?: string | null;
  archived?: boolean;
};

export async function updateLead(
  env: LeadEnv,
  id: string,
  patch: LeadPatch,
  actor: string,
): Promise<LeadRow | null> {
  const database = env.LEADS_DB;
  const current = await first<LeadRow>(database.prepare("SELECT * FROM leads WHERE id = ?").bind(id));
  if (!current) return null;

  const sets: string[] = [];
  const params: unknown[] = [];
  const statements: D1PreparedStatement[] = [];
  const timestamp = nowIso();

  if (patch.status && patch.status !== current.status) {
    sets.push("status = ?");
    params.push(patch.status);
    statements.push(
      database
        .prepare(
          `INSERT INTO lead_activity (id, lead_id, kind, summary, detail, actor, created_at)
           VALUES (?,?,?,?,?,?,?)`,
        )
        .bind(
          crypto.randomUUID(),
          id,
          "stage_changed",
          `Stage changed to ${patch.status}`,
          patch.outcomeReason ? `Reason: ${patch.outcomeReason}` : null,
          actor,
          timestamp,
        ),
    );
    if (patch.outcomeReason !== undefined) {
      sets.push("outcome_reason = ?");
      params.push(patch.outcomeReason || null);
    }
  }

  // Only changed values are written. Re-saving the same owner/follow-up must
  // not append duplicate activity rows or bump updated_at for nothing.
  if (patch.assignedTo !== undefined) {
    const nextAssignee = patch.assignedTo ? patch.assignedTo.trim().toLowerCase() : null;
    if (nextAssignee !== (current.assigned_to ? current.assigned_to.toLowerCase() : null)) {
      sets.push("assigned_to = ?");
      params.push(nextAssignee);

      const assignee = nextAssignee ? await findStaffByEmail(database, nextAssignee) : null;
      const assigneeName = assignee?.display_name ?? nextAssignee;
      statements.push(activity(
        database,
        id,
        "assigned",
        nextAssignee ? `Assigned to ${assigneeName}` : "Unassigned",
        nextAssignee ? `Worker account: ${nextAssignee}` : null,
        actor,
        timestamp,
      ));

      // The email and the in-app entry are queued in the same batch as the
      // assignment itself. Either the assignment and its notification both
      // commit, or neither does — an assignment is never treated as notified
      // when no durable record exists. Delivery happens later and can be
      // retried, so a Resend outage never rolls the assignment back.
      if (nextAssignee) {
        const payload = JSON.stringify({
          assigneeName: assignee?.display_name ?? null,
          assigner: actor,
          reassigned: Boolean(current.assigned_to),
          previousAssignee: current.assigned_to,
        });
        statements.push(
          notification(database, {
            leadId: id,
            type: "assignment",
            recipient: nextAssignee,
            channel: "email",
            subject: `${current.assigned_to ? "Lead reassigned" : "New lead assigned"} — ${current.lead_number}`,
            payload,
            timestamp,
          }),
          notification(database, {
            leadId: id,
            type: "assignment",
            recipient: "dashboard",
            channel: "dashboard",
            subject: `${current.lead_number} assigned to ${assigneeName}`,
            payload,
            timestamp,
          }),
        );
      }
    }
  }

  if (patch.nextAction !== undefined) {
    const nextAction = patch.nextAction || null;
    if (nextAction !== current.next_action) {
      sets.push("next_action = ?");
      params.push(nextAction);
      statements.push(activity(
        database,
        id,
        "updated",
        nextAction ? "Next action updated" : "Next action cleared",
        nextAction,
        actor,
        timestamp,
      ));
    }
  }
  if (patch.nextFollowUpAt !== undefined) {
    const nextFollowUp = patch.nextFollowUpAt || null;
    if (nextFollowUp !== current.next_follow_up_at) {
      sets.push("next_follow_up_at = ?");
      params.push(nextFollowUp);
      statements.push(activity(
        database,
        id,
        "follow_up_scheduled",
        nextFollowUp ? `Follow-up set for ${nextFollowUp}` : "Follow-up cleared",
        patch.nextAction ? `Next action: ${patch.nextAction}` : null,
        actor,
        timestamp,
      ));
    }
  }
  if (patch.archived !== undefined) {
    const isArchived = Boolean(current.archived_at);
    if (patch.archived !== isArchived) {
      sets.push("archived_at = ?");
      params.push(patch.archived ? timestamp : null);
      statements.push(activity(
        database,
        id,
        patch.archived ? "archived" : "updated",
        patch.archived ? "Lead archived" : "Lead restored",
        null,
        actor,
        timestamp,
      ));
    }
  }

  if (sets.length === 0) return current;

  sets.push("updated_at = ?");
  params.push(timestamp);
  params.push(id);

  const update = database.prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`).bind(...params);
  await database.batch([update, ...statements]);

  return first<LeadRow>(database.prepare("SELECT * FROM leads WHERE id = ?").bind(id));
}

export async function addNote(
  env: LeadEnv,
  leadId: string,
  author: string,
  body: string,
): Promise<NoteRow | null> {
  const database = env.LEADS_DB;
  const lead = await first<{ id: string }>(
    database.prepare("SELECT id FROM leads WHERE id = ?").bind(leadId),
  );
  if (!lead) return null;

  const id = crypto.randomUUID();
  const timestamp = nowIso();
  await database.batch([
    database
      .prepare("INSERT INTO lead_notes (id, lead_id, author, body, created_at) VALUES (?,?,?,?,?)")
      .bind(id, leadId, author, body, timestamp),
    database
      .prepare(
        `INSERT INTO lead_activity (id, lead_id, kind, summary, detail, actor, created_at)
         VALUES (?,?,?,?,?,?,?)`,
      )
      .bind(crypto.randomUUID(), leadId, "note_added", "Internal note added", null, author, timestamp),
    database.prepare("UPDATE leads SET updated_at = ? WHERE id = ?").bind(timestamp, leadId),
  ]);
  return { id, author, body, created_at: timestamp };
}

/* ------------------------------------------------------------------ metrics */

export type LeadMetrics = {
  total: number;
  new: number;
  thisWeek: number;
  qualified: number;
  discoveryScheduled: number;
  demosRequested: number;
  demosCompleted: number;
  proposalsSent: number;
  won: number;
  lost: number;
  followUpsDue: number;
  unreadNotifications: number;
  archived: number;
  byStage: Record<string, number>;
};

export async function getMetrics(
  env: LeadEnv,
  options: { assignedTo?: string } = {},
): Promise<LeadMetrics> {
  const database = env.LEADS_DB;
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const now = new Date().toISOString();

  // A worker's dashboard describes their own workload, not the company's.
  const scopeClause = options.assignedTo ? " AND lower(coalesce(assigned_to,'')) = ?" : "";
  const scopeParams = options.assignedTo ? [options.assignedTo.toLowerCase()] : [];
  const unreadScope = options.assignedTo
    ? " AND EXISTS (SELECT 1 FROM leads l WHERE l.id = notifications.lead_id AND lower(coalesce(l.assigned_to,'')) = ?)"
    : "";

  const [byStageRows, totalRow, weekRow, followUpRow, unreadRow, archivedRow] = await Promise.all([
    all<{ status: string; count: number }>(
      database.prepare(`SELECT status, COUNT(*) AS count FROM leads WHERE archived_at IS NULL${scopeClause} GROUP BY status`).bind(...scopeParams),
    ),
    first<{ total: number }>(
      database.prepare(`SELECT COUNT(*) AS total FROM leads WHERE archived_at IS NULL${scopeClause}`).bind(...scopeParams),
    ),
    first<{ count: number }>(
      database
        .prepare(`SELECT COUNT(*) AS count FROM leads WHERE archived_at IS NULL AND created_at >= ?${scopeClause}`)
        .bind(weekAgo, ...scopeParams),
    ),
    first<{ count: number }>(
      database
        .prepare(
          `SELECT COUNT(*) AS count FROM leads
           WHERE archived_at IS NULL AND next_follow_up_at IS NOT NULL AND next_follow_up_at <= ?${scopeClause}`,
        )
        .bind(now, ...scopeParams),
    ),
    // The badge and the notifications page both count every unread row, not a
    // page-sized slice, so the two surfaces can never disagree.
    first<{ count: number }>(
      database.prepare(`SELECT COUNT(*) AS count FROM notifications WHERE read_at IS NULL${unreadScope}`).bind(...scopeParams),
    ),
    first<{ count: number }>(
      database.prepare(`SELECT COUNT(*) AS count FROM leads WHERE archived_at IS NOT NULL${scopeClause}`).bind(...scopeParams),
    ),
  ]);

  const byStage: Record<string, number> = {};
  for (const row of byStageRows) byStage[row.status] = row.count;
  const count = (stage: string) => byStage[stage] ?? 0;

  return {
    total: totalRow?.total ?? 0,
    new: count("new"),
    thisWeek: weekRow?.count ?? 0,
    qualified: count("qualified"),
    discoveryScheduled: count("discovery_scheduled"),
    demosRequested: count("demo_requested"),
    demosCompleted: count("demo_completed"),
    proposalsSent: count("proposal_sent"),
    won: count("won"),
    lost: count("lost"),
    followUpsDue: followUpRow?.count ?? 0,
    unreadNotifications: unreadRow?.count ?? 0,
    archived: archivedRow?.count ?? 0,
    byStage,
  };
}

export async function listLeadActivityPreview(
  database: D1Database,
  limit = ACTIVITY_PREVIEW,
): Promise<ActivityRow[]> {
  return all<ActivityRow>(
    database.prepare(
      "SELECT id, kind, summary, detail, actor, created_at FROM lead_activity ORDER BY created_at DESC LIMIT ?",
    ).bind(limit),
  );
}

export async function getVisibleLeadsForExport(
  env: LeadEnv,
  filters: LeadFilters,
  max = 2000,
): Promise<LeadRow[]> {
  const where = buildLeadWhere(filters);
  return all<LeadRow>(
    env.LEADS_DB.prepare(
      `SELECT * FROM leads WHERE ${where.sql} ORDER BY ${orderFor(filters.sort)} LIMIT ?`,
    ).bind(...where.params, max),
  );
}

export async function countLeads(env: LeadEnv): Promise<number> {
  const row = await first<{ total: number }>(
    env.LEADS_DB.prepare("SELECT COUNT(*) AS total FROM leads"),
  );
  return row?.total ?? 0;
}
