"use client";

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
  { href: "/werkplek", label: "Werkplek samenstellen" },
  { href: "/projecten", label: "Projecten" },
  { href: "/blog", label: "Inspiratie" },
  { href: "/over", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  categorieen,
  zoekIndex,
}: {
  categorieen: NavHoofd[];
  zoekIndex: ZoekItem[];
}) {
  const pathname = usePathname();
  const { aantalItems } = useOfferte();

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
        </div>
      </div>

      {/* Categoriebalk met megamenu (desktop) */}
      <CategoryNav categorieen={categorieen} />

      {/* Mobiele navigatie: contextnav + categorieën */}
      <div className="md:hidden">
        <nav className="flex items-center gap-5 overflow-x-auto border-t border-rule px-5 py-2.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm text-ink-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="flex flex-wrap items-center gap-2 bg-ink px-5 py-3 text-white">
          <Link
            href="/catalogus"
            className="whitespace-nowrap rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold"
          >
            Alle meubilair
          </Link>
          {categorieen.map((cat) => (
            <Link
              key={cat.hoofd}
              href={`/catalogus#${cat.hoofd
                .toLowerCase()
                .normalize("NFD")
                .replace(/[̀-ͯ]/g, "")
                .replace(/[^a-z0-9]+/g, "-")}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-3 py-1.5 text-sm"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: cat.kleur }}
              />
              {cat.hoofd}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
