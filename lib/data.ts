import { client, sanityIngesteld } from "@/sanity/lib/client";
import {
  SITE_SETTINGS,
  ALLE_PROJECTEN,
  PROJECT_OP_SLUG,
  ALLE_POSTS,
  POST_OP_SLUG,
} from "@/sanity/lib/queries";
import { MOCK_SETTINGS, MOCK_PROJECTS, MOCK_POSTS } from "./mock-data";
import { slugify } from "./types";
import type {
  Product,
  SiteSettings,
  Project,
  BlogPost,
  ZoekItem,
} from "./types";
import { subLabel } from "./categorieen";
import { JOHN } from "@/components/Accountmanager";
import catalogus from "@/data/swan-catalogus.json";
import bureaustoelen from "@/data/bureaustoelen-weststrate.json";
import zitStaBureaus from "@/data/zit-sta-bureaus-weststrate.json";

// Data-laag.
//
// Producten komen uit data/swan-catalogus.json — die wordt gevuld door het
// sync-script (scripts/sync-swan.mjs) dat het Swan-snelleverprogramma ophaalt.
// De site raakt de Swan-API zelf nooit aan; alles is statisch en snel.
//
// Projecten, blog en site-instellingen komen nog uit Sanity (met terugval op
// mock-data zolang Sanity niet gekoppeld is).

// De Swan-catalogus (sync-script) plus een handmatig samengestelde set echte
// Weststrate-bureaustoelen (data/bureaustoelen-weststrate.json). Die laatste
// bevat de echte catalogusprijzen excl. btw (omgerekend van de incl.-btw-prijzen
// op weststrate.nl). Wijzigt een prijs op de live site? Pas dan het bijbehorende
// "price"-veld in dat bestand aan.
// De handmatige bureaustoelen staan bewust vóór de Swan-catalogus, zodat de
// 325-serie bovenaan de Bureaustoelen-subcategorie verschijnt. De zit-sta
// bureaus (PRESTO RT + Leitz, data/zit-sta-bureaus-weststrate.json) vormen de
// nieuwe subcategorie "Zit-sta bureaus" onder Werken, met echte artikelnummers
// en prijzen excl. btw (omgerekend van de incl.-btw-prijzen op weststrate.nl).
const ALLE_PRODUCTEN = [
  ...(bureaustoelen as unknown as Product[]),
  ...(zitStaBureaus as unknown as Product[]),
  ...(catalogus as unknown as Product[]),
];

function eersteBeschikbareAfbeelding(product: Product): string {
  return product.image || product.variants.find((v) => v.image)?.image || "";
}

// Laagste variantprijs ("vanaf"), met de basisprijs als terugval.
function vanafPrijs(product: Product): number {
  const prijzen = product.variants.map((v) => v.price).filter((p) => p > 0);
  return prijzen.length > 0 ? Math.min(...prijzen) : product.basePrice;
}

// ── Producten (uit de Swan-catalogus) ────────────────────────
export async function getProducten(): Promise<Product[]> {
  return ALLE_PRODUCTEN;
}

export async function getProduct(slug: string): Promise<Product | null> {
  return ALLE_PRODUCTEN.find((p) => p.slug === slug) ?? null;
}

// ── Categorie-structuur (dynamisch afgeleid) ─────────────────
// Eén subcategorie binnen een hoofdcategorie, met aantal en URL-slug.
export interface SubcategorieInfo {
  sub: string; // bv. "Bureaus"
  slug: string; // bv. "bureaus"
  aantal: number; // aantal productseries
  uitvoeringen: number; // aantal varianten (kleur/formaat-combinaties)
  beeld: string; // representatief productbeeld
}

export interface CategorieGroep {
  hoofd: string; // bv. "Werken"
  subs: SubcategorieInfo[];
}

// Groepeert alle producten per hoofdcategorie -> subcategorieën.
export async function getCategorieStructuur(): Promise<CategorieGroep[]> {
  const groepen = new Map<string, Map<string, SubcategorieInfo>>();

  for (const p of ALLE_PRODUCTEN) {
    if (!groepen.has(p.category)) groepen.set(p.category, new Map());
    const subs = groepen.get(p.category)!;
    const bestaand = subs.get(p.subcategory);
    if (bestaand) {
      bestaand.aantal += 1;
      bestaand.uitvoeringen += p.variants.length;
      if (!bestaand.beeld) bestaand.beeld = eersteBeschikbareAfbeelding(p);
    } else {
      subs.set(p.subcategory, {
        sub: p.subcategory,
        slug: slugify(p.subcategory),
        aantal: 1,
        uitvoeringen: p.variants.length,
        beeld: eersteBeschikbareAfbeelding(p),
      });
    }
  }

  return [...groepen.entries()]
    .map(([hoofd, subs]) => ({
      hoofd,
      subs: [...subs.values()].sort((a, b) => a.sub.localeCompare(b.sub)),
    }))
    .sort((a, b) => a.hoofd.localeCompare(b.hoofd));
}

// Kerncijfers over de catalogus, voor de stats-band op de homepage.
export interface CatalogusStats {
  series: number; // aantal productlijnen
  uitvoeringen: number; // som van alle varianten (kleur/formaat-combinaties)
  categorieen: number; // aantal hoofdcategorieën
  subcategorieen: number; // aantal subcategorieën
}

