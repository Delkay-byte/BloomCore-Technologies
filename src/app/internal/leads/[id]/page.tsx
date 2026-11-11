import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsoleSignInRequired } from "@/components/internal/ConsoleGuard";
import { LeadActions } from "@/components/internal/LeadActions";
import { categoryLabel, productLabel, STAGE_LABELS, type PipelineStage } from "@/lib/leads/domain";
import { getLeadDetail } from "@/lib/leads/repository";
import { currentStaff } from "@/lib/leads/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <dt className="text-[0.75rem] font-semibold tracking-wide text-foreground-faint uppercase">
        {label}
      </dt>
      <dd className="text-[0.9375rem] break-words text-foreground">{value || "—"}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: Props) {
  const { env, identity } = await currentStaff();
  if (!identity) return <ConsoleSignInRequired />;

  const { id } = await params;
  const detail = await getLeadDetail(env, id);
  if (!detail) notFound();

  const { lead, activity, notes, notifications } = detail;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
      <Link
        href="/internal/leads"
        className="text-[0.875rem] font-semibold text-foreground-subtle underline underline-offset-4 hover:text-foreground"
      >
        ← Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h3 text-[1.7rem] text-foreground">{lead.full_name}</h1>
          <p className="mt-1 text-[0.9375rem] text-foreground-subtle">
            {lead.lead_number} · received {formatDateTime(lead.created_at)}
          </p>
        </div>
        <span className="inline-flex rounded-full bg-surface-2 px-3 py-1.5 text-[0.8125rem] font-bold text-foreground ring-1 ring-inset ring-line-strong">
          {STAGE_LABELS[lead.status as PipelineStage] ?? lead.status}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-[var(--radius)] bg-surface p-5">
            <h2 className="text-[0.9375rem] font-bold text-foreground">Enquiry</h2>
            <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <Row label="Enquiry type" value={categoryLabel(lead.enquiry_type)} />
              <Row label="Product" value={lead.product ? productLabel(lead.product) : "—"} />
              <Row label="Preferred contact" value={lead.preferred_contact_method} />
              <Row label="Timeline" value={lead.project_timeline} />
              <Row label="Budget" value={lead.budget_range} />
            </dl>
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-[0.75rem] font-semibold tracking-wide text-foreground-faint uppercase">
                Message
              </p>
              <p className="mt-2 text-[0.9375rem] leading-7 whitespace-pre-wrap text-foreground">
                {lead.message}
              </p>
            </div>
          </section>

          <section className="rounded-[var(--radius)] bg-surface p-5">
            <h2 className="text-[0.9375rem] font-bold text-foreground">Contact</h2>
            <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <Row
                label="Email"
                value={
                  <a className="break-all underline underline-offset-4" href={`mailto:${lead.email}`}>
                    {lead.email}
                  </a>
                }
              />
              <Row
                label="Phone"
                value={
                  lead.phone ? (
                    <a className="underline underline-offset-4" href={`tel:${lead.phone}`}>
                      {lead.phone}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <Row label="Organisation" value={lead.organization} />
              <Row label="Country/region" value={lead.country_or_region} />
            </dl>
          </section>

          <section className="rounded-[var(--radius)] bg-surface p-5">
            <h2 className="text-[0.9375rem] font-bold text-foreground">Source</h2>
            <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <Row label="Landing page" value={lead.landing_page} />
              <Row label="Referrer" value={lead.referrer} />
              <Row label="UTM source" value={lead.utm_source} />
              <Row label="UTM medium" value={lead.utm_medium} />
              <Row label="UTM campaign" value={lead.utm_campaign} />
              <Row label="Source" value={lead.source} />
            </dl>
          </section>

          <section className="rounded-[var(--radius)] bg-surface p-5">
            <h2 className="text-[0.9375rem] font-bold text-foreground">Activity</h2>
            {activity.length === 0 ? (
              <p className="mt-3 text-[0.9375rem] text-foreground-subtle">No activity yet.</p>
            ) : (
              <ol className="mt-3 flex flex-col gap-4">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <div>
                      <p className="text-[0.9375rem] font-medium text-foreground">{entry.summary}</p>
                      {entry.detail && (
                        <p className="mt-0.5 text-[0.875rem] text-foreground-subtle">{entry.detail}</p>
                      )}
                      <p className="mt-0.5 text-[0.8125rem] text-foreground-faint">
                        {formatDateTime(entry.created_at)} · {entry.actor ?? "system"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-[var(--radius)] bg-surface p-5">
            <h2 className="text-[0.9375rem] font-bold text-foreground">Internal notes</h2>
            {notes.length === 0 ? (
              <p className="mt-3 text-[0.9375rem] text-foreground-subtle">No notes yet.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-4">
                {notes.map((noteItem) => (
                  <li key={noteItem.id} className="rounded-[var(--radius)] bg-muted p-4">
                    <p className="text-[0.9375rem] leading-7 whitespace-pre-wrap text-foreground">
                      {noteItem.body}
                    </p>
                    <p className="mt-2 text-[0.8125rem] text-foreground-faint">
                      {noteItem.author} · {formatDateTime(noteItem.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <LeadActions
            leadId={lead.id}
            status={lead.status}
            assignedTo={lead.assigned_to}
            nextAction={lead.next_action}
            nextFollowUpAt={lead.next_follow_up_at}
          />

          <section className="rounded-[var(--radius)] bg-surface p-5">
            <h2 className="text-[0.9375rem] font-bold text-foreground">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="mt-3 text-[0.9375rem] text-foreground-subtle">Nothing queued.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {notifications.map((notification) => (
                  <li key={notification.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
                    <p className="text-[0.875rem] font-medium text-foreground">
                      {notification.type} · {notification.channel}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] break-all text-foreground-subtle">
                      {notification.recipient}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] text-foreground-faint">
                      {notification.status} · attempts {notification.attempt_count}
                      {notification.failure_reason ? ` · ${notification.failure_reason}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
