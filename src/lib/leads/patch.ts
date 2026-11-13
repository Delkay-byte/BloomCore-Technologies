import { isValidEmail } from "./domain";
import type { LeadPatch } from "./repository";

/**
 * Request-body validation for the lead PATCH endpoint.
 *
 * Kept separate from the route so the exact messages the console shows can be
 * tested without an Access token: an invalid owner, an over-long action or a
 * malformed follow-up must explain what to fix, and an empty save must be
 * rejected rather than silently doing nothing.
 */

export const ASSIGNEE_MAX = 160;
export const NEXT_ACTION_MAX = 300;

export type PatchParse =
  | { ok: true; patch: LeadPatch }
  | { ok: false; message: string };

export function parseLeadFields(
  raw: Record<string, unknown>,
  options: { allowEmpty?: boolean } = {},
): PatchParse {
  const patch: LeadPatch = {};

  if ("assignedTo" in raw) {
    const value = typeof raw.assignedTo === "string" ? raw.assignedTo.trim() : "";
    if (value.length > ASSIGNEE_MAX) {
      return {
        ok: false,
        message: `An owner email address must be ${ASSIGNEE_MAX} characters or fewer.`,
      };
    }
    // An empty value clears the owner. Anything else must be a usable address,
    // otherwise the follow-up list would carry an owner nobody can contact.
    if (value && !isValidEmail(value)) {
      return { ok: false, message: "Enter a valid email address for the owner, or clear the field." };
    }
    patch.assignedTo = value ? value.toLowerCase() : null;
  }

  if ("nextAction" in raw) {
    const value = typeof raw.nextAction === "string" ? raw.nextAction.trim() : "";
    if (value.length > NEXT_ACTION_MAX) {
      return { ok: false, message: `The next action must be ${NEXT_ACTION_MAX} characters or fewer.` };
    }
    patch.nextAction = value || null;
  }

  if ("nextFollowUpAt" in raw) {
    const value = typeof raw.nextFollowUpAt === "string" ? raw.nextFollowUpAt.trim() : "";
    if (!value) {
      // Clearing is a real change, not an invalid date.
      patch.nextFollowUpAt = null;
    } else {
      const parsed = Date.parse(value);
      if (Number.isNaN(parsed)) {
        return { ok: false, message: "Enter a valid follow-up date and time, or clear the field." };
      }
      // Store one canonical UTC form so range filters, sorting and the
      // follow-up-due query all compare like with like.
      patch.nextFollowUpAt = new Date(parsed).toISOString();
    }
  }

  if ("archived" in raw) {
    patch.archived = raw.archived === true;
  }

  if (Object.keys(patch).length === 0 && !options.allowEmpty) {
    return { ok: false, message: "There is nothing to save." };
  }

  return { ok: true, patch };
}
