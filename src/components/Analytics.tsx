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
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md border border-border bg-background p-4 shadow-lg sm:left-6 sm:right-auto sm:mx-0"
    >
      <p className="text-sm font-medium text-foreground">Optional analytics</p>
      <p className="mt-1.5 text-xs leading-5 text-foreground-subtle">
        We use Google Tag Manager and Google Analytics 4 to measure which pages and product links
        are useful. Analytics is off unless you allow it. No form content or contact details are
        sent.{" "}
        <Link href={ROUTES.privacy} className="underline underline-offset-4 hover:text-foreground">
          Privacy notice
        </Link>
        .
      </p>

      {current && (
        <p className="mt-2 text-xs leading-5 text-foreground-faint">
          Current choice: analytics is {current}.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {consent !== "granted" && (
          <button
            type="button"
            onClick={() => choose("granted")}
            className="inline-flex h-9 items-center justify-center bg-foreground px-4 text-xs font-medium text-background transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:hover:bg-neutral-200"
          >
            Allow analytics
          </button>
        )}
        {consent === "granted" && (
          <button
            type="button"
            onClick={() => choose("denied")}
            className="inline-flex h-9 items-center justify-center border border-border px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Withdraw analytics consent
          </button>
        )}
        {consent !== "denied" && consent !== "granted" && (
          <button
            type="button"
            onClick={() => choose("denied")}
            className="inline-flex h-9 items-center justify-center border border-border px-4 text-xs font-medium text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            Keep off
          </button>
        )}
        {settingsOpen && current && (
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="inline-flex h-9 items-center justify-center px-3 text-xs font-medium text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
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
