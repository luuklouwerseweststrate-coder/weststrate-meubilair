import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Over ons",
  description: "Over Weststrate Meubilair.",
};

export default async function OverPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="kicker mb-3">Over ons</p>
      <h1 className="text-4xl">{s.bedrijfsnaam}</h1>
      <p className="mt-2 text-lg text-ink-2">{s.payoff}.</p>

      <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-ink-2">
        {s.overOns}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/catalogus"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Bekijk de catalogus
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-rule px-6 py-3 text-sm font-semibold text-ink hover:border-ink"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
