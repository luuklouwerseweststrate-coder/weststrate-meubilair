"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, GekozenOptie } from "@/lib/types";
import { vindVariant } from "@/lib/types";
import { subLabel } from "@/lib/categorieen";
import { euro, useOfferte } from "@/lib/offerte";
import { isKleurGroep, kleurVoor, isLicht } from "@/lib/kleuren";
import ProductMedia from "./ProductMedia";

// De kern van de pilot: de klant kiest per optiegroep een waarde. We zoeken de
// bijbehorende variant op uit de variant-matrix, zodat de exacte prijs én de
// foto live meewisselen. De gekozen variant belandt in de offerte.
//
// Premium-laag: kleur-assen tonen we als ronde kleurstalen, het beeld wisselt
// met een zachte crossfade, het keuzepaneel blijft sticky en je kunt het beeld
// vergroten in een lightbox.

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
  const [lightbox, setLightbox] = useState(false);

  // De variant die exact bij de huidige keuzes hoort.
  const variant = useMemo(() => vindVariant(product, keuzes), [product, keuzes]);

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

  // Esc sluit de lightbox.
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Linkerkolom: beeld (wisselt mee) + omschrijving + specs */}
      <div>
        <button
          type="button"
          onClick={() => variant.image && setLightbox(true)}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-rule bg-paper-2"
          aria-label="Vergroot afbeelding"
        >
          {/* Crossfade tussen variant-beelden */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={variant.image || variant.articleNumber}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductMedia
                src={variant.image}
                alt={`${product.name} — ${variant.articleNumber}`}
                naam={product.name}
                categorie={product.category}
                priority
              />
            </motion.div>
          </AnimatePresence>
          {variant.image && (
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-2 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              Klik om te vergroten
            </span>
          )}
        </button>

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

      {/* Rechterkolom: titel + configurator (sticky) */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm text-ink-2">{subLabel(product.subcategory)}</p>
        <h1 className="mt-1 text-3xl">{product.name}</h1>
        <p className="mt-3 text-ink-2">{product.shortDescription}</p>
        <p className="mt-2 font-mono text-xs text-ink-2">
          Artikelcode: {variant.articleNumber}
        </p>

        <div className="mt-6 rounded-xl border border-rule bg-white p-6">
          {product.optionGroups.map((groep) => {
            const alsKleur = isKleurGroep(groep.label, groep.waarden);
            return (
              <div key={groep.label} className="mb-6">
                <p className="mb-2 text-sm font-semibold text-ink">
                  {groep.label}
                  <span className="ml-2 font-normal text-ink-2">
                    {keuzes[groep.label]}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {groep.waarden.map((waarde) => {
                    const actief = keuzes[groep.label] === waarde;
                    const hex = alsKleur ? kleurVoor(waarde) : null;

                    // Kleurstaal als we de kleur kennen
                    if (hex) {
                      return (
                        <button
                          key={waarde}
                          type="button"
                          onClick={() => kies(groep.label, waarde)}
                          title={waarde}
                          aria-label={waarde}
                          aria-pressed={actief}
                          className={`relative h-9 w-9 rounded-full transition-transform hover:scale-110 ${
                            actief
                              ? "ring-2 ring-brand ring-offset-2"
                              : isLicht(hex)
                                ? "ring-1 ring-rule"
                                : ""
                          }`}
                          style={{ background: hex }}
                        />
                      );
                    }

                    // Tekstpill voor formaat/uitvoering of onbekende kleur
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
            );
          })}

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

          {/* Live prijs (wisselt zacht mee) */}
          <div className="mb-5 border-t border-rule pt-5">
            <div className="flex items-end justify-between">
              <span className="text-sm text-ink-2">Totaal (excl. btw)</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={totaal}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="font-display text-2xl font-extrabold text-ink"
                >
                  {euro(totaal)}
                </motion.span>
              </AnimatePresence>
            </div>
            {aantal > 1 && (
              <p className="mt-1 text-right text-xs text-ink-2">
                {euro(variant.price)} per stuk
              </p>
            )}
          </div>

          <motion.button
            type="button"
            onClick={handleToevoegen}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Toevoegen aan offerte
          </motion.button>

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

      {/* Lightbox: vergrote weergave van het variant-beeld */}
      <AnimatePresence>
        {lightbox && variant.image && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="relative h-[80vh] w-full max-w-4xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={variant.image}
                alt={`${product.name} — ${variant.articleNumber}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink"
            >
              Sluiten
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
