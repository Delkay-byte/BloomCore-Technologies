import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Container, Eyebrow, PageHero, StatusBadge } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, PRODUCTS, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Work",
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
        title="Products built and operated by BloomCore Technologies"
        lead="The portfolio is small on purpose. Each entry is software the company has built, described with the problem it addresses and its actual status."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.products} size="lg">
            Product directory
          </ButtonLink>
          <ButtonLink href={ROUTES.services} variant="outline" size="lg">
            Services
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-8">
            {PRODUCTS.map((product, index) => {
              const entry = detail[product.slug];
              return (
                <Reveal key={product.slug} delay={index * 0.05}>
                  <article className="rounded-lg border border-border bg-background">
                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-12">
                      <div className="lg:col-span-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                            {entry.industry}
                          </span>
                          <StatusBadge
                            label={product.statusLabel}
                            tone={product.status === "live" ? "default" : "muted"}
                          />
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                          <Link
                            href={hrefs[product.slug]}
                            className="underline-offset-4 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-foreground-faint">
                          {entry.statusNote}
                        </p>
                        <div className="mt-6">
                          <ButtonLink href={hrefs[product.slug]} variant="outline" size="sm">
                            Read the product page
                          </ButtonLink>
                        </div>
                      </div>

                      <div className="lg:col-span-8">
                        <dl className="flex flex-col gap-5">
                          <div>
                            <dt className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                              The problem
                            </dt>
                            <dd className="mt-2 text-sm leading-6 text-foreground-subtle">
                              {entry.problem}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                              What was built
                            </dt>
                            <dd className="mt-2 text-sm leading-6 text-foreground-subtle">
                              {entry.built}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-16 text-[#F5F5F5] sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
              Engineering
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-neutral-50 sm:text-3xl">
              Built to be maintained after handover
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-400">
              Each product is written as a maintained system rather than a demonstration: changes
              reviewed before merge, staged before release, and verified after.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-surface-border bg-surface-border sm:grid-cols-3">
            {[
              {
                title: "Recorded decisions",
                detail: "Commit messages and short specifications record what changed and why.",
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
              <div key={item.title} className="bg-surface p-6">
                <h3 className="text-sm font-semibold text-neutral-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Publishing standards</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Why the portfolio looks the way it does
            </h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {principles.map((item) => (
              <div key={item.title} className="bg-background p-6">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-subtle">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-6 text-foreground-subtle">
            Client project work is not listed here. It is described only with the client&apos;s
            written permission, and that permission has not been sought for this site.
          </p>
        </Container>
      </section>

      <section className="bg-muted py-16 sm:py-20">
        <Container width="narrow" className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            A problem close to one of these?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-foreground-subtle">
            Tell us how your organisation handles it today. We will say whether the work is a fit.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Project enquiry — BloomCore Technologies")}`}
              size="lg"
            >
              Email BloomCore Technologies
            </ButtonLink>
            <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
              Contact details
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-foreground-subtle">
            <ArrowLink href={ROUTES.founder}>Who leads the company</ArrowLink>
          </p>
        </Container>
      </section>
    </>
  );
}
