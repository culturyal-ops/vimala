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

// Rotation for editorial feel
const ROTATIONS = [-2, 1.5, -1];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="overflow-hidden bg-parchment-warm py-20 md:py-28">
      <div className="page-container">

        {/* Header — ornament + serif heading */}
        <div className="mb-16 text-center">
          <div className="ornament-line mb-5 max-w-xs mx-auto">
            <span className="font-body text-[8px] uppercase tracking-[0.35em] text-antique/70">
              What Our Customers Say
            </span>
          </div>
          <h2 className="font-display text-4xl font-light text-ink md:text-5xl">
            Voices from{" "}
            <em className="font-script not-italic text-rouge" style={{ fontSize: "1.1em" }}>Kerala</em>
          </h2>
        </div>

        {/* Polaroid-style cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 lg:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 48, rotate: ROTATIONS[i] }}
              animate={isInView ? { opacity: 1, y: 0, rotate: ROTATIONS[i] } : {}}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ rotate: 0, scale: 1.01, transition: { duration: 0.35 } }}
              className="polaroid cursor-default"
            >
              {/* Image — 4:3 landscape in polaroid */}
              <div className="relative aspect-[4/3] overflow-hidden bg-parchment-deep">
                <Image
                  src={TESTIMONIAL_IMAGES[i]}
                  alt={`${t.name} — Vimala Silk House`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, 33vw"
                />
              </div>

              {/* Quote area — the big white polaroid bottom */}
              <div className="pt-5 pb-1 px-2">
                {/* Stars — small and refined */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-antique text-[10px]">★</span>
                  ))}
                </div>

                <p className="font-display text-sm font-light italic leading-[1.8] text-ink/60">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-antique/20" />
                  <div className="text-right">
                    <p className="font-body text-[10px] font-medium text-ink">{t.name}</p>
                    <p className="font-body text-[8px] uppercase tracking-[0.18em] text-stone">{t.city}</p>
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
