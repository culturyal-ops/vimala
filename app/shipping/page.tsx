import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title:
    "International Shipping for Silk Sarees & Fashion | Vimala Silk House",
  description:
    "Vimala Silk House ships silk sarees, bridal wear, and fashion worldwide. Learn about delivery times, customs, and order tracking for international customers.",
  path: "/shipping",
});

const SHIPPING_POINTS = [
  {
    title: "Delivery time",
    body: "Typically 7–14 business days depending on destination and customs processing.",
  },
  {
    title: "Customs & duties",
    body: "Import duties or taxes, if applicable, are the customer's responsibility and vary by country.",
  },
  {
    title: "Packaging",
    body: "Silk sarees and bridal pieces ship with extra protective packaging.",
  },
  {
    title: "Tracking",
    body: "Every order includes tracked international courier service.",
  },
  {
    title: "Returns",
    body: "International returns are handled case-by-case due to reverse shipping costs. Contact us on WhatsApp before ordering if you need clarity on your destination.",
  },
] as const;

export default function ShippingPage() {
  return (
    <div className="bg-ivory pt-header">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-16">
        <h1 className="font-display text-4xl font-medium text-crimson md:text-5xl">
          International Shipping
        </h1>

        <ul className="mt-10 space-y-5">
          {SHIPPING_POINTS.map((point) => (
            <li key={point.title}>
              <h3 className="font-body text-sm font-semibold text-ink">
                {point.title}
              </h3>
              <p className="mt-1 font-body text-sm text-ink/60">
                {point.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/collections/silk-sarees">Shop Silk Sarees</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
