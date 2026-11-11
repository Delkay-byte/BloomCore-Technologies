"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { ENQUIRY_CATEGORIES, LIMITS } from "@/lib/leads/domain";

type Props = {
  formType: string;
  sourcePage: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function QuickEnquiry({ formType, sourcePage }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("custom_software");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const openedAtRef = useRef(0);
  const idempotencyRef = useRef("");

  useEffect(() => {
    openedAtRef.current = Date.now();
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = "Enter your name.";
    if (!EMAIL_PATTERN.test(email.trim())) next.email = "Enter a valid email address.";
    if (message.trim().length < LIMITS.messageMin) {
      next.message = `Add at least ${LIMITS.messageMin} characters.`;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!idempotencyRef.current) idempotencyRef.current = crypto.randomUUID();
    setStatus("submitting");
    setNotice(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyRef.current },
        body: JSON.stringify({
          fullName,
          email,
          enquiryType,
          product: "none",
          message,
          privacyAck: true,
          website: honeypotRef.current?.value ?? "",
          formOpenedAt: openedAtRef.current,
          landingPage: sourcePage,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        duplicate?: boolean;
        leadNumber?: string;
        error?: string;
        errors?: Record<string, string>;
      };

      if (response.ok && data.ok) {
        setStatus("success");
        setNotice(data.leadNumber ? `Recorded as ${data.leadNumber}.` : "Enquiry received.");
        idempotencyRef.current = "";
        // A recognised repeat is acknowledged but must not inflate generate_lead.
        if (!data.duplicate) {
          trackEvent("generate_lead", {
            form_type: formType,
            enquiry_type: enquiryType,
            product: "none",
            source_page: sourcePage,
          });
        }
        return;
      }
      if (response.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setStatus("error");
      setNotice(data.error ?? "The enquiry could not be sent. Your text is still here.");
    } catch {
      setStatus("error");
      setNotice("The enquiry could not be sent. Check your connection. Your text is still here.");
    }
  };

  if (status === "success") {
    return (
      <div className="mt-4 border-l-4 border-gold bg-accent-strong/40 px-4 py-4" role="status">
        <p className="text-[1rem] font-semibold text-accent-contrast">Enquiry received</p>
        <p className="mt-1.5 text-[0.875rem] leading-6 text-accent-contrast/80">
          {notice} The team has been notified and will reply to {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-4 w-full">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-[0.875rem] font-medium text-accent-contrast">
          Name
          <input
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setErrors((current) => ({ ...current, fullName: "" }));
            }}
            aria-invalid={Boolean(errors.fullName)}
            className="mt-1.5 h-12 w-full border border-accent-contrast/35 bg-accent-strong/35 px-3 text-[1rem] text-accent-contrast placeholder:text-accent-contrast/45 focus-visible:border-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
            placeholder="Your name"
          />
        </label>
        <label className="text-[0.875rem] font-medium text-accent-contrast">
          Email
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: "" }));
            }}
            aria-invalid={Boolean(errors.email)}
            className="mt-1.5 h-12 w-full border border-accent-contrast/35 bg-accent-strong/35 px-3 text-[1rem] text-accent-contrast placeholder:text-accent-contrast/45 focus-visible:border-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
            placeholder="name@example.com"
          />
        </label>
      </div>

      <label className="mt-3 block text-[0.875rem] font-medium text-accent-contrast">
        What is the work that needs to happen?
        <textarea
          name="message"
          rows={3}
          maxLength={LIMITS.messageMax}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setErrors((current) => ({ ...current, message: "" }));
          }}
          aria-invalid={Boolean(errors.message)}
          className="mt-1.5 w-full resize-y border border-accent-contrast/35 bg-accent-strong/35 px-3 py-3 text-[1rem] text-accent-contrast placeholder:text-accent-contrast/45 focus-visible:border-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
          placeholder="A sentence is enough."
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="quick-enquiry-type">
          Enquiry type
        </label>
        <select
          id="quick-enquiry-type"
          value={enquiryType}
          onChange={(event) => setEnquiryType(event.target.value)}
          className="h-11 border border-accent-contrast/35 bg-accent-strong/35 px-3 text-[0.9375rem] text-accent-contrast focus-visible:border-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
        >
          {ENQUIRY_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id} className="text-foreground">
              {category.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-11 items-center justify-center rounded-[7px] bg-gold px-6 text-[0.9375rem] font-semibold text-gold-contrast transition-colors hover:bg-gold-strong disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </button>
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="quick-website">Website</label>
        <input id="quick-website" ref={honeypotRef} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {(errors.fullName || errors.email || errors.message) && (
        <p role="alert" className="mt-3 text-[0.875rem] text-gold">
          {errors.fullName || errors.email || errors.message}
        </p>
      )}
      {notice && status === "error" && (
        <p role="alert" className="mt-3 text-[0.875rem] leading-5 text-accent-contrast">
          {notice}
        </p>
      )}
      <p className="mt-3 text-[0.8125rem] leading-5 text-accent-contrast/70">
        Your enquiry is sent securely and recorded so the team can respond. We do not add you to a
        mailing list.
      </p>
    </form>
  );
}
