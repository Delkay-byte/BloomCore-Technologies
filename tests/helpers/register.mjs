/**
 * Test-only module resolution.
 *
 * Next.js and TypeScript resolve `@/lib/...` and extensionless relative
 * imports; plain Node does not. This hook teaches the test runner the same
 * rules so tests can import the real repository modules (and their real
 * SQLite-backed D1 shim) instead of re-implementing the queries.
 */
import { registerHooks } from "node:module";
import { existsSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(ROOT, "src");
const EXTENSIONS = ["", ".ts", ".tsx", ".mts", ".js", "/index.ts", "/index.tsx"];

function firstFile(base) {
  for (const suffix of EXTENSIONS) {
    const candidate = base + suffix;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let base = null;

    if (specifier.startsWith("@/")) {
      base = join(SRC, specifier.slice(2));
    } else if (specifier.startsWith(".") || isAbsolute(specifier)) {
      const parent = context.parentURL ? fileURLToPath(context.parentURL) : join(ROOT, "index");
      base = resolvePath(dirname(parent), specifier);
    }

    if (base) {
      const file = firstFile(base);
      if (file) {
        return nextResolve(pathToFileURL(file).href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});
