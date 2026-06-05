// Vertaalt de kleurnamen uit het Swan-snelleverprogramma naar een hex, zodat de
// configurator echte kleurstalen kan tonen i.p.v. tekstknopjes.
//
// De data bevat vrije tekst met RAL-codes en varianten (bv. "Mat Zwart 120",
// "Shadow Grey 7022", "Oak light"). We matchen daarom op trefwoorden in een
// vaste volgorde: specifieker eerst (lichtblauw vóór blauw, antraciet vóór grijs).
// Onbekende waarden geven null terug → de configurator valt terug op een chip.

interface KleurRegel {
  trefwoorden: string[];
  hex: string;
}

// Volgorde is belangrijk: het eerste trefwoord dat voorkomt, wint.
const KLEUR_REGELS: KleurRegel[] = [
  // Houtkleuren
  { trefwoorden: ["oak dark", "donker eiken"], hex: "#6B4A2B" },
  { trefwoorden: ["oak light", "naturel", "halifax", "light"], hex: "#CBA978" },
  {
    trefwoorden: ["oak", "eiken", "akazia", "lindberg", "akacia"],
    hex: "#A9763F",
  },
  // Specifieke kleuren vóór de algemene
  { trefwoorden: ["lichtblauw"], hex: "#8FB8D8" },
  { trefwoorden: ["blauw", "blue"], hex: "#2E5E8C" },
  { trefwoorden: ["lichtgroen"], hex: "#8FBF6A" },
  { trefwoorden: ["olijfgroen", "olijf", "olive"], hex: "#6B7A2E" },
  { trefwoorden: ["tropisch groen"], hex: "#1F6E5A" },
  { trefwoorden: ["groen", "green"], hex: "#3B7A3B" },
  { trefwoorden: ["rood", "red"], hex: "#B23A3A" },
  { trefwoorden: ["oranje", "orange"], hex: "#E07A2E" },
  { trefwoorden: ["taupe"], hex: "#8B7E6A" },
  { trefwoorden: ["beige"], hex: "#D8C9A8" },
  // Neutralen
  { trefwoorden: ["grafiet", "graphite"], hex: "#43474B" },
  { trefwoorden: ["antraciet", "anthracite"], hex: "#36393B" },
  { trefwoorden: ["schaduw zwart", "shadow grey", "shadow grijs"], hex: "#3A3D3F" },
  { trefwoorden: ["zwart", "black"], hex: "#1A1A1A" },
  {
    trefwoorden: ["zilvergrijs", "grijs", "grey", "gray", "zilver", "silver"],
    hex: "#8A8D8F",
  },
  {
    trefwoorden: ["aluminium", "alu", "chroom", "chrome", "rvs", "staal"],
    hex: "#BFC1C2",
  },
  { trefwoorden: ["wit", "white"], hex: "#F2F2EE" },
];

// Geeft de hex voor een kleurnaam, of null als we hem niet herkennen.
export function kleurVoor(waarde: string): string | null {
  const v = waarde.toLowerCase();
  for (const regel of KLEUR_REGELS) {
    if (regel.trefwoorden.some((t) => v.includes(t))) return regel.hex;
  }
  return null;
}

// Bepaalt of een optiegroep als kleurstalen getoond moet worden: ofwel het label
// duidt op kleur/stoffering, ofwel de meeste waarden zijn herkenbare kleuren.
export function isKleurGroep(label: string, waarden: string[]): boolean {
  if (/kleur|stoffering|frame|blad/i.test(label)) return true;
  const herkend = waarden.filter((w) => kleurVoor(w) !== null).length;
  return waarden.length > 0 && herkend / waarden.length >= 0.6;
}

// Lichte hex? Dan hebben we een rand nodig zodat 'wit' zichtbaar blijft op wit.
export function isLicht(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Relatieve luminantie (vereenvoudigd)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.8;
}
