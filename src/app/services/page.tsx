import type { Metadata } from "next";
import { ArrowLink, Container, PageHero, Prose } from "@/components/Page";
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

const practicalities = [
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
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Software and technology work, scoped to what a small team can genuinely deliver"
        lead="BloomCore Technologies builds applications to order and advises on the systems a business already runs. The services below describe the work we take on, not a catalogue of everything technology can do."
      >
        <div className="mt-8 flex flex-wrap gap-3">
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

      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[10ch]">Seven areas of work</h2>
              <p className="lead mt-6 max-w-[30ch] text-foreground-subtle">
                Each service starts from a problem the organisation can describe. If the problem is
                better solved without custom software, we will say so.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl>
                {SERVICES.map((service) => (
                  <div key={service.title} className="py-6">
                    <dt className="text-[1.3rem] leading-tight font-semibold text-foreground">
                      {service.title}
                    </dt>
                    <dd className="mt-4 grid gap-4 text-[0.9375rem] leading-6 text-foreground-subtle sm:grid-cols-3">
                      <div>
                        <p className="text-[0.75rem] font-medium tracking-[0.12em] text-foreground-faint uppercase">
                          The problem
                        </p>
                        <p className="mt-1.5">{service.problem}</p>
                      </div>
                      <div>
                        <p className="text-[0.75rem] font-medium tracking-[0.12em] text-foreground-faint uppercase">
                          What we do
                        </p>
                        <p className="mt-1.5">{service.solution}</p>
                      </div>
                      <div>
                        <p className="text-[0.75rem] font-medium tracking-[0.12em] text-foreground-faint uppercase">
                          What changes
                        </p>
                        <p className="mt-1.5">{service.benefits}</p>
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-accent py-16 text-accent-contrast sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[14ch] text-accent-contrast">
                Four stages, each with something you keep
              </h2>
            </div>
            <div className="lg:col-span-8">
              <dl>
                {engagement.map((item) => (
                  <div key={item.step} className="grid gap-1 py-5 sm:grid-cols-12 sm:gap-6">
                    <dt className="text-[1.05rem] font-semibold text-accent-contrast sm:col-span-4">
                      {item.step}
                    </dt>
                    <dd className="text-[0.9375rem] leading-6 text-accent-contrast/75 sm:col-span-8">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="h2 max-w-[10ch]">What we will not do</h2>
              <div className="mt-6">
                <Prose>
                  <p>
                    A short list of refusals is more useful than a long list of promises. These are
                    standing commitments, not terms to be negotiated per project.
                  </p>
                </Prose>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ul className="flex flex-col gap-6">
                {notOffered.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-gold" />
                    <span className="text-[1rem] leading-7 text-foreground-subtle">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="h2 max-w-[12ch]">What we need to start</h2>
              <p className="mt-6 max-w-[30ch] text-[1rem] leading-7 text-foreground-subtle">
                Pricing depends on scope. We do not publish a rate card, because a figure quoted
                without knowing the work would be a guess.
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl>
                {practicalities.map((item) => (
                  <div key={item.term} className="grid gap-1 py-5 sm:grid-cols-12 sm:gap-6">
                    <dt className="text-[1.05rem] font-semibold text-foreground sm:col-span-4">
                      {item.term}
                    </dt>
                    <dd className="text-[0.9375rem] leading-6 text-foreground-subtle sm:col-span-8">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Project enquiry — BloomCore Technologies")}`}
                >
                  Email a project description
                </ButtonLink>
                <ButtonLink href={ROUTES.contact} variant="outline">
                  All contact details
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <Container width="narrow">
          <h2 className="h2 max-w-[18ch]">Not sure whether you need custom software?</h2>
          <p className="lead mt-6 max-w-xl text-foreground-subtle">
            That is a reasonable place to start. We will look at what you have before proposing
            anything new.
          </p>
          <div className="mt-8">
            <ArrowLink href={ROUTES.about}>How BloomCore Technologies works</ArrowLink>
          </div>
        </Container>
      </section>
    </>
  );
}
