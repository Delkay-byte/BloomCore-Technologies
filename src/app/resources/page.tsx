import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, Eyebrow, PageHero } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { BRAND, ROUTES } from "@/lib/brand";
import { RESOURCE_CATEGORIES, RESOURCES } from "@/lib/resources";
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
        title="Practical guides from the work"
        lead="These guides explain operating problems we build for: planning lessons from a scheme, keeping mobile money records that reconcile, and controlling stock in an electrical shop. They are written to be useful without a purchase."
        breadcrumbs={breadcrumbs}
      />

      <section className="border-b border-border bg-muted py-12">
        <Container>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
              Topics
            </p>
            {RESOURCE_CATEGORIES.map((category) => (
              <span key={category} className="text-sm text-foreground-subtle">
                {category}
              </span>
            ))}
            <span className="text-sm text-foreground-faint">
              {RESOURCES.length} published {RESOURCES.length === 1 ? "guide" : "guides"}
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-8">
            {RESOURCES.map((article, index) => (
              <Reveal key={article.slug} delay={index * 0.05}>
                <article className="grid gap-5 border-b border-border pb-8 last:border-b-0 last:pb-0 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-3">
                    <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                      {article.category}
                    </p>
                    <p className="mt-2 text-xs text-foreground-faint">
                      {formatDate(article.published)} · {article.readingMinutes} min read
                    </p>
                  </div>
                  <div className="lg:col-span-9">
                    <h2 className="text-2xl font-semibold tracking-tight text-balance">
                      <Link
                        href={`${ROUTES.resources}/${article.slug}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-foreground-subtle">
                      {article.description}
                    </p>
                    <div className="mt-4">
                      <ArrowLink href={`${ROUTES.resources}/${article.slug}`}>
                        Read the guide
                      </ArrowLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 rounded-lg border border-border bg-muted p-6 sm:p-8">
            <Eyebrow>How this section works</Eyebrow>
            <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
              Quality before volume
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground-subtle">
              We publish when there is something specific to explain, not on a fixed schedule. Each
              guide is tied to a real product workflow and states its limits. Where a product is not
              released, the guide says so.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <ArrowLink href={ROUTES.products}>Explore the products</ArrowLink>
              <ArrowLink href={ROUTES.contact}>Ask a question</ArrowLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
