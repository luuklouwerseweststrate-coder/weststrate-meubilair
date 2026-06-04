// Gedeelde transform-logica: zet ruwe Swan-varianten om naar het Product-model
// (variant-matrix) dat de site gebruikt. Wordt gebruikt door zowel:
//   - scripts/sync-swan.mjs     (live API, straks met betaalde credentials)
//   - scripts/excel-to-json.mjs (de Excel-export, brug voor de pitch nu)
// Zo levert beide bronnen gegarandeerd dezelfde data/swan-catalogus.json op.

// Velden die NOOIT een keuze-as worden (ze beschrijven het product zelf).
export const VASTE_VELDEN = new Set([
  "naam",
  "categorie",
  "subcategorie",
  "prijs",
  "artikelcode",
  "afbeelding",
]);

// Nette labels voor bekende variantvelden. Onbekende velden krijgen een
// automatische omzetting (underscore -> spatie, eerste letter hoofdletter).
const LABELS = {
  formaat: "Formaat",
  type: "Type",
  kies_kleur: "Bladkleur",
  kleur_frame: "Framekleur",
  kleur_kabelgoot: "Kabelgootkleur",
  kleur_klemmen: "Klemkleur",
  kleur_kast: "Kastkleur",
  kleur_vilt: "Viltkleur",
  kleur: "Kleur",
  frame: "Frame",
  stoffering: "Stoffering",
  uitvoering: "Uitvoering",
  wielen: "Wielen",
  optie: "Optie",
};

export function labelVoor(veld) {
  if (LABELS[veld]) return LABELS[veld];
  const woorden = veld.replace(/_/g, " ").trim();
  return woorden.charAt(0).toUpperCase() + woorden.slice(1);
}

// URL-veilige slug (zelfde logica als slugify in lib/types.ts).
export function slugify(tekst) {
  return String(tekst)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Korte, feitelijke omschrijving in Weststrate-stijl (je/jij, geen filler).
export function maakOmschrijving(subcategorie, aantalVarianten) {
  const enkel = subcategorie.replace(/s$/, "");
  if (aantalVarianten > 1) {
    return `${subcategorie} uit het snelleverprogramma, leverbaar in ${aantalVarianten} uitvoeringen.`;
  }
  return `${enkel} uit het snelleverprogramma, direct leverbaar.`;
}

// Transformeert de varianten van één productlijn naar een Product.
// Elke variant is een object met minstens: naam, categorie, subcategorie,
// prijs, artikelcode, afbeelding + variabele velden (formaat, kleur, ...).
export function bouwProduct(id, naam, varianten) {
  const eerste = varianten[0];
  const category = eerste.categorie || "Overig";
  const subcategory = eerste.subcategorie || "Overig";

  // Welke velden komen in de varianten voor (los van de vaste velden)?
  const velden = new Set();
  for (const v of varianten) {
    for (const sleutel of Object.keys(v)) {
      if (!VASTE_VELDEN.has(sleutel)) velden.add(sleutel);
    }
  }

  // Per veld: de distinct waarden (in volgorde van eerste voorkomen).
  const waardenPerVeld = {};
  for (const veld of velden) {
    const gezien = [];
    for (const v of varianten) {
      const w = v[veld];
      if (w !== undefined && w !== null && w !== "" && !gezien.includes(w)) {
        gezien.push(w);
      }
    }
    waardenPerVeld[veld] = gezien;
  }

  // Variërende velden -> optiegroepen; constante velden -> specificaties.
  const optionGroups = [];
  const specs = [];
  const asVelden = []; // velden die echt een keuze-as zijn
  for (const veld of velden) {
    const waarden = waardenPerVeld[veld];
    if (waarden.length > 1) {
      optionGroups.push({ label: labelVoor(veld), waarden });
      asVelden.push(veld);
    } else if (waarden.length === 1) {
      specs.push({ label: labelVoor(veld), value: String(waarden[0]) });
    }
  }

  // Varianten omzetten naar de matrix.
  const variants = varianten.map((v) => {
    const opties = {};
    for (const veld of asVelden) {
      opties[labelVoor(veld)] = v[veld] != null ? String(v[veld]) : "";
    }
    return {
      articleNumber: v.artikelcode || "",
      price: Number(v.prijs) || 0,
      image: v.afbeelding || "",
      opties,
    };
  });

  const basePrice = Math.min(...variants.map((v) => v.price));

  return {
    _id: String(id),
    name: naam,
    slug: slugify(naam),
    category,
    subcategory,
    shortDescription: maakOmschrijving(subcategory, variants.length),
    basePrice,
    image: variants[0]?.image || "",
    specs,
    optionGroups,
    variants,
  };
}

// Sorteert producten op categorie -> subcategorie -> naam (stabiele JSON).
export function sorteerProducten(producten) {
  return producten.sort(
    (a, b) =>
      a.category.localeCompare(b.category) ||
      a.subcategory.localeCompare(b.subcategory) ||
      a.name.localeCompare(b.name)
  );
}
