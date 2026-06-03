import type { Metadata } from "next";
import { getSettings } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met Weststrate Meubilair.",
};

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="kicker mb-3">Contact</p>
      <h1 className="text-4xl">Neem contact op</h1>
      <p className="mt-4 text-lg text-ink-2">
        Heb je een vraag over een product of wil je een offerte bespreken? We
        helpen je graag.
      </p>

      <dl className="mt-10 divide-y divide-rule border-y border-rule">
        <div className="flex justify-between py-4">
          <dt className="text-ink-2">E-mail</dt>
          <dd>
            <a href={`mailto:${s.email}`} className="font-medium hover:text-brand">
              {s.email}
            </a>
          </dd>
        </div>
        <div className="flex justify-between py-4">
          <dt className="text-ink-2">Telefoon</dt>
          <dd className="font-medium">{s.telefoon}</dd>
        </div>
        <div className="flex justify-between py-4">
          <dt className="text-ink-2">Adres</dt>
          <dd className="whitespace-pre-line text-right font-medium">
            {s.adres}
          </dd>
        </div>
      </dl>
    </div>
  );
}
