"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, animate, useReducedMotion } from "framer-motion";
import type { WerkplekSlot } from "@/lib/data";
import type { Product } from "@/lib/types";
import { vindVariant, euro } from "@/lib/types";
import { useOfferte } from "@/lib/offerte";
import { isKleurGroep, kleurVoor, isLicht } from "@/lib/kleuren";
import ProductMedia from "./ProductMedia";
import Reveal from "./motion/Reveal";

// De werkplek-samensteller: per slot (bureau, stoel, opbergen) kies je een
// product en kleur, je stelt het aantal werkplekken in, en ziet live wat het
// kost. In één klik zet je alles in de bestaande offerte. We hergebruiken de
// offerte-context, vindVariant() en de kleurstalen-logica van de configurator.

// Wat de bezoeker per slot heeft gekozen: welk product (null = overgeslagen) en
// welke optiewaarden (bv. { Blad: "Wit", Frame: "Zwart" }).
interface SlotKeuze {
  productId: string | null;
  keuzes: Record<string, string>;
}

// Snapt de keuzes naar de dichtstbijzijnde leverbare variant nadat één optie is
// gewijzigd: varianten met de nieuwe waarde krijgen voorrang, daarbinnen de
// variant die het meest met je overige keuzes overeenkomt. Zo blijft de keuze
// altijd op een bestaande variant landen (net als in de productconfigurator).
function snapKeuzes(
  product: Product,
  keuzes: Record<string, string>,
  groepLabel: string,
  waarde: string
): Record<string, string> {
  const kandidaten = product.variants.filter(
    (v) => v.opties[groepLabel] === waarde
  );
  const pool = kandidaten.length ? kandidaten : product.variants;
  let beste = pool[0];
  let besteScore = -1;
  for (const v of pool) {
    let score = 0;
    for (const g of product.optionGroups) {
      if (g.label !== groepLabel && v.opties[g.label] === keuzes[g.label]) score++;
    }
    if (score > besteScore) {
      besteScore = score;
      beste = v;
    }
  }
  return { ...beste.opties };
}

// Is deze optiewaarde leverbaar samen met je huidige overige keuzes?
function isLeverbaar(
  product: Product,
  keuzes: Record<string, string>,
  groepLabel: string,
  waarde: string
): boolean {
  return product.variants.some(
    (v) =>
      v.opties[groepLabel] === waarde &&
      product.optionGroups.every(
        (g) => g.label === groepLabel || v.opties[g.label] === keuzes[g.label]
      )
  );
}

// Bedrag dat zacht naar zijn nieuwe waarde toe telt zodra het verandert. Bij
// prefers-reduced-motion springt het direct (toegankelijkheid).
function AnimerendBedrag({ bedrag }: { bedrag: number }) {
  const reduce = useReducedMotion();
  const [weergave, setWeergave] = useState(bedrag);
  const vorige = useRef(bedrag);

  useEffect(() => {
    if (reduce) {
      setWeergave(bedrag);
      vorige.current = bedrag;
      return;
    }
    const controls = animate(vorige.current, bedrag, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setWeergave(v),
    });
    vorige.current = bedrag;
    return () => controls.stop();
  }, [bedrag, reduce]);

  return <>{euro(Math.round(weergave))}</>;
}

