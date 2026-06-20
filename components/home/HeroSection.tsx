"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  HERO_ARCH_IMAGES,
  PRODUCTS,
  formatPrice,
} from "@/lib/constants";
import { enrichProduct, toBagProduct } from "@/lib/product-seo";
import { AddToBagButton } from "@/components/cart/AddToBagButton";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { Button } from "@/components/ui/button";
import { StoreRating } from "@/components/ui/StoreRating";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const featured = enrichProduct(PRODUCTS[0]);
  const featuredBag = toBagProduct(featured);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100dvh] overflow-hidden bg-crimson pt-header"
    >
      <div className="paisley-pattern pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative page-container pb-12 sm:pb-16 md:pb-24">
        <div className="mb-10 text-center md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="mb-4 font-body text-[10px] uppercase tracking-[0.4em] text-gold-muted md:text-xs"
          >
            Est. 1987 · Kattappana, Kerala
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl font-medium leading-tight tracking-tight text-ivory md:text-6xl lg:text-7xl"
          >
            Silk, Trusted Across Generations.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-4 max-w-xl font-body text-sm text-ivory/60 md:text-base"
          >
            Pure silk sarees, bridal wear, and fashion for the whole family.
          </motion.p>
        </div>

        <div className="relative flex items-end justify-center gap-3 md:gap-6">
          {HERO_ARCH_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.8 }}
              className={cn(
                "w-[28%] max-w-[200px] md:w-[22%] md:max-w-none",
                i === 1 ? "z-10 w-[36%] md:w-[28%]" : "opacity-90"
              )}
            >
              <ArchFrame className="premium-shadow">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={src}
                    alt={
                      i === 0
                        ? "Kerala pure silk bridal saree collection at Vimala Silk House"
                        : i === 1
                          ? "Handpicked silk saree for wedding and festive wear"
                          : "Handpicked silk saree for wedding and festive wear"
                    }
                    fill
                    className="object-cover"
                    priority={i === 1}
                    sizes="(max-width: 768px) 33vw, 22vw"
                  />
                </div>
              </ArchFrame>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="luxury-card absolute -bottom-4 right-0 z-20 hidden w-56 rounded-3xl p-4 md:block lg:right-8 lg:w-64"
          >
            <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl shadow-luxury-sm">
              <Image
                src={featured.imageUrl}
                alt={featured.name}
                fill
                className="object-cover"
                sizes="256px"
              />
              <span className="absolute left-2 top-2 bg-gold px-2 py-0.5 font-body text-[9px] font-medium uppercase text-ink">
                New
              </span>
            </div>
            <p className="font-display text-sm font-medium text-ink">
              {featured.name}
            </p>
            <p className="font-body text-xs text-ink/50">{featured.fabric}</p>
            <StoreRating size="sm" className="mt-1" />
            <p className="mt-1 font-body text-sm font-semibold text-crimson">
              {formatPrice(featured.price)}
            </p>
            <AddToBagButton
              product={featuredBag}
              buttonSize="sm"
              className="mt-3 [&_button]:w-full [&_button]:text-xs"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75 }}
          className="luxury-card mt-6 rounded-3xl p-4 md:hidden"
        >
          <div className="flex gap-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
              <Image
                src={featured.imageUrl}
                alt={featured.name}
                fill
                className="object-cover"
                sizes="80px"
              />
              <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 font-body text-[8px] font-semibold uppercase text-ink">
                New
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-display text-sm font-medium text-ink">
                {featured.name}
              </p>
              <StoreRating size="sm" className="mt-1" />
              <p className="mt-1 font-body text-sm font-semibold text-crimson">
                {formatPrice(featured.price)}
              </p>
            </div>
          </div>
          <AddToBagButton
            product={featuredBag}
            buttonSize="sm"
            className="mt-3 [&_button]:w-full [&_button]:text-xs"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <StoreRating size="md" className="text-ivory/80 [&_span]:text-ivory/80 [&_span:last-child]:text-ivory/50" />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <Link href="/shop">
                Shop All Departments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-ivory/30 text-ivory hover:bg-ivory/10">
              <Link href="/shop?dept=silks">Silks &amp; Bridal</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
