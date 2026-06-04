import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

// Cinematische projectkaart: groot beeld dat de hele kaart vult, tekst eroverheen
// in een verloop. Bij hover zoomt het beeld zacht in en lift de kaart op. Het
// beeld doet het werk — de tekst is kort en blijft leesbaar door het verloop.

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projecten/${project.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink"
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="h-full w-full bg-paper-2" />
      )}

      {/* Verloop voor leesbaarheid van de tekst onderaan */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />

      {/* Sector-chip linksboven */}
      {project.sector && (
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          {project.sector}
        </span>
      )}

      {/* Tekst onderaan */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">
          {[project.klant, project.locatie].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-2 text-xl font-extrabold leading-snug text-white">
          {project.title}
        </h3>
        {/* Lees-link schuift bij hover zacht open */}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white/0 transition-all duration-300 group-hover:text-white">
          Bekijk dit project
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
