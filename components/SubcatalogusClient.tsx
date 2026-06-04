"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";

// Slimme grid voor een subcategorie: zoeken op naam + sorteren. De server geeft
// alle producten van de subcategorie mee; het filteren gebeurt client-side over
// die (kleine) lijst — snel en zonder extra requests.

type Sortering = "naam" | "prijs-op" | "prijs-af";

const SORT_OPTIES: { waarde: Sortering; label: string }[] = [
  { waarde: "naam", label: "Naam (A–Z)" },
  { waarde: "prijs-op", label: "Prijs (laag → hoog)" },
  { waarde: "prijs-af", label: "Prijs (hoog → laag)" },
];

export default function SubcatalogusClient({
  producten,
}: {
  producten: Product[];
}) {
  const [zoek, setZoek] = useState("");
  const [sortering, setSortering] = useState<Sortering>("naam");

  const zichtbaar = useMemo(() => {
    const term = zoek.trim().toLowerCase();
    const gefilterd = term
      ? producten.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.shortDescription.toLowerCase().includes(term)
        )
      : producten;

    const gesorteerd = [...gefilterd];
    gesorteerd.sort((a, b) => {
      if (sortering === "prijs-op") return a.basePrice - b.basePrice;
      if (sortering === "prijs-af") return b.basePrice - a.basePrice;
      return a.name.localeCompare(b.name, "nl");
    });
    return gesorteerd;
  }, [producten, zoek, sortering]);

  return (
    <div className="mt-8">
      {/* Bedieningsbalk: zoeken + sorteren + teller */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <input
            type="search"
            value={zoek}
            onChange={(e) => setZoek(e.target.value)}
            placeholder="Zoek in deze categorie…"
            className="w-full rounded-full border border-rule bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-brand"
            aria-label="Zoeken"
          />
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-2">
            {zichtbaar.length}{" "}
            {zichtbaar.length === 1 ? "resultaat" : "resultaten"}
          </span>
          <label className="sr-only" htmlFor="sorteer">
            Sorteren
          </label>
          <select
            id="sorteer"
            value={sortering}
            onChange={(e) => setSortering(e.target.value as Sortering)}
            className="rounded-full border border-rule bg-white py-2.5 pl-4 pr-8 text-sm text-ink outline-none transition-colors focus:border-brand"
          >
            {SORT_OPTIES.map((o) => (
              <option key={o.waarde} value={o.waarde}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultaten */}
      {zichtbaar.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {zichtbaar.map((p, i) => (
            <Reveal key={p._id} delay={Math.min(i, 6) * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-dashed border-rule bg-paper-2 px-6 py-16 text-center">
          <p className="text-ink-2">
            Geen producten gevonden voor “{zoek}”.
          </p>
          <button
            type="button"
            onClick={() => setZoek("")}
            className="mt-3 text-sm font-semibold text-brand hover:underline"
          >
            Zoekopdracht wissen
          </button>
        </div>
      )}
    </div>
  );
}
