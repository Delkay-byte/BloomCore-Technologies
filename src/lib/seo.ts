import { BRAND, CONTACT, PRODUCTS, ROUTES, SOCIAL } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export type Crumb = { name: string; href: string };

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: BRAND.name,
    url: SITE_URL,
    description: BRAND.description,
    slogan: BRAND.tagline,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/apple-touch-icon.png`,
      width: 180,
      height: 180,
    },
    email: CONTACT.email,
    telephone: `+233${CONTACT.phoneCallsWhatsapp.slice(1)}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "L7 Olive St., Akast Road",
      addressLocality: "Akatsi",
      addressRegion: "Volta Region",
      addressCountry: "GH",
    },
    sameAs: SOCIAL.filter((item) => item.verified).map((item) => item.href),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT.email,
        telephone: `+233${CONTACT.phoneCallsWhatsapp.slice(1)}`,
        areaServed: "GH",
        availableLanguage: ["en"],
      },
    ],
    knowsAbout: [
      "Custom software development",
      "Web application development",
      "Business process digitisation",
      "Data science and analytics",
      "AI integration",
      "API development and system integration",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: BRAND.name,
    alternateName: "BloomCore",
    url: SITE_URL,
    description: BRAND.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

const applicationCategories: Record<string, string> = {
  schemeknit: "EducationalApplication",
  maacash: "BusinessApplication",
  tillproof: "BusinessApplication",
};

export function softwareApplicationSchema(input: {
  slug: string;
  name: string;
  description: string;
}) {
  const product = PRODUCTS.find((item) => item.slug === input.slug);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    url: `${SITE_URL}/products/${input.slug}`,
    description: input.description,
    applicationCategory: applicationCategories[input.slug] ?? "BusinessApplication",
    applicationSubCategory: product?.category,
    operatingSystem: "Web browser",
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function breadcrumbSchema(items: ReadonlyArray<Crumb>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function faqSchema(faqs: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema(input: {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.published,
    dateModified: input.updated,
    inLanguage: "en",
    mainEntityOfPage: `${SITE_URL}/resources/${input.slug}`,
    image: `${SITE_URL}/og-image.png`,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export const HOME_CRUMB: Crumb = { name: "Home", href: ROUTES.home };
