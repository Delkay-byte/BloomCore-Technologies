import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/founder-portrait.jpg";
import { ArrowLink, Container, PageHero, Prose } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, ROUTES, SOCIAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Saviour Amegayie — Founder",
  description:
    "Saviour Amegayie is the founder of BloomCore Technologies: data scientist, IT educator, software developer and applied AI practitioner.",
  alternates: { canonical: "/founder" },
  openGraph: {
    title: `Saviour Amegayie — Founder — ${BRAND.name}`,
    url: "/founder",
    description:
      "Founder profile: data science, software development, education and applied AI at BloomCore Technologies.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Saviour Amegayie — Founder — ${BRAND.name}`,
    description:
      "Data science, software development, education and applied AI at BloomCore Technologies.",
    images: ["/og-image.png"],
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
    name: "MaaCash",
    status: "Available",
    detail: "Multi-location administration, roles, mobile money and susu workflows.",
    href: ROUTES.productsMaacash,
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

      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <figure>
                <div className="relative aspect-[4/5] w-full bg-muted">
                  <Image
                    src={portrait}
                    alt="Portrait of Saviour Amegayie, founder of BloomCore Technologies"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <p className="text-[0.9375rem] font-semibold text-foreground">
                    Saviour Amegayie
                  </p>
                  <p className="text-[0.8125rem] text-foreground-faint">
                    Founder · BloomCore Technologies
                  </p>
                </figcaption>
              </figure>
            </div>

            <div className="lg:col-span-7">
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {disciplines.map((item) => (
                  <li key={item} className="text-[0.8125rem] font-medium text-foreground-subtle">
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
                    graduated as the Overall Best Graduating Student of TechCrush Data Science Cohort
                    5 with a score of 94.7%.
                  </p>
                </Prose>
              </div>

              <dl className="mt-8">
                {facts.map((item) => (
                  <div key={item.term} className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6">
                    <dt className="text-[0.8125rem] font-semibold text-foreground-faint sm:col-span-3 sm:pt-1">
                      {item.term}
                    </dt>
                    <dd className="text-[0.9375rem] leading-6 text-foreground-subtle sm:col-span-9">
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

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[10ch]">Four areas of work</h2>
            </div>
            <div className="lg:col-span-8">
              <dl className="grid gap-x-10 sm:grid-cols-2">
                {focusAreas.map((item) => (
                  <div key={item.title} className="py-5">
                    <dt className="text-[1.1rem] font-semibold text-foreground">{item.title}</dt>
                    <dd className="mt-2 text-[0.9375rem] leading-6 text-foreground-subtle">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-[0.8125rem] font-semibold text-foreground-faint">
                  Working tools
                </span>
                {tools.map((tool) => (
                  <span key={tool} className="text-[0.875rem] text-foreground-subtle">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch]">Products built under BloomCore Technologies</h2>
              <div className="mt-6">
                <ArrowLink href={ROUTES.products}>All products</ArrowLink>
              </div>
            </div>
            <div className="lg:col-span-8">
              <ul>
                {products.map((product) => (
                  <li key={product.name}>
                    <Link
                      href={product.href}
                      className="group grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    >
                      <div className="sm:col-span-4">
                        <h3 className="text-[1.05rem] font-semibold text-foreground underline-offset-4 group-hover:underline">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-[0.8125rem] text-foreground-faint">
                          {product.status}
                        </p>
                      </div>
                      <p className="text-[0.9375rem] leading-6 text-foreground-subtle sm:col-span-8">
                        {product.detail}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch]">Analytical work outside the catalogue</h2>
              <p className="mt-6 max-w-[30ch] text-[1rem] leading-7 text-foreground-subtle">
                Independent project work, not client engagements. No performance figures are claimed
                here.
              </p>
              <div className="mt-7">
                <ButtonLink
                  href="https://saviour-amegayie-portfolio.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View projects
                  <span className="sr-only"> (opens the Streamlit portfolio in a new tab)</span>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M6 3h7v7M13 3L3.5 12.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-8">
              <dl className="grid gap-x-10 sm:grid-cols-2">
                {projects.map((project) => (
                  <div key={project.name} className="py-5">
                    <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                      {project.field}
                    </p>
                    <dt className="mt-2 text-[1.05rem] font-semibold text-foreground">
                      {project.name}
                    </dt>
                    <dd className="mt-2 text-[0.9375rem] leading-6 text-foreground-subtle">
                      {project.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-accent py-16 text-accent-contrast sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="h2 max-w-[12ch] text-accent-contrast">Verify the record directly</h2>
              <p className="mt-6 max-w-[32ch] text-[1rem] leading-7 text-accent-contrast/70">
                These are the only public profiles linked from this site. Any other account claiming
                to represent BloomCore Technologies should be treated as unverified.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul>
                {SOCIAL.map((item) => (
                  <li key={item.href} className="flex items-center justify-between gap-4 py-4">
                    <span className="text-[0.9375rem] font-medium text-accent-contrast">
                      {item.label}
                    </span>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.9375rem] break-all text-accent-contrast/75 underline-offset-4 hover:text-accent-contrast hover:underline"
                    >
                      {item.href.replace("https://", "")}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.9375rem] leading-6 text-accent-contrast/60">
                No CV file is published for download. A full curriculum vitae can be requested from
                the address below.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <Container width="narrow">
          <h2 className="h2 max-w-[16ch]">Work with BloomCore Technologies</h2>
          <p className="lead mt-6 max-w-xl text-foreground-subtle">
            Describe the problem your organisation is trying to solve. You will get a direct answer
            about whether it is a fit.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

