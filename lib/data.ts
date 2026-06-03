import { client, sanityIngesteld } from "@/sanity/lib/client";
import {
  ALLE_PRODUCTEN,
  PRODUCT_OP_SLUG,
  SITE_SETTINGS,
} from "@/sanity/lib/queries";
import { MOCK_PRODUCTS, MOCK_SETTINGS } from "./mock-data";
import type { Categorie, Product, SiteSettings } from "./types";

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
