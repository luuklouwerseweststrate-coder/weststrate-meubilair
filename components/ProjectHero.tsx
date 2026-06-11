"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

// Cinematische projecthero met parallax: het beeld beweegt langzamer dan de
// pagina terwijl je scrollt, waardoor diepte ontstaat (de inrichting "leeft").
// De titel komt zacht in beeld. We respecteren prefers-reduced-motion: dan
// staat het beeld stil.
//
// Bewust een client-component los van de (server) projectpagina, zodat alleen
// dit blok de scroll-hooks van framer-motion meeneemt.

interface ProjectHeroProps {
  image: string;
  title: string;
  klant?: string;
  meta: string[];
}

export default function ProjectHero({
  image,
  title,
  klant,
  meta,
}: ProjectHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Volg de scrollpositie van de hero: 0 = hero net in beeld, 1 = net eruit.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Het beeld schuift 18% omhoog over de hele scroll en zoomt licht uit; de
  // tekst vervaagt en zakt iets weg. Bij reduced-motion blijft alles staan.
  const beeldY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const beeldScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const tekstY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const tekstOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative h-[88vh] min-h-[520px] w-full overflow-hidden bg-ink"
    >
      {image && (
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { y: beeldY, scale: beeldScale }}
        >
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      )}

      {/* Donkere verloop-laag zodat de witte tekst altijd leesbaar is */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/15" />

      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={reduce ? undefined : { y: tekstY, opacity: tekstOpacity }}
      >
        <div className="mx-auto max-w-content px-5 pb-16 md:pb-20">
          <Reveal className="text-white" y={28}>
            {meta.length > 0 && (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                {meta.join("  ·  ")}
              </p>
            )}
            <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] text-white md:text-6xl">
              {title}
            </h1>
            {klant && (
              <p className="mt-5 text-lg text-white/85 md:text-xl">{klant}</p>
            )}
          </Reveal>
        </div>
      </motion.div>

      {/* Merkbalk als afsluiting onderaan de hero */}
      <div className="merkbalk absolute bottom-0 left-0 z-10" />

      {/* Subtiele scroll-hint */}
      {!reduce && (
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 0, 8, 8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="block h-10 w-6 rounded-full border border-white/50">
            <span className="mx-auto mt-2 block h-2 w-1 rounded-full bg-white/70" />
          </span>
        </motion.div>
      )}
    </div>
  );
}
