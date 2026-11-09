import type { Metadata } from "next";
import { ArrowLink, Container, Eyebrow, PageHero, Prose } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, ROUTES, SERVICES } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: "Software Development Services in Ghana" },
  description:
    "Custom software, web applications, process digitisation, data science, AI integration and APIs for Ghanaian organisations.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Services — ${BRAND.name}`,
    url: "/services",
    description:
      "Custom software development, web applications, process digitisation, data science, AI integration, APIs and technology consulting in Ghana.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Software Development Services in Ghana — ${BRAND.name}`,
    description:
      "Custom software development, web applications, process digitisation, data science, AI integration, APIs and technology consulting in Ghana.",
    images: ["/og-image.png"],
  },
};

const engagement = [
  {
    step: "Conversation",
    detail:
      "You describe the problem in your own terms. We ask questions until we understand what happens today, including the workarounds.",
  },
  {
    step: "Written scope",
    detail:
      "We write down what the first version will do, what it will not do, and what evidence will show it worked. You keep that document.",
  },
  {
    step: "Build in stages",
    detail:
      "Work proceeds in small, reviewable stages. You see progress before the end, so a wrong direction is corrected early.",
  },
  {
    step: "Release and hand over",
    detail:
      "The system is released, documented and demonstrated to the people who will use it. Maintenance terms are agreed in writing.",
  },
];

const notOffered = [
  "We do not sell software licences for products we have not built.",
  "We do not promise integration with a provider before testing it against that provider's live interface.",
  "We do not take on work where the deadline requires skipping verification of anything touching money or personal data.",
  "We do not publish client names or outcomes without written permission.",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Software and technology work, scoped to what a small team can genuinely deliver"
        lead="BloomCore Technologies builds applications to order and advises on the systems a business already runs. The services below describe the work we take on, not a catalogue of everything technology can do."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Project enquiry — BloomCore Technologies")}`}
            size="lg"
          >
            Describe your project
          </ButtonLink>
          <ButtonLink href={ROUTES.work} variant="outline" size="lg">
            See what we have built
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Seven areas of work
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground-subtle">
                Each service starts from a problem the organisation can describe. If the problem is
                better solved without custom software, we will say so.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {SERVICES.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.04}>
                <article className="flex h-full flex-col rounded-lg border border-border bg-background p-6 transition-colors hover:border-foreground/25">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-foreground-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {service.title}
                    </h3>
                  </div>

                  <dl className="mt-5 flex flex-col gap-4">
                    <div>
                      <dt className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                        The problem
                      </dt>
                      <dd className="mt-1.5 text-sm leading-6 text-foreground-subtle">
                        {service.problem}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                        What we do
                      </dt>
                      <dd className="mt-1.5 text-sm leading-6 text-foreground-subtle">
                        {service.solution}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                        What changes
                      </dt>
                      <dd className="mt-1.5 text-sm leading-6 text-foreground-subtle">
                        {service.benefits}
                      </dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-16 text-[#F5F5F5] sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                How an engagement runs
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-neutral-50 sm:text-3xl">
                Four stages, each with something you keep
              </h2>
            </div>
            <div className="lg:col-span-8">
              <ol className="divide-y divide-surface-border border-y border-surface-border">
                {engagement.map((item, index) => (
                  <li key={item.step} className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                    <div className="sm:col-span-4">
                      <span className="font-mono text-[10px] text-neutral-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-neutral-100">{item.step}</p>
                    </div>
                    <p className="text-sm leading-6 text-neutral-400 sm:col-span-8">{item.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Boundaries</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                What we will not do
              </h2>
              <div className="mt-4">
                <Prose>
                  <p>
                    A short list of refusals is more useful than a long list of promises. These are
                    standing commitments, not terms to be negotiated per project.
                  </p>
                </Prose>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ul className="flex flex-col gap-3">
                {notOffered.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border p-4"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground-faint"
                    />
                    <span className="text-sm leading-6 text-foreground-subtle">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-16 sm:py-20">
        <Container width="narrow">
          <Eyebrow>Practicalities</Eyebrow>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            What we need to start
          </h2>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {[
              {
                term: "A named problem",
                detail:
                  "A sentence describing what goes wrong today and who it affects. You do not need to prescribe a solution.",
              },
              {
                term: "Access to the people",
                detail:
                  "A conversation with the staff who do the work. Their description of the workaround is usually the most valuable input.",
              },
              {
                term: "A decision maker",
                detail:
                  "Someone able to approve scope and accept the completed work, so decisions do not stall mid-build.",
              },
              {
                term: "Honest constraints",
                detail:
                  "Budget range, deadline and any existing systems that must be kept. Constraints make a plan; silence makes a surprise.",
              },
            ].map((item) => (
              <div key={item.term} className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-6">
                <dt className="text-sm font-semibold text-foreground">{item.term}</dt>
                <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm leading-6 text-foreground-subtle">
            Pricing depends on scope. We do not publish a rate card, because a figure quoted without
            knowing the work would be a guess.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Project enquiry — BloomCore Technologies")}`}
            >
              Email a project description
            </ButtonLink>
            <ButtonLink href={ROUTES.contact} variant="outline">
              All contact details
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container width="narrow" className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Not sure whether you need custom software?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-foreground-subtle">
            That is a reasonable place to start. We will look at what you have before proposing
            anything new.
          </p>
          <p className="mt-8 text-sm text-foreground-subtle">
            <ArrowLink href={ROUTES.about}>How BloomCore Technologies works</ArrowLink>
          </p>
        </Container>
      </section>
    </>
  );
}
