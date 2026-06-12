// Bouwt een isometrische kantoor-scène als SVG en rastert die naar PNG zodat we
// het resultaat kunnen bekijken voordat we het in een React-component gieten.
//
// Isometrische projectie: x loopt naar rechts-onder, y naar links-onder, z omhoog.
//   P(x,y,z) = [ (x - y)*cos30*S , (x + y)*sin30*S - z*S ]
//
// De scène is een echte kamerhoek: twee wanden, een vloerplaat met tegellijnen
// en plinten, ramen, en alle meubels op ÉÉN gedeeld grondraster (kamercoördi-
// naten). Daardoor staan stoelen echt aan tafels en kasten echt tegen de muur.

import sharp from "sharp";
import { writeFileSync } from "node:fs";

const S = 26; // pixels per iso-eenheid
const COS = Math.cos(Math.PI / 6);
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

const WOOD = ["#E8D5BC", "#D3BA96", "#BC9E78"];
const WHITE = ["#FFFFFF", "#EBEEF2", "#D7DCE3"];
const DARK = ["#434954", "#31363F", "#23272E"];
const GREY = ["#CCD1D9", "#B4BAC5", "#9BA2AE"];
const GREEN = ["#3DBE74", "#2FA862", "#268A50"];
const SCREEN = ["#3A4A66", "#2E3A52", "#222B3D"];

function schaduw(cx, cy, rx) {
  const [px, py] = P(cx, cy, 0);
  return `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${(rx * 0.5).toFixed(
    1
  )}" fill="#1a1a2e" opacity="0.08"/>`;
}

// ── De kamer: wanden, vloerplaat, raam, plinten ─────────────
const KW = 20; // kamerbreedte (x)
const KD = 9; // kamerdiepte (y)
const MH = 4.3; // muurhoogte (z)

function raam(x1, x2, z1, z2) {
  const o = 0.14; // kozijnbreedte
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
  // Roedes (kruis in het raam)
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

// Lijstje (kunst) aan de linkermuur (x=0-vlak).
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

function kamer() {
  let s = "";
  // Achtermuur (y=0) en linkermuur (x=0)
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
  // Hoeklijn
  const h1 = P(0, 0, 0);
  const h2 = P(0, 0, MH);
  s += `<line x1="${h1[0]}" y1="${h1[1]}" x2="${h2[0]}" y2="${h2[1]}" stroke="#E0DCD0" stroke-width="1.5"/>`;
  // Ramen in de achtermuur + kunst aan de linkermuur
  s += raam(6.0, 9.0, 1.8, 3.4);
  s += raam(13.4, 18.6, 1.7, 3.5);
  s += lijst(4.2, 5.2, 2.2, 3.2, "#D8C3CF");
  s += lijst(5.6, 6.4, 1.9, 2.8, "#C9D6E0");
  // Vloerplaat (dun, met zichtbare rand aan de voorkant)
  s += box(0, 0, -0.18, KW, KD, 0.18, ["#EFEBE1", "#DCD7C9", "#D2CDBF"]);
  // Tegellijnen
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
  // Plinten langs beide wanden
  const p0 = P(0, 0, 0);
  const px = P(KW, 0, 0);
  const py = P(0, KD, 0);
  s += `<line x1="${p0[0]}" y1="${p0[1]}" x2="${px[0]}" y2="${px[1]}" stroke="#DBD6C8" stroke-width="2.5"/>`;
  s += `<line x1="${p0[0]}" y1="${p0[1]}" x2="${py[0]}" y2="${py[1]}" stroke="#D6D1C3" stroke-width="2.5"/>`;
  return s;
}

// ── Meubelstukken (lokale iso-coördinaten vanaf hun eigen oorsprong) ──
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
  const t = lh + 0.16;
  s += box(1.55, 0.4, t, 0.8, 0.3, 0.16, DARK); // monitorvoet
  s += box(1.88, 0.5, t + 0.16, 0.12, 0.12, 0.42, DARK); // nek
  s += box(1.15, 0.35, t + 0.5, 1.55, 0.14, 0.92, SCREEN); // scherm
  return s;
}

// Bureaustoel. rugNaarVoren=true: rugleuning aan de kijkerszijde, dus de stoel
// kijkt het beeld in (naar het bureau toe).
function stoel(rugNaarVoren) {
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
  s += box(cx - 0.13, cy - 0.13, 0.06, 0.26, 0.26, 0.7, DARK); // gasveer
  s += box(0.1, 0.1, 0.76, 1.5, 1.5, 0.28, GREY); // zitting
  const ry = rugNaarVoren ? 1.36 : 0.12;
  s += box(0.18, ry, 1.04, 1.34, 0.22, 1.45, GREY); // rugleuning
  return s;
}

// Vergaderstoel: vier poten, geen wieltjes. rugNaarVoren idem.
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
  s += box(0, 0, 0.92, w, d, 0.16, GREY); // zitting
  const ry = rugNaarVoren ? d - 0.21 : 0.05;
  s += box(0.05, ry, 1.08, w - 0.1, 0.16, 1.0, GREY); // rugleuning
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

function wand() {
  const w = 3.2,
    d = 0.24,
    h = 1.9;
  let s = schaduw(w / 2, 0.5, 48);
  s += box(0.1, -0.25, 0, 0.5, 0.7, 0.34, DARK);
  s += box(w - 0.6, -0.25, 0, 0.5, 0.7, 0.34, DARK);
  s += box(0, 0, 0.34, w, d, h, GREY);
  return s;
}

