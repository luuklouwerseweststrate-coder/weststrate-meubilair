# Overdracht: Swan-snelleverprogramma → Weststrate Meubilair

Dit document beschrijft de stand van zaken en hoe je verdergaat. Geschreven als
overdracht van Claude (Opus) naar Codex. Communiceer met Luuk **in het Nederlands**,
direct en uitleggend (hij is geen developer maar wil leren). Reageer kort na elke actie.

## Doel
De pilot-webshop `weststrate-meubilair/` (Next.js 14 App Router + Tailwind v3 +
Sanity-CMS) koppelen aan het **Swan-snelleverprogramma** (kantoormeubilair), zodat de
catalogus echt is en echte productfoto's toont. Luuk wil dit eerst **intern pitchen bij
management** vóór er een betaald Swan-API-account komt. Daarom draaien we nu op een
**Excel-export** als bron i.p.v. de live API.

## Wat al af is (deze sessie, build is GROEN)
- **Datamodel = variant-matrix.** 1 productlijn = 1 `Product` met `optionGroups[]`
  (keuze-assen) en `variants[]` (elke combinatie met eigen `articleNumber`, `price`,
  `image`, `opties`). Zie [lib/types.ts](lib/types.ts): `Variant`, `OptieGroep`,
  `vindVariant()`, `slugify()`. De oude `Categorie`-union + `priceDelta` zijn weg.
- **Categorieën zijn dynamisch** (afgeleid uit de data, niet meer hardcoded). Helpers in
  [lib/data.ts](lib/data.ts): `getCategorieStructuur()`, `getSubcategorieSlugs()`,
  `getProductenPerSubSlug()`. Producten komen uit `data/swan-catalogus.json`, NIET meer
  uit Sanity (Sanity blijft wél voor projecten/blog/settings).
- **Excel → JSON converter** (de brug nu): [scripts/excel-to-json.mjs](scripts/excel-to-json.mjs).
  Leest `data/snelleverprogramma.xlsx`, groepeert op `snel_subcategorie` + `snel_type`,
  schrijft `data/swan-catalogus.json`. Draaien: **`npm run catalogus`**.
  → Levert nu **43 producten / 1665 varianten**, waarvan 1627 met een echte fotolink.
- **Live API-sync** (voor later, als er credentials zijn): [scripts/sync-swan.mjs](scripts/sync-swan.mjs),
  `npm run sync`. Gebruikt **dezelfde** transform als de Excel-converter
  ([scripts/transform.mjs](scripts/transform.mjs)) → identieke JSON-vorm, dus de overstap
  is later naadloos.
- **UI:** [components/ProductConfigurator.tsx](components/ProductConfigurator.tsx) (client,
  kern: kleur/formaat kiezen → prijs ÉN foto wisselen live mee).
  [components/ProductMedia.tsx](components/ProductMedia.tsx) heeft een verzorgde placeholder
  (merkkleur per hoofdcategorie + productnaam) voor de ~38 variantbeelden die ontbreken.
- **Offerte-keten** ([app/(site)/offerte/OfferteClient.tsx](app/(site)/offerte/OfferteClient.tsx),
  [app/api/offerte/route.ts](app/api/offerte/route.ts)) werkt op de exacte variantprijs +
  artikelcode.
- **Config:** [next.config.mjs](next.config.mjs) staat `v2.portal.swan-products.nl` toe voor
  next/image. GitHub Action [.github/workflows/sync-swan.yml](.github/workflows/sync-swan.yml)
  bestaat voor de latere nachtelijke API-sync.

## Hoe de data-pipeline werkt
```
data/snelleverprogramma.xlsx  --(npm run catalogus)-->  data/swan-catalogus.json  -->  site
        (bron NU)                  excel-to-json.mjp                (gecommit in repo)
```
Later, met betaald account:
```
Swan API  --(npm run sync, via GitHub Action)-->  data/swan-catalogus.json  -->  site
```
Beide paden gebruiken `scripts/transform.mjs` → exact dezelfde JSON.

## Belangrijke details / valkuilen
- **Excel-structuur:** elke rij = 1 variant. Vaste kolommen met `snel_`-prefix
  (`snel_naam, snel_categorie, snel_subcategorie, snel_type, snel_prijs,
  snel_artikelcode, snel_afbeelding`) + variabele velden (`formaat, kies_kleur,
  kleur_frame, kleur_kabelgoot, stoffering, ...`). De converter trimt alle cellen
  (één subcategorie had een tab erachter → werd anders dubbel).
- **`xlsx`** (SheetJS) is als dev-dependency toegevoegd, alleen voor de converter. Het
  geeft npm-audit-waarschuwingen — niet erg, draait nooit in de browser, alleen bij
  `npm run catalogus`.
- **Lock-bestand:** `data/~$snelleverprogramma.xlsx` ontstaat als Luuk de Excel open heeft.
  Zet dat in `.gitignore` (`~$*.xlsx`), niet committen.
- **GitHub Action sync-swan.yml** faalt zolang er geen `SWAN_USERNAME`/`SWAN_PASSWORD`
  secret is (script exit 1). Overweeg de `schedule`-cron tijdelijk uit te zetten tot er
  credentials zijn, zodat er geen rode runs ontstaan. De catalogus wordt nu handmatig via
  `npm run catalogus` ververst en gecommit.
- **SECURITY:** Swan-credentials NOOIT met `NEXT_PUBLIC_`-prefix, nooit in de browser.
  Alleen server-side (sync-script + GitHub secret + Vercel env).

## Volgende stappen (voorstel, op volgorde)
1. **Lokaal visueel checken:** `npm run dev` → controleer (a) catalogus toont foto's en
   alle subcategorieën, (b) productdetail: andere kleur/formaat kiezen wisselt prijs én
   foto, (c) toevoegen aan offerte → juiste artikelcode + prijs op `/offerte`.
2. **Contentkwaliteit:** `shortDescription` is nu generiek
   ("… leverbaar in N uitvoeringen"). Eventueel verbeteren in Weststrate-stijl (je/jij,
   geen filler; verboden woorden: compatibel, robuust, duurzaam, royaal, stijlvol, luxe).
   Het optionele `description`-veld is nu leeg.
3. **Subcategorie-keuze met Luuk:** hij wil "liefst alle categorieën". Check of de kleine
   restposten (Componenten, Persoonlijke lade, Kabelmanagement) zo getoond mogen worden of
   subtieler in de nav moeten. Filteren kan in de converter of in `getCategorieStructuur()`.
4. **Deploy / pitch:** nog NIET gepusht. Als Luuk akkoord is: commit (`data/swan-catalogus.json`
   + `data/snelleverprogramma.xlsx` + code) en push → Vercel deployt. Voor de Excel-aanpak
   zijn GÉÉN Swan-env-vars op Vercel nodig (JSON zit in de repo).
   Commit-footer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` (of jouw eigen).
5. **Later, bij betaald account:** zet `SWAN_USERNAME`/`SWAN_PASSWORD` als GitHub-secret +
   Vercel-env, zet de cron weer aan, draai `npm run sync`. Klaar.

## Repo / omgeving
- Map: `c:\Users\luuklouwerse\Claude_AI_Projects\weststrate-meubilair\`
- GitHub: `luuklouwerseweststrate-coder/weststrate-meubilair` (PUBLIC, branch `main`),
  Vercel auto-deploy bij push. Windows + PowerShell. `gh` CLI geïnstalleerd, niet ingelogd;
  push gaat via Git Credential Manager.
- Plan-bestand met de volledige architectuur:
  `~/.claude/plans/begin-emt-een-plan-foamy-pudding.md`.
