export type StageProduct = {
  slug: "schemeknit" | "maacash" | "tillproof";
  name: string;
  category: string;
  statusLabel: string;
  status: "live" | "development";
  headline: string;
  description: string;
  route: string;
  appUrl?: string;
  panelTitle: string;
  panelMeta: string;
  accent: string;
};

/**
 * Content for the hero product stage. Every string is drawn from
 * src/lib/brand.ts or the product pages. No capability is added here.
 */
export const STAGE_PRODUCTS: ReadonlyArray<StageProduct> = [
  {
    slug: "schemeknit",
    name: "SchemeKnit",
    category: "Education technology",
    statusLabel: "Available",
    status: "live",
    headline: "From scheme to plan.",
    description:
      "Turn a scheme of learning into structured, indicator-focused lesson plans that teachers can review, edit and export.",
    route: "/products/schemeknit",
    appUrl: "https://schemeknit.bloomcoretech.com/",
    panelTitle: "Lesson planning",
    panelMeta: "Basic 7 · Computing",
    accent: "#0a0a0a",
  },
  {
    slug: "maacash",
    name: "MaaCash",
    category: "Business operations",
    statusLabel: "Available",
    status: "live",
    headline: "Every branch, one view.",
    description:
      "Multi-location administration, staff roles, mobile-money operations and susu collection workflows in one workspace.",
    route: "/products/maacash",
    appUrl: "https://maacash.bloomcoretech.com/",
    panelTitle: "Location overview",
    panelMeta: "Organisation administration",
    accent: "#4a4a4a",
  },
  {
    slug: "tillproof",
    name: "TillProof",
    category: "Retail technology",
    statusLabel: "In development",
    status: "development",
    headline: "See the shop without standing in it.",
    description:
      "Retail oversight for electrical shops: remote owner visibility, controlled pricing, accountable cash and traceable stock.",
    route: "/products/tillproof",
    panelTitle: "Stock by location",
    panelMeta: "Owner dashboard",
    accent: "#6e6e6e",
  },
];
