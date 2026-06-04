import Image from "next/image";

// Contactblok voor John Provoost, accountmanager meubilair. Stuurt bezoekers
// gericht naar persoonlijk contact (bellen of mailen) i.p.v. een anoniem
// formulier. Herbruikbaar op de contactpagina, projectpagina's en in CTA's.
//
// Telefoon en foto komen van weststrate.nl. Het mailadres volgt het
// Weststrate-patroon voornaam.achternaam@weststrate.nl.

export const JOHN = {
  naam: "John Provoost",
  rol: "Accountmanager meubilair",
  telefoonWeergave: "06 53 83 47 52",
  telefoonLink: "+31653834752",
  email: "john.provoost@weststrate.nl",
  foto:
    "https://weststrate.nl/media/Specialisten%20paginas/Nieuwe%20uitsnedes%202024/John%20Provoost%20Weststrate.jpg",
};

export default function Accountmanager({
  className = "",
  titel = "Neem contact op met John Provoost,",
}: {
  className?: string;
  titel?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-rule bg-paper-2 p-6 text-center ${className}`}
    >
      <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-white ring-1 ring-rule">
        <Image
          src={JOHN.foto}
          alt={`${JOHN.naam} — ${JOHN.rol}`}
          width={112}
          height={112}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="mt-5 text-ink-2">
        {titel} <span className="font-semibold text-ink">{JOHN.rol.toLowerCase()}</span>.
      </p>

      <div className="mt-5 flex flex-col items-center gap-2">
        <a
          href={`tel:${JOHN.telefoonLink}`}
          className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
        >
          <span aria-hidden>📞</span>
          {JOHN.telefoonWeergave}
        </a>
        <a
          href={`mailto:${JOHN.email}?subject=${encodeURIComponent(
            "Vraag over meubilair"
          )}`}
          className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
        >
          <span aria-hidden>✉️</span>
          E-mail John
        </a>
      </div>
    </div>
  );
}
