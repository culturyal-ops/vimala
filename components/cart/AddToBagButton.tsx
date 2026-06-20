"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { BagProduct } from "@/lib/cart";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AddToBagButtonProps = {
  product: BagProduct;
  selectedSize?: string;
  requireSize?: boolean;
  label?: string;
  onAdded?: () => void;
  buttonSize?: ButtonProps["size"];
} & Pick<ButtonProps, "variant" | "className">;

export function AddToBagButton({
  product,
  selectedSize,
  requireSize = false,
  label = "Add to Bag",
  onAdded,
  variant = "default",
  buttonSize = "default",
  className,
}: AddToBagButtonProps) {
  const { addToBag } = useCart();
  const [hint, setHint] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (requireSize && product.sizes?.length && !selectedSize) {
      setHint(true);
      return;
    }

    addToBag(product, { size: selectedSize });
    onAdded?.();
    setHint(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant={variant}
        size={buttonSize}
        className="w-full"
        onClick={handleClick}
      >
        {label}
      </Button>
      {hint && (
        <p className="mt-1 font-body text-[10px] text-crimson">
          Please select a size first
        </p>
      )}
    </div>
  );
}
