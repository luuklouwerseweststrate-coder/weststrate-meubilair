import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjecten } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";
import ProjectHero from "@/components/ProjectHero";
import ProjectGallery from "@/components/ProjectGallery";
import Accountmanager from "@/components/Accountmanager";

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
  // Meta-omschrijving netjes inkorten op een woordgrens (~155 tekens).
  const omschrijving =
    project.intro.length > 158
      ? project.intro.slice(0, 155).replace(/\s+\S*$/, "") + "…"
      : project.intro;
  return {
    title: project.title,
    description: omschrijving,
    alternates: { canonical: `/projecten/${params.slug}` },
    openGraph: {
      title: project.title,
      description: omschrijving,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
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

  // Galerijbeelden: de extra foto's; valt het hoofdbeeld weg, dan tonen we niets.
  const galerij = project.images ?? [];

  const meta = [project.sector, project.locatie, project.jaar].filter(Boolean);

  return (
    <article>
      {/* ── Parallax hero ──────────────────────────────── */}
      <ProjectHero
        image={project.image}
        title={project.title}
        klant={project.klant}
        meta={meta}
      />

      <div className="mx-auto max-w-content px-5 py-14">
        <nav className="mb-12 text-sm text-ink-2">
          <Link href="/projecten" className="hover:text-brand">
            Projecten
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{project.klant || project.title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Verhaal */}
          <div className="max-w-2xl">
            <Reveal>
              <p className="font-display text-2xl font-extrabold leading-snug text-ink md:text-3xl">
                {project.intro}
              </p>
            </Reveal>
            {blokken.map((b) => (
              <Reveal key={b.kop} className="mt-12">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-1.5 rounded-full bg-brand" />
                  <h2 className="text-2xl">{b.kop}</h2>
                </div>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-2">
                  {b.tekst}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Zijbalk: cijfers + categorieën (sticky) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {project.cijfers.length > 0 && (
              <Reveal className="overflow-hidden rounded-2xl border border-rule bg-ink p-7 text-white">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Dit project in cijfers
                </p>
                <dl className="space-y-6">
                  {project.cijfers.map((c, i) => (
                    <div key={i} className="border-l-2 border-brand pl-4">
                      <dt className="font-display text-4xl font-extrabold leading-none text-white">
                        {c.waarde}
                      </dt>
                      <dd className="mt-1.5 text-sm text-white/70">{c.label}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
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

            <Accountmanager
              className="mt-6"
              titel="Een soortgelijk project? Bespreek het met John Provoost,"
            />
          </aside>
        </div>

        {/* ── Beeldgalerij ─────────────────────────────── */}
        {galerij.length > 0 && (
          <Reveal className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="kicker mb-2">In beeld</p>
                <h2 className="text-2xl md:text-3xl">
                  {galerij.length} foto&apos;s van deze inrichting
                </h2>
              </div>
              <p className="hidden text-sm text-ink-2 sm:block">
                Klik een foto om te vergroten en door te bladeren
              </p>
            </div>
            <ProjectGallery images={galerij} alt={project.title} />
          </Reveal>
        )}

        {/* ── Naar overzicht ───────────────────────────── */}
        <div className="mt-16 border-t border-rule pt-10 text-center">
          <Link
            href="/projecten"
            className="text-sm font-semibold text-brand hover:underline"
          >
            ← Alle projecten
          </Link>
        </div>
      </div>
    </article>
  );
}
