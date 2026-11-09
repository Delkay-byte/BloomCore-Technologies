import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Container, Eyebrow, PageHero, Prose } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, SOCIAL } from "@/lib/brand";

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

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what the work needs to do"
        lead="Use the form to prepare an email, or contact the company directly. Nothing is submitted to a server: the message is written in your own email application."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>Email enquiry</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Prepare a message
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-foreground-subtle">
                Include what the workflow does today, who it affects and any deadline you are
                working to. A short, specific message gets a more useful reply.
              </p>
              <ContactForm />
            </div>

            <div className="lg:col-span-5">
              <Eyebrow>Direct contact</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Reach the company
              </h2>

              <dl className="mt-6 divide-y divide-border border-y border-border">
                {details.map((item) => (
                  <div key={item.label} className="py-4">
                    <dt className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={item.href}
                        className="text-base font-medium break-all text-foreground underline-offset-4 hover:underline"
                      >
                        {item.value}
                      </a>
                      <p className="mt-1.5 text-sm leading-6 text-foreground-subtle">{item.note}</p>
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

              <div className="mt-8 rounded-lg border border-border bg-muted p-5">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                  Registered details
                </p>
                <dl className="mt-4 flex flex-col gap-3 text-sm leading-6">
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
                <p className="mt-4 text-xs leading-5 text-foreground-faint">
                  The address is the registered business location. Contact the company before
                  travelling there.
                </p>
              </div>

              <div className="mt-6 rounded-lg border border-border p-5">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                  Public profiles
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {SOCIAL.map((item) => (
                    <li key={item.href}>
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
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-muted py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>What happens next</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                A real reply, not an auto-response
              </h2>
              <div className="mt-4">
                <Prose>
                  <p>
                    No message is stored on this website, and there is no automated confirmation.
                    What you send arrives by email at the address above.
                  </p>
                </Prose>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ol className="flex flex-col gap-3">
                {[
                  "We read the message and check whether the work fits what the company does.",
                  "If it does, we reply with questions or a short scope note.",
                  "If it does not, we say so and, where possible, point to what would fit better.",
                ].map((item, index) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background p-4"
                  >
                    <span className="mt-0.5 font-mono text-[10px] text-foreground-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-6 text-foreground-subtle">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container width="narrow" className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Prefer to look around first?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-foreground-subtle">
            The product pages describe what each product does and its current status. The services
            page explains how an engagement runs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/products" variant="outline" size="lg">
              View products
            </ButtonLink>
            <ButtonLink href="/services" variant="outline" size="lg">
              View services
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
