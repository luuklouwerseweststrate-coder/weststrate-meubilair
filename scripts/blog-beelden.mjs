// Genereert isometrische headerbeelden voor de blogartikelen, in dezelfde
// stijl als de kantoor-scène op de homepage (zie scripts/iso-scene.mjs).
// Output: public/beelden/blog-*.png (1200x800, 3:2 zoals de blogpagina vraagt).
//
// Run: node scripts/blog-beelden.mjs

import sharp from "sharp";
import { writeFileSync } from "node:fs";

const S = 26;
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

const P = (x, y, z) => [
  ((x - y) * COS * S).toFixed(1),
  ((x + y) * SIN * S - z * S).toFixed(1),
];
const pts = (...c) => c.map(([x, y, z]) => P(x, y, z).join(",")).join(" ");

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

const WOOD = ["#E8D5BC", "#D3BA96", "#BC9E78"];
const WHITE = ["#FFFFFF", "#EBEEF2", "#D7DCE3"];
const DARK = ["#434954", "#31363F", "#23272E"];
const GREY = ["#CCD1D9", "#B4BAC5", "#9BA2AE"];
const GREEN = ["#3DBE74", "#2FA862", "#268A50"];
const SCREEN = ["#3A4A66", "#2E3A52", "#222B3D"];
// Brandkleuren voor accenten (lockers, kunst, kussens)
const CYAAN = ["#5ECFEA", "#01B6E3", "#0193B8"];
const MAGENTA = ["#C56AA6", "#A1367E", "#812C65"];
const ORANJE = ["#F6B25F", "#F29828", "#CE7E1B"];

function schaduw(cx, cy, rx) {
  const [px, py] = P(cx, cy, 0);
  return `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${(rx * 0.5).toFixed(
    1
  )}" fill="#1a1a2e" opacity="0.08"/>`;
}

// ── Kamer (parametrisch, zelfde look als de homepage) ───────
function kamer(KW, KD, MH, opties = {}) {
  let s = "";
  s += `<polygon points="${pts(
    [0, 0, 0],
    [KW, 0, 0],
    [KW, 0, MH],
    [0, 0, MH]
  )}" fill="#F2EFE7"/>`;
  s += `<polygon points="${pts(
    [0, KD, 0],
    [0, 0, 0],
    [0, 0, MH],
    [0, KD, MH]
  )}" fill="#E9E5DB"/>`;
  const h1 = P(0, 0, 0);
  const h2 = P(0, 0, MH);
  s += `<line x1="${h1[0]}" y1="${h1[1]}" x2="${h2[0]}" y2="${h2[1]}" stroke="#E0DCD0" stroke-width="1.5"/>`;
  for (const [x1, x2, z1, z2] of opties.ramen ?? []) s += raam(x1, x2, z1, z2);
  for (const [y1, y2, z1, z2, kleur] of opties.lijsten ?? [])
    s += lijst(y1, y2, z1, z2, kleur);
  s += box(0, 0, -0.18, KW, KD, 0.18, ["#EFEBE1", "#DCD7C9", "#D2CDBF"]);
  for (let i = 3.25; i < KW; i += 3.25) {
    const a = P(i, 0, 0);
    const b = P(i, KD, 0);
    s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#E3DED1" stroke-width="1"/>`;
  }
  for (let j = 3.17; j < KD; j += 3.17) {
    const a = P(0, j, 0);
    const b = P(KW, j, 0);
    s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#E3DED1" stroke-width="1"/>`;
  }
  const p0 = P(0, 0, 0);
  const px = P(KW, 0, 0);
  const py = P(0, KD, 0);
  s += `<line x1="${p0[0]}" y1="${p0[1]}" x2="${px[0]}" y2="${px[1]}" stroke="#DBD6C8" stroke-width="2.5"/>`;
  s += `<line x1="${p0[0]}" y1="${p0[1]}" x2="${py[0]}" y2="${py[1]}" stroke="#D6D1C3" stroke-width="2.5"/>`;
  return s;
}

