import Link from "next/link";
import { Package } from "lucide-react";
import { CONTACT } from "@/lib/store-info";
import { Button } from "@/components/ui/button";

export function BulkOrderBanner() {
  const message = encodeURIComponent(
    "Hi, I'd like to enquire about a bulk clothing order for an event/wedding."
  );

  return (
    <section className="bg-crimson">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 py-14 text-center md:flex-row md:justify-between md:px-16 md:text-left">
        <div className="flex items-start gap-4">
          <Package className="mt-1 hidden h-8 w-8 shrink-0 text-gold md:block" />
          <div>
            <h2 className="font-display text-2xl font-medium uppercase tracking-wide text-ivory md:text-3xl">
              Bulk Orders Welcome
            </h2>
            <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-ivory/70">
              Weddings, festivals, community programmes. We maintain inventory
              for large orders. Readymade garments in standard sizes only.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button variant="gold" asChild>
            <Link href="/bulk-orders">Request a Quote</Link>
          </Button>
          <Button variant="outline" asChild className="border-ivory/40 text-ivory hover:bg-ivory/10">
            <Link href={`${CONTACT.whatsappUrl}?text=${message}`} target="_blank">
              WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
