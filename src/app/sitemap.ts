import type { MetadataRoute } from "next";

const baseUrl = "https://bloomcoretechnologies.com";

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
    url: `${baseUrl}${route}`,
    lastModified: "2026-11-01",
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route.split("/").length > 2 ? 0.6 : 0.7,
  }));
}
