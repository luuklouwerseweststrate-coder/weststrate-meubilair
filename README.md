# Weststrate Meubilair — dealer webshop (pilot)

Een instap-webshop voor kantoormeubilair met een offertemodule waarin klanten
opties met meerprijs kunnen kiezen (bv. een ander bladkleur). Gebouwd in
Weststrate-huisstijl (Brandbook v1.0).

## Stack
- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Sanity** als CMS / beheeromgeving (studio op `/studio`)
- **Resend** voor het versturen van offerte-aanvragen per e-mail
- Deploy op **Vercel**

## Aan de slag

```bash
npm install
cp .env.local.example .env.local   # vul de waarden in (mag eerst leeg)
npm run dev
```

Open http://localhost:3000.

> **Belangrijk:** de site draait direct, óók zonder Sanity en zonder Resend.
> - Zonder Sanity → de producten komen uit `lib/mock-data.ts`.
> - Zonder Resend → de offerte opent als mailtje in je eigen mailclient.

## Categorieën
Drie vaste categorieën: **bureaustoelen**, **bureaus**, **vergadertafels**.

## Structuur

| Pad | Wat |
|-----|-----|
| `app/(site)/` | De publieke website (home, catalogus, product, offerte, over, contact) |
| `app/studio/` | De Sanity-beheeromgeving |
| `app/api/offerte/` | Verstuurt de offerte per e-mail (of geeft mailto-fallback) |
| `sanity/schemas/` | CMS-modellen: `product` (incl. optiegroepen) en `settings` |
| `lib/types.ts` | Types + prijsberekening (`stuksprijs`, `regelTotaal`) |
| `lib/offerte.tsx` | Offertemandje (React Context + localStorage) |
| `lib/data.ts` | Haalt data uit Sanity, valt terug op mock-data |
| `lib/mock-data.ts` | Voorbeeldproducten zodat de site werkt zonder CMS |

## Sanity koppelen (later)
1. Maak een project op https://sanity.io en noteer de **Project ID**.
2. Zet in `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID=...`
3. Ga naar `/studio`, voeg producten toe en vul de site-instellingen.

De prijs-opties stel je per product in onder **Optiegroepen**: een groep
(bv. "Bladkleur") met keuzes die elk een **meerprijs** hebben. De
offertemodule rekent dat live door.

## Resend koppelen (later)
1. Maak een account op https://resend.com en verifieer een afzenderdomein.
2. Zet in `.env.local`: `RESEND_API_KEY=...`, `OFFERTE_ONTVANGER=...`,
   `OFFERTE_AFZENDER=...`.

## Nog te doen
- Officiële logo-SVG's plaatsen in `public/` (nu tekstlogo als placeholder).
- Productfoto's toevoegen via het CMS (nu gekleurde placeholders).
