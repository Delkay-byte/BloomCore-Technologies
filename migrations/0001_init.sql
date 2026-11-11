-- BloomCore lead management — initial schema.
-- SQLite / Cloudflare D1. Timestamps are ISO-8601 UTC strings.

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  lead_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  country_or_region TEXT,
  enquiry_type TEXT NOT NULL,
  product TEXT,
  message TEXT NOT NULL,
  preferred_contact_method TEXT,
  project_timeline TEXT,
  budget_range TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  landing_page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  assigned_to TEXT,
  next_action TEXT,
  next_follow_up_at TEXT,
  outcome_reason TEXT,
  dedupe_digest TEXT,
  spam_score INTEGER NOT NULL DEFAULT 0,
  archived_at TEXT,
  idempotency_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_idempotency
  ON leads (idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_product ON leads (product);
CREATE INDEX IF NOT EXISTS idx_leads_enquiry_type ON leads (enquiry_type);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads (next_follow_up_at);
CREATE INDEX IF NOT EXISTS idx_leads_dedupe ON leads (dedupe_digest, created_at DESC);

CREATE TABLE IF NOT EXISTS lead_activity (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  summary TEXT NOT NULL,
  detail TEXT,
  actor TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_lead
  ON lead_activity (lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS lead_notes (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_lead ON lead_notes (lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES leads (id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  channel TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TEXT,
  provider_ref TEXT,
  failure_reason TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_status
  ON notifications (status, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_lead
  ON notifications (lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits (window_start);

CREATE TABLE IF NOT EXISTS sequences (
  name TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO sequences (name, value) VALUES ('lead_number', 0);
