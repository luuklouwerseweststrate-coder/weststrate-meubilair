// Branchelaag: de positionering "Weststrate richt complete ruimtes in" als
// navigeerbare ingangen. Elke ingang (branche, type ruimte of projecttype)
// koppelt waarheidsgetrouwe copy aan ECHTE producten uit de catalogus en aan
// ECHTE uitgevoerde projecten (alleen waar die bestaan, niets verzonnen).
//
// Dit bestand is pure configuratie zonder afhankelijkheid van de datalaag, zodat
// het veilig overal te importeren is. De koppeling naar producten/projecten en
// het afleiden van een kaartbeeld gebeurt in lib/data.ts.

// Welke producten horen bij een ingang: per filter een hoofdcategorie en
// optioneel een subcategorie (ruwe Swan-naam, zoals "Terras- / Kantinestoelen").
export interface BrancheFilter {
  category: string;
  subcategory?: string;
}

// De drie assen waarop we de ingangen op de overzichtspagina groeperen.
export type BrancheGroep = "Branche" | "Ruimte" | "Project";

export interface Branche {
  slug: string; // URL: /branches/[slug]
  naam: string; // paginatitel, bv. "Zorg & welzijn"
  menukort: string; // korte kaart-/menulabel, bv. "Zorg"
  groep: BrancheGroep; // voor groepering op de hub
  pitch: string; // één zin op de kaart en onder de titel
  intro: string; // 1-2 alinea's bovenaan de detailpagina (alinea's met \n\n)
  punten: string[]; // 3 "waar wij op letten"-bullets ("Kop: tekst")
  productFilters: BrancheFilter[]; // welke catalogusproducten we tonen
  projectSlugs: string[]; // gekoppelde echte projecten (kan leeg zijn)
  accent: string; // accentkleur (brandbook)
  beeld?: string; // expliciet kaart-/herobeeld; leeg = eerste projectfoto
}

