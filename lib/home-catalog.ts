import type { EnrichedProduct } from "@/lib/product-seo";

export type HomeProductTab = "new" | "bestsellers" | "trending";

export function getHomeProductsForTab(
  tab: HomeProductTab,
  catalog: EnrichedProduct[]
): EnrichedProduct[] {
  switch (tab) {
    case "new":
      return catalog.filter((p) => p.isNew).slice(0, 8);
    case "bestsellers":
      return [...catalog].sort((a, b) => b.price - a.price).slice(0, 8);
    case "trending":
      return catalog
        .filter(
          (p) =>
            p.category.toLowerCase() === "bridal" ||
            p.category.toLowerCase() === "festive"
        )
        .slice(0, 8);
    default:
      return catalog.slice(0, 8);
  }
}

export function getHomeNewArrivals(catalog: EnrichedProduct[]): EnrichedProduct[] {
  return catalog.filter((p) => p.isNew).slice(0, 8);
}
