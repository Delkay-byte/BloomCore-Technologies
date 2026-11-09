"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CONTACT } from "@/lib/brand";
import { cn } from "@/lib/utils";

const ENQUIRY_TYPES = [
  "New software project",
  "Product enquiry — SchemeKnit",
  "Product enquiry — MaaCash",
  "Product enquiry — TillProof",
  "Support request",
  "General enquiry",
] as const;

type FieldName = "name" | "email" | "organisation" | "enquiryType" | "message";
type Errors = Partial<Record<FieldName, string>>;

type Values = {
  name: string;
  email: string;
  organisation: string;
  enquiryType: string;
  message: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  organisation: "",
  enquiryType: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your name, so the reply can be addressed to you.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address, for example name@example.com.";
  }

  if (!values.enquiryType) {
    errors.enquiryType = "Choose the type of enquiry.";
  }

  if (values.message.trim().length < 20) {
    errors.message = "Describe the enquiry in at least 20 characters.";
  }

  return errors;
}

function buildMailto(values: Values): string {
  const subject = `Website enquiry — ${values.enquiryType.replace(/^Product enquiry — /, "")} — ${values.name.trim()}`;

  const body = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Organisation: ${values.organisation.trim() || "Not provided"}`,
    `Enquiry type: ${values.enquiryType}`,
    "",
    "Message:",
    values.message.trim(),
    "",
    "—",
    "Sent from the contact form on the BloomCore Technologies website.",
  ].join("\n");

  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fieldClasses =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground " +
  "placeholder:text-foreground-faint focus-visible:border-foreground focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-foreground";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs leading-5 text-foreground">
      <span aria-hidden="true">Error: </span>
      {message}
    </p>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [preparedHref, setPreparedHref] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);

  const update = (field: FieldName, value: string) => {
    if (!started.current) {
      started.current = true;
      trackEvent("contact_form_start");
    }
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setPreparedHref(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPreparedHref(null);
      const firstField = (Object.keys(nextErrors) as FieldName[])[0];
      const field = formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`);
      field?.focus();
      return;
    }

    const href = buildMailto(values);
    setPreparedHref(href);
    trackEvent("contact_form_submit", {
      enquiry_type: values.enquiryType,
    });

    // Hand the prepared message to the operating system's mail handler. The
    // site sends nothing itself; the visitor reviews and sends the email.
    window.location.href = href;
  };

  const resetForm = () => {
    setValues(EMPTY);
    setErrors({});
    setPreparedHref(null);
    setAttempted(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
            Name <span className="text-foreground-faint">(required)</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={cn(fieldClasses, errors.name && "border-foreground")}
            placeholder="Your full name"
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
            Email <span className="text-foreground-faint">(required)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={cn(fieldClasses, errors.email && "border-foreground")}
            placeholder="name@example.com"
          />
          <FieldError id="contact-email-error" message={errors.email} />
        </div>

        <div>
          <label htmlFor="contact-organisation" className="text-sm font-medium text-foreground">
            Organisation <span className="text-foreground-faint">(optional)</span>
          </label>
          <input
            id="contact-organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            value={values.organisation}
            onChange={(event) => update("organisation", event.target.value)}
            className={fieldClasses}
            placeholder="School, business or institution"
          />
        </div>

        <div>
          <label htmlFor="contact-enquiry-type" className="text-sm font-medium text-foreground">
            Enquiry type <span className="text-foreground-faint">(required)</span>
          </label>
          <select
            id="contact-enquiry-type"
            name="enquiryType"
            required
            value={values.enquiryType}
            onChange={(event) => update("enquiryType", event.target.value)}
            aria-invalid={Boolean(errors.enquiryType)}
            aria-describedby={errors.enquiryType ? "contact-enquiry-type-error" : undefined}
            className={cn(fieldClasses, errors.enquiryType && "border-foreground")}
          >
            <option value="">Select an enquiry type</option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="contact-enquiry-type-error" message={errors.enquiryType} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
            Message <span className="text-foreground-faint">(required)</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            maxLength={1500}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error contact-message-hint" : "contact-message-hint"
            }
            className={cn(fieldClasses, "resize-y", errors.message && "border-foreground")}
            placeholder="What the workflow does today, who it affects, and any deadline you are working to."
          />
          <p id="contact-message-hint" className="mt-1.5 text-xs text-foreground-faint">
            {values.message.length} / 1500 characters
          </p>
          <FieldError id="contact-message-error" message={errors.message} />
        </div>
      </div>

      {attempted && Object.keys(errors).length > 0 && (
        <p role="alert" className="mt-5 rounded-md border border-border bg-muted px-4 py-3 text-sm text-foreground">
          Some details need attention before the email can be prepared. Check the messages above.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium tracking-tight text-background transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:hover:bg-neutral-200"
        >
          Prepare email
        </button>
        <button
          type="reset"
          onClick={resetForm}
          className="inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-medium tracking-tight text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Clear form
        </button>
      </div>

      <p className="mt-4 max-w-xl text-xs leading-5 text-foreground-faint">
        This form does not send anything from this website. Pressing &ldquo;Prepare email&rdquo;
        opens your own email application with the message filled in. You must review it and press
        Send there for the message to reach BloomCore Technologies.
      </p>

      <div aria-live="polite" className="mt-4">
        {preparedHref && (
          <div className="rounded-md border border-foreground/25 bg-muted px-4 py-4">
            <p className="text-sm font-medium text-foreground">
              Your email application should now be open with the message prepared.
            </p>
            <p className="mt-1.5 text-sm leading-6 text-foreground-subtle">
              Nothing has been sent yet. Review the message and press Send in your email
              application. If no application opened, use the prepared link, or write to{" "}
              <span className="break-all">{CONTACT.email}</span> directly.
            </p>
            <a
              href={preparedHref}
              className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4"
            >
              Open the prepared email
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
