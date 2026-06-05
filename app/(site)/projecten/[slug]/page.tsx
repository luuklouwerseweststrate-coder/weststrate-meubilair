import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjecten } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";
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
      {/* ── Full-bleed hero ────────────────────────────── */}
      <div className="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-content px-5 pb-12">
            <Reveal className="text-white" y={24}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                {meta.join(" · ")}
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl leading-[1.08] text-white md:text-5xl">
                {project.title}
              </h1>
              {project.klant && (
                <p className="mt-4 text-lg text-white/85">{project.klant}</p>
              )}
            </Reveal>
          </div>
        </div>
        <div className="merkbalk absolute bottom-0 left-0" />
      </div>

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
              <Reveal className="rounded-2xl border border-rule bg-white p-6">
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
          <Reveal className="mt-16">
            <p className="kicker mb-5">In beeld</p>
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
