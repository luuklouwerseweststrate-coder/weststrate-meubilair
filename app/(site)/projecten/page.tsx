import type { Metadata } from "next";
import { getProjecten } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/motion/Reveal";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projecten",
  description:
    "Uitgevoerde projectinrichtingen van Weststrate: van gemeentehuis en bibliotheek tot kantoor en horeca.",
};

export default async function ProjectenPage() {
  const projecten = await getProjecten();

  return (
    <div className="mx-auto max-w-content px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="kicker mb-3">Projecten</p>
        <h1 className="text-4xl md:text-5xl">Wat we hebben ingericht</h1>
        <p className="mt-4 text-lg text-ink-2">
          Elk pand en elk team is anders. Deze projecten laten zien hoe we
          advies, meubilair en montage samenbrengen tot een ruimte die klopt.
        </p>
      </Reveal>

      {/* Raster van cinematische portret-kaarten, gestaffeld in beeld. */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projecten.map((p, i) => (
          <Reveal key={p._id} delay={Math.min(i, 6) * 0.06}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
