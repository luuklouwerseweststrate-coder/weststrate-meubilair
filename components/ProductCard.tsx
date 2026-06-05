import Link from "next/link";
import { euro, type Product } from "@/lib/types";
import { subLabel } from "@/lib/categorieen";
import ProductMedia from "./ProductMedia";

export default function ProductCard({ product }: { product: Product }) {
  const aantalUitvoeringen = product.variants.length;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-rule bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <ProductMedia
          src={product.image}
          alt={product.name}
          naam={product.name}
          categorie={product.category}
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {/* Diepte zichtbaar maken: hoeveel kleur-/formaatcombinaties er zijn */}
        {aantalUitvoeringen > 1 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink-2 backdrop-blur">
            {aantalUitvoeringen} uitvoeringen
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-ink-2">{subLabel(product.subcategory)}</p>
        <h3 className="mt-1 text-lg leading-snug transition-colors group-hover:text-brand">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-2">
          {product.shortDescription}
        </p>
        <p className="mt-4 text-sm text-ink-2">
          vanaf{" "}
          <span className="text-base font-semibold text-ink">
            {euro(product.basePrice)}
          </span>{" "}
          <span className="text-xs">excl. btw</span>
        </p>
      </div>
    </Link>
  );
}
