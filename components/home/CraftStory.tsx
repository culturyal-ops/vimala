"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CRAFT_STATS } from "@/lib/constants";

export function CraftStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-parchment overflow-hidden">

      {/* ── Full-bleed image with oversized text overlay ── */}
      <div className="relative w-full overflow-hidden" style={{ height: "min(62vw, 640px)", minHeight: 320 }}>
        <Image
          src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1800"
          alt="Vimala Silk House interior, Kattappana"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Left gradient — text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/25 to-transparent" />
        {/* Bottom fade for next section bleed */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-parchment to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl"
            >
              <p className="editorial-label mb-4 text-antique/75">Est. 1987, Kattappana</p>
              {/* Large display serif — refined, not script */}
              <h2 className="font-display text-4xl font-light leading-[0.95] text-parchment md:text-5xl lg:text-6xl xl:text-7xl">
                Kattappana&apos;s Home
                <br />for Silk &amp; <em className="font-script not-italic text-antique" style={{ fontSize: "1.15em" }}>Style</em>
              </h2>
              <p className="mt-5 max-w-sm font-display text-sm font-light italic text-parchment/55 leading-relaxed">
                Three generations of trust. Eight departments under one roof.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Three-column editorial story layout ── */}
      <div className="page-container py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6 lg:gap-10">

          {/* Left: two portrait images, stacked and offset */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="md:col-span-3 md:col-start-1"
          >
            {/* Top portrait — taller */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-parchment-deep">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500"
                alt="Silk weaving craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 220px"
              />
              {/* Vintage frame inner border */}
              <div className="absolute inset-[6px] border border-antique/25 pointer-events-none z-10" />
            </div>
            {/* Small square image pushed left — creates asymmetry */}
            <div className="relative mt-3 aspect-square w-3/4 overflow-hidden bg-parchment-deep ml-auto">
              <Image
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=350"
                alt="Antique gold jewellery"
                fill
                className="object-cover"
                sizes="180px"
              />
            </div>
          </motion.div>

          {/* Centre: story prose — the emotional core */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col justify-center md:col-span-5 md:col-start-4 md:px-4 lg:px-6"
          >
            {/* Ornamental rule */}
            <div className="mb-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-antique/40" />
              <span className="font-body text-[9px] uppercase tracking-[0.3em] text-antique/60">Our Heritage</span>
              <div className="h-px w-6 bg-antique/40" />
            </div>

            <h3 className="mb-6 font-display text-3xl font-light leading-tight text-ink md:text-4xl">
              More than a store —<br />a family institution
            </h3>

            <p className="font-display text-[15px] font-light leading-[1.9] text-ink/55 md:text-base">
              Since 1987, Vimala Silk House has been where Kattappana&apos;s families
              come for every milestone — weddings, Onam, first days of school,
              and everything in between.
            </p>
            <p className="mt-5 font-display text-[15px] font-light leading-[1.9] text-ink/55 md:text-base">
              Pure silks from the finest looms, bridal trousseaus, and eight
              departments of fashion under one roof. Every saree is chosen with
              care. Every customer leaves with something that feels made for them.
            </p>

            {/* Stats — clean, no boxes */}
            <div className="mt-10 flex gap-10 border-t border-antique/20 pt-8">
              {CRAFT_STATS.map((stat) => (
                <div key={stat.value}>
                  <span className="block font-display text-3xl font-light text-rouge md:text-4xl">{stat.value}</span>
                  <span className="mt-1 block font-body text-[9px] uppercase tracking-[0.2em] text-stone">{stat.label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="btn-editorial-rouge mt-10 w-fit"
            >
              Discover Our Story
            </Link>
          </motion.div>

          {/* Right: large lifestyle image with floating quote */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.9 }}
            className="relative md:col-span-4 md:col-start-9"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-parchment-deep">
              <Image
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=700"
                alt="Customer wearing a Vimala bridal saree"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
              <div className="absolute inset-[6px] border border-antique/20 pointer-events-none z-10" />
            </div>

            {/* Floating quote card — polaroid style */}
            <div className="absolute -bottom-5 -left-5 hidden max-w-[220px] border-l-2 border-antique/60 bg-parchment pl-4 pr-5 py-4 shadow-paper md:block">
              <p className="font-display text-xs italic leading-relaxed text-ink/55">
                &ldquo;Every visit feels like a celebration.&rdquo;
              </p>
              <p className="mt-2 font-body text-[8px] uppercase tracking-[0.2em] text-stone">— Anjali Menon, Kochi</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
