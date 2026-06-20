"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { OCCASIONS } from "@/lib/constants";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function OccasionGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [featured, ...rest] = OCCASIONS;

  return (
    <section id="occasions" className="relative overflow-hidden bg-[#1B3022]">
      <div className="damask-pattern pointer-events-none absolute inset-0 opacity-40" />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative mx-auto max-w-[1440px] px-4 py-16 md:px-16 md:py-24"
      >
        <motion.div variants={fadeUp}>
          <SectionTitle
            title="Shop by Occasion"
            variant="dark"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          <motion.div variants={fadeUp}>
            <Link
              href={featured.href}
              className="group relative col-span-2 row-span-2 block aspect-[3/4] overflow-hidden rounded-2xl border border-gold/20 md:aspect-auto md:min-h-[520px]"
            >
            <Image
              src={featured.imageUrl}
              alt={featured.label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-display text-2xl text-ivory md:text-3xl">
                {featured.label}
              </span>
              <p className="mt-1 flex items-center gap-1 font-body text-xs text-ivory/70">
                Shop Now <ArrowRight className="h-3 w-3" />
              </p>
            </div>
            </Link>
          </motion.div>

          {rest.map((occasion) => (
            <motion.div key={occasion.label} variants={fadeUp}>
              <Link
                href={occasion.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-transparent transition-all hover:border-gold/40 md:aspect-auto md:min-h-[250px]"
              >
              <Image
                src={occasion.imageUrl}
                alt={occasion.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-base text-ivory md:text-lg">
                {occasion.label}
              </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <Button variant="ivory" asChild>
            <Link href="/shop">Explore All Departments</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
