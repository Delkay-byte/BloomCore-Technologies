"use client";

import { ANALYTICS_SETTINGS_EVENT } from "@/lib/analytics";

/**
 * Reopens the consent panel so a visitor can change or withdraw a previous
 * analytics choice.
 */
export function AnalyticsSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}
      className={
        className ??
        "text-left text-sm text-foreground-subtle transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
      }
    >
      Analytics settings
    </button>
  );
}
