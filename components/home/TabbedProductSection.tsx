"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EnrichedProduct } from "@/lib/product-seo";
import { getHomeProductsForTab, type HomeProductTab } from "@/lib/home-catalog";
import { toBagProduct } from "@/lib/product-seo";
import { CatalogProductCard } from "@/components/ui/CatalogProductCard";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "new", label: "New Arrivals" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "trending", label: "Trending" },
] as const;

type TabbedProductSectionProps = {
  catalog: EnrichedProduct[];
};

export function TabbedProductSection({ catalog }: TabbedProductSectionProps) {
  const [activeTab, setActiveTab] = useState<HomeProductTab>("new");
  const products = useMemo(
    () => getHomeProductsForTab(activeTab, catalog),
    [activeTab, catalog]
  );

  return (
    <section className="border-t border-gold/20 bg-canvas section-pad">
      <div className="page-container">
        <div className="mb-8 flex items-end justify-between border-b border-gold/20 pb-5">
          <div>
            <p className="mb-2 font-body text-[9px] uppercase tracking-[0.5em] text-stone">Curated Edit</p>
            <h2 className="font-script text-4xl text-ink md:text-5xl">Shop the Selection</h2>
          </div>
          <Link
            href="/shop"
            className="hidden font-body text-[9px] font-medium uppercase tracking-[0.25em] text-ink-muted hover:text-crimson sm:inline"
          >
            View all →
          </Link>
        </div>

        <div className="mb-8 flex gap-7 overflow-x-auto border-b border-gold/20 pb-px scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 border-b-2 pb-3 font-body text-[10px] font-medium uppercase tracking-[0.2em] transition-colors",
                activeTab === tab.id
                  ? "border-crimson text-crimson"
                  : "border-transparent text-stone hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {products.map((p) => (
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
      </div>
    </section>
  );
}
