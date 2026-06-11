import type { CategorieGroep } from "./data";

// Centrale categorie-mapping voor de navigatie.
//
// De ruwe categorie-/subcategorienamen komen uit het Swan-snelleverprogramma.
// Die ruwe indeling is werkwoord-gebaseerd (Werken/Zitten/Vergaderen/Opbergen)
// en dat liep niet lekker: zit-sta bureaus stonden los van bureaus, en de
// vergaderstoelen vielen onder "Zitten" i.p.v. bij "Vergaderen". Daarom leggen
// we hier een KLANTGERICHTE indeling op PRODUCTSOORT overheen: we hangen elke
// ruwe subcategorie onder een nieuwe hoofdcategorie (Bureaus, Stoelen, Tafels,
// Kasten & opbergen, Accessoires). De subcategorie-namen en hun URL-slugs
// blijven gelijk, dus alle /catalogus/[slug]-links blijven kloppen — alleen de
// GROEPERING en VOLGORDE veranderen.

// ── Herindeling: ruwe subcategorie → nieuwe hoofdcategorie (productsoort) ──
// data.ts gebruikt deze map om p.category te hermappen voordat de rest van de
// site de structuur opbouwt. Onbekende subcategorieën vallen terug op hun
// originele hoofdcategorie (zie data.ts).
export const SUB_NAAR_HOOFD: Record<string, string> = {
  // Bureaus — zit-sta is óók een bureau, dus onder dezelfde groep
  Bureaus: "Bureaus",
  "Zit-sta bureaus": "Bureaus",
  "Flex dynamisch werken": "Bureaus",
  // Stoelen — alle stoelen bij elkaar, ongeacht de ruimte
  Bureaustoelen: "Stoelen",
  Vergaderstoelen: "Stoelen",
  "Terras- / Kantinestoelen": "Stoelen",
  // Tafels
  Vergadertafels: "Tafels",
  Klaptafels: "Tafels",
  // Kasten & opbergen — inclusief ladenblokken
  Roldeurkasten: "Kasten & opbergen",
  Schuifdeurkasten: "Kasten & opbergen",
  Ladenblokken: "Kasten & opbergen",
  "Persoonlijke lade": "Kasten & opbergen",
  // Accessoires — geen meubels, maar wat een werkplek afmaakt
  Kabelmanagement: "Accessoires",
  Scheidingswanden: "Accessoires",
  Componenten: "Accessoires",
};

// Gewenste volgorde van de (nieuwe) hoofdcategorieën.
export const HOOFD_VOLGORDE = [
  "Bureaus",
  "Stoelen",
  "Tafels",
  "Kasten & opbergen",
  "Accessoires",
];

interface HoofdMeta {
  tagline: string;
  kleur: string; // accentkleur uit het brandbook
}

export const HOOFD_META: Record<string, HoofdMeta> = {
  Bureaus: { tagline: "Bureaus, zit-sta & benchbureaus", kleur: "#A1367E" },
  Stoelen: { tagline: "Bureau-, vergader- & kantinestoelen", kleur: "#01B6E3" },
  Tafels: { tagline: "Vergader- & klaptafels", kleur: "#009D46" },
  "Kasten & opbergen": {
    tagline: "Kasten, ladenblokken & opbergen",
    kleur: "#F29828",
  },
  Accessoires: {
    tagline: "Kabelmanagement, wanden & meer",
    kleur: "#6E4B9E",
  },
};

const HOOFD_FALLBACK: HoofdMeta = {
  tagline: "Bekijk het assortiment",
  kleur: "#A1367E",
};

// Nettere labels voor een paar ruwe subcategorienamen. Niet genoemde
// subcategorieën houden gewoon hun originele naam.
const SUB_LABEL: Record<string, string> = {
  "Terras- / Kantinestoelen": "Terras- & kantinestoelen",
  // "Flex dynamisch werken" is in de Swan-data een vaag label; het zijn in
  // werkelijkheid benchbureaus (meerdere werkplekken aan elkaar voor flexkantoren).
  "Flex dynamisch werken": "Benchbureaus",
  "Persoonlijke lade": "Persoonlijke lades",
};

