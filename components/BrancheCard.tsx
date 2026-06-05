import Link from "next/link";
import Image from "next/image";
import type { BrancheKaart } from "@/lib/data";

// Branchekaart: een groot sfeerbeeld dat de kaart vult met de naam en pitch
// eroverheen, plus een accentstreep in de branchekleur. Bij hover zoomt het
// beeld zacht in. Gebruikt op de homepage, de branche-hub en als cross-link.

export default function BrancheCard({
  kaart,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  kaart: BrancheKaart;
  sizes?: string;
}) {
  return (
    <Link
      href={`/branches/${kaart.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink"
    >
      {kaart.beeld ? (
        <Image
          src={kaart.beeld}
          alt={kaart.naam}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="h-full w-full bg-paper-2" />
      )}

      {/* Verloop voor leesbaarheid van de tekst onderaan */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span
          className="block h-1 w-10 rounded-full"
          style={{ background: kaart.accent }}
        />
        <h3 className="mt-3 text-2xl font-extrabold leading-snug text-white">
          {kaart.menukort}
        </h3>
        <p className="mt-1 text-sm text-white/85">{kaart.pitch}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white/0 transition-all duration-300 group-hover:text-white">
          Bekijk de inrichting
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
