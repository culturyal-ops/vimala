"use client";

import { useState } from "react";
import type { BagProduct } from "@/lib/cart";
import { ProductPurchasePanel } from "@/components/shop/ProductPurchasePanel";
import { ProductStickyBar } from "@/components/shop/ProductStickyBar";

type ProductPageClientProps = {
  bagProduct: BagProduct;
  category: string;
  departmentLabel: string;
  originalPrice?: number;
  scarcityNote?: string;
  fabric: string;
  whatsappMessage: string;
};

export function ProductPageClient({
  bagProduct,
  category,
  departmentLabel,
  originalPrice,
  scarcityNote,
  fabric,
  whatsappMessage,
}: ProductPageClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const requireSize = Boolean(bagProduct.sizes?.length);

  return (
    <>
      <ProductStickyBar
        name={bagProduct.name}
        price={bagProduct.price}
        originalPrice={originalPrice}
        whatsappMessage={whatsappMessage}
        bagProduct={bagProduct}
        selectedSize={selectedSize}
        requireSize={requireSize}
      />
      <ProductPurchasePanel
        product={{
          ...bagProduct,
          category,
          departmentLabel,
          originalPrice,
          scarcityNote,
          fabric,
        }}
        whatsappMessage={whatsappMessage}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
      />
    </>
  );
}
