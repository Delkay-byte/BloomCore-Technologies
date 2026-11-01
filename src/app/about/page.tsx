import type { Metadata } from "next";
import { ArrowLink, Container, DefinitionList, Eyebrow, PageHero, Prose } from "@/components/Page";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description:
    "What BloomCore Technologies is, why it exists, and how it approaches software engineering, product development and problem solving.",
  alternates: { canonical: "/about" },
  openGraph: { title: `About — ${BRAND.name}`, url: "/about" },
};

const values = [
  {
    name: "Honesty",
    detail:
      "We describe products by what they actually do. A missed date reported early is professional; a hidden one is not.",
  },
  {
    name: "Practicality",
    detail:
      "We favour the working solution over the elegant one, and build for mobile money, WhatsApp and intermittent connectivity rather than for other markets.",
  },
  {
    name: "Craft",
    detail:
      "Code another person can maintain, documents another person can act on, and support replies that resolve the problem.",
  },
  {
    name: "Stewardship",
    detail:
      "Money, data, equipment and time belong to the company and, through it, to the people it serves.",
  },
  {
    name: "Respect",
    detail:
      "We do not take advantage of anyone's lack of technical knowledge, in language, pricing or negotiation.",
  },
  {
    name: "Learning",
    detail:
      "We assume we are wrong about what we have not tested, and we change our minds when evidence asks us to.",
  },
];

