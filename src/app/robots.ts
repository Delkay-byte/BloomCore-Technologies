import type { MetadataRoute } from "next";
import { SITE_HOST, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/internal", "/api/internal", "/api/enquiries"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_HOST,
  };
}
