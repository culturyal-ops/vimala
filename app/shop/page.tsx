import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/lib/catalog-db";
import { CategoryPlp } from "@/components/shop/CategoryPlp";

export const metadata: Metadata = pageMetadata({
  title: "Shop Fashion & Silk Sarees Online | Vimala Silk House",
  description:
    "Browse silk sarees, bridal wear, readymade fashion, accessories and more from Vimala Silk House, Kattappana.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getCatalogProducts();

  return (
    <div className="bg-canvas pt-header">
      <CategoryPlp slug="all" products={products} />
    </div>
  );
}
