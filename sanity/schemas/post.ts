import { defineField, defineType } from "sanity";

// Een blog-/inspiratieartikel.
export default defineType({
  name: "post",
  title: "Blogartikel",
  type: "document",
  fields: [
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
    defineField({
      name: "datum",
      title: "Publicatiedatum",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "thema",
      title: "Thema",
      type: "string",
      description: "Bv. Ergonomie, Akoestiek, Inrichting.",
    }),
    defineField({
      name: "leestijd",
      title: "Leestijd (minuten)",
      type: "number",
      initialValue: 4,
    }),
    defineField({
      name: "samenvatting",
      title: "Samenvatting",
      type: "text",
      rows: 2,
      validation: (r) => r.max(220),
    }),
    defineField({
      name: "body",
      title: "Inhoud",
      type: "array",
      of: [{ type: "block" }],
      description: "Schrijf in jij/jouw, korte zinnen, zonder uitroeptekens.",
    }),
    defineField({
      name: "image",
      title: "Hoofdbeeld",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "faq",
      title: "Veelgestelde vragen",
      type: "array",
      description:
        "Verschijnen onderaan het artikel én als FAQ-structured-data, " +
        "zodat de antwoorden rechtstreeks in zoekresultaten en " +
        "AI-antwoorden kunnen verschijnen. Houd antwoorden kort (2-3 zinnen).",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "vraag",
              title: "Vraag",
              type: "string",
              validation: (r) => r.required(),
            },
            {
              name: "antwoord",
              title: "Antwoord",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            },
          ],
          preview: { select: { title: "vraag", subtitle: "antwoord" } },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Nieuwste eerst",
      name: "datumDesc",
      by: [{ field: "datum", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "thema", media: "image" },
  },
});
