import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, PageHero } from "@/components/Page";
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

      <section className="bg-surface-2 py-8">
        <Container>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="text-[0.75rem] font-medium tracking-[0.12em] text-foreground-faint uppercase">
              Topics
            </p>
            {RESOURCE_CATEGORIES.map((category) => (
              <span key={category} className="text-[0.9375rem] text-foreground-subtle">
                {category}
              </span>
            ))}
            <span className="text-[0.9375rem] text-foreground-faint">
              {RESOURCES.length} published {RESOURCES.length === 1 ? "guide" : "guides"}
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <ul>
            {RESOURCES.map((article) => (
              <li key={article.slug}>
                <article className="grid gap-4 py-8 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-3">
                    <p className="text-[0.75rem] font-medium tracking-[0.12em] text-foreground-faint uppercase">
                      {article.category}
                    </p>
                    <p className="mt-2 text-[0.8125rem] text-foreground-faint">
                      {formatDate(article.published)} · {article.readingMinutes} min read
                    </p>
                  </div>
                  <div className="lg:col-span-9">
                    <h2 className="h3 text-balance">
                      <Link
                        href={`${ROUTES.resources}/${article.slug}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-foreground-subtle">
                      {article.description}
                    </p>
                    <div className="mt-4">
                      <ArrowLink href={`${ROUTES.resources}/${article.slug}`}>
                        Read the guide
                      </ArrowLink>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-8 bg-background p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-8">
              <h2 className="h3">Quality before volume</h2>
              <p className="mt-3 max-w-2xl text-[1rem] leading-7 text-foreground-subtle">
                We publish when there is something specific to explain, not on a fixed schedule.
                Each guide is tied to a real product workflow and states its limits. Where a product
                is not released, the guide says so.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
              <ArrowLink href={ROUTES.products}>Explore the products</ArrowLink>
              <ArrowLink href={ROUTES.contact}>Ask a question</ArrowLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
