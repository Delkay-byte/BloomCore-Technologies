"use client";

export const OPEN_HELP_EVENT = "bloomcore:open-help";

export function AssistantTrigger({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_HELP_EVENT))}
      aria-label="Open the BloomCore assistant"
      className={
        className ??
        "inline-flex h-11 items-center gap-2 rounded-[7px] text-[0.875rem] font-semibold text-foreground-subtle transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      }
    >
      <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M2.5 4h15v9.5H9.5L5 17v-3.5H2.5V4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {showLabel && <span>Ask the assistant</span>}
    </button>
  );
}
