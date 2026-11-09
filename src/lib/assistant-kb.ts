/**
 * Knowledge base for the BloomCore site assistant.
 *
 * The assistant runs entirely in the browser: questions are normalised,
 * tokenised and scored against the entries below. Content mirrors the live
 * site pages — every page, every product, the founder, services, contact and
 * privacy — so answers stay consistent with what the site actually says.
 *
 * Scoring notes:
 * - `topic` terms anchor a question to an entry; at least one must match.
 * - `hints` add specificity but cannot anchor a match alone.
 * - Terms are weighted by how rare they are across the knowledge base, so a
 *   distinctive word ("tillproof", "credits") outweighs a generic one
 *   ("page", "where"). Intent words are additionally damped so a question
 *   like "where do I find the privacy policy" favours the privacy entry.
 */

import { BRAND, CONTACT, PRODUCT_LINKS, ROUTES } from "@/lib/brand";

export const STREAMLIT_PORTFOLIO_URL = "https://saviour-amegayie-portfolio.streamlit.app/";

export type AssistantLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type KBEntry = {
  id: string;
  /** Words that anchor a question to this entry (at least one must match). */
  topic: string[];
  /** Words that add specificity but cannot anchor a match alone. */
  hints: string[];
  /** Short chip label shown as a suggested question. */
  chip: string;
  answer: string;
  link?: AssistantLink;
  /** Ids of entries suggested as follow-up questions. */
  followUps?: string[];
};

const SCHEMEKNIT_APP: AssistantLink = {
  label: "Open SchemeKnit",
  href: PRODUCT_LINKS.schemeknit,
  external: true,
};

const MAACASH_APP: AssistantLink = {
  label: "Open MaaCash",
  href: PRODUCT_LINKS.maacash,
  external: true,
};

