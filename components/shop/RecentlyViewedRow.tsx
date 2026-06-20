"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentlyViewed, type RecentItem } from "@/lib/recently-viewed";
import { getProductBySlug, toBagProduct } from "@/lib/product-seo";
import { CatalogProductCard } from "@/components/ui/CatalogProductCard";

export function RecentlyViewedRow() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const load = () => setItems(getRecentlyViewed());
    load();
    window.addEventListener("vimala-recently-viewed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("vimala-recently-viewed", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface section-pad">
      <div className="page-container">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-display-md text-ink">Recently Viewed</h2>
          <Link
            href="/shop"
            className="font-body text-[10px] font-medium uppercase tracking-widest text-ink-muted hover:text-crimson"
          >
            Continue shopping →
          </Link>
        </div>
        <div className="product-grid">
          {items.slice(0, 4).map((item) => {
            const product = getProductBySlug(item.slug);
            if (!product) return null;
            return (
              <CatalogProductCard
                key={item.slug}
                href={`/shop/${product.slug}`}
                name={product.name}
                price={product.price}
                category={product.category}
                department={product.department}
                productId={product.id}
                imageUrl={product.imageUrl}
                hoverImageUrl={product.hoverImageUrl}
                originalPrice={product.originalPrice}
                bagProduct={toBagProduct(product)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
