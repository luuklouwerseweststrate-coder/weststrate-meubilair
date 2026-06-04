import { client, sanityIngesteld } from "@/sanity/lib/client";
import {
  ALLE_PRODUCTEN,
  PRODUCT_OP_SLUG,
  SITE_SETTINGS,
  ALLE_PROJECTEN,
  PROJECT_OP_SLUG,
  ALLE_POSTS,
  POST_OP_SLUG,
} from "@/sanity/lib/queries";
import {
  MOCK_PRODUCTS,
  MOCK_SETTINGS,
  MOCK_PROJECTS,
  MOCK_POSTS,
} from "./mock-data";
import type {
  Categorie,
  Product,
  SiteSettings,
  Project,
  BlogPost,
} from "./types";

// Data-laag. Zolang Sanity niet gekoppeld is (geen project-ID),
// draait alles op de mock-data uit lib/mock-data.ts. Zodra de
// env-var NEXT_PUBLIC_SANITY_PROJECT_ID gevuld is, komt de data
// uit het CMS. Bij een lege CMS valt het terug op mock-data.

export async function getProducten(): Promise<Product[]> {
  if (!sanityIngesteld) return MOCK_PRODUCTS;
  try {
    const data = await client.fetch<Product[]>(ALLE_PRODUCTEN);
    return data && data.length > 0 ? data : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function getProductenPerCategorie(
  categorie: Categorie
): Promise<Product[]> {
  const alle = await getProducten();
  return alle.filter((p) => p.category === categorie);
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!sanityIngesteld) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const data = await client.fetch<Product | null>(PRODUCT_OP_SLUG, { slug });
    if (data) return data;
  } catch {
    // val terug op mock
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!sanityIngesteld) return MOCK_SETTINGS;
  try {
    const data = await client.fetch<SiteSettings | null>(SITE_SETTINGS);
    return data ?? MOCK_SETTINGS;
  } catch {
    return MOCK_SETTINGS;
  }
}

// ── Projecten ────────────────────────────────────────────────
export async function getProjecten(): Promise<Project[]> {
  if (!sanityIngesteld) return MOCK_PROJECTS;
  try {
    const data = await client.fetch<Project[]>(ALLE_PROJECTEN);
    return data && data.length > 0 ? data : MOCK_PROJECTS;
  } catch {
    return MOCK_PROJECTS;
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!sanityIngesteld) {
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const data = await client.fetch<Project | null>(PROJECT_OP_SLUG, { slug });
    if (data) return data;
  } catch {
    // val terug op mock
  }
  return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
}

// ── Blog ─────────────────────────────────────────────────────
export async function getPosts(): Promise<BlogPost[]> {
  if (!sanityIngesteld) return MOCK_POSTS;
  try {
    const data = await client.fetch<BlogPost[]>(ALLE_POSTS);
    return data && data.length > 0 ? data : MOCK_POSTS;
  } catch {
    return MOCK_POSTS;
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!sanityIngesteld) {
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const data = await client.fetch<BlogPost | null>(POST_OP_SLUG, { slug });
    if (data) return data;
  } catch {
    // val terug op mock
  }
  return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
}
