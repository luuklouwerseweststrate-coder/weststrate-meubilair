// Line-iconen per productsoort voor de navigatie (megamenu).
//
// Strakke lijntekeningen (stroke = currentColor, viewBox 24×24) zodat ze
// meekleuren met de tekst/tegel en op elke grootte scherp blijven. De sleutel
// komt uit subIcoon() in lib/categorieen.ts. Onbekende sleutels vallen terug op
// een neutraal meubel-icoon, zodat er nooit een gat valt.

interface Props {
  naam: string; // pictogram-sleutel, bv. "bureau", "stoel", "kast"
  className?: string;
  style?: React.CSSProperties; // bv. color overschrijven met de categoriekleur
}

// Gedeelde stroke-eigenschappen — één plek, consistente look. Iets steviger
// (1.8) dan eerst, zodat de iconen ook klein genoeg "lichaam" houden.
const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Elk icoon is een set <path>/<rect> binnen een 24×24 kader. Bewust in
// zij-aanzicht getekend waar dat een meubel herkenbaarder maakt dan bovenaanzicht.
const ICONEN: Record<string, JSX.Element> = {
  // Bureau (zij-aanzicht): blad op twee poten
  bureau: (
    <>
      <path d="M3 9h18" {...stroke} />
      <path d="M5 9v10M19 9v10" {...stroke} />
    </>
  ),
  // Zit-sta bureau: blad met dubbele pijl (elektrisch in hoogte verstelbaar)
  zitsta: (
    <>
      <path d="M4 11h16" {...stroke} />
      <path d="M6.5 11v8M17.5 11v8" {...stroke} />
      <path d="M12 3.5v5M9.8 5.5L12 3.3l2.2 2.2" {...stroke} />
    </>
  ),
  // Benchbureau: twee bladen rug-aan-rug op een gedeeld middenframe
  bench: (
    <>
      <path d="M2 9h20" {...stroke} />
      <path d="M12 9v10" {...stroke} />
      <path d="M5 9v4M19 9v4" {...stroke} />
      <path d="M3 19h7M14 19h7" {...stroke} />
    </>
  ),
  // Flex/dynamisch werken (terugval): cirkelpijl (beweging)
  flex: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" {...stroke} />
      <path d="M20 4v4h-4" {...stroke} />
    </>
  ),
  // Bureaustoel (zij-aanzicht): rugleuning, zitting, gasveer, sterpoot
  bureaustoel: (
    <>
      <path d="M9 4v6" {...stroke} />
      <path d="M9 10h6v3H7l1-3" {...stroke} />
      <path d="M11 13v4" {...stroke} />
      <path d="M7 20l4-3 4 3" {...stroke} />
    </>
  ),
  // Stoel (vergaderstoel, zij-aanzicht): rugleuning + zitting + vier poten
  stoel: (
    <>
      <path d="M8 4v8" {...stroke} />
      <path d="M8 12h8" {...stroke} />
      <path d="M8 8h6" {...stroke} />
      <path d="M9 12v8M15 12v8" {...stroke} />
    </>
  ),
  // Kruk / terras-kantinestoel: ronde zitting op schuine poten
  kruk: (
    <>
      <ellipse cx="12" cy="8" rx="6" ry="2" {...stroke} />
      <path d="M7.5 9.5L6 20M16.5 9.5L18 20" {...stroke} />
      <path d="M8 15h8" {...stroke} />
    </>
  ),
  // Tafel (vergadertafel): ovaal blad met poten
  tafel: (
    <>
      <ellipse cx="12" cy="8" rx="9" ry="2.5" {...stroke} />
      <path d="M5 9.5v9M19 9.5v9M9.5 10.4v8.6M14.5 10.4v8.6" {...stroke} />
    </>
  ),
  // Klaptafel: blad met inklapbare (schuine) poten
  klaptafel: (
    <>
      <path d="M3 8h18" {...stroke} />
      <path d="M6 8l3 11M18 8l-3 11" {...stroke} />
      <path d="M8.5 14.5h7" {...stroke} />
    </>
  ),
  // Kast: rechthoek met dubbele deur en grepen
  kast: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" {...stroke} />
      <path d="M12 3.5v17" {...stroke} />
      <path d="M10 10.5v3M14 10.5v3" {...stroke} />
    </>
  ),
  // Ladenblok: drie lades met grepen
  ladenblok: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="1.5" {...stroke} />
      <path d="M6 9.3h12M6 14.6h12" {...stroke} />
      <path d="M10 6.6h4M10 11.9h4M10 17.3h4" {...stroke} />
    </>
  ),
  // Kabelmanagement: gegolfde kabel naar een stekker
  kabel: (
    <>
      <path d="M3 8c3.5 0 3.5 5 7 5s3.5-5 7-5" {...stroke} />
      <path d="M17 13v3M21 13v3M16 16h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" {...stroke} />
    </>
  ),
  // Scheidingswand: staand paneel met voet
  wand: (
    <>
      <rect x="6" y="4" width="12" height="12" rx="1.5" {...stroke} />
      <path d="M12 16v4" {...stroke} />
      <path d="M8.5 20h7" {...stroke} />
    </>
  ),
  // Componenten: in elkaar grijpende onderdelen
  component: (
    <>
      <rect x="3.5" y="3.5" width="8" height="8" rx="1.5" {...stroke} />
      <rect x="12.5" y="12.5" width="8" height="8" rx="1.5" {...stroke} />
      <path d="M11.5 7.5h4a1 1 0 0 1 1 1v4" {...stroke} />
    </>
  ),
  // Terugval: neutraal meubel (kast met pootjes)
  meubel: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" {...stroke} />
      <path d="M7 16v3M17 16v3" {...stroke} />
    </>
  ),
};

export default function CategorieIcon({ naam, className, style }: Props) {
  const inhoud = ICONEN[naam] ?? ICONEN.meubel;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      {inhoud}
    </svg>
  );
}
