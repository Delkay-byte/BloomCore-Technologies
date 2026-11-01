import { cn } from "@/lib/utils";

/**
 * The BloomCore Technologies monogram.
 *
 * A block-built B and an open C share one 6-unit stroke weight inside a
 * deep-green field. The geometry is deliberately simple so the mark holds at
 * 16px and still reads as BC, not as a single abstract glyph.
 */
export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="64" height="64" rx="14" fill="#0B5D4B" />
      <path
        fillRule="evenodd"
        fill="#FFFFFF"
        d="M7 14h18a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H7zM13 19h10v10H13zM13 35h10v10H13z"
      />
      <path
        d="M57 17H42a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h15"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6"
      />
    </svg>
  );
}
