import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Container, PageHero, StatusBadge } from "@/components/Page";
import { ProductFragment } from "@/components/ProductFragments";
import { Reveal } from "@/components/Reveal";
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
        title="Software built and operated here."
        lead="Each product answers one operating problem. Two are available today; one is in active development."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href={ROUTES.contact}>Ask about a product</ButtonLink>
          <ArrowLink href={ROUTES.work}>See the work</ArrowLink>
        </div>
        <div className="mt-8 grid gap-2 sm:grid-cols-3">
          {[
            { name: "SchemeKnit", status: "Available", href: ROUTES.productsSchemeKnit },
            { name: "MaaCash", status: "Available", href: ROUTES.productsMaacash },
            { name: "TillProof", status: "In development", href: ROUTES.productsTillProof },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center justify-between gap-3 rounded-[8px] bg-surface-2 px-4 py-3 transition-colors hover:bg-surface-3"
            >
              <span className="text-[0.9375rem] font-bold text-foreground">{item.name}</span>
              <span className="text-[0.75rem] text-foreground-subtle">
                {item.status}
                <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </PageHero>

      <section className="bg-background pt-2.5">
        <div className="page-frame flex flex-col gap-2.5">
          {PRODUCTS.map((product, index) => {
            const summary = summaries[product.slug];
            const reversed = index % 2 === 1;
            return (
              <Reveal key={product.slug}>
                <article
                  className={
                    product.status === "development"
                      ? "overflow-hidden rounded-[var(--radius)] bg-accent p-5 text-accent-contrast sm:p-8 lg:p-10"
                      : "overflow-hidden rounded-[var(--radius)] bg-surface p-5 sm:p-8 lg:p-10"
                  }
                >
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                    <div className={reversed ? "lg:col-span-5 lg:order-2" : "lg:col-span-5"}>
                      <div className="flex flex-wrap items-center gap-3">
                        <p
                          className={
                            product.status === "development"
                              ? "text-[0.8125rem] font-semibold text-accent-contrast/60"
                              : "text-[0.8125rem] font-semibold text-foreground-faint"
                          }
                        >
                          {product.category}
                        </p>
                        {product.status === "live" ? (
                          <StatusBadge label={product.statusLabel} />
                        ) : (
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.75rem] font-bold text-accent-contrast">
                            {product.statusLabel}
                          </span>
                        )}
                      </div>
                      <h2
                        className={
                          product.status === "development"
                            ? "mt-3 font-display text-[clamp(2.8rem,4.8vw,4.6rem)] leading-none text-accent-contrast"
                            : "mt-3 font-display text-[clamp(2.8rem,4.8vw,4.6rem)] leading-none text-foreground"
                        }
                      >
                        {product.name}
                      </h2>
                      <p
                        className={
                          product.status === "development"
                            ? "mt-5 max-w-[46ch] text-[1.05rem] leading-7 text-accent-contrast/80"
                            : "mt-5 max-w-[46ch] text-[1.05rem] leading-7 text-foreground-subtle"
                        }
                      >
                        {summary.detail}
                      </p>
                      <p
                        className={
                          product.status === "development"
                            ? "mt-3 max-w-[50ch] text-[0.9375rem] leading-6 text-accent-contrast/60"
                            : "mt-3 max-w-[50ch] text-[0.9375rem] leading-6 text-foreground-faint"
                        }
                      >
                        <span className="font-semibold">{product.status === "development" ? "Intended for:" : "Built for:"}</span>{" "}
                        {summary.users}
                      </p>
                      <div className="mt-7 flex flex-wrap items-center gap-4">
                        <ButtonLink
                          href={hrefs[product.slug]}
                          variant={product.status === "development" ? "inverse" : "primary"}
                        >
                          Product details
                        </ButtonLink>
                        <a
                          href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
                          className={
                            product.status === "development"
                              ? "text-[0.9375rem] font-semibold text-accent-contrast underline decoration-1 underline-offset-4"
                              : "text-[0.9375rem] font-semibold text-foreground underline decoration-1 underline-offset-4"
                          }
                        >
                          Enquire
                        </a>
                      </div>
                    </div>

                    <div className={reversed ? "lg:col-span-7 lg:order-1" : "lg:col-span-7"}>
                      <ProductFragment kind={product.slug} />
                    </div>
                  </div>

                  {product.status === "development" && (
                    <p className="mt-6 text-[0.8125rem] font-semibold text-accent-contrast/60">
                      Intended capability, not a released feature set.
                    </p>
                  )}
                  <ul
                    className={
                      product.status === "development"
                        ? "mt-2 grid gap-x-8 gap-y-0 border-t border-white/15 pt-3 sm:grid-cols-2 lg:grid-cols-3"
                        : "mt-8 grid gap-x-8 gap-y-0 border-t border-line pt-3 sm:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {summary.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className={
                          product.status === "development"
                            ? "py-2 text-[0.9375rem] leading-6 text-accent-contrast/75"
                            : "py-2 text-[0.9375rem] leading-6 text-foreground-subtle"
                        }
                      >
                        {capability}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-background section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">What the labels mean.</h2>
              <p className="lead mt-5 max-w-[30ch] text-foreground-subtle">
                A status label is a promise about evidence, not a marketing position.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl className="flex flex-col gap-2">
                <div className="grid gap-2 rounded-[var(--radius)] bg-surface p-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
                  <dt>
                    <StatusBadge label="Available" />
                  </dt>
                  <dd className="text-[0.9375rem] leading-6 text-foreground-subtle">
                    The product is built and in use. Descriptions on this site reflect capabilities
                    present in the application.
                  </dd>
                </div>
                <div className="grid gap-2 rounded-[var(--radius)] bg-surface p-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
                  <dt>
                    <StatusBadge label="In development" tone="muted" />
                  </dt>
                  <dd className="text-[0.9375rem] leading-6 text-foreground-subtle">
                    The product is being built. Capabilities described are the intended direction,
                    not verified production behaviour. We do not claim live deployments.
                  </dd>
                </div>
              </dl>
              <p className="mt-5 max-w-2xl text-[0.9375rem] leading-6 text-foreground-subtle">
                We do not publish customer names, revenue figures or usage statistics for any
                product.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background pb-3">
        <div className="page-frame">
          <div className="grid gap-8 rounded-[var(--radius)] bg-gold p-6 text-gold-contrast sm:p-9 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="h2 max-w-[18ch]">Need something outside the catalogue?</h2>
              <p className="mt-4 max-w-xl text-[1rem] leading-7 opacity-80">
                We also build software to order. Tell us what the workflow needs to do and we will
                tell you whether it is a good fit.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <ButtonLink
                href={ROUTES.services}
                className="!bg-accent !text-accent-contrast hover:!bg-accent-strong"
                size="lg"
              >
                View services
              </ButtonLink>
              <ButtonLink
                href={ROUTES.contact}
                variant="outline"
                className="!border-gold-contrast/40 !text-gold-contrast hover:!bg-gold-contrast/10"
                size="lg"
              >
                Contact us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
