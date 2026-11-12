import type { Metadata } from "next";
import Link from "next/link";
import { currentStaff } from "@/lib/leads/session";

export const metadata: Metadata = {
  title: "Lead desk",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/internal/leads", label: "Leads" },
  { href: "/internal/notifications", label: "Notifications" },
];

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const { identity } = await currentStaff();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <a
        href="#main"
        className="sr-only rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>
      <header className="border-b border-line bg-accent text-accent-contrast">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link href="/internal/leads" className="flex items-center gap-3">
            <span className="font-display text-[1.35rem] leading-none">BloomCore</span>
            <span className="text-[0.8125rem] font-semibold tracking-[0.14em] text-accent-contrast/70 uppercase">
              Lead desk
            </span>
          </Link>
          <nav aria-label="Internal sections" className="flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[7px] px-3 py-2 text-[0.9375rem] font-semibold text-accent-contrast/85 transition-colors hover:bg-accent-contrast/10 hover:text-accent-contrast"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4 text-[0.8125rem] text-accent-contrast/70">
            {identity ? (
              <span className="max-w-[240px] truncate" title={identity.email}>
                {identity.email}
              </span>
            ) : (
              <span>Not signed in</span>
            )}
            <Link
              href="/"
              className="hidden underline-offset-4 hover:text-accent-contrast hover:underline sm:inline"
            >
              Public site
            </Link>
          </div>
        </div>
      </header>
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
