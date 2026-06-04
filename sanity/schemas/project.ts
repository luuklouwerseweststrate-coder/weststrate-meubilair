import { defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

// Een uitgevoerd referentieproject: laat zien wat Weststrate inricht.
export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "project" }),
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "klant", title: "Klant", type: "string" }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      description: "Bv. Overheid, Zorg, Horeca, Onderwijs.",
    }),
    defineField({ name: "jaar", title: "Jaar", type: "string" }),
    defineField({ name: "locatie", title: "Locatie", type: "string" }),
    defineField({
      name: "intro",
      title: "Intro (op de kaart)",
      type: "text",
      rows: 2,
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "uitdaging",
      title: "De uitdaging",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "aanpak", title: "Onze aanpak", type: "text", rows: 3 }),
    defineField({
      name: "resultaat",
      title: "Het resultaat",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "cijfers",
      title: "Kerncijfers",
      type: "array",
      description: "Cijfers i.p.v. superlatieven (brandbook). Toon er 2-3.",
      of: [
        {
          type: "object",
          fields: [
            { name: "waarde", title: "Waarde", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
          preview: { select: { title: "waarde", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Hoofdbeeld",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "categorieen",
      title: "Gebruikte categorieën",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Bureaustoelen", value: "Bureaustoelen" },
          { title: "Bureaus", value: "Bureaus" },
          { title: "Vergadertafels", value: "Vergadertafels" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "klant", media: "image" },
  },
});
