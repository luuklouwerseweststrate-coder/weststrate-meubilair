import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { JOHN } from "@/components/Accountmanager";

// Vaste afsluitende CTA met de specialist (John Provoost) in beeld.
// HUISSTIJL: gebruik voor deze specialist-CTA ALTIJD de zachte pastelgroen
// (token `groen-zacht` = #D4EDDA) als achtergrond met donkere tekst en de
// volle Weststrate-groene knop. Hergebruik deze component overal waar we het
// gesprek met een specialist willen aanbieden, zodat het consistent blijft.

export default function SpecialistCTA({
  titel = "Benieuwd wat we voor jouw werkplek kunnen betekenen?",
  tekst = "Leg je vraag voor aan John Provoost, onze accountmanager meubilair. Hij denkt graag met je mee, van één werkplek tot een compleet pand.",
  className = "",
}: {
  titel?: string;
  tekst?: string;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-content px-5 py-24 ${className}`}>
      <Reveal className="overflow-hidden rounded-3xl bg-groen-zacht text-ink">
        <div className="grid items-center gap-8 p-8 text-center md:grid-cols-[auto_1fr] md:gap-12 md:p-14 md:text-left">
          {/* De specialist in beeld */}
          <div className="shrink-0">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full bg-white shadow-sm ring-4 ring-white md:h-48 md:w-48">
              <Image
                src={JOHN.foto}
                alt={`${JOHN.naam}, ${JOHN.rol}`}
                width={192}
                height={192}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 font-display text-lg text-ink">{JOHN.naam}</p>
            <p className="text-sm text-ink-2">{JOHN.rol}</p>
          </div>

          {/* Tekst + acties */}
          <div>
            <h2 className="text-3xl text-ink md:text-4xl">{titel}</h2>
            <p className="mt-4 max-w-xl text-ink-2">{tekst}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href={`tel:${JOHN.telefoonLink}`}
                className="rounded-full bg-groen px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                Bel John: {JOHN.telefoonWeergave}
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
              >
                Neem contact op
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