function raam(x1, x2, z1, z2) {
  const o = 0.14;
  let s = `<polygon points="${pts(
    [x1, 0, z1],
    [x2, 0, z1],
    [x2, 0, z2],
    [x1, 0, z2]
  )}" fill="#FFFFFF"/>`;
  s += `<polygon points="${pts(
    [x1 + o, 0, z1 + o],
    [x2 - o, 0, z1 + o],
    [x2 - o, 0, z2 - o],
    [x1 + o, 0, z2 - o]
  )}" fill="#D9E9F0"/>`;
  const mx = (x1 + x2) / 2;
  const mz = (z1 + z2) / 2;
  const a = P(mx, 0, z1 + o);
  const b = P(mx, 0, z2 - o);
  const c = P(x1 + o, 0, mz);
  const d = P(x2 - o, 0, mz);
  s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#FFFFFF" stroke-width="2.5"/>`;
  s += `<line x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}" stroke="#FFFFFF" stroke-width="2.5"/>`;
  return s;
}

function lijst(y1, y2, z1, z2, kleur) {
  let s = `<polygon points="${pts(
    [0, y1, z1],
    [0, y2, z1],
    [0, y2, z2],
    [0, y1, z2]
  )}" fill="#FFFFFF" stroke="#DAD5C8" stroke-width="1"/>`;
  s += `<polygon points="${pts(
    [0, y1 + 0.12, z1 + 0.12],
    [0, y2 - 0.12, z1 + 0.12],
    [0, y2 - 0.12, z2 - 0.12],
    [0, y1 + 0.12, z2 - 0.12]
  )}" fill="${kleur}"/>`;
  return s;
}

// ── Meubels (zelfde bouwers als de homepage-scène) ──────────
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
  s += box(-0.1, -0.1, lh, w + 0.2, d + 0.2, 0.16, WOOD);
  const t = lh + 0.16;
  s += box(1.55, 0.4, t, 0.8, 0.3, 0.16, DARK);
  s += box(1.88, 0.5, t + 0.16, 0.12, 0.12, 0.42, DARK);
  s += box(1.15, 0.35, t + 0.5, 1.55, 0.14, 0.92, SCREEN);
  return s;
}

function stoel(rugNaarVoren, zitPal = GREY) {
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
    s += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.5" fill="${DARK[2]}"/>`;
  }
  s += box(cx - 0.13, cy - 0.13, 0.06, 0.26, 0.26, 0.7, DARK);
  s += box(0.1, 0.1, 0.76, 1.5, 1.5, 0.28, zitPal);
  const ry = rugNaarVoren ? 1.36 : 0.12;
  s += box(0.18, ry, 1.04, 1.34, 0.22, 1.45, zitPal);
  return s;
}

function vergaderstoel(rugNaarVoren) {
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
  s += box(0, 0, 0.92, w, d, 0.16, GREY);
  const ry = rugNaarVoren ? d - 0.21 : 0.05;
  s += box(0.05, ry, 1.08, w - 0.1, 0.16, 1.0, GREY);
  return s;
}

