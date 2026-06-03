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
