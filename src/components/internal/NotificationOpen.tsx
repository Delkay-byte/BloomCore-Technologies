"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { staffFetch } from "@/lib/leads/staff-client";

/**
 * Opening an unread notification marks it read before navigating, through the
 * same-origin guarded endpoint. The request happens first: if it fails, the
 * page stays put, shows why, and the unread count on both surfaces is left
 * untouched. A second click is harmless because the server only updates rows
 * whose `read_at` is still NULL.
 */
export function NotificationOpen({ id, href }: { id: string; href: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);

    const result = await staffFetch("/internal/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(href);
    router.refresh();
  };

  return (
    <span className="flex flex-col items-end gap-1">
      <a
        href={href}
        onClick={open}
        aria-busy={pending}
        className="text-[0.875rem] font-semibold text-foreground underline underline-offset-4"
      >
        {pending ? "Opening…" : "Open lead"}
      </a>
      {error && (
        <span role="alert" className="max-w-[18rem] text-right text-[0.75rem] text-foreground-subtle">
          {error}
        </span>
      )}
    </span>
  );
}
