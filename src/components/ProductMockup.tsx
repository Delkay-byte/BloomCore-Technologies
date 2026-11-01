import { cn } from "@/lib/utils";

type MockupKind = "schemeknit" | "bik-prestige" | "tillproof";

function Chrome({
  appName,
  nav,
  activeIndex,
  children,
}: {
  appName: string;
  nav: string[];
  activeIndex: number;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2">
        <span aria-hidden="true" className="h-2 w-2 rounded-full border border-foreground/25" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full border border-foreground/25" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full border border-foreground/25" />
        <span className="ml-2 truncate font-mono text-[10px] tracking-[0.08em] text-foreground-faint uppercase">
          {appName}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[8.5rem_1fr]">
        <div className="hidden flex-col gap-1 border-r border-border bg-muted/50 p-2.5 sm:flex">
          {nav.map((item, index) => (
            <span
              key={item}
              className={cn(
                "rounded px-2 py-1.5 text-[11px]",
                index === activeIndex
                  ? "bg-foreground font-medium text-background"
                  : "text-foreground-subtle",
              )}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="min-w-0 p-3.5 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

function Row({
  label,
  meta,
  right,
}: {
  label: string;
  meta?: string;
  right?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-2 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-foreground">{label}</p>
        {meta && <p className="truncate font-mono text-[9px] text-foreground-faint">{meta}</p>}
      </div>
      {right && (
        <span className="shrink-0 font-mono text-[9px] tracking-[0.06em] text-foreground-faint uppercase">
          {right}
        </span>
      )}
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-muted/40 p-2.5">
      <p className="font-mono text-[9px] tracking-[0.08em] text-foreground-faint uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function SchemeKnitMockup() {
  return (
    <Chrome
      appName="SchemeKnit · Lesson planning"
      nav={["Schemes", "Lesson plans", "Library", "Exports", "Account"]}
      activeIndex={1}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[13px] font-medium text-foreground">Basic 7 · Computing · Term 1</p>
          <p className="font-mono text-[9px] text-foreground-faint">
            Scheme extracted · 12 weeks · 36 lessons
          </p>
        </div>
        <span className="rounded border border-border px-2 py-0.5 font-mono text-[9px] text-foreground-subtle uppercase">
          Draft
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1.1fr_1fr]">
        <div className="rounded border border-border p-2.5">
          <p className="font-mono text-[9px] tracking-[0.08em] text-foreground-faint uppercase">
            Indicators
          </p>
          <div className="mt-1.5">
            <Row label="B7.1.1.1 Describe hardware components" meta="Week 1" right="Planned" />
            <Row label="B7.1.1.2 Classify input devices" meta="Week 1" right="Planned" />
            <Row label="B7.1.2.1 Explain storage types" meta="Week 2" right="Draft" />
            <Row label="B7.1.2.2 Compare memory units" meta="Week 2" right="Draft" />
          </div>
        </div>

        <div className="rounded border border-border p-2.5">
          <p className="font-mono text-[9px] tracking-[0.08em] text-foreground-faint uppercase">
            Lesson plan · Week 1, Lesson 1
          </p>
          <div className="mt-2 space-y-2">
            {[
              ["Learning indicator", "B7.1.1.1"],
              ["Content standard", "Demonstrate understanding of hardware"],
              ["Core competencies", "Critical thinking, digital literacy"],
              ["Phase 1 · Starter", "Recall devices used at home"],
              ["Phase 2 · New learning", "Identify components by function"],
              ["Phase 3 · Assessment", "Label a diagram of a computer"],
            ].map(([label, value]) => (
              <div key={label} className="leading-tight">
                <p className="font-mono text-[8px] tracking-[0.06em] text-foreground-faint uppercase">
                  {label}
                </p>
                <p className="text-[10px] text-foreground-subtle">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-1.5">
            <span className="rounded bg-foreground px-2 py-1 text-[9px] font-medium text-background">
              Save lesson
            </span>
            <span className="rounded border border-border px-2 py-1 text-[9px] text-foreground-subtle">
              Export
            </span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function BikMockup() {
  return (
    <Chrome
      appName="BIK Prestige Enterprise · Administration"
      nav={["Overview", "Locations", "Staff", "MoMo", "Susu", "Reports"]}
      activeIndex={1}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-foreground">Location overview</p>
        <span className="rounded border border-border px-2 py-0.5 font-mono text-[9px] text-foreground-subtle uppercase">
          Admin
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Tile label="Locations" value="—" />
        <Tile label="Staff" value="—" />
        <Tile label="Roles" value="4" />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_1fr]">
        <div className="rounded border border-border p-2.5">
          <p className="font-mono text-[9px] tracking-[0.08em] text-foreground-faint uppercase">
            Locations
          </p>
          <div className="mt-1.5">
            <Row label="Head office" meta="Administration" right="Active" />
            <Row label="Branch location" meta="Operations" right="Active" />
            <Row label="Branch location" meta="Collections" right="Active" />
          </div>
        </div>
        <div className="rounded border border-border p-2.5">
          <p className="font-mono text-[9px] tracking-[0.08em] text-foreground-faint uppercase">
            Access by role
          </p>
          <div className="mt-1.5">
            <Row label="Administrator" meta="Full configuration" right="All" />
            <Row label="Manager" meta="Branch scope" right="Scoped" />
            <Row label="Collector" meta="Assigned customers" right="Scoped" />
            <Row label="Staff" meta="Own records" right="Scoped" />
          </div>
        </div>
      </div>

      <p className="mt-3 font-mono text-[8px] leading-4 tracking-[0.04em] text-foreground-faint uppercase">
        Representative layout · no customer records shown
      </p>
    </Chrome>
  );
}

function TillProofMockup() {
  return (
    <Chrome
      appName="TillProof · Owner dashboard (concept)"
      nav={["Dashboard", "Catalogue", "Transfers", "Pricing", "Audit"]}
      activeIndex={0}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-foreground">Stock by location</p>
        <span className="rounded border border-dashed border-border px-2 py-0.5 font-mono text-[9px] text-foreground-faint uppercase">
          Concept
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Accra stock", "In transit", "Shop floor"].map((location, index) => (
          <span
            key={location}
            className={cn(
              "rounded border px-2 py-1 text-[9px]",
              index === 0
                ? "border-foreground/30 bg-foreground text-background"
                : "border-border text-foreground-subtle",
            )}
          >
            {location}
          </span>
        ))}
      </div>

      <div className="mt-3 rounded border border-border p-2.5">
        <Row label="Cable · 2.5 mm² · coil" meta="EL-000001" right="24 in stock" />
        <Row label="Socket · 13 A double" meta="EL-000142" right="6 in stock" />
        <Row label="Breaker · 32 A" meta="EL-000208" right="18 in stock" />
        <Row label="LED lamp · 9 W" meta="EL-000311" right="Low" />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Tile label="Pending transfers" value="2" />
        <Tile label="Recorded events" value="All" />
        <Tile label="Price changes" value="Approved" />
      </div>

      <p className="mt-3 font-mono text-[8px] leading-4 tracking-[0.04em] text-foreground-faint uppercase">
        Interface concept · not a live deployment
      </p>
    </Chrome>
  );
}

export function ProductMockup({
  kind,
  className,
}: {
  kind: MockupKind;
  className?: string;
}) {
  return (
    <div className={className}>
      {kind === "schemeknit" && <SchemeKnitMockup />}
      {kind === "bik-prestige" && <BikMockup />}
      {kind === "tillproof" && <TillProofMockup />}
      <p className="mt-3 text-xs leading-5 text-foreground-faint">
        Interface representation prepared for this website. It is not a screenshot of a customer
        environment and contains no customer, staff or financial records.
      </p>
    </div>
  );
}
