"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, GekozenOptie } from "@/lib/types";
import { vindVariant } from "@/lib/types";
import { subLabel } from "@/lib/categorieen";
import { euro, useOfferte } from "@/lib/offerte";
import ProductMedia from "./ProductMedia";

// De kern van de pilot: de klant kiest per optiegroep een waarde. We zoeken de
// bijbehorende variant op uit de variant-matrix, zodat de exacte prijs én de
// foto live meewisselen. De gekozen variant belandt in de offerte.
//
// Beeld (links) en keuzes (rechts) delen dezelfde state, daarom zit alles in
// één client-component.

export default function ProductConfigurator({ product }: { product: Product }) {
  const { voegToe } = useOfferte();
  const router = useRouter();

  // Standaard: eerste waarde van elke optiegroep.
  const [keuzes, setKeuzes] = useState<Record<string, string>>(() => {
    const start: Record<string, string> = {};
    product.optionGroups.forEach((g) => {
      start[g.label] = g.waarden[0];
    });
    return start;
  });
  const [aantal, setAantal] = useState(1);
  const [toegevoegd, setToegevoegd] = useState(false);

  // De variant die exact bij de huidige keuzes hoort.
  const variant = useMemo(
    () => vindVariant(product, keuzes),
    [product, keuzes]
  );

  const totaal = variant.price * aantal;

  function kies(groep: string, waarde: string) {
    setKeuzes((v) => ({ ...v, [groep]: waarde }));
    setToegevoegd(false);
  }

  function handleToevoegen() {
    const gekozenOpties: GekozenOptie[] = product.optionGroups.map((g) => ({
      groepLabel: g.label,
      keuzeLabel: keuzes[g.label],
    }));
    voegToe({
      id: `${product._id}-${Date.now()}`,
      productId: product._id,
      productName: product.name,
      articleNumber: variant.articleNumber,
      stuksprijs: variant.price,
      gekozenOpties,
      aantal,
    });
    setToegevoegd(true);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Linkerkolom: beeld (wisselt mee met de keuze) + omschrijving + specs */}
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-rule bg-paper-2">
          <ProductMedia
            src={variant.image}
            alt={`${product.name} — ${variant.articleNumber}`}
            priority
          />
        </div>

        {product.description && (
          <div className="mt-8">
            <h2 className="text-lg">Omschrijving</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-2">
              {product.description}
            </p>
          </div>
        )}

        {product.specs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg">Specificaties</h2>
            <dl className="mt-3 divide-y divide-rule border-t border-rule">
              {product.specs.map((s, i) => (
                <div key={i} className="flex justify-between py-2.5 text-sm">
                  <dt className="text-ink-2">{s.label}</dt>
                  <dd className="text-right font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Rechterkolom: titel + configurator */}
      <div>
        <p className="text-sm text-ink-2">{subLabel(product.subcategory)}</p>
        <h1 className="mt-1 text-3xl">{product.name}</h1>
        <p className="mt-3 text-ink-2">{product.shortDescription}</p>
        <p className="mt-2 font-mono text-xs text-ink-2">
          Artikelcode: {variant.articleNumber}
        </p>

        <div className="mt-6 rounded-xl border border-rule bg-white p-6">
          {product.optionGroups.map((groep) => (
            <div key={groep.label} className="mb-6">
              <p className="mb-2 text-sm font-semibold text-ink">
                {groep.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {groep.waarden.map((waarde) => {
                  const actief = keuzes[groep.label] === waarde;
                  return (
                    <button
                      key={waarde}
                      type="button"
                      onClick={() => kies(groep.label, waarde)}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        actief
                          ? "border-brand bg-brand/5 font-semibold text-brand"
                          : "border-rule text-ink-2 hover:border-ink-2"
                      }`}
                    >
                      {waarde}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Aantal */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold text-ink">Aantal</p>
            <div className="inline-flex items-center rounded-lg border border-rule">
              <button
                type="button"
                onClick={() => {
                  setAantal((a) => Math.max(1, a - 1));
                  setToegevoegd(false);
                }}
                className="px-3 py-2 text-lg text-ink-2 hover:text-brand"
                aria-label="Minder"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold">
                {aantal}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAantal((a) => a + 1);
                  setToegevoegd(false);
                }}
                className="px-3 py-2 text-lg text-ink-2 hover:text-brand"
                aria-label="Meer"
              >
                +
              </button>
            </div>
          </div>

          {/* Live prijs */}
          <div className="mb-5 border-t border-rule pt-5">
            <div className="flex items-end justify-between">
              <span className="text-sm text-ink-2">Totaal (excl. btw)</span>
              <span className="font-display text-2xl font-extrabold text-ink">
                {euro(totaal)}
              </span>
            </div>
            {aantal > 1 && (
              <p className="mt-1 text-right text-xs text-ink-2">
                {euro(variant.price)} per stuk
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleToevoegen}
            className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Toevoegen aan offerte
          </button>

          {toegevoegd && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-groen/10 px-4 py-3 text-sm">
              <span className="text-groen">Toegevoegd aan je offerte.</span>
              <button
                type="button"
                onClick={() => router.push("/offerte")}
                className="font-semibold text-groen underline"
              >
                Naar offerte
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