export const kbEntries: KBEntry[] = [
  // ── The platform ────────────────────────────────────────────────────────
  {
    id: "platform-overview",
    topic: [
      "bloomcore",
      "bloomcore technologies",
      "company",
      "the business",
      "what do you do",
      "who are you",
    ],
    hints: ["about", "business", "technologies", "who", "what", "do", "build", "based"],
    chip: "What is BloomCore Technologies?",
    answer:
      `${BRAND.name} is a Ghanaian technology business based in Akatsi, Volta Region. It builds and operates its own software products — SchemeKnit and MaaCash are available, TillProof is in development — and takes on custom software, data, AI and consulting work for businesses and institutions. The company is deliberately small and describes its products by what they actually do.`,
    link: { label: "About the company", href: ROUTES.about },
    followUps: ["products-overview", "page-about", "services-overview"],
  },
  {
    id: "page-about",
    topic: ["about", "mission", "vision", "purpose", "values", "story", "why the company exists"],
    hints: ["company", "exist", "believe", "principles", "engineering", "process"],
    chip: "What does the About page cover?",
    answer:
      "The About page explains why the company exists (practical software for Ghanaian businesses and institutions), its mission and vision, and six values: honesty, practicality, craft, stewardship, respect and learning. It also sets out the engineering workflow — problem note, scoped specification, build and review, staged release, then verification — and states plainly that no customer counts, revenue figures or testimonials are published.",
    link: { label: "About page", href: ROUTES.about },
    followUps: ["platform-overview", "page-work", "founder"],
  },
  {
    id: "navigation-help",
    topic: ["where", "find", "navigate", "navigation", "menu", "sitemap", "site map", "page list"],
    hints: ["pages", "site", "website", "section", "go", "look", "located", "link", "url"],
    chip: "Where do I find things on this site?",
    answer:
      "The top menu holds Home, About, Products (with SchemeKnit, MaaCash and TillProof), Services, Work, Founder and Contact. Direct addresses: /about, /products, /products/schemeknit, /products/maacash, /products/tillproof, /services, /work, /founder and /contact. The footer repeats the main links and holds the privacy notice at /privacy. Both live product applications open in a new tab from their product pages.",
    link: { label: "Start at the home page", href: ROUTES.home },
    followUps: ["products-overview", "contact-details", "site-experience"],
  },
  {
    id: "page-home",
    topic: ["home page", "homepage", "landing page", "front page"],
    hints: ["home", "start", "hero", "first", "main", "overview"],
    chip: "What is on the home page?",
    answer:
      "The home page is the starting point: a hero with the company tagline, the three products with their current status, the areas of work (custom software, web applications, data science, AI integration, process digitisation, consulting), and a founder section. From there you can go straight to any product page, the services page, the work page or the contact page.",
    link: { label: "Home page", href: ROUTES.home },
    followUps: ["products-overview", "navigation-help", "founder"],
  },
  {
    id: "site-experience",
    topic: [
      "dark mode",
      "light mode",
      "theme",
      "theme toggle",
      "colour scheme",
      "color scheme",
      "night mode",
    ],
    hints: ["switch", "toggle", "site", "website", "look", "change", "background", "mobile", "phone"],
    chip: "Does the site have a dark mode?",
    answer:
      "Yes. The theme toggle in the header switches between light and dark, and the choice is remembered in your browser. The layout is responsive, so pages work on phones, tablets and desktops. There is no site-wide search box — the assistant is the fastest way to jump to a section, or use the top menu. The chat panel is deliberately kept dark and readable in either theme.",
    followUps: ["navigation-help", "assistant-meta"],
  },
  {
    id: "assistant-meta",
    topic: ["bot", "chatbot", "assistant", "mascot", "robot", "are you human"],
    hints: ["what can you do", "help", "real", "person", "know", "answer"],
    chip: "What can this assistant do?",
    answer:
      "I am the BloomCore site assistant — a knowledge base about this website, not a person. I can explain the company, every page and where to find it, all three products and their current status, capabilities, limits and access links, services and how work is scoped, the founder and their data projects, and contact and privacy details. If something is outside what I know, I will say so and point you to the contact page, where a human replies.",
    followUps: ["navigation-help", "products-overview", "contact-details"],
  },

  // ── Products in general ─────────────────────────────────────────────────
  {
    id: "web-platform",
    topic: [
      "mobile app",
      "mobile",
      "phone app",
      "ios",
      "android",
      "native app",
      "offline",
      "browser",
      "responsive",
      "tablet",
      "desktop",
      "device",
    ],
    hints: ["mobile", "phone", "tablet", "desktop", "work", "run", "application", "install", "download", "works"],
    chip: "Does BloomCore have a mobile app?",
    answer:
      "BloomCore's products are web applications that run in a browser — there is no native iOS or Android app to install, and nothing is downloaded from this site. SchemeKnit and MaaCash each live at their own address and open in a new tab from their product pages; TillProof is not released. The website itself is responsive and works on phones, tablets and desktops.",
    link: { label: "See all products", href: ROUTES.products },
    followUps: ["schemeknit-access", "maacash-access", "site-experience"],
  },
  {
    id: "accounts-login",
    topic: ["login", "sign in", "signin", "log in", "accounts", "password", "register"],
    hints: ["create", "open", "product", "app", "site", "website", "credentials", "reset", "account"],
    chip: "Is there a login for this site?",
    answer:
      "No — this website has no accounts and no login. It only describes the company and its products. Accounts are created inside each product application: SchemeKnit and MaaCash have their own sign-up at their addresses, and TillProof has no public application yet. Nothing on this site collects or stores a password.",
    link: { label: "See all products", href: ROUTES.products },
    followUps: ["web-platform", "schemeknit-access", "maacash-access"],
  },
  {
    id: "products-overview",
    topic: ["product", "products", "catalogue", "portfolio", "offerings", "product directory"],
    hints: ["what", "have", "build", "list", "show", "available", "three", "compare", "difference"],
    chip: "What products do you have?",
    answer:
      "There are three products. SchemeKnit (available) turns curriculum schemes of learning into structured, indicator-focused lesson plans for teachers. MaaCash (available) is an administration platform for organisations running across several locations, covering staff, roles, mobile money and susu collection workflows. TillProof (in development) is retail management for electrical shops, aimed at stock traceability, controlled pricing and cash accountability. The Products page lists all three with status and links to each detail page.",
    link: { label: "See all products", href: ROUTES.products },
    followUps: ["schemeknit-overview", "maacash-overview", "tillproof-overview"],
  },

  // ── SchemeKnit ──────────────────────────────────────────────────────────
  {
    id: "schemeknit-overview",
    topic: ["schemeknit", "scheme knit", "scheme of learning", "schemes of learning"],
    hints: ["lesson", "lessons", "curriculum", "teacher", "teachers", "school", "plan", "planning", "education", "what", "tell", "about", "available"],
    chip: "Tell me about SchemeKnit",
    answer:
      "SchemeKnit is BloomCore's lesson-planning platform for teachers, listed as available and in use. A teacher uploads a scheme of learning as a document; the platform extracts the weeks, strands, content standards and indicators for review, generates lesson plans around each indicator, and lets the teacher edit any lesson and export the plan for printing, offline use or submission. It is a web application opened from its product page, and it is a planning tool only — it does not record attendance, assessment results or school administration records.",
    link: { label: "SchemeKnit product page", href: ROUTES.productsSchemeKnit },
    followUps: ["schemeknit-features", "schemeknit-audience", "schemeknit-credits", "schemeknit-access"],
  },
  {
    id: "schemeknit-features",
    topic: ["schemeknit", "scheme knit", "scheme of learning"],
    hints: [
      "feature", "features", "capability", "capabilities", "upload", "export", "edit", "editing",
      "generate", "generation", "indicator", "indicators", "review", "extract", "document",
      "printing", "does", "work", "how",
    ],
    chip: "What can SchemeKnit do?",
    answer:
      "SchemeKnit covers the full planning loop: upload a scheme of learning as a document and extract its weeks, strands, content standards and indicators; review the extracted content before it is used; generate lesson plans around each learning indicator; open and edit any generated lesson, with saved edits persisting; export lessons and plans for printing, offline use or submission; and manage credits, since plans are produced against a credit balance with top-up packages available.",
    link: { label: "SchemeKnit product page", href: ROUTES.productsSchemeKnit },
    followUps: ["schemeknit-overview", "schemeknit-limits", "schemeknit-credits"],
  },
  {
    id: "schemeknit-audience",
    topic: ["schemeknit", "scheme knit", "schemeknit for"],
    hints: [
      "who", "for", "audience", "users", "teacher", "teachers", "subject", "lead", "leads",
      "administrator", "administrators", "school", "schools", "head", "heads", "used by",
    ],
    chip: "Who is SchemeKnit for?",
    answer:
      "Three groups: classroom teachers who plan from a national or school scheme of learning and need plans that follow the stated indicators; subject leads who check that planning across a subject is consistent, complete and aligned to the scheme before it is used; and school administrators (heads included) who need evidence that planning has been done without asking teachers to duplicate paperwork.",
    link: { label: "SchemeKnit product page", href: ROUTES.productsSchemeKnit },
    followUps: ["schemeknit-features", "schemeknit-limits"],
  },
  {
    id: "schemeknit-limits",
    topic: ["schemeknit", "scheme knit"],
    hints: [
      "limit", "limits", "limitation", "attendance", "assessment", "results", "records",
      "accreditation", "approved", "curriculum approval", "endorsement", "replace", "claim",
      "not", "does not", "statistics", "customers",
    ],
    chip: "What does SchemeKnit not do?",
    answer:
      "SchemeKnit is a planning tool. It does not record attendance, assessment results or school administration records, and generated plans are not a replacement for a teacher's professional judgement — every plan is editable and meant to be reviewed. The company publishes no customer or school names, subscription figures or usage statistics, and claims no curriculum approval, accreditation or endorsement by any education authority.",
    link: { label: "SchemeKnit product page", href: ROUTES.productsSchemeKnit },
    followUps: ["schemeknit-features", "schemeknit-overview"],
  },
  {
    id: "schemeknit-credits",
    topic: ["schemeknit", "scheme knit"],
    hints: [
      "credit", "credits", "package", "packages", "price", "pricing", "cost", "pay", "payment",
      "subscription", "allowance", "free", "trial", "how much", "much",
    ],
    chip: "How much does SchemeKnit cost?",
    answer:
      "SchemeKnit runs on credits: lesson plans are produced against a credit balance, with an initial allowance and packages available for teachers who need more. No full price list is published on this site — the current packages and prices are shown inside the app and on the SchemeKnit product page. Nothing is paid on this website; sign-up and top-ups happen in the application itself.",
    link: SCHEMEKNIT_APP,
    followUps: ["schemeknit-access", "schemeknit-features"],
  },
  {
    id: "schemeknit-access",
    topic: ["schemeknit", "scheme knit"],
    hints: [
      "access", "open", "start", "use", "try", "app", "application", "website", "login", "sign up",
      "signup", "link", "where", "demo",
    ],
    chip: "How do I open SchemeKnit?",
    answer:
      "SchemeKnit is a live web application at " +
      PRODUCT_LINKS.schemeknit +
      ". Open it with the button below, or from the 'Visit SchemeKnit' button on its product page — both open in a new tab. Accounts are created inside the app; no page on this site collects payment.",
    link: SCHEMEKNIT_APP,
    followUps: ["schemeknit-credits", "schemeknit-features"],
  },

  // ── MaaCash ───────────────────────────────────────────────────────
  {
    id: "maacash-overview",
    topic: ["maacash", "maa cash"],
    hints: [
      "multi-location", "multilocation", "location", "locations", "branch", "branches",
      "susu", "collector", "collectors", "staff", "organisation", "organization", "business",
      "administer", "administration", "platform", "what", "tell", "about", "available",
    ],
    chip: "Tell me about MaaCash",
    answer:
      "MaaCash is an administration platform for organisations that operate across more than one location, listed as available and in use. Locations are configured as distinct units under one organisation, staff accounts are assigned to a location, and access follows the role rather than the request. It also records mobile-money transactions and susu collection rounds so a collector's day can be reconciled. It is a web application opened from its product page.",
    link: { label: "MaaCash product page", href: ROUTES.productsMaacash },
    followUps: ["maacash-features", "maacash-audience", "maacash-limits", "maacash-access"],
  },
  {
    id: "maacash-features",
    topic: ["maacash", "maa cash", "susu"],
    hints: [
      "feature", "features", "capability", "capabilities", "role", "roles", "access", "momo",
      "mobile money", "collection", "collections", "oversight", "reconcile", "reconciliation",
      "report", "reports", "does", "work", "how", "susu",
    ],
    chip: "What can MaaCash do?",
    answer:
      "Its capability set: multi-location administration with each location kept as its own operational unit; staff and user management, with accounts assigned to a location and kept current; role-based access control for administrative, manager, collector and staff scopes; administrative oversight across locations without exported files; mobile-money transactions recorded against the customer, collector and location; and susu collection workflows tracking rounds, customer balances and payments for end-of-day reconciliation.",
    link: { label: "MaaCash product page", href: ROUTES.productsMaacash },
    followUps: ["maacash-overview", "maacash-audience", "maacash-limits"],
  },
  {
    id: "maacash-audience",
    topic: ["maacash", "maa cash"],
    hints: [
      "who", "for", "audience", "users", "owner", "owners", "administrator", "administrators",
      "manager", "managers", "collector", "collectors", "operations", "staff", "roles", "used by",
    ],
    chip: "Who is MaaCash for?",
    answer:
      "Four roles. Owners and administrators need a consistent view across locations and control over who sees what. Location managers are accountable for one branch, its staff and daily records, without access to unrelated locations. Collectors need their assigned customers and collection records in a form they can act on during the day. Operations staff record mobile-money and collection activity and need those records to reconcile without duplicate entry.",
    link: { label: "MaaCash product page", href: ROUTES.productsMaacash },
    followUps: ["maacash-features", "maacash-limits"],
  },
  {
    id: "maacash-limits",
    topic: ["maacash", "maa cash", "susu"],
    hints: [
      "bank", "banking", "funds", "deposit", "deposits", "hold", "held", "money", "safe",
      "licensed", "licence", "license", "institution", "custody", "integration", "provider",
      "deployment", "claim", "does not",
    ],
    chip: "Is MaaCash a bank?",
    answer:
      "No. MaaCash records and administers operations; it is not a bank or a licensed deposit-taking institution and does not hold customer funds. The company does not claim integration with a specific mobile-money provider beyond what is implemented and configured for a deployment, does not publish customer names, transaction volumes, collection totals or branch counts, and notes that feature availability depends on the deployment.",
    link: { label: "MaaCash product page", href: ROUTES.productsMaacash },
    followUps: ["maacash-features", "maacash-access"],
  },
  {
    id: "maacash-access",
    topic: ["maacash", "maa cash"],
    hints: [
      "access", "open", "start", "use", "try", "app", "application", "login", "sign up", "signup",
      "link", "where", "demo", "deployment", "deploy", "organisation", "organization",
    ],
    chip: "How do I open MaaCash?",
    answer:
      "MaaCash is a live web application at " +
      PRODUCT_LINKS.maacash +
      ". Open it with the button below or from the 'Visit MaaCash' button on its product page; both open in a new tab. For a deployment configured for your own organisation, send a short description of what you run through the contact page.",
    link: MAACASH_APP,
    followUps: ["maacash-features", "contact-details", "services-process"],
  },

  // ── TillProof ───────────────────────────────────────────────────────────
  {
    id: "tillproof-overview",
    topic: ["tillproof", "till proof"],
    hints: [
      "what", "tell", "about", "retail", "shop", "shops", "electrical", "retailer", "retailers",
      "inventory", "stock", "pos", "point of sale", "product", "status", "development",
    ],
    chip: "Tell me about TillProof",
    answer:
      "TillProof is retail management for electrical shops, currently in development and not released. It is being built so an owner who cannot stand in every shop can still see the stock that is actually there, control prices from one place, and make cash accountable at the end of a shift. It is not available for public use and there is no application to open on this site yet.",
    link: { label: "TillProof product page", href: ROUTES.productsTillProof },
    followUps: ["tillproof-features", "tillproof-release"],
  },
  {
    id: "tillproof-features",
    topic: ["tillproof", "till proof"],
    hints: [
      "feature", "features", "capability", "capabilities", "stock", "inventory", "traceability",
      "receiving", "transfer", "sale", "price", "pricing", "cash", "till", "audit", "trail",
      "accountability", "what", "will", "do",
    ],
    chip: "What will TillProof do?",
    answer:
      "Three intended capabilities, described as the problems the product is being built to solve: seeing the stock that is actually there — products recorded once and tracked through receiving, transfer and sale, with quantity changes attributed to a person and a time; controlling prices from one place, with price changes recorded so an owner can see who changed what and when; and making cash accountable, with cash handling recorded against the person responsible and a reconcilable trail at the end of a shift.",
    link: { label: "TillProof product page", href: ROUTES.productsTillProof },
    followUps: ["tillproof-overview", "tillproof-release"],
  },
  {
    id: "tillproof-release",
    topic: ["tillproof", "till proof"],
    hints: [
      "release", "released", "launch", "when", "date", "available", "availability", "buy",
      "download", "use", "try", "ready", "wait", "waitlist", "updates", "status", "demo", "trial",
    ],
    chip: "When does TillProof launch?",
    answer:
      "No release date has been announced, and TillProof is not available for public use — there is no application to open yet. The company will publish the application on the TillProof page when it is ready and is not announcing a date before the work is complete. For updates or to discuss it, use the contact page or email.",
    link: { label: "TillProof product page", href: ROUTES.productsTillProof },
    followUps: ["tillproof-features", "contact-details"],
  },

  // ── Founder & independent projects ──────────────────────────────────────
  {
    id: "founder",
    topic: ["founder", "saviour", "amegayie", "ceo", "owner", "founded", "runs the company"],
    hints: ["who", "person", "people", "team", "behind", "tell", "profile", "background"],
    chip: "Who founded BloomCore?",
    answer:
      "Saviour Amegayie founded BloomCore Technologies. He is a data scientist, IT educator, software developer and AI enthusiast — seven years teaching with the Ghana Education Service, two years of applied data science and three years of full-stack development. He graduated as Overall Best Graduating Student of TechCrush Data Science Cohort 5 with 94.7%. The Founder page carries the full profile and links to his public GitHub and LinkedIn accounts.",
    link: { label: "Founder page", href: ROUTES.founder },
    followUps: ["founder-background", "founder-projects", "platform-overview"],
  },
  {
    id: "founder-background",
    topic: ["saviour", "amegayie", "techcrush", "founder background", "his background"],
    hints: [
      "background", "experience", "qualification", "qualifications", "study", "studied",
      "education", "years", "ges", "ghana education service", "data science", "graduating",
      "best", "tools", "skills", "stack", "python", "sql", "react",
    ],
    chip: "What is the founder's background?",
    answer:
      "Seven years of classroom practice with the Ghana Education Service, including digital learning support and staff mentoring; two years of applied data science; and three years of full-stack development. Recognition: Overall Best Graduating Student, TechCrush Data Science Cohort 5, with a score of 94.7%. Working tools include Python, SQL, TypeScript, React, Next.js, FastAPI, scikit-learn, Power BI and Git. No CV file is published — one can be requested by email.",
    link: { label: "Founder page", href: ROUTES.founder },
    followUps: ["founder", "founder-projects"],
  },
  {
    id: "founder-projects",
    topic: ["project", "projects", "portfolio", "streamlit", "independent", "analytics"],
    hints: [
      "data", "harvest", "edupulse", "bece", "predictor", "resource", "analyser", "agricultural",
      "crop", "yield", "analysis", "view projects", "click",
    ],
    chip: "What are the independent data projects?",
    answer:
      "Outside the product catalogue, the founder's independent analytical work includes the Harvest Intelligence Engine (forecasting crop yield from rainfall, temperature and pesticide records), the EduPulse BECE Results Analyser (subject-level exam performance reporting to target intervention) and the Ghana Education Resource Predictor (regional teacher-staffing and resource gaps). All three are interactive on the Streamlit portfolio, opened by the 'Click to view projects' button on the Founder page. No performance figures are claimed on the site.",
    link: { label: "Open the Streamlit portfolio", href: STREAMLIT_PORTFOLIO_URL, external: true },
    followUps: ["founder", "page-work"],
  },

  // ── Services ────────────────────────────────────────────────────────────
  {
    id: "services-overview",
    topic: ["service", "services", "consulting", "consultancy", "hire", "freelance", "agency"],
    hints: ["what", "do", "offer", "build", "custom", "software", "work", "with", "you", "seven"],
    chip: "What services do you offer?",
    answer:
      "Seven areas of work: custom software development, web application development, business process digitisation, data science and analytics, AI integration and intelligent automation, API development and system integration, and technology consulting. Each service starts from a problem the organisation can describe — and if the problem is better solved without custom software, the company says so. The Services page pairs each area with the problem, what is done, and what changes.",
    link: { label: "Services page", href: ROUTES.services },
    followUps: ["services-process", "services-pricing", "custom-work"],
  },
  {
    id: "services-process",
    topic: ["process", "engagement", "stages", "steps", "kickoff", "onboarding", "how you work"],
    hints: ["how", "work", "project", "services", "start", "begin", "first", "need", "stages", "quote"],
    chip: "How does an engagement run?",
    answer:
      "Four stages, each with something you keep: a conversation where you describe the problem in your own terms, including the workarounds; a written scope stating what the first version will and will not do and what evidence will show it worked; the build in small, reviewable stages so a wrong direction is corrected early; then release and handover, with documentation, a demonstration and maintenance terms agreed in writing. To start, bring a named problem, access to the people doing the work, a decision maker and honest constraints.",
    link: { label: "Services page", href: ROUTES.services },
    followUps: ["services-pricing", "custom-work", "contact-details"],
  },
  {
    id: "services-pricing",
    topic: ["price", "pricing", "cost", "costs", "rates", "charge", "charges", "fees", "budget", "expensive", "quotation", "quote"],
    hints: ["how much", "services", "software", "project", "build", "website", "app", "rate card"],
    chip: "How much does a project cost?",
    answer:
      "There is no published rate card — a figure quoted without knowing the work would be a guess. Pricing depends on scope. Send a description of the problem by email (the contact page fills in a subject line for you) and you will get a direct answer about whether it is a fit and what it would take. The services page also lists what the company will not promise, such as integrations it has not tested.",
    link: { label: "Contact page", href: ROUTES.contact },
    followUps: ["services-process", "contact-details"],
  },
  {
    id: "custom-work",
    topic: [
      "custom",
      "custom software",
      "bespoke",
      "website",
      "web app",
      "web application",
      "web development",
      "build me",
      "build for me",
      "my business",
      "my school",
      "my organisation",
      "my organization",
    ],
    hints: ["build", "create", "develop", "app", "application", "software", "need", "want", "help", "school", "business", "ngo", "institution"],
    chip: "Can you build something for my business?",
    answer:
      "Yes — custom software and web applications are core to what BloomCore does, along with data work, AI integration, process digitisation, API work and consulting. The first step is a short message describing what the workflow does today, who it affects and any deadline. If the problem is better solved without custom software, the company will say so rather than sell a build.",
    link: { label: "Describe your project", href: ROUTES.contact },
    followUps: ["services-overview", "services-process", "services-pricing"],
  },

  // ── Pages, contact, privacy, work ───────────────────────────────────────
  {
    id: "page-work",
    topic: ["work page", "selected work", "what have you built", "case studies", "previous work", "past work"],
    hints: ["work", "built", "builds", "examples", "see", "show", "made", "done", "projects"],
    chip: "What have you built?",
    answer:
      "The Work page lists the three products with the operating problem each addresses and what was built: SchemeKnit for the repetition between a scheme of learning and lesson plans, MaaCash for multi-location staff, money and collection records, and TillProof (in development) for electrical retailers who cannot see stock, prices and cash across shops. It publishes no invented case studies, client logos or outcome figures, and labels each product's status plainly.",
    link: { label: "Work page", href: ROUTES.work },
    followUps: ["products-overview", "founder-projects"],
  },
  {
    id: "contact-details",
    topic: ["contact", "email", "phone", "call", "whatsapp", "reach", "talk", "speak", "phone number", "address"],
    hints: ["how", "get in touch", "details", "office", "where", "number", "location", "akatsi", "visit"],
    chip: "How do I contact BloomCore?",
    answer: `Email ${CONTACT.email}, WhatsApp or call ${CONTACT.phoneCallsWhatsapp}, or call ${CONTACT.phoneCallsOnly} (calls only). The registered business address is ${CONTACT.address}. Contact is also available through the form on the contact page, which prepares an email in your own mail app. Registered under the Registration of Business Names Act, 1962 (No. 151) as ${CONTACT.registration}.`,
    link: { label: "Contact page", href: ROUTES.contact },
    followUps: ["contact-form", "services-pricing", "socials"],
  },
  {
    id: "contact-form",
    topic: ["form", "enquiry form", "inquiry form", "message form", "send a message"],
    hints: ["fill", "submit", "send", "write", "contact", "email", "confirmation", "stored"],
    chip: "How does the contact form work?",
    answer:
      "The form on the contact page does not submit to this website — it composes a message in your own email application with the subject line already filled in. Nothing is stored on the site and there is no automated confirmation; replies come from the company's email address. A short, specific message gets a more useful reply: include what the workflow does today, who it affects and any deadline.",
    link: { label: "Contact page", href: ROUTES.contact },
    followUps: ["contact-details", "privacy"],
  },
  {
    id: "socials",
    topic: ["github", "linkedin", "social", "profile", "profiles", "public profiles"],
    hints: ["follow", "code", "professional", "connect", "network", "accounts", "verify"],
    chip: "Where are the social profiles?",
    answer:
      "Two public profiles are linked from this site: GitHub (github.com/Delkay-byte) and LinkedIn (linkedin.com/in/saviour-amegayie-ds). Both appear on the Founder and Contact pages. Any other account claiming to represent BloomCore Technologies should be treated as unverified.",
    link: { label: "GitHub", href: "https://github.com/Delkay-byte", external: true },
    followUps: ["founder", "contact-details"],
  },
  {
    id: "privacy",
    topic: ["privacy", "cookies", "personal data", "privacy policy", "data protection", "gdpr", "act 843"],
    hints: ["data", "collect", "collection", "information", "protect", "protection", "policy", "rights", "retention", "notice"],
    chip: "What is the privacy policy?",
    answer:
      "The privacy notice at /privacy explains that this website has no user accounts and no advertising tracker. Optional analytics uses Google Tag Manager and Google Analytics 4 and loads only if you choose Allow analytics; you can change or withdraw that choice through Analytics settings in the footer. The site's analytics code sends page and product labels, not form contents or contact details. Hosting processes standard technical request data. Information you email or WhatsApp is used to answer the enquiry and is not added to a marketing list or sold. It also covers retention, who else sees data, and your rights under Ghana's Data Protection Act, 2012 (Act 843), with requests sent to the company email address.",
    link: { label: "Privacy page", href: ROUTES.privacy },
    followUps: ["contact-details", "contact-form"],
  },
  {
    id: "careers",
    topic: ["jobs", "job", "vacancy", "vacancies", "careers", "career", "internship", "intern", "hiring", "employment", "work for you"],
    hints: ["apply", "opening", "openings", "position", "positions", "join", "team", "recruit"],
    chip: "Are there any jobs or internships?",
    answer:
      "There are no vacancies or internships published on this site, and the company does not list open roles anywhere else. Speculative enquiries are still read: send a short email describing what you do and what you would like to work on, and you will get a direct reply. A CV can be requested from the same address.",
    link: { label: "Contact page", href: ROUTES.contact },
    followUps: ["contact-details", "platform-overview"],
  },
];

