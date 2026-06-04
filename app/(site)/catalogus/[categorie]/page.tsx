import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductenPerSubSlug, getSubcategorieSlugs } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getSubcategorieSlugs();
  return slugs.map((categorie) => ({ categorie }));
}

export async function generateMetadata({
  params,
}: {
  params: { categorie: string };
}): Promise<Metadata> {
  const { sub } = await getProductenPerSubSlug(params.categorie);
  return { title: sub || "Catalogus" };
}

export default async function CategoriePage({
  params,
}: {
  params: { categorie: string };
}) {
  const { sub, hoofd, producten } = await getProductenPerSubSlug(
    params.categorie
  );
  if (producten.length === 0) notFound();

  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <nav className="mb-4 text-sm text-ink-2">
        <Link href="/catalogus" className="hover:text-brand">
          Catalogus
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-2">{hoofd}</span>
        <span className="mx-2">/</span>
        <span className="text-ink">{sub}</span>
      </nav>

      <h1 className="text-4xl">{sub}</h1>
      <p className="mt-2 text-ink-2">
        {producten.length} {producten.length === 1 ? "product" : "producten"}{" "}
        leverbaar
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {producten.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
