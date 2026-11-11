"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PIPELINE_STAGES, STAGE_LABELS, STAGES_REQUIRING_REASON, type PipelineStage } from "@/lib/leads/domain";

type Props = {
  leadId: string;
  status: string;
  assignedTo: string | null;
  nextAction: string | null;
  nextFollowUpAt: string | null;
};

async function send(url: string, method: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) return { ok: true };
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: data.error ?? "The change could not be saved." };
  } catch {
    return { ok: false, error: "The change could not be saved. Check your connection and try again." };
  }
}

export function LeadActions({ leadId, status, assignedTo, nextAction, nextFollowUpAt }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [stage, setStage] = useState(status);
  const [reason, setReason] = useState("");
  const [assignee, setAssignee] = useState(assignedTo ?? "");
  const [action, setAction] = useState(nextAction ?? "");
  const [followUp, setFollowUp] = useState(
    nextFollowUpAt ? nextFollowUpAt.slice(0, 16) : "",
  );
  const [note, setNote] = useState("");

  const run = async (key: string, fn: () => Promise<{ ok: boolean; error?: string }>, done: string) => {
    setPending(key);
    setError(null);
    setNotice(null);
    const result = await fn();
    setPending(null);
    if (result.ok) {
      setNotice(done);
      router.refresh();
    } else {
      setError(result.error ?? "The change could not be saved.");
    }
  };

  const needsReason = STAGES_REQUIRING_REASON.includes(stage as PipelineStage);

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p role="alert" className="border-l-4 border-gold bg-muted px-4 py-3 text-[0.875rem] text-foreground">
          {error}
        </p>
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
                () => send(`/api/internal/leads/${leadId}`, "PATCH", { status: stage, outcomeReason: reason }),
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
              placeholder="What happens next"
              className="field mt-1.5"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() =>
            run(
              "follow",
              () =>
                send(`/api/internal/leads/${leadId}`, "PATCH", {
                  assignedTo: assignee,
                  nextAction: action,
                  nextFollowUpAt: followUp ? new Date(followUp).toISOString() : "",
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
                const result = await send(`/api/internal/leads/${leadId}/notes`, "POST", { body: note });
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
            onClick={() =>
              run(
                "archive",
                () => send(`/api/internal/leads/${leadId}`, "PATCH", { archived: true }),
                "Lead archived.",
              )
            }
            className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-5 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            Archive lead
          </button>
          <button
            type="button"
            disabled={pending !== null}
            onClick={() =>
              run(
                "archive",
                () => send(`/api/internal/leads/${leadId}`, "PATCH", { archived: false }),
                "Lead restored.",
              )
            }
            className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-5 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            Restore
          </button>
        </div>
      </section>
    </div>
  );
}
