// Bouwt een isometrische kantoor-scène als SVG en rastert die naar PNG zodat we
// het resultaat kunnen bekijken voordat we het in een React-component gieten.
//
// Isometrische projectie: x loopt naar rechts-onder, y naar links-onder, z omhoog.
//   P(x,y,z) = [ (x - y)*cos30*S , (x + y)*sin30*S - z*S ]
// Elk meubel is opgebouwd uit "dozen" (box): top + rechter- + linkervlak, met drie
// tinten van dezelfde kleur (lichtste bovenop) voor een vlakke iso-look.

import sharp from "sharp";
import { writeFileSync } from "node:fs";

const S = 26; // pixels per iso-eenheid
const COS = Math.cos(Math.PI / 6); // 30°
const SIN = Math.sin(Math.PI / 6);

const P = (x, y, z) => [
  ((x - y) * COS * S).toFixed(1),
  ((x + y) * SIN * S - z * S).toFixed(1),
];
const pts = (...c) => c.map(([x, y, z]) => P(x, y, z).join(",")).join(" ");

// Eén doos: 3 polygonen (top, rechtervlak x=w, linkervlak y=d).
function box(ox, oy, oz, w, d, h, pal) {
  const top = pts(
    [ox, oy, oz + h],
    [ox + w, oy, oz + h],
    [ox + w, oy + d, oz + h],
    [ox, oy + d, oz + h]
  );
  const right = pts(
    [ox + w, oy, oz],
    [ox + w, oy + d, oz],
    [ox + w, oy + d, oz + h],
    [ox + w, oy, oz + h]
  );
  const left = pts(
    [ox, oy + d, oz],
    [ox + w, oy + d, oz],
    [ox + w, oy + d, oz + h],
    [ox, oy + d, oz + h]
  );
  return (
    `<polygon points="${left}" fill="${pal[2]}"/>` +
    `<polygon points="${right}" fill="${pal[1]}"/>` +
    `<polygon points="${top}" fill="${pal[0]}"/>`
  );
}

// Paletten: [top, rechts, links] van licht naar donker.
const WOOD = ["#E8D5BC", "#D3BA96", "#BC9E78"];
const WHITE = ["#FFFFFF", "#EBEEF2", "#D7DCE3"];
const DARK = ["#434954", "#31363F", "#23272E"];
const GREY = ["#CCD1D9", "#B4BAC5", "#9BA2AE"];

// Zachte grondschaduw onder een meubel (in lokale iso-coördinaten).
function schaduw(cx, cy, rx) {
  const [px, py] = P(cx, cy, 0);
  return `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${(rx * 0.5).toFixed(
    1
  )}" fill="#1a1a2e" opacity="0.10"/>`;
}

// ── Meubelstukken ───────────────────────────────────────────
function bureau() {
  const w = 4,
    d = 2.2,
    lh = 1.55;
  let s = schaduw(w / 2, d / 2, 56);
  for (const [x, y] of [
    [0, 0],
    [w - 0.18, 0],
    [0, d - 0.18],
    [w - 0.18, d - 0.18],
  ])
    s += box(x, y, 0, 0.18, 0.18, lh, DARK);
  s += box(-0.1, -0.1, lh, w + 0.2, d + 0.2, 0.16, WOOD); // blad
  return s;
}

function stoel() {
  let s = schaduw(0.75, 0.75, 30);
  // Stervoet: vijf slanke spaken met wieltjes vanuit het midden.
  const c = P(0.75, 0.75, 0.06);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    const ex = +c[0] + Math.cos(a) * 30;
    const ey = +c[1] + Math.sin(a) * 15;
    s += `<line x1="${c[0]}" y1="${c[1]}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(
      1
    )}" stroke="${DARK[1]}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.5" fill="${DARK[2]}"/>`;
  }
  s += box(0.62, 0.62, 0.06, 0.26, 0.26, 0.78, DARK); // gasveer
  s += box(-0.1, -0.1, 0.84, 1.7, 1.7, 0.34, GREY); // zitting (breed)
  // Rugleuning: net achter de zitting, iets hoger dan breed.
  s += box(0.12, 1.46, 1.18, 1.4, 0.2, 1.5, GREY);
  return s;
}

