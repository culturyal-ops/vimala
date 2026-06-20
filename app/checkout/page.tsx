import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = pageMetadata({
  title: "Checkout | Vimala Silk House",
  description: "Review your bag and complete your order at Vimala Silk House.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <div className="bg-ivory pt-header">
      <CheckoutClient />
    </div>
  );
}
