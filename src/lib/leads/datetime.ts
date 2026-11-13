/**
 * Conversions between the stored UTC instants and the browser's wall clock.
 *
 * `next_follow_up_at` is stored as an ISO-8601 UTC timestamp. A
 * `<input type="datetime-local">` has no timezone: its value is a wall-clock
 * time in the viewer's locale. Slicing the stored string (`iso.slice(0, 16)`)
 * therefore shows UTC to someone in a different zone — a follow-up saved for
 * 10:00 in Accra (UTC+0) appeared as 10:00, but for a viewer at UTC+1 it would
 * silently shift by an hour. These helpers keep the round trip exact.
 */

const pad = (value: number): string => String(value).padStart(2, "0");

/** Format an ISO instant as the value a `datetime-local` input expects, in local time. */
export function toLocalInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

/**
 * Parse a `datetime-local` value, which the browser reports in local time, into
 * a UTC ISO instant. Returns null for an empty or unparseable value.
 */
export function fromLocalInputValue(value: string | null | undefined): string | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/** True when a stored timestamp is a real instant. */
export function isValidInstant(iso: string): boolean {
  return !Number.isNaN(Date.parse(iso));
}
