"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";

const TESTIMONIAL_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="overflow-hidden bg-ivory-cream py-20 md:py-28">
      <div className="page-container">
        <div className="mb-14 text-center">
          <p className="mb-3 font-body text-[9px] uppercase tracking-[0.5em] text-stone">Reviews</p>
          <h2 className="font-display text-3xl font-light text-ink md:text-4xl">
            What our customers say about{" "}
            <span className="font-script text-5xl text-crimson md:text-6xl">us</span>
          </h2>
        </div>

        {/* Polaroid grid testimonials like the Showit reference */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -2 : 2 }}
              animate={isInView ? { opacity: 1, y: 0, rotate: i % 2 === 0 ? -1 : 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group"
            >
              {/* Polaroid card */}
              <div className="bg-ivory p-3 shadow-premium-md transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.02] group-hover:shadow-premium-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={TESTIMONIAL_IMAGES[i]}
                    alt={`${t.name}'s purchase`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="px-2 pb-2 pt-4">
                  <p className="font-display text-sm font-light italic leading-relaxed text-ink/70">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-gold/20 pt-3">
                    <div>
                      <p className="font-body text-xs font-medium text-ink">{t.name}</p>
                      <p className="font-body text-[9px] uppercase tracking-widest text-stone">{t.city}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <span key={j} className="text-gold text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
