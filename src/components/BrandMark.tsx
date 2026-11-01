import { cn } from "@/lib/utils";

/**
 * The BloomCore Technologies symbol: "Core & Frame".
 *
 * A solid core square emerges through the open corner of a geometric frame.
 * The frame is the expanding structure; the opening gives it direction. The
 * mark deliberately uses no letterforms, arrows, leaves or circuit motifs.
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
        d="M20 10h30v30"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="square"
      />
      <rect x="24" y="32" width="18" height="18" rx="3" fill="#FFFFFF" />
    </svg>
  );
}
