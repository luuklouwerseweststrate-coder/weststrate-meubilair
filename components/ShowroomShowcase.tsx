import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import VideoEmbed from "@/components/VideoEmbed";

// Prominente showroom-sectie hoog op de homepage. De foto's komen rechtstreeks
// van de live site (media/Nieuws/showroom, let op de tikfout "Westrate" in de
// bestandsnaam). De Weststrate-bedrijfsfilm staat eronder als lichte embed.
const SHOW =
  "https://weststrate.nl/media/Nieuws/showroom/Westrate%20showroom%205%20dec-";

const COLLAGE = [
  { src: `${SHOW}103.jpg`, alt: "Overzicht van de meubilairshowroom met soft seating" },
  { src: `${SHOW}247.jpg`, alt: "Stoelenwand in de showroom" },
  { src: `${SHOW}392.jpg`, alt: "Akoestische vergaderunit in de showroom" },
];

// Adres voor de routekoppeling naar Google Maps.
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Herculesweg+37+Middelburg";

export default function ShowroomShowcase() {
  return (
    <section className="mx-auto max-w-content px-5 py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        {/* ── Tekst + adres ───────────────────────────── */}
        <Reveal>
          <p className="kicker mb-3">Onze showroom in Middelburg</p>
          <h2 className="text-3xl md:text-4xl">
            Kom langs, ga zitten en probeer alles uit
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            In onze showroom aan de Herculesweg ervaar je in het echt wat we
            voor je ruimte kunnen betekenen. Van soft seating, akoestiek en
            ergonomie tot maatwerk banken en zelfs een eigen bioscoop. En alles
            wat je ziet is te koop, tot de stoelen van de directie aan toe.
          </p>

          {/* Adreskaart met route en link naar de detailpagina */}
          <div className="mt-8 rounded-2xl border border-rule bg-paper-2 p-6">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                {/* Locatie-pin */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-ink">
                  Weststrate meubilairshowroom
                </p>
                <p className="text-ink-2">Herculesweg 37, Middelburg</p>
                <p className="mt-2 text-sm text-ink-2">
                  Loop gerust binnen of plan een afspraak. We laten je graag
                  rondkijken, vrijblijvend en met een kop koffie.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/projecten/weststrate-showroom"
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                Bekijk de showroom
              </Link>
              <a
                href={MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
              >
                Route plannen
              </a>
            </div>
          </div>
        </Reveal>

        {/* ── Fotocollage ─────────────────────────────── */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl bg-paper-2">
              <Image
                src={COLLAGE[0].src}
                alt={COLLAGE[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {COLLAGE.slice(1).map((beeld) => (
              <div
                key={beeld.src}
                className="relative aspect-square overflow-hidden rounded-2xl bg-paper-2"
              >
                <Image
                  src={beeld.src}
                  alt={beeld.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── Bedrijfsfilm (lichte YouTube-embed) ───────── */}
      <Reveal delay={0.1} className="mt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-3">Maak kennis met Weststrate</p>
          <h3 className="text-2xl md:text-3xl">
            In onze showroom draait de bedrijfsfilm
          </h3>
          <p className="mt-3 text-ink-2">
            Geen tijd om langs te komen? Bekijk in een paar minuten wie we zijn
            en hoe we werken.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <VideoEmbed id="GwKBqx_iqGE" title="Weststrate bedrijfsfilm" />
        </div>
      </Reveal>
    </section>
  );
}
