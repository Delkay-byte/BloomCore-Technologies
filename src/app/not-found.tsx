import Link from "next/link";
import { Container } from "@/components/Page";
import { SiteChrome } from "@/components/SiteChrome";
import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/lib/brand";

const links = [
  { label: "Home", href: ROUTES.home },
  { label: "Products", href: ROUTES.products },
  { label: "Services", href: ROUTES.services },
  { label: "Work", href: ROUTES.work },
  { label: "Contact", href: ROUTES.contact },
];

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="flex flex-1 items-center bg-background py-20 sm:py-28">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-7">
            <p className="display text-[clamp(5rem,16vw,12rem)] leading-[0.8] text-accent">404</p>
            <h1 className="h1 mt-6 max-w-[16ch]">This page does not exist</h1>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-foreground-subtle">
              The address may be mistyped, or the page may have moved. Nothing was lost — the links
              below lead to what the site actually contains.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ROUTES.home} size="lg">
                Go to the homepage
              </ButtonLink>
              <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
                Contact BloomCore
              </ButtonLink>
            </div>
          </div>
        </div>

        <nav aria-label="Site sections" className="mt-14">
          <p className="text-[0.8125rem] font-semibold text-foreground-faint">
            Site sections
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-[7px] border border-line px-4 py-2 text-[0.9375rem] font-semibold text-foreground-subtle transition-colors hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </Container>
      </section>
    </SiteChrome>
  );
}

