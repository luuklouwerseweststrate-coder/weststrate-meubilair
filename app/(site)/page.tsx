import Link from "next/link";
import Image from "next/image";
import {
  getProjecten,
  getPosts,
  getCatalogusStats,
  getBrancheKaarten,
} from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";
import BrancheCard from "@/components/BrancheCard";
import StatsBand from "@/components/StatsBand";
import ShowroomShowcase from "@/components/ShowroomShowcase";
import KantoorScene from "@/components/KantoorScene";
import Reveal from "@/components/motion/Reveal";
import SpecialistCTA from "@/components/SpecialistCTA";

export const revalidate = 300; // ISR: elke 5 minuten verversen (CMS-wijzigingen snel live)

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
      "Onze monteurs plaatsen alles op locatie. Jij stapt een ruimte binnen die klaar is.",
  },
];

export default async function HomePage() {
  const [projecten, posts, stats, brancheKaarten] = await Promise.all([
    getProjecten(),
    getPosts(),
    getCatalogusStats(),
    getBrancheKaarten(),
  ]);
  const uitgelichteProjecten = projecten.slice(0, 3);
  // Echte opdrachtgevers uit de projecten, ontdubbeld en zonder onze eigen
  // showroom. Dit is concreet bewijs voor de pitch: serieuze namen.
  const opdrachtgevers = [...new Set(projecten.map((p) => p.klant))].filter(
    (k) => k && k !== "Weststrate"
  );
  const uitgelichtePosts = posts.slice(0, 3);
  // Eén kaart per groep-accent op de homepage: een doorsnede van branche, ruimte
  // en projecttype, met de hele set achter "Alle branches".
  const uitgelichteBranches = brancheKaarten.filter((k) =>
    ["kantoor", "zorg", "onderwijs", "horeca", "kantine", "vergaderruimte"].includes(
      k.slug
    )
  );

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
              <Reveal className="max-w-xl text-white" y={24}>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/80 md:text-xs">
                  Meubilair &amp; projectinrichting, onderdeel van Weststrate
                </p>
                <h1 className="mt-3 text-[1.9rem] leading-tight text-white md:mt-4 md:text-6xl md:leading-[1.05]">
                  Wij richten je ruimte in. Van kantoor tot zorg en horeca.
                </h1>
                {/* Op mobiel een kortere tekst, op desktop het volledige verhaal */}
                <p className="mt-4 max-w-lg text-base text-white/85 md:mt-6 md:text-lg">
                  <span className="md:hidden">
                    Van één stoel tot de complete inrichting. Advies, levering en
                    montage uit één hand.
                  </span>
                  <span className="hidden md:inline">
                    Van één ergonomische stoel tot de complete inrichting van een
                    pand. Als veelzijdige B2B-specialist regelt Weststrate alles
                    uit één hand: advies, levering en montage, met maatwerk
                    afgestemd op jouw wensen.
                  </span>
                </p>
                <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
                  <Link
                    href="/projecten"
                    className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
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
              </Reveal>
            </div>
          </div>
        </div>
        <div className="merkbalk" />
      </section>

      {/* ── Stats / vertrouwen (cijfers uit de catalogus) ── */}
      <StatsBand stats={stats} />

      {/* ── Showroom in Middelburg (selling point, hoog op de pagina) ── */}
      <ShowroomShowcase />

      {/* ── Wat Weststrate doet ────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-20">
        <Reveal className="max-w-2xl">
          <p className="kicker mb-3">De veelzijdige specialist</p>
          <h2 className="text-3xl md:text-4xl">
            Eén partner voor de hele inrichting.
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            Je hoeft niet te kiezen tussen losse leveranciers. Weststrate regelt
            het advies, de meubels en de montage, afgestemd op jouw mensen en
            jouw ruimte.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-3">
          {DISCIPLINES.map((d, i) => (
            <Reveal key={d.titel} delay={i * 0.08} className="bg-white p-8">
              <p className="font-mono text-sm text-brand">0{i + 1}</p>
              <h3 className="mt-3 text-xl">{d.titel}</h3>
              <p className="mt-2 text-sm text-ink-2">{d.tekst}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Voor welke ruimte richten we in? (branches) ── */}
      <section className="mx-auto max-w-content px-5 pb-4">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="kicker mb-3">Voor wie we werken</p>
            <h2 className="text-3xl md:text-4xl">
              Voor welke ruimte richten we in?
            </h2>
            <p className="mt-4 text-lg text-ink-2">
              Of het nu om losse meubels gaat of om een complete inrichting:
              kies je branche of het type ruimte en zie wat we voor jouw
              situatie doen.
            </p>
          </div>
          <Link
            href="/branches"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Alle branches →
          </Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {uitgelichteBranches.map((kaart, i) => (
            <Reveal key={kaart.slug} delay={i * 0.06}>
              <BrancheCard kaart={kaart} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Projecten (visueel bewijs) ─────────────────── */}
      <section className="bg-paper-2 py-20 mt-16">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
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
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {uitgelichteProjecten.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorieën visueel ────────────────────────── */}
      <section className="mx-auto max-w-content px-5 py-20">
        <Reveal className="mb-4 text-center">
          <p className="kicker mb-3">Het assortiment</p>
          <h2 className="text-3xl md:text-4xl">Waaruit je kiest</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            Klik op een meubelstuk om die categorie te bekijken.
          </p>
        </Reveal>
        <Reveal>
          {/* Witte kaart met rand zodat de scène niet los op de pagina zweeft */}
          <div className="overflow-hidden rounded-3xl border border-rule bg-white px-4 py-6 md:px-10 md:py-8">
            <KantoorScene />
          </div>
        </Reveal>
      </section>

      {/* ── Werkplek samenstellen (interactieve CTA) ───── */}
      <section className="mx-auto max-w-content px-5 pb-20">
        <Reveal>
          <div className="overflow-hidden rounded-2xl bg-brand px-6 py-12 text-white md:px-12 md:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                Stel het zelf samen
              </p>
              <h2 className="mt-3 text-3xl text-white md:text-4xl">
                Een complete werkplek in een paar klikken
              </h2>
              <p className="mt-4 text-lg text-white/85">
                Kies een bureau, een stoel en eventueel opbergruimte, stel het
                aantal werkplekken in en zie direct wat het kost. In één klik
                staat alles in je offerte.
              </p>
              <Link
                href="/werkplek"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-transform hover:scale-[1.03]"
              >
                Stel je werkplek samen
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Vertrouwd door (echte opdrachtgevers uit de projecten) ── */}
      <section className="mx-auto max-w-content px-5 pb-4">
        <Reveal className="rounded-3xl border border-rule bg-white px-8 py-12 md:px-16">
          <div className="merkbalk mx-auto mb-8 max-w-24 rounded-full" />
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-ink-2">
            Onder andere uitgevoerd voor
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
            {opdrachtgevers.map((naam) => (
              <li
                key={naam}
                className="font-display text-base font-extrabold text-ink/70 md:text-xl"
              >
                {naam}
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link
              href="/projecten"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Bekijk alle projecten →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Inspiratie / blog ──────────────────────────── */}
      <section className="bg-paper-2 py-20">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker mb-3">Inspiratie</p>
              <h2 className="text-3xl md:text-4xl">Kennis over inrichten</h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Alle artikelen →
            </Link>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {uitgelichtePosts.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.08} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Afsluitende CTA: persoonlijk, met John ─────── */}
      <SpecialistCTA />
    </div>
  );
}
