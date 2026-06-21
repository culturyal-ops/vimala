"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CRAFT_STATS } from "@/lib/constants";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { Button } from "@/components/ui/button";
import { slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";

export function CraftStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative overflow-hidden bg-crimson">
      <div className="paisley-pattern pointer-events-none absolute inset-0 opacity-20" />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto flex max-w-[1440px] flex-col md:flex-row page-container px-0"
      >
        <motion.div
          variants={slideInLeft}
          className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[600px] md:w-1/2"
        >
          <Image
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800"
            alt="Artisan weaving silk on a traditional loom"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-crimson/20" />
        </motion.div>

        <motion.div
          variants={slideInRight}
          className="flex w-full flex-col justify-center px-4 py-16 md:w-1/2 md:px-16 md:py-24"
        >
          <OrnamentalDivider color="ivory" className="mb-6 justify-start" />
          <p className="mb-3 font-body text-[9px] uppercase tracking-[0.5em] text-gold/70">
            Our Heritage
          </p>
          {/* Script heading like the reference designs */}
          <h2 className="mb-2 font-script text-5xl text-ivory md:text-6xl">
            Woven with Tradition.
          </h2>
          <h3 className="mb-6 font-display text-lg font-light uppercase tracking-[0.2em] text-ivory/60 md:text-xl">
            Crafted with Care.
          </h3>
          <p className="mb-8 max-w-md font-display text-base font-light italic text-ivory/55">
            Kattappana&apos;s fashion destination since 1987.
          </p>

          <div className="relative mb-8 aspect-video max-w-sm overflow-hidden rounded-2xl border border-gold/30">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"
              alt="Close-up of silk weaving craftsmanship"
              fill
              className="object-cover"
              sizes="400px"
            />
          </div>

          <Button variant="gold" asChild className="mb-10 w-fit">
            <Link href="/about">Discover the Craft →</Link>
          </Button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CRAFT_STATS.map((stat) => (
              <div
                key={stat.value}
                className="rounded-2xl border border-gold/25 bg-crimson-dark/60 px-4 py-4 text-center backdrop-blur-sm"
              >
                <span className="block font-display text-xl text-ivory">
                  {stat.value}
                </span>
                <span className="font-body text-[10px] uppercase tracking-wider text-ivory/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
