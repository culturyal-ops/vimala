import type { EnrichedProduct } from "./product-seo";
import type { CategorySlug } from "./navigation";

export type PriceRangeId = "under-2k" | "2k-10k" | "10k-25k" | "above-25k";

export const PRICE_RANGES: {
  id: PriceRangeId;
  label: string;
  min: number;
  max: number | null;
}[] = [
  { id: "under-2k", label: "Under ₹2,000", min: 0, max: 1999 },
  { id: "2k-10k", label: "₹2,000 – ₹10,000", min: 2000, max: 10000 },
  { id: "10k-25k", label: "₹10,000 – ₹25,000", min: 10000, max: 25000 },
  { id: "above-25k", label: "Above ₹25,000", min: 25001, max: null },
];

export function getProductsForCategory(
  slug: CategorySlug,
  products: EnrichedProduct[]
): EnrichedProduct[] {
  if (slug === "all") {
    return products;
  }
  if (slug === "bridal") {
    return products.filter((p) => p.category.toLowerCase() === "bridal");
  }
  if (slug === "festive") {
    return products.filter((p) => p.category.toLowerCase() === "festive");
  }
  return products.filter((p) => p.department === slug);
}

export function getFabricsForProducts(products: EnrichedProduct[]): string[] {
  return Array.from(new Set(products.map((p) => p.fabric))).sort();
}

export function filterProducts(
  products: EnrichedProduct[],
  filters: {
    priceRanges: PriceRangeId[];
    fabrics: string[];
  }
): EnrichedProduct[] {
  return products.filter((product) => {
    const priceMatch =
      filters.priceRanges.length === 0 ||
      filters.priceRanges.some((rangeId) => {
        const range = PRICE_RANGES.find((r) => r.id === rangeId);
        if (!range) return false;
        if (range.max === null) return product.price >= range.min;
        return product.price >= range.min && product.price <= range.max;
      });

    const fabricMatch =
      filters.fabrics.length === 0 || filters.fabrics.includes(product.fabric);

    return priceMatch && fabricMatch;
  });
}

export type SortId = "featured" | "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "New Arrivals" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export function sortProducts(products: EnrichedProduct[], sort: SortId): EnrichedProduct[] {
  const list = [...products];

  switch (sort) {
    case "newest":
      return list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "featured":
    default:
      return list.sort((a, b) => {
        const scoreA =
          (a.isNew ? 2 : 0) + (a.scarcityNote ? 1 : 0) + (a.originalPrice ? 1 : 0);
        const scoreB =
          (b.isNew ? 2 : 0) + (b.scarcityNote ? 1 : 0) + (b.originalPrice ? 1 : 0);
        return scoreB - scoreA;
      });
  }
}
