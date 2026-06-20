import { FREE_SHIPPING_THRESHOLD } from "@/lib/conversion";
import { CONTACT } from "@/lib/store-info";

export const PROMO_MESSAGES = [
  `Free shipping on orders over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}`,
  "Pure silk & bridal collections — trusted since 1987",
  "COD available across Kerala",
  "International shipping for NRI families",
  `Style advice on WhatsApp ${CONTACT.whatsapp}`,
  "New festive & wedding edits dropping weekly",
] as const;
