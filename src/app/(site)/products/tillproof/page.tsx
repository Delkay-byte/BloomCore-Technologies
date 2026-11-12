import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, StatusBadge } from "@/components/Page";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductFragment } from "@/components/ProductFragments";
import { ViewTracker } from "@/components/ViewTracker";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, ROUTES } from "@/lib/brand";
import { breadcrumbSchema, faqSchema, HOME_CRUMB } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "TillProof — Retail Software for Electrical Shops" },
  description:
    "TillProof is in development: retail management for electrical shops, covering stock traceability, controlled pricing and owner oversight across locations.",
  alternates: { canonical: "/products/tillproof" },
  openGraph: {
    title: `TillProof — ${BRAND.name}`,
    url: "/products/tillproof",
    description:
      "In development. Remote owner visibility, controlled pricing, cash accountability and traceable stock for electrical retailers.",
  },
  twitter: {
    card: "summary_large_image",
    title: `TillProof — ${BRAND.name}`,
    description:
      "In development: stock traceability, controlled pricing and owner oversight for electrical retailers.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Is TillProof available now?",
    answer:
      "No. TillProof is in development and there is no public application to open. No release date has been announced.",
  },
  {
    question: "Which businesses is TillProof intended for?",
    answer:
      "Electrical retailers, electronics shops and wholesalers that need stock, pricing and cash records to agree across more than one location.",
  },
  {
    question: "Are the features on this page live?",
    answer:
      "No. They describe the intended capability of the product, not a released feature set. The page will change when the application is available.",
  },
  {
    question: "Can I register interest?",
    answer:
      "Yes. Send an enquiry describing your shop, the number of locations and the stock problems you need to solve. We will reply when there is something concrete to share.",
  },
];

const intentions = [
  {
    title: "See the stock that is actually there",
    detail:
      "Products recorded once and tracked through receiving, transfer and sale, with quantity changes attributed to a person and a time.",
  },
  {
    title: "Control prices from one place",
    detail:
      "Price changes recorded rather than improvised at the till, so an owner can see who changed what and when.",
  },
  {
    title: "Make cash accountable",
    detail:
      "Cash handling recorded against the person responsible, giving a reconcilable trail at the end of a shift.",
  },
];

