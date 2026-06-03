import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductenPerCategorie } from "@/lib/data";
import { CATEGORIE_LABELS, type Categorie } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

const GELDIG: Categorie[] = ["bureaustoelen", "bureaus", "vergadertafels"];

export function generateStaticParams() {
  return GELDIG.map((categorie) => ({ categorie }));
}

export async function generateMetadata({
  params,
}: {
  params: { categorie: string };
}): Promise<Metadata> {
  const cat = params.categorie as Categorie;
  const label = CATEGORIE_LABELS[cat] ?? "Catalogus";
  return { title: label };
}

export default async function CategoriePage({
  params,
}: {
  params: { categorie: string };
}) {
  const cat = params.categorie as Categorie;
  if (!GELDIG.includes(cat)) notFound();

  const producten = await getProductenPerCategorie(cat);

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <nav className="mb-4 text-sm text-ink-2">
        <Link href="/catalogus" className="hover:text-brand">
          Catalogus
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{CATEGORIE_LABELS[cat]}</span>
      </nav>

      <h1 className="text-4xl">{CATEGORIE_LABELS[cat]}</h1>

      {producten.length === 0 ? (
        <p className="mt-8 text-ink-2">
          Er staan nog geen producten in deze categorie.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {producten.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
