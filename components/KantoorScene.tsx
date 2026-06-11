// Interactieve isometrische kantoor-scène voor de homepage. De scène is een
// ingerichte kantoorhoek: de bureaustoel staat vóór het bureau (één werkplek),
// de vergadertafel staat met vergaderstoelen in een eigen hoek, de kast
// links-achter en de scheidingswand verdeelt de ruimte. Een plant geeft sfeer.
//
// Elk MEUBELSTUK is een eigen klikbare link naar zijn hoofdcategorie. Bij
// hover/focus licht het meubel op (omhoog + gekleurde gloed onder zich) en
// kleurt het label mee. Sfeer-elementen (plant, vergaderstoelen) zijn decoratie
// en niet klikbaar. Volledig server-side gerenderd; de hover-effecten zijn pure
// CSS (Tailwind group-hover), dus er is geen client-side JavaScript nodig.
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
const GREEN: Pal = ["#3DBE74", "#2FA862", "#268A50"];
const SCREEN: Pal = ["#3A4A66", "#2E3A52", "#222B3D"];

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
  s += box(-0.1, -0.1, lh, w + 0.2, d + 0.2, 0.16, WOOD); // blad
  // Bureau-accessoires op het blad (horen bij het bureau, liften dus mee).
  const t = lh + 0.16;
  s += box(1.5, 0.35, t, 0.8, 0.3, 0.16, DARK); // monitorvoet
  s += box(1.83, 0.45, t + 0.16, 0.12, 0.12, 0.42, DARK); // nek
  s += box(1.1, 0.3, t + 0.5, 1.55, 0.14, 0.92, SCREEN); // scherm
  return s;
}

function stoel() {
  // Bureaustoel: stervoet met wieltjes, gasveer, zitting en hoge rugleuning.
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
  s += box(0.18, 0.12, 1.04, 1.34, 0.22, 1.45, GREY); // rugleuning (achter)
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

// ── Sfeer (niet-klikbare decoratie) ─────────────────────────
function plant() {
  let s = schaduw(0.5, 0.5, 26);
  s += box(0.18, 0.18, 0, 0.64, 0.64, 0.7, ["#C9714E", "#B5603F", "#9C4E31"]);
  const [bx, by] = P(0.5, 0.5, 0.7);
  const blad = (dx: number, dy: number, rot: number, sc: number) =>
    `<ellipse cx="${(+bx + dx).toFixed(1)}" cy="${(+by + dy).toFixed(1)}" rx="${(
      7 * sc
    ).toFixed(1)}" ry="${(20 * sc).toFixed(1)}" fill="${
      GREEN[Math.abs(Math.round(dx)) % 2]
    }" transform="rotate(${rot} ${(+bx + dx).toFixed(1)} ${(+by + dy).toFixed(
      1
    )})"/>`;
  return (
    s +
    blad(-8, -16, -24, 1) +
    blad(8, -18, 22, 1.05) +
    blad(0, -26, 0, 1.15) +
    blad(-14, -10, -48, 0.8) +
    blad(14, -12, 46, 0.82)
  );
}

// De klikbare punten in de scène. Elk punt is een eigen meubel met een eigen
// bestemming. Stoelen splitsen we bewust: de bureaustoel (aan het bureau) gaat
// naar de subcategorie Bureaustoelen, de vergaderstoelen (aan de tafel) naar
// Vergaderstoelen. De overige categorieën linken naar hun hoofd-sectie op de
// catalogus, waar je alle subcategorieën ziet.
//
// Velden: bouw = meubel-tekenaar, tx/ty = plek (translate), gx/gy = midden van
// de grondgloed (lokale iso-coördinaten), href = bestemming, kleur = accent,
// label = tekst onder het meubel (leeg = geen label, bv. de 2e vergaderstoel).
interface Klikpunt {
  id: string;
  label: string;
  href: string;
  kleur: string;
  bouw: () => string;
  tx: number;
  ty: number;
  gx: number;
  gy: number;
}

const KLIKPUNTEN: Klikpunt[] = [
  // Layout = ingerichte hoek: kast links-achter, werkplek (bureau + bureaustoel)
  // in het midden, scheidingswand als verdeler, vergadertafel + stoelen rechts.
  {
    id: "kasten",
    label: "Kasten & opbergen",
    href: "/catalogus#kasten-opbergen",
    kleur: "#F29828",
    bouw: kast,
    tx: 215,
    ty: 150,
    gx: 1.15,
    gy: 0.8,
  },
  {
    id: "bureaus",
    label: "Bureaus",
    href: "/catalogus#bureaus",
    kleur: "#A1367E",
    bouw: bureau,
    tx: 360,
    ty: 235,
    gx: 2,
    gy: 1.1,
  },
  {
    id: "bureaustoelen",
    label: "Bureaustoelen",
    href: "/catalogus/bureaustoelen",
    kleur: "#01B6E3",
    bouw: stoel,
    tx: 470,
    ty: 330,
    gx: 0.85,
    gy: 0.85,
  },
  {
    id: "accessoires",
    label: "Accessoires",
    href: "/catalogus#accessoires",
    kleur: "#6E4B9E",
    bouw: accessoire,
    tx: 660,
    ty: 165,
    gx: 1.6,
    gy: 0.1,
  },
  {
    id: "tafels",
    label: "Tafels",
    href: "/catalogus#tafels",
    kleur: "#009D46",
    bouw: tafel,
    tx: 760,
    ty: 270,
    gx: 2.5,
    gy: 1.3,
  },
  {
    id: "vergaderstoelen",
    label: "Vergaderstoelen",
    href: "/catalogus/vergaderstoelen",
    kleur: "#01B6E3",
    bouw: vergaderstoel,
    tx: 690,
    ty: 360,
    gx: 0.6,
    gy: 0.6,
  },
  {
    // Tweede vergaderstoel: zelfde bestemming, zonder eigen label (anders dubbel).
    id: "vergaderstoelen-2",
    label: "",
    href: "/catalogus/vergaderstoelen",
    kleur: "#01B6E3",
    bouw: vergaderstoel,
    tx: 895,
    ty: 350,
    gx: 0.6,
    gy: 0.6,
  },
];

export default function KantoorScene() {
  // Van achter naar voren tekenen (op ty) voor de juiste overlap.
  const items = [...KLIKPUNTEN].sort((a, b) => a.ty - b.ty);

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

      {/* Plant — sfeer, niet klikbaar */}
      <g
        transform="translate(250,330)"
        dangerouslySetInnerHTML={{ __html: plant() }}
      />

      {items.map((m) => {
        const [gx, gy] = P(m.gx, m.gy, 0);
        return (
          <a
            key={m.id}
            href={m.href}
            className="group cursor-pointer outline-none"
            aria-label={`${m.label || "Vergaderstoelen"} bekijken`}
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
              {m.label && (
                <text
                  x={0}
                  y={60}
                  textAnchor="middle"
                  className="fill-ink-2 transition-colors duration-300 group-hover:[fill:var(--c)] group-focus-visible:[fill:var(--c)]"
                  style={{ ["--c" as string]: m.kleur }}
                  fontSize="15"
                  fontWeight="700"
                >
                  {m.label}
                </text>
              )}
            </g>
          </a>
        );
      })}
    </svg>
  );
}
