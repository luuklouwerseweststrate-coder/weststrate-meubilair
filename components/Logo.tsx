// Weststrate-logo: de W-mark (vijf merkkleuren) + wordmark + pay-off.
// De W is opgebouwd als zigzag-streek met een verloop door de vijf
// primaire kleuren (magenta → cyaan → groen → lime → oranje), conform
// het brandbook ("één kleur per poot van de W").
//
// Dit is een nette interpretatie in code. Levert Luuk het officiële
// SVG aan, dan vervangen we alleen de <WMark> hieronder.

export function WMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 44"
      className={className}
      role="img"
      aria-label="Weststrate"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wmark" x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A1367E" />
          <stop offset="27%" stopColor="#01B6E3" />
          <stop offset="52%" stopColor="#009D46" />
          <stop offset="76%" stopColor="#CCD50A" />
          <stop offset="100%" stopColor="#F29828" />
        </linearGradient>
      </defs>
      <polyline
        points="5,5 17,39 32,17 47,39 59,5"
        stroke="url(#wmark)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
      <WMark className="h-9 w-9 shrink-0" />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`font-display text-xl font-extrabold lowercase tracking-tight ${tekstKleur}`}
        >
          weststrate
        </span>
        {payoff && (
          <span
            className={`mt-0.5 text-[0.55rem] uppercase tracking-[0.18em] ${payoffKleur}`}
          >
            de veelzijdige specialist
          </span>
        )}
      </span>
    </span>
  );
}
