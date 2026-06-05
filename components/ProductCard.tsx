"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { euro, type Product } from "@/lib/types";
import { subLabel } from "@/lib/categorieen";
import ProductMedia from "./ProductMedia";

// Hoeveel kleur-thumbnails we maximaal naast elkaar tonen; de rest vatten we
// samen in een "+N"-teller zodat de strip niet uitloopt.
const MAX_SWATCHES = 4;

export default function ProductCard({ product }: { product: Product }) {
  const aantalUitvoeringen = product.variants.length;

  // Unieke variant-afbeeldingen = de zichtbaar verschillende uitvoeringen
  // (kleuren). Meerdere varianten kunnen dezelfde foto delen (bv. vier maten
  // met hetzelfde blad/frame), die tellen we één keer. Zo krijgen we precies de
  // visueel afwijkende uitvoeringen om als swatch te tonen.
  const beelden = useMemo(() => {
    const gezien = new Set<string>();
    const uniek: string[] = [];
    if (product.image) {
      gezien.add(product.image);
      uniek.push(product.image);
    }
    for (const v of product.variants) {
      if (v.image && !gezien.has(v.image)) {
        gezien.add(v.image);
        uniek.push(v.image);
      }
    }
    return uniek;
  }, [product]);

  // Welke foto staat groot in beeld. Standaard de hoofdfoto; bij hover over een
  // swatch wisselen we naar die uitvoering.
  const [actief, setActief] = useState(product.image || beelden[0] || "");

  const toonSwatches = beelden.length > 1;
  const zichtbareSwatches = beelden.slice(0, MAX_SWATCHES);
  const extra = beelden.length - zichtbareSwatches.length;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-rule bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <ProductMedia
          src={actief || product.image}
          alt={product.name}
          naam={product.name}
          categorie={product.category}
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {/* Diepte zichtbaar maken: hoeveel kleur-/formaatcombinaties er zijn */}
        {aantalUitvoeringen > 1 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink-2 backdrop-blur">
            {aantalUitvoeringen} uitvoeringen
          </span>
        )}

        {/* Kleur-strip: kleine voorbeeldfoto's van de andere uitvoeringen.
            Op desktop wisselt de hoofdfoto mee bij hover; op mobiel dient de
            strip als statisch overzicht van de beschikbare kleuren. */}
        {toonSwatches && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-white/95 to-transparent px-3 pb-2.5 pt-6">
            {zichtbareSwatches.map((src) => (
              <span
                key={src}
                onMouseEnter={() => setActief(src)}
                onMouseLeave={() => setActief(product.image || beelden[0] || "")}
                className={`relative h-8 w-8 overflow-hidden rounded-md border bg-white transition-colors ${
                  actief === src ? "border-brand" : "border-rule"
                }`}
              >
                <ProductMedia
                  src={src}
                  alt=""
                  naam={product.name}
                  categorie={product.category}
                  sizes="32px"
                  className="object-contain"
                />
              </span>
            ))}
            {extra > 0 && (
              <span className="flex h-8 items-center rounded-md border border-rule bg-white px-2 text-xs font-medium text-ink-2">
                +{extra}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-ink-2">{subLabel(product.subcategory)}</p>
        <h3 className="mt-1 text-lg leading-snug transition-colors group-hover:text-brand">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-2">
          {product.shortDescription}
        </p>
        <p className="mt-4 text-sm text-ink-2">
          vanaf{" "}
          <span className="text-base font-semibold text-ink">
            {euro(product.basePrice)}
          </span>{" "}
          <span className="text-xs">excl. btw</span>
        </p>
      </div>
    </Link>
  );
}
