import Link from "next/link";
import { Container, Eyebrow } from "@/components/Page";
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
    <section className="flex flex-1 items-center bg-background py-24 sm:py-32">
      <Container width="narrow">
        <Eyebrow>404 — Page not found</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          This page does not exist
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-foreground-subtle">
          The address may be mistyped, or the page may have moved. Nothing was lost — the links below
          lead to what the site actually contains.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.home} size="lg">
            Go to the homepage
          </ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
            Contact BloomCore Technologies
          </ButtonLink>
        </div>

        <nav aria-label="Site sections" className="mt-12 border-t border-border pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-foreground-subtle underline-offset-4 hover:text-foreground hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
