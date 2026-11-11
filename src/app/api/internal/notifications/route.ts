import { errorResponse, json, readJsonBounded } from "@/lib/http";
import { requireStaff } from "@/lib/leads/guard";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/leads/notifications";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const params = new URL(request.url).searchParams;
  const notifications = await listNotifications(guard.env, {
    unreadOnly: params.get("unread") === "1",
    limit: Number(params.get("limit") ?? "50") || 50,
  });
  return json({ ok: true, notifications });
}

export async function PATCH(request: Request): Promise<Response> {
  const guard = await requireStaff(request);
  if (!guard.ok) return guard.response;

  const body = await readJsonBounded(request, 4096);
  if (!body.ok) return errorResponse("The change could not be read.", 400);

  const raw = body.value as Record<string, unknown>;
  if (raw.all === true) {
    await markAllNotificationsRead(guard.env);
    return json({ ok: true });
  }
  if (typeof raw.id === "string" && raw.id) {
    await markNotificationRead(guard.env, raw.id);
    return json({ ok: true });
  }
  return errorResponse("Nothing to mark as read.", 422);
}
