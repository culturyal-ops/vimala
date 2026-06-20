import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { COLLECTION_TAGLINES, SILK_SUBCATEGORIES } from "@/lib/copy";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProductsByDepartment } from "@/lib/catalog";
import { enrichProduct, toBagProduct } from "@/lib/product-seo";

export const metadata: Metadata = pageMetadata({
  title:
    "Buy Silk Sarees Online | Bridal & Wedding Silk Sarees — Vimala Silk House",
  description:
    "Shop pure silk sarees and bridal wear online from Kerala. Handpicked wedding and festive silk sarees, shipped worldwide from Vimala Silk House.",
  path: "/collections/silk-sarees",
});

export default function SilkSareesPage() {
  const products = getProductsByDepartment("silks").map(enrichProduct);

  return (
    <div className="bg-ivory pt-header">
      <div className="mx-auto max-w-[1440px] px-4 pb-6 pt-12 md:px-16 md:pb-8 md:pt-16">
        <h1 className="font-display text-4xl font-medium text-crimson md:text-5xl">
          Silk Sarees &amp; Bridal Wear
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm text-ink/55">
          {COLLECTION_TAGLINES.silks}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {SILK_SUBCATEGORIES.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className="rounded-full border border-gold/30 px-5 py-2 font-body text-xs uppercase tracking-wider text-crimson hover:border-gold"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-16 md:px-16">
        <SectionTitle title="Featured Silk Sarees" align="left" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              href={`/shop/${p.slug}`}
              name={p.name}
              price={p.price}
              fabric={p.fabric}
              category={p.category}
              department={p.department}
              imageUrl={p.imageUrl}
              hoverImageUrl={p.hoverImageUrl}
              isNew={p.isNew}
              discount={p.discount}
              originalPrice={p.originalPrice}
              scarcityNote={p.scarcityNote}
              bagProduct={toBagProduct(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
