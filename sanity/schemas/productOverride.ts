import { defineField, defineType } from "sanity";

// Productbeheer: per Swan-product kun je hier bijsturen zonder dat de
// Swan-data zelf verandert. De site leest deze overrides bovenop de
// JSON-catalogus (data/swan-catalogus.json e.a.):
//   - offline aan  -> product verdwijnt uit catalogus, zoeken en samensteller
//   - prijs-regel  -> vervangt de Swan-prijs van die ene uitvoering
// Geen overrides ingevuld = de Swan-data geldt ongewijzigd.
export default defineType({
  name: "productOverride",
  title: "Productbeheer",
  type: "document",
  fields: [
    defineField({
      name: "naam",
      title: "Product",
      type: "string",
      readOnly: true,
      description: "Komt uit de Swan-data; hier niet aanpasbaar.",
    }),
    defineField({
      name: "productSlug",
      title: "Koppeling (product-slug)",
      type: "string",
      readOnly: true,
      description:
        "Technische koppeling met het Swan-product. Niet wijzigen — " +
        "anders raakt de override losgekoppeld van het product.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "offline",
      title: "Offline halen",
      type: "boolean",
      initialValue: false,
      description:
        "Aan = product is nergens meer zichtbaar op de site " +
        "(bv. bij geen voorraad). Uit = product staat gewoon online.",
    }),
    defineField({
      name: "prijzen",
      title: "Prijsaanpassingen",
      type: "array",
      description:
        "Alleen toevoegen wat moet afwijken van de Swan-prijs. Per regel: " +
        "het artikelnummer van de uitvoering + de nieuwe prijs (excl. btw). " +
        "Regel verwijderen = terug naar de Swan-prijs.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "articleNumber",
              title: "Artikelnummer",
              type: "string",
              validation: (r) => r.required(),
            },
            {
              name: "prijs",
              title: "Nieuwe prijs (€, excl. btw)",
              type: "number",
              validation: (r) => r.required().min(0),
            },
          ],
          preview: {
            select: { title: "articleNumber", subtitle: "prijs" },
            prepare({ title, subtitle }) {
              return { title, subtitle: `€ ${subtitle ?? "?"}` };
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Naam A-Z",
      name: "naamAsc",
      by: [{ field: "naam", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "naam", offline: "offline", prijzen: "prijzen" },
    prepare({ title, offline, prijzen }) {
      const n = Array.isArray(prijzen) ? prijzen.length : 0;
      const delen: string[] = [];
      if (offline) delen.push("🔴 OFFLINE");
      if (n > 0) delen.push(`${n} prijsaanpassing${n === 1 ? "" : "en"}`);
      return {
        title,
        subtitle: delen.length > 0 ? delen.join(" · ") : "Swan-data ongewijzigd",
      };
    },
  },
});
