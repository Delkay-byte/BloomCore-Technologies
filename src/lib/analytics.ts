export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export const ANALYTICS_CONSENT_KEY = "bloomcore-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(value: AnalyticsConsent) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // Storage may be unavailable. Analytics simply stays off for this visit.
  }
}

/**
 * Sends an event only when analytics is configured and the visitor has
 * consented. Never include email addresses, phone numbers or message content.
 */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;
  if (readAnalyticsConsent() !== "granted") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", name, params);
}
