"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Beeldgalerij voor de projectdetailpagina. Een verzorgd raster van foto's dat
// bij hover zacht inzoomt; klik op een foto opent een lightbox waarin je met
// pijltjes (of toetsenbord) door alle foto's bladert. Het beeld staat centraal,
// dus de galerij mag de ruimte nemen.

export default function ProjectGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const sluit = useCallback(() => setOpen(null), []);
  const volgende = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const vorige = useCallback(
    () => setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  // Toetsenbordbediening van de lightbox.
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

  if (images.length === 0) return null;

  return (
    <>
      {/* Raster: eerste foto groot, de rest in een net grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-xl bg-paper-2 ${
              i === 0 ? "aspect-[16/10] sm:col-span-2" : "aspect-[4/3]"
            }`}
            aria-label={`Foto ${i + 1} vergroten`}
          >
            <Image
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              sizes={i === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={sluit}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              key={open}
              className="relative h-[78vh] w-full max-w-5xl"
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[open]}
                alt={`${alt} — foto ${open + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>

            {/* Bediening */}
            <button
              type="button"
              onClick={sluit}
              className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink"
            >
              Sluiten
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    vorige();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-ink transition-transform hover:scale-110"
                  aria-label="Vorige foto"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    volgende();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-ink transition-transform hover:scale-110"
                  aria-label="Volgende foto"
                >
                  ›
                </button>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink">
                  {open + 1} / {images.length}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
