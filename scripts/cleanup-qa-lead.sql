-- Authorised cleanup of exactly one production QA enquiry.
--
-- Lead number:     BC-2026-000001
-- Lead ID:         4664b654-e2bc-4051-b1c2-57b85a8b1486
-- QA email:        bloomcoretechnologies+qa-lead@gmail.com
-- QA name:         QA Acceptance 2026-11-12
-- Organization:    BloomCore QA
--
-- The owner authorised deletion of this record and its disposable dependents
-- only. The DELETE repeats all three identity predicates, so a wrong id alone
-- cannot remove a different lead, and nothing runs when the row no longer
-- matches all three values.
--
-- Dependents declare ON DELETE CASCADE (lead_activity, lead_notes,
-- notifications), so a single statement removes them in the same transaction.
-- The sequences table is deliberately untouched: lead numbers are never reused.
--
-- Run after the read-only checks in the report, with D1 Read and Edit granted:
--
--   npx wrangler d1 execute bloomcore-leads-prod --remote \
--     --command "SELECT id, lead_number, email, full_name, organization, product, created_at FROM leads WHERE id = '4664b654-e2bc-4051-b1c2-57b85a8b1486';"
--   npx wrangler d1 execute bloomcore-leads-prod --remote --file=scripts/cleanup-qa-lead.sql
--   npx wrangler d1 execute bloomcore-leads-prod --remote \
--     --command "SELECT (SELECT COUNT(*) FROM leads) AS leads, (SELECT COUNT(*) FROM lead_activity) AS activity, (SELECT COUNT(*) FROM lead_notes) AS notes, (SELECT COUNT(*) FROM notifications) AS notifications, (SELECT value FROM sequences WHERE name = 'lead_number') AS lead_sequence;"
--   npx wrangler d1 execute bloomcore-leads-prod --remote --command "PRAGMA foreign_key_check;"

DELETE FROM leads
WHERE id = '4664b654-e2bc-4051-b1c2-57b85a8b1486'
  AND lead_number = 'BC-2026-000001'
  AND email = 'bloomcoretechnologies+qa-lead@gmail.com';
