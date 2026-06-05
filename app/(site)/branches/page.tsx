import type { Metadata } from "next";
import { getBrancheKaarten } from "@/lib/data";
import { GROEP_LABEL, type BrancheGroep } from "@/lib/branches";
import BrancheCard from "@/components/BrancheCard";
import Reveal from "@/components/motion/Reveal";

export const revalidate = 3600; // ISR: elk uur verversen

export const metadata: Metadata = {
  title: "Branches | Inrichting per branche en ruimte",
  description:
    "Weststrate richt complete ruimtes in voor kantoren, zorg, onderwijs en horeca. Van kantine en vergaderruimte tot nieuwbouw en renovatie, met advies, levering en montage uit één hand.",
};

// Volgorde waarin we de groepen tonen.
const GROEP_VOLGORDE: BrancheGroep[] = ["Branche", "Ruimte", "Project"];

export default async function BranchesPage() {
  const kaarten = await getBrancheKaarten();

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <Reveal className="max-w-2xl">
        <p className="kicker mb-3">Inrichting per branche en ruimte</p>
        <h1 className="text-4xl md:text-5xl">
          We richten ruimtes in, geen losse meubels
        </h1>
        <p className="mt-4 text-lg text-ink-2">
          Of je nu een kantoor, een zorglocatie, een school of een
          horecaruimte inricht: Weststrate denkt mee over de hele ruimte,
          levert uit een breed assortiment en monteert met een eigen team. Kies
          je situatie en zie wat we voor je kunnen doen.
        </p>
      </Reveal>

      {GROEP_VOLGORDE.map((groep) => {
        const inGroep = kaarten.filter((k) => k.groep === groep);
        if (inGroep.length === 0) return null;
        return (
          <section key={groep} className="mt-14">
            <Reveal className="mb-6">
              <h2 className="text-2xl md:text-3xl">{GROEP_LABEL[groep]}</h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {inGroep.map((kaart, i) => (
                <Reveal key={kaart.slug} delay={i * 0.06}>
                  <BrancheCard kaart={kaart} sizes="(max-width: 768px) 100vw, 25vw" />
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