// ── Matching engine ───────────────────────────────────────────────────────

/** Question-shaped words that shouldn't dominate the score on their own. */
const INTENT_TERMS = new Set([
  "where", "find", "page", "pages", "menu", "navigate", "navigation", "sitemap", "lost", "go",
  "look", "located", "section", "help", "what", "who", "how", "why", "when", "tell", "about",
  "please", "do", "does", "did", "can", "could", "should", "would", "will", "is", "are",
  "was", "were", "have", "has", "had",
]);

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "can", "could", "would",
  "should", "i", "you", "we", "they", "it", "to", "of", "in", "on", "for", "with", "and", "or",
  "me", "my", "your", "this", "that", "these", "those", "there", "here", "please", "tell",
  "know", "want", "like", "what", "how", "who", "when", "which", "be", "been", "am", "will",
  "just", "some", "any", "more", "get", "got", "has", "have", "had", "at", "by", "from",
  "so", "if", "then", "than", "also", "very", "much", "many", "site", "website", "page",
]);

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]s\b/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const IRREGULAR_PLURALS = new Map<string, string>([
  ["does", "do"],
  ["goes", "go"],
  ["has", "have"],
  ["is", "be"],
  ["are", "be"],
  ["was", "be"],
  ["were", "be"],
]);

function singular(token: string): string {
  const irregular = IRREGULAR_PLURALS.get(token);
  if (irregular) return irregular;
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && /(ches|shes|sses|xes|zes|ses)$/.test(token)) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

