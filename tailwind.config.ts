import type { Config } from "tailwindcss";

// Kleuren komen 1-op-1 uit het Weststrate Brandbook v1.0 (2026).
// Neutraal is de basis (~60%), magenta is de leidende merkkleur.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primaire kleuren — de vijf poten van de W
        magenta: "#A1367E",
        cyaan:   "#01B6E3",
        groen:   "#009D46",
        // Zachte pastelgroen — vaste achtergrond voor de specialist-CTA (John)
        "groen-zacht": "#D4EDDA",
        lime:    "#CCD50A",
        oranje:  "#F29828",
        // Secundair / overlap
        plum:    "#673981",
        olive:   "#C28D2D",
        // Neutraal — de basis
        paper:   "#FAFAF7",
        "paper-2": "#F0EFE9",
        rule:    "#E3E1D8",  // randen
        "ink-2": "#4A4A55",  // gedempte tekst
        ink:     "#14141A",  // hoofdtekst
        // Semantische alias: 'brand' = leidende kleur
        brand:   "#A1367E",
      },
      fontFamily: {
        // Nunito voor koppen (800/900), Inter voor body
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans:    ["var(--font-body)", "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        // Brandbook: koppen op -3% tracking
        tight: "-0.03em",
        label: "0.14em",
      },
      fontSize: {
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em" }],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
