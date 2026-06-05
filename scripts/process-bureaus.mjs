// Eenmalig: zet de gedownloade zit-sta-bureau foto's (witte achtergrond) om naar
// nette, transparante productbeelden voor de pilot. Aanpak:
//   1) border flood-fill: alleen het wit dat aan de RAND vastzit wordt
//      transparant — zo blijven witte bladen/frames van het product zelf heel.
//   2) bijsnijden op de overgebleven inhoud (.trim) en centreren op een
//      vierkant transparant canvas, zodat alle beelden uniform ogen.
// Bron: /tmp/raw/*.png  ->  public/producten/bureaus/*.png

import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const BRON = ".tmp-raw";
const DOEL = "public/producten/bureaus";
const WIT = 236; // drempel: r,g,b >= 236 telt als "wit-achtig"
const CANVAS = 1000; // vierkant eindformaat
const MARGE = 60; // transparante rand rondom het product

async function verwerk(bestand) {
  const naam = path.basename(bestand);
  const { data, info } = await sharp(path.join(BRON, bestand))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels: c } = info;
  const witachtig = (i) =>
    data[i] >= WIT && data[i + 1] >= WIT && data[i + 2] >= WIT;

  // Flood-fill vanaf alle randpixels over aaneengesloten wit.
  const bezocht = new Uint8Array(w * h);
  const stapel = [];
  for (let x = 0; x < w; x++) {
    stapel.push([x, 0], [x, h - 1]);
  }
  for (let y = 0; y < h; y++) {
    stapel.push([0, y], [w - 1, y]);
  }
  while (stapel.length) {
    const [x, y] = stapel.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (bezocht[p]) continue;
    const i = p * c;
    if (!witachtig(i)) continue;
    bezocht[p] = 1;
    data[i + 3] = 0; // alpha -> transparant
    stapel.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  // Terug naar een afbeelding, bijsnijden op zichtbare inhoud, en op een
  // vierkant canvas centreren met wat marge.
  const getrimd = await sharp(data, { raw: { width: w, height: h, channels: c } })
    .png()
    .trim()
    .toBuffer();

  await sharp(getrimd)
    .resize(CANVAS - MARGE * 2, CANVAS - MARGE * 2, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .extend({
      top: MARGE,
      bottom: MARGE,
      left: MARGE,
      right: MARGE,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(CANVAS, CANVAS, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(DOEL, naam));

  console.log(`✓ ${naam}`);
}

await mkdir(DOEL, { recursive: true });
const bestanden = (await readdir(BRON)).filter((f) => f.endsWith(".png"));
for (const f of bestanden) await verwerk(f);
console.log(`Klaar: ${bestanden.length} beelden verwerkt naar ${DOEL}`);
