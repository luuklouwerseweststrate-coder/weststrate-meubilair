import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducten } from "@/lib/data";
import { CATEGORIE_LABELS, euro } from "@/lib/types";
import ProductMedia from "@/components/ProductMedia";
import OptieSelector from "@/components/OptieSelector";

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
          href={`/catalogus/${product.category}`}
          className="hover:text-brand"
        >
          {CATEGORIE_LABELS[product.category]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Linkerkolom: media + omschrijving */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-rule">
            <ProductMedia
              src={product.images[0]}
              alt={product.name}
              category={product.category}
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-lg border border-rule"
                >
                  <ProductMedia
                    src={src}
                    alt={`${product.name} ${i + 2}`}
                    category={product.category}
                  />
                </div>
              ))}
            </div>
          )}

          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg">Omschrijving</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-2">
                {product.description}
              </p>
            </div>
          )}

          {product.specs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg">Specificaties</h2>
              <dl className="mt-3 divide-y divide-rule border-t border-rule">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex justify-between py-2.5 text-sm">
                    <dt className="text-ink-2">{s.label}</dt>
                    <dd className="text-right font-medium text-ink">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Rechterkolom: configurator */}
        <div>
          <p className="font-mono text-xs text-ink-2">
            {product.articleNumber}
          </p>
          <h1 className="mt-1 text-3xl">{product.name}</h1>
          <p className="mt-3 text-ink-2">{product.shortDescription}</p>
          <p className="mt-4 text-sm text-ink-2">
            Basisprijs{" "}
            <span className="font-semibold text-ink">
              {euro(product.basePrice)}
            </span>{" "}
            excl. btw
          </p>

          <div className="mt-6">
            <OptieSelector product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
