import { defineField, defineType } from "sanity";

// Singleton met algemene site-instellingen en bedrijfsgegevens.
export default defineType({
  name: "settings",
  title: "Site-instellingen",
  type: "document",
  fields: [
    defineField({
      name: "bedrijfsnaam",
      title: "Bedrijfsnaam",
      type: "string",
      initialValue: "Weststrate Meubilair",
    }),
    defineField({
      name: "payoff",
      title: "Pay-off",
      type: "string",
      initialValue: "De veelzijdige specialist",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Upload het Weststrate-logo (SVG of PNG met transparante achtergrond).",
    }),
    defineField({
      name: "overOns",
      title: "Over ons (tekst)",
      type: "text",
      rows: 5,
    }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "telefoon", title: "Telefoon", type: "string" }),
    defineField({ name: "adres", title: "Adres", type: "text", rows: 2 }),
    defineField({
      name: "footerTekst",
      title: "Footer / voorwaarden",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site-instellingen" };
    },
  },
});
