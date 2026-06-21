"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import type { BagProduct } from "@/lib/cart";
import { formatPrice } from "@/lib/constants";
import { getDepartmentLabel, type DepartmentId } from "@/lib/catalog";
import { getWishlistSlugs, toggleWishlistSlug } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

export type CatalogProductCardProps = {
  name: string;
  price: number;
  href: string;
  imageUrl: string;
  hoverImageUrl?: string;
  department?: DepartmentId;
  category?: string;
  productId?: string;
  originalPrice?: number;
  isNew?: boolean;
  scarcityNote?: string;
  bagProduct?: BagProduct;
};

export function CatalogProductCard({
  name,
  price,
  href,
  imageUrl,
  hoverImageUrl,
  department,
  category,
  productId,
  originalPrice,
  isNew,
  scarcityNote,
  bagProduct,
}: CatalogProductCardProps) {
  const { addToBag } = useCart();
  const wishKey = bagProduct?.slug;
  const [wishlisted, setWishlisted] = useState(
    () => wishKey !== undefined && getWishlistSlugs().includes(wishKey)
  );
  const [hovered, setHovered] = useState(false);

  const label = category ?? (department ? getDepartmentLabel(department) : "Vimala");

  return (
    <article
      className="group flex w-full min-w-0 flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-parchment-deep">
        <Link href={href} className="absolute inset-0 z-[1]" aria-label={`View ${name}`}>
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={cn(
              "object-cover transition-transform duration-500 ease-out",
              hovered && hoverImageUrl ? "scale-105 opacity-0" : "opacity-100"
            )}
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 22vw"
          />
          {hoverImageUrl && (
            <Image
              src={hoverImageUrl}
              alt=""
              fill
              className={cn(
                "object-cover transition-transform duration-500 ease-out",
                hovered ? "scale-105 opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 22vw"
            />
          )}
        </Link>

        {(isNew || scarcityNote) && (
          <div className="absolute left-0 top-0 z-[2] flex flex-col gap-1 p-2">
            {isNew && (
              <span className="bg-ink px-2.5 py-1 font-body text-[8px] font-medium uppercase tracking-[0.2em] text-parchment">
                New
              </span>
            )}
            {scarcityNote && (
              <span className="bg-rouge px-2.5 py-1 font-body text-[8px] uppercase tracking-[0.15em] text-parchment">
                {scarcityNote}
              </span>
            )}
          </div>
        )}

        <div className="absolute bottom-0 right-0 z-[2] flex gap-1 p-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          {wishKey !== undefined && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlistSlug(wishKey);
                setWishlisted(getWishlistSlugs().includes(wishKey));
              }}
              className="flex h-8 w-8 items-center justify-center bg-parchment text-ink transition-colors hover:text-rouge"
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart className={cn("h-3.5 w-3.5", wishlisted && "fill-rouge text-rouge")} />
            </button>
          )}
          {bagProduct && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addToBag(bagProduct);
              }}
              className="flex h-8 w-8 items-center justify-center bg-ink text-parchment transition-colors hover:bg-rouge"
              aria-label={`Add ${name} to bag`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 min-w-0 space-y-1.5">
        <p className="truncate font-body text-[8px] font-medium uppercase tracking-[0.22em] text-stone">
          {label}
        </p>
        <Link
          href={href}
          className="line-clamp-2 font-display text-base font-light leading-snug text-ink transition-colors hover:text-rouge"
        >
          {name}
        </Link>
        <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
          <span className="font-body text-sm text-ink">{formatPrice(price)}</span>
          {originalPrice !== undefined && originalPrice > price && (
            <>
              <span className="font-body text-xs text-stone line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="font-body text-[9px] uppercase tracking-wide text-rouge">
                Save {formatPrice(originalPrice - price)}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
