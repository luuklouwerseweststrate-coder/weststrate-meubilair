import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Weststrate richt werkplekken in: advies, levering en montage uit één hand.",
};

const WAARDEN = [
  {
    titel: "Vakkundig",
    tekst: "We kennen het meubilair en de normen, en kiezen wat past.",
  },
  {
    titel: "Toegankelijk",
    tekst: "Korte lijnen. Je hebt één aanspreekpunt van advies tot oplevering.",
  },
  {
    titel: "Breed",
    tekst: "Van losse stoel tot complete inrichting — alles uit één hand.",
  },
  {
    titel: "Betrouwbaar",
    tekst: "Afspraken over levering en montage komen we na.",
  },
];

export default async function OverPage() {
  const s = await getSettings();

  return (
    <div>
      {/* Beeld-header */}
      <div className="relative h-[48vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src="/beelden/sfeer-detail.png"
          alt="Detail van een bureau met eiken blad en gepoedercoat frame"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-content px-5 pb-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Over ons
            </p>
            <h1 className="mt-3 text-4xl text-white md:text-5xl">
              {s.bedrijfsnaam}
            </h1>
            <p className="mt-2 text-lg text-white/85">{s.payoff}.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl">
            <p className="whitespace-pre-line text-lg leading-relaxed text-ink-2">
              {s.overOns}
            </p>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2">
              {WAARDEN.map((w) => (
                <div key={w.titel} className="bg-white p-6">
                  <h3 className="text-lg">{w.titel}</h3>
                  <p className="mt-1 text-sm text-ink-2">{w.tekst}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/projecten"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Bekijk onze projecten
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-rule px-6 py-3 text-sm font-semibold text-ink hover:border-ink"
              >
                Contact
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-rule bg-paper-2 p-6">
            <p className="kicker mb-3">Direct contact</p>
            <ul className="space-y-2 text-sm text-ink-2">
              <li>{s.adres}</li>
              <li>
                <a href={`mailto:${s.email}`} className="hover:text-brand">
                  {s.email}
                </a>
              </li>
              <li>{s.telefoon}</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
