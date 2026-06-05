"use client";

import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { ZoekItem, ZoekType } from "@/lib/types";

// Globale zoekfunctie als command palette (⌘K / Ctrl+K). De volledige index komt
// server-side binnen (lichte JSON); het filteren gebeurt hier client-side, zodat
// het direct reageert zonder netwerkcall. Resultaten worden per type gegroepeerd
// en je navigeert met de pijltjestoetsen + Enter.

// Volgorde + accentkleur per inhoudssoort (kleuren uit het brandbook).
const TYPE_VOLGORDE: ZoekType[] = [
  "Categorie",
  "Product",
  "Project",
  "Inspiratie",
  "Specialist",
  "Pagina",
];
const TYPE_KLEUR: Record<ZoekType, string> = {
  Product: "#01B6E3",
  Categorie: "#A1367E",
  Project: "#009D46",
  Inspiratie: "#F29828",
  Specialist: "#673981",
  Pagina: "#4A4A55",
};
const TYPE_LABEL: Record<ZoekType, string> = {
  Product: "Producten",
  Categorie: "Categorieën",
  Project: "Projecten",
  Inspiratie: "Inspiratie",
  Specialist: "Specialisten",
  Pagina: "Pagina's",
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
    else return -1; // dit woord komt nergens voor → geen match
  }
  return totaal;
}

// Markeert het deel van de titel dat matcht, voor visuele houvast.
function markeer(titel: string, woorden: string[]) {
  if (woorden.length === 0) return titel;
  const gevouwen = vouw(titel);
  // Pak het langste woord dat in de titel voorkomt om te accentueren.
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
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K opent of sluit; werkt overal op de site.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Bij openen: focus het veld en zet de pagina-scroll vast.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActief(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Gefilterde, gesorteerde, op type gegroepeerde resultaten.
  const groepen = useMemo(() => {
    const woorden = vouw(query.trim()).split(/\s+/).filter(Boolean);

    // Zonder zoekterm: toon een handige set snelkoppelingen.
    const bron =
      woorden.length === 0
        ? items
            .filter((i) => i.type === "Pagina" || i.type === "Specialist")
            .map((i) => ({ i, s: 0 }))
        : items
            .map((i) => ({ i, s: score(i, woorden) }))
            .filter((r) => r.s >= 0)
            .sort((a, b) => b.s - a.s)
            .slice(0, 30);

    const perType = new Map<ZoekType, ZoekItem[]>();
    for (const { i } of bron) {
      const lijst = perType.get(i.type) ?? [];
      if (lijst.length < 6) lijst.push(i);
      perType.set(i.type, lijst);
    }
    return TYPE_VOLGORDE.filter((t) => perType.has(t)).map((t) => ({
      type: t,
      items: perType.get(t)!,
    }));
  }, [items, query]);

  // Platte lijst voor de toetsenbordnavigatie (volgt de weergavevolgorde).
  const plat = useMemo(() => groepen.flatMap((g) => g.items), [groepen]);

  // Houd de actieve index binnen bereik als de resultaten wijzigen.
  useEffect(() => {
    setActief((a) => Math.min(a, Math.max(0, plat.length - 1)));
  }, [plat.length]);

  function ga(item: ZoekItem) {
    setOpen(false);
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
    }
  }

  return (
    <>
      {/* Knop in de header */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Zoeken"
        className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-3 py-2 text-sm text-ink-2 transition-colors hover:border-ink-2 hover:text-ink"
      >
        <ZoekIcoon className="h-4 w-4" />
        <span className="hidden lg:inline">Zoeken</span>
        <kbd className="hidden rounded border border-rule bg-paper-2 px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-2 lg:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/50 p-4 backdrop-blur-sm sm:pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-rule bg-white shadow-2xl"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Zoeken op de site"
            >
              {/* Zoekveld */}
              <div className="flex items-center gap-3 border-b border-rule px-4">
                <ZoekIcoon className="h-5 w-5 shrink-0 text-ink-2" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActief(0);
                  }}
                  onKeyDown={toetsen}
                  placeholder="Zoek in producten, projecten, inspiratie, specialisten…"
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-ink-2"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded border border-rule px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-2"
                >
                  Esc
                </button>
              </div>

              {/* Resultaten */}
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {plat.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-ink-2">
                    Niets gevonden voor “{query}”.
                  </p>
                ) : (
                  groepen.map((groep) => (
                    <Fragment key={groep.type}>
                      <p className="flex items-center gap-2 px-4 pb-1 pt-3 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: TYPE_KLEUR[groep.type] }}
                        />
                        {TYPE_LABEL[groep.type]}
                      </p>
                      {groep.items.map((item) => {
                        const idx = plat.indexOf(item);
                        const isActief = idx === actief;
                        return (
                          <button
                            key={item.href + item.titel}
                            type="button"
                            onClick={() => ga(item)}
                            onMouseMove={() => setActief(idx)}
                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActief ? "bg-paper-2" : ""
                            }`}
                          >
                            <Thumb item={item} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm text-ink">
                                {markeer(
                                  item.titel,
                                  vouw(query.trim()).split(/\s+/).filter(Boolean)
                                )}
                              </span>
                              {item.sub && (
                                <span className="block truncate text-xs text-ink-2">
                                  {item.sub}
                                </span>
                              )}
                            </span>
                            {isActief && (
                              <span className="shrink-0 font-mono text-[0.65rem] text-ink-2">
                                ↵
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </Fragment>
                  ))
                )}
              </div>

              {/* Voettekst met hints */}
              <div className="flex items-center gap-4 border-t border-rule px-4 py-2.5 text-[0.7rem] text-ink-2">
                <span className="flex items-center gap-1">
                  <Toets>↑</Toets>
                  <Toets>↓</Toets>
                  navigeren
                </span>
                <span className="flex items-center gap-1">
                  <Toets>↵</Toets>
                  openen
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <Toets>esc</Toets>
                  sluiten
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Thumbnail: productfoto/portret indien aanwezig, anders een merkkleur-vlak met
// de eerste letter van de titel.
function Thumb({ item }: { item: ZoekItem }) {
  if (item.beeld) {
    return (
      <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-md border border-rule bg-paper-2">
        <Image
          src={item.beeld}
          alt=""
          fill
          sizes="36px"
          className={
            item.type === "Specialist" ? "object-cover" : "object-contain p-0.5"
          }
        />
      </span>
    );
  }
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-display text-sm font-bold text-white"
      style={{ background: TYPE_KLEUR[item.type] }}
    >
      {item.titel.charAt(0).toUpperCase()}
    </span>
  );
}

function Toets({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-rule bg-paper-2 px-1.5 py-0.5 font-mono text-[0.65rem]">
      {children}
    </kbd>
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
