"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { OfferteRegel } from "./types";
import { regelTotaal } from "./types";

// Re-export zodat client-componenten euro vanuit één plek kunnen halen.
export { euro } from "./types";

// Het offertemandje leeft client-side in React Context en bewaart
// zichzelf in localStorage. Zo is er geen database nodig voor de pilot.

const OPSLAG_SLEUTEL = "weststrate-offerte-v1";

interface OfferteContextType {
  regels: OfferteRegel[];
  voegToe: (regel: OfferteRegel) => void;
  verwijder: (id: string) => void;
  wijzigAantal: (id: string, aantal: number) => void;
  leegmaken: () => void;
  totaal: number;
  aantalItems: number;
}

const OfferteContext = createContext<OfferteContextType | null>(null);

export function OfferteProvider({ children }: { children: ReactNode }) {
  const [regels, setRegels] = useState<OfferteRegel[]>([]);
  const [geladen, setGeladen] = useState(false);

  // Inladen uit localStorage bij eerste render
  useEffect(() => {
    try {
      const opgeslagen = localStorage.getItem(OPSLAG_SLEUTEL);
      if (opgeslagen) setRegels(JSON.parse(opgeslagen));
    } catch {
      // negeer corrupte opslag
    }
    setGeladen(true);
  }, []);

  // Opslaan bij elke wijziging (pas nadat we geladen hebben)
  useEffect(() => {
    if (!geladen) return;
    try {
      localStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(regels));
    } catch {
      // opslag vol of geblokkeerd — negeer
    }
  }, [regels, geladen]);

  const voegToe = (regel: OfferteRegel) =>
    setRegels((vorige) => [...vorige, regel]);

  const verwijder = (id: string) =>
    setRegels((vorige) => vorige.filter((r) => r.id !== id));

  const wijzigAantal = (id: string, aantal: number) =>
    setRegels((vorige) =>
      vorige.map((r) =>
        r.id === id ? { ...r, aantal: Math.max(1, aantal) } : r
      )
    );

  const leegmaken = () => setRegels([]);

  const totaal = regels.reduce((s, r) => s + regelTotaal(r), 0);
  const aantalItems = regels.reduce((s, r) => s + r.aantal, 0);

  return (
    <OfferteContext.Provider
      value={{
        regels,
        voegToe,
        verwijder,
        wijzigAantal,
        leegmaken,
        totaal,
        aantalItems,
      }}
    >
      {children}
    </OfferteContext.Provider>
  );
}

export function useOfferte() {
  const ctx = useContext(OfferteContext);
  if (!ctx) {
    throw new Error("useOfferte moet binnen <OfferteProvider> gebruikt worden");
  }
  return ctx;
}
