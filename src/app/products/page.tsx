import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Container, Eyebrow, PageHero, StatusBadge } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, PRODUCTS, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Software products built by BloomCore Technologies: SchemeKnit for lesson planning, MaaCash for business operations, and TillProof for retail.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: `Products — ${BRAND.name}`,
    url: "/products",
    description:
      "Software products built by BloomCore Technologies: SchemeKnit for lesson planning, MaaCash for business operations, and TillProof for retail.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Products — ${BRAND.name}`,
    description:
      "Software products built by BloomCore Technologies: SchemeKnit for lesson planning, MaaCash for business operations, and TillProof for retail.",
    images: ["/og-image.png"],
  },
};

const hrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  "maacash": ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

const summaries: Record<string, { detail: string; capabilities: string[]; users: string }> = {
  schemeknit: {
    detail:
      "SchemeKnit takes the scheme of learning a teacher already works from and turns it into structured, indicator-focused lesson plans — reviewed, editable and exportable.",
    capabilities: [
      "Curriculum document upload and extraction",
      "Structured curriculum review",
      "Lesson-plan generation around indicators",
      "Saving and editing individual lessons",
      "Document exports",
      "Credit and package management",
    ],
    users: "Teachers and subject leads working from national curriculum schemes.",
  },
  "maacash": {
    detail:
      "MaaCash supports organisations operating across several locations, combining staff administration, role-based access and financial operations in one platform.",
    capabilities: [
      "Multi-location business administration",
      "User and staff management",
      "Role-based access control",
      "Administrative oversight",
      "Mobile-money (MoMo) operations",
      "Susu collection workflows",
    ],
    users: "Organisations managing several branches with staff who need scoped access.",
  },
  tillproof: {
    detail:
      "TillProof is being developed for electrical retail businesses that need visibility over shops they do not stand in every day. It is not yet available.",
    capabilities: [
      "Inventory and stock tracking",
      "Multi-shop monitoring",
      "Branch-level stock visibility",
      "Product identification and search",
      "Audit trails for recorded actions",
      "Owner oversight across locations",
    ],
    users: "Owner-operators of electrical and electronics shops, including remote owners.",
  },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Software products built and operated by BloomCore Technologies"
        lead="Each product answers a specific operating problem. Status is stated plainly: two products are available today, and one is in active development."
      />

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6">
            {PRODUCTS.map((product, index) => {
              const summary = summaries[product.slug];
              return (
                <Reveal key={product.slug} delay={index * 0.05}>
                  <article className="group rounded-lg border border-border bg-background transition-colors hover:border-foreground/25">
                    <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10">
                      <div className="lg:col-span-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                            {product.category}
                          </span>
                          <StatusBadge label={product.statusLabel} />
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                          <Link
                            href={hrefs[product.slug]}
                            className="underline-offset-4 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-foreground-subtle">
                          {summary.detail}
                        </p>
                        <p className="mt-4 text-sm leading-6 text-foreground-faint">
                          <span className="font-medium text-foreground-subtle">Built for:</span>{" "}
                          {summary.users}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <ButtonLink href={hrefs[product.slug]} size="sm">
                            Product details
                          </ButtonLink>
                          <ButtonLink
                            href={`mailto:bloomcoretechnologies@gmail.com?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
                            variant="outline"
                            size="sm"
                          >
                            Enquire
                          </ButtonLink>
                        </div>
                      </div>

                      <div className="lg:col-span-7">
                        <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                          Capabilities
                        </p>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                          {summary.capabilities.map((capability) => (
                            <li
                              key={capability}
                              className="flex items-start gap-2 text-sm leading-6 text-foreground-subtle"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground-faint"
                              />
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted py-16 sm:py-20">
        <Container width="narrow">
          <Eyebrow>How status is used</Eyebrow>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            What the labels mean
          </h2>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            <div className="grid gap-2 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className="sm:pt-0.5">
                <StatusBadge label="Available" />
              </dt>
              <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                The product is built and in use. Descriptions on this site reflect capabilities
                present in the application.
              </dd>
            </div>
            <div className="grid gap-2 py-4 sm:grid-cols-3 sm:gap-6">
              <dt className="sm:pt-0.5">
                <StatusBadge label="In development" tone="muted" />
              </dt>
              <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                The product is being built. Capabilities described are the intended direction, not
                verified production behaviour. We do not claim live deployments.
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-6 text-foreground-subtle">
            We do not publish customer names, revenue figures or usage statistics for any product.
          </p>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container width="narrow" className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Need something that is not in the catalogue?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-foreground-subtle">
            We also build software to order. Tell us what the workflow needs to do and we will tell
            you whether it is a good fit.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={ROUTES.services} size="lg">
              View our services
            </ButtonLink>
            <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
              Contact BloomCore Technologies
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-foreground-subtle">
            Looking for engineering detail instead? <ArrowLink href={ROUTES.work}>See the work</ArrowLink>
          </p>
        </Container>
      </section>
    </>
  );
}
