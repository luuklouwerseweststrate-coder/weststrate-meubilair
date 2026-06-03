import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./sanity/schemas";

const SETTINGS_DOC_ID = "settings";

export default defineConfig({
  name: "weststrate-meubilair",
  title: "Weststrate Meubilair",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Beheer")
          .items([
            // ── Instellingen ───────────────────────────────
            S.listItem()
              .title("⚙️ Site-instellingen")
              .id("settings")
              .child(
                S.document()
                  .schemaType("settings")
                  .documentId(SETTINGS_DOC_ID)
              ),

            S.divider(),

            // ── Producten per categorie (sleepbaar) ────────
            S.listItem()
              .title("🪑 Bureaustoelen")
              .child(
                S.list()
                  .title("Bureaustoelen")
                  .items([
                    orderableDocumentListDeskItem({
                      type: "product",
                      title: "Bureaustoelen (sleep om volgorde te bepalen)",
                      filter: `category == "bureaustoelen"`,
                      S,
                      context,
                    }),
                  ])
              ),
            S.listItem()
              .title("🖥️ Bureaus")
              .child(
                S.list()
                  .title("Bureaus")
                  .items([
                    orderableDocumentListDeskItem({
                      type: "product",
                      title: "Bureaus (sleep om volgorde te bepalen)",
                      filter: `category == "bureaus"`,
                      S,
                      context,
                    }),
                  ])
              ),
            S.listItem()
              .title("👥 Vergadertafels")
              .child(
                S.list()
                  .title("Vergadertafels")
                  .items([
                    orderableDocumentListDeskItem({
                      type: "product",
                      title: "Vergadertafels (sleep om volgorde te bepalen)",
                      filter: `category == "vergadertafels"`,
                      S,
                      context,
                    }),
                  ])
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
