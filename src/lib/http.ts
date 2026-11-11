/** Shared helpers for route handlers: JSON responses and origin checks. */

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...SECURITY_HEADERS },
  });
}

export function errorResponse(message: string, status: number): Response {
  return json({ ok: false, error: message }, status);
}

export function text(body: string, status = 200, contentType = "text/plain; charset=utf-8"): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": contentType, ...SECURITY_HEADERS },
  });
}

/** Same-origin check for state-changing public requests. */
export function isAllowedOrigin(request: Request, allowedOrigins: string[]): boolean {
  const origin = request.headers.get("origin");
  // No Origin header (same-origin form posts, some clients) is acceptable.
  if (!origin) return true;
  return allowedOrigins.some((allowed) => origin === allowed);
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function readJsonBounded(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; value: unknown } | { ok: false; reason: "too_large" | "invalid" }> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, reason: "too_large" };

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (raw.length > maxBytes) return { ok: false, reason: "too_large" };
  if (!raw) return { ok: false, reason: "invalid" };

  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
