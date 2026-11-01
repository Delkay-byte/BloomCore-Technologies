import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { SITE_URL } from "@/lib/site";

const routes = [
  "/",
  "/about",
  "/products",
  "/products/schemeknit",
  "/products/bik-prestige",
  "/products/tillproof",
  "/services",
  "/work",
  "/founder",
  "/contact",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: "2026-11-01",
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route.split("/").length > 2 ? 0.6 : 0.7,
  }));
}
