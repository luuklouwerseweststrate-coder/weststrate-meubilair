// Eenmalige migratie van de bestaande content (lib/mock-data.ts) naar Sanity,
// zodat Luuk direct alles in de Studio kan beheren in plaats van in code.
//
// Wat het script aanmaakt:
//   1. Site-instellingen (singleton)
//   2. Alle referentieprojecten, met hoofdbeeld + fotogalerij als echte
//      Sanity-assets (gedownload van weststrate.nl en geupload)
//   3. Alle blogartikelen, met de platte tekst omgezet naar Portable Text
//      ("## "-regels worden Kop 2) en de FAQ-blokken
//   4. Per Swan-product een leeg Productbeheer-document (offline uit, geen
//      prijsaanpassingen) zodat de hele catalogus in de Studio te vinden is
//
// Idempotent: bestaande documenten worden overgeslagen (createIfNotExists),
// dus het script kan veilig opnieuw draaien, bv. na nieuwe Swan-producten.
//
// Draaien: npm run seed
// Vereist in .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN
// (token met Editor-rechten; blijft lokaal, gaat NOOIT mee in de repo).
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { MOCK_SETTINGS, MOCK_PROJECTS, MOCK_POSTS } from "../lib/mock-data";
import type { Product } from "../lib/types";
import bureaustoelen from "../data/bureaustoelen-weststrate.json";
import zitStaBureaus from "../data/zit-sta-bureaus-weststrate.json";
import catalogus from "../data/swan-catalogus.json";

const ROOT = join(__dirname, "..");

