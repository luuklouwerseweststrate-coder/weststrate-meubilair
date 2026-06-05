import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import {
  getProducten,
  getProjecten,
  getPosts,
  getSubcategorieSlugs,
  getBrancheSlugs,
} from "@/lib/data";

// Dynamische sitemap op /sitemap.xml. Combineert de vaste pagina's met alle
// producten, projecten, blogartikelen, branches en catalogus-categorieën,
// zodat Google de hele site kan crawlen.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nu = new Date();

  const [producten, projecten, posts, subSlugs] = await Promise.all([
    getProducten(),
    getProjecten(),
    getPosts(),
    getSubcategorieSlugs(),
  ]);

  // Vaste pagina's met een grove prioriteit (home > overzichten > rest).
  const vast: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: nu, priority: 1.0, changeFrequency: "weekly" },
    { url: `${siteUrl}/catalogus`, lastModified: nu, priority: 0.9, changeFrequency: "weekly" },
    { url: `${siteUrl}/branches`, lastModified: nu, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteUrl}/projecten`, lastModified: nu, priority: 0.8, changeFrequency: "monthly" },
    { url: `${siteUrl}/werkplek`, lastModified: nu, priority: 0.7, changeFrequency: "monthly" },
    { url: `${siteUrl}/blog`, lastModified: nu, priority: 0.6, changeFrequency: "weekly" },
    { url: `${siteUrl}/over`, lastModified: nu, priority: 0.5, changeFrequency: "yearly" },
    { url: `${siteUrl}/contact`, lastModified: nu, priority: 0.5, changeFrequency: "yearly" },
  ];

  const productPaginas: MetadataRoute.Sitemap = producten.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: nu,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categoriePaginas: MetadataRoute.Sitemap = subSlugs.map((s) => ({
    url: `${siteUrl}/catalogus/${s}`,
    lastModified: nu,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const branchePaginas: MetadataRoute.Sitemap = getBrancheSlugs().map((s) => ({
    url: `${siteUrl}/branches/${s}`,
    lastModified: nu,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectPaginas: MetadataRoute.Sitemap = projecten.map((p) => ({
    url: `${siteUrl}/projecten/${p.slug}`,
    lastModified: nu,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const blogPaginas: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: nu,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    ...vast,
    ...categoriePaginas,
    ...branchePaginas,
    ...productPaginas,
    ...projectPaginas,
    ...blogPaginas,
  ];
}
