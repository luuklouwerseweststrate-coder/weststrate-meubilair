// Zet de Swan-Excel-export (data/snelleverprogramma.xlsx) om naar
// data/swan-catalogus.json — dezelfde JSON die het live API-sync-script ook
// oplevert. Dit is de brug zolang er nog geen betaalde Swan-API-account is:
// de echte catalogus mét echte productfoto's, zonder credentials.
//
// Elke rij in de Excel = één variant. Kolommen:
//   snel_naam, snel_categorie, snel_subcategorie, snel_type, snel_prijs,
//   snel_artikelcode, snel_afbeelding  + variabele velden (formaat, kleur, ...)
//
// Een "productlijn" = alle varianten met dezelfde subcategorie + snel_type
// (bv. "Bureaus" + "Arca bureau rechthoek"). De varierende velden binnen die
// lijn worden keuze-assen; de rest specificaties. Zie transform.mjs.
//
// Draaien: `npm run catalogus`

import xlsx from "xlsx";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bouwProduct, slugify, sorteerProducten } from "./transform.mjs";

const HIER = dirname(fileURLToPath(import.meta.url));
const EXCEL = join(HIER, "..", "data", "snelleverprogramma.xlsx");
const UIT = join(HIER, "..", "data", "swan-catalogus.json");

// De vaste kolommen (met snel_-prefix) -> de veldnamen die transform verwacht.
const VAST = {
  snel_naam: "naam",
  snel_categorie: "categorie",
  snel_subcategorie: "subcategorie",
  snel_prijs: "prijs",
  snel_artikelcode: "artikelcode",
  snel_afbeelding: "afbeelding",
};

function trim(waarde) {
  return waarde == null ? "" : String(waarde).trim();
}

function main() {
  const wb = xlsx.readFile(EXCEL);
  const rijen = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    defval: "",
  });
  console.log(`${rijen.length} rijen (varianten) ingelezen.`);

  // Groepeer op subcategorie + snel_type = één productlijn.
  const groepen = new Map();
  for (const rij of rijen) {
    const subcat = trim(rij.snel_subcategorie);
    const type = trim(rij.snel_type);
    const sleutel = `${subcat}||${type}`;

    // Rij omzetten naar een "variant"-object voor transform.mjs.
    const variant = {};
    for (const [kolom, veld] of Object.entries(VAST)) {
      variant[veld] = veld === "prijs" ? Number(rij[kolom]) || 0 : trim(rij[kolom]);
    }
    // Variabele velden: alleen niet-lege waarden meenemen.
    for (const kolom of Object.keys(rij)) {
      if (kolom.startsWith("snel_")) continue;
      const waarde = trim(rij[kolom]);
      if (waarde) variant[kolom] = waarde;
    }

    if (!groepen.has(sleutel)) {
      groepen.set(sleutel, { naam: type || subcat, varianten: [] });
    }
    groepen.get(sleutel).varianten.push(variant);
  }

  console.log(`${groepen.size} productlijnen gevonden.`);

  const producten = [];
  const slugsGezien = new Set();
  for (const [sleutel, { naam, varianten }] of groepen) {
    const product = bouwProduct(slugify(sleutel), naam, varianten);

    // Slug uniek houden (val terug op een suffix bij dubbele namen).
    if (slugsGezien.has(product.slug)) {
      product.slug = `${product.slug}-${slugify(product.subcategory).slice(0, 6)}`;
    }
    let teller = 2;
    while (slugsGezien.has(product.slug)) {
      product.slug = `${slugify(naam)}-${teller++}`;
    }
    slugsGezien.add(product.slug);

    producten.push(product);
  }

  sorteerProducten(producten);
  return producten;
}

const producten = main();
await mkdir(dirname(UIT), { recursive: true });
await writeFile(UIT, JSON.stringify(producten, null, 2) + "\n", "utf8");
console.log(
  `\nKlaar: ${producten.length} producten -> data/swan-catalogus.json`
);
