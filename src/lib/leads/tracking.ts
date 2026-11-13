/**
 * Conversion-event rules for the public enquiry forms.
 *
 * `generate_lead` is a conversion, not a click: it may only be sent after the
 * API confirms that a new enquiry was persisted. A duplicate replay, a honeypot
 * rejection, a validation failure, a persistence error or a denied-consent
 * visitor must send nothing. Keeping the decision here makes that rule testable
 * without a browser.
 */

export type EnquiryResponse = {
  status: number;
  ok?: boolean;
  duplicate?: boolean;
  spam?: boolean;
  leadNumber?: string | null;
};

/**
 * True only for a successful, non-duplicate, non-spam enquiry that the API
 * confirmed was persisted.
 *
 * The lead number is the proof of persistence: honeypot responses are HTTP 200
 * with `ok: true`, so without checking `spam` and the lead number they would
 * have been counted as conversions.
 */
export function shouldTrackGenerateLead(response: EnquiryResponse): boolean {
  return (
    response.status >= 200 &&
    response.status < 300 &&
    response.ok === true &&
    response.duplicate !== true &&
    response.spam !== true &&
    typeof response.leadNumber === "string" &&
    response.leadNumber.trim().length > 0
  );
}

export type GenerateLeadInput = {
  formType: string;
  enquiryType: string;
  product?: string | null;
  sourcePage?: string | null;
};

/**
 * The complete GA4 parameter set. It is built from an allowlist, so a name,
 * email, phone number, organisation or message can never be attached.
 */
export function generateLeadParams(input: GenerateLeadInput): Record<string, string> {
  return {
    form_type: input.formType,
    enquiry_type: input.enquiryType,
    product: input.product?.trim() || "none",
    source_page: input.sourcePage?.trim() || "/contact",
  };
}
