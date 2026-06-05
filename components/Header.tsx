"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOfferte } from "@/lib/offerte";
import type { NavHoofd } from "@/lib/categorieen";
import type { ZoekItem } from "@/lib/types";
import Logo from "./Logo";
import CategoryNav from "./CategoryNav";
import Zoek from "./Zoek";

// Hulp-/contextnav (boven). De producten zelf zitten in de categoriebalk eronder.
const NAV = [
  { href: "/", label: "Home" },
  { href: "/branches", label: "Branches" },
  { href: "/projecten", label: "Projecten" },
  { href: "/blog", label: "Inspiratie" },
  { href: "/over", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

// Categorie → ankerslug op /catalogus (diacrieten en spaties eruit).
function catSlug(hoofd: string): string {
  return hoofd
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

export default function Header({
  categorieen,
  zoekIndex,
}: {
  categorieen: NavHoofd[];
  zoekIndex: ZoekItem[];
}) {
  const pathname = usePathname();
  const { aantalItems } = useOfferte();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sluit het mobiele menu zodra je naar een andere pagina gaat.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="merkbalk" />
      <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-5 py-4 md:gap-6">
        <Link href="/" aria-label="Naar home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const actief =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors hover:text-brand ${
                  actief ? "font-semibold text-brand" : "text-ink-2"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Zoek items={zoekIndex} />
          <Link
            href="/offerte"
            className="relative inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Offerte
            {aantalItems > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-brand">
                {aantalItems}
              </span>
            )}
          </Link>

          {/* Hamburger: alleen op mobiel, opent het uitklapmenu */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={menuOpen}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden ${
              menuOpen ? "border-brand text-brand" : "border-rule text-ink-2"
            }`}
          >
            {menuOpen ? (
              <KruisIcoon className="h-5 w-5" />
            ) : (
              <HamburgerIcoon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Categoriebalk met megamenu (desktop) */}
      <CategoryNav categorieen={categorieen} />

      {/* Mobiel uitklapmenu (vervangt de oude swipe-balk) */}
      {menuOpen && (
        <div className="border-t border-rule bg-paper md:hidden">
          <nav className="flex flex-col px-5">
            {NAV.map((item) => {
              const actief =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b border-rule/60 py-3.5 text-base ${
                    actief ? "font-semibold text-brand" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-5 pb-5 pt-4">
            <p className="kicker mb-3">Meubilair</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/catalogus"
                className="rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white"
              >
                Alle meubilair
              </Link>
              {categorieen.map((cat) => (
                <Link
                  key={cat.hoofd}
                  href={`/catalogus#${catSlug(cat.hoofd)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-sm text-ink-2"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: cat.kleur }}
                  />
                  {cat.hoofd}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function HamburgerIcoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KruisIcoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
