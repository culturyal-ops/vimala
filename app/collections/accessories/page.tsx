import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { COLLECTION_TAGLINES } from "@/lib/copy";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProductsByDepartment } from "@/lib/catalog";
import { enrichProduct, toBagProduct } from "@/lib/product-seo";

export const metadata: Metadata = pageMetadata({
  title: "Jewellery & Fashion Accessories Online | Vimala Silk House",
  description:
    "Complete your saree or outfit with curated jewellery and lifestyle accessories from Vimala Silk House — shipped worldwide.",
  path: "/collections/accessories",
});

export default function AccessoriesPage() {
  const products = getProductsByDepartment("accessories").map(enrichProduct);

  return (
    <div className="bg-ivory pt-header">
      <div className="mx-auto max-w-[1440px] px-4 pb-6 pt-12 md:px-16 md:pb-8 md:pt-16">
        <h1 className="font-display text-4xl font-medium text-crimson md:text-5xl">
          Jewellery &amp; Accessories
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm text-ink/55">
          {COLLECTION_TAGLINES.accessories}
        </p>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-16 md:px-16">
        <SectionTitle title="Accessories Collection" align="left" />
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
              scarcityNote={p.scarcityNote}
              bagProduct={toBagProduct(p)}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="ghost" asChild>
            <Link href="/collections/silk-sarees">Pair with Silk Sarees →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
