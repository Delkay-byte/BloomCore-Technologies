import type { Metadata } from "next";
import { ProductPageShell, type ProductDetail } from "@/components/ProductPageShell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "SchemeKnit",
  description:
    "SchemeKnit turns curriculum schemes of learning into structured, indicator-focused lesson plans that teachers can review, edit and export.",
  alternates: { canonical: "/products/schemeknit" },
  openGraph: {
    title: `SchemeKnit — ${BRAND.name}`,
    url: "/products/schemeknit",
    description:
      "A lesson-planning platform for teachers: curriculum extraction, structured review, generation around indicators, editing and export.",
  },
};

const detail: ProductDetail = {
  slug: "schemeknit",
  category: "Education Technology",
  statusLabel: "Available",
  statusTone: "default",
  lead: "Teachers already know what to teach. SchemeKnit removes the repetition between the curriculum scheme and the lesson plan, so the planning time goes into teaching instead.",
  overview: [
    "A scheme of learning sets out what a class should cover across a term. Turning that scheme into individual lesson plans is careful, repetitive work. Done under time pressure, the plan drifts away from the indicators it is supposed to serve.",
    "SchemeKnit takes the scheme a teacher already works from, extracts its structure, and generates lesson plans organised around the stated indicators. Teachers review the result, edit any part of it, and export what they need for the week.",
    "The product is available and in use. The description on this page is limited to capabilities present in the application; it is not a roadmap.",
  ],
  capabilities: [
    {
      title: "Curriculum document upload",
      detail:
        "Upload a scheme of learning as a document. The platform extracts the weeks, strands, content standards and indicators it contains.",
    },
    {
      title: "Structured curriculum review",
      detail:
        "Extracted content is shown for review before it is used, so a misread line is corrected once rather than repeated across a term of plans.",
    },
    {
      title: "Indicator-focused generation",
      detail:
        "Lesson plans are generated around each learning indicator, keeping the connection between what is taught and what is assessed visible.",
    },
    {
      title: "Lesson-level editing",
      detail:
        "Any generated lesson can be opened and changed. Saved edits persist, so the plan reflects the teacher's judgement rather than a template.",
    },
    {
      title: "Document export",
      detail:
        "Export lessons and plans for printing, offline use or submission in the format a school expects.",
    },
    {
      title: "Credit and package management",
      detail:
        "Plans are produced against a credit balance, with packages available for teachers who need more than an initial allowance.",
    },
  ],
  limits: [
    "We do not claim that generated plans replace a teacher's professional judgement. Every plan is editable and is intended to be reviewed.",
    "We do not publish customer names, school names, subscription figures or usage statistics.",
    "We do not claim curriculum approval, accreditation or endorsement by any education authority.",
    "SchemeKnit is a planning tool. It does not record attendance, assessment results or school administration records.",
  ],
  audience: [
    {
      role: "Classroom teachers",
      detail:
        "Teachers who plan from a national or school scheme of learning and need lesson plans that follow the stated indicators.",
    },
    {
      role: "Subject leads",
      detail:
        "Staff who check that planning across a subject is consistent, complete and aligned to the scheme before it is used.",
    },
    {
      role: "School administrators",
      detail:
        "Heads and administrators who need evidence that planning has been done, without asking teachers to duplicate paperwork.",
    },
  ],
  meta: [
    { term: "Status", detail: "Available" },
    { term: "Category", detail: "Education technology" },
    { term: "Primary users", detail: "Teachers and subject leads" },
    { term: "Platform", detail: "Web application" },
  ],
};

export default function SchemeKnitPage() {
  return <ProductPageShell detail={detail} />;
}