function plant() {
  let s = schaduw(0.5, 0.5, 24);
  s += box(0.14, 0.14, 0, 0.72, 0.72, 0.66, ["#C9714E", "#B5603F", "#9C4E31"]);
  s += box(0.08, 0.08, 0.62, 0.84, 0.84, 0.12, ["#D58258", "#C06A45", "#A65636"]); // rand
  const [bx, by] = P(0.5, 0.5, 0.74);
  const blad = (dx, dy, rot, sc, tint) =>
    `<ellipse cx="${(+bx + dx).toFixed(1)}" cy="${(+by + dy).toFixed(1)}" rx="${(
      6.5 * sc
    ).toFixed(1)}" ry="${(19 * sc).toFixed(1)}" fill="${GREEN[tint]}" transform="rotate(${rot} ${(
      +bx + dx
    ).toFixed(1)} ${(+by + dy).toFixed(1)})"/>`;
  return (
    s +
    blad(-15, -9, -52, 0.78, 2) +
    blad(15, -10, 50, 0.8, 2) +
    blad(-9, -15, -26, 1.0, 1) +
    blad(9, -16, 24, 1.02, 1) +
    blad(-3, -24, -8, 1.14, 0) +
    blad(4, -23, 10, 1.1, 0)
  );
}

// ── Scène-indeling op het kamerraster ───────────────────────
// rx/ry = positie (oorsprong meubel) in kamercoördinaten.
// cx/cy = middelpunt van de voetafdruk (voor tekenvolgorde + gloed).
// lx/ly = label-anker in lokale pixels (t.o.v. de meubel-oorsprong).
const ITEMS = [
  {
    naam: "Kasten & opbergen",
    kleur: "#F29828",
    bouw: () => kast(),
    rx: 0.3,
    ry: 1.2,
    cx: 1.15,
    cy: 0.8,
    lx: 25,
    ly: -100,
  },
  {
    naam: "Bureaus",
    kleur: "#A1367E",
    bouw: () => bureau(),
    rx: 4.8,
    ry: 3.8,
    cx: 2,
    cy: 1.1,
    lx: 68,
    ly: -92,
  },
  {
    naam: "Bureaustoelen",
    kleur: "#01B6E3",
    bouw: () => stoel(true),
    rx: 5.8,
    ry: 6.4,
    cx: 0.85,
    cy: 0.85,
    lx: 5,
    ly: 80,
  },
  {
    naam: "Accessoires",
    kleur: "#6E4B9E",
    bouw: () => wand(),
    rx: 9.4,
    ry: 0.9,
    cx: 1.6,
    cy: 0.12,
    lx: 61,
    ly: -74,
  },
  {
    naam: "Tafels",
    kleur: "#009D46",
    bouw: () => tafel(),
    rx: 12.8,
    ry: 4.0,
    cx: 2.5,
    cy: 1.3,
    lx: 130,
    ly: 110,
  },
  {
    naam: "", // tweede vergaderstoel: geen eigen label
    kleur: "#01B6E3",
    bouw: () => vergaderstoel(false),
    rx: 14.2,
    ry: 2.6,
    cx: 0.6,
    cy: 0.6,
    lx: 0,
    ly: 0,
  },
  {
    naam: "Vergaderstoelen",
    kleur: "#01B6E3",
    bouw: () => vergaderstoel(true),
    rx: 15.6,
    ry: 6.9,
    cx: 0.6,
    cy: 0.6,
    lx: 0,
    ly: 82,
  },
  // Decoratie (geen label, geen link in het component)
  {
    naam: "",
    kleur: "",
    bouw: () => plant(),
    rx: 0.8,
    ry: 7.5,
    cx: 0.5,
    cy: 0.5,
    lx: 0,
    ly: 0,
  },
  {
    naam: "",
    kleur: "",
    bouw: () => `<g transform="scale(0.82)">${plant()}</g>`,
    rx: 18.7,
    ry: 0.6,
    cx: 0.5,
    cy: 0.5,
    lx: 0,
    ly: 0,
  },
];

// Globale verschuiving zodat de kamer netjes in de viewBox valt.
const OX = 240;
const OY = 130;

// Achter-naar-voor tekenen: sorteer op (x+y) van het voetafdruk-middelpunt.
const gesorteerd = [...ITEMS].sort(
  (a, b) => a.rx + a.cx + (a.ry + a.cy) - (b.rx + b.cx + b.ry + b.cy)
);

let scene = "";
for (const m of gesorteerd) {
  const [sx, sy] = P(m.rx, m.ry, 0);
  const tx = (+sx + OX).toFixed(1);
  const ty = (+sy + OY).toFixed(1);
  scene += `<g transform="translate(${tx},${ty})">${m.bouw()}`;
  if (m.naam)
    scene += `<text x="${m.lx}" y="${m.ly}" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="${m.kleur}">${m.naam.replace(/&/g, "&amp;")}</text>`;
  scene += `</g>`;
}

const W = 740,
  H = 530;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#F7F7F4"/>
<g transform="translate(${OX},${OY})">${kamer()}</g>
${scene}
</svg>`;

writeFileSync(new URL("./iso-scene-preview.svg", import.meta.url), svg);
await sharp(Buffer.from(svg)).png().toFile(
  new URL("./iso-scene-preview.png", import.meta.url).pathname.replace(/^\//, "")
);
console.log("preview geschreven: scripts/iso-scene-preview.png");
