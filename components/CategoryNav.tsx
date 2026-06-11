"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavHoofd } from "@/lib/categorieen";
import CategorieIcon from "@/components/CategorieIcon";

// De horizontale categoriebalk met megamenu. Donkere, ingetogen balk (ink) met
// per hoofdcategorie een klein accent-stipje in de eigen merkkleur en een nette
// onderlijn bij hover/actief. Op desktop klapt per hoofdcategorie een paneel met
// de subcategorieën uit (hover); op mobiel een scrollbare balk (zie Header).
//
// Bewust géén kale aantallen meer in de balk zelf: die ogen als ruis. De diepte
// van het assortiment (series + uitvoeringen) staat in het megamenu, waar het
// context heeft.

export default function CategoryNav({
  categorieen,
}: {
  categorieen: NavHoofd[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav
      className="relative hidden bg-ink text-white md:block"
      aria-label="Productcategorieën"
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex max-w-content items-stretch px-5">
        <Link
          href="/catalogus"
          className="flex items-center gap-2 py-3.5 pr-5 text-sm font-semibold text-white/90 transition-colors hover:text-white"
        >
          Alle meubilair
        </Link>

        {categorieen.map((cat) => {
          const actief = open === cat.hoofd;
          return (
            <div key={cat.hoofd} onMouseEnter={() => setOpen(cat.hoofd)}>
              <Link
                href={`/catalogus#${slug(cat.hoofd)}`}
                className={`relative flex h-full items-center gap-2 px-4 py-3.5 text-sm transition-colors ${
                  actief ? "text-white" : "text-white/80 hover:text-white"
                }`}
                aria-expanded={actief}
              >
                {/* Accent-stipje in de eigen merkkleur van de categorie */}
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: cat.kleur }}
                />
                {cat.hoofd}
                <svg
                  viewBox="0 0 10 6"
                  className={`h-1.5 w-2.5 transition-transform duration-200 ${
                    actief ? "rotate-180" : ""
                  }`}
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Onderlijn die invliegt bij hover/actief, in de merkkleur */}
                <span
                  className={`absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full transition-transform duration-200 ${
                    actief ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ background: cat.kleur }}
                />
              </Link>

              {/* Megamenu-paneel */}
              {actief && (
                <div className="absolute left-0 right-0 top-full z-50 border-t-2 bg-white text-ink shadow-xl"
                  style={{ borderColor: cat.kleur }}
                >
                  <div className="mx-auto max-w-content px-5 py-6">
                    <div className="mb-4 flex items-baseline gap-3">
                      <h3
                        className="font-display text-lg font-extrabold"
                        style={{ color: cat.kleur }}
                      >
                        {cat.hoofd}
                      </h3>
                      <span className="text-sm text-ink-2">{cat.tagline}</span>
                      <span className="ml-auto text-xs text-ink-2">
                        {cat.series} series · {cat.uitvoeringen} uitvoeringen
                      </span>
                    </div>
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-1 lg:grid-cols-3">
                      {cat.subs.map((sub) => {
                        const subActief = pathname === `/catalogus/${sub.slug}`;
                        return (
                          <li key={sub.slug}>
                            <Link
                              href={`/catalogus/${sub.slug}`}
                              onClick={() => setOpen(null)}
                              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-paper-2 ${
                                subActief ? "font-semibold text-brand" : "text-ink"
                              }`}
                            >
                              {/* Line-icoon per productsoort, kleurt mee met de categorie */}
                              <CategorieIcon
                                naam={sub.icoon}
                                className="h-5 w-5 shrink-0"
                                style={{ color: cat.kleur }}
                              />
                              <span className="flex-1">{sub.label}</span>
                              <span className="text-xs text-ink-2">
                                {sub.uitvoeringen}
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
