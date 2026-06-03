// Tekstlogo als placeholder tot de officiële W-mark SVG geleverd is.
// Brandbook: wordmark "weststrate" in Nunito + pay-off in klein kapitaal.
export default function Logo({ payoff = true }: { payoff?: boolean }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">
        weststrate
      </span>
      {payoff && (
        <span className="text-[0.55rem] uppercase tracking-[0.18em] text-ink-2">
          de veelzijdige specialist
        </span>
      )}
    </span>
  );
}
