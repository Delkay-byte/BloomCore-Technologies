import { asRecord, errorResponse, json, readJsonBounded } from "@/lib/http";
import { denyUnless, requireStaff } from "@/lib/leads/guard";
import { notificationScopeEmail } from "@/lib/leads/permissions";
import {
  countUnreadNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/leads/notifications";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const params = new URL(request.url).searchParams;
  const requestedLimit = Number(params.get("limit") ?? "50");
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 50;
  const assignedTo = notificationScopeEmail(guard.staff.role, guard.staff.email);
  try {
    const [notifications, unread] = await Promise.all([
      listNotifications(guard.env, {
        unreadOnly: params.get("unread") === "1",
        limit,
        assignedTo,
      }),
      countUnreadNotifications(guard.env, { assignedTo }),
    ]);
    return json({ ok: true, notifications, unread });
  } catch {
    return errorResponse("Notifications could not be loaded.", 500);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  // The accountant may read notification history but makes no writes.
  const denied = denyUnless(
    guard,
    "notifications.mark_read",
    "The read-only accountant account cannot change notifications.",
  );
  if (denied) return denied;

  const body = await readJsonBounded(request, 4096);
  if (!body.ok) return errorResponse("The change could not be read.", 400);

  const assignedTo = notificationScopeEmail(guard.staff.role, guard.staff.email);
  const raw = asRecord(body.value);
  if (raw.all === true) {
    const marked = await markAllNotificationsRead(guard.env, { assignedTo });
    // The post-change count is authoritative; the UI never guesses.
    const unread = await countUnreadNotifications(guard.env, { assignedTo });
    return json({ ok: true, marked, unread });
  }
  if (typeof raw.id === "string" && raw.id) {
    const result = await markNotificationRead(guard.env, raw.id, { assignedTo });
    if (result === "not_found") return errorResponse("That notification was not found.", 404);
    const unread = await countUnreadNotifications(guard.env, { assignedTo });
    return json({ ok: true, result, marked: result === "marked" ? 1 : 0, unread });
  }
  return errorResponse("Nothing to mark as read.", 422);
}
