import Link from "next/link";
import { ArrowLink, Container, PageHero, StatusBadge } from "@/components/Page";
import { JsonLd } from "@/components/JsonLd";
import { ProductFragment } from "@/components/ProductFragments";
import { ViewTracker } from "@/components/ViewTracker";
import { ButtonLink } from "@/components/ui/Button";
import { CONTACT, PRODUCTS, ROUTES } from "@/lib/brand";
import { breadcrumbSchema, faqSchema, HOME_CRUMB, softwareApplicationSchema } from "@/lib/seo";

export type ProductDetail = {
  slug: "schemeknit" | "maacash" | "tillproof";
  category: string;
  statusLabel: string;
  statusTone: "default" | "muted";
  lead: string;
  overview: string[];
  capabilities: ReadonlyArray<{ title: string; detail: string }>;
  limits: string[];
  audience: ReadonlyArray<{ role: string; detail: string }>;
  meta: ReadonlyArray<{ term: string; detail: string }>;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
  launch?: { label: string; url: string };
};

const hrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  "maacash": ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

export function ProductPageShell({ detail }: { detail: ProductDetail }) {
  const others = PRODUCTS.filter((product) => product.slug !== detail.slug);
  const product = PRODUCTS.find((item) => item.slug === detail.slug)!;
  const productHref = `/products/${detail.slug}`;
  const breadcrumbs = [
    HOME_CRUMB,
    { name: "Products", href: ROUTES.products },
    { name: product.name, href: productHref },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(detail.faqs)} />
      <JsonLd
        data={softwareApplicationSchema({
          slug: detail.slug,
          name: product.name,
          description: detail.lead,
        })}
      />
      <ViewTracker event="product_page_view" params={{ product_name: product.name }} />

      <PageHero
        eyebrow={detail.category}
        title={product.name}
        lead={detail.lead}
        breadcrumbs={breadcrumbs}
      >
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <StatusBadge label={detail.statusLabel} tone={detail.statusTone} />
          <ButtonLink
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
            size="md"
            data-analytics="product_cta_click"
            data-product={product.name}
            data-location="hero_enquiry"
          >
            Enquire about this product
          </ButtonLink>
          <ArrowLink href={ROUTES.products}>All products</ArrowLink>
        </div>
      </PageHero>

      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="h2 max-w-[14ch]">What it does</h2>
              <div className="mt-7 flex flex-col gap-4 text-[1.0625rem] leading-7 text-foreground-subtle">
                {detail.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <dl className="mt-9">
                {detail.meta.map((item) => (
                  <div
                    key={item.term}
                    className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] items-baseline gap-4 py-3.5"
                  >
                    <dt className="text-[0.8125rem] font-medium tracking-[0.1em] text-foreground-faint uppercase">
                      {item.term}
                    </dt>
                    <dd className="text-[0.9375rem] text-foreground-subtle">{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-7">
              <ProductFragment kind={detail.slug} />
              <p className="mt-3 text-[0.8125rem] leading-5 text-foreground-faint">
                Representative interface built from documented capabilities. Not a screenshot of a
                customer environment.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">Capabilities</h2>
              <p className="lead mt-6 max-w-[30ch] text-foreground-subtle">
                The parts of the product this page is prepared to describe.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {detail.capabilities.map((capability) => (
                  <li key={capability.title} className="py-5">
                    <h3 className="text-[1.1rem] font-semibold text-foreground">
                      {capability.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-6 text-foreground-subtle">
                      {capability.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch]">Who it serves</h2>
              <p className="lead mt-6 max-w-[30ch] text-foreground-subtle">
                The roles the product is designed around, not a target market.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl>
                {detail.audience.map((item) => (
                  <div
                    key={item.role}
                    className="grid gap-1 py-5 sm:grid-cols-12 sm:gap-6"
                  >
                    <dt className="text-[1.05rem] font-semibold text-foreground sm:col-span-4">
                      {item.role}
                    </dt>
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

      <section className="bg-accent py-16 text-accent-contrast sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch] text-accent-contrast">What we do not claim</h2>
              <p className="mt-6 max-w-[30ch] text-[1rem] leading-7 text-accent-contrast/70">
                Stating limits plainly is part of the product. These are the boundaries we hold
                ourselves to when describing this software.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="flex flex-col gap-6">
                {detail.limits.map((limit) => (
                  <li key={limit.slice(0, 40)} className="flex items-start gap-4">
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-gold" />
                    <span className="text-[1rem] leading-7 text-accent-contrast/85">{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {detail.launch && (
        <section className="bg-gold py-16 text-[#15170f] sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-8">
                <h2 className="h2 max-w-[20ch]">{product.name} runs as a separate application</h2>
                <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-[#15170f]/75">
                  Continue to the live product in a new tab. This page stays open in your current
                  tab, so you can return to the product information at any time.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <ButtonLink
                  href={detail.launch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  aria-label={`${detail.launch.label} (opens in a new tab)`}
                  className="!bg-[#15170f] !text-[#f7f4ec] hover:!bg-[#084235]"
                  data-analytics="product_outbound_click"
                  data-product={product.name}
                  data-location="product_launch"
                  data-destination="product_application"
                >
                  {detail.launch.label}
                  <span aria-hidden="true">&rarr;</span>
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[10ch]">Questions</h2>
              <p className="lead mt-6 max-w-[30ch] text-foreground-subtle">
                If your question is not covered here, send it directly. A specific question gets a
                specific answer.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div>
                {detail.faqs.map((faq) => (
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

      <section className="bg-surface-2 py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="h2 max-w-[14ch]">The other products</h2>
            <ArrowLink href={ROUTES.products}>All products</ArrowLink>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={hrefs[other.slug]}
                className="group flex flex-col justify-between gap-8 bg-background p-6 sm:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[0.8125rem] font-medium tracking-[0.1em] text-foreground-faint uppercase">
                      {other.category}
                    </p>
                    <span className="text-[0.8125rem] text-foreground-faint">
                      {other.statusLabel}
                    </span>
                  </div>
                  <h3 className="h3 mt-4 text-foreground underline-offset-4 group-hover:underline">
                    {other.name}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-6 text-foreground-subtle">
                    {other.short}
                  </p>
                </div>
                <span className="inline-flex items-center gap-3 text-[0.9375rem] font-medium text-foreground">
                  View product
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
                    <path
                      d="M1 6h14M10.5 1.5 15 6l-4.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <Container width="narrow">
          <h2 className="h2 max-w-[18ch]">Ask us whether this fits your situation</h2>
          <p className="lead mt-6 max-w-xl text-foreground-subtle">
            We would rather tell you a product is the wrong fit than sell it to you. Send a short
            description of what you need it to do.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
              size="lg"
              data-analytics="product_cta_click"
              data-product={product.name}
              data-location="product_footer_enquiry"
            >
              Email BloomCore Technologies
            </ButtonLink>
            <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
              All contact details
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
