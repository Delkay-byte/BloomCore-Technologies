import type { Metadata } from "next";
import Image from "next/image";
import tillproofLogo from "@/assets/products/tillproof-logo.png";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, PageHero, StatusBadge } from "@/components/Page";
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

      <PageHero
        eyebrow="Retail technology"
        title="TillProof"
        lead="Retail management for electrical shops. TillProof is being built to give owners visibility of stock, prices and cash across locations they cannot stand in every day."
        breadcrumbs={breadcrumbs}
      >
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <StatusBadge label="In development" tone="muted" />
          <ButtonLink href={ROUTES.contact}>Register interest</ButtonLink>
          <ArrowLink href={ROUTES.products}>All products</ArrowLink>
        </div>
      </PageHero>

      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-5">
              <div className="inline-flex bg-muted p-5">
                <Image
                  src={tillproofLogo}
                  alt="TillProof"
                  priority
                  sizes="(min-width: 640px) 320px, 240px"
                  className="h-auto w-[220px] sm:w-[300px]"
                />
              </div>
              <h2 className="h2 mt-8 max-w-[14ch]">Not released. No date announced.</h2>
              <p className="mt-5 max-w-[38ch] text-[1rem] leading-7 text-foreground-subtle">
                TillProof is in development and there is no public application to open. The
                features described below are the intended capability, not a live deployment.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ProductFragment kind="tillproof" />
              <p className="mt-3 text-[0.8125rem] leading-5 text-foreground-faint">
                Interface concept for a product in development. No shop, staff or stock records are
                real.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-accent py-16 text-accent-contrast sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch] text-accent-contrast">
                The problems TillProof is intended to solve
              </h2>
              <p className="mt-6 max-w-[32ch] text-[1rem] leading-7 text-accent-contrast/70">
                Electrical retailers carry high-value, individually identifiable stock. When records
                live in a notebook, an owner cannot see what left the shelf, at what price, or who
                handled the cash.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="flex flex-col gap-8">
                {intentions.map((item) => (
                  <li key={item.title}>
                    <h3 className="text-[1.35rem] leading-tight font-semibold text-accent-contrast">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[1rem] leading-7 text-accent-contrast/75">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[10ch]">Questions</h2>
              <p className="lead mt-6 max-w-[30ch] text-foreground-subtle">
                TillProof, answered plainly while it is still being built.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div>
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[1.05rem] font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
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

      <section className="bg-gold py-16 text-[#15170f] sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-8">
              <h2 className="h2 max-w-[20ch]">Built carefully, released when it is ready</h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-[#15170f]/75">
                TillProof is not available for public use. We will publish the application here when
                it is ready, and we are not announcing a date before the work is complete.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <ButtonLink
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("TillProof interest")}`}
                size="lg"
                className="!bg-[#15170f] !text-[#f7f4ec] hover:!bg-[#084235]"
              >
                Register interest
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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
