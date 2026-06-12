import { groq } from "next-sanity";

// Site-instellingen (singleton).
export const SITE_SETTINGS = groq`
  *[_type == "settings"][0] {
    bedrijfsnaam,
    payoff,
    overOns,
    email,
    telefoon,
    adres,
    footerTekst
  }
`;

// Homepage-teksten (singleton). Velden spiegelen HomepageContent in lib/types.ts.
export const HOMEPAGE_CONTENT = groq`
  *[_type == "homepage"][0] {
    hero { kicker, titel, introMobiel, introDesktop, knopProjecten, knopCatalogus },
    watWeDoen { kicker, titel, intro, blokken[]{ titel, tekst } },
    branchesSectie { kicker, titel, intro },
    projectenSectie { kicker, titel },
    assortimentSectie { kicker, titel, intro },
    werkplekCta { kicker, titel, tekst, knop },
    opdrachtgeversTitel,
    blogSectie { kicker, titel }
  }
`;

// Alle referentieprojecten (handmatige volgorde).
const PROJECT_VELDEN = groq`
  "_id": _id,
  title,
  "slug": slug.current,
  klant,
  sector,
  jaar,
  locatie,
  intro,
  uitdaging,
  aanpak,
  resultaat,
  cijfers[]{ waarde, label },
  "image": image.asset->url,
  "images": images[].asset->url,
  categorieen
`;

export const ALLE_PROJECTEN = groq`
  *[_type == "project"] | order(orderRank asc) { ${PROJECT_VELDEN} }
`;

export const PROJECT_OP_SLUG = groq`
  *[_type == "project" && slug.current == $slug][0] { ${PROJECT_VELDEN} }
`;

// Blogartikelen (nieuwste eerst). De body komt als ruwe Portable Text
// (block-array) binnen; lib/data.ts zet die om naar het platte tekstformaat
// dat de blogpagina rendert (alinea's met \n\n ertussen, "## " = tussenkop).
const POST_VELDEN = groq`
  "_id": _id,
  title,
  "slug": slug.current,
  "datum": datum,
  thema,
  leestijd,
  samenvatting,
  body,
  "image": image.asset->url,
  faq[]{ vraag, antwoord }
`;

export const ALLE_POSTS = groq`
  *[_type == "post"] | order(datum desc) { ${POST_VELDEN} }
`;

export const POST_OP_SLUG = groq`
  *[_type == "post" && slug.current == $slug][0] { ${POST_VELDEN} }
`;

// Product-overrides (Productbeheer): de bijstuur-laag bovenop de Swan-data.
// We halen alleen documenten op die echt iets overschrijven (offline of een
// prijs) — voor de rest geldt de Swan-catalogus ongewijzigd.
export const ALLE_PRODUCT_OVERRIDES = groq`
  *[_type == "productOverride" && (offline == true || count(prijzen) > 0)] {
    productSlug,
    offline,
    prijzen[]{ articleNumber, prijs }
  }
`;
