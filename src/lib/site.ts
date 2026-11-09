/**
 * Single source for the site's public origin.
 *
 * The official production domain is bloomcoretech.com. Canonical URLs, Open
 * Graph metadata, the sitemap and robots.txt must always use it, so a stale or
 * preview hostname in the build environment can never leak into production.
 *
 * NEXT_PUBLIC_SITE_URL is kept for staging only. It is ignored when it points
 * at a Netlify preview host, localhost or an otherwise non-public origin.
 */
const OFFICIAL_URL = "https://bloomcoretech.com";

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function isPublicOrigin(value: string | undefined): value is string {
  if (!value) return false;
  if (!/^https?:\/\//i.test(value)) return false;
  if (/netlify\.app$/i.test(value.replace(/\/+$/, ""))) return false;
  if (/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(value)) return false;
  return true;
}

export const SITE_URL = (isPublicOrigin(configuredUrl) ? configuredUrl : OFFICIAL_URL).replace(
  /\/+$/,
  "",
);

export const isSiteUrlConfigured = SITE_URL === OFFICIAL_URL || isPublicOrigin(configuredUrl);

export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
