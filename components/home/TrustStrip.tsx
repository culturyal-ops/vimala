import { Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";
import { TRUST_STRIP_ITEMS } from "@/lib/conversion";
import { STORE } from "@/lib/store-info";

const icons = [Truck, ShieldCheck, RotateCcw, Star];

export function TrustStrip() {
  return (
    <section
      className="border-b border-border bg-surface"
      aria-label="Store guarantees"
    >
      <div className="page-container py-3">
        <div className="flex gap-8 overflow-x-auto scrollbar-none md:justify-center md:overflow-visible">
          {TRUST_STRIP_ITEMS.map((item, i) => {
            const Icon = icons[i];
            return (
              <div
                key={item.label}
                className="flex shrink-0 items-center gap-2 text-ink-muted"
              >
                <Icon className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                <span className="whitespace-nowrap font-body text-[10px] font-medium uppercase tracking-[0.14em] sm:text-[11px]">
                  <span className="md:hidden">{item.shortLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              </div>
            );
          })}
          <div className="hidden shrink-0 items-center gap-2 text-ink-muted md:flex">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em]">
              {STORE.rating.score}★ · {STORE.rating.count}+ reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