function tafel(w = 5, d = 2.6, lh = 1.45) {
  let s = schaduw(w / 2, d / 2, w * 14);
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

// Statafel: hoog blad op een stevige kolom met voetplaat.
function statafel() {
  const w = 2.2,
    d = 2.2,
    lh = 2.1;
  let s = schaduw(w / 2, d / 2, 34);
  s += box(w / 2 - 0.75, d / 2 - 0.75, 0, 1.5, 1.5, 0.12, DARK); // voetplaat
  s += box(w / 2 - 0.2, d / 2 - 0.2, 0.12, 0.4, 0.4, lh - 0.12, DARK); // kolom
  s += box(-0.05, -0.05, lh, w + 0.1, d + 0.1, 0.14, WOOD);
  return s;
}

// Barkruk bij de statafel.
function kruk() {
  const w = 0.85,
    d = 0.85,
    lh = 1.45;
  let s = schaduw(w / 2, d / 2, 14);
  for (const [x, y] of [
    [0.06, 0.06],
    [w - 0.16, 0.06],
    [0.06, d - 0.16],
    [w - 0.16, d - 0.16],
  ])
    s += box(x, y, 0, 0.1, 0.1, lh, DARK);
  s += box(0, 0, lh, w, d, 0.16, GREY);
  return s;
}

function kast(w = 2.3, d = 1.6, h = 3.2, pal = WHITE) {
  let s = schaduw(w / 2, d / 2, 40);
  s += box(0, 0, 0, w, d, h, pal);
  const a = P(w, d / 2, 0.1);
  const b = P(w, d / 2, h - 0.1);
  s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#C4CAD3" stroke-width="1.5"/>`;
  const g1 = P(w, d / 2 - 0.15, h * 0.56);
  const g1b = P(w, d / 2 - 0.15, h * 0.44);
  const g2 = P(w, d / 2 + 0.15, h * 0.56);
  const g2b = P(w, d / 2 + 0.15, h * 0.44);
  s += `<line x1="${g1[0]}" y1="${g1[1]}" x2="${g1b[0]}" y2="${g1b[1]}" stroke="#8A93A1" stroke-width="2.5" stroke-linecap="round"/>`;
  s += `<line x1="${g2[0]}" y1="${g2[1]}" x2="${g2b[0]}" y2="${g2b[1]}" stroke="#8A93A1" stroke-width="2.5" stroke-linecap="round"/>`;
  return s;
}

// Lockerblok: kast met vakkenraster in brandkleuren op de deuren.
function lockers() {
  const w = 3.0,
    d = 1.2,
    h = 2.6;
  let s = schaduw(w / 2, d / 2, 46);
  s += box(0, 0, 0, w, d, h, WHITE);
  // Vakdeuren op het rechtervlak (x=w): 3 kolommen x 2 rijen
  const kleuren = [CYAAN[1], MAGENTA[1], ORANJE[1], GREEN[1], CYAAN[1], ORANJE[1]];
  let k = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const y1 = 0.12 + c * ((d - 0.24) / 3) * 0;
      void y1;
      k++;
    }
  }
  // Deurtjes tekenen als polygonen in het rechtervlak: verdeel d in 3, h in 2.
  k = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const yy1 = 0.1 + (c * (d - 0.2)) / 3 + 0.04;
      const yy2 = 0.1 + ((c + 1) * (d - 0.2)) / 3 - 0.04;
      const zz1 = 0.15 + (r * (h - 0.3)) / 2 + 0.05;
      const zz2 = 0.15 + ((r + 1) * (h - 0.3)) / 2 - 0.05;
      s += `<polygon points="${pts(
        [w, yy1, zz1],
        [w, yy2, zz1],
        [w, yy2, zz2],
        [w, yy1, zz2]
      )}" fill="${kleuren[k % kleuren.length]}" opacity="0.85"/>`;
      k++;
    }
  }
  return s;
}

function plant(schaal = 1) {
  let s = schaduw(0.5, 0.5, 24);
  s += box(0.14, 0.14, 0, 0.72, 0.72, 0.66, ["#C9714E", "#B5603F", "#9C4E31"]);
  s += box(0.08, 0.08, 0.62, 0.84, 0.84, 0.12, ["#D58258", "#C06A45", "#A65636"]);
  const [bx, by] = P(0.5, 0.5, 0.74);
  const blad = (dx, dy, rot, sc, tint) =>
    `<ellipse cx="${(+bx + dx).toFixed(1)}" cy="${(+by + dy).toFixed(1)}" rx="${(
      6.5 * sc
    ).toFixed(1)}" ry="${(19 * sc).toFixed(1)}" fill="${GREEN[tint]}" transform="rotate(${rot} ${(
      +bx + dx
    ).toFixed(1)} ${(+by + dy).toFixed(1)})"/>`;
  const binnen =
    s +
    blad(-15, -9, -52, 0.78, 2) +
    blad(15, -10, 50, 0.8, 2) +
    blad(-9, -15, -26, 1.0, 1) +
    blad(9, -16, 24, 1.02, 1) +
    blad(-3, -24, -8, 1.14, 0) +
    blad(4, -23, 10, 1.1, 0);
  return schaal === 1 ? binnen : `<g transform="scale(${schaal})">${binnen}</g>`;
}

