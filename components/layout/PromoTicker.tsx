"use client";

import Link from "next/link";
import { PROMO_MESSAGES } from "@/lib/promo-messages";
import { CONTACT } from "@/lib/store-info";

export function PromoTicker() {
  const track = [...PROMO_MESSAGES, ...PROMO_MESSAGES];

  return (
    <div
      className="relative overflow-hidden border-b border-antique/20 bg-ink/95 py-2.5"
      aria-label="Store offers"
    >
      <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
        {track.map((msg, i) => (
          <span
            key={`${msg}-${i}`}
            className="inline-flex items-center gap-12 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-canvas sm:text-[11px]"
          >
            {msg}
            <span className="text-gold" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
      <Link
        href={CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-0 top-0 hidden h-full items-center bg-gradient-to-l from-ink via-ink to-transparent pl-8 pr-4 font-body text-[10px] font-medium uppercase tracking-widest text-gold hover:text-gold-light sm:flex"
      >
        Chat stylist →
      </Link>
    </div>
  );
}
