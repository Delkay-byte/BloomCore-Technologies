/**
 * Single source for the site's public origin.
 *
 * The production domain is not confirmed yet, so it must never be hardcoded.
 * Set NEXT_PUBLIC_SITE_URL when the real hostname and DNS are ready, for
 * example NEXT_PUBLIC_SITE_URL=https://your-confirmed-domain.example.
 *
 * Without the variable the site falls back to the local development origin,
 * which is intentionally not a claim of ownership of any public domain.
 */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredUrl || "http://localhost:3000").replace(/\/+$/, "");

export const isSiteUrlConfigured = Boolean(configuredUrl);

export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
