"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROLE_LABELS, type StaffRole } from "@/lib/leads/permissions";
import { staffFetch } from "@/lib/leads/staff-client";

type StaffRecord = {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  active: number;
  created_at: string;
};

const MANAGED_ROLES: StaffRole[] = ["staff_member", "accountant_read_only"];

function roleOf(value: string): StaffRole {
  return value === "accountant_read_only" ? "accountant_read_only" : "staff_member";
}

export function StaffManager({ staff }: { staff: StaffRecord[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<StaffRole>("staff_member");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [draftRoles, setDraftRoles] = useState<Record<string, StaffRole>>(() =>
    Object.fromEntries(staff.map((row) => [row.id, roleOf(row.role)])),
  );
  const [draftNames, setDraftNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(staff.map((row) => [row.id, row.display_name ?? ""])),
  );

  const run = async (
    key: string,
    action: () => Promise<Awaited<ReturnType<typeof staffFetch>>>,
    done: string,
  ): Promise<boolean> => {
    if (pending) return false;
    setPending(key);
    setError(null);
    setNotice(null);
    try {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      setNotice(done);
      router.refresh();
      return true;
    } catch {
      setError("The change could not be saved. Please try again.");
      return false;
    } finally {
      setPending(null);
    }
  };

  const add = () => {
    if (pending) return;
    void run(
      "add",
      () =>
        staffFetch("/internal/api/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, displayName, role }),
        }),
      "Staff account created. Add the same email to both Cloudflare Access policies before they sign in.",
    ).then((created) => {
      // Keep the typed values when creation fails so the owner can correct
      // the address or name and retry without retyping the form.
      if (!created) return;
      setEmail("");
      setDisplayName("");
      setRole("staff_member");
    });
  };

  const save = (row: StaffRecord) => {
    const body: Record<string, unknown> = {};
    if ((draftNames[row.id] ?? "").trim() !== (row.display_name ?? "")) {
      body.displayName = draftNames[row.id];
    }
    if (roleOf(draftRoles[row.id] ?? row.role) !== roleOf(row.role)) {
      body.role = draftRoles[row.id];
    }
    if (Object.keys(body).length === 0) {
      setNotice("No changes to save for that account.");
      return;
    }
    void run(
      row.id,
      () =>
        staffFetch(`/internal/api/staff/${row.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      "Staff account updated.",
    );
  };

  const setActive = (row: StaffRecord, active: boolean) => {
    void run(
      `${row.id}-active`,
      () =>
        staffFetch(`/internal/api/staff/${row.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active }),
        }),
      active ? "Staff account activated." : "Staff account deactivated.",
    );
  };

  const busy = pending !== null;

  return (
    <div className="mt-6 flex flex-col gap-6">
      {error && (
        <p role="alert" className="border-l-4 border-foreground bg-muted px-4 py-3 text-[0.875rem] text-foreground">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="border-l-4 border-accent bg-accent-soft px-4 py-3 text-[0.875rem] text-foreground">
          {notice}
        </p>
      )}

      <section className="rounded-[var(--radius)] bg-surface p-5">
        <h2 className="text-[0.9375rem] font-bold text-foreground">Add a staff account</h2>
        <p className="mt-1 text-[0.8125rem] leading-6 text-foreground-subtle">
          Any legitimate business address is accepted; a company mailbox is not required. The
          account cannot sign in until the same email is allowed in both Cloudflare Access
          applications. Creating a record never sends an invitation.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              className="field mt-1.5"
              placeholder="name@gmail.com"
            />
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Display name
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={120}
              className="field mt-1.5"
              placeholder="Kwame Mensah"
            />
          </label>
          <label className="text-[0.8125rem] font-semibold text-foreground">
            Role
            <select
              value={role}
              onChange={(event) => setRole(roleOf(event.target.value))}
              className="field mt-1.5"
            >
              {MANAGED_ROLES.map((value) => (
                <option key={value} value={value}>
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="button"
              disabled={busy || !email.trim() || displayName.trim().length < 2}
              onClick={add}
              className="inline-flex h-10 items-center rounded-[7px] bg-accent px-5 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong disabled:opacity-50"
            >
              {pending === "add" ? "Adding…" : "Add staff"}
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-[var(--radius)] bg-surface">
        <table className="w-full border-collapse text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-line text-[0.75rem] tracking-wide text-foreground-faint uppercase">
              <th className="px-4 py-3 font-semibold">Staff member</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center">
                  <p className="font-display text-[1.4rem] text-foreground">No staff accounts yet</p>
                  <p className="mx-auto mt-2 max-w-lg text-[0.9375rem] leading-6 text-foreground-subtle">
                    The owner can use the form above to add the first staff member or read-only
                    accountant. Add the same email to both Cloudflare Access applications before
                    that person signs in.
                  </p>
                </td>
              </tr>
            )}
            {staff.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0 align-top">
                <td className="px-4 py-4">
                  <input
                    type="text"
                    value={draftNames[row.id] ?? ""}
                    onChange={(event) =>
                      setDraftNames((current) => ({ ...current, [row.id]: event.target.value }))
                    }
                    maxLength={120}
                    aria-label={`Display name for ${row.email}`}
                    className="field h-9"
                  />
                  <p className="mt-1 break-all text-[0.8125rem] text-foreground-subtle">{row.email}</p>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={draftRoles[row.id] ?? roleOf(row.role)}
                    onChange={(event) =>
                      setDraftRoles((current) => ({
                        ...current,
                        [row.id]: roleOf(event.target.value),
                      }))
                    }
                    aria-label={`Role for ${row.email}`}
                    className="field h-9"
                  >
                    {MANAGED_ROLES.map((value) => (
                      <option key={value} value={value}>
                        {ROLE_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-bold ${
                      row.active
                        ? "bg-accent text-accent-contrast"
                        : "bg-surface-3 text-foreground-subtle"
                    }`}
                  >
                    {row.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => save(row)}
                      className="inline-flex h-9 items-center rounded-[7px] border border-line-strong px-3 text-[0.8125rem] font-semibold text-foreground hover:bg-surface-2 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setActive(row, !row.active)}
                      className="inline-flex h-9 items-center rounded-[7px] border border-line-strong px-3 text-[0.8125rem] font-semibold text-foreground hover:bg-surface-2 disabled:opacity-50"
                    >
                      {row.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
