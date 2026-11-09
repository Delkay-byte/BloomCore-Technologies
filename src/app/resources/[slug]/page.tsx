import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLink, Container, Eyebrow, PageHero } from "@/components/Page";
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

function Block({ block }: { block: ResourceBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-7 text-foreground-subtle">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item, index) => (
            <li key={item.title} className="rounded-lg border border-border bg-muted p-5">
              <span className="font-mono text-[10px] text-foreground-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground-subtle">{item.detail}</p>
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className="rounded-lg border border-border bg-muted p-5">
          <p className="text-sm leading-6 text-foreground-subtle">{block.text}</p>
        </aside>
      );
    default:
      return <p className="text-base leading-7 text-foreground-subtle">{block.text}</p>;
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
      <ViewTracker event="resource_article_view" params={{ article: article.slug }} />

      <PageHero
        eyebrow={article.category}
        title={article.title}
        lead={article.description}
        breadcrumbs={breadcrumbs}
      >
        <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
          By {BRAND.name} · {formatDate(article.published)} · {article.readingMinutes} min read
        </p>
      </PageHero>

      <section className="border-b border-border bg-background py-14 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <article className="lg:col-span-8">
              <div className="flex flex-col gap-5">
                {article.blocks.map((block, index) => (
                  <Block key={`${block.type}-${index}`} block={block} />
                ))}
              </div>

              <div className="mt-12 rounded-lg border border-border p-6 sm:p-8">
                <Eyebrow>Related product</Eyebrow>
                <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                  {product.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-foreground-subtle">{product.short}</p>
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
              <div className="lg:sticky lg:top-24">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
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
                        <li key={block.text} className="text-sm leading-6 text-foreground-subtle">
                          {block.text}
                        </li>
                      ))}
                  </ul>
                </nav>

                {related.length > 0 && (
                  <div className="mt-8 border-t border-border pt-5">
                    <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                      More guides
                    </p>
                    <ul className="mt-3 flex flex-col gap-3">
                      {related.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`${ROUTES.resources}/${item.slug}`}
                            className="text-sm leading-6 text-foreground-subtle underline-offset-4 transition-colors hover:text-foreground hover:underline"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 border-t border-border pt-5">
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
