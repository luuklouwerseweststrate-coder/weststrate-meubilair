import { slugify } from "@/lib/types";

// Interactieve isometrische kantoor-scène voor de homepage. Elk meubelstuk is een
// eigen klikbare link naar zijn hoofdcategorie. Bij hover/focus licht het meubel
// op (omhoog + gekleurde gloed onder zich) en kleurt het label mee met de
// categoriekleur. Volledig server-side gerenderd; de hover-effecten zijn pure CSS
// (Tailwind group-hover), dus er is geen client-side JavaScript nodig.
//
// De meubels zijn opgebouwd uit isometrische "dozen" (top + 2 zijvlakken in drie
// tinten). Zie scripts/iso-scene.mjs voor de preview-tooling waarmee dit is
// uitgelijnd.

const S = 26;
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

const P = (x: number, y: number, z: number): [string, string] => [
  ((x - y) * COS * S).toFixed(1),
  ((x + y) * SIN * S - z * S).toFixed(1),
];
const pts = (...c: [number, number, number][]) =>
  c.map(([x, y, z]) => P(x, y, z).join(",")).join(" ");

type Pal = readonly [string, string, string];

// Eén doos: linker-, rechter- en bovenvlak (lichtste bovenop).
function box(
  ox: number,
  oy: number,
  oz: number,
  w: number,
  d: number,
  h: number,
  pal: Pal
) {
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

function schaduw(cx: number, cy: number, rx: number) {
  const [px, py] = P(cx, cy, 0);
  return `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${(rx * 0.5).toFixed(
    1
  )}" fill="#1a1a2e" opacity="0.10"/>`;
}

const WOOD: Pal = ["#E8D5BC", "#D3BA96", "#BC9E78"];
const WHITE: Pal = ["#FFFFFF", "#EBEEF2", "#D7DCE3"];
const DARK: Pal = ["#434954", "#31363F", "#23272E"];
const GREY: Pal = ["#CCD1D9", "#B4BAC5", "#9BA2AE"];

// ── Meubelstukken (geven rauwe SVG-markup terug) ──────────────
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
  return s;
}

function stoel() {
  let s = schaduw(0.75, 0.75, 30);
  const c = P(0.75, 0.75, 0.06);
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
  s += box(0.62, 0.62, 0.06, 0.26, 0.26, 0.78, DARK);
  s += box(-0.1, -0.1, 0.84, 1.7, 1.7, 0.34, GREY);
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
  const w = 3.2,
    d = 0.24,
    h = 1.9;
  let s = schaduw(w / 2, 0.5, 48);
  s += box(0.1, -0.25, 0, 0.5, 0.7, 0.34, DARK);
  s += box(w - 0.6, -0.25, 0, 0.5, 0.7, 0.34, DARK);
  s += box(0, 0, 0.34, w, d, h, GREY);
  return s;
}

// Per hoofdcategorie: bouwer, plek (translate) en het middelpunt van de
// grondgloed (lokale iso-coördinaten → schermpunt).
const SOORTEN: Record<
  string,
  { bouw: () => string; tx: number; ty: number; gx: number; gy: number }
> = {
  Bureaus: { bouw: bureau, tx: 345, ty: 290, gx: 2, gy: 1.1 },
  Stoelen: { bouw: stoel, tx: 660, ty: 330, gx: 0.75, gy: 0.75 },
  Tafels: { bouw: tafel, tx: 470, ty: 175, gx: 2.5, gy: 1.3 },
  "Kasten & opbergen": { bouw: kast, tx: 175, ty: 205, gx: 1.15, gy: 0.8 },
  Accessoires: { bouw: accessoire, tx: 845, ty: 245, gx: 1.6, gy: 0.1 },
};

export interface SceneCategorie {
  hoofd: string;
  kleur: string;
}

export default function KantoorScene({
  categorieen,
}: {
  categorieen: SceneCategorie[];
}) {
  // Alleen categorieën waarvoor we een meubel hebben; van achter naar voren
  // tekenen (op ty) voor de juiste overlap.
  const items = categorieen
    .filter((c) => SOORTEN[c.hoofd])
    .map((c) => ({ ...c, ...SOORTEN[c.hoofd] }))
    .sort((a, b) => a.ty - b.ty);

  return (
    <svg
      viewBox="0 0 1100 470"
      className="h-auto w-full"
      role="group"
      aria-label="Kies een categorie door op een meubelstuk te klikken"
    >
      {/* Zachte vloer */}
      <ellipse cx="540" cy="285" rx="470" ry="150" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="540" cy="295" rx="430" ry="125" fill="#EFEFEA" opacity="0.9" />

      {items.map((m) => {
        const slug = slugify(m.hoofd);
        const [gx, gy] = P(m.gx, m.gy, 0);
        const [lx, ly] = P(m.gx, m.gy, 0); // labelanker = footprint-midden
        return (
          <a
            key={m.hoofd}
            href={`/catalogus#${slug}`}
            className="group cursor-pointer outline-none"
            aria-label={`${m.hoofd} bekijken`}
          >
            <g transform={`translate(${m.tx},${m.ty})`}>
              {/* Gekleurde gloed onder het meubel (alleen bij hover/focus) */}
              <ellipse
                cx={gx}
                cy={gy}
                rx="70"
                ry="32"
                fill={m.kleur}
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-20 group-focus-visible:opacity-20"
              />
              {/* Het meubel zelf — licht omhoog bij hover */}
              <g
                className="transition-transform duration-300 ease-out group-hover:[transform:translateY(-10px)] group-focus-visible:[transform:translateY(-10px)]"
                dangerouslySetInnerHTML={{ __html: m.bouw() }}
              />
              {/* Label: neutraal, kleurt mee bij hover */}
              <text
                x={lx}
                y={+ly + 54}
                textAnchor="middle"
                className="fill-ink-2 transition-colors duration-300 group-hover:[fill:var(--c)] group-focus-visible:[fill:var(--c)]"
                style={{ ["--c" as string]: m.kleur }}
                fontSize="15"
                fontWeight="700"
              >
                {m.hoofd}
              </text>
            </g>
          </a>
        );
      })}
    </svg>
  );
}
