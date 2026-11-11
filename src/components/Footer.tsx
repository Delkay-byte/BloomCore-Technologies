import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/brand/bloomcore-logo-white.png";
import { CurrentYear } from "@/components/CurrentYear";
import { AnalyticsSettingsButton } from "@/components/AnalyticsSettingsButton";
import { AssistantTrigger } from "@/components/AssistantTrigger";
import { BRAND, CONTACT, PRODUCTS, ROUTES, SOCIAL } from "@/lib/brand";

const companyLinks = [
  { label: "About", href: ROUTES.about },
  { label: "Services", href: ROUTES.services },
  { label: "Work", href: ROUTES.work },
  { label: "Resources", href: ROUTES.resources },
  { label: "Founder", href: ROUTES.founder },
  { label: "Contact", href: ROUTES.contact },
];

const productHrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  maacash: ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[0.9375rem] text-foreground-subtle transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-background p-2.5">
      <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-12">
        <div className="flex min-h-[220px] flex-col justify-between rounded-[var(--radius)] bg-[#0c3b30] p-6 text-[#f8f5ec] sm:col-span-2 sm:p-7 lg:col-span-5">
          <Link href="/" aria-label={`${BRAND.name} — home`} className="inline-flex w-max">
            <Image src={logo} alt={BRAND.name} sizes="260px" className="h-10 w-auto sm:h-11" />
          </Link>
          <div className="mt-8">
            <p className="max-w-md font-display text-[1.9rem] leading-[1.05] sm:text-[2.2rem]">
              Software products and engineering, built in Ghana for the work that actually happens.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.875rem] text-[#f8f5ec]/75 underline underline-offset-4 transition-colors hover:text-[#f8f5ec]"
                >
                  {item.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <nav
          aria-label="Footer products"
          className="flex min-h-[220px] flex-col rounded-[var(--radius)] bg-surface p-6 sm:p-7 lg:col-span-3"
        >
          <h2 className="text-[0.9375rem] font-bold text-foreground">Products</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {PRODUCTS.map((product) => (
              <li key={product.slug}>
                <FooterLink href={productHrefs[product.slug]}>{product.name}</FooterLink>
              </li>
            ))}
            <li>
              <FooterLink href={ROUTES.products}>All products</FooterLink>
            </li>
          </ul>
        </nav>

        <nav
          aria-label="Footer company"
          className="flex min-h-[220px] flex-col rounded-[var(--radius)] bg-surface p-6 sm:p-7 lg:col-span-2"
        >
          <h2 className="text-[0.9375rem] font-bold text-foreground">Company</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-h-[220px] flex-col justify-between rounded-[var(--radius)] bg-surface-2 p-6 sm:p-7 lg:col-span-2">
          <div>
            <h2 className="text-[0.9375rem] font-bold text-foreground">Contact</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-[0.9375rem] text-foreground-subtle">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="font-semibold transition-colors hover:text-foreground">
                  Email BloomCore
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phoneCallsWhatsapp}`} className="transition-colors hover:text-foreground">
                  {CONTACT.phoneCallsWhatsapp}
                </a>
                <span className="mt-0.5 block text-[0.8125rem] text-foreground-faint">
                  Calls and WhatsApp
                </span>
              </li>
              <li>
                <a href={`tel:${CONTACT.phoneCallsOnly}`} className="transition-colors hover:text-foreground">
                  {CONTACT.phoneCallsOnly}
                </a>
                <span className="mt-0.5 block text-[0.8125rem] text-foreground-faint">Calls only</span>
              </li>
            </ul>
          </div>
          <p className="mt-6 text-[0.8125rem] leading-5 text-foreground-faint">{CONTACT.address}</p>
        </div>

        <div className="relative flex min-h-[180px] items-end overflow-hidden rounded-[var(--radius)] bg-[#0c3b30] p-6 sm:col-span-2 sm:p-7 lg:col-span-8">
          <Link href="/" aria-label={`${BRAND.name} — home`} className="block w-full">
            <Image
              src={logo}
              alt={BRAND.name}
              sizes="(min-width: 1024px) 70vw, 92vw"
              className="h-auto w-full max-w-[820px]"
            />
          </Link>
        </div>

        <Link
          href={ROUTES.contact}
          className="group flex min-h-[180px] flex-col justify-between rounded-[var(--radius)] bg-gold p-6 text-gold-contrast sm:p-7 lg:col-span-4"
        >
          <span className="font-display text-[2rem] leading-none sm:text-[2.4rem]">
            Start a project
          </span>
          <span className="flex items-end justify-between gap-4">
            <span className="text-[0.9375rem] leading-6">Tell us what the work needs to do.</span>
            <svg width="38" height="24" viewBox="0 0 38 24" fill="none" aria-hidden="true">
              <path
                d="M1 12h34M25 2l10 10-10 10"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </svg>
          </span>
        </Link>

        <div className="flex flex-col gap-3 rounded-[var(--radius)] bg-surface p-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:col-span-12">
          <p className="text-[0.8125rem] leading-5 text-foreground-faint">
            © <CurrentYear fallback={2026} /> {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-foreground-faint">
            <Link href={ROUTES.privacy} className="transition-colors hover:text-foreground">
              Privacy notice
            </Link>
            <AnalyticsSettingsButton />
            <AssistantTrigger
              showLabel
              className="text-[0.8125rem] text-foreground-faint transition-colors hover:text-foreground"
            />
            <span>{CONTACT.registration} · Registered in Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
