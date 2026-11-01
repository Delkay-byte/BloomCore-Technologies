"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/brand";
import { cn } from "@/lib/utils";

type ShowcaseProduct = {
  slug: string;
  name: string;
  status: string;
  href: string;
  app: string;
  preview: React.ReactNode;
};

function PreviewShell({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col gap-3">{children}</div>;
}

function Row({
  label,
  meta,
  tag,
  accent = false,
}: {
  label: string;
  meta?: string;
  tag?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-2 last:border-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", accent ? "bg-accent" : "bg-border")}
        />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-foreground">{label}</p>
          {meta && <p className="truncate font-mono text-[9px] text-foreground-faint">{meta}</p>}
        </div>
      </div>
      {tag && (
        <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[8px] tracking-[0.06em] text-foreground-subtle uppercase">
          {tag}
        </span>
      )}
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div className="flex h-full flex-col gap-3" aria-hidden="true">
      <div className="h-3.5 w-2/3 rounded bg-neutral-300 dark:bg-neutral-700" />
      <div className="h-2 w-1/3 rounded bg-neutral-300/80 dark:bg-neutral-700/70" />
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-300/70 dark:bg-neutral-700/70">
        <div className="h-full w-1/3 rounded-full bg-neutral-400 dark:bg-neutral-600" />
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-10 rounded-md border border-neutral-300/80 bg-background/50 dark:border-neutral-700/70 dark:bg-neutral-900/40"
          />
        ))}
      </div>
      <div className="mt-auto h-14 rounded-md border border-neutral-300/80 bg-background/40 dark:border-neutral-700/70 dark:bg-neutral-900/30" />
    </div>
  );
}

const products: ShowcaseProduct[] = [
  {
    slug: "schemeknit",
    name: "SchemeKnit",
    status: "Available",
    href: ROUTES.productsSchemeKnit,
    app: "Lesson planning",
    preview: (
      <PreviewShell>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Basic 7 · Computing</p>
            <p className="mt-0.5 font-mono text-[9px] text-foreground-faint">
              Term 1 · 12 weeks · 36 lessons
            </p>
          </div>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[9px] text-accent uppercase">
            Draft
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-[9px] text-foreground-faint">
            <span>Week 1 of 12</span>
            <span>3 of 36 planned</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[34%] rounded-full bg-accent" />
          </div>
        </div>

        <div className="rounded-md border border-border px-3">
          <Row label="Identify hardware components" meta="B7.1.1.1" tag="Planned" accent />
          <Row label="Classify input devices" meta="B7.1.1.2" tag="Planned" />
          <Row label="Explain storage types" meta="B7.1.2.1" tag="Draft" />
        </div>

        <div className="mt-auto rounded-md border border-border bg-muted/50 p-2.5">
          <p className="font-mono text-[8px] tracking-[0.08em] text-foreground-faint uppercase">
            Lesson plan · Week 1
          </p>
          <p className="mt-1 text-[10px] leading-4 text-foreground-subtle">
            Starter, new learning and assessment phases generated around the indicator, then edited
            and exported.
          </p>
        </div>
      </PreviewShell>
    ),
  },
  {
    slug: "bik-prestige",
    name: "BIK Prestige Enterprise",
    status: "Available",
    href: ROUTES.productsBik,
    app: "Administration",
    preview: (
      <PreviewShell>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Location overview</p>
            <p className="mt-0.5 font-mono text-[9px] text-foreground-faint">
              Organisation administration
            </p>
          </div>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[9px] text-accent uppercase">
            Admin
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ["Locations", "3"],
            ["Staff", "—"],
            ["Roles", "4"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border p-2.5">
              <p className="font-mono text-[8px] tracking-[0.08em] text-foreground-faint uppercase">
                {label}
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border px-3">
          <Row label="Administrator" meta="Full configuration" tag="All" accent />
          <Row label="Manager" meta="Branch scope" tag="Scoped" />
          <Row label="Collector" meta="Assigned customers" tag="Scoped" />
        </div>

        <div className="mt-auto rounded-md border border-border bg-muted/50 p-2.5">
          <p className="font-mono text-[8px] tracking-[0.08em] text-foreground-faint uppercase">
            Recorded operations
          </p>
          <p className="mt-1 text-[10px] leading-4 text-foreground-subtle">
            Mobile-money and susu collection activity recorded against the person and location
            responsible.
          </p>
        </div>
      </PreviewShell>
    ),
  },
  {
    slug: "tillproof",
    name: "TillProof",
    status: "In development",
    href: ROUTES.productsTillProof,
    app: "Retail oversight",
    preview: (
      <PreviewShell>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Stock by location</p>
            <p className="mt-0.5 font-mono text-[9px] text-foreground-faint">
              Owner view · concept
            </p>
          </div>
          <span className="rounded-full border border-dashed border-border px-2 py-0.5 font-mono text-[9px] text-foreground-faint uppercase">
            Concept
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["Shop floor", "Store room", "In transit"].map((location, index) => (
            <span
              key={location}
              className={cn(
                "rounded border px-2 py-1 text-[9px]",
                index === 0
                  ? "border-accent bg-accent text-accent-contrast"
                  : "border-border text-foreground-subtle",
              )}
            >
              {location}
            </span>
          ))}
        </div>

        <div className="rounded-md border border-border px-3">
          <Row label="Cable · 2.5 mm² · coil" meta="EL-000001" tag="24" accent />
          <Row label="Socket · 13 A double" meta="EL-000142" tag="6" />
          <Row label="Breaker · 32 A" meta="EL-000208" tag="18" />
        </div>

        <div className="mt-auto rounded-md border border-border bg-muted/50 p-2.5">
          <p className="font-mono text-[8px] tracking-[0.08em] text-foreground-faint uppercase">
            Audit trail
          </p>
          <p className="mt-1 text-[10px] leading-4 text-foreground-subtle">
            Price changes and cash handling recorded against the person responsible, so a
            discrepancy can be investigated.
          </p>
        </div>
      </PreviewShell>
    ),
  },
];

