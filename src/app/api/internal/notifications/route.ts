import { errorResponse, json, readJsonBounded } from "@/lib/http";
import { requireStaff } from "@/lib/leads/guard";
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
  const [notifications, unread] = await Promise.all([
    listNotifications(guard.env, {
      unreadOnly: params.get("unread") === "1",
      limit: Number(params.get("limit") ?? "50") || 50,
    }),
    countUnreadNotifications(guard.env),
  ]);
  return json({ ok: true, notifications, unread });
}

export async function PATCH(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const body = await readJsonBounded(request, 4096);
  if (!body.ok) return errorResponse("The change could not be read.", 400);

  const raw = body.value as Record<string, unknown>;
  if (raw.all === true) {
    const marked = await markAllNotificationsRead(guard.env);
    // The post-change count is authoritative; the UI never guesses.
    const unread = await countUnreadNotifications(guard.env);
    return json({ ok: true, marked, unread });
  }
  if (typeof raw.id === "string" && raw.id) {
    const result = await markNotificationRead(guard.env, raw.id);
    if (result === "not_found") return errorResponse("That notification was not found.", 404);
    const unread = await countUnreadNotifications(guard.env);
    return json({ ok: true, result, marked: result === "marked" ? 1 : 0, unread });
  }
  return errorResponse("Nothing to mark as read.", 422);
}
