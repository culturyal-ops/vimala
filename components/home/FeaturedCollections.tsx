"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { FEATURED_COLLECTIONS } from "@/lib/constants";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function FeaturedCollections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="overflow-hidden bg-ivory-warm">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto max-w-[1440px] px-4 py-16 md:px-16 md:py-24"
      >
        <div className="mb-10 flex items-end justify-between">
          <SectionTitle
            title="Featured Collections"
            align="left"
            className="mb-0"
          />
          <Link
            href="/shop"
            className="hidden shrink-0 font-body text-xs font-medium uppercase tracking-widest text-crimson hover:text-gold md:block"
          >
            View All →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:pb-0">
          {FEATURED_COLLECTIONS.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              className="group min-w-[200px] shrink-0 snap-center md:min-w-0"
            >
              <Link href={item.href} className="block">
                <ArchFrame className="premium-card-shadow transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 200px, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-0 right-0 text-center font-display text-sm uppercase tracking-wider text-ivory">
                      {item.label}
                    </span>
                  </div>
                </ArchFrame>
                <div className="gold-gradient mt-4 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-ink shadow-sm transition-shadow group-hover:shadow-md">
                  <Plus className="h-3.5 w-3.5" />
                  Explore
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
