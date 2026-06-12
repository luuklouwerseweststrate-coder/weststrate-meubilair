import type { SiteSettings, Project, BlogPost } from "./types";

// Voorbeelddata zodat de site draait vóórdat Sanity gekoppeld is.
// Zodra Sanity gevuld is, neemt die het over (zie lib/data.ts).

export const MOCK_SETTINGS: SiteSettings = {
  bedrijfsnaam: "Weststrate Meubilair",
  payoff: "De veelzijdige specialist",
  overOns:
    "Weststrate richt complete ruimtes in. Van één ergonomische stoel tot de inrichting van een heel pand: wij denken mee over de ruimte, leveren het meubilair en regelen de montage. Met eigen specialisten en een breed assortiment kiezen we wat past bij jouw mensen en jouw pand, niet andersom.",
  email: "verkoop@weststrate.nl",
  telefoon: "0118 - 000 000",
  adres: "Herculesweg 37, Middelburg",
  footerTekst:
    "Prijzen zijn indicatief en exclusief btw. Aan een samengestelde offerte kunnen geen rechten worden ontleend.",
};

// ── Referentieprojecten ──────────────────────────────────────
// Echte, afgeronde projecten van weststrate.nl. Titels, intro's (uit de
// meta-omschrijving), klant/locatie en alle foto's komen rechtstreeks van de
// live site. De verhaalblokken (uitdaging/aanpak/resultaat) en cijfers zijn
// bewust leeg gelaten: die vult Luuk met de échte projecttekst, niets
// verzonnen. Het hoofdbeeld is de eerste foto, de rest vormt de galerij.
// Zodra Sanity gevuld is, neemt die het over (zie lib/data.ts).
// Originele (niet-gecachte) mediapaden: deze bestaan altijd. De
// media_cached/1xheight-varianten waren maar voor een handvol foto's
// aangemaakt; next/image optimaliseert het origineel zelf.
const WST = "https://weststrate.nl/media/Projecten";

