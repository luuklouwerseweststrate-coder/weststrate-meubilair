import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

// Het hoofd-document: een meubelstuk met opties die de prijs beïnvloeden.
export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "product" }),
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "articleNumber",
      title: "Artikelnummer",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "string",
      options: {
        list: [
          { title: "Bureaustoelen", value: "bureaustoelen" },
          { title: "Bureaus", value: "bureaus" },
          { title: "Vergadertafels", value: "vergadertafels" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Korte omschrijving",
      type: "text",
      rows: 2,
      description: "Eén of twee zinnen — verschijnt op de catalogustegel.",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "description",
      title: "Volledige omschrijving",
      type: "array",
      of: [{ type: "block" }],
      description: "Schrijf in jij/jouw, feitelijk en zonder uitroeptekens.",
    }),
    defineField({
      name: "basePrice",
      title: "Basisprijs (€, excl. btw)",
      type: "number",
      description: "Prijs zonder opties. Opties tellen hier bovenop.",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "images",
      title: "Afbeeldingen",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "specs",
      title: "Specificaties",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Kenmerk", type: "string" },
            { name: "value", title: "Waarde", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "optionGroups",
      title: "Optiegroepen",
      type: "array",
      description:
        "Bv. 'Bladkleur' met keuzes 'Eiken' (+€0) en 'Wit' (+€25). De offertemodule rekent de meerprijs live door.",
      of: [
        {
          type: "object",
          title: "Optiegroep",
          fields: [
            {
              name: "label",
              title: "Naam optiegroep",
              type: "string",
              validation: (r) => r.required(),
            },
            {
              name: "required",
              title: "Keuze verplicht?",
              type: "boolean",
              initialValue: true,
            },
            {
              name: "choices",
              title: "Keuzes",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "label",
                      title: "Keuze",
                      type: "string",
                      validation: (r) => r.required(),
                    },
                    {
                      name: "priceDelta",
                      title: "Meerprijs (€)",
                      type: "number",
                      description: "0 = geen meerprijs. Mag negatief zijn.",
                      initialValue: 0,
                      validation: (r) => r.required(),
                    },
                  ],
                  preview: {
                    select: { title: "label", subtitle: "priceDelta" },
                    prepare({ title, subtitle }) {
                      const d = Number(subtitle || 0);
                      return {
                        title,
                        subtitle: d === 0 ? "geen meerprijs" : `+ € ${d}`,
                      };
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: "label", choices: "choices" },
            prepare({ title, choices }) {
              const n = Array.isArray(choices) ? choices.length : 0;
              return { title, subtitle: `${n} keuze(s)` };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "images.0" },
    prepare({ title, subtitle, media }) {
      const labels: Record<string, string> = {
        bureaustoelen: "Bureaustoelen",
        bureaus: "Bureaus",
        vergadertafels: "Vergadertafels",
      };
      return { title, subtitle: labels[subtitle] || subtitle, media };
    },
  },
});
