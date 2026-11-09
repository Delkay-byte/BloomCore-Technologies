import type { Metadata } from "next";
import { ProductPageShell, type ProductDetail } from "@/components/ProductPageShell";
import { BRAND, PRODUCT_LINKS } from "@/lib/brand";

export const metadata: Metadata = {
  title: { absolute: "SchemeKnit — Lesson Planning Software for Teachers" },
  description:
    "SchemeKnit turns a Ghanaian scheme of learning into structured, indicator-focused lesson plans that teachers can review, edit and export.",
  alternates: { canonical: "/products/schemeknit" },
  openGraph: {
    title: `SchemeKnit — ${BRAND.name}`,
    url: "/products/schemeknit",
    description:
      "A lesson-planning platform for teachers: curriculum extraction, structured review, generation around indicators, editing and export.",
  },
  twitter: {
    card: "summary_large_image",
    title: `SchemeKnit — ${BRAND.name}`,
    description:
      "Turn a scheme of learning into structured, indicator-focused lesson plans you can review, edit and export.",
    images: ["/og-image.png"],
  },
};

const detail: ProductDetail = {
  slug: "schemeknit",
  category: "Education Technology",
  statusLabel: "Available",
  statusTone: "default",
  launch: {
    label: "Visit SchemeKnit",
    url: PRODUCT_LINKS.schemeknit,
  },
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
  faqs: [
    {
      question: "Which curriculum does SchemeKnit work from?",
      answer:
        "SchemeKnit starts from a scheme of learning that you upload. It is built around the structure used in Ghana's standards-based curriculum: strands, sub-strands, content standards and indicators. It does not claim approval, accreditation or endorsement by NaCCA or the Ghana Education Service.",
    },
    {
      question: "Can I edit a generated lesson plan?",
      answer:
        "Yes. Any generated lesson can be opened and changed, and saved edits persist. The plan is a starting point for your professional judgement, not a fixed script.",
    },
    {
      question: "What happens if the uploaded scheme is read incorrectly?",
      answer:
        "The extracted structure is shown for review before plans are generated. Correct a misread week, strand or indicator once, and the correction applies to the plans built from it.",
    },
    {
      question: "Can I export plans for printing or submission?",
      answer:
        "Yes. Lessons and plans can be exported for printing, offline use or submission in the format your school expects.",
    },
    {
      question: "How is SchemeKnit priced?",
      answer:
        "Plans are produced against a credit balance, with packages available for teachers who need more than the initial allowance. Current package details are shown inside the application. This page does not publish a price because packages can change.",
    },
  ],
};

export default function SchemeKnitPage() {
  return <ProductPageShell detail={detail} />;
}