// Uitzondering: de foto's van onze eigen showroom staan onder media/Nieuws/showroom,
// niet onder media/Projecten. Let op de tikfout "Westrate" in de bestandsnamen op
// de live site: die nemen we exact over, anders bestaan de bestanden niet.
const SHOW =
  "https://weststrate.nl/media/Nieuws/showroom/Westrate%20showroom%205%20dec-";

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
      "Weststrate heeft in samenwerking met Vepa de nieuwe kantoor- en werkplekinrichting verzorgd voor Damen in Gorinchem. Damen Shipyards Group, een wereldwijde speler in de scheepsbouw, streeft naar de hoogste standaard in duurzaamheid, en Weststrate draagt daaraan bij met projectinrichting en circulaire oplossingen.",
    uitdaging:
      "Na een uitgebreid aanbestedingstraject kwam Weststrate, in nauwe samenwerking met Vepa, als beste leverancier uit de bus. De combinatie van duurzaamheid, prijs en de innovatieve eigenschappen van het meubilair gaf de doorslag. Met name de eenvoudige montage en flexibiliteit van de hoog-laagbureaus sloot perfect aan bij de behoefte van Damen, waar projectmatig werken centraal staat. Om dit te ondersteunen volgde het facilitaire team van Damen een training bij Vepa over het gebruik en onderhoud van het meubilair.",
    aanpak:
      "Weststrate fungeerde als verbindende factor in het project. Samen met Vepa zorgden we voor de gefaseerde levering en installatie van 1.120 hoog-laagbureaus. Deze werkplekken bieden ergonomisch comfort en zijn volledig afgestemd op de wensen van Damen. Circulaire productie speelde een grote rol: oude bureaus van Damen werden door Vepa verwerkt tot nieuw meubilair.\n\nDe zit/sta-bureaus stimuleren een gezondere werkhouding, met zorgvuldig weggewerkt kabelmanagement en dubbele monitorarmen zodat medewerkers zonder hinder kunnen werken. In totaal worden 600 bureaustoelen geleverd in twaalf gefaseerde leveringen, voor comfort en uniformiteit van de (flex)werkplekken.\n\nOm ongestoord te kunnen bellen zijn akoestische belunits geplaatst: geluidsabsorberende telefooncabines voor een rustige, privé-omgeving. Middelhoge kasten met plantenbakken dienen als groene buffers tussen de werkplekken in de grote kantoortuinen. De vergaderruimtes kregen in hoogte instelbare vergadertafels en stoelen van gerecycled PET-materiaal, gemaakt uit versnipperde PET-flessen.",
    resultaat:
      "Een inspirerende werkomgeving die modern, circulair én ergonomisch is ingericht. Dit project laat zien hoe functionaliteit, duurzaamheid en comfort hand in hand kunnen gaan. Bij Weststrate zijn we trots op deze samenwerking met Vepa en Damen, een voorbeeld van hoe duurzaamheid en hoogwaardige projectinrichting elkaar versterken.",
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
      "Na de succesvolle uitvoering van fase 1 in 2017, waaronder het opfrissen van de entree, het restylen van het bedrijfsrestaurant, het integreren van flexwerkplekken en het creëren van nieuwe vergaderruimtes, rondde Weststrate recent de tweede fase af. Deze omvatte de burgerzaal en omliggende vergaderruimtes, met een nieuwe en functionele indeling, verbeterde akoestiek voor een optimale geluidsbeleving, en een representatieve vergaderopstelling voor de Raad en het College van Burgemeester en Wethouders.",
    aanpak:
      "Het project werd uitgevoerd onder leiding van Leander Oostdijk van architectenbureau Kort Geytenbeek, met een samengestelde projectgroep van medewerkers en onderaannemers. Ondanks de strakke planning, net voor, tijdens en na de zomervakantie, is het project succesvol afgerond. Begin oktober nam de gemeente de vernieuwde burgerzaal in gebruik.\n\nDe vernieuwde burgerzaal biedt een nieuw presidium en werkplekken voor facilitaire ondersteuning, een speciale werkplek voor de pers, een comfortabele en efficiënte vergaderopstelling voor alle raadsleden, en een up-to-date geluidsinstallatie met moderne audiovisuele technieken.\n\nDuurzaamheid stond centraal. Oude meubels uit de burgerzaal kregen een tweede leven: in plaats van afvoeren koos de gemeente ervoor ze weg te geven aan inwoners en organisaties. De oude tafelbladen zijn hergebruikt voor onder andere de afscheiding met plantenbakken en de zitbanken.",
    resultaat:
      "Weststrate is dankbaar voor het vertrouwen van de Gemeente Schouwen-Duiveland en trots op het eindresultaat. De PZC vatte het treffend samen: “Die zaal is van ons allemaal; Schouwen-Duiveland neemt vernieuwd hart van de democratie in gebruik.” In de burgerzaal hangt nu het wapen van Schouwen-Duiveland, vervaardigd door Meesters in Hout, een kunstwerk dat Weststrate samen met Meesters in Hout aan de gemeente schonk ter gelegenheid van de opening.",
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
      "ZB wilde de horecaruimte transformeren van een traditionele uitstraling naar een warme, huiselijke omgeving. De ruimte moest uitnodigen om plaats te nemen en aansluiten bij de kleurrijke sfeer van de bibliotheek. Daarnaast was er behoefte aan meer zitplaatsen en een sterkere verbinding met buiten, een plek waar je graag even blijft hangen voor een krant, boek of spelletje.",
    aanpak:
      "Op basis van de ontwerptekeningen van de architect richtte Weststrate de horecaruimte verder in en optimaliseerde die. We creëerden een huiselijke en toegankelijke sfeer met 90 zitplekken, verdeeld over diverse opstellingen met tafels en stoelen, comfortabele fauteuils gericht op het zicht naar buiten, huiselijke zithoeken, een lange werktafel langs het raam en een centrale koffietafel die ook geschikt is voor grotere groepen en overlegmomenten.\n\nWe adviseerden in de meubilairkeuze, met uitstraling, comfort en praktisch gebruik centraal, en selecteerden de materialen op eenvoudig onderhoud. Samen met onze maatwerkpartner Meestersinhout ontwikkelden we maatwerkoplossingen, waaronder de centrale koffietafel en slimme presentatie- en opbergoplossingen voor tijdschriften en boeken. De volledige levering en montage zijn uitgevoerd door ons eigen team, wat zorgde voor een efficiënte en gecontroleerde realisatie.",
    resultaat:
      "Het vernieuwde ZB Café is nu een uitnodigende en veelzijdige ruimte, waar bezoekers zich direct op hun gemak voelen en verschillende functies samenkomen. Het platform Wij zijn De Stad krijgt er een eigen werk- en ontmoetingsplek: op een groot scherm zijn historische foto’s van Middelburg te zien, afgewisseld met actuele informatie over de stad, een plek om verhalen te delen en beeldmateriaal mee te brengen.",
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
  {
    _id: "project-adrz",
    title: "Renovatie Admiraal de Ruyter Ziekenhuis",
    slug: "admiraal-de-ruyter-ziekenhuis",
    klant: "Admiraal de Ruyter Ziekenhuis",
    sector: "Zorg",
    jaar: "",
    locatie: "Vlissingen",
    intro:
      "Het Admiraal de Ruyter Ziekenhuis in Vlissingen is getransformeerd tot een moderne kliniek voor planbare zorg, diagnostiek en dagbehandelingen. Het gebouw heeft nu twee operatiekamers, geavanceerde beeldvormende technieken en uitnodigende poliklinieken. Atelier PRO tekende voor het ontwerp van de renovatie, de gedeeltelijke nieuwbouw en het interieur, met Weststrate als projectinrichter.",
    uitdaging: "",
    aanpak:
      "In het hart van het gebouw vind je het nieuwe atrium, een lichte, groene ruimte waar je op unieke zitmeubels, de Mosselbanken, kunt wachten. Deze banken, geïnspireerd op de Zeeuwse mossel, stralen de regionale identiteit uit. Overal in het gebouw zorgen kleuren, materialen en vormen voor een sfeer die rust en comfort biedt. Het interieur ademt Zeeuws DNA: blauw van parelmoer, beige van zand en rode accenten van bloedkoraal.\n\nVan de OK-lounges met comfortabele stoelen tot patiëntenkamers met multifunctionele healing sofa's: elk detail is op maat ontworpen. De werkplekken zijn ingericht met ergonomisch meubilair van Vepa en Be by Beta, terwijl de kleedkamers voorzien zijn van praktische lockers van Ceha.",
    resultaat:
      "In nauwe samenwerking met Atelier PRO, Smit Interieurbouw en andere specialisten hebben we een compleet inrichtingsplan ontwikkeld, inclusief 3D-ontwerpen en kleuradvies. Bijzondere blikvangers zoals de Mosselbanken, uitgevoerd door Bimmel en Voerman, benadrukken de unieke identiteit van het project.",
    cijfers: [],
    image: `${WST}/ADRZ/AR_ZIEKENHUIS_003_lr.jpg`,
    images: [
      `${WST}/ADRZ/AR_ZIEKENHUIS_006_lr.jpg`,
      `${WST}/ADRZ/AR_ZIEKENHUIS_009_lr.jpg`,
      `${WST}/ADRZ/AR_ZIEKENHUIS_011_lr.jpg`,
      `${WST}/ADRZ/AR_ZIEKENHUIS_012_lr.jpg`,
      `${WST}/ADRZ/AR_ZIEKENHUIS_015_lr.jpg`,
      `${WST}/ADRZ/weststrate_adrz-1_0.jpg`,
      `${WST}/ADRZ/weststrate_adrz-23_0.jpg`,
      `${WST}/ADRZ/weststrate_adrz-45_0.jpg`,
      `${WST}/ADRZ/weststrate_adrz-53.jpg`,
    ],
    categorieen: [
      "Mosselbanken (maatwerk)",
      "Healing sofa's",
      "Lockers",
      "Ergonomische werkplekken",
    ],
  },
  {
    _id: "project-draftec",
    title: "Kantoorinrichting Draftec",
    slug: "draftec",
    klant: "Draftec",
    sector: "Zakelijke dienstverlening",
    jaar: "",
    locatie: "",
    intro:
      "Bij Draftec mochten wij meedenken met de kantoorinrichting van de receptie en de kantoortuin. De totaalinrichting van het adviesbureau is door Weststrate gerealiseerd.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/Draftec/weststrate%20drafttec%20projectinrichting.jpg`,
    images: [
      `${WST}/Draftec/weststrate_drafttec-1_0.jpg`,
      `${WST}/Draftec/weststrate_drafttec-4.jpg`,
      `${WST}/Draftec/weststrate_drafttec-6_0.jpg`,
      `${WST}/Draftec/weststrate_drafttec-7.jpg`,
      `${WST}/Draftec/weststrate_drafttec-9.jpg`,
      `${WST}/Draftec/weststrate_drafttec-10_0.jpg`,
      `${WST}/Draftec/weststrate_drafttec-11.jpg`,
    ],
    categorieen: ["Receptiebalie", "Kantoortuin", "Maatwerk"],
  },
  {
    _id: "project-archipel",
    title: "Bestuursgebouw Archipel & Onze Wijs",
    slug: "archipel-onze-wijs",
    klant: "Archipel & Onze Wijs",
    sector: "Onderwijs",
    jaar: "",
    locatie: "Vlissingen",
    intro:
      "Voor het nieuw betrokken bestuursgebouw van Scholengemeenschap Onze Wijs en Archipel in Vlissingen tekende Janine Pieters van GREENdotDESIGN het interieurontwerp. De bestuurders van beide scholengemeenschappen kozen op basis van de geselecteerde producten voor Weststrate.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/Archipel%20Onze%20Wijs/Weststrate%20Interieur%20Archipel-1.jpg`,
    images: [
      `${WST}/Archipel%20Onze%20Wijs/Weststrate%20Interieur%20Archipel-2.jpg`,
      `${WST}/Archipel%20Onze%20Wijs/Weststrate%20Interieur%20Archipel-3.jpg`,
      `${WST}/Archipel%20Onze%20Wijs/Weststrate%20Interieur%20Archipel-4.jpg`,
      `${WST}/Archipel%20Onze%20Wijs/Weststrate%20Interieur%20Archipel-6.jpg`,
    ],
    categorieen: ["Bestuursgebouw", "Werkplekken", "Maatwerk"],
  },
  {
    _id: "project-boterkapel",
    title: "Restaurant De Boterkapel",
    slug: "de-boterkapel",
    klant: "De Boterkapel",
    sector: "Horeca",
    jaar: "",
    locatie: "Domburg",
    intro:
      "De totaalinrichting van restaurant De Boterkapel is mede door bouwcoördinator Ramon Bimmel een sfeervol geheel geworden. Van de zaal tot de inrichtingsdetails dachten we mee over een prettige horecaomgeving.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/de%20Boterkapel/Weststrate%20interieur%202017-1.jpg`,
    images: [
      `${WST}/de%20Boterkapel/Weststrate%20interieur%202017-2.jpg`,
      `${WST}/de%20Boterkapel/Weststrate%20interieur%202017-3.jpg`,
      `${WST}/de%20Boterkapel/Weststrate%20interieur%202017-8.jpg`,
      `${WST}/de%20Boterkapel/Weststrate%20interieur%202017-9.jpg`,
      `${WST}/de%20Boterkapel/Weststrate%20interieur%202017-11.jpg`,
      `${WST}/de%20Boterkapel/Weststrate%20interieur%202017-12.jpg`,
    ],
    categorieen: ["Horecameubilair", "Tafels", "Maatwerk"],
  },
  {
    _id: "project-neeltje-jans",
    title: "Neeltje Jans Mosselen & Restaurant Proef Zeeland",
    slug: "neeltje-jans",
    klant: "Proef Zeeland",
    sector: "Horeca",
    jaar: "",
    locatie: "Neeltje Jans",
    intro:
      "Voor Neeltje Jans Mosselen en Restaurant Proef Zeeland verzorgde Weststrate zowel de kantoorinrichting als het restaurant. In het restaurant kwamen 108 zitplaatsen met meubilair dat tegen dagelijks gebruik kan; op kantoor acht werkplekken met hoogwaardige materialen, onder andere van Vepa.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [
      { waarde: "108", label: "zitplaatsen restaurant" },
      { waarde: "8", label: "werkplekken kantoor" },
    ],
    image: `${WST}/Neeltje%20Jans%20Mosselen/Neeltje%20Jans-10.jpg`,
    images: [
      `${WST}/Neeltje%20Jans%20Mosselen/Neeltje%20Jans-15.jpg`,
      `${WST}/Neeltje%20Jans%20Mosselen/Neeltje%20Jans-16.jpg`,
      `${WST}/Neeltje%20Jans%20Mosselen/Neeltje%20Jans-19.jpg`,
      `${WST}/Neeltje%20Jans%20Mosselen/Neeltje%20Jans-23.jpg`,
      `${WST}/Neeltje%20Jans%20Mosselen/Neeltje%20Jans-24.jpg`,
      `${WST}/Neeltje%20Jans%20Mosselen/Neeltje%20Jans-27.jpg`,
    ],
    categorieen: ["Horecameubilair", "Werkplekken", "Maatwerk"],
  },
  {
    _id: "project-rws",
    title: "Kantine RWS",
    slug: "rws",
    klant: "Rijkswaterstaat",
    sector: "Overheid",
    jaar: "",
    locatie: "",
    intro:
      "De kantine van RWS heeft een allesbehalve standaard vorm, een mooie uitdaging om in te richten. We kozen een opstelling die past bij de bijzondere ruimte en bij dagelijks gebruik.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/rws/kantoorinrichting%20weststrate-32.jpg`,
    images: [
      `${WST}/rws/kantoorinrichting%20weststrate-33.jpg`,
      `${WST}/rws/kantoorinrichting%20weststrate-36.jpg`,
      `${WST}/rws/kantoorinrichting%20weststrate-38.jpg`,
      `${WST}/rws/kantoorinrichting%20weststrate-40.jpg`,
      `${WST}/rws/kantoorinrichting%20weststrate-42.jpg`,
      `${WST}/rws/kantoorinrichting%20weststrate-44.jpg`,
    ],
    categorieen: ["Kantinestoelen", "Tafels", "Maatwerk"],
  },
  {
    _id: "project-kloosterboer",
    title: "Kloosterboer",
    slug: "kloosterboer",
    klant: "Kloosterboer",
    sector: "Logistiek",
    jaar: "",
    locatie: "",
    intro:
      "De torenkamer, kantoortuinen en receptie met ontvangstruimte van Kloosterboer zijn in fasen gerevitaliseerd. We richtten flexibele vergader- en werkplekken in die meebewegen met de manier van werken.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/Kloosterboer/Weststrate%20interieur%202017-92.jpg`,
    images: [
      `${WST}/Kloosterboer/Weststrate%20interieur%202017-73.jpg`,
      `${WST}/Kloosterboer/Weststrate%20interieur%202017-80.jpg`,
      `${WST}/Kloosterboer/Weststrate%20interieur%202017-83.jpg`,
      `${WST}/Kloosterboer/Weststrate%20interieur%202017-88.jpg`,
      `${WST}/Kloosterboer/Weststrate%20interieur%202017-91.jpg`,
      `${WST}/Kloosterboer/Weststrate%20interieur%202017-93.jpg`,
    ],
    categorieen: ["Vergadertafels", "Werkplekken", "Receptie"],
  },
  {
    _id: "project-multi",
    title: "Nieuwbouw Multi",
    slug: "multi",
    klant: "Multi",
    sector: "Zakelijke dienstverlening",
    jaar: "",
    locatie: "Vlissingen",
    intro:
      "Weststrate verzorgde een functionele werkplekinrichting volgens het Nieuwe Werken concept voor het nieuwe bedrijfspand van Multi. Van werkplekken tot overlegruimtes richtten we het hele pand in.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/Multi/kantoorinrichting%20weststrate-91.jpg`,
    images: [
      `${WST}/Multi/kantoorinrichting%20weststrate-77.jpg`,
      `${WST}/Multi/kantoorinrichting%20weststrate-80.jpg`,
      `${WST}/Multi/kantoorinrichting%20weststrate-85.jpg`,
      `${WST}/Multi/kantoorinrichting%20weststrate-88.jpg`,
      `${WST}/Multi/kantoorinrichting%20weststrate-94.jpg`,
      `${WST}/Multi/kantoorinrichting%20weststrate-97.jpg`,
    ],
    categorieen: ["Werkplekken", "Vergadertafels", "Maatwerk"],
  },
  {
    _id: "project-van-der-straaten",
    title: "Nieuwbouw Van der Straaten",
    slug: "van-der-straaten",
    klant: "Aannemingsbedrijf Van der Straaten",
    sector: "Bouw",
    jaar: "",
    locatie: "Hansweert",
    intro:
      "Aannemingsbedrijf Van der Straaten in Hansweert is een Zeeuws familiebedrijf dat al meer dan 110 jaar bestaat. Voor hun nieuwbouwlocatie met uitzicht op de Westerschelde verzorgden we een passende inrichting, van balie en vergaderruimte tot werkplekken.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/Van%20der%20Straaten/kantoorinrichting%20weststrate-106.jpg`,
    images: [
      `${WST}/Van%20der%20Straaten/Vergaderruimte%20groot.jpg`,
      `${WST}/Van%20der%20Straaten/kantoorinrichting%20weststrate-99.jpg`,
      `${WST}/Van%20der%20Straaten/kantoorinrichting%20weststrate-101.jpg`,
      `${WST}/Van%20der%20Straaten/kantoorinrichting%20weststrate-110.jpg`,
      `${WST}/Van%20der%20Straaten/kantoorinrichting%20weststrate-115.jpg`,
      `${WST}/Van%20der%20Straaten/kantoorinrichting%20weststrate-119.jpg`,
    ],
    categorieen: ["Werkplekken", "Vergaderruimte", "Balie"],
  },
  {
    _id: "project-rabobank",
    title: "Herinrichting Rabobank Vlissingen",
    slug: "rabobank-vlissingen",
    klant: "Rabobank",
    sector: "Zakelijke dienstverlening",
    jaar: "",
    locatie: "Vlissingen",
    intro:
      "Voor de locatie Vlissingen was de Rabobank op zoek naar een herinrichting van het interieur. We vernieuwden de bestaande ruimtes met aandacht voor de uitstraling en het dagelijks gebruik.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/Rabobank/kantoorinrichting%20weststrate-8.jpg`,
    images: [
      `${WST}/Rabobank/kantoorinrichting%20weststrate-5.jpg`,
      `${WST}/Rabobank/kantoorinrichting%20weststrate-7.jpg`,
      `${WST}/Rabobank/kantoorinrichting%20weststrate-10.jpg`,
      `${WST}/Rabobank/kantoorinrichting%20weststrate-13.jpg`,
      `${WST}/Rabobank/kantoorinrichting%20weststrate-15.jpg`,
      `${WST}/Rabobank/kantoorinrichting%20weststrate-17.jpg`,
    ],
    categorieen: ["Werkplekken", "Vergaderruimte", "Maatwerk"],
  },
  {
    _id: "project-gemeente-veere",
    title: "Herinrichting Gemeente Veere",
    slug: "gemeente-veere",
    klant: "Gemeente Veere",
    sector: "Overheid",
    jaar: "",
    locatie: "Veere",
    intro:
      "Voor de Gemeente Veere verzorgde Weststrate de herinrichting van het kantoor, inclusief meubilair en bijpassende belettering. We vernieuwden de werkplekken en de publieksruimte met oog voor de uitstraling van de gemeente.",
    uitdaging: "",
    aanpak: "",
    resultaat: "",
    cijfers: [],
    image: `${WST}/Gemeente%20Veere/Gemeente%20Veere%20interieur.jpg`,
    images: [
      `${WST}/Gemeente%20Veere/1.jpg`,
      `${WST}/Gemeente%20Veere/4.jpg`,
      `${WST}/Gemeente%20Veere/kantoorinrichting-weststrate-61_0kantoormeubelen-gemeente-veere.jpg`,
      `${WST}/Gemeente%20Veere/kantoorinrichting-weststrate-66kantoormeubelen-gemeente-veere.jpg`,
      `${WST}/Gemeente%20Veere/kantoorinrichting-weststrate-70_0kantoormeubelen-gemeente-veere.jpg`,
      `${WST}/Gemeente%20Veere/kantoorinrichting-weststrate-74_0kantoormeubelen-gemeente-veere.jpg`,
    ],
    categorieen: ["Werkplekken", "Belettering", "Maatwerk"],
  },
  {
    _id: "project-showroom",
    title: "Onze meubilairshowroom in Middelburg",
    slug: "weststrate-showroom",
    klant: "Weststrate",
    sector: "Showroom",
    jaar: "",
    locatie: "Middelburg",
    intro:
      "Sinds september 2024 heeft Weststrate een eigen meubilairshowroom aan de Herculesweg 37 in Middelburg. Elk thema heeft er een eigen plek: van kantoorinrichting en soft seating tot akoestiek, ergonomie en sanitair. En alles wat je ziet is te koop, tot de stoelen van de directie aan toe.",
    uitdaging: "",
    aanpak:
      "De showroom laat de mogelijkheden zien op het gebied van kantoorinrichting, soft seating, akoestiek, ergonomische zitoplossingen, kabelmanagement en sanitair. Er is een carpet waar je verschillende zit-sta krukken uitprobeert, een grote stoelenwand met bureau- en conferentiestoelen om in te zitten, en een akoestische vergaderunit van Vox in opvallende kleuren. Op een ruime stalenwand vind je een uitgebreide collectie kleur-, stof- en materiaalstalen.\n\nEen groot deel van de inrichting bestaat uit maatwerk banken en kasten, gemaakt met onze partners Meesters in Hout en Davant. De akoestische panelen op de buitenwand van de bioscoop zijn ontworpen door designer Marit Priemis, met een patroon dat geen snijafval geeft. Samen met Vepa en Kloeber staat er een eiland met stoelen van gerecycled PET-vilt.",
    resultaat:
      "Midden in de showroom staat een bistro met een bijna levensechte boom, voor een lunch of koffie met collega's en klanten, en meteen het bewijs dat we ook buitenmeubilair leveren. Boven de kantoren ligt een vide met een echte bioscoopzaal, een garderobe met lockers en een complete sanitaire ruimte met WEPA en Tork. Memorabilia uit 90 jaar Weststrate, van oude typemachines tot een beschilderde deur als tijdschriftenrek, geven de ruimte karakter. De kantoren, flexplekken, vergaderruimtes en bistro worden dagelijks gebruikt, zo zie je alles in het echt werken. Je bent van harte welkom om langs te komen.",
    cijfers: [],
    image: `${SHOW}103.jpg`,
    images: [
      `${SHOW}247.jpg`,
      `${SHOW}392.jpg`,
      `${SHOW}308.jpg`,
      `${SHOW}344.jpg`,
      `${SHOW}273.jpg`,
      `${SHOW}405.jpg`,
      `${SHOW}163.jpg`,
      `${SHOW}386.jpg`,
      `${SHOW}409.jpg`,
      `${SHOW}120.jpg`,
      `${SHOW}328.jpg`,
      `${SHOW}418.jpg`,
    ],
    categorieen: [
      "Kantoorinrichting",
      "Soft seating",
      "Akoestiek",
      "Sanitair",
      "Maatwerk",
    ],
  },
];

