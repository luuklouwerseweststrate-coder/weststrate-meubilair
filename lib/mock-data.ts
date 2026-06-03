import type { Product, SiteSettings } from "./types";

// Voorbeelddata zodat de site draait vóórdat Sanity gekoppeld is.
// Zodra Sanity gevuld is, neemt die het over (zie lib/data.ts).

export const MOCK_SETTINGS: SiteSettings = {
  bedrijfsnaam: "Weststrate Meubilair",
  payoff: "De veelzijdige specialist",
  overOns:
    "Weststrate levert kantoormeubilair voor dealers. Bureaustoelen, bureaus en vergadertafels — met maatwerk dat aansluit op jouw wensen. Je stelt zelf je offerte samen met de opties die je nodig hebt, en wij regelen de rest.",
  email: "verkoop@weststrate.nl",
  telefoon: "0118 - 000 000",
  adres: "Weststrate B.V., Zeeland",
  footerTekst:
    "Prijzen zijn indicatief en exclusief btw. Aan de samengestelde offerte kunnen geen rechten worden ontleend.",
};

export const MOCK_PRODUCTS: Product[] = [
  // ── Bureaustoelen ──────────────────────────────────────────
  {
    _id: "mock-stoel-1",
    name: "Bureaustoel Ergo Pro",
    slug: "bureaustoel-ergo-pro",
    articleNumber: "WM-ST-1001",
    category: "bureaustoelen",
    shortDescription:
      "Ergonomische bureaustoel met synchroonmechanisme en instelbare lendensteun.",
    description:
      "De Ergo Pro is geschikt voor dagelijks intensief gebruik op kantoor. Het synchroonmechanisme beweegt mee met je rug en de zitdiepte stel je traploos in. De stoel voldoet aan de NEN-EN 1335 norm voor kantoorstoelen.",
    basePrice: 289,
    images: [],
    specs: [
      { label: "Mechanisme", value: "Synchroon, traploos instelbaar" },
      { label: "Maximale belasting", value: "120 kg" },
      { label: "Norm", value: "NEN-EN 1335" },
      { label: "Garantie", value: "5 jaar" },
    ],
    optionGroups: [
      {
        label: "Stofkleur",
        required: true,
        choices: [
          { label: "Antraciet", priceDelta: 0 },
          { label: "Blauw", priceDelta: 0 },
          { label: "Bordeaux", priceDelta: 15 },
        ],
      },
      {
        label: "Armleggers",
        required: true,
        choices: [
          { label: "Vaste armleggers", priceDelta: 0 },
          { label: "2D verstelbaar", priceDelta: 35 },
          { label: "4D verstelbaar", priceDelta: 65 },
        ],
      },
      {
        label: "Lendensteun",
        required: false,
        choices: [
          { label: "Standaard", priceDelta: 0 },
          { label: "In hoogte verstelbaar", priceDelta: 25 },
        ],
      },
    ],
  },
  {
    _id: "mock-stoel-2",
    name: "Bureaustoel Basic Task",
    slug: "bureaustoel-basic-task",
    articleNumber: "WM-ST-1002",
    category: "bureaustoelen",
    shortDescription:
      "Compacte taakstoel voor flexplekken en thuiswerkplekken.",
    description:
      "Een betaalbare taakstoel voor flexplekken, vergaderruimtes en thuiswerkplekken. Eenvoudig in hoogte verstelbaar en voorzien van een ademende rugleuning.",
    basePrice: 149,
    images: [],
    specs: [
      { label: "Rugleuning", value: "Ademend mesh" },
      { label: "Maximale belasting", value: "110 kg" },
      { label: "Garantie", value: "3 jaar" },
    ],
    optionGroups: [
      {
        label: "Stofkleur",
        required: true,
        choices: [
          { label: "Zwart", priceDelta: 0 },
          { label: "Grijs", priceDelta: 0 },
        ],
      },
      {
        label: "Wielen",
        required: true,
        choices: [
          { label: "Voor tapijt", priceDelta: 0 },
          { label: "Voor harde vloer", priceDelta: 12 },
        ],
      },
    ],
  },
  // ── Bureaus ────────────────────────────────────────────────
  {
    _id: "mock-bureau-1",
    name: "Zit-sta bureau Flex 160",
    slug: "zit-sta-bureau-flex-160",
    articleNumber: "WM-BU-2001",
    category: "bureaus",
    shortDescription:
      "Elektrisch verstelbaar zit-sta bureau, 160 x 80 cm, met geheugenbediening.",
    description:
      "Het Flex 160 is een elektrisch verstelbaar zit-sta bureau van 160 bij 80 cm. Met de geheugenbediening wissel je met één knop tussen je zit- en stahoogte. Het frame draagt tot 100 kg en beweegt soepel en stil.",
    basePrice: 549,
    images: [],
    specs: [
      { label: "Afmeting blad", value: "160 x 80 cm" },
      { label: "Hoogtebereik", value: "65 - 125 cm" },
      { label: "Draagvermogen", value: "100 kg" },
      { label: "Bediening", value: "Geheugen, 4 standen" },
    ],
    optionGroups: [
      {
        label: "Bladkleur",
        required: true,
        choices: [
          { label: "Eiken", priceDelta: 0 },
          { label: "Wit", priceDelta: 25 },
          { label: "Antraciet", priceDelta: 25 },
          { label: "Notenhout", priceDelta: 45 },
        ],
      },
      {
        label: "Framekleur",
        required: true,
        choices: [
          { label: "Wit", priceDelta: 0 },
          { label: "Zwart", priceDelta: 0 },
          { label: "Aluminium", priceDelta: 20 },
        ],
      },
      {
        label: "Kabelgoot",
        required: false,
        choices: [
          { label: "Geen", priceDelta: 0 },
          { label: "Kabelgoot onder blad", priceDelta: 39 },
        ],
      },
    ],
  },
  {
    _id: "mock-bureau-2",
    name: "Vast bureau Solid 140",
    slug: "vast-bureau-solid-140",
    articleNumber: "WM-BU-2002",
    category: "bureaus",
    shortDescription:
      "Stevig vast bureau van 140 x 80 cm met stabiel pootframe.",
    description:
      "Een eenvoudig en stevig vast bureau van 140 bij 80 cm. Het stalen pootframe staat stabiel en het blad is krasvast afgewerkt. Geschikt voor zowel kantoor als thuiswerkplek.",
    basePrice: 219,
    images: [],
    specs: [
      { label: "Afmeting blad", value: "140 x 80 cm" },
      { label: "Werkbladhoogte", value: "74 cm" },
      { label: "Frame", value: "Staal, gepoedercoat" },
    ],
    optionGroups: [
      {
        label: "Bladkleur",
        required: true,
        choices: [
          { label: "Eiken", priceDelta: 0 },
          { label: "Wit", priceDelta: 20 },
          { label: "Antraciet", priceDelta: 20 },
        ],
      },
      {
        label: "Framekleur",
        required: true,
        choices: [
          { label: "Wit", priceDelta: 0 },
          { label: "Zwart", priceDelta: 0 },
        ],
      },
    ],
  },
  // ── Vergadertafels ─────────────────────────────────────────
  {
    _id: "mock-tafel-1",
    name: "Vergadertafel Confer 240",
    slug: "vergadertafel-confer-240",
    articleNumber: "WM-VT-3001",
    category: "vergadertafels",
    shortDescription:
      "Vergadertafel voor 8 personen, 240 x 120 cm, met optionele kabeldoorvoer.",
    description:
      "De Confer 240 biedt plek aan acht personen rond een blad van 240 bij 120 cm. Kies optioneel een kabeldoorvoer met inbouwpunt voor stroom en data, zodat de tafel klaar is voor presentaties en videobellen.",
    basePrice: 749,
    images: [],
    specs: [
      { label: "Afmeting blad", value: "240 x 120 cm" },
      { label: "Zitplaatsen", value: "8 personen" },
      { label: "Bladdikte", value: "25 mm" },
    ],
    optionGroups: [
      {
        label: "Bladkleur",
        required: true,
        choices: [
          { label: "Eiken", priceDelta: 0 },
          { label: "Wit", priceDelta: 35 },
          { label: "Antraciet", priceDelta: 35 },
          { label: "Notenhout", priceDelta: 60 },
        ],
      },
      {
        label: "Onderstel",
        required: true,
        choices: [
          { label: "Vier poten", priceDelta: 0 },
          { label: "Schaaronderstel", priceDelta: 120 },
        ],
      },
      {
        label: "Kabeldoorvoer",
        required: false,
        choices: [
          { label: "Geen", priceDelta: 0 },
          { label: "Inbouwpunt stroom + data", priceDelta: 145 },
        ],
      },
    ],
  },
  {
    _id: "mock-tafel-2",
    name: "Statafel Meet & Stand 180",
    slug: "statafel-meet-stand-180",
    articleNumber: "WM-VT-3002",
    category: "vergadertafels",
    shortDescription:
      "Hoge overlegtafel voor sta-overleg, 180 x 90 cm.",
    description:
      "Een hoge overlegtafel voor kort sta-overleg en stand-up meetings. Het blad van 180 bij 90 cm biedt ruimte aan zes personen. Combineer met hoge krukken voor een complete overlegplek.",
    basePrice: 459,
    images: [],
    specs: [
      { label: "Afmeting blad", value: "180 x 90 cm" },
      { label: "Hoogte", value: "110 cm" },
      { label: "Zitplaatsen", value: "6 personen (staand)" },
    ],
    optionGroups: [
      {
        label: "Bladkleur",
        required: true,
        choices: [
          { label: "Eiken", priceDelta: 0 },
          { label: "Wit", priceDelta: 30 },
          { label: "Antraciet", priceDelta: 30 },
        ],
      },
    ],
  },
];
