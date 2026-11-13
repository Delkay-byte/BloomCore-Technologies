"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { PIPELINE_STAGES, STAGE_LABELS, STAGES_REQUIRING_REASON, type PipelineStage } from "@/lib/leads/domain";
import { fromLocalInputValue, toLocalInputValue } from "@/lib/leads/datetime";
import { can, ROLE_LABELS, type StaffRole } from "@/lib/leads/permissions";
import { staffFetch, type StaffResult } from "@/lib/leads/staff-client";

export type AssignableOption = {
  email: string;
  displayName: string | null;
  role: StaffRole;
};

type Props = {
  leadId: string;
  role: StaffRole;
  status: string;
  assignedTo: string | null;
  nextAction: string | null;
  nextFollowUpAt: string | null;
  assignable: AssignableOption[];
};

type SavedLead = {
  status?: string;
  assigned_to?: string | null;
  next_action?: string | null;
  next_follow_up_at?: string | null;
};

type SavedSummary = {
  assignedTo: string | null;
  nextAction: string | null;
  nextFollowUpAt: string | null;
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Console requests go to `/internal/api/**`, the same-origin twin of
 * `/api/internal/**`. Both are served by the same guarded handlers; the
 * `/internal` path keeps the request inside the dashboard's Cloudflare Access
 * application, so a signed-in browser is never re-challenged mid-save.
 *
 * The role comes from the server. Hiding controls is a courtesy for the
 * accountant; the API independently refuses every mutation.
 */
export function LeadActions({
  leadId,
  role,
  status,
  assignedTo,
  nextAction,
  nextFollowUpAt,
  assignable,
}: Props) {
  const router = useRouter();
  // A ref, not state: two clicks in the same tick both see the old state.
  const inFlight = useRef(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedSummary>({
    assignedTo,
    nextAction,
    nextFollowUpAt,
  });

  const [stage, setStage] = useState(status);
  const [reason, setReason] = useState("");
  const [assignee, setAssignee] = useState(assignedTo ?? "");
  const [action, setAction] = useState(nextAction ?? "");
  const [followUp, setFollowUp] = useState(() => toLocalInputValue(nextFollowUpAt));
  const [note, setNote] = useState("");

  const canUpdate = can(role, "leads.update");
  const canAssign = can(role, "leads.assign");
  const canArchive = can(role, "leads.archive");
  const canNote = can(role, "leads.note");

  const nameFor = (email: string | null): string | null => {
    if (!email) return null;
    return assignable.find((option) => option.email === email.toLowerCase())?.displayName ?? null;
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
        const lead = result.data.lead;
        if (lead) {
          if (typeof lead.status === "string") setStage(lead.status);
          setSaved((current) => ({
            assignedTo: lead.assigned_to === undefined ? current.assignedTo : lead.assigned_to,
            nextAction: lead.next_action === undefined ? current.nextAction : lead.next_action,
            nextFollowUpAt:
              lead.next_follow_up_at === undefined
                ? current.nextFollowUpAt
                : lead.next_follow_up_at,
          }));
        }
        if (key === "follow") {
          // The agreed behaviour: a successful owner/follow-up save clears the
          // inputs, and the saved values are shown in a separate summary.
          setAssignee("");
          setAction("");
          setFollowUp("");
        }
        setNotice(done);
        router.refresh();
        return;
      }
      // Input is left exactly as typed so it can be corrected and retried.
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

  const savedAssigneeName = nameFor(saved.assignedTo);

  const summary = (
    <section className="rounded-[var(--radius)] bg-surface p-4">
      <h2 className="text-[0.9375rem] font-bold text-foreground">Assignment summary</h2>
      <dl className="mt-3 flex flex-col gap-2 text-[0.875rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-foreground-subtle">Assigned to</dt>
          <dd className="text-right text-foreground">
            {saved.assignedTo
              ? `${savedAssigneeName ? `${savedAssigneeName} — ` : ""}${saved.assignedTo}`
              : "Unassigned"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-foreground-subtle">Follow-up</dt>
          <dd className="text-right text-foreground">{formatDateTime(saved.nextFollowUpAt)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-foreground-subtle">Next action</dt>
          <dd className="text-right text-foreground">{saved.nextAction ?? "—"}</dd>
        </div>
      </dl>
    </section>
  );

  if (!canUpdate) {
    return (
      <div className="flex flex-col gap-5">
        <section className="rounded-[var(--radius)] bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[0.9375rem] font-bold text-foreground">Accountant access</h2>
            <span className="inline-flex rounded-full bg-surface-2 px-2.5 py-1 text-[0.75rem] font-bold text-foreground ring-1 ring-inset ring-line-strong">
              Read-only
            </span>
          </div>
          <p className="mt-2 text-[0.875rem] leading-6 text-foreground-subtle">
            This account can review every lead, its notes and its history. Changes, assignments,
            notes, exports and staff management are disabled on the server.
          </p>
        </section>
        {summary}
      </div>
    );
  }

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
          {canAssign ? (
            <label className="text-[0.8125rem] font-semibold text-foreground">
              Assigned to
              <select
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
                className="field mt-1.5"
              >
                <option value="">Unassigned</option>
                {assignedTo &&
                  !assignable.some((option) => option.email === assignedTo.toLowerCase()) && (
                    <option value={assignedTo}>
                      {assignedTo} (inactive — reassign this lead)
                    </option>
                  )}
                {assignable.map((option) => (
                  <option key={option.email} value={option.email}>
                    {option.displayName ? `${option.displayName} — ${option.email}` : option.email}
                    {` (${ROLE_LABELS[option.role]})`}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="text-[0.8125rem] font-semibold text-foreground">
              Assigned to
              <p className="mt-1.5 rounded-[7px] bg-muted px-3 py-2 text-[0.875rem] font-normal text-foreground">
                {assignedTo
                  ? `${nameFor(assignedTo) ? `${nameFor(assignedTo)} — ` : ""}${assignedTo}`
                  : "Unassigned"}
              </p>
            </div>
          )}
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
          {!canAssign && " An owner can change the assigned worker."}
        </p>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() =>
            run(
              "follow",
              () =>
                patch(
                  canAssign
                    ? {
                        assignedTo: assignee,
                        nextAction: action,
                        nextFollowUpAt: fromLocalInputValue(followUp) ?? "",
                      }
                    : {
                        nextAction: action,
                        nextFollowUpAt: fromLocalInputValue(followUp) ?? "",
                      },
                ),
              "Owner and follow-up saved.",
            )
          }
          className="mt-3 inline-flex h-10 items-center rounded-[7px] bg-accent px-5 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong disabled:opacity-50"
        >
          {pending === "follow" ? "Saving…" : "Save"}
        </button>
      </section>

      {summary}

      {canNote && (
        <section className="rounded-[var(--radius)] bg-surface p-4">
          <h2 className="text-[0.9375rem] font-bold text-foreground">Internal note</h2>
          <p className="mt-1 text-[0.8125rem] text-foreground-subtle">
            Notes are private. They are never shown to the person who submitted the enquiry and are
            not included in assignment emails.
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
      )}

      {canArchive && (
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
      )}
    </div>
  );
}
