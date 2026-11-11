import { cn } from "@/lib/utils";

/*
 * Interface fragments. These are representative crops built from the
 * documented product capabilities. They contain no customer, staff or
 * financial records, and each root is marked data-ui so interface conventions
 * (small control borders, true-size type) stay intact.
 */

function ChromeBar({
  app,
  meta,
  status,
}: {
  app: string;
  meta?: string;
  status?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full bg-[var(--product-accent,var(--accent))]"
        />
        <span className="truncate text-[12px] font-medium text-foreground">{app}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {meta && <span className="hidden text-[11px] text-foreground-faint sm:inline">{meta}</span>}
        {status && (
          <span className="border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-foreground-subtle">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

function IndicatorRow({
  code,
  label,
  week,
  state,
  active,
}: {
  code: string;
  label: string;
  week: string;
  state: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-3 py-2.5",
        active ? "bg-[var(--product-accent,#0d3b31)] text-white" : "bg-background text-foreground",
      )}
    >
      <div className="min-w-0">
        <p className={cn("truncate text-[12px] font-medium", active ? "text-white" : "text-foreground")}>
          {label}
        </p>
        <p className={cn("text-[10px]", active ? "text-white/90" : "text-foreground-faint")}>
          {code} · {week}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 border px-1.5 py-0.5 text-[10px] font-medium",
          active
            ? "border-white/30 text-white/90"
            : "border-border text-foreground-subtle",
        )}
      >
        {state}
      </span>
    </div>
  );
}

export function SchemeKnitFragment({ className }: { className?: string }) {
  return (
    <div
      data-ui
      className={cn(
        "overflow-hidden border border-border bg-surface",
        className,
      )}
      style={{ "--product-accent": "#1c7189" } as React.CSSProperties}
    >
      <ChromeBar app="SchemeKnit · Lesson planning" meta="Basic 7 · Computing" status="Draft" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold text-foreground">Term 1 · Week 1</p>
            <p className="mt-0.5 text-[11px] text-foreground-faint">
              36 lesson plans from 12 scheme weeks
            </p>
          </div>
          <span className="bg-[#e6f1f3] px-2 py-1 text-[10px] font-medium text-[#1c7189]">
            3 of 36 planned
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden bg-muted">
          <div className="h-full w-[34%] bg-[#1c7189]" />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <IndicatorRow
            code="B7.1.1.1"
            label="Identify hardware components"
            week="Week 1"
            state="Planned"
            active
          />
          <IndicatorRow
            code="B7.1.1.2"
            label="Classify input devices"
            week="Week 1"
            state="Planned"
          />
          <IndicatorRow
            code="B7.1.2.1"
            label="Explain storage types"
            week="Week 2"
            state="Draft"
          />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="bg-muted p-3">
            <p className="text-[10px] text-foreground-faint">Lesson plan</p>
            <p className="mt-1 text-[11px] leading-4 text-foreground">
              Starter, new learning and assessment, built around the selected indicator.
            </p>
          </div>
          <div className="bg-muted p-3">
            <p className="text-[10px] text-foreground-faint">Export</p>
            <p className="mt-1 text-[11px] leading-4 text-foreground">
              Review, edit, then export for printing or submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MaaCashFragment({ className }: { className?: string }) {
  return (
    <div
      data-ui
      className={cn("overflow-hidden border border-border bg-surface", className)}
      style={{ "--product-accent": "#0d3b31" } as React.CSSProperties}
    >
      <ChromeBar app="MaaCash · Business workspace" meta="Organisation administration" status="Admin" />
      <div className="grid grid-cols-1 sm:grid-cols-[9rem_1fr]">
        <div className="hidden flex-col gap-0.5 border-r border-border bg-muted/60 p-2.5 sm:flex">
          {["Overview", "Locations", "Staff", "Money & history", "Susu customers", "Reports"].map(
            (item, index) => (
              <span
                key={item}
                className={cn(
                  "px-2 py-1.5 text-[11px]",
                  index === 1
                    ? "bg-[#0d3b31] font-medium text-white"
                    : "text-foreground-subtle",
                )}
              >
                {item}
              </span>
            ),
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[14px] font-semibold text-foreground">Location overview</p>
            <span className="border border-border px-2 py-0.5 text-[10px] text-foreground-subtle">
              3 locations
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["Locations", "3"],
              ["Roles", "4"],
              ["Reconciled", "Today"],
            ].map(([label, value]) => (
              <div key={label} className="bg-muted p-2.5">
                <p className="text-[10px] text-foreground-faint">{label}</p>
                <p className="mt-1 text-[15px] font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-background">
            {[
              ["Administrator", "Full configuration", "All"],
              ["Manager", "Branch scope", "Scoped"],
              ["Collector", "Assigned customers", "Scoped"],
              ["Operations", "Recorded activity", "Scoped"],
            ].map(([role, scope, access]) => (
              <div
                key={role}
                className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-foreground">{role}</p>
                  <p className="truncate text-[10px] text-foreground-faint">{scope}</p>
                </div>
                <span className="shrink-0 text-[10px] text-foreground-subtle">{access}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-4 text-foreground-faint">
            Representative workspace layout. No customer records are shown.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TillProofFragment({ className }: { className?: string }) {
  return (
    <div
      data-ui
      className={cn("overflow-hidden border border-border bg-surface", className)}
      style={{ "--product-accent": "#44515e" } as React.CSSProperties}
    >
      <ChromeBar app="TillProof · Owner dashboard" meta="Stock by location" status="Concept" />
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {["Shop floor", "Store room", "In transit"].map((location, index) => (
            <span
              key={location}
              className={cn(
                "border px-2 py-1 text-[10px]",
                index === 0
                  ? "border-[#44515e] bg-[#44515e] text-white"
                  : "border-border text-foreground-subtle",
              )}
            >
              {location}
            </span>
          ))}
        </div>
        <div className="mt-3 bg-background">
          {[
            ["Cable · 2.5 mm² · coil", "EL-000001", "24"],
            ["Socket · 13 A double", "EL-000142", "6"],
            ["Breaker · 32 A", "EL-000208", "18"],
            ["LED lamp · 9 W", "EL-000311", "Low"],
          ].map(([label, code, qty]) => (
            <div
              key={code}
              className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-foreground">{label}</p>
                <p className="text-[10px] text-foreground-faint">{code}</p>
              </div>
              <span className="shrink-0 text-[10px] text-foreground-subtle">{qty} in stock</span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Pending transfers", "2"],
            ["Price changes", "Approved"],
            ["Recorded events", "All"],
          ].map(([label, value]) => (
            <div key={label} className="bg-muted p-2.5">
              <p className="text-[10px] text-foreground-faint">{label}</p>
              <p className="mt-1 text-[12px] font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-4 text-foreground-faint">
          Interface concept for a product in development. Not a live deployment.
        </p>
      </div>
    </div>
  );
}

export function ProductFragment({
  kind,
  className,
}: {
  kind: "schemeknit" | "maacash" | "tillproof";
  className?: string;
}) {
  if (kind === "schemeknit") return <SchemeKnitFragment className={className} />;
  if (kind === "maacash") return <MaaCashFragment className={className} />;
  return <TillProofFragment className={className} />;
}
