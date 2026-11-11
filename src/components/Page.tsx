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
    default: "max-w-[1240px]",
    wide: "max-w-[1440px]",
  };

  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", widths[width], className)}>
      {children}
    </div>
  );
}

/** Sentence-case label. Kept for pages that still need a written category. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.9375rem] leading-6 font-medium text-foreground-subtle">{children}</p>
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
        <p className={cn("lead mt-6 max-w-2xl text-foreground-subtle", align === "right" && "ml-auto")}>
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
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbs?: ReadonlyArray<Crumb>;
}) {
  return (
    <section className={cn("bg-background pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24")}>
      <Container width="wide">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="grid gap-8 pt-8 lg:grid-cols-12 lg:items-end lg:gap-12 lg:pt-12">
          <div className="lg:col-span-8">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className={cn("h1 max-w-5xl", eyebrow && "mt-4")}>{title}</h1>
          </div>
          {lead && (
            <div className="lg:col-span-4 lg:pb-2">
              <p className="lead max-w-xl text-foreground-subtle">{lead}</p>
            </div>
          )}
        </div>
        {children}
      </Container>
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
        "flex flex-col gap-5 text-[1.0625rem] leading-[1.65] text-foreground-subtle",
        "[&_h2]:mt-4 [&_h2]:text-[1.65rem] [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-2 [&_h3]:text-[1.2rem] [&_h3]:font-semibold [&_h3]:text-foreground",
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
    <dl className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-2 bg-surface px-5 py-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] sm:gap-8 sm:px-6"
        >
          <dt className="h3 text-[1.1rem] text-foreground">{item.term}</dt>
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
        "group inline-flex items-center gap-3 text-[1rem] font-medium text-foreground underline-offset-4 hover:underline",
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
    default: "bg-gold text-[#15170f]",
    invert: "bg-background text-foreground",
    muted: "bg-transparent text-foreground-subtle ring-1 ring-inset ring-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.8125rem] leading-none font-medium",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}
