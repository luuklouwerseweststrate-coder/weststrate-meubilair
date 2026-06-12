// Header voor het bureaustoel-artikel: de eigen productfoto (packshot)
// op een rustige achtergrond in huisstijl. 1200x800 (3:2), net als de
// andere blogheaders.
//
// Draaien: node scripts/blog-stoel-header.mjs
import sharp from "sharp";

const W = 1200;
const H = 800;

// Achtergrond: paper-2 met een zachte magenta cirkel achter de stoel en
// een subtiele schaduw eronder, zodat de packshot niet "zweeft".
const achtergrond = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#F0EFE9"/>
  <circle cx="${W / 2}" cy="${H / 2 - 20}" r="330" fill="#A1367E" opacity="0.10"/>
  <circle cx="${W / 2}" cy="${H / 2 - 20}" r="250" fill="#A1367E" opacity="0.07"/>
  <ellipse cx="${W / 2}" cy="${H - 130}" rx="240" ry="28" fill="#14141A" opacity="0.10"/>
</svg>`;

const stoel = await sharp("public/producten/stoelen/k281080.png")
  .resize({ height: 660, fit: "inside" })
  .toBuffer();
const meta = await sharp(stoel).metadata();

await sharp(Buffer.from(achtergrond))
  .composite([
    {
      input: stoel,
      left: Math.round((W - meta.width) / 2),
      top: Math.round(H - 130 - meta.height + 30),
    },
  ])
  .png()
  .toFile("public/beelden/blog-bureaustoel.png");

console.log("geschreven: public/beelden/blog-bureaustoel.png");
