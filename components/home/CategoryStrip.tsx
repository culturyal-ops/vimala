"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { fadeScale, staggerContainer } from "@/lib/animations";

export function CategoryStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="collections" className="overflow-hidden bg-ivory">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto max-w-[1440px] px-4 py-16 md:px-16 md:py-24"
      >
        <div className="mb-10 flex items-end justify-between">
          <SectionTitle
            title="Shop by Category"
            align="left"
            className="mb-0"
          />
          <Link
            href="/shop?dept=silks"
            className="hidden font-body text-xs font-medium uppercase tracking-widest text-crimson hover:text-gold md:block"
          >
            Browse All →
          </Link>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:justify-center md:overflow-visible md:pb-0">
          {CATEGORIES.map((category) => (
            <motion.a
              key={category.label}
              href={category.label === "Kanjivaram Silk" ? "/shop?dept=silks" : "/shop"}
              variants={fadeScale}
              className="group flex shrink-0 snap-center flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-gold/30 transition-transform duration-300 group-hover:scale-110" />
                <div className="relative m-1 h-20 w-20 overflow-hidden rounded-full border-2 border-gold/50 md:h-24 md:w-24">
                  <Image
                    src={category.imageUrl}
                    alt={category.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="96px"
                  />
                </div>
              </div>
              <div className="text-center">
                <span className="block font-display text-xs font-medium uppercase tracking-wider text-ink md:text-sm">
                  {category.label}
                </span>
                <span className="mt-0.5 block font-body text-[10px] text-ink/40">
                  {category.count} pieces
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
