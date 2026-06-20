"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

type BagButtonProps = {
  className?: string;
};

export function BagButton({ className }: BagButtonProps) {
  const { itemCount, openBag } = useCart();

  return (
    <button
      type="button"
      aria-label={`Bag, ${itemCount} items`}
      onClick={openBag}
      className={cn("relative text-ink/70 hover:text-crimson", className)}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-body text-[9px] font-bold text-ink">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}
