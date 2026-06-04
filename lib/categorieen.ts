import type { CategorieGroep } from "./data";

// Centrale categorie-mapping voor de navigatie.
//
// De ruwe categorie-/subcategorienamen komen uit het Swan-snelleverprogramma.
// Hier bepalen we de VOLGORDE, een nette KLANTGERICHTE label, een accentkleur en
// een korte tagline per hoofdcategorie — zodat de megamenu-balk duidelijk maakt
// wat we aanbieden. De URL-slugs blijven afgeleid van de originele namen (zodat
// de links naar /catalogus/[slug] blijven kloppen); alleen het LABEL wijzigt.

// Gewenste volgorde van de hoofdcategorieën (de werkplek-flow).
export const HOOFD_VOLGORDE = ["Werken", "Zitten", "Vergaderen", "Opbergen"];

interface HoofdMeta {
  tagline: string;
  kleur: string; // accentkleur uit het brandbook
}

export const HOOFD_META: Record<string, HoofdMeta> = {
  Werken: { tagline: "Bureaus, zit-sta & werkplekken", kleur: "#A1367E" },
  Zitten: { tagline: "Bureaustoelen & zitoplossingen", kleur: "#01B6E3" },
  Vergaderen: { tagline: "Vergader- & klaptafels", kleur: "#009D46" },
  Opbergen: { tagline: "Kasten & opbergoplossingen", kleur: "#F29828" },
};

const HOOFD_FALLBACK: HoofdMeta = {
  tagline: "Bekijk het assortiment",
  kleur: "#A1367E",
};

// Nettere labels voor een paar ruwe subcategorienamen. Niet genoemde
// subcategorieën houden gewoon hun originele naam.
const SUB_LABEL: Record<string, string> = {
  "Terras- / Kantinestoelen": "Terras- & kantinestoelen",
  "Flex dynamisch werken": "Flex & dynamisch werken",
  "Persoonlijke lade": "Persoonlijke lades",
};

export function subLabel(sub: string): string {
  return SUB_LABEL[sub] ?? sub;
}

// ── Genavigeerde structuur (klein, veilig om naar de client te sturen) ──
export interface NavSub {
  label: string;
  slug: string;
  aantal: number; // aantal series
  uitvoeringen: number; // aantal varianten
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
    const subs = groep.subs.map((s) => ({
      label: subLabel(s.sub),
      slug: s.slug,
      aantal: s.aantal,
      uitvoeringen: s.uitvoeringen,
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
