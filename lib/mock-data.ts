import type { Product, SiteSettings, Project, BlogPost } from "./types";

// Voorbeelddata zodat de site draait vóórdat Sanity gekoppeld is.
// Zodra Sanity gevuld is, neemt die het over (zie lib/data.ts).

export const MOCK_SETTINGS: SiteSettings = {
  bedrijfsnaam: "Weststrate Meubilair",
  payoff: "De veelzijdige specialist",
  overOns:
    "Weststrate richt werkplekken in. Van één ergonomische stoel tot een compleet kantoor: wij denken mee over de ruimte, leveren het meubilair en regelen de montage. Met eigen specialisten en een breed assortiment kiezen we wat past bij jouw mensen en jouw pand — niet andersom.",
  email: "verkoop@weststrate.nl",
  telefoon: "0118 - 000 000",
  adres: "Weststrate B.V., Zeeland",
  footerTekst:
    "Prijzen zijn indicatief en exclusief btw. Aan een samengestelde offerte kunnen geen rechten worden ontleend.",
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

// ── Referentieprojecten ──────────────────────────────────────
// Voorbeeldcases die laten zien wat Weststrate inricht. Fictief,
// maar realistisch — vervang door echte projecten in Sanity.
export const MOCK_PROJECTS: Project[] = [
  {
    _id: "mock-project-1",
    title: "Nieuw stadskantoor, één heldere werkplek",
    slug: "stadskantoor-middelburg",
    klant: "Gemeente Middelburg",
    sector: "Overheid",
    jaar: "2025",
    locatie: "Middelburg",
    intro:
      "Honderdtwintig flexwerkplekken voor een gemeente die overstapte op hybride werken.",
    uitdaging:
      "De gemeente verhuisde naar een nieuw pand en wilde af van vaste werkplekken. Medewerkers werken deels thuis, deels op kantoor. Elke plek moest voor iedereen kloppen — ongeacht lengte of werkhouding.",
    aanpak:
      "We kozen voor zit-sta bureaus met geheugenbediening en ergonomische stoelen die op elke plek hetzelfde instellen. De afdelingen kregen een eigen kleuraccent voor herkenning. Levering en montage planden we in drie weekenden, zodat de dienstverlening doorliep.",
    resultaat:
      "Honderdtwintig identieke, volledig instelbare werkplekken. Medewerkers vinden op elke verdieping dezelfde bediening terug.",
    cijfers: [
      { waarde: "120", label: "werkplekken" },
      { waarde: "3 wk", label: "doorlooptijd montage" },
      { waarde: "100%", label: "zit-sta verstelbaar" },
    ],
    image: "/beelden/project-kantoortuin.png",
    categorieen: ["Bureaus", "Bureaustoelen"],
  },
  {
    _id: "mock-project-2",
    title: "Bestuurskamer en overlegplekken voor een zorggroep",
    slug: "zorggroep-bestuurskamer",
    klant: "Zorggroep De Bevelanden",
    sector: "Zorg",
    jaar: "2025",
    locatie: "Goes",
    intro:
      "Een representatieve bestuurskamer plus acht overlegplekken in de polikliniek.",
    uitdaging:
      "De zorggroep wilde een bestuurskamer die er verzorgd uitziet bij overleg met partners, en daarnaast praktische overlegplekken die tegen intensief gebruik kunnen.",
    aanpak:
      "Voor de bestuurskamer leverden we een vergadertafel in notenhout met ingebouwde stroom- en datapunten. De overlegplekken kregen robuuste tafels met schoonmaakvriendelijke bladen, passend bij de hygiëne-eisen in de zorg.",
    resultaat:
      "Eén kamer voor representatief overleg en acht werkbare overlegplekken die dagelijks meedraaien.",
    cijfers: [
      { waarde: "9", label: "overlegruimtes" },
      { waarde: "8 pers.", label: "bestuurstafel" },
      { waarde: "1 dag", label: "montage op locatie" },
    ],
    image: "/beelden/project-vergaderruimte.png",
    categorieen: ["Vergadertafels", "Bureaustoelen"],
  },
  {
    _id: "mock-project-3",
    title: "Directiekantoor met uitstraling",
    slug: "directiekantoor-advocatenkantoor",
    klant: "Advocatenkantoor Schelde & Partners",
    sector: "Zakelijke dienstverlening",
    jaar: "2024",
    locatie: "Vlissingen",
    intro:
      "Vier directiekamers ingericht met oog op rust, concentratie en uitstraling naar cliënten.",
    uitdaging:
      "Het kantoor ontvangt cliënten in de werkruimtes zelf. De inrichting moest professioneel ogen, maar vooral comfortabel zijn tijdens lange werkdagen.",
    aanpak:
      "We combineerden ergonomische stoelen voor de hele dag met strakke vaste bureaus. Per kamer één rustig kleuraccent uit de huisstijl van het kantoor, zodat het geheel samenhangt zonder eentonig te worden.",
    resultaat:
      "Vier werkkamers die er bij een cliëntgesprek verzorgd uitzien en waar de advocaten een volledige werkdag prettig zitten.",
    cijfers: [
      { waarde: "4", label: "directiekamers" },
      { waarde: "5 jaar", label: "garantie meubilair" },
      { waarde: "2 wk", label: "van offerte tot oplevering" },
    ],
    image: "/beelden/project-directiekamer.png",
    categorieen: ["Bureaustoelen", "Bureaus"],
  },
];

// ── Blog / inspiratie ────────────────────────────────────────
export const MOCK_POSTS: BlogPost[] = [
  {
    _id: "mock-post-1",
    title: "Zit-sta werken: wat levert het echt op?",
    slug: "zit-sta-werken-wat-levert-het-op",
    datum: "2026-05-12",
    thema: "Ergonomie",
    leestijd: 4,
    samenvatting:
      "Een zit-sta bureau is meer dan een trend. We zetten de feiten op een rij en geven je houvast bij de keuze.",
    body: "Wie de hele dag zit, voelt dat aan het eind van de dag. Een zit-sta bureau laat je wisselen tussen zitten en staan, zodat je houding niet de hele dag hetzelfde blijft. Dat klinkt simpel, en dat is het ook — mits je het bureau echt gebruikt.\n\nDe winst zit niet in het apparaat, maar in het ritme. Onderzoek wijst steeds dezelfde kant op: afwisseling tussen zitten en staan vermindert klachten in de onderrug en nek. Een veelgebruikt advies is om elk half uur van houding te wisselen.\n\nLet bij de keuze op drie dingen: de bediening, het hoogtebereik en de stabiliteit. Een geheugenbediening met vaste standen zorgt dat je daadwerkelijk wisselt — je drukt één knop. Een hoogtebereik vanaf 65 cm past ook kortere collega's. En een frame dat bij stahoogte niet wiebelt, gebruik je met meer plezier.\n\nWil je weten welk bureau past bij jullie werkplekken? Onze specialisten denken mee.",
    image: "/beelden/sfeer-detail.png",
  },
  {
    _id: "mock-post-2",
    title: "Akoestiek op kantoor: rust zonder muren",
    slug: "akoestiek-op-kantoor",
    datum: "2026-04-03",
    thema: "Werkomgeving",
    leestijd: 5,
    samenvatting:
      "Een open kantoor werkt prettig samen, maar geluid is de keerzijde. Zo houd je het rustig zonder alles dicht te bouwen.",
    body: "Open kantoren zijn populair omdat ze samenwerking makkelijker maken. De keerzijde is geluid: telefoongesprekken, overleg en het getik van toetsenborden lopen door elkaar. Volledig dichtbouwen met wanden is zelden de oplossing — dan verlies je juist de openheid die je wilde.\n\nDe sleutel zit in zachte materialen en slimme indeling. Akoestische panelen aan wand of plafond vangen geluid op voor het terugkaatst. Een vergaderruimte of belplek vangt de gesprekken op die anders de hele vloer over gaan.\n\nOok meubilair helpt. Hoge kasten en stoffering breken geluid. Door drukke en stille zones bewust te scheiden in de plattegrond, geef je iedere taak zijn eigen plek.\n\nWij kijken bij een inrichting standaard naar de akoestiek mee. Niet als losse post, maar als onderdeel van het geheel.",
    image: "/beelden/project-kantoortuin.png",
  },
  {
    _id: "mock-post-3",
    title: "Een vergaderruimte die klaar is voor hybride overleg",
    slug: "vergaderruimte-hybride-overleg",
    datum: "2026-02-18",
    thema: "Inrichting",
    leestijd: 3,
    samenvatting:
      "Half op kantoor, half online. Zo richt je een vergaderruimte in waar beide groepen volwaardig meedoen.",
    body: "Sinds overleg deels online gebeurt, stelt een vergaderruimte andere eisen. De mensen op afstand moeten net zo goed meedoen als de mensen in de ruimte. Dat begint bij de tafel.\n\nKies een tafel met ingebouwde stroom- en datapunten, zodat laptops aangesloten blijven zonder kabels over de vloer. Zorg dat iedereen aan tafel in beeld komt voor de camera — een te lange, smalle tafel werkt daar tegen.\n\nDenk ook aan de stoelen. Bij hybride overleg zit je vaak langer dan vroeger, omdat schermdelen en online rondjes tijd kosten. Stoelen die een uur prettig blijven, maken het verschil.\n\nWil je je overlegruimtes klaarmaken voor hybride werken? Bekijk onze vergadertafels of vraag een advies aan.",
    image: "/beelden/project-vergaderruimte.png",
  },
];
