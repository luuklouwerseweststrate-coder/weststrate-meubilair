// Centrale SEO-helpers. Eén bron voor de basis-URL van de site en voor de
// gestructureerde data (JSON-LD), zodat metadata, sitemap, robots en de
// structured-data overal exact hetzelfde gebruiken.

// Productie-URL. Op Vercel zit de stabiele domeinnaam in
// VERCEL_PROJECT_PRODUCTION_URL; koppel je een eigen domein, zet dan
// NEXT_PUBLIC_SITE_URL. Lokaal valt het terug op localhost.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

// Vaste bedrijfsgegevens. Telefoon bewust leeg: er staat nog een
// placeholdernummer in de data, dus dat zetten we niet in de structured data.
export const BEDRIJF = {
  naam: "Weststrate",
  merk: "Weststrate Meubilair",
  straat: "Herculesweg 37",
  plaats: "Middelburg",
  regio: "Zeeland",
  land: "NL",
};

const STANDAARD_OMSCHRIJVING =
  "Weststrate richt complete ruimtes in: van één ergonomische stoel tot de inrichting van een heel pand. Advies, levering en montage uit één hand.";

// Organisatie/vestiging als JSON-LD. FurnitureStore erft van LocalBusiness, dus
// Google kan hier het adres van de showroom in Middelburg aan koppelen.
export function organisatieJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${siteUrl}/#organisatie`,
    name: BEDRIJF.naam,
    alternateName: BEDRIJF.merk,
    url: siteUrl,
    image: `${siteUrl}/beelden/hero-kantoor.png`,
    description: STANDAARD_OMSCHRIJVING,
    address: {
      "@type": "PostalAddress",
      streetAddress: BEDRIJF.straat,
      addressLocality: BEDRIJF.plaats,
      addressRegion: BEDRIJF.regio,
      addressCountry: BEDRIJF.land,
    },
    areaServed: { "@type": "Country", name: "Nederland" },
  };
}

// Kleine helper om een JSON-LD-object veilig in een <script> te zetten.
export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
