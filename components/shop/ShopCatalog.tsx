"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  DEPARTMENTS,
  getProductsByDepartment,
  type DepartmentId,
} from "@/lib/catalog";
import { enrichProduct, toBagProduct } from "@/lib/product-seo";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ALL_DEPT = "all" as const;

export function ShopCatalog() {
  const searchParams = useSearchParams();
  const deptParam = searchParams.get("dept") as DepartmentId | null;
  const activeDept =
    deptParam && DEPARTMENTS.some((d) => d.id === deptParam) ? deptParam : ALL_DEPT;

  const filtered = useMemo(
    () => getProductsByDepartment(activeDept),
    [activeDept]
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-16 md:py-20">
      <SectionTitle title="Shop All" align="left" />

      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <FilterPill href="/shop" active={activeDept === ALL_DEPT} label="All" />
        {DEPARTMENTS.map((d) => (
          <FilterPill
            key={d.id}
            href={`/shop?dept=${d.id}`}
            active={activeDept === d.id}
            label={d.label}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {filtered.map((product) => {
          const p = enrichProduct(product);
          return (
            <ProductCard
              key={product.id}
              href={`/shop/${p.slug}`}
              name={p.name}
                price={p.price}
                fabric={p.fabric}
                category={p.category}
                department={p.department}
                imageUrl={p.imageUrl}
                hoverImageUrl={p.hoverImageUrl}
                isNew={p.isNew}
                discount={p.discount}
                originalPrice={p.originalPrice}
                sizes={p.sizes}
                scarcityNote={p.scarcityNote}
                bagProduct={toBagProduct(p)}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center font-body text-ink/50">
          No products in this department yet.{" "}
          <Link href="/shop" className="text-crimson underline">
            View all
          </Link>
        </p>
      )}
    </div>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full border px-5 py-2 font-body text-xs font-medium uppercase tracking-wider transition-colors",
        active
          ? "border-crimson bg-crimson text-ivory"
          : "border-gold/30 bg-ivory text-ink hover:border-gold"
      )}
    >
      {label}
    </Link>
  );
}