const positions = [
  { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)", opacity: 1, zIndex: 30 },
  {
    transform: "translate3d(10%, -26px, 0) rotate(2.5deg) scale(0.93)",
    opacity: 0.9,
    zIndex: 20,
  },
  {
    transform: "translate3d(-10%, 26px, 0) rotate(-2.5deg) scale(0.93)",
    opacity: 0.9,
    zIndex: 10,
  },
];

export function HeroShowcase() {
  const [active, setActive] = useState(0);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-x-6 -top-8 bottom-14 rounded-[2rem] bg-accent-soft opacity-80 blur-2xl"
      />

      <div className="relative h-[440px] sm:h-[450px]">
        {products.map((product, index) => {
          const position = (index - active + products.length) % products.length;
          const layout = positions[position];
          const isActive = position === 0;

          return (
            <div
              key={product.slug}
              className={cn("hero-card-in absolute inset-x-0 top-5 mx-auto w-[90%] sm:w-[86%]", !isActive && "hidden sm:block")}
              style={{ animationDelay: `${index * 90}ms`, zIndex: layout.zIndex }}
            >
              <div
                aria-hidden={!isActive}
                className="transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transform: layout.transform, opacity: layout.opacity }}
              >
                <article
                  className={cn(
                    "overflow-hidden rounded-xl border",
                    isActive
                      ? "border-accent/35 bg-background shadow-[0_24px_60px_-24px_rgba(8,8,8,0.35)]"
                      : "border-border bg-neutral-200 shadow-[0_18px_40px_-28px_rgba(8,8,8,0.45)] dark:bg-neutral-800",
                  )}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/60 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      <span className="font-mono text-[9px] tracking-[0.12em] text-foreground-faint uppercase">
                        {product.app}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-foreground-faint">
                      {product.name}
                    </span>
                  </div>

                  <div className="min-h-[270px] p-4 sm:min-h-[305px] sm:p-5">
                    {isActive ? product.preview : <SkeletonPreview />}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
                    <span
                      className={cn(
                        "font-mono text-[9px] tracking-[0.08em] uppercase",
                        product.status === "Available" ? "text-accent" : "text-foreground-faint",
                      )}
                    >
                      {product.status}
                    </span>
                    <Link
                      href={product.href}
                      tabIndex={isActive ? 0 : -1}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      Product page
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-8 flex flex-wrap items-center gap-2">
        {products.map((product, index) => {
          const isActive = index === active;
          return (
            <button
              key={product.slug}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(index)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                isActive
                  ? "border-accent bg-accent text-accent-contrast"
                  : "border-border text-foreground-subtle hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {product.name}
            </button>
          );
        })}
      </div>

      <p className="relative mt-3 font-mono text-[10px] leading-5 tracking-[0.04em] text-foreground-faint">
        Representative interfaces. No customer, staff or financial data is shown.
      </p>
    </div>
  );
}
