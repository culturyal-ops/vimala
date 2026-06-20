"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
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
  const displayBrand =
    brand ?? (department ? getDepartmentLabel(department) : "Vimala");

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Link href={href} className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#722F37] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            aria-label={`Add ${name} to bag`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="mt-2.5 space-y-0.5">
        <p className="font-body text-[10px] uppercase tracking-wider text-ink/40">
          {displayBrand}
        </p>
        <Link
          href={href}
          className="line-clamp-1 font-body text-sm text-ink hover:text-[#722F37]"
        >
          {name}
        </Link>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-body text-sm font-semibold text-[#722F37]">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="font-body text-xs text-ink/35 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
