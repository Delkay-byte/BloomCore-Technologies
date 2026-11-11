import Link from "next/link";
import { ArrowLink, Container, StatusBadge } from "@/components/Page";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductFragment } from "@/components/ProductFragments";
import { ViewTracker } from "@/components/ViewTracker";
import { ButtonLink } from "@/components/ui/Button";
import { CONTACT, PRODUCTS, ROUTES } from "@/lib/brand";
import { breadcrumbSchema, faqSchema, HOME_CRUMB, softwareApplicationSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

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
  const darkStage = detail.slug === "tillproof";

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

      <section className="bg-background pt-2.5">
        <div className="page-frame">
          <div className="grid gap-2.5 lg:grid-cols-12">
            <div className="rounded-[var(--radius)] bg-surface p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <Breadcrumbs items={breadcrumbs} />
              <p className="text-[0.8125rem] font-semibold text-foreground-faint">{detail.category}</p>
              <h1 className="h1 mt-3 max-w-[10ch] text-[clamp(3.4rem,5.6vw,5.4rem)]">{product.name}</h1>
              <p className="lead mt-6 max-w-[42ch] text-foreground-subtle">{detail.lead}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <StatusBadge label={detail.statusLabel} tone={detail.statusTone} />
                <ButtonLink
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
                  data-analytics="product_cta_click"
                  data-product={product.name}
                  data-location="hero_enquiry"
                >
                  Enquire about this product
                </ButtonLink>
                <ArrowLink href={ROUTES.products}>All products</ArrowLink>
              </div>
              <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4">
                {detail.meta.map((item) => (
                  <div key={item.term}>
                    <dt className="text-[0.75rem] font-semibold text-foreground-faint">{item.term}</dt>
                    <dd className="mt-1 text-[0.9375rem] font-semibold text-foreground">{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className={cn(
                "flex flex-col justify-between rounded-[var(--radius)] p-4 sm:p-6 lg:col-span-7",
                darkStage ? "bg-accent" : "bg-surface-2",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className={cn(
                    "text-[0.8125rem] font-semibold",
                    darkStage ? "text-accent-contrast/65" : "text-foreground-faint",
                  )}
                >
                  Representative interface
                </p>
                <p
                  className={cn(
                    "text-[0.8125rem]",
                    darkStage ? "text-accent-contrast/50" : "text-foreground-faint",
                  )}
                >
                  {product.name} · {detail.statusLabel}
                </p>
              </div>
              <div className="mt-5 flex flex-1 items-center">
                <ProductFragment kind={detail.slug} className="w-full" />
              </div>
              <p
                className={cn(
                  "mt-4 text-[0.8125rem] leading-5",
                  darkStage ? "text-accent-contrast/55" : "text-foreground-faint",
                )}
              >
                Built from documented capabilities. Not a screenshot of a customer environment; no
                customer, staff or financial records are shown.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">What it does.</h2>
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-5 text-[1.0625rem] leading-7 text-foreground-subtle">
                {detail.overview.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className={index === 0 ? "text-[1.2rem] leading-8 text-foreground" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">Capabilities.</h2>
              <p className="lead mt-5 max-w-[28ch] text-foreground-subtle">
                The parts of the product this page is prepared to describe.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {detail.capabilities.map((capability, index) => (
                  <li
                    key={capability.title}
                    className={
                      index === 0
                        ? "rounded-[var(--radius)] bg-surface p-5 sm:col-span-2"
                        : "border-t border-line py-5"
                    }
                  >
                    <h3 className="text-[1.05rem] font-bold text-foreground">{capability.title}</h3>
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

      <section className="bg-background section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch]">Who it serves.</h2>
              <p className="lead mt-5 max-w-[28ch] text-foreground-subtle">
                The roles the product is designed around, not a target market.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl className="flex flex-col gap-2">
                {detail.audience.map((item) => (
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

      <section className="bg-background pb-3">
        <div className="page-frame">
          <div className="rounded-[var(--radius)] bg-accent p-6 text-accent-contrast sm:p-9 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <h2 className="h2 max-w-[12ch] text-accent-contrast">What we do not claim.</h2>
                <p className="mt-5 max-w-[30ch] text-[0.9375rem] leading-6 text-accent-contrast/65">
                  Stating limits plainly is part of the product. These are the boundaries we hold
                  ourselves to when describing this software.
                </p>
              </div>
              <div className="lg:col-span-8">
                <ul className="flex flex-col gap-5">
                  {detail.limits.map((limit) => (
                    <li key={limit.slice(0, 40)} className="flex items-start gap-4">
                      <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span className="text-[1rem] leading-7 text-accent-contrast/85">{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {detail.launch && (
        <section className="bg-background pb-3">
          <div className="page-frame">
            <div className="grid gap-8 rounded-[var(--radius)] bg-gold p-6 text-gold-contrast sm:p-9 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-8">
                <h2 className="font-display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-none">
                  {product.name} runs as its own application.
                </h2>
                <p className="mt-4 max-w-2xl text-[1rem] leading-7 opacity-80">
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
                  className="!bg-accent !text-accent-contrast hover:!bg-accent-strong"
                  data-analytics="product_outbound_click"
                  data-product={product.name}
                  data-location="product_launch"
                  data-destination="product_application"
                >
                  {detail.launch.label}
                  <span aria-hidden="true">→</span>
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-surface-2 section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[10ch]">Questions.</h2>
              <p className="lead mt-5 max-w-[28ch] text-foreground-subtle">
                If your question is not covered here, send it directly. A specific question gets a
                specific answer.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-2">
                {detail.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-[var(--radius)] bg-surface px-5 py-4 open:bg-surface"
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

      <section className="bg-background section-pad">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="h2 max-w-[14ch]">The other products.</h2>
            <ArrowLink href={ROUTES.products}>All products</ArrowLink>
          </div>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={hrefs[other.slug]}
                className="group flex flex-col justify-between gap-8 rounded-[var(--radius)] bg-surface p-6 transition-colors hover:bg-surface-2 sm:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[0.8125rem] font-semibold text-foreground-faint">{other.category}</p>
                    <StatusBadge
                      label={other.statusLabel}
                      tone={other.status === "live" ? "default" : "muted"}
                    />
                  </div>
                  <h3 className="mt-4 font-display text-[2rem] leading-none text-foreground underline-offset-4 group-hover:underline">
                    {other.name}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-6 text-foreground-subtle">{other.short}</p>
                </div>
                <span className="inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-foreground">
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

      <section className="bg-background pb-3">
        <div className="page-frame">
          <div className="rounded-[var(--radius)] bg-surface p-6 sm:p-9 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <h2 className="h2 max-w-[18ch]">Ask us whether this fits your situation.</h2>
                <p className="lead mt-5 max-w-xl text-foreground-subtle">
                  We would rather tell you a product is the wrong fit than sell it to you. Send a
                  short description of what you need it to do.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
                <ButtonLink
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
                  size="lg"
                  data-analytics="product_cta_click"
                  data-product={product.name}
                  data-location="product_footer_enquiry"
                >
                  Email BloomCore
                </ButtonLink>
                <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
                  Contact details
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
