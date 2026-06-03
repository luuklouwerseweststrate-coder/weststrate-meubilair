"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOfferte } from "@/lib/offerte";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/catalogus", label: "Catalogus" },
  { href: "/over", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { aantalItems } = useOfferte();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="merkbalk" />
      <div className="mx-auto flex max-w-content items-center justify-between gap-6 px-5 py-4">
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

      {/* Mobiele navigatie */}
      <nav className="flex items-center gap-5 overflow-x-auto border-t border-rule px-5 py-2.5 md:hidden">
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
    </header>
  );
}
