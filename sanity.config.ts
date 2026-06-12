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

            // ── Homepage-teksten ───────────────────────────
            S.listItem()
              .title("🏠 Homepage")
              .id("homepage")
              .child(
                S.document().schemaType("homepage").documentId("homepage")
              ),

            S.divider(),

            // ── Productbeheer ──────────────────────────────
            // Producten komen uit de Swan-data (data/*.json), niet uit
            // Sanity. Hier stuur je per product bij: offline halen of
            // prijzen van uitvoeringen aanpassen.
            S.listItem()
              .title("🪑 Productbeheer")
              .child(
                S.documentTypeList("productOverride")
                  .title("Producten (offline halen / prijzen aanpassen)")
                  .defaultOrdering([{ field: "naam", direction: "asc" }])
              ),

            S.divider(),

            // ── Projecten (sleepbaar) ──────────────────────
            S.listItem()
              .title("🏢 Projecten")
              .child(
                S.list()
                  .title("Projecten")
                  .items([
                    orderableDocumentListDeskItem({
                      type: "project",
                      title: "Projecten (sleep om volgorde te bepalen)",
                      S,
                      context,
                    }),
                  ])
              ),

            // ── Blog ───────────────────────────────────────
            S.listItem()
              .title("✍️ Blog")
              .child(
                S.documentTypeList("post")
                  .title("Blogartikelen")
                  .defaultOrdering([{ field: "datum", direction: "desc" }])
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
