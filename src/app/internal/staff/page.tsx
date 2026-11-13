import { ConsoleSignInRequired } from "@/components/internal/ConsoleGuard";
import { StaffManager } from "@/components/internal/StaffManager";
import { can } from "@/lib/leads/permissions";
import { currentStaff } from "@/lib/leads/session";
import { listStaff, listStaffAudit } from "@/lib/leads/staff";

export const dynamic = "force-dynamic";

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

export default async function StaffPage() {
  const { env, identity, staff } = await currentStaff();
  if (!identity) return <ConsoleSignInRequired />;
  if (!staff) {
    return (
      <ConsoleSignInRequired detail="This account is not registered for the BloomCore Lead Desk. Ask the owner to add it before signing in again." />
    );
  }
  if (!can(staff.role, "staff.manage")) {
    return (
      <ConsoleSignInRequired detail="Staff management is restricted to the owner. Your role can still view the leads you are permitted to see." />
    );
  }

  const [rows, audit] = await Promise.all([listStaff(env, {}), listStaffAudit(env, 50)]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="h3 text-[1.7rem] text-foreground">Staff</h1>
      <p className="mt-1 max-w-3xl text-[0.9375rem] leading-6 text-foreground-subtle">
        Registered Lead Desk identities. Roles are enforced by the server; adding an email here
        does not grant access until it is allowed in both Cloudflare Access applications.
      </p>

      <StaffManager staff={rows} />

      <section className="mt-8 rounded-[var(--radius)] bg-surface p-5">
        <h2 className="text-[0.9375rem] font-bold text-foreground">Audit history</h2>
        {audit.length === 0 ? (
          <p className="mt-3 text-[0.9375rem] text-foreground-subtle">
            No staff changes recorded yet.
          </p>
        ) : (
          <ol className="mt-3 flex flex-col gap-3">
            {audit.map((entry) => (
              <li key={entry.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
                <p className="text-[0.9375rem] font-medium text-foreground">{entry.detail}</p>
                <p className="mt-0.5 text-[0.8125rem] text-foreground-faint">
                  {entry.action} · {formatDateTime(entry.created_at)} · {entry.actor ?? "system"}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
