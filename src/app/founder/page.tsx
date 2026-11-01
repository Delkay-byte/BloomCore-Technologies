import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/founder-portrait.jpg";
import { ArrowLink, Container, Eyebrow, PageHero, Prose } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, ROUTES, SOCIAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Founder",
  description:
    "Saviour Amegayie is the founder of BloomCore Technologies: data scientist, IT educator, software developer and AI enthusiast.",
  alternates: { canonical: "/founder" },
  openGraph: {
    title: `Founder — ${BRAND.name}`,
    url: "/founder",
    description:
      "Founder profile: data science, software development, education and applied AI at BloomCore Technologies.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: BRAND.name }],
  },
};

const disciplines = ["Founder", "Data Scientist", "IT Educator", "Software Developer", "AI Enthusiast"];

const facts = [
  { term: "Role", detail: "Founder, BloomCore Technologies" },
  { term: "Teaching", detail: "Seven years with the Ghana Education Service" },
  { term: "Data science", detail: "Two years of applied practice" },
  { term: "Development", detail: "Three years of full-stack work" },
  {
    term: "Recognition",
    detail: "Overall Best Graduating Student, TechCrush Data Science Cohort 5 — 94.7%",
  },
];

const focusAreas = [
  {
    title: "Data science",
    detail:
      "Analysis, machine learning and reporting applied to operational questions in education and agriculture.",
  },
  {
    title: "Software development",
    detail:
      "Full-stack web applications across interface, server and data model, written to be maintained after handover.",
  },
  {
    title: "Education and teaching",
    detail:
      "Seven years of classroom practice in the Ghana Education Service, including digital learning support and staff mentoring.",
  },
  {
    title: "Applied AI",
    detail:
      "AI assistance used where it is reliable, with human review kept in place wherever a decision carries risk.",
  },
];

const tools = [
  "Python",
  "SQL",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "scikit-learn",
  "Power BI",
  "Git",
];

const products = [
  {
    name: "SchemeKnit",
    status: "Available",
    detail: "Lesson planning built from curriculum schemes of learning.",
    href: ROUTES.productsSchemeKnit,
  },
  {
    name: "BIK Prestige Enterprise",
    status: "Available",
    detail: "Multi-location administration, roles, mobile money and susu workflows.",
    href: ROUTES.productsBik,
  },
  {
    name: "TillProof",
    status: "In development",
    detail: "Stock, pricing and cash accountability for electrical retailers.",
    href: ROUTES.productsTillProof,
  },
];

const projects = [
  {
    name: "Harvest Intelligence Engine",
    field: "Agricultural analytics",
    detail:
      "An end-to-end data workflow that combines rainfall, temperature and pesticide records to forecast crop yield.",
  },
  {
    name: "EduPulse BECE Results Analyser",
    field: "Educational analytics",
    detail:
      "Extracts and structures examination results, then reports subject-level performance to support targeted intervention.",
  },
  {
    name: "Ghana Education Resource Predictor",
    field: "Education planning",
    detail:
      "A data-fusion approach to regional teacher-staffing and resource gaps, presented for non-technical decision makers.",
  },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Saviour Amegayie",
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: BRAND.name },
  email: CONTACT.email,
  sameAs: SOCIAL.map((item) => item.href),
  knowsAbout: ["Data Science", "Software Development", "IT Education", "Artificial Intelligence"],
};

