import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrancheData, getBrancheSlugs } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/motion/Reveal";
import SpecialistCTA from "@/components/SpecialistCTA";

export const revalidate = 300; // ISR: elke 5 minuten verversen (CMS-wijzigingen snel live)

export async function generateStaticParams() {
  return getBrancheSlugs().map((branche) => ({ branche }));
}

export async function generateMetadata({
  params,
}: {
  params: { branche: string };
}): Promise<Metadata> {
  const data = await getBrancheData(params.branche);
  if (!data) return { title: "Branches" };
  return {
    title: `${data.branche.naam} | Inrichting door Weststrate`,
    description: data.branche.pitch,
    alternates: { canonical: `/branches/${params.branche}` },
    openGraph: {
      title: `${data.branche.naam} | Inrichting door Weststrate`,
      description: data.branche.pitch,
      images: data.beeld ? [{ url: data.beeld }] : undefined,
    },
  };
}

export default async function BranchePage({
  params,
}: {
  params: { branche: string };
}) {
  const data = await getBrancheData(params.branche);
  if (!data) notFound();
  const { branche, producten, projecten, beeld } = data;

  // De intro bestaat uit alinea's, gescheiden door een lege regel.
  const alineas = branche.intro.split("\n\n");

  return (
    <div>
      {/* ── Hero met sfeerbeeld ────────────────────────── */}
      <section className="relative">
        <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
          {beeld ? (
            <Image
              src={beeld}
              alt={branche.naam}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-paper-2" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-content px-5">
              <Reveal className="max-w-xl text-white" y={24}>
                <nav className="mb-4 text-sm text-white/75">
                  <Link href="/branches" className="hover:text-white">
                    Branches
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="text-white">{branche.menukort}</span>
                </nav>
                <span
                  className="block h-1 w-12 rounded-full"
                  style={{ background: branche.accent }}
                />
                <h1 className="mt-4 text-[1.9rem] leading-tight text-white md:text-5xl md:leading-[1.05]">
                  {branche.naam}
                </h1>
                <p className="mt-4 max-w-lg text-base text-white/85 md:text-lg">
                  {branche.pitch}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
        <div className="merkbalk" />
      </section>

      {/* ── Intro + waar wij op letten ─────────────────── */}
      <section className="mx-auto max-w-content px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="kicker mb-3">Onze aanpak</p>
            <h2 className="text-3xl md:text-4xl">
              Eén partner voor de hele inrichting
            </h2>
            <div className="mt-5 space-y-4 text-lg text-ink-2">
              {alineas.map((alinea, i) => (
                <p key={i}>{alinea}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:pt-2">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-2">
              Waar wij op letten
            </p>
            <ul className="mt-4 space-y-4">
              {branche.punten.map((punt) => {
                const [kop, ...rest] = punt.split(": ");
                const tekst = rest.join(": ");
                return (
                  <li key={punt} className="flex gap-3">
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: branche.accent }}
                    />
                    <span className="text-ink-2">
                      <span className="font-semibold text-ink">{kop}:</span>{" "}
                      {tekst}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Relevante producten ────────────────────────── */}
      {producten.length > 0 && (
        <section className="bg-paper-2 py-16">
          <div className="mx-auto max-w-content px-5">
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker mb-3">Uit het assortiment</p>
                <h2 className="text-3xl md:text-4xl">
                  Meubilair dat hier past
                </h2>
              </div>
              <Link
                href="/catalogus"
                className="text-sm font-semibold text-brand hover:underline"
              >
                Hele catalogus →
              </Link>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {producten.map((p, i) => (
                <Reveal key={p._id} delay={i * 0.05}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bewijs: echte projecten (alleen als die er zijn) ── */}
      {projecten.length > 0 && (
        <section className="mx-auto max-w-content px-5 py-16">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker mb-3">In de praktijk</p>
              <h2 className="text-3xl md:text-4xl">Zo deden we dit eerder</h2>
            </div>
            <Link
              href="/projecten"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Alle projecten →
            </Link>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {projecten.map((pr, i) => (
              <Reveal key={pr._id} delay={i * 0.08}>
                <ProjectCard project={pr} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Afsluitende CTA: persoonlijk, met John ─────── */}
      <SpecialistCTA
        titel="Benieuwd wat we voor jouw ruimte kunnen betekenen?"
        tekst="Leg je vraag voor aan John Provoost, onze accountmanager meubilair. Hij denkt graag met je mee over de inrichting van je ruimte."
        className="py-20"
      />
    </div>
  );
}