// ── Composities per artikel ─────────────────────────────────
// Elke compositie: { kamer-opties, items: [{bouw, rx, ry, cx, cy}], OX, OY }

const COMPOSITIES = {
  // 1. m² per werkplek: drie identieke werkplekken op een raster, veel vloer.
  "blog-vierkante-meters": {
    KW: 18,
    KD: 10,
    MH: 4.2,
    ramen: [
      [4.5, 8.5, 1.8, 3.4],
      [11.5, 15.5, 1.8, 3.4],
    ],
    lijsten: [[5.0, 6.2, 2.1, 3.1, "#C9D6E0"]],
    OX: 270,
    OY: 128,
    items: [
      { bouw: () => bureau(), rx: 2.0, ry: 1.6, cx: 2, cy: 1.1 },
      { bouw: () => stoel(true), rx: 3.0, ry: 4.2, cx: 0.85, cy: 0.85 },
      { bouw: () => bureau(), rx: 8.6, ry: 1.6, cx: 2, cy: 1.1 },
      { bouw: () => stoel(true), rx: 9.6, ry: 4.2, cx: 0.85, cy: 0.85 },
      { bouw: () => bureau(), rx: 5.3, ry: 5.6, cx: 2, cy: 1.1 },
      { bouw: () => stoel(true), rx: 6.3, ry: 8.2, cx: 0.85, cy: 0.85 },
      { bouw: () => plant(), rx: 0.8, ry: 8.6, cx: 0.5, cy: 0.5 },
      { bouw: () => plant(0.82), rx: 16.8, ry: 0.7, cx: 0.5, cy: 0.5 },
    ],
  },
  // 2. bureaustoel: één stoel groot in beeld bij een bureau.
  "blog-bureaustoel": {
    KW: 11,
    KD: 7.5,
    MH: 4.0,
    ramen: [[5.6, 9.4, 1.7, 3.3]],
    lijsten: [
      [2.6, 3.6, 2.0, 3.0, "#D8C3CF"],
      [4.0, 4.8, 1.8, 2.6, "#C9D6E0"],
    ],
    OX: 250,
    OY: 120,
    items: [
      { bouw: () => bureau(), rx: 3.4, ry: 1.5, cx: 2, cy: 1.1 },
      { bouw: () => `<g transform="scale(1.35)">${stoel(true, CYAAN)}</g>`, rx: 4.3, ry: 4.6, cx: 1.1, cy: 1.1 },
      { bouw: () => plant(), rx: 0.7, ry: 6.2, cx: 0.5, cy: 0.5 },
      { bouw: () => plant(0.8), rx: 9.9, ry: 0.6, cx: 0.5, cy: 0.5 },
    ],
  },
  // 3. opbergen: kastenwand + lockers met kleurvakken.
  "blog-opbergen": {
    KW: 14,
    KD: 8,
    MH: 4.2,
    ramen: [[9.6, 13.0, 1.8, 3.4]],
    lijsten: [[4.6, 5.6, 2.0, 3.0, "#D8C3CF"]],
    OX: 255,
    OY: 125,
    items: [
      { bouw: () => kast(2.3, 1.6, 3.2), rx: 0.4, ry: 0.9, cx: 1.15, cy: 0.8 },
      { bouw: () => kast(2.3, 1.6, 3.2), rx: 3.1, ry: 0.9, cx: 1.15, cy: 0.8 },
      { bouw: () => lockers(), rx: 6.2, ry: 1.1, cx: 1.5, cy: 0.6 },
      { bouw: () => kast(2.6, 1.4, 1.7), rx: 9.0, ry: 4.6, cx: 1.3, cy: 0.7 },
      { bouw: () => plant(0.85), rx: 12.2, ry: 4.4, cx: 0.5, cy: 0.5 },
      { bouw: () => plant(), rx: 0.8, ry: 6.6, cx: 0.5, cy: 0.5 },
    ],
  },
  // 4. tafels: vergadertafel + statafel met krukken (hoogteverschil zichtbaar).
  "blog-tafelhoogtes": {
    KW: 15,
    KD: 8.5,
    MH: 4.2,
    ramen: [
      [3.0, 6.4, 1.8, 3.4],
      [9.4, 13.4, 1.8, 3.4],
    ],
    lijsten: [[4.8, 5.8, 2.0, 3.0, "#C9D6E0"]],
    OX: 258,
    OY: 124,
    items: [
      { bouw: () => tafel(4.6, 2.4, 1.45), rx: 1.6, ry: 3.6, cx: 2.3, cy: 1.2 },
      { bouw: () => vergaderstoel(false), rx: 2.6, ry: 2.2, cx: 0.6, cy: 0.6 },
      { bouw: () => vergaderstoel(false), rx: 4.4, ry: 2.2, cx: 0.6, cy: 0.6 },
      { bouw: () => vergaderstoel(true), rx: 2.8, ry: 6.4, cx: 0.6, cy: 0.6 },
      { bouw: () => vergaderstoel(true), rx: 4.6, ry: 6.4, cx: 0.6, cy: 0.6 },
      { bouw: () => statafel(), rx: 9.8, ry: 4.4, cx: 1.1, cy: 1.1 },
      { bouw: () => kruk(), rx: 8.5, ry: 4.9, cx: 0.4, cy: 0.4 },
      { bouw: () => kruk(), rx: 12.4, ry: 5.0, cx: 0.4, cy: 0.4 },
      { bouw: () => plant(), rx: 13.8, ry: 0.7, cx: 0.5, cy: 0.5 },
    ],
  },
};

