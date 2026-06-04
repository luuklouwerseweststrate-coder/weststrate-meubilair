"use client";

import { useState } from "react";
import Link from "next/link";
import { euro, useOfferte } from "@/lib/offerte";
import { stuksprijs, regelTotaal } from "@/lib/types";

interface Klant {
  naam: string;
  bedrijf: string;
  email: string;
  telefoon: string;
  opmerking: string;
}

const LEEG: Klant = {
  naam: "",
  bedrijf: "",
  email: "",
  telefoon: "",
  opmerking: "",
};

export default function OfferteClient({
  ontvangerEmail,
}: {
  ontvangerEmail: string;
}) {
  const { regels, verwijder, wijzigAantal, leegmaken, totaal } = useOfferte();
  const [klant, setKlant] = useState<Klant>(LEEG);
  const [status, setStatus] = useState<
    "idle" | "bezig" | "verstuurd" | "fout"
  >("idle");
  const [foutmelding, setFoutmelding] = useState("");

  const leeg = regels.length === 0;

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    setStatus("bezig");
    setFoutmelding("");
    try {
      const res = await fetch("/api/offerte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ klant, regels, totaal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Versturen mislukt");

      if (data.mailto) {
        // Resend nog niet gekoppeld: open de mailclient als terugval
        window.location.href = data.mailto;
      }
      setStatus("verstuurd");
      leegmaken();
      setKlant(LEEG);
    } catch (err) {
      setStatus("fout");
      setFoutmelding(err instanceof Error ? err.message : "Onbekende fout");
    }
  }

  if (status === "verstuurd") {
    return (
      <div className="mx-auto max-w-content px-5 py-20 text-center">
        <div className="merkbalk mx-auto mb-8 max-w-xs rounded-full" />
        <h1 className="text-3xl">Bedankt voor je aanvraag</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-2">
          We hebben je offerte ontvangen. John Provoost, onze accountmanager
          meubilair, neemt zo snel mogelijk contact met je op.
        </p>
        <Link
          href="/catalogus"
          className="mt-8 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Verder kijken
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <p className="kicker mb-3">Offerte</p>
      <h1 className="text-4xl">Mijn offerte</h1>

      {leeg ? (
        <div className="mt-10 rounded-xl border border-rule bg-white p-10 text-center">
          <p className="text-ink-2">Je offerte is nog leeg.</p>
          <Link
            href="/catalogus"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Naar de catalogus
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Regels */}
          <div>
            <div className="space-y-4">
              {regels.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-rule bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-ink-2">
                        {r.articleNumber}
                      </p>
                      <h3 className="text-lg">{r.productName}</h3>
                    </div>
                    <button
                      onClick={() => verwijder(r.id)}
                      className="text-sm text-ink-2 underline hover:text-brand"
                    >
                      Verwijder
                    </button>
                  </div>

                  {/* Gekozen opties */}
                  <ul className="mt-3 space-y-1 text-sm text-ink-2">
                    {r.gekozenOpties.map((o, i) => (
                      <li key={i}>
                        {o.groepLabel}: {o.keuzeLabel}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-rule pt-4">
                    <div className="inline-flex items-center rounded-lg border border-rule">
                      <button
                        onClick={() => wijzigAantal(r.id, r.aantal - 1)}
                        className="px-3 py-1.5 text-lg text-ink-2 hover:text-brand"
                        aria-label="Minder"
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">
                        {r.aantal}
                      </span>
                      <button
                        onClick={() => wijzigAantal(r.id, r.aantal + 1)}
                        className="px-3 py-1.5 text-lg text-ink-2 hover:text-brand"
                        aria-label="Meer"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-ink-2">
                        {euro(stuksprijs(r))} per stuk
                      </p>
                      <p className="font-semibold text-ink">
                        {euro(regelTotaal(r))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-paper-2 px-6 py-5">
              <span className="text-sm text-ink-2">Totaal (excl. btw)</span>
              <span className="font-display text-2xl font-extrabold">
                {euro(totaal)}
              </span>
            </div>
          </div>

          {/* Formulier */}
          <form
            onSubmit={verstuur}
            className="h-fit rounded-xl border border-rule bg-white p-6"
          >
            <h2 className="text-lg">Jouw gegevens</h2>
            <p className="mt-1 text-sm text-ink-2">
              Vul je gegevens in en we sturen je een passende offerte.
            </p>

            <div className="mt-5 space-y-3">
              <Veld
                label="Naam"
                value={klant.naam}
                onChange={(v) => setKlant({ ...klant, naam: v })}
                required
              />
              <Veld
                label="Bedrijf"
                value={klant.bedrijf}
                onChange={(v) => setKlant({ ...klant, bedrijf: v })}
              />
              <Veld
                label="E-mail"
                type="email"
                value={klant.email}
                onChange={(v) => setKlant({ ...klant, email: v })}
                required
              />
              <Veld
                label="Telefoon"
                value={klant.telefoon}
                onChange={(v) => setKlant({ ...klant, telefoon: v })}
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">
                  Opmerking
                </label>
                <textarea
                  value={klant.opmerking}
                  onChange={(e) =>
                    setKlant({ ...klant, opmerking: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-rule px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>

            {status === "fout" && (
              <p className="mt-4 rounded-lg bg-magenta/10 px-3 py-2 text-sm text-magenta">
                Er ging iets mis: {foutmelding}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "bezig"}
              className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "bezig" ? "Versturen…" : "Offerte aanvragen"}
            </button>
            <p className="mt-3 text-center text-xs text-ink-2">
              Of mail rechtstreeks naar {ontvangerEmail}
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

function Veld({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-magenta"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-rule px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}
