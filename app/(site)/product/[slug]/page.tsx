import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducten } from "@/lib/data";
import { slugify } from "@/lib/types";
import { subLabel } from "@/lib/categorieen";
import { siteUrl, jsonLdScript } from "@/lib/seo";
import ProductConfigurator from "@/components/ProductConfigurator";

export const revalidate = 300;

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
    alternates: { canonical: `/product/${params.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

// Product-structured-data (schema.org/Product). De prijzen lopen op vanaf
// basePrice; we tonen het als AggregateOffer over alle uitvoeringen.
function productJsonLd(product: Awaited<ReturnType<typeof getProduct>>) {
  if (!product) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.image || undefined,
    sku: product.variants[0]?.articleNumber,
    category: subLabel(product.subcategory),
    brand: { "@type": "Brand", name: "Weststrate" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: product.basePrice,
      offerCount: product.variants.length,
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/product/${product.slug}`,
      seller: { "@type": "Organization", name: "Weststrate" },
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(productJsonLd(product))}
      />
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
