import {
  categoryLabel,
  productLabel,
  type EnquiryInput,
} from "@/lib/leads/domain";
import type { LeadRow } from "@/lib/leads/repository";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${pad(
    date.getUTCHours(),
  )}:${pad(date.getUTCMinutes())} UTC`;
}

/** Subjects carry no unnecessary personal data — lead number and category only. */
export function companySubject(lead: { lead_number: string; enquiry_type: string; product?: string | null }): string {
  const parts = [`New enquiry ${lead.lead_number}`, categoryLabel(lead.enquiry_type)];
  if (lead.product) parts.push(productLabel(lead.product));
  return parts.join(" — ");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#4d544d;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function companyEmail(
  lead: Pick<
    LeadRow,
    | "id"
    | "lead_number"
    | "full_name"
    | "email"
    | "phone"
    | "organization"
    | "country_or_region"
    | "enquiry_type"
    | "product"
    | "message"
    | "preferred_contact_method"
    | "project_timeline"
    | "budget_range"
    | "landing_page"
    | "created_at"
  >,
  dashboardUrl: string,
): { subject: string; html: string; text: string } {
  const subject = companySubject(lead);
  const lines = [
    `New enquiry ${lead.lead_number}`,
    "",
    `Name: ${lead.full_name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.organization ? `Organisation: ${lead.organization}` : "",
    lead.country_or_region ? `Country/region: ${lead.country_or_region}` : "",
    `Enquiry type: ${categoryLabel(lead.enquiry_type)}`,
    lead.product ? `Product: ${productLabel(lead.product)}` : "",
    lead.preferred_contact_method ? `Preferred contact: ${lead.preferred_contact_method}` : "",
    lead.project_timeline ? `Timeline: ${lead.project_timeline}` : "",
    lead.budget_range ? `Budget: ${lead.budget_range}` : "",
    `Received: ${formatTimestamp(lead.created_at)}`,
    lead.landing_page ? `Page: ${lead.landing_page}` : "",
    "",
    "Message:",
    lead.message,
    "",
    `Open in the private dashboard: ${dashboardUrl}`,
  ].filter((line) => line !== "");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111512;line-height:1.55">
  <p style="margin:0 0 12px"><strong>New website enquiry</strong> — ${escapeHtml(lead.lead_number)}</p>
  <table style="border-collapse:collapse;font-size:15px">
    ${row("Name", lead.full_name)}
    ${row("Email", lead.email)}
    ${row("Phone", lead.phone)}
    ${row("Organisation", lead.organization)}
    ${row("Country/region", lead.country_or_region)}
    ${row("Enquiry type", categoryLabel(lead.enquiry_type))}
    ${row("Product", lead.product ? productLabel(lead.product) : "")}
    ${row("Preferred contact", lead.preferred_contact_method)}
    ${row("Timeline", lead.project_timeline)}
    ${row("Budget", lead.budget_range)}
    ${row("Received", formatTimestamp(lead.created_at))}
    ${row("Page", lead.landing_page)}
  </table>
  <p style="margin:16px 0 4px;color:#4d544d">Message</p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
  <p style="margin:20px 0 0"><a href="${escapeHtml(dashboardUrl)}" style="color:#0c3b30">Open this lead in the private dashboard</a></p>
  <p style="margin:12px 0 0;color:#626960;font-size:13px">The dashboard link requires signing in with the authorised BloomCore account.</p>
</div>`;

  return { subject, html, text: lines.join("\n") };
}

export function acknowledgementEmail(
  lead: Pick<LeadRow, "full_name" | "lead_number" | "enquiry_type" | "product">,
  contactEmail: string,
): { subject: string; html: string; text: string } {
  const subject = `We have received your enquiry — ${lead.lead_number}`;
  const first = lead.full_name.split(" ")[0] || lead.full_name;

  const text = [
    `Hello ${first},`,
    "",
    "Thank you for contacting BloomCore Technologies. Your enquiry has been received and recorded.",
    "",
    `Reference: ${lead.lead_number}`,
    `Enquiry type: ${categoryLabel(lead.enquiry_type)}`,
    lead.product ? `Product: ${productLabel(lead.product)}` : "",
    "",
    "A member of the team will review it and reply to this address. We do not send marketing or add you to a mailing list.",
    "",
    `If you need to add anything, reply to this email or write to ${contactEmail}.`,
    "",
    "BloomCore Technologies",
    "Registered in Ghana (BN428031125)",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111512;line-height:1.6">
  <p>Hello ${escapeHtml(first)},</p>
  <p>Thank you for contacting BloomCore Technologies. Your enquiry has been received and recorded.</p>
  <p style="background:#f4f1e9;padding:12px 14px;border-radius:8px">
    <strong>Reference:</strong> ${escapeHtml(lead.lead_number)}<br />
    <strong>Enquiry type:</strong> ${escapeHtml(categoryLabel(lead.enquiry_type))}${
      lead.product ? `<br /><strong>Product:</strong> ${escapeHtml(productLabel(lead.product))}` : ""
    }
  </p>
  <p>A member of the team will review it and reply to this address. We do not send marketing or add you to a mailing list.</p>
  <p>If you need to add anything, reply to this email or write to <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a>.</p>
  <p style="color:#626960;font-size:13px">BloomCore Technologies · Registered in Ghana (BN428031125)</p>
</div>`;

  return { subject, html, text };
}

/** Plain payload used by the dashboard notification row. */
export function notificationSummary(lead: Pick<LeadRow, "lead_number" | "full_name" | "enquiry_type">): string {
  return `${lead.lead_number} — ${lead.full_name} — ${categoryLabel(lead.enquiry_type)}`;
}

export type { EnquiryInput };
