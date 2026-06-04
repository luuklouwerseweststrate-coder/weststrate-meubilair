"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Next.js rendert een `template` opnieuw bij elke navigatie (anders dan `layout`,
// dat blijft staan). Daardoor krijgt elke paginawissel een zachte fade-in — de
// site voelt daardoor vloeiend i.p.v. hard omspringend.

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
