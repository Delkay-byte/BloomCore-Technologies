import { redirect } from "next/navigation";

/**
 * Compatibility alias for the staff-management page.
 *
 * `/internal/leads/staff` previously fell through to the dynamic lead-detail
 * route and rendered the public 404 page. A static segment takes precedence
 * over `[id]`, so the old address now redirects to the canonical
 * `/internal/staff` page. Both paths remain behind the `/internal` Cloudflare
 * Access application.
 */
export const dynamic = "force-dynamic";

export default function LegacyStaffPage() {
  redirect("/internal/staff");
}