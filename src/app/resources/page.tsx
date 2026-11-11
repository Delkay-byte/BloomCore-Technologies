import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, PageHero } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { BRAND, ROUTES } from "@/lib/brand";
import { RESOURCES } from "@/lib/resources";
import { breadcrumbSchema, HOME_CRUMB } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Resources — Practical Software and Operations Guides" },
  description:
    "Practical guides from BloomCore Technologies on lesson planning, mobile money recordkeeping and electrical shop stock control.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: `Resources — ${BRAND.name}`,
    url: "/resources",
    description:
      "Practical guides on lesson planning, mobile money recordkeeping and electrical shop stock control.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Resources — ${BRAND.name}`,
    description:
      "Practical guides on lesson planning, mobile money recordkeeping and electrical shop stock control.",
    images: ["/og-image.png"],
  },
};

const breadcrumbs = [HOME_CRUMB, { name: "Resources", href: ROUTES.resources }];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <PageHero
        eyebrow="Resources"
        title="Practical guides from the work."
        lead="These guides explain operating problems we build for: planning lessons from a scheme, keeping mobile money records that reconcile, and controlling stock in an electrical shop. They are written to be useful without a purchase."
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-background section-pad">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="h2">All guides.</h2>
            <p className="text-[0.9375rem] text-foreground-faint">
              {RESOURCES.length} published · no gated downloads
            </p>
          </div>

          <ul className="mt-8 flex flex-col gap-2.5">
            {RESOURCES.map((article, index) => (
              <Reveal key={article.slug} delay={index * 0.04}>
                <li>
                  <article className="group rounded-[var(--radius)] bg-surface p-5 transition-colors hover:bg-surface-2 sm:p-7">
                    <div className="grid gap-4 lg:grid-cols-12 lg:gap-10">
                      <div className="lg:col-span-3">
                        <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                          {article.category}
                        </p>
                        <p className="mt-2 text-[0.8125rem] text-foreground-faint">
                          {formatDate(article.published)} · {article.readingMinutes} min read
                        </p>
                      </div>
                      <div className="lg:col-span-9">
                        <h3 className="font-display text-[clamp(1.7rem,2.6vw,2.5rem)] leading-[1.02]">
                          <Link
                            href={`${ROUTES.resources}/${article.slug}`}
                            className="underline-offset-4 group-hover:underline"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-foreground-subtle">
                          {article.description}
                        </p>
                        <div className="mt-4">
                          <ArrowLink href={`${ROUTES.resources}/${article.slug}`}>
                            Read the guide
                          </ArrowLink>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <div className="mt-8 grid gap-8 rounded-[var(--radius)] bg-accent p-6 text-accent-contrast sm:p-9 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-none">
                  Quality before volume.
                </h2>
                <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-accent-contrast/75">
                  We publish when there is something specific to explain, not on a fixed schedule.
                  Each guide is tied to a real product workflow and states its limits. Where a
                  product is not released, the guide says so.
                </p>
              </div>
              <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
                <ArrowLink
                  href={ROUTES.products}
                  className="text-accent-contrast decoration-accent-contrast"
                >
                  Explore the products
                </ArrowLink>
                <ArrowLink
                  href={ROUTES.contact}
                  className="text-accent-contrast decoration-accent-contrast"
                >
                  Ask a question
                </ArrowLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