export const BRANCHES: Branche[] = [
  // ── Per branche ────────────────────────────────────────────
  {
    slug: "kantoor",
    naam: "Kantoren & zakelijke dienstverlening",
    menukort: "Kantoor",
    groep: "Branche",
    pitch:
      "Werkplekken, overlegruimtes en stilteplekken die passen bij hoe jullie werken.",
    intro:
      "Een kantoor is meer dan een verzameling bureaus. Weststrate richt de hele werkomgeving in: werkplekken, vergaderruimtes, ontvangst en pauzeplekken, afgestemd op jullie manier van werken. We kijken mee in je pand, denken na over indeling, ergonomie en akoestiek, en leveren en monteren alles met een eigen team.\n\nVan een paar werkplekken tot de inrichting van een compleet pand: je hebt één aanspreekpunt voor advies, levering en montage.",
    punten: [
      "Ergonomie: zit-sta bureaus en stoelen die bij de werkhouding passen.",
      "Akoestiek: rust in open ruimtes met de juiste indeling en materialen.",
      "Eén aanspreekpunt: advies, levering en montage uit één hand.",
    ],
    productFilters: [
      { category: "Werken", subcategory: "Bureaus" },
      { category: "Werken", subcategory: "Zit-sta bureaus" },
      { category: "Zitten", subcategory: "Bureaustoelen" },
      { category: "Opbergen" },
    ],
    projectSlugs: ["draftec", "noordhuys-oude-tonge", "damen"],
    accent: "#A1367E",
    beeld: "/beelden/hero-kantoor.png",
  },
  {
    slug: "zorg",
    naam: "Zorg & welzijn",
    menukort: "Zorg",
    groep: "Branche",
    pitch:
      "Inrichting voor wachtruimtes, spreekkamers en personeelsplekken, makkelijk schoon te houden.",
    intro:
      "In de zorg telt een prettige omgeving voor cliënten én personeel. Weststrate richt de niet-medische ruimtes in: wachtruimtes, spreekkamers, kantoren, vergaderruimtes en personeelsplekken. We kiezen meubilair dat goed schoon te houden is en dagelijks gebruik aankan.\n\nWe denken mee over indeling en comfort, leveren uit een breed assortiment en plaatsen alles met een eigen montageteam, met aandacht voor doorgang en planning op een locatie die in bedrijf blijft.",
    punten: [
      "Hygiëne: materialen die makkelijk te reinigen zijn.",
      "Comfort: zitplekken voor wachtende bezoekers en voor personeel.",
      "Planning: levering en montage afgestemd op een locatie die doordraait.",
    ],
    productFilters: [
      { category: "Zitten", subcategory: "Bureaustoelen" },
      { category: "Zitten", subcategory: "Vergaderstoelen" },
      { category: "Opbergen" },
      { category: "Werken", subcategory: "Bureaus" },
    ],
    projectSlugs: ["admiraal-de-ruyter-ziekenhuis"],
    accent: "#01B6E3",
  },
  {
    slug: "onderwijs",
    naam: "Onderwijs & scholen",
    menukort: "Onderwijs",
    groep: "Branche",
    pitch:
      "Van klaslokaal en aula tot lerarenkamer: meubilair dat tegen dagelijks gebruik kan.",
    intro:
      "Scholen vragen om meubilair dat veel gebruik aankan en snel om te bouwen is. Weststrate richt klaslokalen, aula's, mediatheken en personeelsruimtes in, met stoelen en tafels die je makkelijk verplaatst en opstelt voor verschillende momenten.\n\nWe denken mee over flexibele opstellingen en leveren en monteren met een eigen team, zodat een ruimte tijdens een vakantie of in fasen klaar is voor gebruik.",
    punten: [
      "Flexibel: klap- en stapelbare tafels en stoelen voor wisselende opstellingen.",
      "Bestand tegen gebruik: meubilair dat dagelijks intensief gebruik aankan.",
      "In fasen: planning rond les- en vakantieroosters.",
    ],
    productFilters: [
      { category: "Zitten", subcategory: "Terras- / Kantinestoelen" },
      { category: "Vergaderen", subcategory: "Klaptafels" },
      { category: "Werken", subcategory: "Bureaus" },
      { category: "Opbergen" },
    ],
    projectSlugs: ["archipel-onze-wijs"],
    accent: "#009D46",
  },
  {
    slug: "horeca",
    naam: "Horeca",
    menukort: "Horeca",
    groep: "Branche",
    pitch: "Stoelen en tafels voor restaurant, café, lunchroom en terras.",
    intro:
      "In de horeca bepaalt de inrichting mede hoe lang gasten blijven. Weststrate levert stoelen en tafels voor restaurants, cafés, lunchrooms en terrassen, en denkt mee over de opstelling van de ruimte.\n\nVoor het ZB Café in Middelburg richtten we de horecaruimte in met negentig zitplekken in verschillende opstellingen. We adviseren over comfort en gebruik, en kiezen materialen op eenvoudig onderhoud.",
    punten: [
      "Binnen en buiten: stoelen voor de zaal en voor het terras.",
      "Onderhoud: materialen die tegen dagelijks gebruik kunnen.",
      "Opstelling: meer zitplekken zonder dat de ruimte vol oogt.",
    ],
    productFilters: [
      { category: "Zitten", subcategory: "Terras- / Kantinestoelen" },
      { category: "Vergaderen", subcategory: "Vergadertafels" },
      { category: "Vergaderen", subcategory: "Klaptafels" },
    ],
    projectSlugs: ["de-boterkapel", "neeltje-jans", "zb-bibliotheek-middelburg"],
    accent: "#F29828",
  },

  // ── Per type ruimte ────────────────────────────────────────
  {
    slug: "kantine",
    naam: "Kantines & bedrijfsrestaurants",
    menukort: "Kantines",
    groep: "Ruimte",
    pitch:
      "Flexibele opstellingen voor pauze, lunch en bijeenkomsten in één ruimte.",
    intro:
      "Een kantine doet vaak meer dan lunchen alleen: het is ook de plek voor overleg, een borrel of een presentatie. Weststrate richt bedrijfsrestaurants in met stoelen en tafels die je snel anders opstelt, zodat dezelfde ruimte meerdere functies aankan.\n\nVoor Noordhuys in Oude-Tonge richtten we een kantine in met ruimte voor meer dan honderd zitplaatsen en flexibiliteit in de opstelling.",
    punten: [
      "Meerdere functies: van lunch tot bijeenkomst in dezelfde ruimte.",
      "Snel om te bouwen: klap- en stapelbare tafels en stoelen.",
      "Capaciteit: opstellingen voor grote groepen.",
    ],
    productFilters: [
      { category: "Zitten", subcategory: "Terras- / Kantinestoelen" },
      { category: "Vergaderen", subcategory: "Klaptafels" },
    ],
    projectSlugs: ["rws", "noordhuys-oude-tonge", "zb-bibliotheek-middelburg"],
    accent: "#F29828",
  },
  {
    slug: "vergaderruimte",
    naam: "Vergader- & overlegruimtes",
    menukort: "Vergaderruimtes",
    groep: "Ruimte",
    pitch: "Tafels en stoelen voor overleg, presentaties en hybride werken.",
    intro:
      "Sinds overleg deels online gebeurt, stelt een vergaderruimte andere eisen. Weststrate richt overleg- en vergaderruimtes in met tafels en stoelen die langer overleg comfortabel houden, en denkt mee over akoestiek en de opstelling voor de camera.\n\nVoor de Gemeente Schouwen-Duiveland richtten we de burgerzaal en omliggende vergaderruimtes in, met aandacht voor akoestiek en een vergaderopstelling voor de hele raad.",
    punten: [
      "Hybride: opstellingen waarin iedereen in beeld komt.",
      "Akoestiek: rust voor verstaanbaar overleg.",
      "Comfort: stoelen die ook bij lang overleg prettig blijven.",
    ],
    productFilters: [
      { category: "Vergaderen", subcategory: "Vergadertafels" },
      { category: "Vergaderen", subcategory: "Klaptafels" },
      { category: "Zitten", subcategory: "Vergaderstoelen" },
    ],
    projectSlugs: [
      "kloosterboer",
      "gemeente-schouwen-duiveland",
      "noordhuys-oude-tonge",
    ],
    accent: "#009D46",
    beeld: "/beelden/project-vergaderruimte.png",
  },

  // ── Voor je project ────────────────────────────────────────
  {
    slug: "nieuwbouw",
    naam: "Nieuwbouwprojecten",
    menukort: "Nieuwbouw",
    groep: "Project",
    pitch: "Vanaf de ontwerptekening meedenken over de complete inrichting.",
    intro:
      "Bij een nieuw pand wil je dat de inrichting klaarstaat op de dag dat je verhuist. Weststrate denkt vanaf de ontwerptekeningen mee over de meubilairkeuzes voor elke ruimte, van entree en kantoren tot vergaderruimtes en kantine.\n\nVoor Noordhuys verzorgden we de complete inrichting van een splinternieuw pand, met gefaseerde levering en montage door een eigen team.",
    punten: [
      "Vanaf het ontwerp: meedenken over indeling en meubilairkeuzes.",
      "Compleet: elke ruimte uit één hand.",
      "Op tijd klaar: gefaseerde levering en montage richting de opleverdatum.",
    ],
    productFilters: [
      { category: "Werken", subcategory: "Bureaus" },
      { category: "Werken", subcategory: "Zit-sta bureaus" },
      { category: "Zitten", subcategory: "Bureaustoelen" },
      { category: "Vergaderen", subcategory: "Vergadertafels" },
      { category: "Opbergen" },
    ],
    projectSlugs: [
      "multi",
      "van-der-straaten",
      "damen",
      "noordhuys-oude-tonge",
    ],
    accent: "#A1367E",
  },
  {
    slug: "renovatie",
    naam: "Renovatie & herinrichting",
    menukort: "Renovatie",
    groep: "Project",
    pitch:
      "Vernieuwen met behoud van wat werkt, terwijl de locatie in gebruik blijft.",
    intro:
      "Een herinrichting vraagt om planning rond een ruimte die vaak gewoon in gebruik blijft. Weststrate vernieuwt bestaande ruimtes in fasen en denkt mee over wat je houdt en wat je vervangt.\n\nVoor de Gemeente Schouwen-Duiveland en het ZB Café in Middelburg verzorgden we de herinrichting van bestaande ruimtes, met aandacht voor fasering en het hergebruik van bestaand meubilair.",
    punten: [
      "In fasen: planning rond een locatie die doordraait.",
      "Behoud wat werkt: vervangen waar nodig, houden wat goed is.",
      "Eén team: advies, levering en montage uit één hand.",
    ],
    productFilters: [
      { category: "Zitten", subcategory: "Bureaustoelen" },
      { category: "Vergaderen", subcategory: "Vergadertafels" },
      { category: "Opbergen" },
      { category: "Werken", subcategory: "Bureaus" },
    ],
    projectSlugs: [
      "rabobank-vlissingen",
      "gemeente-veere",
      "gemeente-schouwen-duiveland",
      "zb-bibliotheek-middelburg",
    ],
    accent: "#673981",
  },
];

// Nette kop per groep voor de overzichtspagina.
export const GROEP_LABEL: Record<BrancheGroep, string> = {
  Branche: "Per branche",
  Ruimte: "Per type ruimte",
  Project: "Voor je project",
};
