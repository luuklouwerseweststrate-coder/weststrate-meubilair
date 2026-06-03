import Link from "next/link";
import type { Metadata } from "next";
import { getProducten } from "@/lib/data";
import { CATEGORIE_LABELS, type Categorie } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Catalogus",
  description:
    "Alle bureaustoelen, bureaus en vergadertafels van Weststrate Meubilair.",
};

export default async function CatalogusPage() {
  const producten = await getProducten();
  const categorieen = Object.keys(CATEGORIE_LABELS) as Categorie[];

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <p className="kicker mb-3">Catalogus</p>
      <h1 className="text-4xl">Ons assortiment</h1>

      {/* Categorie-filters (links) */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categorieen.map((cat) => (
          <Link
            key={cat}
            href={`/catalogus/${cat}`}
            className="rounded-full border border-rule px-4 py-2 text-sm text-ink-2 transition-colors hover:border-brand hover:text-brand"
          >
            {CATEGORIE_LABELS[cat]}
          </Link>
        ))}
      </div>

      {/* Per categorie een blok */}
      {categorieen.map((cat) => {
        const items = producten.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mt-14">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-2xl">{CATEGORIE_LABELS[cat]}</h2>
              <Link
                href={`/catalogus/${cat}`}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Alles bekijken →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
