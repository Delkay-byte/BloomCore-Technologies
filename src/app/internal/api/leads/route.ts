/**
 * Same-origin console API.
 *
 * Cloudflare Access protects `/internal` and `/api/internal` with two separate
 * applications and two different audience tags. A browser that has signed in
 * to the dashboard holds a dashboard-audience token, so an XHR to
 * `/api/internal` is re-challenged by the other Access application and the
 * redirect cannot be followed by `fetch` — which the console used to report as
 * "check your connection". Serving the same handlers under the dashboard's own
 * path keeps every console request inside one Access application.
 *
 * The handlers themselves are unchanged: each one still calls `requireStaff`,
 * validates its input and enforces the same allowlist.
 */
export const dynamic = "force-dynamic";

export { GET } from "@/app/api/internal/leads/route";