// ── Render ──────────────────────────────────────────────────
// Alles wordt eerst op oorsprong (0,0) opgebouwd; daarna berekenen we de
// schermafmetingen van de kamer analytisch en schalen/centreren we de hele
// groep zodat elke compositie het 3:2-canvas netjes vult.
const W = 1200,
  H = 800,
  MARGE = 70;

for (const [naam, c] of Object.entries(COMPOSITIES)) {
  const gesorteerd = [...c.items].sort(
    (a, b) => a.rx + a.cx + (a.ry + a.cy) - (b.rx + b.cx + b.ry + b.cy)
  );
  let scene = `<g>${kamer(c.KW, c.KD, c.MH, c)}</g>`;
  for (const m of gesorteerd) {
    const [sx, sy] = P(m.rx, m.ry, 0);
    scene += `<g transform="translate(${sx},${sy})">${m.bouw()}</g>`;
  }
  // Schermgrenzen van de kamer (de meubels vallen daarbinnen)
  const minX = -c.KD * COS * S;
  const maxX = c.KW * COS * S;
  const minY = -c.MH * S;
  const maxY = (c.KW + c.KD) * SIN * S + 0.18 * S;
  const bw = maxX - minX;
  const bh = maxY - minY;
  const k = Math.min((W - 2 * MARGE) / bw, (H - 2 * MARGE) / bh);
  const tx = (W - bw * k) / 2 - minX * k;
  const ty = (H - bh * k) / 2 - minY * k;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#FAFAF7"/>
<g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${k.toFixed(3)})">${scene}</g>
</svg>`;
  await sharp(Buffer.from(svg), { density: 96 })
    .png()
    .toFile(`public/beelden/${naam}.png`);
  console.log(`geschreven: public/beelden/${naam}.png`);
}
