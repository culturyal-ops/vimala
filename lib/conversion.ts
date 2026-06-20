import { STORE } from "./store-info";

export const FREE_SHIPPING_THRESHOLD = 5000;

export const TRUST_STRIP_ITEMS = [
  {
    label: `Free shipping over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}`,
    shortLabel: "Free shipping ₹5,000+",
  },
  {
    label: "COD available across Kerala",
    shortLabel: "COD in Kerala",
  },
  {
    label: "Secure UPI, cards & net banking",
    shortLabel: "Secure payments",
  },
  {
    label: "In-store exchanges & WhatsApp support",
    shortLabel: "Easy exchanges",
  },
] as const;

export function formatStoreRating(): string {
  return `${STORE.rating.score}★ (${STORE.rating.count}+ reviews)`;
}

export function formatStoreRatingShort(): string {
  return `${STORE.rating.score}★ (${STORE.rating.count}+)`;
}

export function getSaveAmount(originalPrice: number, price: number): number {
  return originalPrice - price;
}
