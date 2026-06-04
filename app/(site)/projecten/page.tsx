import type { Metadata } from "next";
import { getProjecten } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projecten",
  description:
    "Uitgevoerde werkplekinrichtingen van Weststrate: van stadskantoor tot bestuurskamer.",
};

export default async function ProjectenPage() {
  const projecten = await getProjecten();

  return (
    <div className="mx-auto max-w-content px-5 py-16">
      <header className="max-w-2xl">
        <p className="kicker mb-3">Projecten</p>
        <h1 className="text-4xl md:text-5xl">Wat we hebben ingericht</h1>
        <p className="mt-4 text-lg text-ink-2">
          Elk pand en elk team is anders. Deze projecten laten zien hoe we
          advies, meubilair en montage samenbrengen tot een werkplek die klopt.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projecten.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </div>
    </div>
  );
}
