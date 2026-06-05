import { NextResponse } from "next/server";
import type { OfferteRegel, GekozenOptie } from "@/lib/types";
import { stuksprijs, regelTotaal } from "@/lib/types";

// Ontvangt de samengestelde offerte en stuurt hem per e-mail naar Weststrate.
// Zolang RESEND_API_KEY niet ingesteld is, geeft de route een mailto-link
// terug zodat de klant alsnog kan versturen via zijn eigen mailclient.

interface Klant {
  naam: string;
  bedrijf: string;
  email: string;
  telefoon: string;
  opmerking: string;
}

function euro(bedrag: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(bedrag);
}

function optiesTekst(opties: GekozenOptie[]): string {
  return opties
    .map((o) => `   - ${o.groepLabel}: ${o.keuzeLabel}`)
    .join("\n");
}

function plattekstOfferte(
  klant: Klant,
  regels: OfferteRegel[],
  totaal: number
): string {
  const lijnen = regels
    .map(
      (r) =>
        `${r.aantal}x ${r.productName} (${r.articleNumber})\n${optiesTekst(
          r.gekozenOpties
        )}\n   Stuksprijs: ${euro(stuksprijs(r))}  |  Regeltotaal: ${euro(
          regelTotaal(r)
        )}`
    )
    .join("\n\n");

  return [
    "Nieuwe offerteaanvraag via de website",
    "",
    `Naam: ${klant.naam}`,
    `Bedrijf: ${klant.bedrijf || "-"}`,
    `E-mail: ${klant.email}`,
    `Telefoon: ${klant.telefoon || "-"}`,
    `Opmerking: ${klant.opmerking || "-"}`,
    "",
    "── Producten ──",
    lijnen,
    "",
    `TOTAAL (excl. btw): ${euro(totaal)}`,
  ].join("\n");
}

function htmlOfferte(
  klant: Klant,
  regels: OfferteRegel[],
  totaal: number
): string {
  const rijen = regels
    .map((r) => {
      const opties = r.gekozenOpties
        .map((o) => `${o.groepLabel}: ${o.keuzeLabel}`)
        .join("<br>");
      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #E3E1D8;vertical-align:top">
            <strong>${r.productName}</strong><br>
            <span style="color:#4A4A55;font-size:12px">${r.articleNumber}</span><br>
            <span style="color:#4A4A55;font-size:13px">${opties}</span>
          </td>
          <td style="padding:8px;border-bottom:1px solid #E3E1D8;text-align:center">${r.aantal}</td>
          <td style="padding:8px;border-bottom:1px solid #E3E1D8;text-align:right">${euro(
            stuksprijs(r)
          )}</td>
          <td style="padding:8px;border-bottom:1px solid #E3E1D8;text-align:right"><strong>${euro(
            regelTotaal(r)
          )}</strong></td>
        </tr>`;
    })
    .join("");

  return `
  <div style="font-family:Inter,Arial,sans-serif;color:#14141A;max-width:640px">
    <div style="height:4px;background:linear-gradient(to right,#A1367E,#01B6E3,#009D46,#CCD50A,#F29828)"></div>
    <h2 style="color:#14141A">Nieuwe offerteaanvraag</h2>
    <p style="color:#4A4A55">
      <strong>${klant.naam}</strong>${klant.bedrijf ? `, ${klant.bedrijf}` : ""}<br>
      ${klant.email}${klant.telefoon ? ` · ${klant.telefoon}` : ""}
    </p>
    ${
      klant.opmerking
        ? `<p style="background:#F0EFE9;padding:12px;border-radius:8px"><em>${klant.opmerking}</em></p>`
        : ""
    }
    <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
      <thead>
        <tr style="text-align:left;color:#4A4A55;font-size:12px">
          <th style="padding:8px">Product</th>
          <th style="padding:8px;text-align:center">Aantal</th>
          <th style="padding:8px;text-align:right">Stuksprijs</th>
          <th style="padding:8px;text-align:right">Totaal</th>
        </tr>
      </thead>
      <tbody>${rijen}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:700">Totaal (excl. btw)</td>
          <td style="padding:12px 8px;text-align:right;font-weight:700;font-size:16px">${euro(
            totaal
          )}</td>
        </tr>
      </tfoot>
    </table>
  </div>`;
}

export async function POST(request: Request) {
  try {
    const { klant, regels, totaal } = (await request.json()) as {
      klant: Klant;
      regels: OfferteRegel[];
      totaal: number;
    };

    // Basisvalidatie
    if (!klant?.naam || !klant?.email || !regels?.length) {
      return NextResponse.json(
        { error: "Naam, e-mail en minimaal één product zijn verplicht." },
        { status: 400 }
      );
    }

    // Feitelijke ontvanger van de offerte-mail. In Resend-testmodus wordt
    // alleen het account-adres (Luuks Gmail) afgeleverd; op de site tonen we
    // info@weststrate.nl als contactadres. In productie zet je OFFERTE_ONTVANGER
    // in Vercel op het gewenste Weststrate-adres.
    const ontvanger =
      process.env.OFFERTE_ONTVANGER || "luuklouwerse.weststrate@gmail.com";
    const afzender = process.env.OFFERTE_AFZENDER || "onboarding@resend.dev";
    const apiKey = process.env.RESEND_API_KEY;

    // ── Resend nog niet gekoppeld: geef een mailto-link terug ──
    // De klant ziet hier het publieke adres (info@weststrate.nl), nooit het
    // interne afleveradres.
    if (!apiKey) {
      const onderwerp = `Offerteaanvraag: ${klant.naam}`;
      const body = plattekstOfferte(klant, regels, totaal);
      const mailto = `mailto:info@weststrate.nl?subject=${encodeURIComponent(
        onderwerp
      )}&body=${encodeURIComponent(body)}`;
      return NextResponse.json({ ok: true, mailto });
    }

    // ── Resend gekoppeld: verstuur de e-mail ──
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `Weststrate Meubilair <${afzender}>`,
      to: [ontvanger],
      replyTo: klant.email,
      subject: `Offerteaanvraag: ${klant.naam}${
        klant.bedrijf ? ` (${klant.bedrijf})` : ""
      }`,
      html: htmlOfferte(klant, regels, totaal),
      text: plattekstOfferte(klant, regels, totaal),
    });

    if (error) {
      return NextResponse.json(
        { error: "Versturen via e-mail mislukte." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Onverwachte fout bij verwerken van de offerte." },
      { status: 500 }
    );
  }
}
