"use client";

import { useState } from "react";

// Lichte YouTube-embed met "facade": we tonen eerst alleen de poster + een
// afspeelknop. Pas bij klik laden we de echte (privacy-vriendelijke) iframe.
// Voordeel: de zware YouTube-player vertraagt de pagina niet, en je houdt een
// strakke, eigen uitstraling tot iemand bewust afspeelt.
export default function VideoEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [spelen, setSpelen] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-sm">
      {spelen ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setSpelen(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Speel video af: ${title}`}
        >
          {/* hqdefault bestaat altijd (anders dan maxresdefault, die voor deze
              video ontbreekt en een grijze placeholder teruggeeft). hqdefault is
              4:3 met zwarte balken; object-cover in het 16:9-kader snijdt die weg. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/35" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-110">
            <span className="ml-1 block h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-groen" />
          </span>
        </button>
      )}
    </div>
  );
}
