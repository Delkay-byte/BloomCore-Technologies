/**
 * Browser-side helper for the internal console.
 *
 * Two failure modes used to look identical to the owner: an expired staff
 * session (Access answers a cross-application request with a redirect that
 * `fetch` cannot follow) and a genuine network problem. The request below is
 * same-origin, does not follow redirects, and classifies the outcome, so the
 * UI can tell the owner to sign in again instead of blaming their connection.
 */

export const SESSION_EXPIRED_MESSAGE =
  "Your staff session has expired. Reload the page to sign in again.";
export const NETWORK_MESSAGE =
  "The change could not reach BloomCore. Check your connection and try again.";

export type StaffResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; sessionExpired: boolean; status?: number };

type JsonBody = Record<string, unknown> & { ok?: boolean; error?: string };

export async function staffFetch<T = JsonBody>(
  url: string,
  init: RequestInit = {},
): Promise<StaffResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return { ok: false, error: NETWORK_MESSAGE, sessionExpired: false };
  }

  // Access answers an unauthenticated request with a redirect to its login
  // page. `redirect: "manual"` exposes that as an opaque redirect rather than
  // letting the browser fail on the cross-origin hop.
  if (response.type === "opaqueredirect" || response.status === 0) {
    return { ok: false, error: SESSION_EXPIRED_MESSAGE, sessionExpired: true };
  }

  const text = await response.text().catch(() => "");
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  const body = (data ?? {}) as JsonBody;

  if (response.status === 401 || response.status === 403) {
    return {
      ok: false,
      error: SESSION_EXPIRED_MESSAGE,
      sessionExpired: true,
      status: response.status,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error:
        typeof body.error === "string" && body.error
          ? body.error
          : `The change could not be saved (error ${response.status}). Please try again.`,
      sessionExpired: false,
      status: response.status,
    };
  }

  if (data === null || body.ok === false) {
    // A 200 that is not JSON is what an intercepting login page looks like.
    return {
      ok: false,
      error: "BloomCore returned an unexpected response. Reload the page and try again.",
      sessionExpired: false,
      status: response.status,
    };
  }

  return { ok: true, data: body as T };
}
