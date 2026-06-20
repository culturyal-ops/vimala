import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BulkOrderForm } from "@/components/bulk/BulkOrderForm";

export const metadata: Metadata = pageMetadata({
  title:
    "Bulk Clothing Orders for Weddings & Functions | Vimala Silk House",
  description:
    "Need bulk readymade outfits for a wedding, festival, or community event? Vimala Silk House supplies bulk orders across Kerala and internationally.",
  path: "/bulk-orders",
});

export default function BulkOrdersPage() {
  return (
    <div className="bg-ivory pt-header">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-16">
        <h1 className="font-display text-4xl font-medium text-crimson md:text-5xl">
          Bulk Clothing Orders
        </h1>
        <p className="mt-3 font-body text-sm text-ink/55">
          Weddings, festivals, and community events.
        </p>
        <BulkOrderForm />
      </div>
    </div>
  );
}
