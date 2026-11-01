import Link from "next/link";
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
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-[1440px]",
  };

  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[width], className)}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.16em] text-foreground-faint uppercase">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-accent" />
      {children}
    </p>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  bordered = true,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <section
      className={cn(
        "bg-background pt-16 pb-14 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20",
        bordered && "border-b border-border",
      )}
    >
      <Container width="wide">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-6 max-w-2xl text-base leading-7 text-foreground-subtle sm:text-lg">
            {lead}
          </p>
        )}
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
        "flex flex-col gap-5 text-base leading-7 text-foreground-subtle",
        "[&_h2]:mt-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
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
    <dl className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <div key={item.term} className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-6">
          <dt className="font-mono text-[11px] font-medium tracking-[0.14em] text-foreground-faint uppercase sm:pt-1">
            {item.term}
          </dt>
          <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">{item.detail}</dd>
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
        "group inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="text-accent transition-transform duration-200 group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
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
    default: "border-accent/35 text-accent",
    invert: "border-neutral-700 bg-neutral-900 text-neutral-100",
    muted: "border-border text-foreground-subtle",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.1em] uppercase",
        tones[tone],
      )}
    >
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current" />
      {label}
    </span>
  );
}
