import { getLeadEnv, type LeadEnv } from "@/lib/leads/db";
import { submitEnquiry } from "@/lib/leads/submit";
import { errorResponse, isAllowedOrigin, json, readJsonBounded } from "@/lib/http";
import { LIMITS } from "@/lib/leads/domain";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function allowedOrigins(): string[] {
  const origins = new Set<string>([SITE_URL]);
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) origins.add(configured.replace(/\/+$/, ""));
  origins.add("https://bloomcoretech.com");
  origins.add("https://www.bloomcoretech.com");
  return [...origins];
}

/** True when the Origin's host is the same host that served this request. */
function isSameHost(origin: string, request: Request): boolean {
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function POST(request: Request): Promise<Response> {
  let env: LeadEnv;
  try {
    env = await getLeadEnv();
  } catch {
    return errorResponse("The enquiry service is not available right now.", 503);
  }

  const origin = request.headers.get("origin");
  const sameHost = origin ? isSameHost(origin, request) : false;
  if (!isAllowedOrigin(request, allowedOrigins()) && !sameHost) {
    return errorResponse("This request did not come from the BloomCore website.", 403);
  }

  const body = await readJsonBounded(request, LIMITS.requestBytes);
  if (!body.ok) {
    return errorResponse(
      body.reason === "too_large" ? "That message is too large to submit." : "The request could not be read.",
      body.reason === "too_large" ? 413 : 400,
    );
  }

  try {
    const result = await submitEnquiry(env, {
      payload: body.value,
      idempotencyKey: request.headers.get("idempotency-key") ?? undefined,
      ip: clientIp(request),
      source: "website",
    });
    return json(result.body, result.status);
  } catch {
    // Never leak internal detail. The lead may or may not have been stored,
    // so the client is told to retry with its input preserved.
    return errorResponse(
      "Something went wrong while saving the enquiry. Your text is still in the form — please try again.",
      500,
    );
  }
}

export async function GET(): Promise<Response> {
  return errorResponse("Method not allowed.", 405);
}
