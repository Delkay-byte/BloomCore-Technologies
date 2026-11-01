import type { Metadata } from "next";
import { ArrowLink, Container, Eyebrow, PageHero, Prose } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, ROUTES, SOCIAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Founder",
  description:
    "Saviour Amegayie leads BloomCore Technologies. Data scientist, full-stack developer and IT educator with seven years of teaching in the Ghana Education Service.",
  alternates: { canonical: "/founder" },
  openGraph: {
    title: `Founder — ${BRAND.name}`,
    url: "/founder",
    description:
      "Saviour Amegayie: data science, full-stack development, IT education and AI, applied to software for Ghanaian organisations.",
  },
};

const disciplines = [
  {
    title: "Data Science",
    detail:
      "Analysis and modelling applied to operational questions: what the data shows, what it does not, and what decision follows.",
  },
  {
    title: "Full-Stack Development",
    detail:
      "End-to-end application work: interface, server, data model and deployment, with the maintenance burden considered from the start.",
  },
  {
    title: "IT Education",
    detail:
      "Seven years teaching in the Ghana Education Service, which shapes how the company designs software for schools and for people who are not technical specialists.",
  },
  {
    title: "Artificial Intelligence",
    detail:
      "Applied AI where it is reliable, with human approval retained wherever a decision carries risk or affects a person directly.",
  },
];

type JsonLd = Record<string, unknown>;

const personSchema: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Saviour Amegayie",
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: BRAND.name },
  email: CONTACT.email,
  sameAs: SOCIAL.map((item) => item.href),
  knowsAbout: ["Data Science", "Full-Stack Development", "IT Education", "Artificial Intelligence"],
};

function MonogramComposition() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative flex min-h-[22rem] flex-col justify-between p-6 sm:min-h-[26rem] sm:p-8">
        <div className="flex items-start justify-between">
          <p className="font-mono text-[10px] tracking-[0.16em] text-neutral-400 uppercase">
            Founder
          </p>
          <p className="font-mono text-[10px] tracking-[0.16em] text-neutral-400 uppercase">
            Akatsi · Ghana
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 border border-neutral-800"
            />
            <div className="flex h-40 w-40 items-center justify-center border border-neutral-700 sm:h-52 sm:w-52">
              <span className="font-mono text-5xl font-medium tracking-tight text-neutral-50 sm:text-6xl">
                SA
              </span>
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 h-6 w-6 border border-neutral-700 bg-surface"
            />
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-neutral-800 pt-4">
          <div>
            <p className="text-sm font-semibold text-neutral-100">Saviour Amegayie</p>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-neutral-400 uppercase">
              Founder · BloomCore Technologies
            </p>
          </div>
          <span
            aria-hidden="true"
            className="font-mono text-[10px] tracking-[0.1em] text-neutral-400 uppercase"
          >
            Volta · Ghana
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FounderPage() {
  return (
    <>
      <PageHero
        eyebrow="Founder"
        title="Saviour Amegayie"
        lead="Data scientist, full-stack developer and IT educator. BloomCore Technologies is led from Akatsi, in the Volta Region of Ghana."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <MonogramComposition />
              </Reveal>
              <p className="mt-3 text-xs leading-5 text-foreground-faint">
                Typographic composition. No photograph is published on this page.
              </p>
            </div>

            <div className="lg:col-span-5">
              <Eyebrow>Profile</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Teaching first, then software
              </h2>
              <div className="mt-5 flex flex-col gap-4 text-base leading-7 text-foreground-subtle">
                <p>
                  Saviour Amegayie spent seven years teaching in the Ghana Education Service before
                  building software full time. That experience is the reason BloomCore Technologies
                  treats a teacher&apos;s planning time as a real constraint rather than an
                  abstraction.
                </p>
                <p>
                  His work combines data science, full-stack development, IT education and
                  artificial intelligence. In practice that means a product is judged on whether the
                  data behind it is sound, whether the application can be maintained, and whether the
                  people using it were taught properly.
                </p>
                <p>
                  He graduated as Best Graduating Student of Data Science Cohort 5 in 2026, with a
                  final score of 94.7%.
                </p>
              </div>

              <dl className="mt-8 divide-y divide-border border-y border-border">
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                    Role
                  </dt>
                  <dd className="text-right text-sm text-foreground-subtle">
                    Founder, BloomCore Technologies
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                    Based in
                  </dt>
                  <dd className="text-right text-sm text-foreground-subtle">
                    Akatsi, Volta Region, Ghana
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                    Teaching
                  </dt>
                  <dd className="text-right text-sm text-foreground-subtle">
                    Seven years, Ghana Education Service
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-mono text-[10px] tracking-[0.12em] text-foreground-faint uppercase">
                    Recognition
                  </dt>
                  <dd className="text-right text-sm text-foreground-subtle">
                    Best Graduating Student, Data Science Cohort 5, 2026 — 94.7%
                  </dd>
                </div>
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
            <Eyebrow>Disciplines</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Four areas of practice
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground-subtle">
              These are the areas the company works in. They are not presented as separate
              credentials; they describe how the work is approached.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {disciplines.map((item, index) => (
              <div key={item.title} className="bg-background p-6">
                <span className="font-mono text-[10px] text-foreground-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-subtle">{item.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Why the company exists</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                The classroom is the design brief
              </h2>
              <div className="mt-5">
                <Prose>
                  <p>
                    Seven years in front of a class makes certain things hard to ignore. Planning
                    work that takes an evening. Records kept in three places because no single tool
                    fit. Software introduced from outside that assumed a classroom very different
                    from the one in front of you.
                  </p>
                  <p>
                    BloomCore Technologies was founded to build for that classroom, and for the shop
                    counter and the collection round with the same characteristics: limited time,
                    intermittent connectivity, and people who need the tool to work the first time.
                  </p>
                </Prose>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-lg border border-border bg-muted p-6 sm:p-8">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                  Elsewhere
                </p>
                <ul className="mt-4 divide-y divide-border border-y border-border">
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
                <p className="mt-5 text-sm leading-6 text-foreground-subtle">
                  These are the only public profiles linked from this site. Any other account
                  claiming to represent BloomCore Technologies should be treated as unverified.
                </p>
              </div>

              <div className="mt-6 rounded-lg border border-border p-6 sm:p-8">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                  Not claimed here
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground-subtle">
                  This page does not list employers, employment dates, certifications, completed
                  degrees or awards beyond the recognition stated above. Those details are omitted
                  rather than estimated.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted py-16 sm:py-20">
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
          <p className="mt-8 text-sm text-foreground-subtle">
            <ArrowLink href={ROUTES.privacy}>How personal data is handled</ArrowLink>
          </p>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
