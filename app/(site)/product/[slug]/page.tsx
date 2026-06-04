import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducten } from "@/lib/data";
import { slugify } from "@/lib/types";
import { subLabel } from "@/lib/categorieen";
import ProductConfigurator from "@/components/ProductConfigurator";

export const revalidate = 3600;

export async function generateStaticParams() {
  const producten = await getProducten();
  return producten.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product niet gevonden" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      {/* Kruimelpad */}
      <nav className="mb-6 text-sm text-ink-2">
        <Link href="/catalogus" className="hover:text-brand">
          Catalogus
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/catalogus/${slugify(product.subcategory)}`}
          className="hover:text-brand"
        >
          {subLabel(product.subcategory)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductConfigurator product={product} />
    </div>
  );
}
