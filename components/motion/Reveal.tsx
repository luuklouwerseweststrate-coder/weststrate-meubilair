"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Dunne herbruikbare wrapper die zijn inhoud zacht in beeld laat komen zodra je
// er naartoe scrollt (opacity + lichte verschuiving omhoog). Eénmalig, dus geen
// flikkering bij terugscrollen.
//
// We respecteren prefers-reduced-motion: staat die aan, dan tonen we de inhoud
// meteen zonder animatie (toegankelijkheid + geen misselijkmakende beweging).

interface RevealProps {
  children: ReactNode;
  delay?: number; // seconden — handig voor staggered grids (i * 0.06)
  y?: number; // beginverschuiving in px
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
