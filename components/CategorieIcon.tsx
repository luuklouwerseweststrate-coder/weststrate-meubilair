// Line-iconen per productsoort voor de navigatie (megamenu + mobiel menu).
//
// Bewust simpele, strakke lijntekeningen (stroke = currentColor, viewBox 24×24)
// zodat ze meekleuren met de tekst en op elke grootte scherp blijven. De sleutel
// komt uit subIcoon() in lib/categorieen.ts. Onbekende sleutels vallen terug op
// een neutraal meubel-icoon, zodat er nooit een gat valt.

interface Props {
  naam: string; // pictogram-sleutel, bv. "bureau", "stoel", "kast"
  className?: string;
  style?: React.CSSProperties; // bv. color overschrijven met de categoriekleur
}

// Gedeelde stroke-eigenschappen — één plek, consistente look.
const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Elk icoon is een set <path>/<line> binnen een 24×24 kader.
const ICONEN: Record<string, JSX.Element> = {
  // Bureau: blad met twee poten
  bureau: (
    <>
      <path d="M3 8h18" {...stroke} />
      <path d="M5 8v11M19 8v11" {...stroke} />
      <path d="M3 8l2-3h14l2 3" {...stroke} />
    </>
  ),
  // Zit-sta bureau: bureau met dubbele pijl (hoogteverstelling)
  zitsta: (
    <>
      <path d="M4 9h16" {...stroke} />
      <path d="M6 9v9M18 9v9" {...stroke} />
      <path d="M12 4v4M10 5.5l2-2 2 2M12 22v-4M10 20.5l2 2 2-2" {...stroke} />
    </>
  ),
  // Flex/dynamisch werken: cirkelpijl (beweging)
  flex: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" {...stroke} />
      <path d="M20 4v4h-4" {...stroke} />
    </>
  ),
  // Bureaustoel: rugleuning, zitting, gasveer, voet met wieltjes
  bureaustoel: (
    <>
      <path d="M8 4v7M8 7h6a2 2 0 0 1 2 2v2" {...stroke} />
      <path d="M6 13h10l-1 4H7l-1-4z" {...stroke} />
      <path d="M11 17v3M7 21l4-1 4 1" {...stroke} />
    </>
  ),
  // Stoel (vergaderstoel): rechte vierpoot met rugleuning
  stoel: (
    <>
      <path d="M7 4v9M7 9h10V4" {...stroke} />
      <path d="M6 13h12" {...stroke} />
      <path d="M8 13v7M16 13v7" {...stroke} />
    </>
  ),
  // Kruk/terras-kantinestoel: zitting met schuine poten
  kruk: (
    <>
      <path d="M7 5h10l-1 4H8L7 5z" {...stroke} />
      <path d="M8 9l-2 11M16 9l2 11M7 15h10" {...stroke} />
    </>
  ),
  // Tafel (vergadertafel): ovaal blad met poten
  tafel: (
    <>
      <ellipse cx="12" cy="8" rx="9" ry="2.5" {...stroke} />
      <path d="M5 9v10M19 9v10M9 10v9M15 10v9" {...stroke} />
    </>
  ),
  // Klaptafel: blad met inklapbare poten (schuin)
  klaptafel: (
    <>
      <path d="M3 8h18" {...stroke} />
      <path d="M6 8l3 11M18 8l-3 11" {...stroke} />
      <path d="M8.5 15h7" {...stroke} />
    </>
  ),
  // Kast: rechthoek met deuren en handgrepen
  kast: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" {...stroke} />
      <path d="M12 3v18" {...stroke} />
      <path d="M10 11v2M14 11v2" {...stroke} />
    </>
  ),
  // Ladenblok: drie lades met grepen
  ladenblok: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="1" {...stroke} />
      <path d="M6 9.5h12M6 15h12" {...stroke} />
      <path d="M10 6.7h4M10 12.2h4M10 17.7h4" {...stroke} />
    </>
  ),
  // Kabelmanagement: gegolfde kabel met stekker
  kabel: (
    <>
      <path d="M4 7c3 0 3 5 6 5s3-5 6-5 3 5 4 5" {...stroke} />
      <path d="M18 17v2M14 17v2M13 15h6v2h-6z" {...stroke} />
    </>
  ),
  // Scheidingswand: staand paneel
  wand: (
    <>
      <rect x="6" y="4" width="12" height="13" rx="1" {...stroke} />
      <path d="M9 20l3-3 3 3" {...stroke} />
      <path d="M12 17v3" {...stroke} />
    </>
  ),
  // Componenten: in elkaar grijpende onderdelen
  component: (
    <>
      <rect x="3.5" y="3.5" width="8" height="8" rx="1" {...stroke} />
      <rect x="12.5" y="12.5" width="8" height="8" rx="1" {...stroke} />
      <path d="M11.5 7.5h4a1 1 0 0 1 1 1v4" {...stroke} />
    </>
  ),
  // Terugval: neutraal meubel (vierkant met pootjes)
  meubel: (
    <>
      <rect x="4" y="6" width="16" height="9" rx="1" {...stroke} />
      <path d="M6 15v3M18 15v3" {...stroke} />
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
