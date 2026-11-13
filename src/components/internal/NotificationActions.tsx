"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { staffFetch } from "@/lib/leads/staff-client";

export function NotificationActions({ unreadCount }: { unreadCount: number }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const markAll = async () => {
    if (pending) return;
    setPending("read");
    setError(null);
    setNotice(null);

    const result = await staffFetch<{ marked?: number; unread?: number }>(
      "/internal/api/notifications",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      },
    );

    setPending(null);
    if (!result.ok) {
      // Nothing was marked, so the count stays as it was.
      setError(result.error);
      return;
    }
    const marked = result.data.marked ?? 0;
    setNotice(marked > 0 ? `Marked ${marked} as read.` : "Everything was already read.");
    router.refresh();
  };

  const retry = async () => {
    if (pending) return;
    setPending("retry");
    setError(null);
    setNotice(null);

    const result = await staffFetch<{ requeued?: number; processed?: number }>(
      "/internal/api/notifications/retry",
      { method: "POST" },
    );

    setPending(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNotice(
      `Requeued ${result.data.requeued ?? 0}, processed ${result.data.processed ?? 0}.`,
    );
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending !== null || unreadCount === 0}
        onClick={markAll}
        className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
      >
        {pending === "read" ? "Marking…" : "Mark all as read"}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={retry}
        className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
      >
        {pending === "retry" ? "Retrying…" : "Retry failed emails"}
      </button>
      {notice && <span className="text-[0.875rem] text-foreground-subtle">{notice}</span>}
      {error && (
        <span role="alert" className="text-[0.875rem] text-foreground-subtle">
          {error}
        </span>
      )}
    </div>
  );
}
