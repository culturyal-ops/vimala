import type { EnrichedProduct } from "@/lib/product-seo";
import { toBagProduct } from "@/lib/product-seo";
import { CatalogProductCard } from "@/components/ui/CatalogProductCard";

type CompleteTheLookProps = {
  products: EnrichedProduct[];
};

export function CompleteTheLook({ products }: CompleteTheLookProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-12 sm:mt-20 sm:pt-16">
      <p className="label-caps mb-2">Style It</p>
      <h2 className="mb-8 font-display text-display-md text-ink">Complete the Look</h2>
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
            bagProduct={toBagProduct(p)}
          />
        ))}
      </div>
      <p className="mt-8 text-center font-body text-xs text-stone">
        Gift-ready Vimala packaging on every order.
      </p>
    </div>
  );
}
