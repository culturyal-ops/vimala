export const CART_STORAGE_KEY = "vimala-bag";

export type BagLine = {
  lineId: string;
  productId: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
  size?: string;
  quantity: number;
};

export type BagProduct = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
  sizes?: string[];
};

export function makeLineId(productId: string, size?: string): string {
  return size ? `${productId}:${size}` : productId;
}

export function getBagSubtotal(items: BagLine[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getBagItemCount(items: BagLine[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function readBagFromStorage(): BagLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as BagLine[];
  } catch {
    return [];
  }
}

export function writeBagToStorage(items: BagLine[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
