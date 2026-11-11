"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CONTACT } from "@/lib/brand";

function buildHref(message: string) {
  const subject = "Project enquiry — BloomCore Technologies";
  const body = [
    message.trim(),
    "",
    "—",
    "Sent from the BloomCore Technologies website.",
  ].join("\n");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function QuickEnquiry() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [prepared, setPrepared] = useState<string | null>(null);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length < 10) {
      setError("Add a sentence describing the problem. Ten characters or more.");
      setPrepared(null);
      return;
    }

    const href = buildHref(message);
    setError(null);
    setPrepared(href);
    trackEvent("contact_email_prepared", { enquiry_type: "Homepage quick enquiry" });
    window.location.href = href;
  };

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <label htmlFor="quick-enquiry" className="text-[1rem] font-medium text-accent-contrast">
        What is the work that needs to happen?
      </label>
      <div className="relative mt-4">
        <input
          id="quick-enquiry"
          name="message"
          type="text"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setError(null);
            setPrepared(null);
          }}
          placeholder="A sentence is enough."
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "quick-enquiry-error" : "quick-enquiry-hint"}
          className="h-16 w-full border border-accent-contrast/35 bg-accent-strong/35 px-4 pr-16 text-[1.0625rem] text-accent-contrast placeholder:text-accent-contrast/45 focus-visible:border-accent-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
        />
        <button
          type="submit"
          aria-label="Prepare an email with this description"
          className="absolute top-2 right-2 flex h-12 w-12 items-center justify-center rounded-[7px] bg-gold text-gold-contrast transition-colors hover:bg-gold-strong active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-contrast"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
            <path d="M1 7h17M12 1.5 18.5 7 12 12.5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>
      <p id="quick-enquiry-hint" className="mt-3 text-[0.875rem] leading-5 text-accent-contrast/70">
        Pressing the arrow opens your own email application with the message prepared. Nothing is
        sent by this website. You can review it before sending.
      </p>
      {error && (
        <p id="quick-enquiry-error" role="alert" className="mt-3 text-[0.875rem] text-gold">
          {error} Your text is still here.
        </p>
      )}
      {prepared && (
        <p aria-live="polite" className="mt-3 text-[0.875rem] leading-5 text-accent-contrast">
          Your email application should now be open. If it did not open,{" "}
          <a href={prepared} className="underline underline-offset-4">
            use the prepared email link
          </a>
          .
        </p>
      )}
    </form>
  );
}
