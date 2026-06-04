import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductenPerSubSlug, getSubcategorieSlugs } from "@/lib/data";
import { subLabel } from "@/lib/categorieen";
import { slugify } from "@/lib/types";
import SubcatalogusClient from "@/components/SubcatalogusClient";

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
  return { title: subLabel(sub) || "Catalogus" };
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
        <a href={`/catalogus#${slugify(hoofd)}`} className="hover:text-brand">
          {hoofd}
        </a>
        <span className="mx-2">/</span>
        <span className="text-ink">{subLabel(sub)}</span>
      </nav>

      <h1 className="text-4xl">{subLabel(sub)}</h1>
      <p className="mt-2 text-ink-2">
        {producten.length} {producten.length === 1 ? "serie" : "series"}{" "}
        leverbaar
      </p>

      <SubcatalogusClient producten={producten} />
    </div>
  );
}
