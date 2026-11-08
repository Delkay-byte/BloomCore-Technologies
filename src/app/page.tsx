import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/founder-portrait.jpg";
import { HeroShowcase } from "@/components/HeroShowcase";
import { ArrowLink, Container, Eyebrow, StatusBadge } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, PRODUCTS, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: `${BRAND.name} — ${BRAND.tagline}` },
  description: BRAND.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: BRAND.name }],
  },
};

const productHrefs: Record<string, string> = {
  schemeknit: ROUTES.productsSchemeKnit,
  "maacash": ROUTES.productsMaacash,
  tillproof: ROUTES.productsTillProof,
};

const capabilities = [
  {
    title: "Custom software engineering",
    detail:
      "Applications shaped around an organisation's own workflow, written to be maintained after handover.",
  },
  {
    title: "Web application development",
    detail:
      "Responsive, accessible web platforms that put operational data in front of the people who act on it.",
  },
  {
    title: "Data science and analytics",
    detail:
      "One consistent model behind the reporting, with analysis aimed at specific operational questions.",
  },
  {
    title: "AI integration",
    detail:
      "Assistance applied where it is reliable, with human approval retained where decisions carry risk.",
  },
  {
    title: "Business process digitisation",
    detail:
      "Paper and messaging workflows replaced with recorded, attributable steps between roles.",
  },
  {
    title: "Consulting and system integration",
    detail:
      "Advice and connections between existing systems, sequenced against the capacity to carry the work.",
  },
];

const work = [
  {
    name: "SchemeKnit",
    industry: "Education technology",
    summary:
      "Transforms Ghanaian curriculum schemes of learning into structured, indicator-focused lesson plans, with review, editing and export.",
    status: "Available",
    href: ROUTES.productsSchemeKnit,
  },
  {
    name: "MaaCash",
    industry: "Business operations",
    summary:
      "Multi-location administration, staff and role management, mobile-money operations and susu collection workflows.",
    status: "Available",
    href: ROUTES.productsMaacash,
  },
  {
    name: "TillProof",
    industry: "Retail technology",
    summary:
      "Under development for electrical retailers: remote owner visibility, controlled pricing, cash accountability and stock traceability.",
    status: "In development",
    href: ROUTES.productsTillProof,
  },
];

function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-foreground-faint">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-base leading-7 text-foreground-subtle">{lead}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 70% 40%, black 20%, transparent 75%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -top-32 right-0 h-[32rem] w-[32rem] rounded-full bg-accent-soft opacity-80 blur-3xl"
        />

        <Container width="wide">
          <div className="relative grid gap-14 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-24">
            <div className="min-w-0 lg:col-span-6">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-foreground-faint uppercase">
                    Software products and engineering
                  </p>
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
                  {BRAND.tagline}
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-foreground-subtle sm:text-lg">
                  We build software products and deliver digital systems for Ghanaian businesses and
                  institutions — designed for the way work is actually done, not the way a template
                  assumes it is.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href={ROUTES.work} size="lg">
                    Explore our work
                  </ButtonLink>
                  <ButtonLink href={ROUTES.products} variant="outline" size="lg">
                    View our products
                  </ButtonLink>
                </div>

                <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
                  {[
                    { term: "Products", detail: "3 in the portfolio" },
                    { term: "Available", detail: "2 shipped products" },
                    { term: "In build", detail: "TillProof" },
                  ].map((item) => (
                    <div key={item.term}>
                      <dt className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                        {item.term}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-foreground">{item.detail}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <div className="min-w-0 lg:col-span-6">
              <Reveal delay={0.12} y={24}>
                <HeroShowcase />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              index="01"
              eyebrow="The company"
              title="Software built for how work is actually done here"
              lead="BloomCore Technologies designs for mobile money, WhatsApp-centred communication, intermittent connectivity and tight margins. Each product answers a specific, recurring operating problem rather than promising everything at once."
            />
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {[
              {
                title: "Products",
                body: "We build and operate our own software: education technology, business operations and retail systems. Each is scoped to what a small team can genuinely support.",
              },
              {
                title: "Engineering",
                body: "We deliver custom applications, web platforms and integrations for organisations whose workflows do not fit off-the-shelf tools.",
              },
              {
                title: "Solutions",
                body: "We digitise processes still run on paper, connect systems that duplicate each other, and turn collected data into reporting people trust.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-background p-6 sm:p-7">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground-subtle">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                index="02"
                eyebrow="Products"
                title="Three products, three operating problems"
                lead="Status labels are deliberate. A product is only described as available when it is running for real users."
              />
              <ArrowLink href={ROUTES.products} className="shrink-0 pb-1">
                All products
              </ArrowLink>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.05}>
                <Link
                  href={productHrefs[product.slug]}
                  className="group flex h-full flex-col justify-between rounded-lg border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                        {product.category}
                      </span>
                      <StatusBadge label={product.statusLabel} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-foreground-subtle">{product.short}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    View product
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-16 text-[#F5F5F5] sm:py-20">
        <Container>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-neutral-400">03</span>
              <span aria-hidden="true" className="h-px w-8 bg-neutral-700" />
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                Capabilities
              </p>
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-balance text-neutral-50 sm:text-4xl">
              Engineering across the product lifecycle
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-surface-border bg-surface-border sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item, index) => (
              <div key={item.title} className="bg-surface p-6">
                <span className="font-mono text-[10px] text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-medium text-neutral-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href={ROUTES.services}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-100 underline-offset-4 hover:underline"
            >
              How we work with clients
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              index="04"
              eyebrow="Selected work"
              title="Products, not proposals"
              lead="Everything below is built by BloomCore Technologies. We do not publish client names, revenue figures or outcomes we cannot evidence."
            />
          </Reveal>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {work.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="group grid gap-4 py-6 transition-colors hover:bg-muted/60 sm:grid-cols-12 sm:items-start sm:gap-6 sm:px-3"
                >
                  <div className="sm:col-span-3">
                    <p className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                      {item.industry}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">{item.name}</h3>
                  </div>
                  <p className="text-sm leading-6 text-foreground-subtle sm:col-span-7">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between gap-4 sm:col-span-2 sm:flex-col sm:items-end sm:gap-3">
                    <StatusBadge label={item.status} tone="muted" />
                    <span
                      aria-hidden="true"
                      className="text-sm text-foreground-faint transition-transform duration-200 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ArrowLink href={ROUTES.work}>See the full portfolio</ArrowLink>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="grid gap-8 rounded-lg border border-border bg-background p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-3">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={portrait}
                    alt="Saviour Amegayie, founder of BloomCore Technologies"
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <div className="lg:col-span-6">
                <Eyebrow>Founder</Eyebrow>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">Saviour Amegayie</h2>
                <p className="mt-3 text-sm leading-6 text-foreground-subtle">
                  BloomCore Technologies is led by Saviour Amegayie, a data scientist, IT educator
                  and software developer. Seven years of classroom teaching inform how the company
                  approaches software for schools, and a grounding in data science shapes how it
                  approaches evidence.
                </p>
              </div>
              <div className="lg:col-span-3 lg:text-right">
                <ButtonLink href={ROUTES.founder} variant="outline">
                  Founder profile
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container width="narrow" className="text-center">
          <Eyebrow>Next step</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Have a technology project in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-foreground-subtle">
            Describe the problem you are trying to solve. We will tell you plainly whether it is
            work we can take on, and what it would involve.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Project enquiry — BloomCore Technologies")}`}
              size="lg"
            >
              Email BloomCore Technologies
            </ButtonLink>
            <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
              Contact details
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
