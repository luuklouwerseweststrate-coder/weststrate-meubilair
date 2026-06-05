// Weststrate-logo: de officiële W-mark (public/beelden/logo.png, transparante
// achtergrond) + het woordmerk als tekst + pay-off. Het woordmerk zetten we in
// de merkfont zodat we de donker/licht-variant (header op wit, footer op
// donker) zelf kunnen sturen.

import Image from "next/image";

export function WMark({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/beelden/logo.png"
      alt="Weststrate"
      width={447}
      height={343}
      priority
      // h-… stuurt de hoogte, w-auto bewaart de juiste 447×343-verhouding
      // (anders perst een vaste breedte het logo samen → "ingezoomd").
      className={className}
    />
  );
}

export default function Logo({
  payoff = true,
  variant = "dark",
}: {
  payoff?: boolean;
  variant?: "dark" | "light";
}) {
  const tekstKleur = variant === "light" ? "text-white" : "text-ink";
  const payoffKleur = variant === "light" ? "text-white/70" : "text-ink-2";

  return (
    <span className="inline-flex items-center gap-2.5">
      <WMark className="h-9 w-auto shrink-0" />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`font-display text-xl font-extrabold lowercase tracking-tight ${tekstKleur}`}
        >
          weststrate
        </span>
        {payoff && (
          <span
            className={`mt-0.5 hidden text-[0.55rem] uppercase tracking-[0.18em] sm:block ${payoffKleur}`}
          >
            de veelzijdige specialist
          </span>
        )}
      </span>
    </span>
  );
}
