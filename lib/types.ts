// Gedeelde types voor producten, varianten, opties en de offerte.
//
// Het productmodel is een "variant-matrix": een product (productlijn uit het
// Swan-snelleverprogramma) heeft optiegroepen (de keuze-assen, bv. Framekleur)
// en een lijst varianten. Elke variant is één concrete combinatie met een
// eigen artikelcode, prijs en foto. Kiest de klant andere opties, dan zoeken
// we de bijbehorende variant op en wisselt prijs én beeld mee.

// ── Categorieën ─────────────────────────────────────────────
// Categorieën zijn dynamisch (afgeleid uit de Swan-data), dus gewoon string.
// Voorbeelden: hoofdcategorie "Werken", subcategorie "Bureaus".

// Maakt een URL-veilige slug van een categorie- of productnaam.
export function slugify(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize("NFD") // splits diacritics af (é -> e + accent)
    .replace(/[̀-ͯ]/g, "") // verwijder de accenttekens
    .replace(/[^a-z0-9]+/g, "-") // alles wat geen letter/cijfer is -> koppelteken
    .replace(/^-+|-+$/g, ""); // koppeltekens aan begin/eind weg
}

// ── Product + varianten ─────────────────────────────────────

// Eén keuze-as, bv. "Framekleur" met waarden ["Zwart", "Antraciet"].
export interface OptieGroep {
  label: string;
  waarden: string[];
}

// Eén concrete combinatie. opties koppelt elke groep-label aan de gekozen
// waarde, bv. { "Framekleur": "Zwart", "Blad": "Wit" }.
export interface Variant {
  articleNumber: string;
  price: number;
  image: string;
  opties: Record<string, string>;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string; // hoofdcategorie, bv. "Werken"
  subcategory: string; // subcategorie, bv. "Bureaus"
  shortDescription: string;
  description?: string;
  basePrice: number; // prijs van de goedkoopste variant ("vanaf")
  image: string; // standaardbeeld (van de standaardvariant)
  specs: Spec[];
  optionGroups: OptieGroep[];
  variants: Variant[];
}

// Zoekt de variant die exact bij de gekozen opties past. Valt terug op de
// eerste variant als er (nog) geen match is.
export function vindVariant(
  product: Product,
  keuzes: Record<string, string>
): Variant {
  const match = product.variants.find((v) =>
    product.optionGroups.every((g) => v.opties[g.label] === keuzes[g.label])
  );
  return match ?? product.variants[0];
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
  images?: string[]; // extra foto's voor de galerij op de detailpagina
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

// ── Zoeken ─────────────────────────────────────────────────
// De inhoudssoorten die in de globale zoekfunctie verschijnen. De volgorde
// hier bepaalt ook de volgorde van de groepen in het zoekvenster.
export type ZoekType =
  | "Product"
  | "Categorie"
  | "Project"
  | "Inspiratie"
  | "Specialist"
  | "Pagina";

// Eén doorzoekbaar item. Bewust plat en licht: dit gaat als JSON naar de client.
export interface ZoekItem {
  type: ZoekType;
  titel: string;
  sub?: string; // korte context onder de titel (categorie, sector, thema…)
  href: string;
  beeld?: string; // optionele thumbnail
  trefwoorden?: string; // extra zoekwoorden die niet zichtbaar hoeven
}

// ── Offerte ────────────────────────────────────────────────

// Een gekozen optie op een offerteregel (puur ter weergave).
export interface GekozenOptie {
  groepLabel: string;
  keuzeLabel: string;
}

// Eén regel in de offerte: een gekozen variant met aantal.
export interface OfferteRegel {
  id: string; // unieke regel-id
  productId: string;
  productName: string;
  articleNumber: string; // artikelcode van de gekozen variant
  stuksprijs: number; // exacte prijs van de gekozen variant
  gekozenOpties: GekozenOptie[];
  aantal: number;
}

// Stuksprijs = de exacte variantprijs die op de regel is vastgelegd.
export function stuksprijs(regel: OfferteRegel): number {
  return regel.stuksprijs;
}

// Regeltotaal = stuksprijs x aantal.
export function regelTotaal(regel: OfferteRegel): number {
  return regel.stuksprijs * regel.aantal;
}

// Prijsweergave in euro's (NL-notatie). Staat hier (server-veilig) zodat
// zowel server- als client-componenten hem kunnen gebruiken.
export function euro(bedrag: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(bedrag);
}