export async function getCatalogusStats(): Promise<CatalogusStats> {
  const categorieen = new Set<string>();
  const subcategorieen = new Set<string>();
  let uitvoeringen = 0;
  for (const p of ALLE_PRODUCTEN) {
    categorieen.add(p.category);
    subcategorieen.add(p.subcategory);
    uitvoeringen += p.variants.length;
  }
  return {
    series: ALLE_PRODUCTEN.length,
    uitvoeringen,
    categorieen: categorieen.size,
    subcategorieen: subcategorieen.size,
  };
}

// Alle subcategorie-slugs (voor generateStaticParams van /catalogus/[categorie]).
export async function getSubcategorieSlugs(): Promise<string[]> {
  const slugs = new Set<string>();
  for (const p of ALLE_PRODUCTEN) slugs.add(slugify(p.subcategory));
  return [...slugs];
}

// Producten binnen één subcategorie (op slug). Geeft ook de nette naam terug.
export async function getProductenPerSubSlug(
  slug: string
): Promise<{ sub: string; hoofd: string; producten: Product[] }> {
  const producten = ALLE_PRODUCTEN.filter((p) => slugify(p.subcategory) === slug)
    // Meeste uitvoeringen eerst (de "rijkste" producten bovenaan), bij gelijk
    // aantal op naam. Dit is de basisvolgorde; de client toont hem als
    // "Aanbevolen" en laat de bezoeker desgewenst anders sorteren.
    .sort(
      (a, b) =>
        b.variants.length - a.variants.length ||
        a.name.localeCompare(b.name, "nl")
    );
  return {
    sub: producten[0]?.subcategory ?? "",
    hoofd: producten[0]?.category ?? "",
    producten,
  };
}

// ── Globale zoekindex ────────────────────────────────────────
// Bundelt alle doorzoekbare content (producten, categorieën, projecten,
// inspiratie, specialisten en kernpagina's) tot één lichte lijst. Die gaat als
// JSON naar het zoekvenster in de header, waar het filteren client-side gebeurt.
// We nemen bewust geen zware velden mee (geen volledige body's), zodat de
// payload klein blijft.
//
// Statische kernpagina's die we altijd vindbaar willen maken.
const ZOEK_PAGINAS: { titel: string; sub: string; href: string }[] = [
  { titel: "Home", sub: "Startpagina", href: "/" },
  { titel: "Catalogus", sub: "Al het meubilair", href: "/catalogus" },
  { titel: "Projecten", sub: "Uitgevoerd werk", href: "/projecten" },
  { titel: "Inspiratie", sub: "Kennis en artikelen", href: "/blog" },
  { titel: "Over ons", sub: "Wie is Weststrate", href: "/over" },
  { titel: "Contact", sub: "Bereik John direct", href: "/contact" },
  { titel: "Offerte aanvragen", sub: "Stel een selectie samen", href: "/offerte" },
];

export async function getZoekIndex(): Promise<ZoekItem[]> {
  const [projecten, posts, structuur] = await Promise.all([
    getProjecten(),
    getPosts(),
    getCategorieStructuur(),
  ]);

  const items: ZoekItem[] = [];

  // Producten
  for (const p of ALLE_PRODUCTEN) {
    items.push({
      type: "Product",
      titel: p.name,
      sub: `${p.category} · ${p.subcategory}`,
      href: `/product/${p.slug}`,
      beeld: eersteBeschikbareAfbeelding(p),
      prijs: vanafPrijs(p),
      trefwoorden: p.shortDescription,
    });
  }

  // Categorieën (subcategorieën, met hun hoofdcategorie als context)
  for (const groep of structuur) {
    for (const sub of groep.subs) {
      items.push({
        type: "Categorie",
        titel: subLabel(sub.sub),
        sub: `${groep.hoofd} · ${sub.aantal} series`,
        href: `/catalogus/${sub.slug}`,
        beeld: sub.beeld,
      });
    }
  }

  // Projecten
  for (const pr of projecten) {
    items.push({
      type: "Project",
      titel: pr.title,
      sub: [pr.klant, pr.sector].filter(Boolean).join(" · "),
      href: `/projecten/${pr.slug}`,
      beeld: pr.image,
      trefwoorden: `${pr.locatie} ${pr.categorieen.join(" ")} ${pr.intro}`,
    });
  }

  // Inspiratie / blog
  for (const post of posts) {
    items.push({
      type: "Inspiratie",
      titel: post.title,
      sub: post.thema,
      href: `/blog/${post.slug}`,
      beeld: post.image,
      trefwoorden: post.samenvatting,
    });
  }

  // Specialisten
  items.push({
    type: "Specialist",
    titel: JOHN.naam,
    sub: JOHN.rol,
    href: "/contact",
    beeld: JOHN.foto,
    trefwoorden: `${JOHN.email} ${JOHN.telefoonWeergave} accountmanager`,
  });

  // Kernpagina's
  for (const pg of ZOEK_PAGINAS) {
    items.push({ type: "Pagina", titel: pg.titel, sub: pg.sub, href: pg.href });
  }

  return items;
}

// ── Site-instellingen ────────────────────────────────────────
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