export function subLabel(sub: string): string {
  return SUB_LABEL[sub] ?? sub;
}

// ── Iconen per subcategorie ──────────────────────────────────
// Welke pictogram-sleutel hoort bij een ruwe subcategorie? CategorieIcon.tsx
// tekent het bijbehorende line-icoon. Onbekende subs vallen terug op "meubel".
const SUB_ICOON: Record<string, string> = {
  Bureaus: "bureau",
  "Zit-sta bureaus": "zitsta",
  "Flex dynamisch werken": "bench",
  Bureaustoelen: "bureaustoel",
  Vergaderstoelen: "stoel",
  "Terras- / Kantinestoelen": "kruk",
  Vergadertafels: "tafel",
  Klaptafels: "klaptafel",
  Roldeurkasten: "kast",
  Schuifdeurkasten: "kast",
  Ladenblokken: "ladenblok",
  "Persoonlijke lade": "ladenblok",
  Kabelmanagement: "kabel",
  Scheidingswanden: "wand",
  Componenten: "component",
};

export function subIcoon(sub: string): string {
  return SUB_ICOON[sub] ?? "meubel";
}

// Gewenste volgorde van subcategorieën binnen hun hoofdcategorie. We hergebruiken
// de volgorde waarin SUB_NAAR_HOOFD is gedefinieerd: die staat al logisch
// (kasten vóór ladenblokken, vergadertafels vóór klaptafels). Onbekende subs
// krijgen een hoge rang en belanden zo achteraan.
const SUB_RANG: Record<string, number> = Object.fromEntries(
  Object.keys(SUB_NAAR_HOOFD).map((sub, i) => [sub, i])
);

export function subRang(sub: string): number {
  return SUB_RANG[sub] ?? 999;
}

// ── Genavigeerde structuur (klein, veilig om naar de client te sturen) ──
export interface NavSub {
  label: string;
  slug: string;
  aantal: number; // aantal series
  uitvoeringen: number; // aantal varianten
  icoon: string; // pictogram-sleutel voor CategorieIcon
}

export interface NavHoofd {
  hoofd: string;
  tagline: string;
  kleur: string;
  series: number; // aantal productseries
  uitvoeringen: number; // aantal varianten (kleur/formaat)
  subs: NavSub[];
}

// Zet de (server-side) categorie-structuur om naar een geordende, lichte
// navigatie-structuur met nette labels en accentkleuren.
export function ordenNav(structuur: CategorieGroep[]): NavHoofd[] {
  const opNaam = new Map(structuur.map((g) => [g.hoofd, g]));

  // Eerst de gewenste volgorde, daarna eventuele overige categorieën.
  const volgorde = [
    ...HOOFD_VOLGORDE.filter((h) => opNaam.has(h)),
    ...structuur.map((g) => g.hoofd).filter((h) => !HOOFD_VOLGORDE.includes(h)),
  ];

  return volgorde.map((hoofd) => {
    const groep = opNaam.get(hoofd)!;
    const meta = HOOFD_META[hoofd] ?? HOOFD_FALLBACK;
    // De subs komen al gesorteerd uit getCategorieStructuur (op subRang).
    const subs = groep.subs.map((s) => ({
      label: subLabel(s.sub),
      slug: s.slug,
      aantal: s.aantal,
      uitvoeringen: s.uitvoeringen,
      icoon: subIcoon(s.sub),
    }));
    return {
      hoofd,
      tagline: meta.tagline,
      kleur: meta.kleur,
      series: subs.reduce((som, s) => som + s.aantal, 0),
      uitvoeringen: subs.reduce((som, s) => som + s.uitvoeringen, 0),
      subs,
    };
  });
}
