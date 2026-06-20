"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import { formatPrice, WHATSAPP_URL } from "@/lib/constants";
import type { BagProduct } from "@/lib/cart";
import { getDepartmentLabel, type DepartmentId } from "@/lib/catalog";
import { getWishlistSlugs, toggleWishlistSlug } from "@/lib/wishlist";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StoreRating } from "@/components/ui/StoreRating";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  name: string;
  price: number;
  fabric: string;
  href?: string;
  category?: string;
  department?: DepartmentId;
  productId?: string;
  slug?: string;
  imageUrl: string;
  hoverImageUrl?: string;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number;
  sizes?: string[];
  scarcityNote?: string;
  showRating?: boolean;
  bagProduct?: BagProduct;
}

export function ProductCard({
  name,
  price,
  fabric,
  href,
  category,
  department,
  productId,
  slug,
  imageUrl,
  hoverImageUrl,
  isNew,
  discount,
  originalPrice,
  sizes,
  scarcityNote,
  showRating = true,
  bagProduct,
}: ProductCardProps) {
  const wishKey = slug ?? bagProduct?.slug;
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!wishKey) return;
    setWishlisted(getWishlistSlugs().includes(wishKey));
    const sync = () => {
      if (wishKey) setWishlisted(getWishlistSlugs().includes(wishKey));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("vimala-wishlist", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("vimala-wishlist", sync);
    };
  }, [wishKey]);

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in ${name} (${formatPrice(price)}). Can you share more details?`
  );

  const showPercentBadge = discount && !originalPrice;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!wishKey) return;
    toggleWishlistSlug(wishKey);
    setWishlisted(getWishlistSlugs().includes(wishKey));
    window.dispatchEvent(new Event("vimala-wishlist"));
  };

  return (
    <div className="group flex w-full min-w-0 flex-col">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-slate/30"
        style={{ borderRadius: '12px' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {href && (
          <Link
            href={href}
            className="absolute inset-0 z-[1]"
            aria-label={`View ${name}`}
          />
        )}
        <div className="absolute inset-0 border border-slate/60 rounded-xl pointer-events-none z-[3]" />
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            hovered && hoverImageUrl ? "scale-105 opacity-0" : "scale-100 opacity-100"
          )}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
        />
        {hoverImageUrl && (
          <Image
            src={hoverImageUrl}
            alt={`${name} alternate view`}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              hovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
            )}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          />
        )}

        {department && (
          <span className="glass-crimson absolute left-3 top-3 z-[2] rounded-lg px-3 py-1.5 font-body text-[9px] font-medium uppercase tracking-wider text-ivory">
            {getDepartmentLabel(department)}
          </span>
        )}

        {isNew && !showPercentBadge && (
          <span className="absolute right-3 top-3 z-[2] rounded-lg bg-crimson px-3 py-1.5 font-body text-[9px] font-semibold uppercase tracking-wider text-white shadow-premium-sm">
            New
          </span>
        )}

        {showPercentBadge && (
          <span className="glass-crimson absolute right-3 top-3 z-[2] rounded-lg px-3 py-1.5 font-body text-[9px] font-medium text-ivory">
            {discount}% Off
          </span>
        )}

        {scarcityNote && (
          <span className="glass-dark absolute bottom-3 left-3 z-[2] max-w-[80%] rounded-lg px-3 py-2 font-body text-[9px] leading-tight text-ivory/95">
            {scarcityNote}
          </span>
        )}

        {wishKey && (
          <button
            type="button"
            onClick={handleWishlist}
            className="glass-panel touch-target absolute bottom-3 right-3 z-[2] flex h-10 w-10 items-center justify-center rounded-full text-crimson transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-4 w-4 transition-all", wishlisted && "fill-crimson scale-110")} />
          </button>
        )}

        {bagProduct && (
          <div className="absolute bottom-0 left-0 right-0 z-[2] hidden translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0 md:block">
            <AddToBagButton
              product={bagProduct}
              variant="ivory"
              buttonSize="sm"
              className="shadow-premium-sm [&_button]:w-full [&_button]:text-xs"
            />
          </div>
        )}
      </div>

      <div className="relative z-[2] mt-4 flex min-w-0 flex-col gap-1 px-0.5">
        {showRating && <StoreRating size="sm" className="mb-1" />}
        {category && (
          <p className="truncate font-body text-[10px] uppercase tracking-[0.2em] text-stone">
            {category}
          </p>
        )}
        {href ? (
          <Link
            href={href}
            className="line-clamp-2 font-display text-lg font-medium leading-snug text-ink transition-colors hover:text-crimson"
          >
            {name}
          </Link>
        ) : (
          <h3 className="line-clamp-2 font-display text-lg font-medium leading-snug text-ink">
            {name}
          </h3>
        )}
        <p className="truncate font-body text-xs text-stone-light">{fabric}</p>
        <ProductPrice price={price} originalPrice={originalPrice} size="sm" className="mt-0.5" />
        {sizes && (
          <p className="truncate font-body text-[10px] text-stone-light">
            Available: {sizes.join(", ")}
          </p>
        )}
        <a
          href={`${WHATSAPP_URL}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 hidden items-center gap-1.5 font-body text-xs font-medium text-green-700 transition-all hover:text-green-800 md:flex md:opacity-0 md:group-hover:opacity-100"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Ask on WhatsApp
        </a>
        {bagProduct && (
          <AddToBagButton
            product={bagProduct}
            variant="ghost"
            buttonSize="sm"
            className="mt-3 [&_button]:w-full [&_button]:text-xs"
          />
        )}
      </div>
    </div>
  );
}
