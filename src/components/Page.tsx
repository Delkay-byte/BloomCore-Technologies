import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const widths = {
    narrow: "max-w-[820px]",
    default: "max-w-[1280px]",
    wide: "max-w-[1480px]",
  };

  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", widths[width], className)}>
      {children}
    </div>
  );
}

/** Section context, set as readable text rather than a tracked label. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[0.8125rem] leading-5 font-semibold text-foreground-faint">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
      {children}
    </p>
  );
}

export function SectionHeading({
  title,
  lead,
  align = "left",
  className,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "right" && "ml-auto text-right", className)}>
      <h2 className="h2">{title}</h2>
      {lead && (
        <p className={cn("lead mt-5 max-w-2xl text-foreground-subtle", align === "right" && "ml-auto")}>
          {lead}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  breadcrumbs,
  headingClassName,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbs?: ReadonlyArray<Crumb>;
  headingClassName?: string;
}) {
  return (
    <section className="bg-background pt-3 pb-3">
      <div className="page-frame">
        <div className="rounded-[var(--radius)] bg-surface px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-8">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              <h1 className={cn("h1 max-w-[20ch]", eyebrow && "mt-4", headingClassName)}>{title}</h1>
            </div>
            {lead && (
              <div className="lg:col-span-4 lg:pb-2">
                <p className="lead max-w-xl text-foreground-subtle">{lead}</p>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 text-[1.0625rem] leading-[1.7] text-foreground-subtle",
        "[&_h2]:mt-4 [&_h2]:text-[1.65rem] [&_h2]:leading-tight [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-2 [&_h3]:text-[1.2rem] [&_h3]:font-bold [&_h3]:text-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DefinitionList({
  items,
}: {
  items: ReadonlyArray<{ term: string; detail: string }>;
}) {
  return (
    <dl className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-2 rounded-[var(--radius)] bg-surface px-5 py-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] sm:gap-8 sm:px-6"
        >
          <dt className="text-[1.05rem] font-bold text-foreground">{item.term}</dt>
          <dd className="body-copy text-foreground-subtle">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 text-[1rem] font-semibold text-foreground underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
      <svg
        width="17"
        height="12"
        viewBox="0 0 17 12"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        <path d="M1 6h14M10.5 1.5 15 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </Link>
  );
}

export function StatusBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "invert" | "muted";
}) {
  const tones = {
    default: "bg-gold text-gold-contrast",
    invert: "bg-surface text-foreground",
    muted: "bg-transparent text-foreground-subtle ring-1 ring-inset ring-line-strong",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] leading-none font-bold",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}