export default function WerkplekSamensteller({
  slots,
}: {
  slots: WerkplekSlot[];
}) {
  const router = useRouter();
  const { voegToe } = useOfferte();

  // Beginselectie: verplichte slots krijgen meteen het eerste (rijkste) product
  // zodat de pagina vol en af oogt; optionele slots staan standaard op "geen".
  const [keuze, setKeuze] = useState<Record<string, SlotKeuze>>(() => {
    const start: Record<string, SlotKeuze> = {};
    for (const slot of slots) {
      const eerste = slot.producten[0];
      const kiesStandaard = !slot.optioneel && eerste;
      start[slot.key] = {
        productId: kiesStandaard ? eerste._id : null,
        keuzes: kiesStandaard ? { ...eerste.variants[0].opties } : {},
      };
    }
    return start;
  });
  const [aantalWerkplekken, setAantalWerkplekken] = useState(1);

  // Het gekozen product in een slot (of null als overgeslagen).
  function productVan(slot: WerkplekSlot): Product | null {
    const id = keuze[slot.key]?.productId;
    return slot.producten.find((p) => p._id === id) ?? null;
  }

  // Kies (of wis) een product in een slot; reset de opties naar de standaard.
  function kiesProduct(slotKey: string, product: Product | null) {
    setKeuze((vorige) => ({
      ...vorige,
      [slotKey]: {
        productId: product?._id ?? null,
        keuzes: product ? { ...product.variants[0].opties } : {},
      },
    }));
  }

  // Wijzig één optie binnen het gekozen product (snapt naar leverbare variant).
  function kiesOptie(
    slotKey: string,
    product: Product,
    groepLabel: string,
    waarde: string
  ) {
    setKeuze((vorige) => ({
      ...vorige,
      [slotKey]: {
        productId: product._id,
        keuzes: snapKeuzes(product, vorige[slotKey].keuzes, groepLabel, waarde),
      },
    }));
  }

  // Prijs per werkplek = som van de gekozen varianten. Totaal = × aantal.
  const perWerkplek = useMemo(() => {
    return slots.reduce((som, slot) => {
      const product = productVan(slot);
      if (!product) return som;
      return som + vindVariant(product, keuze[slot.key].keuzes).price;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, keuze]);
  const totaal = perWerkplek * aantalWerkplekken;

  // Minstens één verplicht slot moet gevuld zijn om toe te voegen.
  const kanToevoegen = slots.some(
    (s) => !s.optioneel && keuze[s.key]?.productId
  );

  function allesToevoegen() {
    for (const slot of slots) {
      const product = productVan(slot);
      if (!product) continue;
      const variant = vindVariant(product, keuze[slot.key].keuzes);
      const gekozenOpties = product.optionGroups.map((g) => ({
        groepLabel: g.label,
        keuzeLabel: keuze[slot.key].keuzes[g.label],
      }));
      voegToe({
        id: `${product._id}-${slot.key}-${Date.now()}`,
        productId: product._id,
        productName: product.name,
        articleNumber: variant.articleNumber,
        stuksprijs: variant.price,
        gekozenOpties,
        aantal: aantalWerkplekken,
      });
    }
    router.push("/offerte");
  }

  return (
    <div className="mt-10">
      {/* ── De slots ──────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {slots.map((slot, i) => {
          const product = productVan(slot);
          const sel = keuze[slot.key];
          const variant = product
            ? vindVariant(product, sel.keuzes)
            : null;

          return (
            <Reveal key={slot.key} delay={i * 0.06}>
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-white">
                {/* Koptekst van het slot */}
                <div className="border-b border-rule px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <h2 className="text-lg">{slot.label}</h2>
                  </div>
                  <p className="mt-1 text-sm text-ink-2">{slot.tagline}</p>
                </div>

                {/* Preview van de gekozen uitvoering */}
                <div className="relative aspect-[4/3] bg-white">
                  <ProductMedia
                    src={variant?.image || product?.image}
                    alt={product ? product.name : `${slot.label}: geen keuze`}
                    naam={product?.name ?? slot.label}
                    categorie={product?.category}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-contain"
                  />
                  {!product && (
                    <span className="absolute inset-0 flex items-center justify-center text-sm text-ink-2">
                      Geen {slot.label.toLowerCase()} gekozen
                    </span>
                  )}
                </div>

                {/* Inhoud: keuzes */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Productkeuze (thumbnails) */}
                  <div className="flex flex-wrap gap-2">
                    {slot.optioneel && (
                      <button
                        type="button"
                        onClick={() => kiesProduct(slot.key, null)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                          !product
                            ? "border-brand bg-brand/5 font-semibold text-brand"
                            : "border-rule text-ink-2 hover:border-ink-2"
                        }`}
                      >
                        Geen
                      </button>
                    )}
                    {slot.producten.map((p) => {
                      const actief = product?._id === p._id;
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => kiesProduct(slot.key, p)}
                          title={p.name}
                          aria-label={p.name}
                          aria-pressed={actief}
                          className={`relative h-12 w-12 overflow-hidden rounded-lg border bg-white transition-colors ${
                            actief ? "border-brand ring-1 ring-brand" : "border-rule hover:border-ink-2"
                          }`}
                        >
                          <ProductMedia
                            src={p.image}
                            alt=""
                            naam={p.name}
                            categorie={p.category}
                            sizes="48px"
                            className="object-contain"
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Naam + prijs van de gekozen serie */}
                  {product ? (
                    <p className="mt-4 text-sm">
                      <span className="font-semibold text-ink">
                        {product.name}
                      </span>
                      <span className="ml-2 text-ink-2">
                        {euro(variant!.price)}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-ink-2">
                      Dit onderdeel sla je over.
                    </p>
                  )}

                  {/* Optiegroepen als kleurstalen / pills */}
                  {product?.optionGroups.map((groep) => {
                    const alsKleur = isKleurGroep(groep.label, groep.waarden);
                    return (
                      <div key={groep.label} className="mt-4">
                        <p className="mb-2 text-sm font-semibold text-ink">
                          {groep.label}
                          <span className="ml-2 font-normal text-ink-2">
                            {sel.keuzes[groep.label]}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {groep.waarden.map((waarde) => {
                            const actief = sel.keuzes[groep.label] === waarde;
                            const hex = alsKleur ? kleurVoor(waarde) : null;
                            const leverbaar = isLeverbaar(
                              product,
                              sel.keuzes,
                              groep.label,
                              waarde
                            );
                            const tip = leverbaar
                              ? waarde
                              : `${waarde}: niet leverbaar met je huidige keuze`;

                            if (hex) {
                              return (
                                <button
                                  key={waarde}
                                  type="button"
                                  onClick={() =>
                                    kiesOptie(slot.key, product, groep.label, waarde)
                                  }
                                  title={tip}
                                  aria-label={tip}
                                  aria-pressed={actief}
                                  className={`relative h-8 w-8 rounded-full transition-transform hover:scale-110 ${
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

                            return (
                              <button
                                key={waarde}
                                type="button"
                                onClick={() =>
                                  kiesOptie(slot.key, product, groep.label, waarde)
                                }
                                title={tip}
                                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
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
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ── Samenvatting + totaal ─────────────────────── */}
      <div className="mt-8 overflow-hidden rounded-xl border border-rule bg-paper-2">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-end">
          {/* Regels per onderdeel */}
          <div>
            <h2 className="text-lg">Jouw werkplek</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {slots.map((slot) => {
                const product = productVan(slot);
                const variant = product
                  ? vindVariant(product, keuze[slot.key].keuzes)
                  : null;
                return (
                  <li
                    key={slot.key}
                    className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-1.5"
                  >
                    <span className="text-ink-2">
                      <span className="text-ink">{slot.label}:</span>{" "}
                      {product ? product.name : "—"}
                    </span>
                    <span className="whitespace-nowrap font-medium text-ink">
                      {variant ? euro(variant.price) : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-sm text-ink-2">
              Per werkplek:{" "}
              <span className="font-semibold text-ink">{euro(perWerkplek)}</span>{" "}
              excl. btw
            </p>
          </div>

          {/* Aantal werkplekken + totaal + actie */}
          <div className="md:text-right">
            <p className="text-sm font-semibold text-ink">
              Voor hoeveel werkplekken?
            </p>
            <div className="mt-2 inline-flex items-center rounded-lg border border-rule bg-white">
              <button
                type="button"
                onClick={() =>
                  setAantalWerkplekken((a) => Math.max(1, a - 1))
                }
                className="px-3 py-2 text-lg text-ink-2 hover:text-brand"
                aria-label="Minder werkplekken"
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-semibold">
                {aantalWerkplekken}
              </span>
              <button
                type="button"
                onClick={() => setAantalWerkplekken((a) => a + 1)}
                className="px-3 py-2 text-lg text-ink-2 hover:text-brand"
                aria-label="Meer werkplekken"
              >
                +
              </button>
            </div>

            <p className="mt-4 text-sm text-ink-2">Totaal excl. btw</p>
            <p className="text-3xl font-semibold text-ink md:text-4xl">
              <AnimerendBedrag bedrag={totaal} />
            </p>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={allesToevoegen}
              disabled={!kanToevoegen}
              className="mt-4 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
            >
              Alles toevoegen aan offerte
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
