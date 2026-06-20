"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/lib/recently-viewed";

type ProductViewTrackerProps = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
};

export function ProductViewTracker({
  productId,
  slug,
  name,
  price,
  imageUrl,
}: ProductViewTrackerProps) {
  useEffect(() => {
    addRecentlyViewed({ productId, slug, name, price, imageUrl });
    window.dispatchEvent(new Event("vimala-recently-viewed"));
  }, [productId, slug, name, price, imageUrl]);

  return null;
}
