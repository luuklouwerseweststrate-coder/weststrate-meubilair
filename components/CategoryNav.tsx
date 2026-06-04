"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavHoofd } from "@/lib/categorieen";

// De horizontale categoriebalk met megamenu, geïnspireerd op de balk op
// weststrate.nl maar dan voor het meubilair-assortiment. Op desktop klapt per
// hoofdcategorie een paneel met de subcategorieën uit (hover/focus). Op mobiel
// is het een horizontaal scrollbare balk met links naar de catalogus-ankers.

export default function CategoryNav({
  categorieen,
}: {
  categorieen: NavHoofd[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav
      className="relative hidden border-t border-rule bg-brand text-white md:block"
      aria-label="Productcategorieën"
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex max-w-content items-stretch gap-1 px-5">
        <Link
          href="/catalogus"
          className="flex items-center px-3 py-3 text-sm font-semibold text-white/90 hover:text-white"
        >
          Alle meubilair
        </Link>

        {categorieen.map((cat) => {
          const actief = open === cat.hoofd;
          return (
            <div
              key={cat.hoofd}
              className="static"
              onMouseEnter={() => setOpen(cat.hoofd)}
            >
              <Link
                href={`/catalogus#${slug(cat.hoofd)}`}
                className={`flex items-center gap-2 px-3 py-3 text-sm transition-colors ${
                  actief ? "bg-white/15 font-semibold" : "hover:bg-white/10"
                }`}
                aria-expanded={actief}
              >
                {cat.hoofd}
                <span className="text-xs text-white/60">{cat.totaal}</span>
              </Link>

              {/* Megamenu-paneel */}
              {actief && (
                <div className="absolute left-0 right-0 top-full z-50 border-t border-white/20 bg-white text-ink shadow-xl">
                  <div className="mx-auto max-w-content px-5 py-6">
                    <div className="mb-4 flex items-baseline gap-3">
                      <h3
                        className="font-display text-lg font-extrabold"
                        style={{ color: cat.kleur }}
                      >
                        {cat.hoofd}
                      </h3>
                      <span className="text-sm text-ink-2">{cat.tagline}</span>
                    </div>
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-1 lg:grid-cols-3">
                      {cat.subs.map((sub) => {
                        const subActief = pathname === `/catalogus/${sub.slug}`;
                        return (
                          <li key={sub.slug}>
                            <Link
                              href={`/catalogus/${sub.slug}`}
                              onClick={() => setOpen(null)}
                              className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-paper-2 ${
                                subActief ? "font-semibold text-brand" : "text-ink"
                              }`}
                            >
                              <span>{sub.label}</span>
                              <span className="text-xs text-ink-2">
                                {sub.aantal}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// Zelfde slug-logica als lib/types.slugify, hier klein gehouden voor de anchors.
function slug(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
