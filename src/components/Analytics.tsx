"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANALYTICS_SETTINGS_EVENT,
  loadGoogleTagManager,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  trackEvent,
  withdrawAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";
import { ROUTES } from "@/lib/brand";

export function Analytics() {
  const [consent, setConsent] = useState<AnalyticsConsent | null | "loading">("loading");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setConsent(readAnalyticsConsent()), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (consent === "granted") loadGoogleTagManager();
  }, [consent]);

  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const tracked = target?.closest<HTMLElement>("[data-analytics]");
      if (!tracked) return;

      const name = tracked.dataset.analytics;
      if (!name) return;

      const params: Record<string, string> = {};
      if (tracked.dataset.product) params.product_name = tracked.dataset.product;
      if (tracked.dataset.location) params.location = tracked.dataset.location;
      if (tracked.dataset.destination) params.destination_type = tracked.dataset.destination;
      if (tracked.dataset.category) params.content_category = tracked.dataset.category;

      trackEvent(name, params);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const choose = (value: AnalyticsConsent) => {
    saveAnalyticsConsent(value);
    if (value === "granted") {
      setConsent("granted");
      loadGoogleTagManager();
    } else {
      withdrawAnalyticsConsent();
      setConsent("denied");
    }
    setSettingsOpen(false);
  };

  const visible =
    consent !== "loading" && (consent === null || settingsOpen);

  if (!visible) return null;

  const current = consent === "granted" ? "allowed" : consent === "denied" ? "off" : null;

  return (
    <div
      role="region"
      aria-label="Analytics settings"
      className="bc-panel-in fixed inset-x-3 bottom-3 z-50 mx-auto max-w-[27rem] rounded-[var(--radius)] border border-line bg-surface p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] sm:right-auto sm:left-6 sm:mx-0 sm:p-6"
    >
      <p className="text-[1.05rem] font-bold text-foreground">Optional analytics</p>
      <p className="mt-2 text-[0.875rem] leading-6 text-foreground-subtle">
        Help us understand which BloomCore pages and product links are useful. Analytics stays off
        until you allow it. We do not send enquiry messages, names, email addresses or phone numbers
        to Google Analytics.{" "}
        <Link
          href={ROUTES.privacy}
          className="font-semibold text-foreground underline decoration-1 underline-offset-4 hover:text-accent"
        >
          Read the privacy notice
        </Link>
        .
      </p>

      {current && (
        <p className="mt-3 text-[0.8125rem] text-foreground-faint">
          Current choice: analytics is {current}.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {consent !== "granted" && (
          <button
            type="button"
            onClick={() => choose("granted")}
            className="inline-flex h-11 items-center justify-center rounded-[7px] bg-accent px-4 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Allow analytics
          </button>
        )}
        {consent === "granted" && (
          <button
            type="button"
            onClick={() => choose("denied")}
            className="inline-flex h-11 items-center justify-center rounded-[7px] border border-line-strong px-4 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Withdraw analytics consent
          </button>
        )}
        {consent !== "denied" && consent !== "granted" && (
          <button
            type="button"
            onClick={() => choose("denied")}
            className="inline-flex h-11 items-center justify-center rounded-[7px] bg-accent px-4 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Keep off
          </button>
        )}
        {settingsOpen && current && (
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="inline-flex h-11 items-center justify-center rounded-[7px] px-3 text-[0.875rem] font-semibold text-foreground-subtle transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Close
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {consent === "granted" ? "Analytics allowed." : ""}
        {consent === "denied" ? "Analytics kept off." : ""}
      </p>
    </div>
  );
}
