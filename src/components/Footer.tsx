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
  { label: "Privacy", href: ROUTES.privacy },
];

const productHrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  "maacash": ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-mono text-[11px] font-medium tracking-[0.14em] text-foreground-faint uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

export function Footer() {

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-[#080808] px-2.5 py-1.5"
              aria-label={BRAND.name}
            >
              <Image src={logo} alt={BRAND.name} sizes="140px" className="h-10 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-foreground-subtle">
              {BRAND.description}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-foreground-faint">
              {BRAND.tagline}
            </p>
            <div className="mt-6 flex gap-5">
              {SOCIAL.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground-subtle underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {item.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Column title="Products">
              {PRODUCTS.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={productHrefs[product.slug]}
                    className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.products}
                  className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
                >
                  All products
                </Link>
              </li>
            </Column>
          </div>

          <div className="lg:col-span-2">
            <Column title="Company">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <AnalyticsSettingsButton />
              </li>
            </Column>
          </div>

          <div className="lg:col-span-4">
            <Column title="Contact">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm break-words text-foreground-subtle transition-colors hover:text-foreground"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-sm text-foreground-subtle">
                <a
                  href={`tel:${CONTACT.phoneCallsWhatsapp}`}
                  className="transition-colors hover:text-foreground"
                >
                  {CONTACT.phoneCallsWhatsapp}
                </a>{" "}
                <span className="text-foreground-faint">— calls &amp; WhatsApp</span>
              </li>
              <li className="text-sm text-foreground-subtle">
                <a
                  href={`tel:${CONTACT.phoneCallsOnly}`}
                  className="transition-colors hover:text-foreground"
                >
                  {CONTACT.phoneCallsOnly}
                </a>{" "}
                <span className="text-foreground-faint">— calls only</span>
              </li>
            </Column>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-6">
          <div className="flex flex-col gap-2 text-xs leading-5 text-foreground-faint sm:flex-row sm:items-start sm:justify-between">
            <p>
              © <CurrentYear fallback={2026} /> {BRAND.name}. All rights reserved.
            </p>
            <p className="max-w-xl sm:text-right">
              Business name registration {CONTACT.registration}. {CONTACT.registrationNote}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
