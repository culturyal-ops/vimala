import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { COLLECTION_TAGLINES } from "@/lib/copy";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProductsByDepartment } from "@/lib/catalog";
import { enrichProduct, toBagProduct } from "@/lib/product-seo";
import { STORE } from "@/lib/store-info";

export const metadata: Metadata = pageMetadata({
  title: "Readymade Fashion for Men, Women & Kids | Vimala Silk House",
  description:
    "Shop everyday wear, summer collections, and family fashion online from Vimala Silk House, Kattappana — quality readymade garments shipped worldwide.",
  path: "/collections/readymade",
});

export default function ReadymadePage() {
  const products = [
    ...getProductsByDepartment("readymade"),
    ...getProductsByDepartment("women"),
    ...getProductsByDepartment("men"),
    ...getProductsByDepartment("kids"),
    ...getProductsByDepartment("summer"),
  ]
    .slice(0, 8)
    .map(enrichProduct);

  return (
    <div className="bg-ivory pt-header">
      <div className="mx-auto max-w-[1440px] px-4 pb-6 pt-12 md:px-16 md:pb-8 md:pt-16">
        <h1 className="font-display text-4xl font-medium text-crimson md:text-5xl">
          Readymade Fashion
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm text-ink/55">
          {COLLECTION_TAGLINES.readymade}
        </p>
        <p className="mt-4 font-body text-xs text-ink/45">{STORE.note}.</p>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-16 md:px-16">
        <SectionTitle title="Readymade Picks" align="left" />
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
              isNew={p.isNew}
              discount={p.discount}
              originalPrice={p.originalPrice}
              sizes={p.sizes}
              scarcityNote={p.scarcityNote}
              bagProduct={toBagProduct(p)}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/shop">Shop All Readymade</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
