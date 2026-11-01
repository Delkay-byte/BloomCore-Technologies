import type { Metadata } from "next";
import { ProductPageShell, type ProductDetail } from "@/components/ProductPageShell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "TillProof",
  description:
    "TillProof is in development: retail management for electrical shops, covering stock traceability, controlled pricing and owner oversight across locations.",
  alternates: { canonical: "/products/tillproof" },
  openGraph: {
    title: `TillProof — ${BRAND.name}`,
    url: "/products/tillproof",
    description:
      "In development. Remote owner visibility, controlled pricing, cash accountability and traceable stock for electrical retailers.",
  },
  robots: { index: true, follow: true },
};

const detail: ProductDetail = {
  slug: "tillproof",
  category: "Retail Technology",
  statusLabel: "In development",
  statusTone: "muted",
  lead: "An owner who is not standing in the shop cannot see what left the shelf, at what price, or who handled the cash. TillProof is being built to close that gap for electrical retailers.",
  overview: [
    "Electrical retail carries a particular risk. Stock is high in value, individually identifiable and easy to move between a store, a store room and another branch. When records live in a notebook, a discrepancy is discovered late and cannot be reconstructed.",
    "TillProof is being developed around three questions an owner needs answered: what stock exists, where it is, and what happened to it. Alongside that, price changes and cash handling are recorded against the person who made them.",
    "The product is in active development. Nothing on this page describes a live deployment. The interface shown is a representation prepared for this website, not a screenshot of a running shop.",
  ],
  capabilities: [
    {
      title: "Inventory and stock tracking",
      detail:
        "Products are recorded once and tracked through receiving, transfer and sale, with quantity changes attributed to a person and a time.",
    },
    {
      title: "Multi-shop visibility",
      detail:
        "An owner can see stock position across locations without travelling to each shop or waiting for a compiled report.",
    },
    {
      title: "Product identification",
      detail:
        "Electrical goods are often distinguished by small specification differences. Records carry the attributes needed to identify the right item.",
    },
    {
      title: "Controlled pricing",
      detail:
        "Price changes are recorded rather than improvised at the till, so the owner can see who changed what and when.",
    },
    {
      title: "Cash accountability",
      detail:
        "Cash handling is recorded against the person responsible, giving a reconcilable trail at the end of a shift.",
    },
    {
      title: "Audit records",
      detail:
        "Recorded actions carry an actor and a timestamp, so a discrepancy can be investigated rather than guessed at.",
    },
  ],
  limits: [
    "TillProof is in development and is not available for use. Capabilities described here are the intended direction of the build.",
    "We do not claim a launched deployment, a customer, or a completed rollout for TillProof.",
    "The product name has not been presented here as legally cleared or registered as a trademark.",
    "We do not publish performance figures, accuracy claims or benchmarks for a product that is not yet released.",
  ],
  audience: [
    {
      role: "Owner-operators",
      detail:
        "Owners of electrical and electronics shops who carry responsibility for stock and cash but cannot be present at every location.",
    },
    {
      role: "Shop managers",
      detail:
        "Managers who need a stock record that matches the shelf and a clear process for receiving, transferring and selling goods.",
    },
    {
      role: "Shop attendants",
      detail:
        "Staff recording sales and handing cash, who need a fast, clear process rather than a form that invites workarounds.",
    },
  ],
  meta: [
    { term: "Status", detail: "In development" },
    { term: "Category", detail: "Retail technology" },
    { term: "Primary users", detail: "Owners and shop staff" },
    { term: "Availability", detail: "Not released" },
  ],
};

export default function TillProofPage() {
  return <ProductPageShell detail={detail} />;
}
