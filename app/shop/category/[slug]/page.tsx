import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import {
  CATEGORY_LABELS,
  CATEGORY_SLUGS,
  type CategorySlug,
} from "@/lib/navigation";
import { getCatalogProducts } from "@/lib/catalog-db";
import { CategoryPlp } from "@/components/shop/CategoryPlp";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return CATEGORY_SLUGS.filter((s) => s !== "all").map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug as CategorySlug;
  if (!CATEGORY_SLUGS.includes(slug)) return {};
  return pageMetadata({
    title: `${CATEGORY_LABELS[slug]} | Vimala Silk House`,
    description: `Shop ${CATEGORY_LABELS[slug].toLowerCase()} at Vimala Silk House, Kattappana.`,
    path: `/shop/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const slug = params.slug as CategorySlug;
  if (!CATEGORY_SLUGS.includes(slug) || slug === "all") notFound();

  const products = await getCatalogProducts();

  return (
    <div className="bg-canvas pt-header">
      <CategoryPlp slug={slug} products={products} />
    </div>
  );
}
