import Link from "next/link";
import Image from "next/image";
import { getProducten, getProjecten, getPosts } from "@/lib/data";
import { CATEGORIE_LABELS, type Categorie } from "@/lib/types";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";

export const revalidate = 3600; // ISR: elk uur verversen

// Beeld + accent per categorie voor de visuele catalogus-tegels.
const CATEGORIE_TEGEL: Record<
  Categorie,
  { kleur: string; beeld: string; tekst: string }
> = {
  bureaustoelen: {
    kleur: "#A1367E",
    beeld: "/beelden/project-directiekamer.png",
    tekst: "Ergonomisch zitten, van flexplek tot directiekamer.",
  },
  bureaus: {
    kleur: "#01B6E3",
    beeld: "/beelden/hero-kantoor.png",
    tekst: "Vaste en zit-sta bureaus, in de maat die past.",
  },
  vergadertafels: {
    kleur: "#009D46",
    beeld: "/beelden/project-vergaderruimte.png",
    tekst: "Overlegtafels voor elk team en elke ruimte.",
  },
};

const DISCIPLINES = [
  {
    titel: "Advies op locatie",
    tekst:
      "We kijken mee in je pand, meten op en denken na over indeling, ergonomie en akoestiek.",
  },
  {
    titel: "Levering uit voorraad",
    tekst:
      "Een breed assortiment uit eigen voorraad. Je weet vooraf wat er komt en wanneer.",
  },
  {
    titel: "Montage en oplevering",
    tekst:
      "Onze monteurs plaatsen alles op locatie. Jij stapt een werkplek binnen die klaar is.",
  },
];

export default async function HomePage() {
  const [producten, projecten, posts] = await Promise.all([
    getProducten(),
    getProjecten(),
    getPosts(),
  ]);
  const uitgelichteProjecten = projecten.slice(0, 3);
  const uitgelichtePosts = posts.slice(0, 3);

  return (
    <div>
      {/* ── Hero met beeld ─────────────────────────────── */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <Image
            src="/beelden/hero-kantoor.png"
            alt="Ingericht kantoor met zit-sta bureaus en ergonomische stoelen"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Verloop voor leesbaarheid van de tekst links */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-content px-5">
              <div className="max-w-xl text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  Werkplekinrichting voor dealers en bedrijven
                </p>
                <h1 className="mt-4 text-4xl leading-[1.05] text-white md:text-6xl">
                  Wij richten je werkplek volledig in.
                </h1>
                <p className="mt-6 max-w-lg text-lg text-white/85">
                  Van één ergonomische stoel tot een compleet kantoor. Advies,
                  levering en montage uit één hand.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/projecten"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
                  >
                    Bekijk onze projecten
                  </Link>
                  <Link
                    href="/catalogus"
                    className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Naar de catalogus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="merkbalk" />
      </section>

      {/* ── Wat Weststrate doet ────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-20">
        <div className="max-w-2xl">
          <p className="kicker mb-3">De veelzijdige specialist</p>
          <h2 className="text-3xl md:text-4xl">
            Eén partner voor de hele inrichting.
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            Je hoeft niet te kiezen tussen losse leveranciers. Weststrate regelt
            het advies, de meubels en de montage — afgestemd op jouw mensen en
            jouw ruimte.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-3">
          {DISCIPLINES.map((d, i) => (
            <div key={d.titel} className="bg-white p-8">
              <p className="font-mono text-sm text-brand">0{i + 1}</p>
              <h3 className="mt-3 text-xl">{d.titel}</h3>
              <p className="mt-2 text-sm text-ink-2">{d.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projecten (visueel bewijs) ─────────────────── */}
      <section className="bg-paper-2 py-20">
        <div className="mx-auto max-w-content px-5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker mb-3">Recent uitgevoerd</p>
              <h2 className="text-3xl md:text-4xl">Zo ziet het er in de praktijk uit</h2>
            </div>
            <Link
              href="/projecten"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Alle projecten →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {uitgelichteProjecten.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorieën visueel ────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-20">
        <div className="mb-10">
          <p className="kicker mb-3">Het assortiment</p>
          <h2 className="text-3xl md:text-4xl">Waaruit je kiest</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(Object.keys(CATEGORIE_LABELS) as Categorie[]).map((cat) => {
            const tegel = CATEGORIE_TEGEL[cat];
            return (
              <Link
                key={cat}
                href={`/catalogus/${cat}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <Image
                  src={tegel.beeld}
                  alt={CATEGORIE_LABELS[cat]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span
                    className="block h-1 w-10 rounded-full"
                    style={{ background: tegel.kleur }}
                  />
                  <h3 className="mt-3 text-2xl text-white">
                    {CATEGORIE_LABELS[cat]}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">{tegel.tekst}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Inspiratie / blog ──────────────────────────── */}
      <section className="bg-paper-2 py-20">
        <div className="mx-auto max-w-content px-5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker mb-3">Inspiratie</p>
              <h2 className="text-3xl md:text-4xl">Kennis over werkplekken</h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Alle artikelen →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {uitgelichtePosts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Afsluitende CTA (offerte secundair) ────────── */}
      <section className="mx-auto max-w-content px-5 py-24">
        <div className="rounded-3xl bg-ink px-8 py-16 text-center text-white md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl text-white md:text-4xl">
            Benieuwd wat we voor jouw werkplek kunnen betekenen?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Stel vrijblijvend een selectie samen, of leg je vraag voor aan een
            van onze specialisten. We denken graag mee.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogus"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              Bekijk de catalogus
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Neem contact op
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
