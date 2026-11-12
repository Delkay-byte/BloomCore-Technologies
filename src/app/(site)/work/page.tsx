import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Container, PageHero, StatusBadge } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, PRODUCTS, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Software Products and Projects",
  description:
    "Software built by BloomCore Technologies: SchemeKnit, MaaCash and TillProof, with the operating problem each one addresses.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: `Work — ${BRAND.name}`,
    url: "/work",
    description:
      "Software built by BloomCore Technologies: SchemeKnit, MaaCash and TillProof, with the operating problem each one addresses.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Work — ${BRAND.name}`,
    description:
      "Software built by BloomCore Technologies: SchemeKnit, MaaCash and TillProof, with the operating problem each one addresses.",
    images: ["/og-image.png"],
  },
};

const hrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  "maacash": ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

const detail: Record<
  string,
  {
    industry: string;
    problem: string;
    built: string;
    statusNote: string;
  }
> = {
  schemeknit: {
    industry: "Education technology",
    problem:
      "Teachers hold a scheme of learning and separately produce weekly lesson plans. The repetition consumes planning time, and the plan can drift from the indicators the scheme sets out.",
    built:
      "A web platform that extracts the structure of an uploaded scheme, presents it for review, generates lesson plans around each indicator, and lets a teacher edit and export the result.",
    statusNote: "Available and in use by teachers.",
  },
  "maacash": {
    industry: "Business operations",
    problem:
      "Organisations running several locations keep staff records, collection records and money records separately. Oversight depends on someone compiling figures by hand.",
    built:
      "A multi-location administration platform with scoped roles, staff management, mobile-money operations and susu collection workflows recorded against the person and location responsible.",
    statusNote: "Available and in use.",
  },
  tillproof: {
    industry: "Retail technology",
    problem:
      "Electrical retailers carry high-value, individually identifiable stock. When records live in a notebook, an owner cannot see what left the shelf, at what price, or who handled the cash.",
    built:
      "In development: stock traceability across shops, controlled price changes, recorded cash handling and an audit trail an owner can investigate.",
    statusNote: "In active development. Not released.",
  },
};

const principles = [
  {
    title: "No invented case studies",
    detail:
      "We do not publish client logos, testimonials or outcome figures we cannot evidence. What appears here is software BloomCore Technologies has built.",
  },
  {
    title: "Status stated plainly",
    detail:
      "A product is called available only when it is available. Anything in development is labelled as in development on every page that mentions it.",
  },
  {
    title: "Interfaces shown honestly",
    detail:
      "The interface representations on product pages are labelled as representations. They are not screenshots of customer environments.",
  },
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Products built and operated here."
        lead="The portfolio is small on purpose. Each entry is software the company has built, described with the problem it addresses and its actual status."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.products} size="lg">
            Product directory
          </ButtonLink>
          <ButtonLink href={ROUTES.services} variant="outline" size="lg">
            Services
          </ButtonLink>
        </div>
        <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-2">
          {[
            ["Products", "3"],
            ["Available", "2"],
            ["In build", "1"],
          ].map(([term, value]) => (
            <div key={term} className="rounded-[8px] bg-surface-2 px-4 py-3">
              <dt className="text-[0.75rem] font-semibold text-foreground-faint">{term}</dt>
              <dd className="mt-1 font-display text-[1.8rem] leading-none text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <div className="bg-surface">
        {PRODUCTS.map((product) => {
          const entry = detail[product.slug];
          return (
            <section key={product.slug} className="py-12 sm:py-16">
              <Container width="wide">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                        {entry.industry}
                      </p>
                      <StatusBadge
                        label={product.statusLabel}
                        tone={product.status === "live" ? "default" : "muted"}
                      />
                    </div>
                    <h2 className="h2 mt-3">
                      <Link
                        href={hrefs[product.slug]}
                        className="underline-offset-4 hover:underline"
                      >
                        {product.name}
                      </Link>
                    </h2>
                    <p className="mt-3 text-[0.9375rem] text-foreground-faint">
                      {entry.statusNote}
                    </p>
                    <div className="mt-5">
                      <ArrowLink href={hrefs[product.slug]}>Read the product page</ArrowLink>
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                      The problem
                    </p>
                    <p className="mt-2 text-[1rem] leading-7 text-foreground-subtle">
                      {entry.problem}
                    </p>
                  </div>
                  <div className="lg:col-span-4">
                    <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                      What was built
                    </p>
                    <p className="mt-2 text-[1rem] leading-7 text-foreground-subtle">
                      {entry.built}
                    </p>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section className="bg-accent py-16 text-accent-contrast sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="h2 max-w-[16ch] text-accent-contrast">
                Built to be maintained after handover
              </h2>
              <p className="lead mt-6 max-w-[34ch] text-accent-contrast/75">
                Each product is written as a maintained system rather than a demonstration:
                changes reviewed before merge, staged before release, and verified after.
              </p>
            </div>
            <div className="lg:col-span-7">
              <dl className="grid gap-x-10 sm:grid-cols-3">
                {[
                  {
                    title: "Recorded decisions",
                    detail:
                      "Commit messages and short specifications record what changed and why.",
                  },
                  {
                    title: "Small releases",
                    detail: "Changes stay small enough to review and reverse without a rebuild.",
                  },
                  {
                    title: "Verified after release",
                    detail:
                      "Money, stock and personal data receive specific checks before and after deployment.",
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <dt className="text-[1.05rem] font-semibold text-accent-contrast">
                      {item.title}
                    </dt>
                    <dd className="mt-2 text-[0.9375rem] leading-6 text-accent-contrast/70">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch]">Why the portfolio looks the way it does</h2>
            </div>
            <div className="lg:col-span-8">
              <dl>
                {principles.map((item) => (
                  <div key={item.title} className="grid gap-1 py-5 sm:grid-cols-12 sm:gap-6">
                    <dt className="text-[1.05rem] font-semibold text-foreground sm:col-span-4">
                      {item.title}
                    </dt>
                    <dd className="text-[0.9375rem] leading-6 text-foreground-subtle sm:col-span-8">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 max-w-2xl text-[0.9375rem] leading-6 text-foreground-subtle">
                Client project work is not listed here. It is described only with the client&apos;s
                written permission, and that permission has not been sought for this site.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-accent py-16 text-accent-contrast sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-8">
              <h2 className="h2 max-w-[18ch] text-accent-contrast">A problem close to one of these?</h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-accent-contrast/75">
                Tell us how your organisation handles it today. We will say whether the work is a
                fit.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <ButtonLink
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Project enquiry — BloomCore Technologies")}`}
                variant="inverse"
                size="lg"
              >
                Email BloomCore Technologies
              </ButtonLink>
              <ButtonLink
                href={ROUTES.contact}
                variant="outline"
                size="lg"
                className="!border-accent-contrast/40 !text-accent-contrast hover:!bg-accent-contrast/10"
              >
                Contact details
              </ButtonLink>
            </div>
          </div>
          <div className="mt-8">
            <ArrowLink href={ROUTES.founder} className="text-accent-contrast">
              Who leads the company
            </ArrowLink>
          </div>
        </Container>
      </section>
    </>
  );
}


