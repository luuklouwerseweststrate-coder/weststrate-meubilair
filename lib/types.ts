// Gedeelde types voor producten, opties en de offerte.

export type Categorie = "bureaustoelen" | "bureaus" | "vergadertafels";

export const CATEGORIE_LABELS: Record<Categorie, string> = {
  bureaustoelen: "Bureaustoelen",
  bureaus: "Bureaus",
  vergadertafels: "Vergadertafels",
};

// Eén keuze binnen een optiegroep, bv. "Wit" met +25 euro meerprijs.
export interface OptieKeuze {
  label: string;
  priceDelta: number; // meerprijs t.o.v. basisprijs (mag 0 of negatief)
}

// Een groep keuzes, bv. "Bladkleur".
export interface OptieGroep {
  label: string;
  required: boolean;
  choices: OptieKeuze[];
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  articleNumber: string;
  category: Categorie;
  shortDescription: string;
  description?: string;
  basePrice: number;
  // Afbeelding-URL's; leeg = gekleurde placeholder
  images: string[];
  specs: Spec[];
  optionGroups: OptieGroep[];
}

export interface SiteSettings {
  bedrijfsnaam: string;
  payoff: string;
  overOns: string;
  email: string;
  telefoon: string;
  adres: string;
  footerTekst: string;
}

// ── Referentieprojecten ────────────────────────────────────
// Uitgevoerde inrichtingen die laten zien wat Weststrate kan.
export interface Project {
  _id: string;
  title: string;
  slug: string;
  klant: string; // bv. "Gemeente Middelburg"
  sector: string; // bv. "Overheid", "Zorg", "Horeca"
  jaar: string;
  locatie: string;
  intro: string; // korte samenvatting voor de kaart
  uitdaging: string;
  aanpak: string;
  resultaat: string;
  // Meetbare cijfers (brandbook: cijfers i.p.v. superlatieven)
  cijfers: { waarde: string; label: string }[];
  image: string; // hoofdbeeld (leeg = placeholder)
  categorieen: string[]; // bv. ["Bureaus", "Vergadertafels"]
}

// ── Blog / inspiratie ──────────────────────────────────────
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  datum: string; // ISO, bv. "2026-05-12"
  thema: string; // bv. "Ergonomie", "Akoestiek"
  leestijd: number; // minuten
  samenvatting: string;
  body: string; // platte tekst met dubbele newlines tussen alinea's
  image: string; // (leeg = placeholder)
}

// ── Offerte ────────────────────────────────────────────────

// Een gekozen optie op een offerteregel.
export interface GekozenOptie {
  groepLabel: string;
  keuzeLabel: string;
  priceDelta: number;
}

// Eén regel in de offerte (een product met gekozen opties).
export interface OfferteRegel {
  id: string; // unieke regel-id
  productId: string;
  productName: string;
  articleNumber: string;
  basePrice: number;
  gekozenOpties: GekozenOptie[];
  aantal: number;
}

// Stuksprijs = basisprijs + som van alle meerprijzen.
export function stuksprijs(regel: OfferteRegel): number {
  const opties = regel.gekozenOpties.reduce((s, o) => s + o.priceDelta, 0);
  return regel.basePrice + opties;
}

// Regeltotaal = stuksprijs x aantal.
export function regelTotaal(regel: OfferteRegel): number {
  return stuksprijs(regel) * regel.aantal;
}

// Prijsweergave in euro's (NL-notatie). Staat hier (server-veilig) zodat
// zowel server- als client-componenten hem kunnen gebruiken.
export function euro(bedrag: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(bedrag);
}
