import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// robots.txt wordt door Next automatisch op /robots.txt geserveerd.
// De Sanity Studio (/studio) en API-routes houden we uit de index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
