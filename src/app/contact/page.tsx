import type { Metadata } from "next";
import { Container, Eyebrow, PageHero, Prose } from "@/components/Page";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND, CONTACT, SOCIAL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact BloomCore Technologies by email, telephone or WhatsApp. Registered business name BN428031125, based in Akatsi, Volta Region, Ghana.",
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact — ${BRAND.name}`, url: "/contact" },
};

const emailHref = `mailto:${CONTACT.email}`;
const projectEmailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  "Project enquiry — BloomCore Technologies",
)}`;

const details = [
  {
    label: "Email",
    value: CONTACT.email,
    href: emailHref,
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
        lead="There is no contact form on this site. Email and telephone reach the company directly, which is faster than a message sitting in a queue."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>Direct contact</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Reach the company
              </h2>
              <div className="mt-5">
                <Prose>
                  <p>
                    For a project enquiry, include what the workflow does today, who it affects and
                    any deadline you are working to. A short, specific message gets a more useful
                    reply than a long one.
                  </p>
                </Prose>
              </div>

              <dl className="mt-8 divide-y divide-border border-y border-border">
                {details.map((item) => (
                  <div key={item.label} className="py-5">
                    <dt className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-2">
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

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={projectEmailHref} size="lg">
                  Email a project enquiry
                </ButtonLink>
                <ButtonLink href={`tel:${CONTACT.phoneCallsWhatsapp}`} variant="outline" size="lg">
                  Call {CONTACT.phoneCallsWhatsapp}
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-lg border border-border bg-muted p-6 sm:p-8">
                <Eyebrow>Registered details</Eyebrow>
                <dl className="mt-5 divide-y divide-border border-y border-border">
                  <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-foreground">Business name</dt>
                    <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                      {BRAND.name}
                    </dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-foreground">Registration</dt>
                    <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                      {CONTACT.registration}
                      <br />
                      {CONTACT.registrationNote}
                    </dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-foreground">Address</dt>
                    <dd className="text-sm leading-6 text-foreground-subtle sm:col-span-2">
                      {CONTACT.address}
                    </dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-foreground">Email</dt>
                    <dd className="text-sm leading-6 break-all text-foreground-subtle sm:col-span-2">
                      {CONTACT.email}
                    </dd>
                  </div>
                </dl>

                <p className="mt-6 text-sm leading-6 text-foreground-subtle">
                  The address above is the registered business location. Contact the company
                  before travelling there.
                </p>

                <div className="mt-6 border-t border-border pt-6">
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
                          {item.href}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-border p-6 sm:p-8">
                <p className="font-mono text-[10px] tracking-[0.14em] text-foreground-faint uppercase">
                  What happens next
                </p>
                <ol className="mt-4 flex flex-col gap-3">
                  {[
                    "We read the message and check whether the work fits what the company does.",
                    "If it does, we reply with questions or a short scope note.",
                    "If it does not, we say so and, where possible, point to what would fit better.",
                  ].map((item, index) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 font-mono text-[10px] text-foreground-faint">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-6 text-foreground-subtle">{item}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-sm leading-6 text-foreground-faint">
                  There is no automated response, and no message is stored on this website. What you
                  send arrives by email.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted py-16 sm:py-20">
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