// ── Env: .env.local zelf inlezen (geen extra dependency nodig) ──
function leesEnvLocal(): Record<string, string> {
  const pad = join(ROOT, ".env.local");
  if (!existsSync(pad)) return {};
  const env: Record<string, string> = {};
  for (const regel of readFileSync(pad, "utf8").split(/\r?\n/)) {
    const m = regel.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const env = { ...leesEnvLocal(), ...process.env };
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Ontbrekende configuratie. Zet in .env.local:\n" +
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>\n" +
      "  SANITY_API_TOKEN=<token met Editor-rechten>\n" +
      "Token aanmaken: sanity.io/manage -> project -> API -> Tokens."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ── Beelden uploaden ─────────────────────────────────────────
// URL (weststrate.nl) of lokaal pad (/beelden/... uit public/) -> Sanity-asset.
// Cache per pad zodat hetzelfde beeld nooit twee keer geupload wordt.
const assetCache = new Map<string, string>();

async function uploadBeeld(bron: string): Promise<string | null> {
  if (!bron) return null;
  const bestaand = assetCache.get(bron);
  if (bestaand) return bestaand;

  let buffer: Buffer;
  let bestandsnaam: string;
  try {
    if (bron.startsWith("http")) {
      const res = await fetch(bron);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      buffer = Buffer.from(await res.arrayBuffer());
      bestandsnaam = decodeURIComponent(bron.split("/").pop() || "beeld.jpg");
    } else {
      const pad = join(ROOT, "public", bron.replace(/^\//, ""));
      buffer = readFileSync(pad);
      bestandsnaam = bron.split("/").pop() || "beeld.png";
    }
  } catch (e) {
    console.warn(`  ! beeld overgeslagen (${bron}): ${e}`);
    return null;
  }

  const asset = await client.assets.upload("image", buffer, {
    filename: bestandsnaam,
  });
  assetCache.set(bron, asset._id);
  return asset._id;
}

function beeldVeld(assetId: string | null) {
  if (!assetId) return undefined;
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

// ── Platte tekst -> Portable Text ────────────────────────────
// Spiegelbeeld van blocksNaarTekst in lib/data.ts: alinea's gescheiden door
// een lege regel, "## "-regels worden Kop 2-blocks.
function tekstNaarBlocks(tekst: string) {
  return tekst
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((alinea, i) => {
      const isKop = alinea.startsWith("## ");
      return {
        _type: "block",
        _key: `blok-${i}`,
        style: isKop ? "h2" : "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: `span-${i}`,
            text: isKop ? alinea.slice(3) : alinea,
            marks: [],
          },
        ],
      };
    });
}

// Bestaat dit document al? Dan slaan we het over (en uploaden we ook de
// bijbehorende beelden niet opnieuw).
async function bestaatAl(id: string): Promise<boolean> {
  return Boolean(await client.getDocument(id));
}

// ── 1. Site-instellingen ─────────────────────────────────────
async function seedSettings() {
  await client.createIfNotExists({
    _id: "settings",
    _type: "settings",
    ...MOCK_SETTINGS,
  });
  console.log("Site-instellingen: ok");
}

// ── 2. Projecten ─────────────────────────────────────────────
async function seedProjecten() {
  for (const [i, p] of MOCK_PROJECTS.entries()) {
    const id = `project-${p.slug}`;
    if (await bestaatAl(id)) {
      console.log(`Project "${p.title}": bestaat al, overgeslagen`);
      continue;
    }

    const hoofdbeeld = await uploadBeeld(p.image);
    const galerij: any[] = [];
    for (const [j, url] of (p.images ?? []).entries()) {
      // Het hoofdbeeld is de eerste galerijfoto; die niet dubbel opnemen.
      if (url === p.image) continue;
      const assetId = await uploadBeeld(url);
      if (assetId) galerij.push({ ...beeldVeld(assetId), _key: `foto-${j}` });
    }

    await client.createIfNotExists({
      _id: id,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      klant: p.klant,
      sector: p.sector,
      jaar: p.jaar,
      locatie: p.locatie,
      intro: p.intro,
      uitdaging: p.uitdaging,
      aanpak: p.aanpak,
      resultaat: p.resultaat,
      cijfers: (p.cijfers ?? []).map((c, j) => ({ ...c, _key: `cijfer-${j}` })),
      image: beeldVeld(hoofdbeeld),
      images: galerij,
      categorieen: p.categorieen,
      // Zelfde volgorde als op de huidige site; sleepbaar in de Studio.
      orderRank: `0|${String(i).padStart(6, "0")}`,
    });
    console.log(`Project "${p.title}": aangemaakt (${galerij.length + 1} foto's)`);
  }
}

// ── 3. Blogartikelen ─────────────────────────────────────────
async function seedPosts() {
  for (const p of MOCK_POSTS) {
    const id = `post-${p.slug}`;
    if (await bestaatAl(id)) {
      console.log(`Blog "${p.title}": bestaat al, overgeslagen`);
      continue;
    }

    const beeld = await uploadBeeld(p.image);
    await client.createIfNotExists({
      _id: id,
      _type: "post",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      datum: p.datum,
      thema: p.thema,
      leestijd: p.leestijd,
      samenvatting: p.samenvatting,
      body: tekstNaarBlocks(p.body),
      image: beeldVeld(beeld),
      faq: (p.faq ?? []).map((f, j) => ({
        ...f,
        _type: "object",
        _key: `faq-${j}`,
      })),
    });
    console.log(`Blog "${p.title}": aangemaakt`);
  }
}

// ── 4. Productbeheer (lege overrides per Swan-product) ───────
// Zelfde zichtbaarheidsregel als lib/data.ts: alleen producten met minstens
// één foto staan op de site, dus alleen die krijgen een beheer-document.
function isToonbaar(p: Product): boolean {
  return Boolean(p.image || p.variants.find((v) => v.image)?.image);
}

async function seedProductOverrides() {
  const producten = [
    ...(bureaustoelen as unknown as Product[]),
    ...(zitStaBureaus as unknown as Product[]),
    ...(catalogus as unknown as Product[]),
  ].filter(isToonbaar);

  for (const p of producten) {
    await client.createIfNotExists({
      _id: `productOverride-${p.slug}`,
      _type: "productOverride",
      naam: p.name,
      productSlug: p.slug,
      offline: false,
      prijzen: [],
    });
  }
  console.log(`Productbeheer: ${producten.length} producten aanwezig`);
}

// ── Uitvoeren ────────────────────────────────────────────────
async function main() {
  console.log(`Seed naar Sanity-project ${projectId} (dataset ${dataset})\n`);
  await seedSettings();
  await seedProjecten();
  await seedPosts();
  await seedProductOverrides();
  console.log("\nKlaar. Open /studio om de content te bekijken.");
}

main().catch((e) => {
  console.error("Seed mislukt:", e);
  process.exit(1);
});
