import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjecten } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projecten = await getProjecten();
  return projecten.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project niet gevonden" };
  return { title: project.title, description: project.intro };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const blokken = [
    { kop: "De uitdaging", tekst: project.uitdaging },
    { kop: "Onze aanpak", tekst: project.aanpak },
    { kop: "Het resultaat", tekst: project.resultaat },
  ].filter((b) => b.tekst);

  return (
    <article>
      {/* Hoofdbeeld */}
      <div className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-content px-5 pb-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              {project.sector} · {project.locatie} · {project.jaar}
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl text-white md:text-5xl">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-5 py-14">
        <nav className="mb-10 text-sm text-ink-2">
          <Link href="/projecten" className="hover:text-brand">
            Projecten
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{project.klant}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Verhaal */}
          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed text-ink">{project.intro}</p>
            {blokken.map((b) => (
              <div key={b.kop} className="mt-10">
                <h2 className="text-2xl">{b.kop}</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-2">
                  {b.tekst}
                </p>
              </div>
            ))}
          </div>

          {/* Zijbalk: cijfers + categorieën */}
          <aside className="lg:pt-1">
            {project.cijfers.length > 0 && (
              <div className="rounded-2xl border border-rule bg-white p-6">
                <p className="kicker mb-4">In cijfers</p>
                <dl className="space-y-5">
                  {project.cijfers.map((c, i) => (
                    <div key={i}>
                      <dt className="font-display text-3xl font-extrabold text-brand">
                        {c.waarde}
                      </dt>
                      <dd className="text-sm text-ink-2">{c.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {project.categorieen.length > 0 && (
              <div className="mt-6">
                <p className="kicker mb-3">Gebruikt meubilair</p>
                <div className="flex flex-wrap gap-2">
                  {project.categorieen.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-rule bg-white px-3 py-1 text-sm text-ink-2"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/contact"
              className="mt-8 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Bespreek jouw project
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