const engineering = [
  {
    step: "Problem note",
    detail:
      "Work begins with a short written statement of the problem, who it affects, and why it matters now.",
  },
  {
    step: "Scoped specification",
    detail:
      "The note becomes a spec: what will change, what will not, and how we will know it worked.",
  },
  {
    step: "Build and review",
    detail:
      "Small changes on a feature branch, reviewed before merge, with commit messages that record what changed and why.",
  },
  {
    step: "Staged release",
    detail:
      "Changes reach a staging environment first, with particular attention to anything touching money, orders or personal data.",
  },
  {
    step: "Verification",
    detail:
      "After release, someone confirms the change behaves as intended and that nothing adjacent broke.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About BloomCore Technologies"
        title="A technology business built in Ghana, for the way business here actually works"
        lead="BloomCore Technologies develops its own software products and delivers digital technology solutions to businesses and institutions. The company is deliberately small, deliberately focused, and honest about what it has and has not built."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.products}>See the products</ButtonLink>
          <ButtonLink href={ROUTES.contact} variant="outline">
            Contact the company
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>Purpose</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Why the company exists
              </h2>
            </div>
            <div className="lg:col-span-8">
              <Prose>
                <p>
                  BloomCore Technologies exists to build practical software for Ghanaian businesses
                  and institutions — software that solves a real operating problem rather than a
                  problem that only exists in a pitch deck.
                </p>
                <p>
                  The company grew out of work on problems that were already visible: merchants who
                  cannot track orders across a WhatsApp conversation, schools that hold performance
                  data but cannot act on it, shops whose stock records drift away from the goods on
                  the shelf. Each product in the portfolio began as one of those problems.
                </p>
                <p>
                  We are not a large company and we do not present ourselves as one. We are a small
                  team with a small number of products and a strong preference for shipping working
                  software over making announcements.
                </p>
              </Prose>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-16 text-[#F5F5F5] sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                Mission and vision
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-50">Mission</h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">
                    To build and operate practical software products for African businesses and
                    institutions, beginning in Ghana — pricing them so the customers who need them
                    can afford them, and running the company so it can keep serving them.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-50">Vision</h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">
                    A Ghana where any business or school — whatever its size — can run on software
                    that is reliable, affordable and made with its reality in mind. We build toward
                    that picture one product at a time.
                  </p>
                </div>
              </div>
              <div className="mt-10 border-t border-surface-border pt-8">
                <h2 className="text-lg font-semibold text-neutral-50">
                  How we judge ourselves
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                  The company is succeeding when customers renew and recommend the products, when
                  the products stay dependable, when the team stays intact and growing in skill, and
                  when the finances remain solvent and understood. Those are commitments, not
                  claims — we have no customer counts, revenue figures or testimonials to publish.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>Values</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Standards used when decisions are hard
              </h2>
              <p className="mt-4 text-base leading-7 text-foreground-subtle">
                These are operating standards rather than decoration. When values conflict, the
                order of consideration is legality and safety first, honesty always, customer trust
                next, then commercial interest.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <div key={value.name} className="bg-background p-6">
                <span className="font-mono text-[10px] text-foreground-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{value.name}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-subtle">{value.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>Engineering approach</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                How a change moves from idea to production
              </h2>
              <p className="mt-4 text-sm leading-6 text-foreground-subtle">
                The process stays light because the team is small. What it insists on is smallness
                of change, a second pair of eyes, and reversibility.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ol className="divide-y divide-border border-y border-border">
                {engineering.map((item, index) => (
                  <li key={item.step} className="grid gap-2 py-5 sm:grid-cols-12 sm:gap-6">
                    <div className="sm:col-span-4">
                      <span className="font-mono text-[10px] text-foreground-faint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-foreground">{item.step}</p>
                    </div>
                    <p className="text-sm leading-6 text-foreground-subtle sm:col-span-8">
                      {item.detail}
                    </p>
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
            <div className="lg:col-span-4">
              <Eyebrow>Problem solving</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                We listen before we build
              </h2>
              <p className="mt-4 text-sm leading-6 text-foreground-subtle">
                The people closest to a problem already understand it. Our work is to write it down
                clearly, then build the smallest thing that removes it.
              </p>
            </div>
            <div className="lg:col-span-8">
              <DefinitionList
                items={[
                  {
                    term: "Understand",
                    detail:
                      "Talk to the people doing the work. Record what actually happens today, including the workarounds, because the workarounds are usually the real requirement.",
                  },
                  {
                    term: "Scope",
                    detail:
                      "Agree what the first version will do and, just as importantly, what it will not do. A product that promises everything ships nothing usable.",
                  },
                  {
                    term: "Build and evidence",
                    detail:
                      "Write the smallest maintained system that removes the problem, with records that can be investigated later.",
                  },
                  {
                    term: "Sequence",
                    detail:
                      "One product at full quality before the next. Capacity is treated as part of the plan, not an assumption about the future.",
                  },
                ]}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>Industries</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Where our work is applied
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
                {[
                  {
                    sector: "Education",
                    body: "Curriculum-aligned planning tools for teachers, and reporting built from school performance data.",
                  },
                  {
                    sector: "Business operations",
                    body: "Multi-location administration, staff roles, mobile-money records and savings collection workflows.",
                  },
                  {
                    sector: "Retail",
                    body: "Stock visibility, controlled pricing and cash accountability for shops operating across locations.",
                  },
                  {
                    sector: "Small enterprises",
                    body: "Custom tools for workflows that do not fit general-purpose products, built to be maintained.",
                  },
                ].map((item) => (
                  <div key={item.sector} className="bg-background p-6">
                    <h3 className="text-base font-semibold text-foreground">{item.sector}</h3>
                    <p className="mt-2 text-sm leading-6 text-foreground-subtle">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-muted py-16 sm:py-20">
        <Container width="narrow">
          <div className="rounded-lg border border-border bg-background p-6 sm:p-10">
            <Eyebrow>What this page does not claim</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              No history we cannot evidence
            </h2>
            <div className="mt-4">
              <Prose>
                <p>
                  BloomCore Technologies is an evolving software and technology business. We have
                  not published a founding date, an office network, staff numbers, awards,
                  certifications or a client list on this page, because doing so accurately would
                  require records we are not publishing here.
                </p>
                <p>
                  Where a product is in development, we say so. Where a capability is planned rather
                  than working, we say so. This is the same standard we apply to the software we
                  ship.
                </p>
              </Prose>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={ROUTES.contact}>Talk to us</ButtonLink>
              <ButtonLink href={ROUTES.privacy} variant="ghost">
                Privacy notice
              </ButtonLink>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-foreground-subtle">
            Prefer to browse first? <ArrowLink href={ROUTES.work}>Open the portfolio</ArrowLink>
          </p>
        </Container>
      </section>
    </>
  );
}
