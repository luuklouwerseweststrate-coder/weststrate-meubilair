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

  // Representatief beeld voor dit product: gebruikt zodra een gekozen variant
  // zelf geen foto heeft (Swan levert niet voor elke kleurcombinatie een render).
  const fallbackImage = useMemo(() => {
    if (product.image) return product.image;
    return product.variants.find((v) => v.image)?.image ?? "";
  }, [product]);

  // Standaard: open op een echte, bestaande variant (bij voorkeur één mét foto).
  // Cruciaal: we starten nooit op een verzonnen combinatie, zodat de getoonde
  // artikelcode/prijs altijd bij een bestelbare variant horen.
  const [keuzes, setKeuzes] = useState<Record<string, string>>(() => {
    const start = product.variants.find((v) => v.image) ?? product.variants[0];
    return { ...(start?.opties ?? {}) };
  });
  const [aantal, setAantal] = useState(1);
  const [toegevoegd, setToegevoegd] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  // De variant die exact bij de huidige keuzes hoort.
  const variant = useMemo(() => vindVariant(product, keuzes), [product, keuzes]);

  const totaal = variant.price * aantal;

  // Per optiegroep: welke waarden gaan samen met je HUIDIGE keuze op de andere
  // assen? (= bestaat er een variant met die waarde plus al je andere keuzes).
  // Niet-leverbare waarden grijzen we uit. Het Swan-programma bevat lang niet
  // alle combinaties (bv. 576 echte varianten op 9.072 theoretische).
  const beschikbaar = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const g of product.optionGroups) {
      const set = new Set<string>();
      for (const v of product.variants) {
        const restPast = product.optionGroups.every(
          (gg) => gg.label === g.label || v.opties[gg.label] === keuzes[gg.label]
        );
        if (restPast) set.add(v.opties[g.label]);
      }
      map[g.label] = set;
    }
    return map;
  }, [product, keuzes]);

  // Het beeld dat we tonen: dat van de variant, anders het representatieve
  // terugval-beeld. Zo blijft het kader nooit leeg zolang er ergens een foto is.
  const beeld = variant.image || fallbackImage;

  // Kiest een waarde en "snapt" naar een echte variant: van alle varianten met
  // deze waarde pakken we degene die zoveel mogelijk van je huidige andere keuzes
  // behoudt (en bij gelijke stand: liefst één mét foto). Bij een leverbare keuze
  // blijft alles staan; bij een niet-leverbare passen we de minimaal nodige andere
  // assen aan. Zo hoort de selectie altijd bij een bestaande artikelcode.
  function kies(groep: string, waarde: string) {
    const kandidaten = product.variants.filter((v) => v.opties[groep] === waarde);
    if (kandidaten.length === 0) return;
    let beste = kandidaten[0];
    let besteScore = -1;
    for (const v of kandidaten) {
      let gelijk = 0;
      for (const g of product.optionGroups) {
        if (g.label === groep) continue;
        if (v.opties[g.label] === keuzes[g.label]) gelijk++;
      }
      const score = gelijk * 2 + (v.image ? 1 : 0); // tie-break: liever met foto
      if (score > besteScore) {
        besteScore = score;
        beste = v;
      }
    }
    setKeuzes({ ...beste.opties });
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
          onClick={() => beeld && setLightbox(true)}
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-rule bg-white"
          aria-label="Vergroot afbeelding"
        >
          {/* Crossfade tussen variant-beelden */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={beeld || variant.articleNumber}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductMedia
                src={beeld}
                alt={`${product.name} — ${variant.articleNumber}`}
                naam={product.name}
                categorie={product.category}
                priority
              />
            </motion.div>
          </AnimatePresence>
          {beeld && (
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
                    // Gaat deze waarde samen met je huidige overige keuzes?
                    const leverbaar = beschikbaar[groep.label]?.has(waarde) ?? true;
                    const tip = leverbaar
                      ? waarde
                      : `${waarde}: niet leverbaar met je huidige keuze. Klik om de combinatie aan te passen`;

                    // Kleurstaal als we de kleur kennen
                    if (hex) {
                      return (
                        <button
                          key={waarde}
                          type="button"
                          onClick={() => kies(groep.label, waarde)}
                          title={tip}
                          aria-label={tip}
                          aria-pressed={actief}
                          className={`relative h-9 w-9 rounded-full transition-transform hover:scale-110 ${
                            actief
                              ? "ring-2 ring-brand ring-offset-2"
                              : isLicht(hex)
                                ? "ring-1 ring-rule"
                                : ""
                          } ${!actief && !leverbaar ? "opacity-35 hover:scale-100" : ""}`}
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
                        title={tip}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                          actief
                            ? "border-brand bg-brand/5 font-semibold text-brand"
                            : leverbaar
                              ? "border-rule text-ink-2 hover:border-ink-2"
                              : "border-rule/50 text-ink-2/40 hover:border-ink-2/40"
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
        {lightbox && beeld && (
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
                src={beeld}
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
