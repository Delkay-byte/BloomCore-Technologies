"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NotificationActions({ unreadCount }: { unreadCount: number }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const markAll = async () => {
    setPending("read");
    await fetch("/api/internal/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setPending(null);
    router.refresh();
  };

  const retry = async () => {
    setPending("retry");
    const response = await fetch("/api/internal/notifications/retry", { method: "POST" });
    const data = (await response.json().catch(() => ({}))) as { requeued?: number; processed?: number };
    setPending(null);
    setNotice(`Requeued ${data.requeued ?? 0}, processed ${data.processed ?? 0}.`);
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
    </div>
  );
}
