import Link from "next/link";
import { getProducten } from "@/lib/data";
import { CATEGORIE_LABELS, type Categorie } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600; // ISR: elk uur verversen

const CATEGORIE_INTRO: Record<Categorie, { kleur: string; tekst: string }> = {
  bureaustoelen: {
    kleur: "#A1367E",
    tekst: "Ergonomisch zitten, van flexplek tot directiekamer.",
  },
  bureaus: {
    kleur: "#01B6E3",
    tekst: "Vaste en zit-sta bureaus, in de maat die past.",
  },
  vergadertafels: {
    kleur: "#009D46",
    tekst: "Overlegtafels voor elk team en elke ruimte.",
  },
};

export default async function HomePage() {
  const producten = await getProducten();
  const uitgelicht = producten.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-content px-5 pb-16 pt-16 md:pt-24">
        <p className="kicker mb-4">Kantoormeubilair voor dealers</p>
        <h1 className="max-w-3xl text-4xl leading-[1.05] md:text-6xl">
          Stel je meubilair samen,
          <br />
          wij regelen de offerte.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-2">
          Bureaustoelen, bureaus en vergadertafels van Weststrate. Kies de
          opties die je nodig hebt en zie direct wat het kost.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/catalogus"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Bekijk de catalogus
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-rule px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            Neem contact op
          </Link>
        </div>
      </section>

      {/* Categorieën */}
      <section className="mx-auto max-w-content px-5">
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(CATEGORIE_LABELS) as Categorie[]).map((cat) => {
            const intro = CATEGORIE_INTRO[cat];
            return (
              <Link
                key={cat}
                href={`/catalogus/${cat}`}
                className="group rounded-xl border border-rule bg-white p-6 transition-shadow hover:shadow-md"
              >
                <span
                  className="block h-1 w-10 rounded-full"
                  style={{ background: intro.kleur }}
                />
                <h2 className="mt-4 text-xl group-hover:text-brand">
                  {CATEGORIE_LABELS[cat]}
                </h2>
                <p className="mt-2 text-sm text-ink-2">{intro.tekst}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand">
                  Bekijken →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hoe werkt het */}
      <section className="mx-auto max-w-content px-5 py-20">
        <p className="kicker mb-3">Zo werkt het</p>
        <h2 className="mb-10 text-3xl">In drie stappen naar je offerte</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Kies je product",
              d: "Blader door de catalogus en open het product dat je zoekt.",
            },
            {
              n: "02",
              t: "Stel de opties samen",
              d: "Bladkleur, frame, armleggers — de prijs telt live mee.",
            },
            {
              n: "03",
              t: "Vraag de offerte aan",
              d: "Vul je gegevens in. Wij ontvangen je samenstelling direct.",
            },
          ].map((s) => (
            <div key={s.n}>
              <p className="font-mono text-sm text-brand">{s.n}</p>
              <h3 className="mt-2 text-lg">{s.t}</h3>
              <p className="mt-2 text-sm text-ink-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Uitgelicht */}
      <section className="mx-auto max-w-content px-5 pb-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl">Uitgelicht</h2>
          <Link
            href="/catalogus"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Alle producten →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {uitgelicht.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
