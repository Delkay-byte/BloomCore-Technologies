import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Minimal structural types for the D1 binding.
 *
 * The repository deliberately does not depend on the generated
 * `cloudflare-env.d.ts` (it is git-ignored), so the Worker types are declared
 * here rather than pulled from `@cloudflare/workers-types`.
 */
export interface D1Result<T = unknown> {
  success: boolean;
  results?: T[];
  meta?: {
    duration?: number;
    changes?: number;
    last_row_id?: number;
    rows_read?: number;
    rows_written?: number;
  };
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(columnName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export type LeadEnv = {
  LEADS_DB: D1Database;
  LEADS_ENVIRONMENT?: string;
  LEAD_NOTIFICATION_EMAIL?: string;
  EMAIL_FROM?: string;
  EMAIL_REPLY_TO?: string;
  RESEND_API_KEY?: string;
  DASHBOARD_ORIGIN?: string;
  SITE_URL?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  INTERNAL_ALLOWED_EMAILS?: string;
  INTERNAL_DEV_BYPASS?: string;
};

export async function getLeadEnv(): Promise<LeadEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env as unknown as LeadEnv;
}

export function db(env: LeadEnv): D1Database {
  if (!env.LEADS_DB) {
    throw new Error(
      "LEADS_DB binding is missing. Add the D1 database to wrangler.jsonc before using the lead service.",
    );
  }
  return env.LEADS_DB;
}

export async function all<T>(stmt: D1PreparedStatement): Promise<T[]> {
  const result = await stmt.all<T>();
  return result.results ?? [];
}

export async function first<T>(stmt: D1PreparedStatement): Promise<T | null> {
  return (await stmt.first<T>()) ?? null;
}

export async function run(stmt: D1PreparedStatement): Promise<D1Result> {
  return stmt.run();
}
