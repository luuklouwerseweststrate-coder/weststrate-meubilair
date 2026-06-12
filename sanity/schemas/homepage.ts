import { defineField, defineType } from "sanity";

// Singleton met alle vaste teksten van de homepage, per sectie gegroepeerd.
// De inhoud die uit data komt (projecten, blogartikelen, branches, cijfers)
// beheer je in de eigen lijsten; hier staan alleen de koppen en lopende tekst.
export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero (bovenaan)" },
    { name: "secties", title: "Secties" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero (grote kop met foto)",
      type: "object",
      group: "hero",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "kicker",
          title: "Regel boven de kop",
          type: "string",
        }),
        defineField({
          name: "titel",
          title: "Grote kop",
          type: "text",
          rows: 2,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "introMobiel",
          title: "Introtekst (mobiel, kort)",
          type: "text",
          rows: 2,
          description: "Korte variant voor kleine schermen.",
        }),
        defineField({
          name: "introDesktop",
          title: "Introtekst (desktop)",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "knopProjecten",
          title: "Knoptekst: projecten",
          type: "string",
        }),
        defineField({
          name: "knopCatalogus",
          title: "Knoptekst: catalogus",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "watWeDoen",
      title: "Sectie: wat Weststrate doet",
      type: "object",
      group: "secties",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string" }),
        defineField({ name: "titel", title: "Kop", type: "string" }),
        defineField({ name: "intro", title: "Introtekst", type: "text", rows: 3 }),
        defineField({
          name: "blokken",
          title: "Blokken (advies / levering / montage)",
          type: "array",
          validation: (rule) => rule.max(3),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "titel",
                  title: "Titel",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "tekst",
                  title: "Tekst",
                  type: "text",
                  rows: 2,
                  validation: (rule) => rule.required(),
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "branchesSectie",
      title: "Sectie: voor welke ruimte",
      type: "object",
      group: "secties",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string" }),
        defineField({ name: "titel", title: "Kop", type: "string" }),
        defineField({ name: "intro", title: "Introtekst", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "projectenSectie",
      title: "Sectie: recente projecten",
      type: "object",
      group: "secties",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string" }),
        defineField({ name: "titel", title: "Kop", type: "string" }),
      ],
    }),
    defineField({
      name: "assortimentSectie",
      title: "Sectie: het assortiment",
      type: "object",
      group: "secties",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string" }),
        defineField({ name: "titel", title: "Kop", type: "string" }),
        defineField({ name: "intro", title: "Introtekst", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "werkplekCta",
      title: "Sectie: werkplek samenstellen (roze blok)",
      type: "object",
      group: "secties",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string" }),
        defineField({ name: "titel", title: "Kop", type: "string" }),
        defineField({ name: "tekst", title: "Tekst", type: "text", rows: 3 }),
        defineField({ name: "knop", title: "Knoptekst", type: "string" }),
      ],
    }),
    defineField({
      name: "opdrachtgeversTitel",
      title: "Kop boven de opdrachtgevers",
      type: "string",
      group: "secties",
      description: "De namen zelf komen automatisch uit de projecten.",
    }),
    defineField({
      name: "blogSectie",
      title: "Sectie: inspiratie / blog",
      type: "object",
      group: "secties",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string" }),
        defineField({ name: "titel", title: "Kop", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
