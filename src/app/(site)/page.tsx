import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/founder-portrait.jpg";
import { HeroStage } from "@/components/stage/HeroStage";
import { ProductFragment } from "@/components/ProductFragments";
import { QuickEnquiry } from "@/components/QuickEnquiry";
import { Reveal } from "@/components/Reveal";
import { SchemeKnitDemo } from "@/components/SchemeKnitDemo";
import { ArrowLink, Container, Eyebrow, StatusBadge } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, PRODUCTS, ROUTES } from "@/lib/brand";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: { absolute: `${BRAND.name} — Software Development in Ghana` },
  description:
    "BloomCore Technologies builds SchemeKnit, MaaCash and TillProof, plus custom software, web applications and data systems for Ghanaian organisations.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${BRAND.name} — Software Development in Ghana`,
    description:
      "Ghanaian software company building SchemeKnit, MaaCash and TillProof, plus custom software, web applications and data systems.",
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Software Development in Ghana`,
    description:
      "Ghanaian software company building SchemeKnit, MaaCash and TillProof, plus custom software, web applications and data systems.",
    images: ["/og-image.png"],
  },
};

const productHrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  "maacash": ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

const shortCategories: Record<string, string> = {
  schemeknit: "Education technology",
  "maacash": "Business operations",
  tillproof: "Retail technology",
};

const capabilities = [
  {
    title: "Custom software",
    detail:
      "Applications shaped around an organisation's own workflow, written to be maintained after handover.",
  },
  {
    title: "Web applications",
    detail:
      "Responsive, accessible platforms that put operational data in front of the people who act on it.",
  },
  {
    title: "Data science",
    detail:
      "One consistent model behind the reporting, with analysis aimed at specific operational questions.",
  },
  {
    title: "AI integration",
    detail:
      "Assistance applied where it is reliable, with human approval retained where decisions carry risk.",
  },
  {
    title: "Process digitisation",
    detail:
      "Paper and messaging workflows replaced with recorded, attributable steps between roles.",
  },
  {
    title: "Systems and APIs",
    detail:
      "Connections between systems that already exist, so the same information is not entered twice.",
  },
  {
    title: "Technology consulting",
    detail:
      "Advice sequenced against what the organisation can actually carry, documented in writing.",
  },
];

const stages = [
  {
    name: "Listen",
    detail:
      "A conversation with the people doing the work. What happens today, including the workarounds, because the workaround is usually the real requirement.",
    tone: "ink",
  },
  {
    name: "Scope",
    detail:
      "A written statement of what the first version will do, what it will not do, and what evidence will show it worked. You keep that document.",
    tone: "graphite",
  },
  {
    name: "Build",
    detail:
      "Small, reviewable changes. Progress is visible before the end, so a wrong direction is corrected early rather than defended.",
    tone: "surface",
  },
  {
    name: "Release",
    detail:
      "The system is released, documented and demonstrated to the people who will use it. Maintenance terms are agreed in writing.",
    tone: "muted",
  },
];

const stageTones: Record<string, { card: string; body: string }> = {
  ink: { card: "bg-accent text-accent-contrast", body: "text-accent-contrast/70" },
  graphite: { card: "bg-foreground-subtle text-background", body: "text-background/80" },
  surface: { card: "bg-surface text-foreground", body: "text-foreground-subtle" },
  muted: { card: "bg-surface-3 text-foreground", body: "text-foreground-subtle" },
};

export default function HomePage() {
  return (
    <>
      <section className="bg-background pt-2.5">
        <div className="page-frame">
          <div className="grid gap-2.5 lg:grid-cols-12">
            <div className="hero-rise flex min-h-[540px] flex-col justify-between rounded-[var(--radius)] bg-surface p-6 sm:p-9 lg:col-span-6 lg:p-10">
              <div>
                <p className="text-[0.875rem] font-semibold text-foreground-faint">
                  {BRAND.name} · Akatsi, Ghana
                </p>
                <h1 className="display mt-6 max-w-[12ch] text-[clamp(3.6rem,6.4vw,6.6rem)]">
                  Technology that works.
                </h1>
                <p className="mt-7 max-w-[46ch] text-[1.05rem] leading-7 text-foreground-subtle">
                  We build software products and deliver digital systems for Ghanaian businesses and
                  institutions, designed for mobile money, WhatsApp-centred work and small operating
                  teams.
                </p>
              </div>

              <div className="mt-8">
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <ButtonLink href={ROUTES.work} size="lg">
                    Explore our work
                  </ButtonLink>
                  <ButtonLink href={ROUTES.products} variant="outline" size="lg">
                    View products
                  </ButtonLink>
                </div>
                <p className="mt-4 text-[0.875rem] text-foreground-faint">
                  Three products. Two available today. One in active development.
                </p>
                <dl className="mt-5 hidden grid-cols-3 gap-2 rounded-[8px] bg-surface-2 p-3 sm:grid">
                  {[
                    { term: "Based in", detail: "Akatsi, Volta Region" },
                    { term: "Registered", detail: "BN428031125" },
                    { term: "Building since", detail: "2025" },
                  ].map((item) => (
                    <div key={item.term}>
                      <dt className="text-[0.6875rem] font-semibold text-foreground-faint">
                        {item.term}
                      </dt>
                      <dd className="mt-1 text-[0.8125rem] leading-4 font-semibold text-foreground">
                        {item.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="hero-rise hero-rise-2 min-h-[540px] lg:col-span-6">
              <HeroStage />
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {PRODUCTS.map((product, index) => (
              <Link
                key={product.slug}
                href={productHrefs[product.slug]}
                className="hero-rise group flex min-h-[132px] flex-col justify-between rounded-[var(--radius)] bg-surface p-5 transition-colors hover:bg-surface-2"
                style={{ animationDelay: `${160 + index * 40}ms` }}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-[1.05rem] font-bold text-foreground">{product.name}</span>
                  <span
                    className={
                      product.status === "live"
                        ? "self-start rounded-full bg-foreground px-2 py-0.5 text-[0.6875rem] font-bold text-background"
                        : "self-start rounded-full bg-surface-2 px-2 py-0.5 text-[0.6875rem] font-semibold text-foreground-subtle"
                    }
                  >
                    {product.statusLabel}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <span className="text-[0.8125rem] leading-5 text-foreground-faint">
                    {shortCategories[product.slug]}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[1rem] text-foreground-faint transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
            <Link
              href={ROUTES.contact}
              className="hero-rise group flex min-h-[132px] flex-col justify-between rounded-[var(--radius)] bg-accent p-5 text-accent-contrast transition-colors hover:bg-accent-strong"
              style={{ animationDelay: "280ms" }}
            >
              <span className="text-[1.05rem] font-bold">Start a project</span>
              <span className="flex items-end justify-between gap-3">
                <span className="text-[0.8125rem] leading-5 opacity-80">
                  Tell us what the work needs to do.
                </span>
                <span
                  aria-hidden="true"
                  className="text-[1rem] transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background section-pad">
        <Container width="wide">
          <Reveal>
            <h2 className="h2 max-w-[18ch]">A small product company with a long attention span.</h2>
            <p className="mt-6 max-w-[64ch] text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.45] text-foreground-subtle">
              BloomCore Technologies designs software for how work is actually done in Ghana. Each
              product answers one recurring operating problem, and each engagement is scoped to what
              a small team can support properly.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                lead: "Who we are",
                body: "A Ghanaian software company, registered in 2025, building its own products and delivering systems for organisations.",
              },
              {
                lead: "What we build",
                body: "SchemeKnit for lesson planning, MaaCash for multi-location operations, and TillProof for electrical retail.",
              },
              {
                lead: "Where we work",
                body: "From Akatsi in the Volta Region, for schools, institutions and businesses operating across Ghana.",
              },
              {
                lead: "How to reach us",
                body: "Email, a call or WhatsApp. We answer with a plain assessment of fit, not a sales sequence.",
              },
            ].map((item, index) => (
              <Reveal key={item.lead} delay={index * 0.05}>
                <p className="border-t border-line pt-5 text-[0.9375rem] leading-6 text-foreground-subtle">
                  <strong className="font-bold text-foreground">{item.lead}.</strong> {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="products" className="bg-surface-2 section-pad">
        <Container width="wide">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Eyebrow>Products</Eyebrow>
                <h2 className="h2 mt-4 max-w-[15ch]">Products, in use.</h2>
              </div>
              <div className="lg:col-span-5">
                <p className="lead text-foreground-subtle">
                  Status is stated exactly. A product is described as available only when it is
                  running for real users.
                </p>
                <div className="mt-4">
                  <ArrowLink href={ROUTES.products}>The product directory</ArrowLink>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <article className="mt-10 overflow-hidden rounded-[var(--radius)] bg-surface p-4 sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-[2.4rem] leading-none text-foreground">
                      SchemeKnit
                    </h3>
                    <StatusBadge label="Available" />
                  </div>
                  <p className="mt-3 max-w-[58ch] text-[1rem] leading-7 text-foreground-subtle">
                    A teacher works from a scheme of learning. SchemeKnit turns that term document
                    into structured, indicator-focused lesson plans that can be reviewed, edited and
                    exported.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <ArrowLink href={ROUTES.productsSchemeKnit}>Product details</ArrowLink>
                  <a
                    href="https://schemeknit.bloomcoretech.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics="product_outbound_click"
                    data-product="SchemeKnit"
                    data-location="homepage_feature"
                    data-destination="product_application"
                    className="text-[0.9375rem] font-semibold text-foreground underline decoration-1 underline-offset-4 hover:text-accent"
                  >
                    Open application
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
              <div className="mt-6">
                <SchemeKnitDemo />
              </div>
            </article>
          </Reveal>

          <div className="mt-2.5 grid gap-2.5 lg:grid-cols-2">
            <Reveal>
              <article className="flex h-full flex-col justify-between rounded-[var(--radius)] bg-accent p-6 text-accent-contrast sm:p-7">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-[2rem] leading-none">
                      MaaCash
                    </h3>
                    <StatusBadge label="Available" tone="invert" />
                  </div>
                  <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-6 text-accent-contrast/75">
                    Multi-location administration, staff roles, mobile-money operations and susu
                    collection workflows in one operational workspace.
                  </p>
                </div>
                <div className="mt-6">
                  <ProductFragment kind="maacash" />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <ArrowLink
                    href={ROUTES.productsMaacash}
                    className="text-accent-contrast decoration-accent-contrast"
                  >
                    Product details
                  </ArrowLink>
                  <a
                    href="https://maacash.bloomcoretech.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics="product_outbound_click"
                    data-product="MaaCash"
                    data-location="homepage_feature"
                    data-destination="product_application"
                    className="text-[0.9375rem] font-semibold text-accent-contrast underline decoration-1 underline-offset-4"
                  >
                    Open application
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.08}>
              <article className="flex h-full flex-col justify-between rounded-[var(--radius)] bg-surface p-6 sm:p-7">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-[2rem] leading-none">
                      TillProof
                    </h3>
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[0.75rem] font-semibold text-foreground-subtle">
                      In development
                    </span>
                  </div>
                  <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-6 text-foreground-subtle">
                    Retail oversight for electrical shops: remote owner visibility, controlled
                    pricing, accountable cash handling and traceable stock. Not yet available.
                  </p>
                </div>
                <div className="mt-6">
                  <ProductFragment kind="tillproof" />
                </div>
                <div className="mt-5">
                  <ArrowLink href={ROUTES.productsTillProof}>Product details</ArrowLink>
                </div>
              </article>
            </Reveal>
          </div>
          <p className="mt-4 max-w-3xl text-[0.8125rem] leading-5 text-foreground-faint">
            Product interfaces shown here are representative, built from documented capabilities. No
            customer, staff or financial records are displayed.
          </p>
        </Container>
      </section>

      <section className="bg-background section-pad">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow>Engineering</Eyebrow>
                <h2 className="h2 mt-4 max-w-[12ch]">When the product is not the answer.</h2>
                <p className="lead mt-6 max-w-[32ch] text-foreground-subtle">
                  We take on work where a workflow does not fit anything already built, and where
                  the result has to keep running after handover.
                </p>
                <div className="mt-6">
                  <ArrowLink href={ROUTES.services}>Services and engagement</ArrowLink>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                <div className="grid gap-x-10 sm:grid-cols-2">
                  {capabilities.map((item) => (
                    <div key={item.title} className="border-t border-line py-5">
                      <h3 className="text-[1.1rem] font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-[0.9375rem] leading-6 text-foreground-subtle">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 section-pad">
        <Container width="wide">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Eyebrow>Process</Eyebrow>
                <h2 className="h2 mt-4 max-w-[16ch]">Four stages. Each leaves you something.</h2>
              </div>
              <div className="lg:col-span-5">
                <p className="lead text-foreground-subtle">
                  The process stays light because the team is small. It insists on smallness of
                  change, a second pair of eyes, and reversibility.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10 flex flex-col gap-2 lg:h-[300px] lg:flex-row">
              {stages.map((stage) => (
                <div
                  key={stage.name}
                  className={`flex flex-1 flex-col justify-start rounded-[var(--radius)] p-5 sm:p-6 ${stageTones[stage.tone].card}`}
                >
                  <p className="font-display text-[2rem] leading-none">
                    {stage.name}
                  </p>
                  <p className={`mt-5 text-[0.9375rem] leading-6 ${stageTones[stage.tone].body}`}>
                    {stage.detail}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background section-pad">
        <Container>
          <Reveal>
            <div className="grid gap-8 overflow-hidden rounded-[var(--radius)] bg-accent p-6 text-accent-contrast sm:p-9 lg:grid-cols-12 lg:items-center lg:gap-14">
              <div className="lg:col-span-7">
                <p className="text-[0.8125rem] font-semibold text-accent-contrast/70">Evidence</p>
                <h2 className="h2 mt-4 max-w-[20ch] text-accent-contrast">Two products available. One in development.</h2>
                <p className="mt-5 max-w-2xl text-[1rem] leading-7 text-accent-contrast/75">
                  We do not publish client names, revenue figures, awards or testimonials we cannot
                  evidence. What appears here is software BloomCore Technologies has built,
                  described with its real status.
                </p>
                <div className="mt-6">
                  <Link
                    href={ROUTES.work}
                    className="inline-flex items-center gap-3 text-[1rem] font-semibold text-accent-contrast underline decoration-1 underline-offset-4"
                  >
                    See the work
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <dl className="grid grid-cols-3 gap-4">
                  {[
                    { term: "Products", detail: "3" },
                    { term: "Available", detail: "2" },
                    { term: "In build", detail: "1" },
                  ].map((item) => (
                    <div key={item.term} className="rounded-[var(--radius)] bg-accent-contrast/10 p-4">
                      <dt className="text-[0.8125rem] font-semibold text-accent-contrast/70">{item.term}</dt>
                      <dd className="mt-2 font-display text-[clamp(2.4rem,3.4vw,3.4rem)] leading-none">
                        {item.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background pb-3">
        <div className="page-frame">
          <Reveal>
            <div className="grid gap-2.5 lg:grid-cols-12">
              <div className="relative min-h-[360px] overflow-hidden rounded-[var(--radius)] bg-surface-2 lg:col-span-4">
                <Image
                  src={portrait}
                  alt="Saviour Amegayie, founder of BloomCore Technologies"
                  fill
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  loading="eager"
                  placeholder="blur"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col justify-between rounded-[var(--radius)] bg-surface p-6 sm:p-8 lg:col-span-8 lg:p-10">
                <div>
                  <Eyebrow>Founder</Eyebrow>
                  <h2 className="h2 mt-4 max-w-[17ch]">Taught in a classroom before building for one.</h2>
                  <p className="lead mt-6 max-w-2xl text-foreground-subtle">
                    Saviour Amegayie is a data scientist, IT educator and software developer. Seven
                    years of classroom teaching inform how the company approaches software for
                    schools, and a grounding in data science shapes how it approaches evidence.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <ButtonLink href={ROUTES.founder} variant="outline">
                    Founder profile
                  </ButtonLink>
                  <ArrowLink href={ROUTES.about}>About BloomCore</ArrowLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface-2 section-pad">
        <Container>
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Eyebrow>Resources</Eyebrow>
                <h2 className="h2 mt-4 max-w-[15ch]">Practical guides from the work.</h2>
              </div>
              <div className="lg:col-span-5">
                <p className="lead text-foreground-subtle">
                  Plain explanations of the operating problems our products are built around. No
                  gated downloads and no invented statistics.
                </p>
                <div className="mt-4">
                  <ArrowLink href={ROUTES.resources}>All resources</ArrowLink>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <ul className="mt-8 flex flex-col gap-2">
              {RESOURCES.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`${ROUTES.resources}/${article.slug}`}
                    className="group grid gap-2 rounded-[var(--radius)] bg-surface p-5 transition-colors hover:bg-surface-2 sm:grid-cols-12 sm:items-center sm:gap-6 sm:p-6"
                  >
                    <p className="text-[0.8125rem] font-semibold text-foreground-faint sm:col-span-2">
                      {article.category}
                    </p>
                    <h3 className="text-[1.05rem] font-bold text-foreground underline-offset-4 group-hover:underline sm:col-span-7">
                      {article.title}
                    </h3>
                    <p className="text-[0.8125rem] text-foreground-faint sm:col-span-2 sm:text-right">
                      {article.readingMinutes} min read
                    </p>
                    <span aria-hidden="true" className="hidden text-right text-foreground-faint sm:col-span-1 sm:block">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background pt-2.5 pb-2.5">
        <div className="page-frame">
          <div className="grid gap-2.5 lg:grid-cols-12">
            <div className="min-w-0 rounded-[var(--radius)] bg-accent p-6 text-accent-contrast sm:p-9 lg:col-span-7 lg:p-10">
              <Reveal>
                <p className="text-[0.8125rem] font-semibold text-accent-contrast/65">
                  Start a project
                </p>
                <h2 className="h2 mt-4 max-w-[12ch] text-accent-contrast">Start with the problem.</h2>
                <p className="lead mt-5 max-w-[38ch] text-accent-contrast/75">
                  Describe the problem you are trying to solve. We will tell you plainly whether it
                  is work we can take on, and what it would involve.
                </p>
                <div className="mt-8">
                  <QuickEnquiry formType="homepage_quick_enquiry" sourcePage="/" />
                </div>
              </Reveal>
            </div>

            <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 lg:col-span-5">
              <div className="rounded-[var(--radius)] bg-surface p-6 sm:col-span-2 sm:p-7">
                <p className="text-[0.8125rem] font-semibold text-foreground-faint">Email</p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-2 block text-[0.9375rem] font-semibold break-words text-foreground underline-offset-4 hover:underline"
                >
                  {CONTACT.email}
                </a>
              </div>
              <div className="rounded-[var(--radius)] bg-surface p-6 sm:col-span-2 sm:p-7">
                <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                  Calls and WhatsApp
                </p>
                <a
                  href={`tel:${CONTACT.phoneCallsWhatsapp}`}
                  className="mt-2 block text-[1.15rem] font-bold text-foreground underline-offset-4 hover:underline"
                >
                  {CONTACT.phoneCallsWhatsapp}
                </a>
                <p className="mt-4 text-[0.8125rem] font-semibold text-foreground-faint">
                  Calls only
                </p>
                <a
                  href={`tel:${CONTACT.phoneCallsOnly}`}
                  className="mt-1 block text-[1.15rem] font-bold text-foreground underline-offset-4 hover:underline"
                >
                  {CONTACT.phoneCallsOnly}
                </a>
              </div>
              <div className="rounded-[var(--radius)] bg-surface-2 p-6 sm:col-span-2 sm:p-7">
                <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                  Registered address
                </p>
                <p className="mt-2 max-w-[32ch] text-[1rem] leading-6 text-foreground">
                  {CONTACT.address}
                </p>
                <div className="mt-5">
                  <ButtonLink href={ROUTES.contact} variant="outline">
                    All contact details
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