export default function TillProofPage() {
  const breadcrumbs = [
    HOME_CRUMB,
    { name: "Products", href: ROUTES.products },
    { name: "TillProof", href: ROUTES.productsTillProof },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqs)} />
      <ViewTracker event="product_page_view" params={{ product_name: "TillProof" }} />

      <section className="bg-background pt-2.5">
        <div className="page-frame">
          <div className="grid gap-2.5 lg:grid-cols-12">
            <div className="rounded-[var(--radius)] bg-surface p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <Breadcrumbs items={breadcrumbs} />
              <p className="text-[0.8125rem] font-semibold text-foreground-faint">Retail technology</p>
              <h1 className="h1 mt-3 text-[clamp(3.4rem,6vw,5.8rem)]">TillProof</h1>
              <p className="lead mt-5 max-w-[42ch] text-foreground-subtle">
                Retail management for electrical shops. TillProof is being built to give owners
                visibility of stock, prices and cash across locations they cannot stand in every
                day.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <StatusBadge label="In development" tone="muted" />
                <span className="text-[0.8125rem] text-foreground-faint">No release date announced</span>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <ButtonLink
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("TillProof interest")}`}
                  data-analytics="product_cta_click"
                  data-product="TillProof"
                  data-location="tillproof_hero"
                >
                  Register interest
                </ButtonLink>
                <ArrowLink href={ROUTES.products}>All products</ArrowLink>
              </div>
              <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4">
                {[
                  ["Status", "In development"],
                  ["Category", "Retail technology"],
                  ["Primary users", "Electrical retailers"],
                  ["Platform", "Web application"],
                ].map(([term, value]) => (
                  <div key={term}>
                    <dt className="text-[0.75rem] font-semibold text-foreground-faint">{term}</dt>
                    <dd className="mt-1 text-[0.9375rem] font-semibold text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col rounded-[var(--radius)] bg-accent p-4 text-accent-contrast sm:p-6 lg:col-span-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.8125rem] font-semibold text-accent-contrast/65">
                  TillProof · Owner dashboard
                </p>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.75rem] font-bold">
                  Interface concept
                </span>
              </div>
              <div className="mt-5 flex flex-1 items-center">
                <ProductFragment kind="tillproof" className="w-full" />
              </div>
              <p className="mt-4 text-[0.8125rem] leading-5 text-accent-contrast/55">
                A product in development. No shop, staff or stock records are real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch]">Not released. No date announced.</h2>
              <p className="mt-5 max-w-[32ch] text-[1rem] leading-7 text-foreground-subtle">
                Electrical retailers carry high-value, individually identifiable stock. When records
                live in a notebook, an owner cannot see what left the shelf, at what price, or who
                handled the cash. TillProof is being built around those three gaps.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="flex flex-col gap-2">
                {intentions.map((item, index) => (
                  <li
                    key={item.title}
                    className={
                      index === 0
                        ? "rounded-[var(--radius)] bg-accent p-6 text-accent-contrast"
                        : "rounded-[var(--radius)] bg-surface p-6"
                    }
                  >
                    <h3
                      className={
                        index === 0
                          ? "text-[1.25rem] font-bold text-accent-contrast"
                          : "text-[1.25rem] font-bold text-foreground"
                      }
                    >
                      {item.title}
                    </h3>
                    <p
                      className={
                        index === 0
                          ? "mt-2 max-w-2xl text-[0.9375rem] leading-6 text-accent-contrast/75"
                          : "mt-2 max-w-2xl text-[0.9375rem] leading-6 text-foreground-subtle"
                      }
                    >
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.875rem] leading-6 text-foreground-faint">
                These are intended capabilities, not a released feature set. The page will change
                when the application is available.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">Intended capability.</h2>
              <p className="lead mt-5 max-w-[28ch] text-foreground-subtle">
                What TillProof is being built to do. These are not released features.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {[
                  "Inventory and stock tracking",
                  "Multi-shop monitoring",
                  "Branch-level stock visibility",
                  "Product identification and search",
                  "Audit trails for recorded actions",
                  "Owner oversight across locations",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-t border-line py-4 text-[0.9375rem] leading-6 text-foreground-subtle"
                  >
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.875rem] leading-6 text-foreground-faint">
                Intended capability is described at the level of process. A feature is only claimed
                as available when it is present in a released application.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">Who it is for.</h2>
              <p className="lead mt-5 max-w-[28ch] text-foreground-subtle">
                The roles the intended product is designed around.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl className="flex flex-col gap-2">
                {[
                  {
                    role: "Owner-operators",
                    detail:
                      "Owners who run more than one shop and cannot see every shelf, price change and cash movement in person.",
                  },
                  {
                    role: "Shop staff",
                    detail:
                      "People recording sales, transfers and stock movements who need one clear process rather than a notebook and a message thread.",
                  },
                  {
                    role: "Electrical wholesalers",
                    detail:
                      "Businesses carrying high-value, individually identifiable stock across a store room and a shop floor.",
                  },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="grid gap-2 rounded-[var(--radius)] bg-surface px-5 py-5 sm:grid-cols-12 sm:gap-6 sm:px-6"
                  >
                    <dt className="text-[1.05rem] font-bold text-foreground sm:col-span-4">{item.role}</dt>
                    <dd className="text-[0.9375rem] leading-6 text-foreground-subtle sm:col-span-8">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[10ch]">Questions.</h2>
              <p className="lead mt-5 max-w-[28ch] text-foreground-subtle">
                TillProof, answered plainly while it is still being built.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-2">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-[var(--radius)] bg-surface px-5 py-4"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[1.05rem] font-bold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[1.2rem] leading-none text-foreground-faint transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-[0.9375rem] leading-6 text-foreground-subtle">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background pb-3">
        <div className="page-frame">
          <div className="grid gap-8 rounded-[var(--radius)] bg-accent p-6 text-accent-contrast sm:p-9 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="h2 max-w-[18ch] text-accent-contrast">Built carefully, released when it is ready.</h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-accent-contrast/75">
                TillProof is not available for public use. We will publish the application here when
                it is ready, and we are not announcing a date before the work is complete.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <ButtonLink
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("TillProof interest")}`}
                variant="inverse"
                size="lg"
              >
                Register interest
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background section-pad-sm">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="lead max-w-xl text-foreground-subtle">
              Two other products are available today.
            </p>
            <ArrowLink href={ROUTES.products}>Back to products</ArrowLink>
          </div>
        </Container>
      </section>
    </>
  );
}
