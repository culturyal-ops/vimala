import { TRUST_STRIP_ITEMS } from "@/lib/conversion";
import { STORE } from "@/lib/store-info";

export function TrustStrip() {
  return (
    <section className="border-y border-antique/25 bg-parchment-warm" aria-label="Store guarantees">
      <div className="page-container">
        <div className="flex gap-10 overflow-x-auto py-4 scrollbar-none md:justify-center md:overflow-visible md:py-5">
          {TRUST_STRIP_ITEMS.map((item) => (
            <div key={item.label} className="flex shrink-0 items-center gap-3">
              {/* Fine ornamental dot */}
              <span className="text-antique/60 text-xs" aria-hidden>✦</span>
              <span className="whitespace-nowrap font-body text-[9px] font-medium uppercase tracking-[0.2em] text-stone">
                <span className="md:hidden">{item.shortLabel}</span>
                <span className="hidden md:inline">{item.label}</span>
              </span>
            </div>
          ))}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <span className="text-antique/60 text-xs" aria-hidden>✦</span>
            <span className="font-body text-[9px] font-medium uppercase tracking-[0.2em] text-stone">
              {STORE.rating.score}★ · {STORE.rating.count}+ Reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
