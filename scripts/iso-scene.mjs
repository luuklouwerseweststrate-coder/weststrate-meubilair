// Bouwt een isometrische kantoor-scène als SVG en rastert die naar PNG zodat we
// het resultaat kunnen bekijken voordat we het in een React-component gieten.
//
// Isometrische projectie: x loopt naar rechts-onder, y naar links-onder, z omhoog.
//   P(x,y,z) = [ (x - y)*cos30*S , (x + y)*sin30*S - z*S ]
// Elk meubel is opgebouwd uit "dozen" (box): top + rechter- + linkervlak, met drie
// tinten van dezelfde kleur (lichtste bovenop) voor een vlakke iso-look.
//
// De scène is een ingerichte kantoorhoek: de bureaustoel staat áán het bureau
// (één werkplek), de vergadertafel staat in een eigen hoek, de kast tegen de
// achterwand en de scheidingswand verdeelt de ruimte. Plant + vloerkleed geven
// sfeer; het Weststrate-beeldmerk (de gekleurde W) staat als merkstempel in beeld.

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
const GREEN = ["#3DBE74", "#2FA862", "#268A50"]; // plant
const SCREEN = ["#3A4A66", "#2E3A52", "#222B3D"]; // monitor
const MUG = ["#FFFFFF", "#F0F0F0", "#E0E0E0"];

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
  // Bureau-accessoires op het blad (horen bij het bureau, liften dus mee).
  const t = lh + 0.16; // bovenkant blad
  s += box(1.5, 0.35, t, 0.8, 0.3, 0.16, DARK); // monitorvoet
  s += box(1.83, 0.45, t + 0.16, 0.12, 0.12, 0.42, DARK); // nek
  s += box(1.1, 0.3, t + 0.5, 1.55, 0.14, 0.92, SCREEN); // scherm
  return s;
}

function stoel() {
  // Bureaustoel: stervoet met wieltjes, gasveer, zitting en hoge rugleuning.
  // De rugleuning staat aan de achterkant (kleine x/y) zodat de stoel naar de
  // kijker/het bureau toe "open" staat.
  const cx = 0.85,
    cy = 0.85;
  let s = schaduw(cx, cy, 30);
  const c = P(cx, cy, 0.06);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    const ex = +c[0] + Math.cos(a) * 30;
    const ey = +c[1] + Math.sin(a) * 15;
    s += `<line x1="${c[0]}" y1="${c[1]}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(
      1
    )}" stroke="${DARK[1]}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(
      1
    )}" r="3.5" fill="${DARK[2]}"/>`;
  }
  s += box(cx - 0.13, cy - 0.13, 0.06, 0.26, 0.26, 0.7, DARK); // gasveer
  s += box(0.1, 0.1, 0.76, 1.5, 1.5, 0.28, GREY); // zitting
  // Rugleuning aan de achterkant (kleine y), licht naar achteren.
  s += box(0.18, 0.12, 1.04, 1.34, 0.22, 1.45, GREY);
  return s;
}