/** Tokens for term matching (stopwords kept so topics like "about" can match). */
function tokensOf(text: string): string[] {
  return normalise(text)
    .split(" ")
    .map(singular)
    .filter((token) => token.length > 1);
}

function hasTerm(input: string, tokens: string[], term: string): boolean {
  if (term.includes(" ")) return ` ${input} `.includes(` ${term} `);
  return tokens.some((token) => tokenMatches(token, term));
}

function tokenMatches(token: string, term: string): boolean {
  if (token === term) return true;
  // Only allow prefix matches once both sides are long enough to be meaningful —
  // otherwise "what" would match "whatsapp" and "till" would match "tillproof".
  if (Math.min(token.length, term.length) < 5) return false;
  return term.startsWith(token) || token.startsWith(term);
}

/**
 * How often each term appears across entries. Rare terms are more meaningful,
 * so "tillproof" counts for more than "product".
 */
const termDocumentFrequency = (() => {
  const frequency = new Map<string, number>();
  for (const entry of kbEntries) {
    for (const term of new Set([...entry.topic, ...entry.hints])) {
      frequency.set(term, (frequency.get(term) ?? 0) + 1);
    }
  }
  return frequency;
})();

const ENTRY_COUNT = kbEntries.length;

function termWeight(term: string, kind: "topic" | "hint"): number {
  const frequency = termDocumentFrequency.get(term) ?? 1;
  const rarity = 1 + 0.4 * Math.log(ENTRY_COUNT / frequency);
  const base = kind === "topic" ? 2.2 : 1.1;
  const phrase = term.includes(" ") ? 1.9 : 1;
  // Intent/function words are weak evidence as hints, but a topic like "about"
  // is still an anchor and must be able to win on its own.
  const intent = INTENT_TERMS.has(term) ? (kind === "topic" ? 0.75 : 0.35) : 1;
  return base * phrase * intent * rarity;
}

