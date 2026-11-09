import type { Metadata } from "next";
import Image from "next/image";
import tillproofLogo from "@/assets/products/tillproof-logo.png";
import tillproofMark from "@/assets/products/tillproof-mark.png";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, Eyebrow } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { ViewTracker } from "@/components/ViewTracker";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, ROUTES } from "@/lib/brand";
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
      <section className="border-b border-border bg-background py-14 sm:py-16 lg:py-20">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex rounded-lg border border-border bg-[#F8F7F4] p-5">
                  <Image
                    src={tillproofLogo}
                    alt="TillProof"
                    priority
                    sizes="(min-width: 640px) 340px, 260px"
                    className="h-auto w-[260px] rounded-sm sm:w-[340px]"
                  />
                </div>

                <div className="mt-8">
                  <Eyebrow>Product · Retail technology</Eyebrow>
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  TillProof
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-foreground-subtle sm:text-lg">
                  Retail management for electrical shops. TillProof is being built to give owners
                  visibility of stock, prices and cash across locations they cannot stand in every
                  day.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <ButtonLink href={ROUTES.products} size="lg">
                    Back to Products
                  </ButtonLink>
                  <ArrowLink href={ROUTES.contact}>Ask about TillProof</ArrowLink>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.08}>
                <div className="rounded-lg border border-border bg-muted p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex rounded-md border border-border bg-[#F8F7F4] p-3">
                      <Image
                        src={tillproofMark}
                        alt="TillProof symbol"
                        sizes="64px"
                        className="h-12 w-auto"
                      />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.1em] text-foreground-subtle uppercase">
                      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                      In development
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    TillProof is currently in development.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-foreground-subtle">
                    We&apos;re working on bringing TillProof to life. Please check back later for
                    updates.
                  </p>

                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                      Availability
                    </p>
                    <p className="mt-1.5 text-sm text-foreground">
                      Not released. There is no public TillProof application to open yet.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-14 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>What we are building</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              The problems TillProof is intended to solve
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground-subtle">
              These are the intended capabilities of the product, not a description of a live
              deployment. No release date has been announced.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {intentions.map((item, index) => (
              <div key={item.title} className="bg-background p-6">
                <span className="font-mono text-[10px] text-foreground-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-subtle">{item.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                TillProof, answered plainly
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="divide-y divide-border border-y border-border">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 font-mono text-foreground-faint transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground-subtle">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 rounded-lg border border-border p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                Development status
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                Built carefully, released when it is ready
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-subtle">
                TillProof is not available for public use. We will publish the application here
                when it is ready, and we are not announcing a date before the work is complete.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <ButtonLink href={ROUTES.products} variant="outline" size="lg">
                Back to Products
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
