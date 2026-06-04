import CountUp from "./motion/CountUp";
import type { CatalogusStats } from "@/lib/data";

// Vertrouwensband onder de hero: de omvang van het assortiment in opvallende,
// optellende cijfers, plus twee vaste USP's. De getallen komen rechtstreeks uit
// de catalogus (geen verzonnen cijfers).

export default function StatsBand({ stats }: { stats: CatalogusStats }) {
  const items: { getal: number; suffix?: string; label: string }[] = [
    { getal: stats.series, label: "Productseries" },
    { getal: stats.uitvoeringen, suffix: "+", label: "Uitvoeringen" },
    { getal: stats.subcategorieen, label: "Categorieën" },
  ];

  return (
    <section className="border-y border-rule bg-white">
      <div className="mx-auto grid max-w-content gap-px bg-rule sm:grid-cols-2 lg:grid-cols-5">
        {items.map((it) => (
          <div key={it.label} className="bg-white px-6 py-8 text-center">
            <p className="font-display text-3xl font-extrabold text-brand md:text-4xl">
              <CountUp eind={it.getal} suffix={it.suffix} />
            </p>
            <p className="mt-1 text-sm text-ink-2">{it.label}</p>
          </div>
        ))}
        <div className="bg-white px-6 py-8 text-center">
          <p className="font-display text-lg font-extrabold text-ink">
            Uit voorraad
          </p>
          <p className="mt-1 text-sm text-ink-2">Snel leverbaar</p>
        </div>
        <div className="bg-white px-6 py-8 text-center">
          <p className="font-display text-lg font-extrabold text-ink">
            Eigen montage
          </p>
          <p className="mt-1 text-sm text-ink-2">Geplaatst op locatie</p>
        </div>
      </div>
    </section>
  );
}