function vergaderstoel() {
  // Eenvoudige vergaderstoel: vier poten, zitting, rugleuning. Geen wieltjes,
  // duidelijk een ander silhouet dan de bureaustoel.
  const w = 1.2,
    d = 1.2;
  let s = schaduw(w / 2, d / 2, 18);
  for (const [x, y] of [
    [0.05, 0.05],
    [w - 0.17, 0.05],
    [0.05, d - 0.17],
    [w - 0.17, d - 0.17],
  ])
    s += box(x, y, 0, 0.12, 0.12, 0.92, DARK);
  s += box(0, 0, 0.92, w, d, 0.16, GREY); // zitting
  s += box(0.05, 0.05, 1.08, w - 0.1, 0.16, 1.0, GREY); // rugleuning (achter)
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

// ── Sfeer (niet-klikbare decoratie) ─────────────────────────
function plant() {
  // Pot + bladeren. Decoratief, geen link.
  let s = schaduw(0.5, 0.5, 26);
  s += box(0.18, 0.18, 0, 0.64, 0.64, 0.7, ["#C9714E", "#B5603F", "#9C4E31"]); // terracotta pot
  const [bx, by] = P(0.5, 0.5, 0.7);
  // Bladeren: een paar ovale "sprieten" die uit de pot komen.
  const blad = (dx, dy, rot, sc) =>
    `<ellipse cx="${(+bx + dx).toFixed(1)}" cy="${(+by + dy).toFixed(1)}" rx="${(
      7 * sc
    ).toFixed(1)}" ry="${(20 * sc).toFixed(1)}" fill="${
      GREEN[Math.abs(Math.round(dx)) % 2]
    }" transform="rotate(${rot} ${(+bx + dx).toFixed(1)} ${(+by + dy).toFixed(
      1
    )})"/>`;
  s += blad(-8, -16, -24, 1);
  s += blad(8, -18, 22, 1.05);
  s += blad(0, -26, 0, 1.15);
  s += blad(-14, -10, -48, 0.8);
  s += blad(14, -12, 46, 0.82);
  return s;
}

// Vloerkleed: zacht parallellogram op de grond (iso-rechthoek).
function kleed(ox, oy, w, d, kleur) {
  return `<polygon points="${pts(
    [ox, oy, 0],
    [ox + w, oy, 0],
    [ox + w, oy + d, 0],
    [ox, oy + d, 0]
  )}" fill="${kleur}" opacity="0.55"/>`;
}

// Weststrate-beeldmerk: de gekleurde W als vier diagonale streken.
// Platte 2D-merkstempel (volgt niet de iso-projectie); links→rechts in de
// huisstijlkleuren, net als het echte logo.
function logoW(x, y, w, h, sw) {
  const X = (t) => (x + t * w).toFixed(1);
  const Y = (t) => (y + t * h).toFixed(1);
  const seg = (x1, y1, x2, y2, kl) =>
    `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(
      y2
    )}" stroke="${kl}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return (
    seg(0, 0, 0.2, 1, "#A1367E") + // magenta
    seg(0.2, 1, 0.5, 0.28, "#01B6E3") + // cyaan
    seg(0.5, 0.28, 0.8, 1, "#009D46") + // groen
    seg(0.8, 1, 1, 0, "#F29828") // oranje
  );
}

// ── Scène samenstellen ──────────────────────────────────────
// Per meubel: bouwer, plek (translate) en label (voor de preview).
// Layout = ingerichte hoek: kast links-achter, werkplek (bureau + stoel) in het
// midden, scheidingswand als verdeler, vergadertafel rechts.
const MEUBELS = [
  { bouw: kast, tx: 215, ty: 150, label: "Kasten", kleur: "#F29828" },
  { bouw: bureau, tx: 360, ty: 235, label: "Bureaus", kleur: "#A1367E" },
  { bouw: stoel, tx: 470, ty: 330, label: "Bureaustoelen", kleur: "#01B6E3" },
  { bouw: accessoire, tx: 660, ty: 165, label: "Accessoires", kleur: "#6E4B9E" },
  { bouw: tafel, tx: 760, ty: 270, label: "Tafels", kleur: "#009D46" },
];

// Achter-naar-voor tekenen (op ty gesorteerd) voor correcte overlap.
const gesorteerd = [...MEUBELS].sort((a, b) => a.ty - b.ty);

let scene = "";
for (const m of gesorteerd) {
  scene += `<g transform="translate(${m.tx},${m.ty})">${m.bouw()}`;
  // Preview-label (in het component wordt dit een hover-label).
  scene += `<text x="0" y="60" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="${m.kleur}">${m.label}</text></g>`;
}

const W = 1100,
  H = 470;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#F7F7F4"/>
<ellipse cx="540" cy="285" rx="470" ry="150" fill="#FFFFFF" opacity="0.7"/>
<ellipse cx="540" cy="295" rx="430" ry="125" fill="#EFEFEA" opacity="0.9"/>
<g transform="translate(250,330)">${plant()}</g>
${scene}
<g transform="translate(690,360)">${vergaderstoel()}<text x="0" y="60" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="#01B6E3">Vergaderstoelen</text></g>
<g transform="translate(895,350)">${vergaderstoel()}</g>
</svg>`;

writeFileSync(new URL("./iso-scene-preview.svg", import.meta.url), svg);
await sharp(Buffer.from(svg)).png().toFile(
  new URL("./iso-scene-preview.png", import.meta.url).pathname.replace(/^\//, "")
);
console.log("preview geschreven: scripts/iso-scene-preview.png");
