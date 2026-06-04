import Image from "next/image";

// Toont de productfoto. Zolang er (nog) geen echt beeld is (bv. in de demo-
// catalogus waar nog geen Swan-foto's gesynct zijn), valt het terug op een
// verzorgde placeholder: een zacht merkkleurvlak met de W-mark én de
// productnaam, in een kleur die past bij de hoofdcategorie. Zo oogt de
// catalogus gevarieerd en op merk, ook zonder foto's.

// Hoofdcategorie → merkkleur (uit het brandbook).
const CATEGORIE_KLEUR: Record<string, string> = {
  Werken: "#A1367E", // magenta
  Zitten: "#01B6E3", // cyaan
  Vergaderen: "#009D46", // groen
  Opbergen: "#F29828", // oranje
};

export default function ProductMedia({
  src,
  alt,
  naam,
  categorie,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "object-contain",
}: {
  src?: string;
  alt: string;
  /** Tekst onder de W-mark in de placeholder (meestal de productnaam). */
  naam?: string;
  /** Hoofdcategorie, bepaalt de accentkleur van de placeholder. */
  categorie?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  // Placeholder: zacht merkkleurvlak met de W-mark en (optioneel) de naam.
  const kleur = (categorie && CATEGORIE_KLEUR[categorie]) || "#A1367E";
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center"
      style={{ background: `${kleur}14` }} // 14 = ~8% opacity hex
      aria-label={alt}
    >
      <span
        className="font-display text-5xl font-black leading-none"
        style={{ color: kleur }}
      >
        W
      </span>
      {naam && (
        <span className="text-sm font-medium text-ink-2">{naam}</span>
      )}
    </div>
  );
}
