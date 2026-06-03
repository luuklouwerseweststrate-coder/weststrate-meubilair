"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, GekozenOptie } from "@/lib/types";
import { euro, useOfferte } from "@/lib/offerte";

// De kern van de pilot: klant kiest opties, de prijs telt live mee,
// en het product belandt met de juiste configuratie in de offerte.

export default function OptieSelector({ product }: { product: Product }) {
  const { voegToe } = useOfferte();
  const router = useRouter();

  // Standaard: eerste keuze van elke groep geselecteerd.
  const [keuzes, setKeuzes] = useState<Record<string, number>>(() => {
    const start: Record<string, number> = {};
    product.optionGroups.forEach((g, i) => {
      start[i] = 0;
    });
    return start;
  });
  const [aantal, setAantal] = useState(1);
  const [toegevoegd, setToegevoegd] = useState(false);

  // Gekozen opties + meerprijs, afgeleid van de selectie.
  const gekozenOpties: GekozenOptie[] = useMemo(
    () =>
      product.optionGroups.map((g, i) => {
        const keuze = g.choices[keuzes[i] ?? 0];
        return {
          groepLabel: g.label,
          keuzeLabel: keuze.label,
          priceDelta: keuze.priceDelta,
        };
      }),
    [product.optionGroups, keuzes]
  );

  const stuksprijs =
    product.basePrice + gekozenOpties.reduce((s, o) => s + o.priceDelta, 0);
  const totaal = stuksprijs * aantal;

  function handleToevoegen() {
    voegToe({
      id: `${product._id}-${Date.now()}`,
      productId: product._id,
      productName: product.name,
      articleNumber: product.articleNumber,
      basePrice: product.basePrice,
      gekozenOpties,
      aantal,
    });
    setToegevoegd(true);
  }

  return (
    <div className="rounded-xl border border-rule bg-white p-6">
      {product.optionGroups.map((groep, gi) => (
        <div key={gi} className="mb-6">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-semibold text-ink">
              {groep.label}
              {!groep.required && (
                <span className="ml-2 text-xs font-normal text-ink-2">
                  (optioneel)
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {groep.choices.map((keuze, ci) => {
              const actief = (keuzes[gi] ?? 0) === ci;
              return (
                <button
                  key={ci}
                  type="button"
                  onClick={() => {
                    setKeuzes((v) => ({ ...v, [gi]: ci }));
                    setToegevoegd(false);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    actief
                      ? "border-brand bg-brand/5 font-semibold text-brand"
                      : "border-rule text-ink-2 hover:border-ink-2"
                  }`}
                >
                  {keuze.label}
                  {keuze.priceDelta !== 0 && (
                    <span className="ml-1.5 text-xs">
                      {keuze.priceDelta > 0 ? "+" : ""}
                      {euro(keuze.priceDelta)}
                    </span>
                  )}
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
            {euro(stuksprijs)} per stuk
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
  );
}
