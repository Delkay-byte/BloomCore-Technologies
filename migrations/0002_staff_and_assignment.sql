-- Multi-user Lead Desk: staff roles, activation, audit and assignment mail.
--
-- Existing `staff` rows keep their role string; the application normalises the
-- legacy `member` value to `staff_member`. Owners are additionally derived from
-- `LEAD_OWNER_EMAILS`, so the owner cannot be locked out by a missing row.

ALTER TABLE staff ADD COLUMN active INTEGER NOT NULL DEFAULT 1;
ALTER TABLE staff ADD COLUMN updated_at TEXT;

UPDATE staff SET updated_at = created_at WHERE updated_at IS NULL;

-- Every staff creation, role change and activation change is recorded here.
CREATE TABLE IF NOT EXISTS staff_audit (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL REFERENCES staff (id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  detail TEXT,
  actor TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_audit_staff
  ON staff_audit (staff_id, created_at DESC);

-- Assignment emails need the assigning person and the worker's display name,
-- which are not derivable from the notification row alone.
ALTER TABLE notifications ADD COLUMN payload TEXT;

-- The owner and worker scopes both filter and group by assignee.
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads (assigned_to);

-- Worker notification queries join the assigned lead.
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications (created_at DESC);
