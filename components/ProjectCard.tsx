import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projecten/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-rule bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-paper-2" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          {project.sector}
        </span>
      </div>
      <div className="p-6">
        <p className="font-mono text-xs text-ink-2">
          {project.klant} · {project.locatie} · {project.jaar}
        </p>
        <h3 className="mt-2 text-xl leading-snug group-hover:text-brand">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-2">{project.intro}</p>
        <span className="mt-4 inline-block text-sm font-semibold text-brand">
          Bekijk dit project →
        </span>
      </div>
    </Link>
  );
}
