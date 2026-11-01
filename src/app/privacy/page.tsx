import type { Metadata } from "next";
import { ArrowLink, Container, Eyebrow, PageHero } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, ROUTES } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How BloomCore Technologies handles personal data: what this website collects, how email enquiries are used, retention and your rights.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: `Privacy — ${BRAND.name}`, url: "/privacy" },
};

const sections = [
  {
    id: "who-we-are",
    title: "Who is responsible",
    body: [
      `${BRAND.name} is a business name registered in Ghana under ${CONTACT.registration}. The company is the controller for personal data it collects through this website and through direct enquiries.`,
      `Contact for any privacy question or request: ${CONTACT.email}. Postal address: ${CONTACT.address}.`,
    ],
  },
  {
    id: "what-this-site-collects",
    title: "What this website collects",
    body: [
      "This website has no contact form, no user accounts, no analytics script and no advertising tracker. Reading a page does not require you to provide any personal data.",
      "The site is served over HTTPS. The hosting provider processes standard technical request data — such as the requested page, the time of the request and the network address it came from — in order to deliver the page and keep the service secure. That processing is carried out by the hosting provider under its own terms.",
      "There are no cookies set by this website for analytics, advertising or profiling. If that changes, this notice will be updated before the change takes effect.",
    ],
  },
  {
    id: "enquiries",
    title: "When you contact us",
    body: [
      "If you send an email or a WhatsApp message, we receive what you choose to send: your name, contact details, the content of the message and any attachments.",
      "We use that information to answer your enquiry, to assess whether the work is something the company can take on, and to keep a record of the conversation. We do not add you to a marketing list, and we do not sell or rent contact details.",
      "Where an enquiry leads to a contract, the information needed to deliver and invoice the work is kept for as long as the engagement and any statutory record-keeping obligation require.",
    ],
  },
  {
    id: "lawful-basis",
    title: "Basis for processing",
    body: [
      "Ghana's Data Protection Act, 2012 (Act 843) sets out the conditions under which personal data may be processed. In practice, the company relies on your consent when you choose to make contact, on the steps needed to prepare or perform a contract, and on the company's legitimate interest in responding to enquiries and keeping business records.",
      "Where processing depends on consent, you can withdraw it at any time by writing to the address above. Withdrawing consent does not affect processing that already took place.",
    ],
  },
  {
    id: "sharing",
    title: "Who else sees it",
    body: [
      "Enquiry correspondence is held in the company's email account and, where relevant, in the company's own project records. Access is limited to the people who need it to respond or to deliver the work.",
      "Service providers used to run the business — email hosting, website hosting and, where applicable, accounting — process data on the company's instructions. We do not share personal data with third parties for their own marketing.",
      "We may disclose information where the law requires it, or where it is necessary to establish or defend a legal claim.",
    ],
  },
  {
    id: "retention",
    title: "How long it is kept",
    body: [
      "Enquiries that do not lead to work are kept only as long as needed to deal with the enquiry and any follow-up, then deleted.",
      "Records relating to a contract, an invoice or a payment are kept for the period required by applicable Ghanaian law and for as long as a legal claim could reasonably be brought.",
      "You can ask for earlier deletion of correspondence that is not subject to a legal retention obligation.",
    ],
  },
  {
    id: "transfers",
    title: "Storage location and transfers",
    body: [
      "The company operates from Ghana. Some service providers used for email or hosting may store data outside Ghana. Where that happens, the company takes reasonable steps to ensure the provider applies appropriate safeguards, and will describe the arrangement on request.",
      "This notice does not claim that a specific transfer mechanism has been approved by any authority.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    body: [
      "Under Act 843 you may ask what personal data the company holds about you, request a copy, ask for inaccurate data to be corrected, object to processing, or ask for data to be deleted where there is no overriding legal reason to keep it.",
      "Send the request to the email address above. We may ask for enough information to confirm your identity before acting, so that one person cannot obtain another person's data.",
      "If you are not satisfied with the response, you may complain to the Data Protection Commission of Ghana. This notice does not claim that the company is registered with the Commission, and it does not describe any approval by the Commission.",
    ],
  },
  {
    id: "children",
    title: "Children",
    body: [
      "This website is intended for organisations and adults making business enquiries. It is not directed at children, and the company does not knowingly collect personal data from children through this site.",
      "Where a product is used in a school, the school is responsible for the data it enters and for the consent it obtains. Product-specific arrangements are agreed with the institution, not described here.",
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "Access to company systems is restricted to the people who need it, protected by authentication, and reviewed when someone leaves a role. Correspondence and project records are kept in accounts controlled by the company.",
      "No system is perfectly secure. If a breach occurs that is likely to affect your rights, the company will notify affected people and the relevant authority as required by applicable law.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: [
      "This notice is reviewed when the way the company handles data changes — for example, if a contact form, analytics or a client portal is added.",
      "The effective date below records when the current text was published. Material changes will be reflected here rather than in a separate document.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="How BloomCore Technologies handles personal data"
        lead="This notice covers this website and direct enquiries to the company. It is written to be read, not to hide behind legal phrasing."
        bordered={false}
      />

      <section className="border-b border-border bg-background pb-16 sm:pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                  On this page
                </p>
                <nav aria-label="Privacy notice sections" className="mt-4">
                  <ul className="flex flex-col gap-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="text-sm text-foreground-subtle underline-offset-4 transition-colors hover:text-foreground hover:underline"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                    Effective date
                  </p>
                  <p className="mt-1 text-sm text-foreground-subtle">1 November 2026</p>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="rounded-lg border border-border bg-muted p-5 sm:p-6">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                  Status of this notice
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground-subtle">
                  This notice describes the company&apos;s current practice. It has not yet been
                  reviewed by a Ghanaian legal practitioner, and it should not be read as a statement
                  that every requirement of Act 843 has been formally satisfied. The company intends
                  to obtain that review and to update this page when it is complete.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-10">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {section.title}
                    </h2>
                    <div className="mt-3 flex flex-col gap-3">
                      {section.body.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 40)}
                          className="text-base leading-7 text-foreground-subtle"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-12 rounded-lg border border-border p-6">
                <Eyebrow>Questions</Eyebrow>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">
                  Ask before you assume
                </h2>
                <p className="mt-3 text-sm leading-6 text-foreground-subtle">
                  If something here is unclear, or you want to know what data the company holds about
                  you, write to {CONTACT.email}. A specific question gets a specific answer.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Privacy enquiry")}`}>
                    Email a privacy question
                  </ButtonLink>
                  <ButtonLink href={ROUTES.contact} variant="outline">
                    All contact details
                  </ButtonLink>
                </div>
              </div>

              <p className="mt-8 text-sm text-foreground-subtle">
                <ArrowLink href={ROUTES.about}>About BloomCore Technologies</ArrowLink>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
