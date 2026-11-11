import type { Metadata } from "next";
import { ArrowLink, Container, PageHero, StatusBadge } from "@/components/Page";
import { ProductFragment } from "@/components/ProductFragments";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, PRODUCTS, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: "Software Products for Ghanaian Organisations" },
  description:
    "Software products built by BloomCore Technologies: SchemeKnit for lesson planning, MaaCash for business operations, and TillProof for electrical retail.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: `Products — ${BRAND.name}`,
    url: "/products",
    description:
      "Software products built by BloomCore Technologies: SchemeKnit for lesson planning, MaaCash for business operations, and TillProof for electrical retail.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Products — ${BRAND.name}`,
    description:
      "Software products built by BloomCore Technologies: SchemeKnit for lesson planning, MaaCash for business operations, and TillProof for electrical retail.",
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
      >
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <ButtonLink href={ROUTES.contact}>Ask about a product</ButtonLink>
          <ArrowLink href={ROUTES.work}>See the work</ArrowLink>
        </div>
      </PageHero>

      <div className="bg-background">
        {PRODUCTS.map((product, index) => {
          const summary = summaries[product.slug];
          const reversed = index % 2 === 1;

          return (
            <section
              key={product.slug}
              className={index % 2 === 0 ? "bg-surface py-16 sm:py-20" : "bg-background py-16 sm:py-20"}
            >
              <Container width="wide">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
                  <div
                    className={
                      reversed
                        ? "lg:col-span-7 lg:order-2"
                        : "lg:col-span-7"
                    }
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-[0.8125rem] font-medium tracking-[0.12em] text-foreground-faint uppercase">
                        {product.category}
                      </p>
                      <StatusBadge
                        label={product.statusLabel}
                        tone={product.status === "live" ? "default" : "muted"}
                      />
                    </div>
                    <h2 className="h2 mt-4">{product.name}</h2>
                    <p className="lead mt-5 max-w-[46ch] text-foreground-subtle">
                      {summary.detail}
                    </p>
                    <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-6 text-foreground-faint">
                      <span className="font-medium text-foreground-subtle">Built for:</span>{" "}
                      {summary.users}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <ButtonLink href={hrefs[product.slug]}>Product details</ButtonLink>
                      <ButtonLink
                        href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
                        variant="outline"
                      >
                        Enquire
                      </ButtonLink>
                    </div>
                  </div>

                  <div className={reversed ? "lg:col-span-5 lg:order-1" : "lg:col-span-5"}>
                    <ProductFragment kind={product.slug} />
                  </div>

                  <div
                    className={
                      reversed
                        ? "lg:col-span-12 lg:order-3"
                        : "lg:col-span-12"
                    }
                  >
                    <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                      {summary.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="flex items-start gap-3 py-2.5 text-[0.9375rem] leading-6 text-foreground-subtle"
                        >
                          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-gold" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section className="bg-surface-2 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">What the labels mean</h2>
              <p className="lead mt-6 max-w-[30ch] text-foreground-subtle">
                A status label is a promise about evidence, not a marketing position.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl>
                <div className="grid gap-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                  <dt>
                    <StatusBadge label="Available" />
                  </dt>
                  <dd className="text-[0.9375rem] leading-6 text-foreground-subtle">
                    The product is built and in use. Descriptions on this site reflect capabilities
                    present in the application.
                  </dd>
                </div>
                <div className="grid gap-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                  <dt>
                    <StatusBadge label="In development" tone="muted" />
                  </dt>
                  <dd className="text-[0.9375rem] leading-6 text-foreground-subtle">
                    The product is being built. Capabilities described are the intended direction,
                    not verified production behaviour. We do not claim live deployments.
                  </dd>
                </div>
              </dl>
              <p className="mt-4 max-w-2xl text-[0.9375rem] leading-6 text-foreground-subtle">
                We do not publish customer names, revenue figures or usage statistics for any
                product.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <Container width="narrow">
          <h2 className="h2 max-w-[20ch]">Need something that is not in the catalogue?</h2>
          <p className="lead mt-6 max-w-xl text-foreground-subtle">
            We also build software to order. Tell us what the workflow needs to do and we will tell
            you whether it is a good fit.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={ROUTES.services} size="lg">
              View our services
            </ButtonLink>
            <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
              Contact BloomCore Technologies
            </ButtonLink>
          </div>
          <p className="mt-8 text-[0.9375rem] text-foreground-subtle">
            Looking for engineering detail instead?{" "}
            <ArrowLink href={ROUTES.work}>See the work</ArrowLink>
          </p>
        </Container>
      </section>
    </>
  );
}
