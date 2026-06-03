import Image from "next/image";
import type { Categorie } from "@/lib/types";

// Accentkleur per categorie (uit het merkpalet). Wordt gebruikt voor de
// placeholder zolang er nog geen productfoto in het CMS staat.
const ACCENT: Record<Categorie, string> = {
  bureaustoelen: "#A1367E", // magenta
  bureaus: "#01B6E3", // cyaan
  vergadertafels: "#009D46", // groen
};

export default function ProductMedia({
  src,
  alt,
  category,
  priority = false,
}: {
  src?: string;
  alt: string;
  category: Categorie;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    );
  }

  // Placeholder: zacht kleurvlak met de W-letter in de categoriekleur.
  const kleur = ACCENT[category];
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: `${kleur}14` }} // 14 = ~8% opacity hex
      aria-label={alt}
    >
      <span
        className="font-display text-6xl font-black"
        style={{ color: kleur }}
      >
        W
      </span>
    </div>
  );
}