function tafel() {
  const w = 5,
    d = 2.6,
    lh = 1.45;
  let s = schaduw(w / 2, d / 2, 70);
  for (const [x, y] of [
    [0.15, 0.15],
    [w - 0.35, 0.15],
    [0.15, d - 0.35],
    [w - 0.35, d - 0.35],
  ])
    s += box(x, y, 0, 0.2, 0.2, lh, DARK);
  s += box(-0.1, -0.1, lh, w + 0.2, d + 0.2, 0.16, WOOD);
  return s;
}

function kast() {
  const w = 2.3,
    d = 1.6,
    h = 3.2;
  let s = schaduw(w / 2, d / 2, 40);
  s += box(0, 0, 0, w, d, h, WHITE);
  // Deurnaad + grepen op het rechtervlak (x=w).
  const a = P(w, d / 2, 0.1);
  const b = P(w, d / 2, h - 0.1);
  s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#C4CAD3" stroke-width="1.5"/>`;
  const g1 = P(w, d / 2 - 0.15, 1.8);
  const g1b = P(w, d / 2 - 0.15, 1.4);
  const g2 = P(w, d / 2 + 0.15, 1.8);
  const g2b = P(w, d / 2 + 0.15, 1.4);
  s += `<line x1="${g1[0]}" y1="${g1[1]}" x2="${g1b[0]}" y2="${g1b[1]}" stroke="#8A93A1" stroke-width="2.5" stroke-linecap="round"/>`;
  s += `<line x1="${g2[0]}" y1="${g2[1]}" x2="${g2b[0]}" y2="${g2b[1]}" stroke="#8A93A1" stroke-width="2.5" stroke-linecap="round"/>`;
  return s;
}

function accessoire() {
  // Scheidingswand: breed, dun, staand paneel op twee voetjes.
  const w = 3.2,
    d = 0.24,
    h = 1.9;
  let s = schaduw(w / 2, 0.5, 48);
  s += box(0.1, -0.25, 0, 0.5, 0.7, 0.34, DARK);
  s += box(w - 0.6, -0.25, 0, 0.5, 0.7, 0.34, DARK);
  s += box(0, 0, 0.34, w, d, h, GREY);
  return s;
}

// ── Scène samenstellen ──────────────────────────────────────
// Per meubel: bouwer, plek (translate) en label (voor de preview).
const MEUBELS = [
  { bouw: kast, tx: 175, ty: 205, label: "Kasten", kleur: "#F29828" },
  { bouw: tafel, tx: 470, ty: 175, label: "Tafels", kleur: "#009D46" },
  { bouw: bureau, tx: 345, ty: 290, label: "Bureaus", kleur: "#A1367E" },
  { bouw: stoel, tx: 660, ty: 330, label: "Stoelen", kleur: "#01B6E3" },
  { bouw: accessoire, tx: 845, ty: 245, label: "Accessoires", kleur: "#6E4B9E" },
];

// Achter-naar-voor tekenen (op ty gesorteerd) voor correcte overlap.
const gesorteerd = [...MEUBELS].sort((a, b) => a.ty - b.ty);

let scene = "";
for (const m of gesorteerd) {
  scene += `<g transform="translate(${m.tx},${m.ty})">${m.bouw()}`;
  // Preview-label (in het component wordt dit een hover-pill).
  scene += `<text x="0" y="60" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="${m.kleur}">${m.label}</text></g>`;
}

const W = 1100,
  H = 470;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#F7F7F4"/>
<ellipse cx="540" cy="285" rx="470" ry="150" fill="#FFFFFF" opacity="0.7"/>
<ellipse cx="540" cy="295" rx="430" ry="125" fill="#EFEFEA" opacity="0.9"/>
${scene}
</svg>`;

writeFileSync(new URL("./iso-scene-preview.svg", import.meta.url), svg);
await sharp(Buffer.from(svg)).png().toFile(
  new URL("./iso-scene-preview.png", import.meta.url).pathname.replace(/^\//, "")
);
console.log("preview geschreven: scripts/iso-scene-preview.png");
