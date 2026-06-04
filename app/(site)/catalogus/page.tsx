import Link from "next/link";
import type { Metadata } from "next";
import { getCategorieStructuur } from "@/lib/data";
import { slugify } from "@/lib/types";
import ProductMedia from "@/components/ProductMedia";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Catalogus",
  description:
    "Het volledige snelleverprogramma van Weststrate Meubilair: bureaus, stoelen, tafels en opbergmeubilair.",
};

export default async function CatalogusPage() {
  const structuur = await getCategorieStructuur();

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <p className="kicker mb-3">Catalogus</p>
      <h1 className="text-4xl">Ons assortiment</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        Direct leverbaar uit het snelleverprogramma. Kies een categorie en stel
        je eigen uitvoering samen.
      </p>

      {/* Snelnavigatie naar de hoofdcategorieën */}
      <div className="mt-6 flex flex-wrap gap-2">
        {structuur.map((groep) => (
          <a
            key={groep.hoofd}
            href={`#${slugify(groep.hoofd)}`}
            className="rounded-full border border-rule px-4 py-2 text-sm text-ink-2 transition-colors hover:border-brand hover:text-brand"
          >
            {groep.hoofd}
          </a>
        ))}
      </div>

      {/* Per hoofdcategorie een blok met subcategorie-tegels */}
      {structuur.map((groep) => (
        <section
          key={groep.hoofd}
          id={slugify(groep.hoofd)}
          className="mt-16 scroll-mt-24"
        >
          <h2 className="text-2xl">{groep.hoofd}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groep.subs.map((sub) => (
              <Link
                key={sub.slug}
                href={`/catalogus/${sub.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-rule bg-paper-2"
              >
                <ProductMedia
                  src={sub.beeld}
                  alt={sub.sub}
                  naam={sub.sub}
                  categorie={groep.hoofd}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                  <h3 className="text-lg text-white">{sub.sub}</h3>
                  <p className="text-sm text-white/80">
                    {sub.aantal} {sub.aantal === 1 ? "product" : "producten"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
