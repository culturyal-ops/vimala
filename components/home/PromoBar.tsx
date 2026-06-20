import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoBar() {
  return (
    <div className="bg-crimson py-4 text-center">
      <Link
        href="/shop?dept=silks"
        className="group inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.3em] text-ivory transition-colors hover:text-gold md:text-sm"
      >
        Bridal &amp; Festive Collections — Shop Silks, Readymade &amp; More
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
