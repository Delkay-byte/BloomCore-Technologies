import type { Metadata } from "next";
import { ProductPageShell, type ProductDetail } from "@/components/ProductPageShell";
import { BRAND, PRODUCT_LINKS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "BloomCore One",
  description:
    "BloomCore One supports organisations operating across several locations with staff administration, role-based access, mobile-money operations and susu collection workflows.",
  alternates: { canonical: "/products/bloomcore-one" },
  openGraph: {
    title: `BloomCore One — ${BRAND.name}`,
    url: "/products/bloomcore-one",
    description:
      "Multi-location administration, staff and role management, mobile-money operations and susu collection workflows in one platform.",
  },
};

const detail: ProductDetail = {
  slug: "bloomcore-one",
  category: "Business Operations and Management Software",
  statusLabel: "Available",
  statusTone: "default",
  launch: {
    label: "Visit BloomCore One",
    url: PRODUCT_LINKS.bloomcoreOne,
  },
  lead: "One administration platform for organisations that run across more than one location and need staff, access and money records to agree with each other.",
  overview: [
    "A business with several locations accumulates separate records. Staff are managed in one place, collections in another, and oversight depends on someone compiling a report by hand at the end of the month.",
    "BloomCore One brings those records into one platform with scoped access. Administrators configure the organisation and its locations; managers see their own branch; collectors see the customers assigned to them.",
    "The platform is available and in use. Mobile-money operations and susu collection workflows are part of the supported capability set, described here at the level of process rather than customer detail.",
  ],
  capabilities: [
    {
      title: "Multi-location administration",
      detail:
        "Locations are configured as distinct operational units under one organisation, each with its own staff and records.",
    },
    {
      title: "Staff and user management",
      detail:
        "Staff accounts are created, assigned to a location and kept current, so access matches who still works where.",
    },
    {
      title: "Role-based access control",
      detail:
        "Access follows the role rather than the individual request. Administrative, manager, collector and staff roles each see a defined scope.",
    },
    {
      title: "Administrative oversight",
      detail:
        "Head office retains a view across locations without relying on exported files or verbal reports.",
    },
    {
      title: "Mobile-money operations",
      detail:
        "Mobile-money transactions are recorded against the customer, the collector and the location that handled them.",
    },
    {
      title: "Susu collection workflows",
      detail:
        "Collection rounds, customer balances and payment records are tracked so that a collector's day can be reconciled.",
    },
  ],
  limits: [
    "We do not publish customer names, transaction volumes, collection totals or branch counts.",
    "BloomCore One is not a bank or a licensed deposit-taking institution. It records and administers operations; it does not hold customer funds.",
    "We do not claim integration with a specific mobile-money provider beyond what is implemented and configured for a deployment.",
    "Feature availability depends on the deployment. This page describes the platform, not the configuration of any particular customer.",
  ],
  audience: [
    {
      role: "Owners and administrators",
      detail:
        "People responsible for the whole organisation who need a consistent view across locations and control over who can see what.",
    },
    {
      role: "Location managers",
      detail:
        "Managers accountable for one branch, its staff and its daily records, without access to unrelated locations.",
    },
    {
      role: "Collectors",
      detail:
        "Field staff who need their assigned customers and collection records in a form they can act on during the day.",
    },
    {
      role: "Operations staff",
      detail:
        "Staff who record mobile-money and collection activity and need those records to reconcile without duplicate entry.",
    },
  ],
  meta: [
    { term: "Status", detail: "Available" },
    { term: "Category", detail: "Business operations" },
    { term: "Primary users", detail: "Owners, managers, collectors" },
    { term: "Platform", detail: "Web application" },
  ],
};

export default function BloomCoreOnePage() {
  return <ProductPageShell detail={detail} />;
}