/** Each entry's chip is the natural phrasing of its own question. */
const chipTokensById = new Map<string, string[]>(
  kbEntries.map((entry) => [entry.id, tokensOf(entry.chip)]),
);

function chipWeight(entry: KBEntry, tokens: string[]): number {
  const chipTokens = chipTokensById.get(entry.id) ?? [];
  if (chipTokens.length === 0) return 0;
  const matched = chipTokens.filter((chipToken) =>
    tokens.some((token) => tokenMatches(token, chipToken)),
  ).length;
  const ratio = matched / chipTokens.length;
  return ratio >= 0.6 ? ratio * 3.2 : 0;
}

const MIN_SCORE = 2.6;

const GREETING_RE = /^(hi|hii+|hello+|hey+|yo|good\s*(morning|afternoon|evening)|howdy|hiya|hello there|good day)\b/;
const THANKS_RE = /\b(thanks|thank you|thx|appreciated|appreciate it|great|perfect|nice one|well done|good job)\b/;
const BYE_RE = /\b(bye|goodbye|see you|later|cheers)\b/;

export type AssistantReply = {
  text: string;
  link?: AssistantLink;
  entryId: string | null;
  followUps: KBEntry[];
};

const fallback: AssistantReply = {
  text: "That one is outside what I know. I can answer questions about this site and where to find each page, the three products (SchemeKnit, MaaCash, TillProof), the services, the founder and their data projects, contact details and privacy. Or reach a human directly — replies usually come the same day.",
  link: { label: "Contact page", href: ROUTES.contact },
  entryId: null,
  followUps: [getEntry("navigation-help"), getEntry("products-overview"), getEntry("contact-details")],
};

