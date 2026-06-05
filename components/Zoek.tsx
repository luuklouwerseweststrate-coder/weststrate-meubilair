"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { ZoekItem, ZoekType } from "@/lib/types";
import { euro } from "@/lib/types";

// Globale zoekfunctie als inline uitklappend paneel (geen modal, geen ⌘K). De
// volledige index komt server-side binnen als lichte JSON; filteren gebeurt hier
// client-side zodat het direct reageert. Producten staan centraal — met "vanaf"-
// prijs — en de rest (categorieën, projecten, inspiratie, pagina's) is bewust
// ondergeschikt. Onderaan een vaste regel naar de specialist.

const CONTEXT_TYPES: ZoekType[] = ["Project", "Inspiratie", "Pagina"];
const CONTEXT_KLEUR: Record<string, string> = {
  Project: "#009D46",
  Inspiratie: "#F29828",
  Pagina: "#4A4A55",
};

// Diacrieten weghalen + kleine letters, zodat "café" ook op "cafe" matcht.
function vouw(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Score één item tegen de zoekwoorden. Alle woorden moeten ergens voorkomen;
// treffers in de titel wegen het zwaarst.
function score(item: ZoekItem, woorden: string[]): number {
  const titel = vouw(item.titel);
  const sub = vouw(item.sub ?? "");
  const tref = vouw(item.trefwoorden ?? "");
  let totaal = 0;
  for (const w of woorden) {
    if (titel.startsWith(w)) totaal += 100;
    else if (titel.includes(w)) totaal += 50;
    else if (sub.includes(w)) totaal += 20;
    else if (tref.includes(w)) totaal += 8;
    else return -1;
  }
  return totaal;
}

// Markeert het matchende deel van de titel.
function markeer(titel: string, woorden: string[]) {
  if (woorden.length === 0) return titel;
  const gevouwen = vouw(titel);
  const kandidaten = woorden
    .map((w) => ({ w, i: gevouwen.indexOf(w) }))
    .filter((k) => k.i >= 0)
    .sort((a, b) => b.w.length - a.w.length);
  if (kandidaten.length === 0) return titel;
  const { i, w } = kandidaten[0];
  return (
    <>
      {titel.slice(0, i)}
      <mark className="bg-brand/15 text-brand">{titel.slice(i, i + w.length)}</mark>
      {titel.slice(i + w.length)}
    </>
  );
}

export default function Zoek({ items }: { items: ZoekItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [actief, setActief] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  const specialist = useMemo(
    () => items.find((i) => i.type === "Specialist"),
    [items]
  );
  const woorden = useMemo(
    () => vouw(query.trim()).split(/\s+/).filter(Boolean),
    [query]
  );

  // Gefilterde resultaten per sectie. Bij lege zoekterm tonen we suggesties:
  // de categorieën als "veelgezocht" en de kernpagina's.
  const { producten, categorieen, meer } = useMemo(() => {
    if (woorden.length === 0) {
      return {
        producten: [] as ZoekItem[],
        categorieen: items.filter((i) => i.type === "Categorie").slice(0, 8),
        meer: items.filter((i) => i.type === "Pagina").slice(0, 5),
      };
    }
    const scored = items
      .map((i) => ({ i, s: score(i, woorden) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.i);
    return {
      producten: scored.filter((i) => i.type === "Product").slice(0, 6),
      categorieen: scored.filter((i) => i.type === "Categorie").slice(0, 6),
      meer: scored.filter((i) => CONTEXT_TYPES.includes(i.type)).slice(0, 5),
    };
  }, [items, woorden]);

  // Platte lijst voor toetsenbordnavigatie (in weergavevolgorde).
  const plat = useMemo(
    () => [...producten, ...categorieen, ...meer],
    [producten, categorieen, meer]
  );
  const leeg = plat.length === 0;

  useEffect(() => {
    setActief(0);
  }, [query]);

  // Klik buiten het zoekblok → sluiten.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function ga(item: ZoekItem) {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }

  function toetsen(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActief((a) => (a + 1) % Math.max(1, plat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActief((a) => (a - 1 + plat.length) % Math.max(1, plat.length));
    } else if (e.key === "Enter" && plat[actief]) {
      e.preventDefault();
      ga(plat[actief]);
    } else if (e.key === "Escape") {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div ref={wrap} className="relative">
      {/* Trigger. Op mobiel een ronde icoon-knop (spaart breedte uit), op
          desktop een uitklappend zoekveld. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Zoeken"
        className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors md:hidden ${
          open ? "border-brand text-brand" : "border-rule text-ink-2"
        }`}
      >
        <ZoekIcoon className="h-4 w-4" />
      </button>

      <div
        className={`hidden items-center gap-2 rounded-full border bg-white px-3.5 transition-colors md:flex ${
          open ? "border-brand" : "border-rule hover:border-ink-2"
        }`}
      >
        <ZoekIcoon className="h-4 w-4 shrink-0 text-ink-2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={toetsen}
          placeholder="Zoek bureaus, stoelen, kasten…"
          aria-label="Zoeken"
          className="w-48 bg-transparent py-2 text-sm outline-none placeholder:text-ink-2 focus:w-64 lg:w-56 lg:focus:w-72 transition-[width] duration-200"
        />
      </div>

      {/* Uitklappend resultatenpaneel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop op mobiel: tik ernaast om te sluiten. Op desktop
                onzichtbaar (de klik-buiten-handler regelt het daar). */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/20 md:hidden"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              // Mobiel: vast aan het scherm (inset-x-3, onder de header) zodat
              // het paneel niet half buiten beeld valt. Desktop (md): het oude
              // dropdown-gedrag, rechts uitgelijnd onder het zoekveld.
              className="fixed inset-x-3 top-[76px] z-50 overflow-hidden rounded-2xl border border-rule bg-white shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-2 md:w-[min(92vw,440px)]"
            >
            {/* Zoekinput in het paneel zelf (alleen mobiel: daar is de trigger
                een icoon). */}
            <div className="border-b border-rule p-3 md:hidden">
              <div className="flex items-center gap-2 rounded-full border border-brand bg-white px-3.5">
                <ZoekIcoon className="h-4 w-4 shrink-0 text-ink-2" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={toetsen}
                  placeholder="Zoek bureaus, stoelen, kasten…"
                  aria-label="Zoeken"
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink-2"
                />
              </div>
            </div>

            <div className="max-h-[calc(100dvh-210px)] overflow-y-auto md:max-h-[70vh]">
              {/* Lege zoekterm → suggesties; geen resultaten → nette melding */}
              {woorden.length > 0 && leeg ? (
                <p className="px-4 py-8 text-center text-sm text-ink-2">
                  Niets gevonden voor “{query}”.
                </p>
              ) : (
                <>
                  {/* ── Producten (centraal) ─────────────────── */}
                  {producten.length > 0 && (
                    <section className="py-2">
                      <SectieKop>Producten</SectieKop>
                      {producten.map((item) => (
                        <ProductRij
                          key={item.href}
                          item={item}
                          woorden={woorden}
                          isActief={plat.indexOf(item) === actief}
                          onHover={() => setActief(plat.indexOf(item))}
                          onClick={() => ga(item)}
                        />
                      ))}
                      <p className="px-4 pb-1 pt-1.5 text-[0.7rem] text-ink-2">
                        Catalogusprijzen, excl. btw
                      </p>
                    </section>
                  )}

                  {/* ── Categorieën (chips) ──────────────────── */}
                  {categorieen.length > 0 && (
                    <section className="border-t border-rule py-3">
                      <SectieKop>
                        {woorden.length === 0 ? "Veelgezocht" : "Categorieën"}
                      </SectieKop>
                      <div className="flex flex-wrap gap-2 px-4 pt-1">
                        {categorieen.map((item) => (
                          <button
                            key={item.href}
                            type="button"
                            onClick={() => ga(item)}
                            onMouseMove={() => setActief(plat.indexOf(item))}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                              plat.indexOf(item) === actief
                                ? "border-brand bg-brand/5 text-brand"
                                : "border-rule text-ink-2 hover:border-ink-2"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-brand" />
                            {item.titel}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ── Meer op de site ──────────────────────── */}
                  {meer.length > 0 && (
                    <section className="border-t border-rule py-2">
                      <SectieKop>
                        {woorden.length === 0 ? "Snel naar" : "Meer op de site"}
                      </SectieKop>
                      {meer.map((item) => (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => ga(item)}
                          onMouseMove={() => setActief(plat.indexOf(item))}
                          className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                            plat.indexOf(item) === actief ? "bg-paper-2" : ""
                          }`}
                        >
                          <span
                            className="rounded px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-white"
                            style={{ background: CONTEXT_KLEUR[item.type] }}
                          >
                            {item.type}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm text-ink">
                            {markeer(item.titel, woorden)}
                          </span>
                        </button>
                      ))}
                    </section>
                  )}
                </>
              )}
            </div>

            {/* ── Vaste specialist-voet (geen zoekresultaat) ─── */}
            {specialist && (
              <button
                type="button"
                onClick={() => ga(specialist)}
                className="flex w-full items-center gap-3 border-t border-rule bg-paper-2 px-4 py-3 text-left transition-colors hover:bg-paper-2/70"
              >
                {specialist.beeld && (
                  <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={specialist.beeld}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                )}
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">
                    Advies nodig? Bel {specialist.titel}
                  </span>
                  <span className="block text-xs text-ink-2">
                    {specialist.sub}
                  </span>
                </span>
                <span className="text-sm font-semibold text-brand">Contact</span>
              </button>
            )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Eén productrij: thumbnail + naam/categorie + "vanaf"-prijs in magenta.
function ProductRij({
  item,
  woorden,
  isActief,
  onHover,
  onClick,
}: {
  item: ZoekItem;
  woorden: string[];
  isActief: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseMove={onHover}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        isActief ? "bg-paper-2" : ""
      }`}
    >
      <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-rule bg-white">
        {item.beeld ? (
          <Image
            src={item.beeld}
            alt=""
            fill
            sizes="48px"
            className="object-contain p-1"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-brand">
            {item.titel.charAt(0)}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">
          {markeer(item.titel, woorden)}
        </span>
        {item.sub && (
          <span className="block truncate text-xs text-ink-2">{item.sub}</span>
        )}
      </span>
      {typeof item.prijs === "number" && (
        <span className="shrink-0 text-right leading-tight">
          <span className="block text-[0.65rem] text-ink-2">vanaf</span>
          <span className="font-display text-sm font-extrabold text-brand">
            {euro(item.prijs)}
          </span>
        </span>
      )}
    </button>
  );
}

function SectieKop({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pb-1 pt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-2">
      {children}
    </p>
  );
}

function ZoekIcoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14 14l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
