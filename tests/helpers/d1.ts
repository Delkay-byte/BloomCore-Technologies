/**
 * A real D1-shaped database for tests, backed by Node's built-in SQLite.
 *
 * The repository, filter builder and notification queries run against the
 * actual migration schema and real SQL semantics — date inclusivity, NULL
 * handling and idempotent UPDATEs are therefore tested, not mocked.
 */
import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

function statementReturnsRows(sql: string): boolean {
  const text = sql.trim().toUpperCase();
  return (
    text.startsWith("SELECT") ||
    text.startsWith("PRAGMA") ||
    text.startsWith("WITH") ||
    text.startsWith("EXPLAIN") ||
    /\bRETURNING\b/.test(text)
  );
}

function normalizeParams(values: unknown[]): Array<string | number | bigint | null | Uint8Array> {
  return values.map((value) => {
    if (value === undefined) return null;
    if (typeof value === "boolean") return value ? 1 : 0;
    return value as string | number | bigint | null | Uint8Array;
  });
}

class TestStatement {
  // Node's type stripping does not support parameter properties, so the fields
  // are declared and assigned explicitly.
  private readonly database: DatabaseSync;
  private readonly sql: string;
  private readonly params: unknown[];

  constructor(database: DatabaseSync, sql: string, params: unknown[] = []) {
    this.database = database;
    this.sql = sql;
    this.params = params;
  }

  bind(...values: unknown[]): TestStatement {
    return new TestStatement(this.database, this.sql, values);
  }

  private prepared() {
    return this.database.prepare(this.sql);
  }

  async first<T>(): Promise<T | null> {
    const row = this.prepared().get(...normalizeParams(this.params));
    return (row as T | undefined) ?? null;
  }

  async all<T>(): Promise<{ success: boolean; results: T[] }> {
    const rows = this.prepared().all(...normalizeParams(this.params)) as T[];
    return { success: true, results: rows };
  }

  async run(): Promise<{ success: boolean; results?: unknown[]; meta: { changes: number } }> {
    if (statementReturnsRows(this.sql)) {
      const rows = this.prepared().all(...normalizeParams(this.params));
      return { success: true, results: rows, meta: { changes: rows.length } };
    }
    const info = this.prepared().run(...normalizeParams(this.params));
    return { success: true, meta: { changes: Number(info.changes ?? 0) } };
  }

  async raw<T>(): Promise<T[]> {
    return this.prepared().all(...normalizeParams(this.params)) as T[];
  }
}

export type TestDatabase = {
  database: DatabaseSync;
  prepare(sql: string): TestStatement;
  batch(statements: TestStatement[]): Promise<Array<{ success: boolean; results?: unknown[]; meta: { changes: number } }>>;
  exec(sql: string): Promise<{ count: number; duration: number }>;
};

/**
 * Every migration, in filename order — the same sequence `wrangler d1
 * migrations apply` uses. Tests therefore exercise the current schema rather
 * than only the initial one.
 */
export function migrationSql(): string {
  const directory = join(ROOT, "migrations");
  return readdirSync(directory)
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .map((name) => readFileSync(join(directory, name), "utf8"))
    .join("\n");
}

/** A fresh in-memory database with the production schema applied. */
export function createTestDatabase(): TestDatabase {
  const database = new DatabaseSync(":memory:");
  database.exec("PRAGMA foreign_keys = ON;");
  database.exec(migrationSql());

  // D1 serialises batches per database. The in-process shim must do the same
  // or concurrent callers hit "cannot start a transaction within a transaction".
  let queue: Promise<unknown> = Promise.resolve();

  return {
    database,
    prepare: (sql) => new TestStatement(database, sql),
    batch(statements) {
      const runBatch = async () => {
        const results: Array<{ success: boolean; results?: unknown[]; meta: { changes: number } }> = [];
        database.exec("BEGIN");
        try {
          for (const statement of statements) results.push(await statement.run());
          database.exec("COMMIT");
        } catch (error) {
          database.exec("ROLLBACK");
          throw error;
        }
        return results;
      };
      const next = queue.then(runBatch, runBatch);
      queue = next.catch(() => undefined);
      return next;
    },
    async exec(sql) {
      database.exec(sql);
      return { count: 0, duration: 0 };
    },
  };
}

/** A minimal LeadEnv: only the D1 binding is required by the data layer. */
export function testEnv(): { LEADS_DB: TestDatabase } {
  return { LEADS_DB: createTestDatabase() };
}

type LeadSeed = {
  id?: string;
  leadNumber?: string;
  name?: string;
  email?: string;
  organization?: string | null;
  product?: string | null;
  enquiryType?: string;
  status?: string;
  assignedTo?: string | null;
  nextAction?: string | null;
  nextFollowUpAt?: string | null;
  archivedAt?: string | null;
  createdAt?: string;
};

/** Insert a lead with deterministic values, bypassing the numbering sequence. */
export async function insertLead(
  env: { LEADS_DB: TestDatabase },
  seed: LeadSeed = {},
): Promise<string> {
  const id = seed.id ?? crypto.randomUUID();
  const createdAt = seed.createdAt ?? "2026-11-10T09:00:00.000Z";
  await env.LEADS_DB.prepare(
    `INSERT INTO leads (
       id, lead_number, full_name, email, organization, enquiry_type, product, message, status,
       assigned_to, next_action, next_follow_up_at, archived_at, created_at, updated_at
     ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  )
    .bind(
      id,
      seed.leadNumber ?? `BC-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      seed.name ?? "Test Contact",
      seed.email ?? `test-${id.slice(0, 6)}@example.com`,
      seed.organization ?? null,
      seed.enquiryType ?? "general",
      seed.product === undefined ? "tillproof" : seed.product,
      "A test enquiry message.",
      seed.status ?? "new",
      seed.assignedTo ?? null,
      seed.nextAction ?? null,
      seed.nextFollowUpAt ?? null,
      seed.archivedAt ?? null,
      createdAt,
      createdAt,
    )
    .run();
  return id;
}
