"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CONTACT, ROUTES } from "@/lib/brand";
import {
  ENQUIRY_CATEGORIES,
  LEAD_PRODUCTS,
  LIMITS,
  PREFERRED_CONTACT_METHODS,
} from "@/lib/leads/domain";
import { generateLeadParams, shouldTrackGenerateLead } from "@/lib/leads/tracking";
import { cn } from "@/lib/utils";

type FieldName =
  | "fullName"
  | "email"
  | "organization"
  | "phone"
  | "countryOrRegion"
  | "enquiryType"
  | "product"
  | "message"
  | "privacyAck";

type Values = {
  fullName: string;
  email: string;
  organization: string;
  phone: string;
  countryOrRegion: string;
  enquiryType: string;
  product: string;
  preferredContactMethod: string;
  projectTimeline: string;
  budgetRange: string;
  message: string;
  privacyAck: boolean;
};

const EMPTY: Values = {
  fullName: "",
  email: "",
  organization: "",
  phone: "",
  countryOrRegion: "",
  enquiryType: "",
  product: "",
  preferredContactMethod: "",
  projectTimeline: "",
  budgetRange: "",
  message: "",
  privacyAck: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TIMELINES = [
  "As soon as possible",
  "Within a month",
  "This quarter",
  "This year",
  "No fixed date",
];

const BUDGETS = [
  "Not sure yet",
  "Under GHS 10,000",
  "GHS 10,000 – 50,000",
  "GHS 50,000 – 150,000",
  "Above GHS 150,000",
];

function validate(values: Values): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (values.fullName.trim().length < 2) {
    errors.fullName = "Enter your name, so the reply can be addressed to you.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address, for example name@example.com.";
  }
  if (!values.enquiryType) {
    errors.enquiryType = "Choose the type of enquiry.";
  }
  if (values.message.trim().length < LIMITS.messageMin) {
    errors.message = `Describe the enquiry in at least ${LIMITS.messageMin} characters.`;
  }
  if (!values.privacyAck) {
    errors.privacyAck = "Please confirm you have read how the enquiry is handled.";
  }
  return errors;
}

