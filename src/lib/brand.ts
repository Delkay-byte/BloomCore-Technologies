/**
 * Canonical brand strings. These govern the official identity across the site.
 */

export const BRAND = {
  name: "BloomCore Technologies",
  tagline: "Technology that moves work forward.",
  description:
    "BloomCore Technologies builds practical software products and provides digital technology solutions for Ghanaian businesses and institutions.",
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  products: "/products",
  productsSchemeKnit: "/products/schemeknit",
  productsMaacash: "/products/maacash",
  productsTillProof: "/products/tillproof",
  services: "/services",
  work: "/work",
  resources: "/resources",
  founder: "/founder",
  contact: "/contact",
  privacy: "/privacy",
} as const;

export const CONTACT = {
  email: "bloomcoretechnologies@gmail.com",
  phoneCallsWhatsapp: "0240064668",
  phoneCallsOnly: "0553976334",
  address: "L7 Olive St., Akast Road, Akatsi, Volta Region, Ghana",
  registration: "BN428031125",
  registrationNote:
    "Registered under the Registration of Business Names Act, 1962 (No. 151), dated 7 November 2025.",
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: ReadonlyArray<{ label: string; href: string }>;
};

export const NAVIGATION: ReadonlyArray<NavItem> = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  {
    label: "Products",
    href: ROUTES.products,
    children: [
      { label: "SchemeKnit", href: ROUTES.productsSchemeKnit },
      { label: "MaaCash", href: ROUTES.productsMaacash },
      { label: "TillProof", href: ROUTES.productsTillProof },
    ],
  },
  { label: "Services", href: ROUTES.services },
  { label: "Work", href: ROUTES.work },
  { label: "Resources", href: ROUTES.resources },
  { label: "Founder", href: ROUTES.founder },
  { label: "Contact", href: ROUTES.contact },
];

export const SOCIAL = [
  {
    label: "GitHub",
    href: "https://github.com/Delkay-byte",
    verified: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saviour-amegayie-ds",
    verified: true,
  },
] as const;

/** Products are shown with honest status labels drawn from source material. */
export const PRODUCTS = [
  {
    slug: "schemeknit",
    name: "SchemeKnit",
    category: "Education Technology",
    status: "live",
    statusLabel: "Available",
    short:
      "A teacher-focused lesson-planning platform that transforms curriculum schemes of learning into structured, indicator-focused lesson plans.",
  },
  {
    slug: "maacash",
    name: "MaaCash",
    category: "Business Operations and Management Software",
    status: "live",
    statusLabel: "Available",
    short:
      "A business operations platform supporting organisations with multi-location management, staff administration, workflows and financial operations.",
  },
  {
    slug: "tillproof",
    name: "TillProof",
    category: "Retail Technology",
    status: "development",
    statusLabel: "In development",
    short:
      "Retail management for electrical shops: remote owner visibility, controlled pricing, accountable cash handling and traceable stock.",
  },
] as const;

export const SERVICES = [
  {
    title: "Custom Software Development",
    problem:
      "Existing tools do not fit the way your business actually works, so staff find workarounds instead.",
    solution:
      "Purpose-built applications written for your workflows, built to be maintained long after delivery.",
    benefits:
      "Processes that run inside the system, fewer manual copies, and reports that reflect what actually happens.",
  },
  {
    title: "Web Application Development",
    problem:
      "Decision-making depends on information that lives in scattered files or on someone's screen.",
    solution:
      "Secure, responsive web applications that put the right information in front of the right people, on any device.",
    benefits:
      "Real-time access to work in progress, approvals that move instead of waiting, and a single source of truth.",
  },
  {
    title: "Business Process Digitisation",
    problem:
      "Key processes still depend on paper, messaging apps or spreadsheets that drift out of date.",
    solution:
      "Digitised versions of those processes with clear ownership, audit records and reliable hand-offs between roles.",
    benefits:
      "Every change is attributed to a person and a time, so accountability and investigation become straightforward.",
  },
  {
    title: "Data Science and Analytics",
    problem:
      "Data is collected but not turned into decisions, or different reports disagree with one another.",
    solution:
      "Clear reporting built on one consistent model, with the deeper analysis behind the questions that matter.",
    benefits:
      "Consistent figures everyone uses, early warnings on the metrics that matter, and analysis that answers specific questions.",
  },
  {
    title: "AI Integration and Intelligent Automation",
    problem:
      "Repetitive tasks consume staff time without adding judgement, and valuable data goes unread.",
    solution:
      "Automation applied where it is reliable, and AI assistance where it adds real value without replacing oversight.",
    benefits:
      "Staff time returned to work that requires judgement, with clear rules and human approval kept where decisions matter.",
  },
  {
    title: "API Development and System Integration",
    problem:
      "Tools each keep their own data, so the same information is re-entered and rarely matches.",
    solution:
      "Connections that let systems exchange data through stable interfaces, instead of manual export and re-import.",
    benefits:
      "Less re-entry, fewer transcription errors, and a clear audit trail of what changed and when.",
  },
  {
    title: "Technology Consulting",
    problem:
      "Technology decisions are made case by case, without a shared picture of what the business needs.",
    solution:
      "Advice grounded in how the business actually operates, covering tools, data, security and the sequence of investment.",
    benefits:
      "Decisions documented in writing, capacity checked against the team that will carry the work.",
  },
] as const;

/** Live product applications. TillProof has no public application yet. */
export const PRODUCT_LINKS = {
  schemeknit: "https://schemeknit-frontend.onrender.com/",
  maacash: "https://bloomcore-one.onrender.com/",
} as const;