export function getEntry(id: string): KBEntry {
  const entry = kbEntries.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`Unknown KB entry: ${id}`);
  return entry;
}

export const defaultChips = [
  "products-overview",
  "schemeknit-overview",
  "maacash-overview",
  "tillproof-overview",
  "navigation-help",
  "contact-details",
];

type ScoredEntry = { entry: KBEntry; score: number; topicHits: number };

/** Best-effort suggestions when nothing scored strongly enough. */
function suggestedReply(ranked: ScoredEntry[]): AssistantReply {
  const suggestions = ranked
    .filter((candidate) => candidate.score > 1.2)
    .slice(0, 3)
    .map((candidate) => candidate.entry);

  if (suggestions.length === 0) return fallback;

  return {
    text: "I'm not certain I understood that one, but these are the closest things I know about. Pick one below, or ask about any page, product, service, the founder, contact details or privacy.",
    entryId: null,
    followUps: suggestions,
  };
}

/** Score a question against the knowledge base and return the best answer. */
export function answerQuestion(rawInput: string): AssistantReply {
  const input = normalise(rawInput);
  if (!input) return fallback;

  const wordCount = input.split(" ").length;

  if (GREETING_RE.test(input) && wordCount <= 4) {
    return {
      text: `Hello! I'm the ${BRAND.name} assistant. Ask me about any page on this site, the three products, services, the founder, contact details — or where to find something.`,
      entryId: null,
      followUps: defaultChips.map((id) => getEntry(id)),
    };
  }
  if (THANKS_RE.test(input) && wordCount <= 5) {
    return {
      text: "You're welcome! If you need anything else — a page, a product, pricing or contact details — just ask.",
      entryId: null,
      followUps: defaultChips.map((id) => getEntry(id)),
    };
  }
  if (BYE_RE.test(input) && wordCount <= 4) {
    return {
      text: "Goodbye! The contact page is always there if you need a human. Have a good one.",
      entryId: null,
      followUps: [],
    };
  }

  const tokens = tokensOf(input);
  const ranked: ScoredEntry[] = [];

  for (const entry of kbEntries) {
    let topicHits = 0;
    let score = 0;

    for (const term of entry.topic) {
      if (hasTerm(input, tokens, term)) {
        topicHits += 1;
        score += termWeight(term, "topic");
      }
    }
    if (entry.topic.length > 0 && topicHits === 0) continue;

    for (const hint of entry.hints) {
      if (hasTerm(input, tokens, hint)) score += termWeight(hint, "hint");
    }

    // A question phrased like the entry's own chip is the clearest signal of all.
    score += chipWeight(entry, tokens);

    // Extra anchoring evidence beats a single lucky keyword.
    score += Math.max(0, topicHits - 1) * 0.8;

    // A question that mentions several of the entry's own words is a strong signal.
    const contentTokens = tokens.filter(
      (token) => !STOPWORDS.has(token) && !INTENT_TERMS.has(token),
    );
    if (contentTokens.length > 0) {
      const matched = contentTokens.filter((token) =>
        [...entry.topic, ...entry.hints].some((term) => hasTerm(input, [token], term)),
      ).length;
      score += (matched / contentTokens.length) * 1.4;
    }

    ranked.push({ entry, score, topicHits });
  }

  ranked.sort((a, b) => b.score - a.score);
  const best = ranked[0];

  if (!best || best.score < MIN_SCORE) return suggestedReply(ranked);

  const { entry } = best;
  return {
    text: entry.answer,
    link: entry.link,
    entryId: entry.id,
    followUps: (entry.followUps ?? []).map((id) => getEntry(id)),
  };
}