export default function FounderPage() {
  return (
    <>
      <PageHero
        eyebrow="Founder"
        title="Saviour Amegayie"
        lead="Founder of BloomCore Technologies. Data scientist, IT educator, software developer and AI enthusiast."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <figure className="overflow-hidden rounded-lg border border-border bg-muted">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={portrait}
                    alt="Portrait of Saviour Amegayie, founder of BloomCore Technologies"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="flex items-baseline justify-between gap-4 border-t border-border px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Saviour Amegayie</p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                      Founder · BloomCore Technologies
                    </p>
                  </div>
                </figcaption>
              </figure>
            </div>

            <div className="lg:col-span-7">
              <ul className="flex flex-wrap gap-2">
                {disciplines.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-foreground-subtle uppercase"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Prose>
                  <p>
                    Saviour Amegayie founded BloomCore Technologies to build software for the way
                    work is actually done in Ghana. Seven years in the classroom, followed by
                    project work in data science and full-stack development, shaped that focus: tools
                    that fit limited time, intermittent connectivity and small operating teams.
                  </p>
                  <p>
                    His work spans the full problem: analysing the data behind a decision, building
                    the application that carries it, and teaching the people who will use it. He
                    graduated as the Overall Best Graduating Student of TechCrush Data Science Cohort 5 with a score
                    of 94.7%.
                  </p>
                </Prose>
              </div>

              <dl className="mt-8 divide-y divide-border border-y border-border">
                {facts.map((item) => (
                  <div key={item.term} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase sm:pt-0.5">
                      {item.term}
                    </dt>
                    <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Enquiry — BloomCore Technologies")}`}
                >
                  Email the founder
                </ButtonLink>
                <ButtonLink href={ROUTES.work} variant="outline">
                  See the work
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Practice</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Four areas of work
            </h2>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {focusAreas.map((item, index) => (
              <div key={item.title} className="bg-background p-6">
                <span className="font-mono text-[10px] text-foreground-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-subtle">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
              Working tools
            </span>
            {tools.map((tool) => (
              <span
                key={tool}
                className="rounded border border-border bg-background px-2 py-1 font-mono text-[10px] text-foreground-subtle"
              >
                {tool}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <Eyebrow>Selected work</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Products built under BloomCore Technologies
              </h2>
            </div>
            <ArrowLink href={ROUTES.products} className="shrink-0 pb-1">
              All products
            </ArrowLink>
          </div>

          <ul className="mt-10 divide-y divide-border border-y border-border">
            {products.map((product) => (
              <li key={product.name}>
                <Link
                  href={product.href}
                  className="group grid gap-3 py-5 transition-colors hover:bg-muted/60 sm:grid-cols-12 sm:items-start sm:gap-6 sm:px-3"
                >
                  <div className="sm:col-span-4">
                    <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-foreground-faint uppercase">
                      {product.status}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-foreground-subtle sm:col-span-7">
                    {product.detail}
                  </p>
                  <span
                    aria-hidden="true"
                    className="text-sm text-foreground-faint transition-transform duration-200 group-hover:translate-x-1 sm:col-span-1 sm:text-right"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <Eyebrow>Independent data projects</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Analytical work outside the product catalogue
            </h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.name} className="bg-background p-6">
                  <p className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                    {project.field}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-foreground">{project.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-subtle">{project.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-foreground-faint">
              Independent project work, not client engagements. No performance figures are claimed
              here.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Professional links</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Verify the record directly
              </h2>
              <p className="mt-4 text-sm leading-6 text-foreground-subtle">
                These are the only public profiles linked from this site. Any other account claiming
                to represent BloomCore Technologies should be treated as unverified.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="divide-y divide-border border-y border-border">
                {SOCIAL.map((item) => (
                  <li key={item.href} className="flex items-center justify-between gap-4 py-4">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm break-all text-foreground-subtle underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {item.href.replace("https://", "")}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-foreground-faint">
                No CV file is published for download. A full curriculum vitae can be requested from
                the address below.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container width="narrow" className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Work with BloomCore Technologies
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-foreground-subtle">
            Describe the problem your organisation is trying to solve. You will get a direct answer
            about whether it is a fit.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Project enquiry — BloomCore Technologies")}`}
              size="lg"
            >
              Start a conversation
            </ButtonLink>
            <ButtonLink href={ROUTES.about} variant="outline" size="lg">
              About the company
            </ButtonLink>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
