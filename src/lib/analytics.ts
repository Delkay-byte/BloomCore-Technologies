/**
 * Consent-gated Google Tag Manager integration.
 *
 * The site installs one GTM container. The GA4 Google tag lives inside that
 * container, so this file never loads gtag.js directly and never sends a
 * second page view.
 */

export const GTM_CONTAINER_ID = "GTM-TQK7FMJT";

/**
 * Used only for the ga-disable switch and documentation. The measurement ID is
 * never installed as a standalone gtag.js script.
 */
export const GA4_MEASUREMENT_ID = "G-GDBL5SNHKL";

export const ANALYTICS_CONSENT_KEY = "bloomcore-analytics-consent";

/** Dispatched by the footer control to reopen the analytics panel. */
export const ANALYTICS_SETTINGS_EVENT = "bloomcore:open-analytics-settings";

export type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTM_SCRIPT_ID = "gtm-script";
let gtmLoaded = false;

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

function analyticsDisabledFlag() {
  return `ga-disable-${GA4_MEASUREMENT_ID}`;
}

function setAnalyticsDisabled(disabled: boolean) {
  (window as unknown as Record<string, unknown>)[analyticsDisabledFlag()] = disabled;
}

/** Best-effort removal of GA cookies when consent is withdrawn. */
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const baseDomain = host.split(".").slice(-2).join(".");
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter(
      (name): name is string =>
        Boolean(name) && (name === "_ga" || name === "_gid" || name.startsWith("_ga_")),
    );

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${host}`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${baseDomain}`;
  }
}

function ensureGtagQueue() {
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js and GTM both read command arrays from dataLayer.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
}

function pushConsent(state: AnalyticsConsent) {
  ensureGtagQueue();
  window.gtag?.("consent", "update", {
    analytics_storage: state,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

/**
 * Loads the single GTM container. Called only after the visitor allows
 * analytics, so no Google tag request is made before a choice exists.
 */
export function loadGoogleTagManager() {
  if (typeof window === "undefined") return;

  ensureGtagQueue();
  setAnalyticsDisabled(false);

  if (gtmLoaded || document.getElementById(GTM_SCRIPT_ID)) {
    gtmLoaded = true;
    pushConsent("granted");
    return;
  }

  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
  pushConsent("granted");

  window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_CONTAINER_ID)}`;
  document.head.appendChild(script);

  gtmLoaded = true;
}

/** Stops measurement and clears GA cookies after a previous acceptance. */
export function withdrawAnalyticsConsent() {
  if (typeof window === "undefined") return;

  setAnalyticsDisabled(true);
  if (gtmLoaded || window.dataLayer) pushConsent("denied");
  clearAnalyticsCookies();
}

/**
 * Sends a custom event through the gtag command queue that the container's GA4
 * Google tag consumes. No standalone gtag.js script is installed, and page
 * views are left to that Google tag so Next.js client navigation is not
 * counted twice.
 *
 * Never include names, email addresses, phone numbers or message content.
 */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  if (readAnalyticsConsent() !== "granted") return;

  const disabled = (window as unknown as Record<string, unknown>)[analyticsDisabledFlag()];
  if (disabled === true) return;

  ensureGtagQueue();
  window.gtag?.("event", name, params);
}