// ── Blog / inspiratie ────────────────────────────────────────
// De nieuwere artikelen zijn opgebouwd volgens AEO/GEO/SEO-principes:
// vraagvormige tussenkoppen ("## "), het antwoord direct in de eerste
// alinea, citeerbare cijfers en normen, en een faq-array die als
// FAQPage structured data wordt meegegeven.
export const MOCK_POSTS: BlogPost[] = [
  {
    _id: "mock-post-7",
    title: "Hoeveel vierkante meter heb je nodig per werkplek?",
    slug: "vierkante-meters-per-werkplek",
    datum: "2026-06-10",
    thema: "Inrichting",
    leestijd: 6,
    samenvatting:
      "Reken op 6 tot 7 m² per vaste werkplek, exclusief gangpaden en vergaderruimte. Zo kom je aan dat getal en zo reken je het door voor jouw pand.",
    body:
      "Voor een vaste kantoorwerkplek met beeldscherm reken je op 6 tot 7 vierkante meter per persoon. Dat getal komt uit NEN 1824, de Nederlandse norm voor de oppervlakte van kantoorwerkplekken. Gangpaden, vergaderruimtes en een pantry tellen daar niet in mee, die komen er nog bovenop. Wie een pand zoekt of een verdieping opnieuw indeelt, rekent dus beter met het totaalplaatje dan met alleen het aantal bureaus.\n\n## Hoe is die 6 tot 7 m² opgebouwd?\n\nNEN 1824 werkt met een optelsom per werkplek. De basis is 4 m² voor de werkplek zelf, met de ruimte om je stoel naar achteren te schuiven en op te staan. Daar komt 1 m² bij voor een werkplek met flatscreen en nog eens 1 m² als er ook een lees- en schrijfvlak nodig is. Voor een gangbare bureauopstelling kom je zo op 6 m², en met een kast of ladeblok binnen handbereik al snel op 7 m². De norm is een richtlijn en geen wet, maar arbodiensten en ondernemingsraden gebruiken hem als toetssteen.\n\n## Wat komt er bovenop de werkplekken?\n\nDe werkplekken zijn maar een deel van de vloer. Reken daarnaast op circa 2 m² per persoon voor vergader- en overlegruimte, en houd rekening met looppaden van minimaal 1,2 meter breed tussen werkplekrijen. Een pantry, garderobe, lockers en printhoek vragen samen ook nog ruimte. In de praktijk kom je daardoor op 10 tot 14 m² bruto vloeroppervlak per medewerker, afhankelijk van hoeveel overlegruimte je organisatie nodig heeft.\n\n## Rekenvoorbeeld: 12 mensen op één verdieping\n\nStel, je wilt 12 vaste werkplekken inrichten. De werkplekken zelf vragen 12 keer 7 is 84 m². Tel daar 24 m² overlegruimte bij op (2 m² per persoon, bijvoorbeeld één vergaderruimte voor acht en een belplek), plus zo'n 25 procent voor looppaden en voorzieningen. Dan zit je rond de 135 m². Past dat niet, dan is flexwerken de knop waar je aan kunt draaien: bij gedeeltelijk thuiswerken kun je vaak met 7 of 8 bureaus voor 12 mensen toe, mits je de afspraken daarover goed regelt.\n\n## Werkt dit ook voor flexplekken?\n\nVoor flexplekken gelden dezelfde maten per plek, je hebt er alleen minder van nodig. De winst zit in de verhouding tussen mensen en plekken, niet in kleinere bureaus. Let wel op de randvoorwaarden: voldoende lockers zodat spullen een vaste plek hebben, en genoeg uitwijkplekken zoals aanlandplekken en stilteruimtes. Een flexkantoor dat alleen uit minder bureaus bestaat, loopt op drukke dagen direct vast.\n\nTwijfel je hoeveel werkplekken er in jouw ruimte passen? Wij meten op locatie en maken een indelingsvoorstel op schaal, inclusief looppaden en overlegruimte.",
    image: "/beelden/blog-vierkante-meters.png",
    faq: [
      {
        vraag: "Is een minimum aantal vierkante meters wettelijk verplicht?",
        antwoord:
          "Het Arbobesluit eist voldoende bewegingsruimte op de werkplek, maar noemt geen hard getal. NEN 1824 vult dat in met circa 6 tot 7 m² per vaste beeldschermwerkplek en wordt door arbodiensten als richtlijn gebruikt.",
      },
      {
        vraag: "Hoeveel vierkante meter vergaderruimte heb ik nodig?",
        antwoord:
          "Reken op circa 2 m² per persoon die aan het overleg deelneemt. Een vergaderruimte voor acht personen komt daarmee op zo'n 16 tot 20 m², inclusief ruimte om achter de stoelen langs te lopen.",
      },
      {
        vraag: "Hoeveel werkplekken passen er in 100 m²?",
        antwoord:
          "In 100 m² kantoorvloer passen realistisch 8 tot 10 vaste werkplekken, als je naast de 6 tot 7 m² per werkplek ook looppaden en een overlegplek meerekent. Met flexwerken bedien je met die plekken vaak 12 tot 15 medewerkers.",
      },
    ],
  },
  {
    _id: "mock-post-6",
    title: "Waar moet een goede bureaustoel aan voldoen?",
    slug: "waar-moet-een-goede-bureaustoel-aan-voldoen",
    datum: "2026-05-28",
    thema: "Ergonomie",
    leestijd: 5,
    samenvatting:
      "Een goede bureaustoel voldoet aan NEN-EN 1335 en heeft vier instelpunten: zithoogte, zitdiepte, armleggers en lendensteun. Dit is waar je op let.",
    body:
      "Een goede bureaustoel voldoet aan de Europese norm NEN-EN 1335 en heeft minimaal vier instelpunten: zithoogte, zitdiepte, armleggers en lendensteun. Wie meer dan twee uur per dag aan een bureau zit, merkt het verschil tussen een stoel die op die punten instelbaar is en een stoel die dat niet is. Niet meteen, maar wel na een paar weken, in de onderrug, de nek en de schouders.\n\n## Wat zegt NEN-EN 1335 precies?\n\nNEN-EN 1335 is de Europese norm voor kantoorstoelen. De norm stelt eisen aan de maten en het instelbereik van de stoel, zodat hij past bij het grootste deel van de gebruikers. Een stoel die aan de norm voldoet heeft onder meer een zithoogte die instelbaar is tussen circa 40 en 51 cm en een rugleuning die de onderrug ondersteunt. Voor zakelijk gebruik is de norm de ondergrens: arbodiensten toetsen eraan en bij beeldschermwerk van meer dan twee uur per dag mag je werkgever er eigenlijk niet onder gaan zitten.\n\n## Welke instelpunten doen er het meest toe?\n\nVier instelpunten bepalen het grootste deel van het zitcomfort. De zithoogte zorgt dat je voeten plat op de vloer staan met de knieën in een hoek van ongeveer 90 graden. De zitdiepte zorgt voor twee tot drie vingers ruimte tussen de voorkant van de zitting en je knieholte. De armleggers ondersteunen je onderarmen op ellebooghoogte, zodat je schouders ontspannen blijven. En de lendensteun vult de holte van je onderrug, op de plek waar die zit en niet een paar centimeter erboven of eronder. Een wipmechaniek met instelbare tegendruk is een waardevolle vijfde: een stoel die meebeweegt houdt je rug actief.\n\n## Hoe stel je een bureaustoel goed in?\n\nDe beste stoel zit verkeerd als hij niet is ingesteld. Begin bij de zithoogte: voeten plat, knieën rond 90 graden. Stel daarna de zitdiepte in, dan de lendensteun op de holte van je onderrug, en als laatste de armleggers op de hoogte van je ellebogen. Check daarna of je bureaublad op dezelfde hoogte zit als de armleggers. In de praktijk zien we dat het merendeel van de stoelen op een kantoor nooit is aangepast aan de gebruiker, terwijl dat vijf minuten werk is.\n\n## Wanneer is een bureaustoel aan vervanging toe?\n\nBij dagelijks gebruik gaat een goede bureaustoel 7 tot 10 jaar mee. Eerder vervangen is verstandig als het gasveer-mechanisme zakt, de schuimvulling van de zitting is doorgezeten of instelmechanismen niet meer vastzitten in hun stand. Een stoel die zijn instelling niet meer vasthoudt, is feitelijk geen instelbare stoel meer.\n\nWil je stoelen eerst proberen? In onze showroom in Middelburg zit je op de modellen uit het snelleverprogramma en stellen we ze direct voor je in.",
    image: "/beelden/blog-bureaustoel.png",
    faq: [
      {
        vraag: "Hoe lang gaat een bureaustoel mee?",
        antwoord:
          "Bij dagelijks gebruik van zes tot acht uur gaat een goede bureaustoel 7 tot 10 jaar mee. Zakt de gasveer, is de zitting doorgezeten of houden de instelmechanismen hun stand niet meer vast, dan is hij aan vervanging toe.",
      },
      {
        vraag: "Heb ik een hoofdsteun nodig op mijn bureaustoel?",
        antwoord:
          "Voor de meeste mensen niet. Bij actief beeldschermwerk raakt je hoofd de steun zelden. Een hoofdsteun is vooral zinvol bij nekklachten of als je regelmatig achterover geleund belt of leest.",
      },
      {
        vraag: "Wat is het verschil tussen een bureaustoel en een vergaderstoel?",
        antwoord:
          "Een bureaustoel is gemaakt voor uren achtereen zitten en is daarom instelbaar op zithoogte, zitdiepte, armleggers en lendensteun. Een vergaderstoel is bedoeld voor kortere sessies en heeft die instelpunten meestal niet.",
      },
      {
        vraag: "Welke zithoogte is goed?",
        antwoord:
          "De juiste zithoogte is bereikt als je voeten plat op de vloer staan en je knieën een hoek van ongeveer 90 graden maken. Voor de meeste mensen ligt dat tussen 42 en 50 cm, binnen het instelbereik dat NEN-EN 1335 voorschrijft.",
      },
    ],
  },
  {
    _id: "mock-post-5",
    title: "Opbergen op kantoor: lockers, kasten en wat clean desk echt vraagt",
    slug: "opbergen-op-kantoor",
    datum: "2026-04-21",
    thema: "Inrichting",
    leestijd: 4,
    samenvatting:
      "Clean desk mislukt zelden door de mensen en vaak door te weinig opbergruimte. Zo bepaal je wat je nodig hebt aan lockers en kasten.",
    body:
      "Een opgeruimd kantoor begint niet bij een clean desk-regel, maar bij voldoende plekken om spullen op te bergen. Reken per medewerker op een eigen lockervak en daarnaast op een halve tot een hele meter kastruimte per persoon voor teamspullen. Is dat er niet, dan belandt alles alsnog op bureaus en vensterbanken, hoe streng de afspraak ook is.\n\n## Waarom mislukt clean desk zo vaak?\n\nClean desk mislukt meestal om een simpele reden: spullen hebben geen alternatieve plek. Een medewerker met een laptop, oplader, headset, notitieblok en een ordner ruimt die alleen op als daar een vak voor is dat dichtbij, afsluitbaar en groot genoeg is. De volgorde is dus eerst de opbergruimte regelen, dan pas de afspraak invoeren. Andersom werkt het niet.\n\n## Lockers of teamkasten: wat kies je?\n\nLockers en kasten lossen verschillende problemen op. Een locker is persoonlijk: één afsluitbaar vak per medewerker voor laptop, tas en persoonlijke spullen. Bij flexwerken zijn lockers feitelijk onmisbaar, want zonder vaste werkplek is er geen vaste la. Teamkasten zijn gedeeld: ordners, voorraad, apparatuur en alles wat van het team is in plaats van van één persoon. De meeste kantoren hebben beide nodig, in een verhouding die afhangt van hoeveel papier en materiaal het werk nog vraagt.\n\n## Kunnen kasten ook de ruimte indelen?\n\nJa, en dat is meteen het tweede argument om er niet op te besparen. Een kast van 160 cm hoog scheidt twee teams zonder de vloer dicht te bouwen, en een rij lockers markeert de overgang van een looproute naar een werkzone. Gestoffeerde of akoestische kastwanden dempen bovendien het geluid tussen zones. Zo doet de opbergruimte dubbel werk: spullen uit het zicht en rust in de plattegrond.\n\n## Hoeveel opbergruimte heb je per persoon nodig?\n\nAls vuistregel: één lockervak per medewerker van minimaal 45 cm breed waar een 15,6 inch laptop en een tas in passen, plus een halve tot een hele meter kastbreedte per persoon voor het team samen. Werk je in een vak met veel fysiek materiaal, zoals techniek of zorg, reken dan ruimer. Tel het na een jaar na: puilen de kasten uit of staan er dozen op de grond, dan was de schatting te krap.\n\nWil je weten wat er in jouw plattegrond past? We denken mee over een indeling waarin opbergen, akoestiek en looproutes samenvallen.",
    image: "/beelden/blog-opbergen.png",
    faq: [
      {
        vraag: "Hoeveel lockers heb ik nodig bij flexwerken?",
        antwoord:
          "Eén lockervak per medewerker, ook als er minder bureaus dan mensen zijn. De locker vervangt de vaste la van de vaste werkplek, dus daarop bezuinigen ondergraaft het flexconcept.",
      },
      {
        vraag: "Welke kasthoogte kan ik als ruimteverdeler gebruiken?",
        antwoord:
          "Een kast van 120 tot 160 cm hoog scheidt zones terwijl je er overheen blijft kijken, wat het kantoor open houdt. Boven de 180 cm werkt een kast als een wand en deel je de ruimte echt op.",
      },
      {
        vraag: "Hoe groot moet een lockervak zijn?",
        antwoord:
          "Minimaal 45 cm breed en 30 cm hoog, zodat een 15,6 inch laptop, een oplader en een tas erin passen. Komen er ook jassen of helmen in, kies dan hogere vakken of een aparte garderobekast.",
      },
    ],
  },
  {
    _id: "mock-post-4",
    title: "Tafelhoogtes en tafelmaten: de cijfers waar je op kunt rekenen",
    slug: "tafelhoogtes-en-maten",
    datum: "2026-03-15",
    thema: "Inrichting",
    leestijd: 5,
    samenvatting:
      "Bureau en vergadertafel: 75 cm hoog. Statafel: circa 110 cm. En per persoon reken je 60 tot 70 cm tafelbreedte. Alle maten op een rij.",
    body:
      "De standaardhoogte van een bureau en een vergadertafel is 75 cm, een statafel staat op circa 110 cm en per persoon aan tafel reken je 60 tot 70 cm breedte. Met die drie getallen kom je bij het inrichten van een kantoor al een heel eind. Hieronder lopen we de maten langs die je nodig hebt om tafels te kiezen die kloppen met de ruimte en met de mensen die eraan zitten.\n\n## Welke hoogte heeft een bureau of vergadertafel?\n\nDe vaste standaard is 75 cm, gerekend vanaf de vloer tot de bovenkant van het blad. Die hoogte past bij een gemiddelde lichaamslengte in combinatie met een goed ingestelde bureaustoel. Zijn de gebruikers duidelijk langer of korter, dan lost een in hoogte instelbaar onderstel dat op: veel bureauframes zijn instelbaar tussen 62 en 86 cm, en zit-sta frames gaan door tot zo'n 125 cm. Voor een vergadertafel die door wisselende groepen wordt gebruikt, blijft 75 cm de veilige keuze.\n\n## Hoeveel tafelruimte heeft één persoon nodig?\n\nReken op 60 tot 70 cm tafelbreedte per persoon, met 70 cm als comfortabele maat zodra er laptops op tafel staan. De diepte van het blad bepaalt of mensen elkaar recht aankijken zonder schermen tegen elkaar: 120 cm diepte is voor een vergadertafel een prettige maat, bij 100 cm wordt het krap zodra beide kanten een laptop opengeklapt hebben.\n\n## Welk formaat vergadertafel past bij hoeveel personen?\n\nMet de maat van 60 tot 70 cm per persoon reken je het zo uit: een tafel van 240 bij 120 cm zit goed voor acht personen, drie aan elke lange zijde en één aan elk uiteinde. Voor zes personen volstaat 200 bij 100 cm, voor tien tot twaalf ga je naar 320 bij 120 cm of koppel je twee tafels. Houd daarnaast minimaal 90 cm vrij tussen tafelrand en muur, zodat iemand achter een bezette stoel langs kan, en liever 120 cm aan de kant waar de deur of het scherm zit.\n\n## Wanneer kies je een statafel?\n\nEen statafel van circa 110 cm hoog is op zijn best bij kort overleg: een dagstart, een stand-up of een overleg dat niet langer dan een half uur hoeft te duren. Staand overleg blijkt in de praktijk korter en doelgerichter, alleen al omdat niemand achterover gaat hangen. Combineer de statafel met krukken op zithoogte 80 tot 85 cm, dan kan wie wil toch even zitten zonder dat de tafel zijn functie verliest.\n\nWil je zeker weten dat een tafel in je ruimte past voordat je bestelt? Stuur ons de maten van de ruimte en we tekenen de opstelling voor je uit.",
    image: "/beelden/blog-tafelhoogtes.png",
    faq: [
      {
        vraag: "Hoe hoog is een statafel?",
        antwoord:
          "Een statafel is circa 110 cm hoog, passend bij staand overleg en bij krukken met een zithoogte van 80 tot 85 cm. Sommige modellen zijn instelbaar, zodat dezelfde tafel ook op 75 cm als zittafel dient.",
      },
      {
        vraag: "Welke tafelmaat heb ik nodig voor 8 personen?",
        antwoord:
          "Voor acht personen is 240 bij 120 cm een passende vergadertafel: drie personen aan elke lange zijde en één aan elk uiteinde, met 60 tot 70 cm tafelbreedte per persoon.",
      },
      {
        vraag: "Hoe hoog is een kantinetafel?",
        antwoord:
          "Een gewone kantinetafel is net als een bureau 75 cm hoog. In kantines zie je daarnaast vaak hoge tafels van circa 110 cm met barkrukken, die de ruimte ook geschikt maken voor staand en informeel overleg.",
      },
    ],
  },
  {
    _id: "mock-post-1",
    title: "Zit-sta werken: wat levert het echt op?",
    slug: "zit-sta-werken-wat-levert-het-op",
    datum: "2026-05-12",
    thema: "Ergonomie",
    leestijd: 4,
    samenvatting:
      "Een zit-sta bureau is meer dan een trend. We zetten de feiten op een rij en geven je houvast bij de keuze.",
    body: "Wie de hele dag zit, voelt dat aan het eind van de dag. Een zit-sta bureau laat je wisselen tussen zitten en staan, zodat je houding niet de hele dag hetzelfde blijft. Dat klinkt simpel, en dat is het ook, mits je het bureau echt gebruikt.\n\nDe winst zit niet in het apparaat, maar in het ritme. Onderzoek wijst steeds dezelfde kant op: afwisseling tussen zitten en staan vermindert klachten in de onderrug en nek. Een veelgebruikt advies is om elk half uur van houding te wisselen.\n\nLet bij de keuze op drie dingen: de bediening, het hoogtebereik en de stabiliteit. Een geheugenbediening met vaste standen zorgt dat je daadwerkelijk wisselt, je drukt één knop. Een hoogtebereik vanaf 65 cm past ook kortere collega's. En een frame dat bij stahoogte niet wiebelt, gebruik je met meer plezier.\n\nWil je weten welk bureau past bij jullie werkplekken? Onze specialisten denken mee.",
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
    body: "Open kantoren zijn populair omdat ze samenwerking makkelijker maken. De keerzijde is geluid: telefoongesprekken, overleg en het getik van toetsenborden lopen door elkaar. Volledig dichtbouwen met wanden is zelden de oplossing, dan verlies je juist de openheid die je wilde.\n\nDe sleutel zit in zachte materialen en slimme indeling. Akoestische panelen aan wand of plafond vangen geluid op voor het terugkaatst. Een vergaderruimte of belplek vangt de gesprekken op die anders de hele vloer over gaan.\n\nOok meubilair helpt. Hoge kasten en stoffering breken geluid. Door drukke en stille zones bewust te scheiden in de plattegrond, geef je iedere taak zijn eigen plek.\n\nWij kijken bij een inrichting standaard naar de akoestiek mee. Niet als losse post, maar als onderdeel van het geheel.",
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
    body: "Sinds overleg deels online gebeurt, stelt een vergaderruimte andere eisen. De mensen op afstand moeten net zo goed meedoen als de mensen in de ruimte. Dat begint bij de tafel.\n\nKies een tafel met ingebouwde stroom- en datapunten, zodat laptops aangesloten blijven zonder kabels over de vloer. Zorg dat iedereen aan tafel in beeld komt voor de camera, een te lange, smalle tafel werkt daar tegen.\n\nDenk ook aan de stoelen. Bij hybride overleg zit je vaak langer dan vroeger, omdat schermdelen en online rondjes tijd kosten. Stoelen die een uur prettig blijven, maken het verschil.\n\nWil je je overlegruimtes klaarmaken voor hybride werken? Bekijk onze vergadertafels of vraag een advies aan.",
    image: "/beelden/project-vergaderruimte.png",
  },
];
