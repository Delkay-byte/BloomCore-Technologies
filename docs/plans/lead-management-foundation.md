# Lead management foundation — implementation plan

Branch: `feat/lead-management-foundation`

## Owner decisions (received)

- Private console at `/internal/leads`, protected by **Cloudflare Access** (Cloudflare identity provider).
  Edge-protect `/internal/*` and `/api/internal/*`. Server validates `Cf-Access-Jwt-Assertion`
  (signature, issuer, audience, expiry). Fail closed.
- Storage: dedicated **D1** database `bloomcore-leads-prod`, binding `LEADS_DB`. Owner creates it.
- Email: **Resend** free tier. Owner supplies API key + DKIM/SPF DNS records.
- Build now against local D1 (Miniflare). Production deploy waits on D1 + Access + Resend.

## Phases

1. Route-group split so the console has its own shell (no marketing chrome).
2. D1 schema + versioned migrations.
3. Domain layer: enquiry types, products, pipeline stages, validation, normalisation (pure, tested).
4. Data layer: repository, rate limiting, idempotency, activity history, notifications outbox.
5. Email layer: Resend adapter + templates, durable outbox, retry, safe failure reasons.
6. Public API: `POST /api/enquiries` (validate, anti-spam, rate limit, dedupe, durable save, queue mail).
7. Access auth: JWT verification + `requireStaff` for all internal APIs.
8. Private API: leads list/detail/update/notes/activity, notifications, metrics, CSV export.
9. Console UI: dashboard, list with filters, lead detail, notifications, following the BloomCore design system.
10. Wire public forms (`QuickEnquiry`, `ContactForm`, product pages) + GA4 `generate_lead` after confirmed save.
11. Tests: unit (node:test) for pure logic; manual + documented integration/E2E.
12. Report: `docs/reports/BLOOMCORE-LEAD-MANAGEMENT-FOUNDATION-REPORT.md`.

## Guardrails

- Never expose lead records, PII, notes or metrics publicly.
- Never send PII to GA4. `generate_lead` fires only after the backend confirms the save.
- Preserve every existing route, the analytics implementation and consent behaviour.
- `NETLIFY=true` static export cannot contain route handlers. Lead system is Cloudflare-only.
