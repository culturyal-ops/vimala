"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import type { BagProduct } from "@/lib/cart";
import { WHATSAPP_URL } from "@/lib/constants";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { Button } from "@/components/ui/button";

type ProductStickyBarProps = {
  name: string;
  price: number;
  originalPrice?: number;
  whatsappMessage: string;
  bagProduct: BagProduct;
  selectedSize?: string;
  requireSize?: boolean;
};

export function ProductStickyBar({
  name,
  price,
  originalPrice,
  whatsappMessage,
  bagProduct,
  selectedSize,
  requireSize,
}: ProductStickyBarProps) {
  return (
    <div
      className="glass-panel fixed bottom-0 left-0 right-0 z-40 border-t border-gold/25 px-4 py-3 shadow-luxury md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-body text-[10px] uppercase tracking-wider text-ink/45">
            {name}
          </p>
          <ProductPrice
            price={price}
            originalPrice={originalPrice}
            size="sm"
            className="mt-0.5 [&_span]:text-base"
          />
        </div>
        <AddToBagButton
          product={bagProduct}
          selectedSize={selectedSize}
          requireSize={requireSize}
          buttonSize="sm"
          className="shrink-0 [&_button]:px-3 [&_button]:text-xs"
        />
        <Button asChild size="sm" variant="outline" className="shrink-0 px-2">
          <Link
            href={`${WHATSAPP_URL}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
