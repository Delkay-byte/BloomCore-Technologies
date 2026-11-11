import Link from "next/link";
import { ConsoleSignInRequired } from "@/components/internal/ConsoleGuard";
import { NotificationActions } from "@/components/internal/NotificationActions";
import { listNotifications } from "@/lib/leads/notifications";
import { currentStaff } from "@/lib/leads/session";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_TONE: Record<string, string> = {
  sent: "bg-accent text-accent-contrast",
  pending: "bg-gold text-gold-contrast",
  failed: "bg-surface-3 text-foreground-subtle",
  sending: "bg-surface-2 text-foreground",
};

export default async function NotificationsPage() {
  const { env, identity } = await currentStaff();
  if (!identity) return <ConsoleSignInRequired />;

  const notifications = await listNotifications(env, { limit: 100 });
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h3 text-[1.7rem] text-foreground">Notifications</h1>
          <p className="mt-1 text-[0.9375rem] text-foreground-subtle">
            {unreadCount} unread · showing the most recent {notifications.length}.
          </p>
        </div>
        <NotificationActions unreadCount={unreadCount} />
      </div>

      {notifications.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius)] bg-surface p-10 text-center">
          <p className="font-display text-[1.6rem] text-foreground">No notifications</p>
          <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-6 text-foreground-subtle">
            New enquiry alerts appear here, alongside the company email and the visitor
            acknowledgement.
          </p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`rounded-[var(--radius)] p-4 ${
                notification.read_at ? "bg-surface" : "bg-surface-2"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.75rem] font-semibold tracking-wide text-foreground-faint uppercase">
                    {notification.type} · {notification.channel}
                  </p>
                  <p className="mt-1 text-[0.9375rem] font-medium text-foreground">
                    {notification.subject ?? "Notification"}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] break-all text-foreground-subtle">
                    {notification.recipient} · {formatDateTime(notification.created_at)}
                  </p>
                  {notification.failure_reason && (
                    <p className="mt-0.5 text-[0.8125rem] text-foreground-subtle">
                      Last error: {notification.failure_reason} (attempts {notification.attempt_count})
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-bold ${
                      STATUS_TONE[notification.status] ?? "bg-surface-2 text-foreground"
                    }`}
                  >
                    {notification.status}
                  </span>
                  {notification.lead_id && (
                    <Link
                      href={`/internal/leads/${notification.lead_id}`}
                      className="text-[0.875rem] font-semibold text-foreground underline underline-offset-4"
                    >
                      Open lead
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
