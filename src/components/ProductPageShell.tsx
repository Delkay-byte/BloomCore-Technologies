import Link from "next/link";
import { ArrowLink, Container, Eyebrow, PageHero, StatusBadge } from "@/components/Page";
import { JsonLd } from "@/components/JsonLd";
import { ProductMockup } from "@/components/ProductMockup";
import { Reveal } from "@/components/Reveal";
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
        eyebrow={`${detail.category}`}
        title={product.name}
        lead={detail.lead}
        breadcrumbs={breadcrumbs}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <StatusBadge label={detail.statusLabel} tone={detail.statusTone} />
          <ButtonLink
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
            size="sm"
            data-analytics="product_cta_click"
            data-product={product.name}
            data-location="hero_enquiry"
          >
            Enquire about this product
          </ButtonLink>
          <ArrowLink href={ROUTES.products}>All products</ArrowLink>
        </div>
      </PageHero>

      <section className="border-b border-border bg-background py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Eyebrow>Overview</Eyebrow>
              <div className="mt-4 flex flex-col gap-4 text-base leading-7 text-foreground-subtle">
                {detail.overview.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <dl className="mt-8 divide-y divide-border border-y border-border">
                {detail.meta.map((item) => (
                  <div key={item.term} className="flex items-start justify-between gap-4 py-3">
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                      {item.term}
                    </dt>
                    <dd className="text-right text-sm text-foreground-subtle">{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-7">
              <Reveal>
                <ProductMockup kind={detail.slug} />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-14 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Capabilities</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              What the product does
            </h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {detail.capabilities.map((capability, index) => (
              <div key={capability.title} className="bg-background p-5">
                <span className="font-mono text-[10px] text-foreground-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{capability.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-subtle">{capability.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Eyebrow>Who it serves</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Roles the product is designed around
              </h2>
            </div>
            <div className="lg:col-span-7">
              <ul className="divide-y divide-border border-y border-border">
                {detail.audience.map((item) => (
                  <li key={item.role} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                    <p className="text-sm font-semibold text-foreground">{item.role}</p>
                    <p className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Eyebrow>Boundaries</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                What we do not claim
              </h2>
              <p className="mt-4 text-sm leading-6 text-foreground-subtle">
                Stating limits plainly is part of the product. These are the boundaries we hold
                ourselves to when describing this software.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="flex flex-col gap-3">
                {detail.limits.map((limit) => (
                  <li
                    key={limit.slice(0, 40)}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background p-4"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground-faint"
                    />
                    <span className="text-sm leading-6 text-foreground-subtle">{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {detail.launch && (
        <section className="border-b border-border bg-surface py-14 text-[#F5F5F5] sm:py-16">
          <Container>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                  Open the application
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-neutral-50 sm:text-3xl">
                  {product.name} runs as a separate web application
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  Continue to the live product in a new tab. This page stays open in your current
                  tab, so you can return to the product information at any time.
                </p>
              </div>
              <ButtonLink
                href={detail.launch.url}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                aria-label={`${detail.launch.label} (opens in a new tab)`}
                className="shrink-0 !bg-white !text-neutral-900 hover:!bg-neutral-200"
                data-analytics="product_outbound_click"
                data-product={product.name}
                data-location="product_launch"
                data-destination="product_application"
              >
                {detail.launch.label}
                <span aria-hidden="true">&rarr;</span>
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      <section className="border-b border-border bg-background py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Answers before you enquire
              </h2>
              <p className="mt-4 text-sm leading-6 text-foreground-subtle">
                If your question is not covered here, send it directly. A specific question gets a
                specific answer.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="divide-y divide-border border-y border-border">
                {detail.faqs.map((faq) => (
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
          <Eyebrow>Other products</Eyebrow>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {others.map((product) => (
              <Link
                key={product.slug}
                href={hrefs[product.slug]}
                className="group flex flex-col justify-between rounded-lg border border-border p-6 transition-colors hover:border-foreground/25"
              >
                <div>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                    {product.category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{product.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-subtle">{product.short}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  View product
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 text-[#F5F5F5] sm:py-20">
        <Container width="narrow" className="text-center">
          <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
            Enquiries
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-neutral-50 sm:text-3xl">
            Ask us whether this fits your situation
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-400">
            We would rather tell you a product is the wrong fit than sell it to you. Send a short
            description of what you need it to do.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
              className="!bg-white !text-neutral-900 hover:!bg-neutral-200"
              size="lg"
              data-analytics="product_cta_click"
              data-product={product.name}
              data-location="product_footer_enquiry"
            >
              Email BloomCore Technologies
            </ButtonLink>
            <ButtonLink
              href={ROUTES.contact}
              variant="outline"
              size="lg"
              className="!border-neutral-700 !text-neutral-100 hover:!bg-neutral-900"
            >
              All contact details
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
