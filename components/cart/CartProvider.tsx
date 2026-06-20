"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type BagLine,
  type BagProduct,
  getBagItemCount,
  getBagSubtotal,
  makeLineId,
  readBagFromStorage,
  writeBagToStorage,
} from "@/lib/cart";

type CartContextValue = {
  items: BagLine[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addToBag: (product: BagProduct, options?: { size?: string; quantity?: number }) => void;
  removeFromBag: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearBag: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readBagFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeBagToStorage(items);
  }, [items, hydrated]);

  const addToBag = useCallback(
    (product: BagProduct, options?: { size?: string; quantity?: number }) => {
      const size = options?.size;
      const quantity = options?.quantity ?? 1;
      const lineId = makeLineId(product.productId, size);

      setItems((prev) => {
        const existing = prev.find((line) => line.lineId === lineId);
        if (existing) {
          return prev.map((line) =>
            line.lineId === lineId
              ? { ...line, quantity: line.quantity + quantity }
              : line
          );
        }
        return [
          ...prev,
          {
            lineId,
            productId: product.productId,
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            size,
            quantity,
          },
        ];
      });
      setIsOpen(true);
    },
    []
  );

  const removeFromBag = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((line) => line.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((line) => line.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((line) =>
        line.lineId === lineId ? { ...line, quantity } : line
      )
    );
  }, []);

  const clearBag = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: getBagItemCount(items),
      subtotal: getBagSubtotal(items),
      isOpen,
      openBag: () => setIsOpen(true),
      closeBag: () => setIsOpen(false),
      addToBag,
      removeFromBag,
      updateQuantity,
      clearBag,
    }),
    [items, isOpen, addToBag, removeFromBag, updateQuantity, clearBag]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
