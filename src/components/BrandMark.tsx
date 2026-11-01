import { cn } from "@/lib/utils";

/**
 * The BloomCore Technologies monogram: two interlocking C-shapes around a B.
 * Rendered inline so it inherits colour and stays sharp at any size. The tile
 * uses `currentColor` and the glyph uses the page background, which makes the
 * same geometry work on light and dark surfaces.
 */
export function BrandMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-foreground", className)}
    >
      <rect width="64" height="64" rx="12" fill="currentColor" />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="10"
        fill="none"
        stroke="var(--background)"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <path d="M16 12h10a8 8 0 0 1 0 16H16v12h-6V12z" fill="var(--background)" />
      <path
        d="M30 12h14a10 10 0 0 1 10 10v6a10 10 0 0 1-10 10H34"
        stroke="var(--background)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="46" cy="24" r="3" fill="var(--background)" />
      <circle cx="46" cy="40" r="3" fill="var(--background)" />
      <circle cx="36" cy="24" r="3" fill="currentColor" />
      <circle cx="36" cy="40" r="3" fill="currentColor" />
    </svg>
  );
}
