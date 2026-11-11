import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/founder-portrait.jpg";
import { HeroConsole } from "@/components/HeroConsole";
import { ArrowLink, Container, StatusBadge } from "@/components/Page";
import { ProductTabs } from "@/components/ProductTabs";
import { QuickEnquiry } from "@/components/QuickEnquiry";
import { SchemeKnitDemo } from "@/components/SchemeKnitDemo";
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
  },
  {
    name: "Scope",
    detail:
      "A written statement of what the first version will do, what it will not do, and what evidence will show it worked. You keep that document.",
  },
  {
    name: "Build",
    detail:
      "Small, reviewable changes. Progress is visible before the end, so a wrong direction is corrected early rather than defended.",
  },
  {
    name: "Release",
    detail:
      "The system is released, documented and demonstrated to the people who will use it. Maintenance terms are agreed in writing.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-background">
        <Container width="wide">
          <div className="pt-10 sm:pt-14 lg:pt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-3 text-[0.8125rem] font-medium tracking-[0.14em] text-foreground-faint uppercase">
              <p>{BRAND.name}</p>
              <p>Software products and engineering · Ghana</p>
            </div>
            <h1 className="display mt-7 max-w-[14ch] sm:mt-9">Work, made visible.</h1>
          </div>

          <div className="mt-10 grid gap-10 py-10 sm:mt-12 lg:grid-cols-12 lg:items-start lg:gap-8 lg:py-14">
            <div className="lg:col-span-3">
              <p className="lead max-w-[34ch] text-foreground">
                We build software products and deliver digital systems for Ghanaian businesses and
                institutions.
              </p>
              <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-6 text-foreground-subtle">
                Designed for mobile money, WhatsApp-centred communication, intermittent
                connectivity and small operating teams.
              </p>
              <div className="mt-7 flex flex-col gap-2.5">
                <ButtonLink href={ROUTES.products} size="md">
                  See the products
                </ButtonLink>
                <ButtonLink href={ROUTES.contact} variant="outline" size="md">
                  Start a project
                </ButtonLink>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-6">
              <HeroConsole />
            </div>

            <div className="lg:col-span-3 lg:pl-4">
              <p className="text-[0.8125rem] font-medium tracking-[0.14em] text-foreground-faint uppercase">
                In the catalogue
              </p>
              <ul className="mt-4 flex flex-col">
                {PRODUCTS.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={productHrefs[product.slug]}
                      className="group flex items-center justify-between gap-3 py-3 text-[1.05rem] font-medium text-foreground"
                    >
                      <span className="underline-offset-4 group-hover:underline">
                        {product.name}
                      </span>
                      <span className="shrink-0 text-[0.8125rem] text-foreground-faint">
                        {product.statusLabel}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[30ch] text-[0.8125rem] leading-5 text-foreground-faint">
                Product interfaces shown here are representative, built from documented
                capabilities. No customer, staff or financial records are displayed.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="h2 max-w-[16ch]">
                A short product list, with a reason for every entry
              </h2>
            </div>
            <div className="lg:col-span-7">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-foreground">
                    Built here, for here
                  </h3>
                  <p className="mt-3 text-[1rem] leading-7 text-foreground-subtle">
                    BloomCore Technologies designs for how work is actually done in Ghana. Each
                    product answers a specific, recurring operating problem rather than promising
                    everything at once.
                  </p>
                </div>
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-foreground">
                    Products and engineering
                  </h3>
                  <p className="mt-3 text-[1rem] leading-7 text-foreground-subtle">
                    We build and operate our own software, and we deliver custom applications, web
                    platforms and integrations for organisations whose workflows do not fit
                    off-the-shelf tools.
                  </p>
                </div>
              </div>
              <p className="mt-8 max-w-2xl text-[1rem] leading-7 text-foreground-subtle">
                We are not a large company and do not present ourselves as one. Three products,
                two available today, and a preference for shipping working software over making
                announcements.
              </p>
              <div className="mt-7">
                <ArrowLink href={ROUTES.about}>About the company</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-32">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[0.8125rem] font-medium tracking-[0.14em] text-foreground-faint uppercase">
                  SchemeKnit
                </p>
                <StatusBadge label="Available" />
              </div>
              <h2 className="h2 mt-5 max-w-[20ch]">
                From a scheme of learning to a plan you can teach
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-foreground-subtle">
                A scheme sets out the term. The weekly plan is where the work happens. SchemeKnit
                removes the repetition between the two.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <ArrowLink href={ROUTES.productsSchemeKnit}>How SchemeKnit works</ArrowLink>
                <a
                  href="https://schemeknit.bloomcoretech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics="product_outbound_click"
                  data-product="SchemeKnit"
                  data-location="homepage_demo"
                  data-destination="product_application"
                  className="text-[0.9375rem] font-medium text-foreground underline decoration-1 underline-offset-4"
                >
                  Visit SchemeKnit
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-14">
            <SchemeKnitDemo />
          </div>
          <p className="mt-4 max-w-2xl text-[0.875rem] leading-6 text-foreground-faint">
            A working example, not a customer record. Edit the lines on the left and the plan
            preview responds. Nothing you type leaves this browser.
          </p>
        </Container>
      </section>

      <section className="bg-surface-2 py-20 sm:py-24 lg:py-32">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="h2 max-w-[18ch]">Three products. Three operating problems.</h2>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-foreground-subtle">
                Status labels are deliberate. A product is described as available only when it is
                running for real users.
              </p>
              <div className="mt-5">
                <ArrowLink href={ROUTES.products}>The product directory</ArrowLink>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-14">
            <ProductTabs />
          </div>
        </Container>
      </section>

      <section className="bg-accent py-20 text-accent-contrast sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <h2 className="h2 max-w-[12ch] text-accent-contrast">
                  Engineering, when the product is not the answer
                </h2>
                <p className="lead mt-6 max-w-[32ch] text-accent-contrast/75">
                  We take on work where a workflow does not fit anything already built, and where
                  the result has to keep running after handover.
                </p>
                <div className="mt-7">
                  <Link
                    href={ROUTES.services}
                    className="inline-flex items-center gap-3 text-[1rem] font-medium text-accent-contrast underline decoration-1 underline-offset-4"
                  >
                    Services and engagement
                    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
                      <path d="M1 6h14M10.5 1.5 15 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {capabilities.map((item) => (
                  <li key={item.title} className="py-5">
                    <h3 className="text-[1.1rem] font-semibold text-accent-contrast">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-6 text-accent-contrast/70">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="h2 max-w-[16ch]">Four stages. Each leaves you something.</h2>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-foreground-subtle">
                The process stays light because the team is small. What it insists on is smallness
                of change, a second pair of eyes, and reversibility.
              </p>
            </div>
          </div>

          <ol className="mt-12 flex flex-col">
            {stages.map((stage) => (
              <li
                key={stage.name}
                className="grid gap-3 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8"
              >
                <p className="h3 text-foreground sm:col-span-4">{stage.name}</p>
                <p className="text-[1rem] leading-7 text-foreground-subtle sm:col-span-8">
                  {stage.detail}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-gold py-16 text-[#15170f] sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-7">
              <p className="text-[0.8125rem] font-medium tracking-[0.14em] uppercase opacity-75">
                What is actually here
              </p>
              <h2 className="h2 mt-4 max-w-[22ch]">
                Two products available. One in development. No invented proof.
              </h2>
              <p className="mt-5 max-w-2xl text-[1rem] leading-7 text-[#15170f]/75">
                We do not publish client names, revenue figures, awards or testimonials we cannot
                evidence. What appears on this site is software BloomCore Technologies has built,
                described with its real status.
              </p>
            </div>
            <div className="lg:col-span-5">
              <dl className="grid grid-cols-3 gap-4">
                {[
                  { term: "Products", detail: "3" },
                  { term: "Available", detail: "2" },
                  { term: "In build", detail: "1" },
                ].map((item) => (
                  <div key={item.term}>
                    <dt className="text-[0.8125rem] font-medium tracking-[0.1em] uppercase opacity-75">
                      {item.term}
                    </dt>
                    <dd className="mt-2 text-[clamp(2.6rem,4vw,3.6rem)] leading-none font-bold tracking-tight">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7">
                <Link
                  href={ROUTES.work}
                  className="inline-flex items-center gap-3 text-[1rem] font-medium underline decoration-1 underline-offset-4"
                >
                  See the work
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
                    <path d="M1 6h14M10.5 1.5 15 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-4">
              <div className="relative aspect-[4/5] w-full max-w-[360px] overflow-hidden bg-muted">
                <Image
                  src={portrait}
                  alt="Saviour Amegayie, founder of BloomCore Technologies"
                  fill
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <p className="text-[0.8125rem] font-medium tracking-[0.14em] text-foreground-faint uppercase">
                Founder
              </p>
              <h2 className="h2 mt-4 max-w-[18ch]">
                Taught in a classroom before building for one
              </h2>
              <p className="lead mt-6 max-w-2xl text-foreground-subtle">
                Saviour Amegayie is a data scientist, IT educator and software developer. Seven years
                of classroom teaching inform how the company approaches software for schools, and a
                grounding in data science shapes how it approaches evidence.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                <ButtonLink href={ROUTES.founder} variant="outline">
                  Founder profile
                </ButtonLink>
                <ArrowLink href={ROUTES.about}>About BloomCore</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="h2 max-w-[16ch]">Practical guides from the work</h2>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-foreground-subtle">
                Plain explanations of the operating problems our products are built around. No
                gated downloads and no invented statistics.
              </p>
              <div className="mt-5">
                <ArrowLink href={ROUTES.resources}>All resources</ArrowLink>
              </div>
            </div>
          </div>

          <ul className="mt-10 flex flex-col sm:mt-14">
            {RESOURCES.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`${ROUTES.resources}/${article.slug}`}
                  className="group grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-8"
                >
                  <p className="text-[0.8125rem] font-medium tracking-[0.1em] text-foreground-faint uppercase sm:col-span-3">
                    {article.category}
                  </p>
                  <div className="sm:col-span-8">
                    <h3 className="h3 text-foreground underline-offset-4 group-hover:underline">
                      {article.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[0.9375rem] leading-6 text-foreground-subtle">
                      {article.description}
                    </p>
                  </div>
                  <p className="text-[0.8125rem] text-foreground-faint sm:col-span-1 sm:text-right">
                    {article.readingMinutes} min
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-accent py-20 text-accent-contrast sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <h2 className="h2 max-w-[14ch] text-accent-contrast">
                Have a technology project in mind?
              </h2>
              <p className="lead mt-6 max-w-[36ch] text-accent-contrast/75">
                Describe the problem you are trying to solve. We will tell you plainly whether it
                is work we can take on, and what it would involve.
              </p>
              <div className="mt-10">
                <QuickEnquiry />
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-[0.8125rem] font-medium tracking-[0.14em] text-accent-contrast/60 uppercase">
                Direct contact
              </p>
              <ul className="mt-5 flex flex-col gap-5">
                <li>
                  <p className="text-[0.8125rem] text-accent-contrast/60">Email</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="mt-1 block text-[1.15rem] break-all text-accent-contrast underline-offset-4 hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <p className="text-[0.8125rem] text-accent-contrast/60">Calls and WhatsApp</p>
                  <a
                    href={`tel:${CONTACT.phoneCallsWhatsapp}`}
                    className="mt-1 block text-[1.15rem] text-accent-contrast underline-offset-4 hover:underline"
                  >
                    {CONTACT.phoneCallsWhatsapp}
                  </a>
                </li>
                <li>
                  <p className="text-[0.8125rem] text-accent-contrast/60">Calls only</p>
                  <a
                    href={`tel:${CONTACT.phoneCallsOnly}`}
                    className="mt-1 block text-[1.15rem] text-accent-contrast underline-offset-4 hover:underline"
                  >
                    {CONTACT.phoneCallsOnly}
                  </a>
                </li>
                <li>
                  <p className="text-[0.8125rem] text-accent-contrast/60">Registered address</p>
                  <p className="mt-1 max-w-[30ch] text-[0.9375rem] leading-6 text-accent-contrast/80">
                    {CONTACT.address}
                  </p>
                </li>
              </ul>
              <div className="mt-8">
                <ButtonLink href={ROUTES.contact} variant="inverse" size="md">
                  All contact details
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
