import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, PageHero } from "@/components/Page";
import { ViewTracker } from "@/components/ViewTracker";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, PRODUCTS, ROUTES } from "@/lib/brand";
import { getResource, relatedResources, RESOURCES, type ResourceBlock } from "@/lib/resources";
import { articleSchema, breadcrumbSchema, HOME_CRUMB } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

const productHrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  maacash: ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function generateStaticParams() {
  return RESOURCES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResource(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/resources/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      url: `/resources/${article.slug}`,
      description: article.description,
      publishedTime: article.published,
      modifiedTime: article.updated,
      authors: [BRAND.name],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: ["/og-image.png"],
    },
  };
}

function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Block({ block }: { block: ResourceBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 id={headingId(block.text)} className="h3 mt-6 scroll-mt-28 text-foreground">
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3 className="mt-3 text-[1.2rem] font-semibold tracking-tight text-foreground">
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[1.0625rem] leading-7 text-foreground-subtle">
              <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="grid gap-6 sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.title} className="rounded-[var(--radius)] bg-surface p-5">
              <h3 className="text-[1.05rem] font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-6 text-foreground-subtle">{item.detail}</p>
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className="rounded-[var(--radius)] border-l-4 border-foreground bg-muted p-5">
          <p className="text-[0.9375rem] leading-6 text-foreground-subtle">{block.text}</p>
        </aside>
      );
    default:
      return <p className="text-[1.0625rem] leading-7 text-foreground-subtle">{block.text}</p>;
  }
}

export default async function ResourceArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getResource(slug);
  if (!article) notFound();

  const product = PRODUCTS.find((item) => item.slug === article.product)!;
  const related = relatedResources(article.slug);
  const breadcrumbs = [
    HOME_CRUMB,
    { name: "Resources", href: ROUTES.resources },
    { name: article.title, href: `/resources/${article.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={articleSchema({
          slug: article.slug,
          title: article.title,
          description: article.description,
          published: article.published,
          updated: article.updated,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <ViewTracker event="resource_article_view" params={{ article_slug: article.slug }} />

      <PageHero
        eyebrow={article.category}
        title={article.title}
        lead={article.description}
        breadcrumbs={breadcrumbs}
        headingClassName="max-w-[24ch] text-[clamp(1.95rem,3.6vw,3.6rem)]"
      >
        <p className="mt-6 text-[0.8125rem] text-foreground-faint">
          By {BRAND.name} · {formatDate(article.published)} · {article.readingMinutes} min read
        </p>
      </PageHero>

      <section className="bg-surface py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <article className="max-w-[68ch] lg:col-span-8">
              <div className="flex flex-col gap-5">
                {article.blocks.map((block, index) => (
                  <Block key={`${block.type}-${index}`} block={block} />
                ))}
              </div>

              <div className="mt-12 rounded-[var(--radius)] bg-background p-6 sm:p-8">
                <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                  Related product
                </p>
                <h2 className="h3 mt-3">{product.name}</h2>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-6 text-foreground-subtle">
                  {product.short}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href={productHrefs[product.slug]}>
                    View {product.name}
                  </ButtonLink>
                  <ButtonLink
                    href={`mailto:bloomcoretechnologies@gmail.com?subject=${encodeURIComponent(`Enquiry about ${product.name}`)}`}
                    variant="outline"
                    data-analytics="product_cta_click"
                    data-product={product.name}
                    data-location="resource_article"
                  >
                    Enquire about {product.name}
                  </ButtonLink>
                </div>
              </div>
            </article>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                  In this guide
                </p>
                <nav aria-label="Guide sections" className="mt-4">
                  <ul className="flex flex-col gap-2">
                    {article.blocks
                      .filter(
                        (block): block is Extract<ResourceBlock, { type: "heading" }> =>
                          block.type === "heading",
                      )
                      .map((block) => (
                        <li key={block.text} className="text-[0.9375rem] leading-6 text-foreground-subtle">
                          <a
                            href={`#${headingId(block.text)}`}
                            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                          >
                            {block.text}
                          </a>
                        </li>
                      ))}
                  </ul>
                </nav>

                {related.length > 0 && (
                  <div className="mt-8">
                    <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                      More guides
                    </p>
                    <ul className="mt-3 flex flex-col gap-3">
                      {related.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`${ROUTES.resources}/${item.slug}`}
                            className="text-[0.9375rem] leading-6 text-foreground-subtle underline-offset-4 transition-colors hover:text-foreground hover:underline"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8">
                  <ArrowLink href={ROUTES.resources}>All resources</ArrowLink>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

