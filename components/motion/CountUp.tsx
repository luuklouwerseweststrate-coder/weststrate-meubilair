"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

// Telt een getal op van 0 naar `eind` zodra het in beeld komt. Voor de stats-
// band op de homepage (aantal series, uitvoeringen, categorieën).
//
// Getallen worden met een punt als duizendscheiding getoond (nl-NL). Bij
// prefers-reduced-motion tonen we direct het eindgetal zonder te tellen.

interface CountUpProps {
  eind: number;
  duur?: number; // seconden
  suffix?: string; // bv. "+"
}

export default function CountUp({ eind, duur = 1.4, suffix = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [waarde, setWaarde] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setWaarde(eind);
      return;
    }
    const controls = animate(0, eind, {
      duration: duur,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setWaarde(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, eind, duur, reduce]);

  return (
    <span ref={ref}>
      {waarde.toLocaleString("nl-NL")}
      {suffix}
    </span>
  );
}
