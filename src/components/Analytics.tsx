"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GA_MEASUREMENT_ID,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  trackEvent,
  type AnalyticsConsent,
} from "@/lib/analytics";
import { ROUTES } from "@/lib/brand";

function loadAnalytics() {
  if (!GA_MEASUREMENT_ID) return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

export function Analytics() {
  const [consent, setConsent] = useState<AnalyticsConsent | null | "loading">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setConsent(readAnalyticsConsent()), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (consent === "granted") loadAnalytics();
  }, [consent]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const tracked = target?.closest<HTMLElement>("[data-analytics]");
      if (!tracked) return;

      const name = tracked.dataset.analytics;
      if (!name) return;

      const params: Record<string, string> = {};
      if (tracked.dataset.product) params.product = tracked.dataset.product;
      if (tracked.dataset.location) params.location = tracked.dataset.location;
      if (tracked.dataset.destination) params.destination = tracked.dataset.destination;

      trackEvent(name, params);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_MEASUREMENT_ID || consent !== null) return null;

  const choose = (value: AnalyticsConsent) => {
    saveAnalyticsConsent(value);
    setConsent(value);
  };

  return (
    <div
      role="region"
      aria-label="Analytics choice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-lg border border-border bg-background p-4 shadow-lg sm:left-6 sm:right-auto sm:mx-0"
    >
      <p className="text-sm font-medium text-foreground">Optional analytics</p>
      <p className="mt-1.5 text-xs leading-5 text-foreground-subtle">
        We would like to measure which pages and product links are useful. Analytics is off unless
        you allow it. No form content is sent.{" "}
        <Link href={ROUTES.privacy} className="underline underline-offset-4 hover:text-foreground">
          Privacy notice
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 text-xs font-medium text-background transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:hover:bg-neutral-200"
        >
          Allow analytics
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-xs font-medium text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Keep off
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {consent === "granted" ? "Analytics allowed." : ""}
        {consent === "denied" ? "Analytics kept off." : ""}
      </p>
    </div>
  );
}
