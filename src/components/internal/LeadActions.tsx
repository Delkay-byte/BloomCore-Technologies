"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { PIPELINE_STAGES, STAGE_LABELS, STAGES_REQUIRING_REASON, type PipelineStage } from "@/lib/leads/domain";
import { fromLocalInputValue, toLocalInputValue } from "@/lib/leads/datetime";
import { staffFetch, type StaffResult } from "@/lib/leads/staff-client";

type Props = {
  leadId: string;
  status: string;
  assignedTo: string | null;
  nextAction: string | null;
  nextFollowUpAt: string | null;
};

type SavedLead = {
  status?: string;
  assigned_to?: string | null;
  next_action?: string | null;
  next_follow_up_at?: string | null;
};

/**
 * Console requests go to `/internal/api/**`, the same-origin twin of
 * `/api/internal/**`. Both are served by the same guarded handlers; the
 * `/internal` path keeps the request inside the dashboard's Cloudflare Access
 * application, so a signed-in browser is never re-challenged mid-save.
 */
export function LeadActions({ leadId, status, assignedTo, nextAction, nextFollowUpAt }: Props) {
  const router = useRouter();
  // A ref, not state: two clicks in the same tick both see the old state.
  const inFlight = useRef(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [stage, setStage] = useState(status);
  const [reason, setReason] = useState("");
  const [assignee, setAssignee] = useState(assignedTo ?? "");
  const [action, setAction] = useState(nextAction ?? "");
  const [followUp, setFollowUp] = useState(() => toLocalInputValue(nextFollowUpAt));
  const [note, setNote] = useState("");

  const applySaved = (lead?: SavedLead) => {
    if (!lead) return;
    if (typeof lead.status === "string") setStage(lead.status);
    setAssignee(lead.assigned_to ?? "");
    setAction(lead.next_action ?? "");
    setFollowUp(toLocalInputValue(lead.next_follow_up_at));
    setReason("");
  };

  const run = async (
    key: string,
    fn: () => Promise<StaffResult<{ lead?: SavedLead }>>,
    done: string,
  ) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(key);
    setError(null);
    setSessionExpired(false);
    setNotice(null);

    try {
      const result = await fn();
      if (result.ok) {
        applySaved(result.data.lead);
        setNotice(done);
        router.refresh();
        return;
      }
      // Input is left exactly as typed so the owner can correct and retry.
      setError(result.error);
      setSessionExpired(result.sessionExpired);
    } catch {
      setError("The change could not be saved. Please try again.");
    } finally {
      inFlight.current = false;
      setPending(null);
    }
  };

  const patch = (body: unknown): Promise<StaffResult<{ lead?: SavedLead }>> =>
    staffFetch<{ lead?: SavedLead }>(`/internal/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const needsReason = STAGES_REQUIRING_REASON.includes(stage as PipelineStage);

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div
          role="alert"
          className="border-l-4 border-foreground bg-muted px-4 py-3 text-[0.875rem] text-foreground"
        >
          <p>{error}</p>
          {sessionExpired && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 font-semibold underline underline-offset-4"
            >
              Reload and sign in
            </button>
          )}
        </div>
      )}
      {notice && (
        <p role="status" className="border-l-4 border-accent bg-accent-soft px-4 py-3 text-[0.875rem] text-foreground">
          {notice}
        </p>
      )}

      <section className="rounded-[var(--radius)] bg-surface p-4">
        <h2 className="text-[0.9375rem] font-bold text-foreground">Pipeline stage</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Stage
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              className="field mt-1.5 min-w-[12rem]"
            >
              {PIPELINE_STAGES.map((value) => (
                <option key={value} value={value}>
                  {STAGE_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          {needsReason && (
            <label className="flex-1 text-[0.8125rem] font-semibold text-foreground">
              Reason (required)
              <input
                type="text"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={300}
                placeholder="Why the lead is being closed"
                className="field mt-1.5"
              />
            </label>
          )}
          <button
            type="button"
            disabled={pending !== null}
            onClick={() =>
              run(
                "stage",
                () => patch({ status: stage, outcomeReason: reason }),
                "Stage updated.",
              )
            }
            className="inline-flex h-10 items-center rounded-[7px] bg-accent px-5 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong disabled:opacity-50"
          >
            {pending === "stage" ? "Saving…" : "Update stage"}
          </button>
        </div>
      </section>

      <section className="rounded-[var(--radius)] bg-surface p-4">
        <h2 className="text-[0.9375rem] font-bold text-foreground">Owner and follow-up</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Assigned to
            <input
              type="email"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
              maxLength={160}
              placeholder="staff@bloomcoretech.com"
              className="field mt-1.5"
            />
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Next follow-up
            <input
              type="datetime-local"
              value={followUp}
              onChange={(event) => setFollowUp(event.target.value)}
              className="field mt-1.5"
            />
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground sm:col-span-2">
            Next action
            <input
              type="text"
              value={action}
              onChange={(event) => setAction(event.target.value)}
              maxLength={300}
              placeholder="What happens next"
              className="field mt-1.5"
            />
          </label>
        </div>
        <p className="mt-2 text-[0.75rem] text-foreground-faint">
          Follow-up times are shown in this browser&apos;s timezone and stored in UTC.
          Clear a field to remove that value.
        </p>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() =>
            run(
              "follow",
              () =>
                patch({
                  assignedTo: assignee,
                  nextAction: action,
                  nextFollowUpAt: fromLocalInputValue(followUp) ?? "",
                }),
              "Owner and follow-up saved.",
            )
          }
          className="mt-3 inline-flex h-10 items-center rounded-[7px] bg-accent px-5 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong disabled:opacity-50"
        >
          {pending === "follow" ? "Saving…" : "Save"}
        </button>
      </section>

      <section className="rounded-[var(--radius)] bg-surface p-4">
        <h2 className="text-[0.9375rem] font-bold text-foreground">Internal note</h2>
        <p className="mt-1 text-[0.8125rem] text-foreground-subtle">
          Notes are private. They are never shown to the person who submitted the enquiry.
        </p>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          maxLength={4000}
          className="field mt-3 resize-y"
          placeholder="What was discussed, and what happens next"
        />
        <button
          type="button"
          disabled={pending !== null || note.trim().length < 2}
          onClick={() =>
            run(
              "note",
              async () => {
                const result = await staffFetch<{ lead?: SavedLead }>(
                  `/internal/api/leads/${leadId}/notes`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ body: note }),
                  },
                );
                if (result.ok) setNote("");
                return result;
              },
              "Note added.",
            )
          }
          className="mt-3 inline-flex h-10 items-center rounded-[7px] border border-line-strong px-5 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
        >
          {pending === "note" ? "Saving…" : "Add note"}
        </button>
      </section>

      <section className="rounded-[var(--radius)] bg-surface p-4">
        <h2 className="text-[0.9375rem] font-bold text-foreground">Archive</h2>
        <p className="mt-1 text-[0.8125rem] text-foreground-subtle">
          Archiving hides the lead from the default list. Nothing is deleted.
        </p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => run("archive", () => patch({ archived: true }), "Lead archived.")}
            className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-5 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            Archive lead
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={() => run("restore", () => patch({ archived: false }), "Lead restored.")}
            className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-5 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            Restore
          </button>
        </div>
      </section>
    </div>
  );
}
