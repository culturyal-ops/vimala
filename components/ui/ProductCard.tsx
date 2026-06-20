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
        className="luxury-card relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl"
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
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            hovered && hoverImageUrl ? "scale-105 opacity-0" : "opacity-100"
          )}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
        />
        {hoverImageUrl && (
          <Image
            src={hoverImageUrl}
            alt={`${name} alternate view`}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              hovered ? "scale-105 opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          />
        )}

        {department && (
          <span className="glass-crimson pointer-events-none absolute left-2.5 top-2.5 z-[2] rounded-full px-2.5 py-1 font-body text-[9px] font-medium uppercase tracking-wider text-ivory sm:left-3 sm:top-3">
            {getDepartmentLabel(department)}
          </span>
        )}

        {isNew && !showPercentBadge && (
          <span className="pointer-events-none absolute right-2.5 top-2.5 z-[2] rounded-full bg-gold px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-wider text-ink shadow-skeuo sm:right-3 sm:top-3 sm:px-3">
            New
          </span>
        )}

        {showPercentBadge && (
          <span className="glass-crimson pointer-events-none absolute right-2.5 top-2.5 z-[2] rounded-full px-2.5 py-1 font-body text-[9px] font-medium text-ivory sm:right-3 sm:top-3">
            -{discount}%
          </span>
        )}

        {scarcityNote && (
          <span className="glass-dark pointer-events-none absolute bottom-2.5 left-2.5 z-[2] max-w-[80%] rounded-2xl px-2.5 py-1.5 font-body text-[9px] leading-tight text-ivory/90 sm:bottom-3 sm:left-3">
            {scarcityNote}
          </span>
        )}

        {wishKey && (
          <button
            type="button"
            onClick={handleWishlist}
            className="glass-panel touch-target absolute bottom-2.5 right-2.5 z-[2] flex h-10 w-10 items-center justify-center rounded-full text-crimson transition-transform active:scale-95 sm:bottom-3 sm:right-3"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-crimson")} />
          </button>
        )}

        {bagProduct && (
          <div className="absolute bottom-0 left-0 right-0 z-[2] hidden translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0 md:block">
            <AddToBagButton
              product={bagProduct}
              variant="ivory"
              buttonSize="sm"
              className="shadow-luxury-sm [&_button]:w-full [&_button]:text-xs"
            />
          </div>
        )}
      </div>

      <div className="relative z-[2] mt-3 flex min-w-0 flex-col gap-0.5 px-0.5 sm:mt-4 sm:gap-1">
        {showRating && <StoreRating size="sm" className="mb-0.5" />}
        {category && (
          <p className="truncate font-body text-[9px] uppercase tracking-[0.18em] text-ink/40 sm:text-[10px]">
            {category}
          </p>
        )}
        {href ? (
          <Link
            href={href}
            className="line-clamp-2 font-display text-base font-medium leading-snug text-ink transition-colors hover:text-crimson sm:text-lg"
          >
            {name}
          </Link>
        ) : (
          <h3 className="line-clamp-2 font-display text-base font-medium leading-snug text-ink sm:text-lg">
            {name}
          </h3>
        )}
        <p className="truncate font-body text-[11px] text-ink/50 sm:text-xs">{fabric}</p>
        <ProductPrice price={price} originalPrice={originalPrice} size="sm" />
        {sizes && (
          <p className="truncate font-body text-[10px] text-ink/40">
            Sizes: {sizes.join(", ")}
          </p>
        )}
        <a
          href={`${WHATSAPP_URL}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 hidden items-center gap-1.5 font-body text-xs font-medium text-green-700 hover:text-green-800 md:flex md:opacity-0 md:group-hover:opacity-100"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        {bagProduct && (
          <AddToBagButton
            product={bagProduct}
            variant="ghost"
            buttonSize="sm"
            className="mt-2 sm:mt-3 [&_button]:w-full [&_button]:text-xs"
          />
        )}
      </div>
    </div>
  );
}
