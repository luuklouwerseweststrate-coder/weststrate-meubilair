import { groq } from "next-sanity";

// Alle producten, gesorteerd op handmatige volgorde (orderRank) per categorie.
export const ALLE_PRODUCTEN = groq`
  *[_type == "product"] | order(orderRank asc) {
    "_id": _id,
    name,
    "slug": slug.current,
    articleNumber,
    category,
    shortDescription,
    "description": pt::text(description),
    basePrice,
    "images": images[].asset->url,
    specs[]{ label, value },
    optionGroups[]{
      label,
      required,
      choices[]{ label, priceDelta }
    }
  }
`;

// Eén product op slug.
export const PRODUCT_OP_SLUG = groq`
  *[_type == "product" && slug.current == $slug][0] {
    "_id": _id,
    name,
    "slug": slug.current,
    articleNumber,
    category,
    shortDescription,
    "description": pt::text(description),
    basePrice,
    "images": images[].asset->url,
    specs[]{ label, value },
    optionGroups[]{
      label,
      required,
      choices[]{ label, priceDelta }
    }
  }
`;

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
  categorieen
`;

export const ALLE_PROJECTEN = groq`
  *[_type == "project"] | order(orderRank asc) { ${PROJECT_VELDEN} }
`;

export const PROJECT_OP_SLUG = groq`
  *[_type == "project" && slug.current == $slug][0] { ${PROJECT_VELDEN} }
`;

// Blogartikelen (nieuwste eerst).
const POST_VELDEN = groq`
  "_id": _id,
  title,
  "slug": slug.current,
  "datum": datum,
  thema,
  leestijd,
  samenvatting,
  "body": pt::text(body),
  "image": image.asset->url
`;

export const ALLE_POSTS = groq`
  *[_type == "post"] | order(datum desc) { ${POST_VELDEN} }
`;

export const POST_OP_SLUG = groq`
  *[_type == "post" && slug.current == $slug][0] { ${POST_VELDEN} }
`;
