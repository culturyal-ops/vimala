"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CRAFT_STATS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function CraftStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-ivory-cream overflow-hidden">
      {/* Top: full-width atmospheric image with text overlay */}
      <div className="relative h-[55vw] max-h-[520px] min-h-[300px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1600"
          alt="Inside Vimala Silk House"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-deep/80 via-crimson/40 to-transparent" />
        <div className="absolute inset-0 damask-pattern opacity-10" />
        <div className="absolute inset-0 flex items-center">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-lg"
            >
              <p className="mb-3 font-body text-[9px] uppercase tracking-[0.5em] text-gold/70">
                Est. 1987, Kattappana
              </p>
              <h2 className="font-display text-3xl font-light text-ivory md:text-5xl">
                Kattappana&apos;s Home for
                <br />
                <span className="font-script text-5xl md:text-7xl">Silk &amp; Style</span>
              </h2>
              <p className="mt-4 font-display text-sm font-light italic text-ivory/60 md:text-base">
                Three generations of trust. Eight departments under one roof.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Story section: small portrait left, body text centre, large lifestyle image right */}
      <div className="page-container py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">

          {/* Left column: small stacked images like the Italy reference */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex flex-row gap-4 md:col-span-3 md:flex-col"
          >
            <div className="relative aspect-[3/4] w-1/2 overflow-hidden md:w-full">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"
                alt="Silk weaving detail"
                fill
                className="object-cover grayscale-[20%] sepia-[10%]"
                sizes="(max-width: 768px) 50vw, 200px"
              />
            </div>
            <div className="relative aspect-square w-1/2 overflow-hidden md:w-full">
              <Image
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400"
                alt="Gold jewellery accessories"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 200px"
              />
            </div>
          </motion.div>

          {/* Centre: story text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col justify-center md:col-span-5"
          >
            <div className="mb-6 h-[1px] w-10 bg-gold/50" />
            <p className="mb-2 font-body text-[9px] uppercase tracking-[0.5em] text-stone">Our Heritage</p>
            <h3 className="mb-5 font-display text-2xl font-light text-ink md:text-3xl">
              More than a store —<br />a family institution
            </h3>
            <p className="font-display text-sm font-light leading-loose text-ink/55 md:text-base">
              Since 1987, Vimala Silk House has been where Kattappana&apos;s families
              come for every milestone — weddings, Onam, first days of school,
              and everything in between. Pure silks from the finest looms, bridal
              trousseaus, and eight departments of fashion under one roof.
            </p>
            <p className="mt-4 font-display text-sm font-light leading-loose text-ink/55 md:text-base">
              Every saree is chosen with care. Every customer leaves with
              something that feels made for them.
            </p>

            <div className="mt-8 flex flex-wrap gap-8 border-t border-gold/20 pt-8">
              {CRAFT_STATS.map((stat) => (
                <div key={stat.value}>
                  <span className="block font-display text-2xl font-medium text-crimson">{stat.value}</span>
                  <span className="font-body text-[9px] uppercase tracking-[0.3em] text-stone">{stat.label}</span>
                </div>
              ))}
            </div>

            <Button variant="ghost" asChild className="mt-8 w-fit border border-gold/30 px-6 text-[10px] uppercase tracking-[0.25em] text-ink hover:border-crimson hover:text-crimson">
              <Link href="/about">Discover Our Story</Link>
            </Button>
          </motion.div>

          {/* Right: large lifestyle image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative md:col-span-4"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=700"
                alt="Customer in bridal saree"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Floating caption card like the Italy reference */}
            <div className="absolute -bottom-4 -left-4 hidden border border-gold/30 bg-ivory-cream px-5 py-4 shadow-premium-sm md:block">
              <p className="font-display text-xs italic text-ink/60">
                &ldquo;Every visit feels like a celebration.&rdquo;
              </p>
              <p className="mt-1 font-body text-[9px] uppercase tracking-widest text-stone">— Anjali Menon, Kochi</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
