import type { SiteSettings, Project, BlogPost } from "./types";

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

// ── Referentieprojecten ──────────────────────────────────────
// Echte, afgeronde projecten van weststrate.nl. Titels, intro's (uit de
// meta-omschrijving), klant/locatie en alle foto's komen rechtstreeks van de
// live site. De verhaalblokken (uitdaging/aanpak/resultaat) en cijfers zijn
// bewust leeg gelaten: die vult Luuk met de échte projecttekst — niets
// verzonnen. Het hoofdbeeld is de eerste foto, de rest vormt de galerij.
// Zodra Sanity gevuld is, neemt die het over (zie lib/data.ts).
const WST = "https://weststrate.nl/media/media_cached/1xheight/media/Projecten";

export const MOCK_PROJECTS: Project[] = [
  {
    _id: "project-damen",
    title: "Een nieuwe kantoorinrichting voor Damen",
    slug: "damen",
    klant: "Damen",
    sector: "Industrie",
    jaar: "",
    locatie: "Gorinchem",
    intro:
      "Weststrate heeft in samenwerking met Vepa de nieuwe kantoor- en werkplekinrichting verzorgd voor Damen in Gorinchem. Damen Shipyards Group, een wereldwijde speler in de scheepsbouw, streeft naar de hoogste standaard in duurzaamheid — en Weststrate draagt daaraan bij met projectinrichting en circulaire oplossingen.",
    uitdaging:
      "Na een uitgebreid aanbestedingstraject kwam Weststrate, in nauwe samenwerking met Vepa, als beste leverancier uit de bus. De combinatie van duurzaamheid, prijs en de innovatieve eigenschappen van het meubilair gaf de doorslag. Met name de eenvoudige montage en flexibiliteit van de hoog-laagbureaus sloot perfect aan bij de behoefte van Damen, waar projectmatig werken centraal staat. Om dit te ondersteunen volgde het facilitaire team van Damen een training bij Vepa over het gebruik en onderhoud van het meubilair.",
    aanpak:
      "Weststrate fungeerde als verbindende factor in het project. Samen met Vepa zorgden we voor de gefaseerde levering en installatie van 1.120 hoog-laagbureaus. Deze werkplekken bieden ergonomisch comfort en zijn volledig afgestemd op de wensen van Damen. Circulaire productie speelde een grote rol: oude bureaus van Damen werden door Vepa verwerkt tot nieuw meubilair.\n\nDe zit/sta-bureaus stimuleren een gezondere werkhouding, met zorgvuldig weggewerkt kabelmanagement en dubbele monitorarmen zodat medewerkers zonder hinder kunnen werken. In totaal worden 600 bureaustoelen geleverd in twaalf gefaseerde leveringen, voor comfort en uniformiteit van de (flex)werkplekken.\n\nOm ongestoord te kunnen bellen zijn akoestische belunits geplaatst: geluidsabsorberende telefooncabines voor een rustige, privé-omgeving. Middelhoge kasten met plantenbakken dienen als groene buffers tussen de werkplekken in de grote kantoortuinen. De vergaderruimtes kregen in hoogte instelbare vergadertafels en stoelen van gerecycled PET-materiaal, gemaakt uit versnipperde PET-flessen.",
    resultaat:
      "Een inspirerende werkomgeving die modern, circulair én ergonomisch is ingericht. Dit project laat zien hoe functionaliteit, duurzaamheid en comfort hand in hand kunnen gaan. Bij Weststrate zijn we trots op deze samenwerking met Vepa en Damen — een voorbeeld van hoe duurzaamheid en hoogwaardige projectinrichting elkaar versterken.",
    cijfers: [
      { waarde: "1.120", label: "hoog-laagbureaus" },
      { waarde: "600", label: "bureaustoelen" },
      { waarde: "12", label: "gefaseerde leveringen" },
    ],
    image: `${WST}/Damen/IMG_0653.jpg`,
    images: [
      `${WST}/Damen/IMG_0514.jpg`,
      `${WST}/Damen/IMG_0529.jpg`,
      `${WST}/Damen/IMG_0546.jpg`,
      `${WST}/Damen/IMG_0541.jpg`,
      `${WST}/Damen/IMG_0622.jpg`,
      `${WST}/Damen/IMG_0504.jpg`,
      `${WST}/Damen/IMG_0536.jpg`,
      `${WST}/Damen/IMG_0537.jpg`,
      `${WST}/Damen/IMG_0538.jpg`,
      `${WST}/Damen/IMG_0539.jpg`,
      `${WST}/Damen/IMG_0542.jpg`,
      `${WST}/Damen/IMG_0547.jpg`,
      `${WST}/Damen/IMG_0553.jpg`,
      `${WST}/Damen/IMG_0559.jpg`,
      `${WST}/Damen/IMG_0573.jpg`,
      `${WST}/Damen/IMG_0582.jpg`,
      `${WST}/Damen/IMG_0601.jpg`,
      `${WST}/Damen/IMG_0602.jpg`,
      `${WST}/Damen/IMG_0604.jpg`,
      `${WST}/Damen/IMG_0612.jpg`,
      `${WST}/Damen/IMG_0615.jpg`,
      `${WST}/Damen/IMG_0632.jpg`,
      `${WST}/Damen/IMG_0647.jpg`,
    ],
    categorieen: [
      "Hoog-laagbureaus",
      "Bureaustoelen",
      "Akoestische belunits",
      "Vergadertafels",
    ],
  },
  {
    _id: "project-schouwen-duiveland",
    title: "Herinrichting raadszaal Gemeente Schouwen-Duiveland",
    slug: "gemeente-schouwen-duiveland",
    klant: "Gemeente Schouwen-Duiveland",
    sector: "Overheid",
    jaar: "",
    locatie: "Zierikzee",
    intro:
      "Bij Weststrate zijn we trots op onze samenwerking met de Gemeente Schouwen-Duiveland voor de herinrichting van de burgerzaal en diverse vergaderruimtes in Zierikzee. Dit project, eerder uitgesteld door de coronapandemie, markeert een belangrijke stap in het moderniseren van de faciliteiten van de gemeente.",
    uitdaging:
      "Na de succesvolle uitvoering van fase 1 in 2017 — waaronder het opfrissen van de entree, het restylen van het bedrijfsrestaurant, het integreren van flexwerkplekken en het creëren van nieuwe vergaderruimtes — rondde Weststrate recent de tweede fase af. Deze omvatte de burgerzaal en omliggende vergaderruimtes, met een nieuwe en functionele indeling, verbeterde akoestiek voor een optimale geluidsbeleving, en een representatieve vergaderopstelling voor de Raad en het College van Burgemeester en Wethouders.",
    aanpak:
      "Het project werd uitgevoerd onder leiding van Leander Oostdijk van architectenbureau Kort Geytenbeek, met een samengestelde projectgroep van medewerkers en onderaannemers. Ondanks de strakke planning — net voor, tijdens en na de zomervakantie — is het project succesvol afgerond. Begin oktober nam de gemeente de vernieuwde burgerzaal in gebruik.\n\nDe vernieuwde burgerzaal biedt een nieuw presidium en werkplekken voor facilitaire ondersteuning, een speciale werkplek voor de pers, een comfortabele en efficiënte vergaderopstelling voor alle raadsleden, en een up-to-date geluidsinstallatie met moderne audiovisuele technieken.\n\nDuurzaamheid stond centraal. Oude meubels uit de burgerzaal kregen een tweede leven: in plaats van afvoeren koos de gemeente ervoor ze weg te geven aan inwoners en organisaties. De oude tafelbladen zijn hergebruikt voor onder andere de afscheiding met plantenbakken en de zitbanken.",
    resultaat:
      "Weststrate is dankbaar voor het vertrouwen van de Gemeente Schouwen-Duiveland en trots op het eindresultaat. De PZC vatte het treffend samen: “Die zaal is van ons allemaal; Schouwen-Duiveland neemt vernieuwd hart van de democratie in gebruik.” In de burgerzaal hangt nu het wapen van Schouwen-Duiveland, vervaardigd door Meesters in Hout — een kunstwerk dat Weststrate samen met Meesters in Hout aan de gemeente schonk ter gelegenheid van de opening.",
    cijfers: [
      { waarde: "Fase 2", label: "burgerzaal & vergaderruimtes" },
      { waarde: "2017", label: "start fase 1" },
    ],
    image: `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-2.jpg`,
    images: [
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-16.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-126.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-258.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-63.jpg`,
      `${WST}/Schouwen/Wapen%20uit%20hout%20-%20geschonken%20door%20Weststrate%20samen%20met%20Meestersinhout.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-1.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-3.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-12.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-13.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-19.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-22.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-26.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-41.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-77.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-100.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-127.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-128.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-129.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-133.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-188.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-209.jpg`,
      `${WST}/Projectpagina%20Gemeente%20Schouwen-Duiveland/Weststrate%20-%20burgerzaal%20Schouwen-279.jpg`,
    ],
    categorieen: ["Vergaderopstelling", "Akoestiek", "Maatwerk"],
  },
  {
    _id: "project-noordhuys",
    title: "Kantoorinrichting Noordhuys Oude-Tonge",
    slug: "noordhuys-oude-tonge",
    klant: "Noordhuys",
    sector: "Zakelijke dienstverlening",
    jaar: "",
    locatie: "Oude-Tonge",
    intro:
      "Voor Noordhuys realiseerde Weststrate de complete projectinrichting van het splinternieuwe pand in Oude-Tonge. Een werkomgeving waarin functionaliteit, flexibiliteit en comfort samenkomen.",
    uitdaging:
      "Het nieuwe pand moest worden ingericht als een lichte en open werkomgeving. Er was behoefte aan voldoende werkplekken, instructieruimtes, een kantine en een terras.",
    aanpak:
      "Op basis van de ontwerptekeningen van de architect scherpte Weststrate het interieurontwerp verder aan, met de focus op de juiste meubilairkeuzes. Samen met de klant liepen we door de showroom en bekeken we met kleurstalen van vloer- en wandafwerking alle mogelijkheden. Zo zijn doordachte keuzes gemaakt voor alle ruimtes: van entree en kantoren tot vergader- en instructieruimtes, facilitaire ruimtes voor productiemedewerkers, de kantine en het terras.\n\nIn de kantine was de wens om minimaal 100 zitplaatsen te realiseren, met flexibiliteit in de opstelling zodat die eenvoudig aan te passen is voor verschillende functies en momenten. Met hoogteverschillen en maatwerkoplossingen van Meestersinhout kreeg de ruimte een dynamische uitstraling, met behoud van een lichte en open sfeer.\n\nDe kantoorruimtes zijn ingericht met duo zit-sta bureaus inclusief bijpassende bekabeling, aangevuld met maatwerk meubilairblokken. Voor een vergaderruimte en het directiekantoor realiseerden we samen met Meestersinhout grote vergadertafels met een travertin-look voor minimaal tien personen, ter plaatse gemonteerd.",
    resultaat:
      "Het resultaat is een representatieve en eigentijdse werkomgeving die bijdraagt aan werkplezier en productiviteit. Een pand waarin collega’s prettig kunnen werken en dat klaar is voor toekomstig gebruik en groei.",
    cijfers: [
      { waarde: "~32", label: "werkplekken" },
      { waarde: "100+", label: "zitplaatsen kantine" },
      { waarde: "5", label: "vergaderruimtes" },
    ],
    image: `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20-%20Kantoorinrichting%20Weststrate.jpg`,
    images: [
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20Kantoorinrichting%20Weststrate%207.jpeg`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20-%20Kantoorinrichting%20Weststrate%205.png`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20-%20Kantoorinrichting%20Weststrate%204.png`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20-%20Kantoorinrichting%20Weststrate%202.png`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20-%20Kantoorinrichting%20Weststrate%203.png`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20-%20Kantoorinrichting%20Weststrate%201.png`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20Kantoorinrichting%20Weststrate%2019.jpeg`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20Kantoorinrichting%20Weststrate%2013.jpeg`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20Kantoorinrichting%20Weststrate%202.jpeg`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20Kantoorinrichting%20Weststrate%2020.jpeg`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20Kantoorinrichting%20Weststrate%20tafel2.jpg`,
      `${WST}/Noordhuys/Noordhuys%20Oude-Tonge%20Kantoorinrichting%20Weststrate%2021.jpg`,
    ],
    categorieen: [
      "Zit-sta bureaus",
      "Vergadertafels",
      "Kantinemeubilair",
      "Maatwerk",
    ],
  },
  {
    _id: "project-zb-bibliotheek",
    title: "Herinrichting ZB Café, Bibliotheek Middelburg",
    slug: "zb-bibliotheek-middelburg",
    klant: "ZB Bibliotheek",
    sector: "Cultuur",
    jaar: "",
    locatie: "Middelburg",
    intro:
      "Voor de Zeeuwse Bibliotheek in Middelburg realiseerde Weststrate de inrichting van het vernieuwde ZB Café. Een ruimte die naadloos aansluit op de uitstraling van de bibliotheek en functioneert als de huiskamer van het gebouw: een plek waar bezoekers graag even gaan zitten om te lezen, werken of iets te eten en drinken.",
    uitdaging:
      "ZB wilde de horecaruimte transformeren van een traditionele uitstraling naar een warme, huiselijke omgeving. De ruimte moest uitnodigen om plaats te nemen en aansluiten bij de kleurrijke sfeer van de bibliotheek. Daarnaast was er behoefte aan meer zitplaatsen en een sterkere verbinding met buiten — een plek waar je graag even blijft hangen voor een krant, boek of spelletje.",
    aanpak:
      "Op basis van de ontwerptekeningen van de architect richtte Weststrate de horecaruimte verder in en optimaliseerde die. We creëerden een huiselijke en toegankelijke sfeer met 90 zitplekken, verdeeld over diverse opstellingen met tafels en stoelen, comfortabele fauteuils gericht op het zicht naar buiten, huiselijke zithoeken, een lange werktafel langs het raam en een centrale koffietafel die ook geschikt is voor grotere groepen en overlegmomenten.\n\nWe adviseerden in de meubilairkeuze, met uitstraling, comfort en praktisch gebruik centraal, en selecteerden de materialen op eenvoudig onderhoud. Samen met onze maatwerkpartner Meestersinhout ontwikkelden we maatwerkoplossingen, waaronder de centrale koffietafel en slimme presentatie- en opbergoplossingen voor tijdschriften en boeken. De volledige levering en montage zijn uitgevoerd door ons eigen team, wat zorgde voor een efficiënte en gecontroleerde realisatie.",
    resultaat:
      "Het vernieuwde ZB Café is nu een uitnodigende en veelzijdige ruimte, waar bezoekers zich direct op hun gemak voelen en verschillende functies samenkomen. Het platform Wij zijn De Stad krijgt er een eigen werk- en ontmoetingsplek: op een groot scherm zijn historische foto’s van Middelburg te zien, afgewisseld met actuele informatie over de stad — een plek om verhalen te delen en beeldmateriaal mee te brengen.",
    cijfers: [
      { waarde: "90", label: "verschillende zitplekken" },
    ],
    image: `${WST}/ZB%20Bibliotheek%20Middelburg/ZB%20Bibliotheek%20Middelburg%20herinrichting%20ZB%20Caf%C3%A9%20Weststrate.jpg`,
    images: [
      `${WST}/ZB%20Caf%C3%A9/ZB%20Caf%C3%A9%20herinrichting%20Weststrate%2015.jpg`,
      `${WST}/ZB%20Caf%C3%A9/ZB%20Caf%C3%A9%20herinrichting%20Weststrate%20combi%202.jpg`,
      `${WST}/ZB%20Caf%C3%A9/ZB%20Caf%C3%A9%20herinrichting%20Weststrate%20combi%203.jpg`,
      `${WST}/ZB%20Caf%C3%A9/ZB%20Caf%C3%A9%20herinrichting%20Weststrate%20combi%204.jpg`,
      `${WST}/ZB%20Caf%C3%A9/ZB%20Caf%C3%A9%20herinrichting%20Weststrate%20combi%205.jpg`,
      `${WST}/ZB%20Caf%C3%A9/ZB%20Caf%C3%A9%20herinrichting%20Weststrate%20combi%206.jpg`,
      `${WST}/ZB%20Caf%C3%A9/ZB%20Caf%C3%A9%20herinrichting%20Weststrate%2016.jpg`,
      `${WST}/ZB%20Bibliotheek%20Middelburg/Wij%20zijn%20de%20stad%20ZB%20cafe.jpg`,
    ],
    categorieen: ["Horecameubilair", "Fauteuils", "Maatwerk"],
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
