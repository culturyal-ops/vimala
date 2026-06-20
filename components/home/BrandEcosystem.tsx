"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BRAND_ECOSYSTEM } from "@/lib/store-info";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function BrandEcosystem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="border-y border-gold/15 bg-ivory">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto max-w-[1440px] px-4 py-16 md:px-16 md:py-20"
      >
        <SectionTitle title="The Vimala Legacy" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND_ECOSYSTEM.map((brand) => (
            <motion.div
              key={brand.name}
              variants={fadeUp}
              className="rounded-2xl border border-gold/15 bg-ivory-warm p-6 text-center"
            >
              <h3 className="font-display text-lg font-medium text-crimson">
                {brand.name}
              </h3>
              <p className="mt-2 font-body text-xs leading-relaxed text-ink/55">
                {brand.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
