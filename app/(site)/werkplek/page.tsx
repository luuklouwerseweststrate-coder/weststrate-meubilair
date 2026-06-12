import type { Metadata } from "next";
import { getWerkplekOpties } from "@/lib/data";
import WerkplekSamensteller from "@/components/WerkplekSamensteller";
import Reveal from "@/components/motion/Reveal";

export const revalidate = 300; // ISR: elke 5 minuten verversen (CMS-wijzigingen snel live)

export const metadata: Metadata = {
  title: "Stel je werkplek samen",
  description:
    "Stel in één keer een complete werkplek samen: bureau, stoel en opbergen. Zie direct wat het kost en zet het in je offerte.",
};

export default async function WerkplekPage() {
  const slots = await getWerkplekOpties();

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <Reveal className="max-w-2xl">
        <p className="kicker mb-3">Werkplek samenstellen</p>
        <h1 className="text-4xl md:text-5xl">
          Stel in één keer een complete werkplek samen
        </h1>
        <p className="mt-4 text-lg text-ink-2">
          Kies een bureau, een stoel en eventueel opbergruimte. Je ziet direct
          wat één werkplek kost, en wat het wordt voor het aantal werkplekken
          dat je nodig hebt. In één klik staat alles in je offerte.
        </p>
      </Reveal>

      <WerkplekSamensteller slots={slots} />
    </div>
  );
}
