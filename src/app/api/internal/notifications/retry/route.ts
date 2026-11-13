import { CONTACT } from "@/lib/brand";
import { errorResponse, json } from "@/lib/http";
import { denyUnless, requireStaff } from "@/lib/leads/guard";
import { drainOutbox, requeueFailed } from "@/lib/leads/notifications";

export const dynamic = "force-dynamic";

/** Requeue failed notifications and drain the outbox again. */
export async function POST(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const denied = denyUnless(
    guard,
    "notifications.retry",
    "Only the owner can retry failed email delivery.",
  );
  if (denied) return denied;

  try {
    const requeued = await requeueFailed(guard.env);
    const { processed } = await drainOutbox(guard.env, {
      limit: 20,
      contactEmail: CONTACT.email,
    });
    return json({ ok: true, requeued, processed });
  } catch {
    return errorResponse("The retry could not be completed.", 500);
  }
}
