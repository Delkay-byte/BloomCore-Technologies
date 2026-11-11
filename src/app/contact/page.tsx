import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Container, PageHero, Prose } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, ROUTES, SOCIAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: "Contact BloomCore Technologies" },
  description:
    "Contact BloomCore Technologies by email, telephone or WhatsApp. Registered business name BN428031125, based in Akatsi, Volta Region, Ghana.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${BRAND.name}`,
    url: "/contact",
    description:
      "Email, telephone and WhatsApp contact details for BloomCore Technologies in Akatsi, Volta Region, Ghana.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact — ${BRAND.name}`,
    description:
      "Email, telephone and WhatsApp contact details for BloomCore Technologies in Akatsi, Volta Region, Ghana.",
    images: ["/og-image.png"],
  },
};

const details = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    note: "The most reliable way to reach the company. Replies come from this address only.",
  },
  {
    label: "Telephone and WhatsApp",
    value: CONTACT.phoneCallsWhatsapp,
    href: `tel:${CONTACT.phoneCallsWhatsapp}`,
    note: "Calls and WhatsApp messages. If WhatsApp is easier for you, use this number.",
  },
  {
    label: "Telephone (calls only)",
    value: CONTACT.phoneCallsOnly,
    href: `tel:${CONTACT.phoneCallsOnly}`,
    note: "Voice calls only. This line is not used for WhatsApp.",
  },
];

const nextSteps = [
  "We read the message and check whether the work fits what the company does.",
  "If it does, we reply with questions or a short scope note.",
  "If it does not, we say so and, where possible, point to what would fit better.",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what the work needs to do"
        lead="Use the form to prepare an email, or contact the company directly. Nothing is submitted to a server: the message is written in your own email application."
      />

      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="h2 max-w-[12ch]">Prepare a message</h2>
              <p className="lead mt-5 max-w-xl text-foreground-subtle">
                Include what the workflow does today, who it affects and any deadline you are
                working to. A short, specific message gets a more useful reply.
              </p>
              <ContactForm />
            </div>

            <div className="lg:col-span-5">
              <h2 className="h2 max-w-[10ch]">Reach the company</h2>

              <dl className="mt-7">
                {details.map((item) => (
                  <div key={item.label} className="py-5">
                    <dt className="text-[0.8125rem] font-semibold text-foreground-faint">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={item.href}
                        className="text-[1.05rem] font-medium break-all text-foreground underline-offset-4 hover:underline"
                      >
                        {item.value}
                      </a>
                      <p className="mt-1.5 text-[0.9375rem] leading-6 text-foreground-subtle">
                        {item.note}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={`mailto:${CONTACT.email}`} variant="outline" size="sm">
                  Email directly
                </ButtonLink>
                <ButtonLink href={`tel:${CONTACT.phoneCallsWhatsapp}`} variant="outline" size="sm">
                  Call {CONTACT.phoneCallsWhatsapp}
                </ButtonLink>
              </div>

              <div className="mt-8 bg-muted p-5">
                <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                  Registered details
                </p>
                <dl className="mt-4 flex flex-col gap-3 text-[0.9375rem] leading-6">
                  <div>
                    <dt className="font-medium text-foreground">Business name</dt>
                    <dd className="text-foreground-subtle">{BRAND.name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Registration</dt>
                    <dd className="text-foreground-subtle">
                      {CONTACT.registration}
                      <br />
                      {CONTACT.registrationNote}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Address</dt>
                    <dd className="text-foreground-subtle">{CONTACT.address}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-[0.8125rem] leading-5 text-foreground-faint">
                  The address is the registered business location. Contact the company before
                  travelling there.
                </p>
              </div>

              <div className="mt-6 bg-background p-5">
                <p className="text-[0.8125rem] font-semibold text-foreground-faint">
                  Public profiles
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {SOCIAL.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.9375rem] break-all text-foreground-subtle underline-offset-4 hover:text-foreground hover:underline"
                      >
                        {item.href.replace("https://", "")}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-accent py-16 text-accent-contrast sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 className="h2 max-w-[14ch] text-accent-contrast">
                A real reply, not an auto-response
              </h2>
              <div className="mt-5">
                <Prose className="!text-accent-contrast/75">
                  <p>
                    No message is stored on this website, and there is no automated confirmation.
                    What you send arrives by email at the address above.
                  </p>
                </Prose>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ol className="flex flex-col gap-6">
                {nextSteps.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-gold" />
                    <span className="text-[1rem] leading-7 text-accent-contrast/80">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <Container width="narrow">
          <h2 className="h2 max-w-[16ch]">Prefer to look around first?</h2>
          <p className="lead mt-6 max-w-xl text-foreground-subtle">
            The product pages describe what each product does and its current status. The services
            page explains how an engagement runs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={ROUTES.products} variant="outline" size="lg">
              View products
            </ButtonLink>
            <ButtonLink href={ROUTES.services} variant="outline" size="lg">
              View services
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

