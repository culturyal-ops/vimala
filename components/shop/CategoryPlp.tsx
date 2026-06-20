"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  type CategorySlug,
} from "@/lib/navigation";
import type { EnrichedProduct } from "@/lib/product-seo";
import {
  filterProducts,
  getFabricsForProducts,
  getProductsForCategory,
  sortProducts,
  type PriceRangeId,
  type SortId,
} from "@/lib/plp-filters";
import { toBagProduct } from "@/lib/product-seo";
import { CatalogProductCard } from "@/components/ui/CatalogProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import { MobileFilterBar, PlpFilters, PlpToolbar } from "@/components/shop/PlpFilters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CategoryPlpProps = {
  slug: CategorySlug;
  products: EnrichedProduct[];
};

export function CategoryPlp({ slug, products }: CategoryPlpProps) {
  const [selectedPrices, setSelectedPrices] = useState<PriceRangeId[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [sort, setSort] = useState<SortId>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, [slug, selectedPrices, selectedFabrics, sort]);

  const baseProducts = useMemo(
    () => getProductsForCategory(slug, products),
    [slug, products]
  );
  const fabrics = useMemo(
    () => getFabricsForProducts(baseProducts),
    [baseProducts]
  );

  const filtered = useMemo(() => {
    const filteredList = filterProducts(baseProducts, {
      priceRanges: selectedPrices,
      fabrics: selectedFabrics,
    });
    return sortProducts(filteredList, sort);
  }, [baseProducts, selectedPrices, selectedFabrics, sort]);

  const activeFilterCount = selectedPrices.length + selectedFabrics.length;

  const togglePrice = (id: PriceRangeId) => {
    setReady(false);
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleFabric = (fabric: string) => {
    setReady(false);
    setSelectedFabrics((prev) =>
      prev.includes(fabric)
        ? prev.filter((f) => f !== fabric)
        : [...prev, fabric]
    );
  };

  const clearFilters = () => {
    setReady(false);
    setSelectedPrices([]);
    setSelectedFabrics([]);
  };

  const filterProps = {
    fabrics,
    selectedPrices,
    selectedFabrics,
    onPriceChange: togglePrice,
    onFabricChange: toggleFabric,
    onClear: clearFilters,
  };

  return (
    <div className="page-container py-6 sm:py-8 md:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-medium text-crimson sm:text-3xl md:text-4xl">
          {CATEGORY_LABELS[slug]}
        </h1>
      </div>

      <MobileFilterBar
        count={activeFilterCount}
        onOpen={() => setFiltersOpen(true)}
      />

      <div className="flex gap-6 lg:gap-10">
        <div className="hidden w-[26%] max-w-[280px] shrink-0 lg:block">
          <div className="sticky top-[calc(var(--header-height)+1rem)]">
            <PlpFilters {...filterProps} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <PlpToolbar
            sort={sort}
            onSortChange={(next) => {
              setReady(false);
              setSort(next);
            }}
            selectedPrices={selectedPrices}
            selectedFabrics={selectedFabrics}
            onRemovePrice={togglePrice}
            onRemoveFabric={toggleFabric}
            onClearAll={clearFilters}
            resultCount={filtered.length}
          />

          {!ready ? (
            <div className="product-grid">
              <ProductGridSkeleton count={8} />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center font-body text-ink/50">
              No products match your filters.
            </p>
          ) : (
            <div className="product-grid">
              {filtered.map((p) => (
                  <CatalogProductCard
                    key={p.id}
                    href={`/shop/${p.slug}`}
                    name={p.name}
                    price={p.price}
                    category={p.category}
                    department={p.department}
                    productId={p.id}
                    imageUrl={p.imageUrl}
                    hoverImageUrl={p.hoverImageUrl}
                    isNew={p.isNew}
                    originalPrice={p.originalPrice}
                    scarcityNote={p.scarcityNote}
                    bagProduct={toBagProduct(p)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="flat-panel border-border bg-canvas sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-display text-crimson">Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <PlpFilters {...filterProps} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
