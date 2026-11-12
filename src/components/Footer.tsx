import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/brand/bloomcore-logo-white.png";
import { CurrentYear } from "@/components/CurrentYear";
import { AnalyticsSettingsButton } from "@/components/AnalyticsSettingsButton";
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
      className="text-[0.9375rem] leading-6 text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {children}
    </Link>
  );
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.75rem] font-semibold tracking-[0.08em] text-white/45 uppercase">
      {children}
    </h2>
  );
}

/**
 * Corporate footer. A fixed black field in both themes, because the supplied
 * logo is white. Restrained scale: the brand mark is small, the closing CTA is
 * a single link, and nothing here competes with the hero.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] text-white">
      <div className="page-frame">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              aria-label={`${BRAND.name} — home`}
              className="inline-flex w-max rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src={logo}
                alt={BRAND.name}
                sizes="200px"
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-6 text-white/65">
              Software products and engineering, built in Ghana for the work that actually happens.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.875rem] text-white/55 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {item.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
            <Link
              href={ROUTES.contact}
              className="group mt-7 inline-flex items-center gap-3 border-b border-white/30 pb-1 text-[0.9375rem] font-semibold text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Start a project
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path
                  d="M1 6h15M11.5 1.5 16 6l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </svg>
            </Link>
          </div>

          <nav aria-label="Footer products" className="lg:col-span-2">
            <ColumnHeading>Products</ColumnHeading>
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

          <nav aria-label="Footer company" className="lg:col-span-2">
            <ColumnHeading>Company</ColumnHeading>
            <ul className="mt-4 flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="mt-4 flex flex-col gap-3 text-[0.9375rem] leading-6">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="font-semibold break-words text-white transition-colors hover:text-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phoneCallsWhatsapp}`}
                  className="text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {CONTACT.phoneCallsWhatsapp}
                </a>
                <span className="mt-0.5 block text-[0.8125rem] text-white/40">
                  Calls and WhatsApp
                </span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phoneCallsOnly}`}
                  className="text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {CONTACT.phoneCallsOnly}
                </a>
                <span className="mt-0.5 block text-[0.8125rem] text-white/40">Calls only</span>
              </li>
            </ul>
            <p className="mt-5 text-[0.8125rem] leading-5 text-white/40">{CONTACT.address}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] leading-5 text-white/40">
            © <CurrentYear fallback={2026} /> {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-white/50">
            <Link
              href={ROUTES.privacy}
              className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Privacy notice
            </Link>
            <AnalyticsSettingsButton className="text-left text-[0.8125rem] text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" />
            <span>{CONTACT.registration} · Registered in Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
