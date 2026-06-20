"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import type { BagProduct } from "@/lib/cart";
import { formatPrice } from "@/lib/constants";
import { getDepartmentLabel, type DepartmentId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type MinimalProductCardProps = {
  name: string;
  price: number;
  href: string;
  imageUrl: string;
  brand?: string;
  department?: DepartmentId;
  originalPrice?: number;
  bagProduct?: BagProduct;
};

export function MinimalProductCard({
  name,
  price,
  href,
  imageUrl,
  brand,
  department,
  originalPrice,
  bagProduct,
}: MinimalProductCardProps) {
  const { addToBag } = useCart();
  const [hovered, setHovered] = useState(false);
  const displayBrand =
    brand ?? (department ? getDepartmentLabel(department) : "Vimala");

  return (
    <article 
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 border border-slate/40">
        <Link href={href} className="absolute inset-0 z-[1]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              hovered ? "scale-105" : "scale-100"
            )}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
        {bagProduct && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToBag(bagProduct);
            }}
            className="absolute bottom-4 right-4 z-[2] px-6 py-2.5 bg-white text-ink font-body text-xs uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-crimson hover:text-white"
            aria-label={`Add ${name} to bag`}
          >
            Add to Bag
          </button>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-stone">
          {displayBrand}
        </p>
        <Link
          href={href}
          className="block font-display text-lg font-light text-ink hover:text-crimson transition-colors leading-tight"
        >
          {name}
        </Link>
        <div className="flex items-baseline gap-2.5 pt-1">
          <span className="font-body text-base text-ink">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="font-body text-sm text-stone-light line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
