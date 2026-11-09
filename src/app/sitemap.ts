import type { MetadataRoute } from "next";
import { RESOURCES } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

type Entry = {
  path: string;
  lastModified: string;
  changeFrequency: "monthly" | "yearly";
  priority: number;
};

const staticRoutes: ReadonlyArray<Entry> = [
  { path: "/", lastModified: "2026-11-09", changeFrequency: "monthly", priority: 1 },
  { path: "/products", lastModified: "2026-11-09", changeFrequency: "monthly", priority: 0.9 },
  {
    path: "/products/schemeknit",
    lastModified: "2026-11-09",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/products/maacash",
    lastModified: "2026-11-09",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/products/tillproof",
    lastModified: "2026-11-09",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/services", lastModified: "2026-11-09", changeFrequency: "monthly", priority: 0.8 },
  { path: "/resources", lastModified: "2026-11-09", changeFrequency: "monthly", priority: 0.8 },
  { path: "/work", lastModified: "2026-11-09", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", lastModified: "2026-11-01", changeFrequency: "yearly", priority: 0.6 },
  { path: "/founder", lastModified: "2026-11-01", changeFrequency: "yearly", priority: 0.5 },
  { path: "/contact", lastModified: "2026-11-09", changeFrequency: "yearly", priority: 0.7 },
  { path: "/privacy", lastModified: "2026-11-09", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articles: Entry[] = RESOURCES.map((article) => ({
    path: `/resources/${article.slug}`,
    lastModified: article.updated,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articles].map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
