import Link from "next/link";

/** Internal 404: keep the Lead Desk chrome instead of the public site page. */
export default function InternalNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-1 items-center px-4 py-16 sm:px-6">
      <div className="max-w-xl">
        <p className="text-[0.8125rem] font-semibold text-foreground-faint">BloomCore internal</p>
        <h1 className="h3 mt-4 text-[1.7rem] text-foreground">That page was not found</h1>
        <p className="mt-3 text-[0.9375rem] leading-7 text-foreground-subtle">
          The record may have been removed, or the address may be out of date. Nothing in the Lead
          Desk has been changed.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/internal/leads"
            className="inline-flex h-10 items-center rounded-[7px] bg-accent px-5 text-[0.875rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong"
          >
            Back to leads
          </Link>
          <Link
            href="/internal/notifications"
            className="inline-flex h-10 items-center rounded-[7px] border border-line-strong px-5 text-[0.875rem] font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Notifications
          </Link>
        </div>
      </div>
    </div>
  );
}