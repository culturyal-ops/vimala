"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { BagProduct } from "@/lib/cart";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import { WHATSAPP_URL } from "@/lib/constants";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/conversion";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StoreRating } from "@/components/ui/StoreRating";
import { Button } from "@/components/ui/button";
import { SizeGuideSheet } from "@/components/shop/SizeGuideSheet";
import { cn } from "@/lib/utils";

type ProductPurchasePanelProps = {
  product: BagProduct & {
    category: string;
    departmentLabel: string;
    originalPrice?: number;
    scarcityNote?: string;
    fabric: string;
  };
  whatsappMessage: string;
  selectedSize?: string;
  onSizeChange: (size: string) => void;
};

export function ProductPurchasePanel({
  product,
  whatsappMessage,
  selectedSize,
  onSizeChange,
}: ProductPurchasePanelProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-body text-xs uppercase tracking-[0.25em] text-ink/45">
          {product.departmentLabel} · {product.category}
        </p>
        <StoreRating size="md" />
      </div>
      <h1 className="mt-2 font-display text-3xl font-medium text-crimson md:text-4xl">
        {product.name}
      </h1>
      <p className="mt-3 font-body text-sm text-ink/50">{product.fabric}</p>

      <div className="mt-6">
        <ProductPrice
          price={product.price}
          originalPrice={product.originalPrice}
          size="lg"
        />
      </div>

      {product.scarcityNote && (
        <p className="mt-3 font-body text-xs text-gold-muted">
          {product.scarcityNote}
        </p>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-body text-[10px] uppercase tracking-widest text-ink/45">
              Select size
            </p>
            <SizeGuideSheet />
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSizeChange(s)}
                className={cn(
                  "touch-target rounded-full border px-4 py-2 font-body text-xs transition-all",
                  selectedSize === s
                    ? "border-crimson bg-crimson text-ivory shadow-skeuo"
                    : "border-gold/30 bg-ivory text-ink hover:border-gold hover:shadow-luxury-sm"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {!product.sizes?.length && (
        <div className="mt-4">
          <SizeGuideSheet />
        </div>
      )}

      <div className="glass-panel mt-5 rounded-2xl px-4 py-3">
        <p className="font-body text-xs text-ink/55">
          Gift-ready Vimala packaging · Free shipping over ₹
          {FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}
        </p>
      </div>

      <p className="mt-3 font-body text-xs text-ink/40">SKU: {product.sku}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <AddToBagButton
          product={product}
          selectedSize={selectedSize}
          requireSize={Boolean(product.sizes?.length)}
          className="sm:min-w-[180px] sm:flex-1"
        />
        <Button variant="outline" asChild className="sm:min-w-[180px]">
          <Link href={`${WHATSAPP_URL}?text=${whatsappMessage}`} target="_blank">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Link>
        </Button>
      </div>
    </div>
  );
}
