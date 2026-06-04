// Synchroniseert het Swan-snelleverprogramma naar data/swan-catalogus.json.
//
// Werkwijze:
//   1. POST /product_list           -> alle productlijnen (id + naam)
//   2. POST /product_by_id/{id}      -> alle varianten van die lijn
//   3. bouwProduct() (zie transform.mjs) -> één Product per lijn (variant-matrix)
//   4. schrijf het resultaat naar data/swan-catalogus.json
//
// Draait in GitHub Actions (zie .github/workflows/sync-swan.yml) en lokaal via
// `npm run sync`. Credentials komen uit SWAN_USERNAME / SWAN_PASSWORD (env).
// De site zelf leest alleen de JSON en raakt de API nooit aan.
//
// LET OP: zolang er nog geen betaalde Swan-API is, vult de Excel-converter
// (scripts/excel-to-json.mjs, `npm run catalogus`) dezelfde JSON. Beide gebruiken
// transform.mjs, dus de overstap naar de live API is later naadloos.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bouwProduct, slugify, sorteerProducten } from "./transform.mjs";

const API = "https://v2.portal.swan-products.nl/api/quickproduct";
const USERNAME = process.env.SWAN_USERNAME;
const PASSWORD = process.env.SWAN_PASSWORD;

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${url} gaf status ${res.status}`);
  }
  return res.json();
}

async function main() {
  if (!USERNAME || !PASSWORD) {
    console.error(
      "FOUT: SWAN_USERNAME en SWAN_PASSWORD ontbreken. Zet ze in .env.local of als secret."
    );
    process.exit(1);
  }

  const auth = { username: USERNAME, password: PASSWORD };

  console.log("Productlijst ophalen...");
  const lijst = await postJson(`${API}/product_list`, auth);
  console.log(`${lijst.length} productlijnen gevonden.`);

  const producten = [];
  const slugsGezien = new Set();

  for (let i = 0; i < lijst.length; i++) {
    const { id, name } = lijst[i];
    try {
      const varianten = await postJson(`${API}/product_by_id/${id}`, auth);
      if (!Array.isArray(varianten) || varianten.length === 0) {
        console.warn(`  overslaan (geen varianten): ${name}`);
        continue;
      }
      const product = bouwProduct(id, name, varianten);

      // Slug uniek houden (val terug op id-suffix bij dubbele namen).
      if (slugsGezien.has(product.slug)) {
        product.slug = `${product.slug}-${slugify(String(id)).slice(-5)}`;
      }
      slugsGezien.add(product.slug);

      producten.push(product);
      console.log(
        `  [${i + 1}/${lijst.length}] ${name} (${product.variants.length} varianten)`
      );
    } catch (err) {
      console.warn(`  fout bij ${name}: ${err.message}`);
    }
  }

  sorteerProducten(producten);

  const hier = dirname(fileURLToPath(import.meta.url));
  const uit = join(hier, "..", "data", "swan-catalogus.json");
  await mkdir(dirname(uit), { recursive: true });
  await writeFile(uit, JSON.stringify(producten, null, 2) + "\n", "utf8");

  console.log(`\nKlaar: ${producten.length} producten weggeschreven naar`);
  console.log(uit);
}

main().catch((err) => {
  console.error("Sync mislukt:", err);
  process.exit(1);
});
