"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Beeldgalerij voor de projectdetailpagina — gebouwd om dure inrichtingen te
// laten ademen. Twee lagen:
//
//   1. Een MASONRY-raster op de pagina: foto's met variërende hoogtes vullen de
//      kolommen organisch (geen strak grid), zoals een fotoportfolio.
//   2. Een FULLSCREEN SWIPE-CARROUSEL als lightbox: klik een foto en blader er
//      doorheen met swipe (mobiel én desktop sleepbaar), pijltjes, toetsenbord
//      of de thumbnail-strip onderaan. Een teller ("3 / 24") toont de omvang.
//
// prefers-reduced-motion wordt overal gerespecteerd.

// Variërende beeldverhoudingen voor het masonry-effect. We kennen de echte
// afmetingen niet (externe foto's), dus cyclen we een patroon van staande,
// liggende en vierkante kaders — dat oogt levendig zonder layout-shift.
const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[3/2]",
  "aspect-[1/1]",
  "aspect-[4/3]",
  "aspect-[5/6]",
  "aspect-[3/4]",
];

export default function ProjectGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  // open = index van de getoonde foto in de carrousel; null = dicht.
  // richting onthoudt of we vooruit (1) of achteruit (-1) bladeren voor de slide.
  const [open, setOpen] = useState<number | null>(null);
  const [richting, setRichting] = useState(0);
  const reduce = useReducedMotion();
  const thumbRef = useRef<HTMLDivElement>(null);

  const sluit = useCallback(() => setOpen(null), []);

  const ga = useCallback(
    (delta: number) => {
      setRichting(delta);
      setOpen((i) =>
        i === null ? i : (i + delta + images.length) % images.length
      );
    },
    [images.length]
  );
  const volgende = useCallback(() => ga(1), [ga]);
  const vorige = useCallback(() => ga(-1), [ga]);

  const naar = useCallback(
    (index: number) => {
      setOpen((i) => {
        if (i !== null) setRichting(index > i ? 1 : -1);
        return index;
      });
    },
    []
  );

  // Toetsenbordbediening van de carrousel.
  useEffect(() => {
    if (open === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") sluit();
      if (e.key === "ArrowRight") volgende();
      if (e.key === "ArrowLeft") vorige();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, sluit, volgende, vorige]);

  // Blokkeer paginascroll zolang de lightbox openstaat.
  useEffect(() => {
    if (open === null) return;
    const vorig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorig;
    };
  }, [open]);

  // Houd de actieve thumbnail in beeld terwijl je bladert.
  useEffect(() => {
    if (open === null || !thumbRef.current) return;
    const actief = thumbRef.current.querySelector<HTMLElement>(
      `[data-thumb="${open}"]`
    );
    actief?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [open]);

  if (images.length === 0) return null;

  // Slide-animatie voor de carrousel: nieuwe foto komt vanaf de kant waar je
  // heen bladert, de oude verdwijnt naar de andere kant.
  const slide = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <>
      {/* ── Masonry-raster ───────────────────────────────────── */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => naar(i)}
            className={`group relative block w-full overflow-hidden rounded-xl bg-paper-2 ${
              ASPECTS[i % ASPECTS.length]
            }`}
            aria-label={`Foto ${i + 1} van ${images.length} vergroten`}
          >
            <Image
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
            {/* Zacht verloop + vergroot-hint bij hover */}
            <span className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 3h6m0 0v6m0-6L14 10M9 21H3m0 0v-6m0 6l7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {/* ── Fullscreen swipe-carrousel ───────────────────────── */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} — fotogalerij`}
          >
            {/* Bovenbalk: teller + sluiten */}
            <div className="flex items-center justify-between px-5 py-4 text-white md:px-8">
              <span className="font-display text-sm font-bold tracking-wide">
                {open + 1}
                <span className="mx-1 text-white/50">/</span>
                <span className="text-white/70">{images.length}</span>
              </span>
              <button
                type="button"
                onClick={sluit}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Sluiten"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Beeldvlak: sleepbaar (swipe) */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence custom={richting} initial={false} mode="popLayout">
                <motion.div
                  key={open}
                  className="absolute inset-0 flex items-center justify-center px-4 md:px-16"
                  custom={richting}
                  variants={reduce ? undefined : slide}
                  initial={reduce ? { opacity: 0 } : "enter"}
                  animate={reduce ? { opacity: 1 } : "center"}
                  exit={reduce ? { opacity: 0 } : "exit"}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 32 },
                    opacity: { duration: 0.2 },
                  }}
                  drag={images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    const weg = info.offset.x;
                    const vaart = info.velocity.x;
                    // Genoeg gesleept of snel genoeg geflikt → blader door.
                    if (weg < -80 || vaart < -400) volgende();
                    else if (weg > 80 || vaart > 400) vorige();
                  }}
                >
                  <div className="relative h-full w-full max-w-5xl">
                    <Image
                      src={images[open]}
                      alt={`${alt} — foto ${open + 1}`}
                      fill
                      priority
                      sizes="100vw"
                      className="select-none object-contain"
                      draggable={false}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pijltjes (desktop) */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={vorige}
                    className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/25 md:flex"
                    aria-label="Vorige foto"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={volgende}
                    className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/25 md:flex"
                    aria-label="Volgende foto"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail-strip */}
            {images.length > 1 && (
              <div
                ref={thumbRef}
                className="flex gap-2 overflow-x-auto px-5 py-4 md:px-8"
                style={{ scrollbarWidth: "thin" }}
              >
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    data-thumb={i}
                    type="button"
                    onClick={() => naar(i)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-all ${
                      i === open
                        ? "ring-2 ring-white ring-offset-2 ring-offset-ink"
                        : "opacity-50 hover:opacity-90"
                    }`}
                    aria-label={`Naar foto ${i + 1}`}
                    aria-current={i === open}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
