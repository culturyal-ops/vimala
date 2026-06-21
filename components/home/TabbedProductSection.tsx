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

type TabbedProductSectionProps = { catalog: EnrichedProduct[] };

export function TabbedProductSection({ catalog }: TabbedProductSectionProps) {
  const [activeTab, setActiveTab] = useState<HomeProductTab>("new");
  const products = useMemo(() => getHomeProductsForTab(activeTab, catalog), [activeTab, catalog]);

  return (
    <section className="bg-parchment section-pad">
      <div className="page-container">

        {/* Section header — asymmetric editorial */}
        <div className="mb-12 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="editorial-label mb-3">Curated Edit</p>
            {/* Mixed serif + script heading */}
            <h2 className="font-display text-4xl font-light leading-none text-ink md:text-5xl lg:text-[3.75rem]">
              Shop the{" "}
              <em className="font-script not-italic text-rouge" style={{ fontSize: "1.05em" }}>
                Selection
              </em>
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 self-end font-body text-[9px] uppercase tracking-[0.25em] text-stone transition-colors hover:text-rouge md:mt-0 md:pb-2"
          >
            View All →
          </Link>
        </div>

        {/* Tabs — thin lines, no background fill */}
        <div className="mb-10 flex gap-8 overflow-x-auto border-b border-antique/20 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 pb-3.5 font-body text-[9px] uppercase tracking-[0.2em] transition-colors border-b-[1.5px] -mb-px",
                activeTab === tab.id
                  ? "border-rouge text-rouge"
                  : "border-transparent text-stone hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
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