const fieldClasses = "field mt-2";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.8125rem] leading-5 text-foreground">
      <span aria-hidden="true">Error: </span>
      {message}
    </p>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [leadNumber, setLeadNumber] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const openedAtRef = useRef(0);
  const idempotencyRef = useRef<string>("");
  const started = useRef(false);

  useEffect(() => {
    openedAtRef.current = Date.now();
    try {
      const params = new URLSearchParams(window.location.search);
      const product = params.get("product") ?? "";
      const type = params.get("type") ?? "";
      const known = LEAD_PRODUCTS.some((p) => p.id === product);
      const knownType = ENQUIRY_CATEGORIES.some((c) => c.id === type);
      if (known || knownType) {
        // Read once from the URL on mount (product pages link here with a
        // preselected product/category). This is a one-time sync with the
        // browser location, not a render-driven state update.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValues((current) => ({
          ...current,
          product: known ? product : current.product,
          enquiryType: knownType ? type : current.enquiryType,
        }));
      }
    } catch {
      // Ignore malformed query strings.
    }
  }, []);

  const update = <K extends keyof Values>(field: K, value: Values[K]) => {
    if (!started.current) {
      started.current = true;
      trackEvent("contact_form_start");
    }
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field as FieldName];
      return next;
    });
  };

  const submit = async () => {
    if (status === "submitting") return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = (Object.keys(nextErrors) as FieldName[])[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }

    if (!idempotencyRef.current) idempotencyRef.current = crypto.randomUUID();

    setStatus("submitting");
    setFormError(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyRef.current,
        },
        body: JSON.stringify({
          ...values,
          website: honeypotRef.current?.value ?? "",
          formOpenedAt: openedAtRef.current,
          landingPage: typeof window !== "undefined" ? window.location.pathname : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        duplicate?: boolean;
        spam?: boolean;
        leadNumber?: string;
        error?: string;
        errors?: Partial<Record<FieldName, string>>;
      };

      if (response.ok && data.ok) {
        setLeadNumber(data.leadNumber ?? null);
        setStatus("success");
        idempotencyRef.current = "";
        // Only a genuinely new persisted lead is a conversion. A recognised
        // repeat submission is acknowledged but must not inflate generate_lead.
        if (
          shouldTrackGenerateLead({
            status: response.status,
            ok: data.ok,
            duplicate: data.duplicate,
            spam: data.spam,
            leadNumber: data.leadNumber,
          })
        ) {
          trackEvent(
            "generate_lead",
            generateLeadParams({
              formType: "contact_form",
              enquiryType: values.enquiryType,
              product: values.product,
              sourcePage: typeof window !== "undefined" ? window.location.pathname : "/contact",
            }),
          );
        }
        return;
      }

      if (response.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        const firstField = (Object.keys(data.errors) as FieldName[])[0];
        formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
        return;
      }

      setStatus("error");
      setFormError(data.error ?? "The enquiry could not be sent. Your text is still here — please try again.");
    } catch {
      setStatus("error");
      setFormError("The enquiry could not be sent. Check your connection. Your text is still here.");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  if (status === "success") {
    return (
      <div className="mt-8 border-l-4 border-accent bg-accent-soft px-5 py-6" role="status">
        <p className="text-[1.05rem] font-bold text-foreground">Enquiry received</p>
        <p className="mt-2 text-[0.9375rem] leading-6 text-foreground-subtle">
          Thank you. Your enquiry has been recorded{leadNumber ? ` as ${leadNumber}` : ""} and the
          team has been notified. A confirmation has been sent to your email address. We do not add
          you to a mailing list.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setLeadNumber(null);
            idempotencyRef.current = "";
            openedAtRef.current = Date.now();
            setStatus("idle");
          }}
          className="mt-4 inline-flex h-11 items-center rounded-[7px] border border-line-strong px-5 text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-surface-2"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
            Name <span className="text-foreground-faint">(required)</span>
          </label>
          <input
            id="contact-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={values.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "contact-name-error" : undefined}
            className={cn(fieldClasses, errors.fullName && "border-foreground")}
            placeholder="Your full name"
          />
          <FieldError id="contact-name-error" message={errors.fullName} />
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
            name="organization"
            type="text"
            autoComplete="organization"
            value={values.organization}
            onChange={(event) => update("organization", event.target.value)}
            className={fieldClasses}
            placeholder="School, business or institution"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
            Telephone <span className="text-foreground-faint">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={fieldClasses}
            placeholder="Only if you would prefer a call"
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
            {ENQUIRY_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <FieldError id="contact-enquiry-type-error" message={errors.enquiryType} />
        </div>

        <div>
          <label htmlFor="contact-product" className="text-sm font-medium text-foreground">
            Product <span className="text-foreground-faint">(optional)</span>
          </label>
          <select
            id="contact-product"
            name="product"
            value={values.product}
            onChange={(event) => update("product", event.target.value)}
            className={fieldClasses}
          >
            <option value="">Not product-specific</option>
            {LEAD_PRODUCTS.map((product) => (
              <option key={product.id} value={product.id}>
                {product.label}
              </option>
            ))}
          </select>
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
            maxLength={LIMITS.messageMax}
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
            {values.message.length} / {LIMITS.messageMax} characters
          </p>
          <FieldError id="contact-message-error" message={errors.message} />
        </div>

        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-foreground">
            More detail <span className="text-foreground-faint">(optional)</span>
          </p>
          <div className="mt-2 grid gap-5 sm:grid-cols-2">
            <label htmlFor="contact-preferred" className="text-[0.8125rem] font-medium text-foreground-subtle">
              Preferred contact
              <select
                id="contact-preferred"
                name="preferredContactMethod"
                value={values.preferredContactMethod}
                onChange={(event) => update("preferredContactMethod", event.target.value)}
                className={fieldClasses}
              >
                <option value="">No preference</option>
                {PREFERRED_CONTACT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method[0].toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="contact-timeline" className="text-[0.8125rem] font-medium text-foreground-subtle">
              Timeline
              <select
                id="contact-timeline"
                name="projectTimeline"
                value={values.projectTimeline}
                onChange={(event) => update("projectTimeline", event.target.value)}
                className={fieldClasses}
              >
                <option value="">No preference</option>
                {TIMELINES.map((timeline) => (
                  <option key={timeline} value={timeline}>
                    {timeline}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="contact-budget" className="text-[0.8125rem] font-medium text-foreground-subtle">
              Indicative budget
              <select
                id="contact-budget"
                name="budgetRange"
                value={values.budgetRange}
                onChange={(event) => update("budgetRange", event.target.value)}
                className={fieldClasses}
              >
                <option value="">Prefer not to say</option>
                {BUDGETS.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="contact-country" className="text-[0.8125rem] font-medium text-foreground-subtle">
              Country or region
              <input
                id="contact-country"
                name="countryOrRegion"
                type="text"
                autoComplete="country-name"
                value={values.countryOrRegion}
                onChange={(event) => update("countryOrRegion", event.target.value)}
                className={fieldClasses}
                placeholder="Ghana"
              />
            </label>
          </div>
        </div>

        {/* Honeypot: hidden from people, tempting to bots. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" ref={honeypotRef} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-[0.875rem] leading-6 text-foreground-subtle">
            <input
              type="checkbox"
              name="privacyAck"
              checked={values.privacyAck}
              onChange={(event) => update("privacyAck", event.target.checked)}
              aria-invalid={Boolean(errors.privacyAck)}
              aria-describedby={errors.privacyAck ? "contact-privacy-error" : undefined}
              className="mt-1 h-4 w-4"
            />
            <span>
              I understand BloomCore Technologies will use these details to respond to this enquiry.
              See the{" "}
              <Link href={ROUTES.privacy} className="font-semibold text-foreground underline underline-offset-4">
                privacy notice
              </Link>
              .
            </span>
          </label>
          <FieldError id="contact-privacy-error" message={errors.privacyAck} />
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-5 border-l-4 border-foreground bg-muted px-4 py-3 text-sm text-foreground">
          {formError}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 items-center justify-center rounded-[7px] bg-accent px-6 text-[0.9375rem] font-semibold text-accent-contrast transition-colors hover:bg-accent-strong disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </button>
        {status === "error" && (
          <button
            type="button"
            onClick={() => {
              idempotencyRef.current = "";
              void submit();
            }}
            className="inline-flex h-12 items-center justify-center rounded-[7px] border border-line-strong px-6 text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-surface-2"
          >
            Try again
          </button>
        )}
      </div>

      <p className="mt-4 max-w-xl text-xs leading-5 text-foreground-faint">
        The enquiry is sent to BloomCore Technologies and stored so the team can respond. If email
        delivery is delayed, the enquiry is still recorded and shown in the internal dashboard.
        Prefer email? Write to <span className="break-all">{CONTACT.email}</span>.
      </p>
    </form>
  );
}
