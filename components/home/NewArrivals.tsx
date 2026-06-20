"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { PRODUCTS } from "@/lib/constants";
import { enrichProduct, toBagProduct } from "@/lib/product-seo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function NewArrivals() {
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
        <motion.div
          variants={fadeUp}
          className="mb-10 flex items-end justify-between"
        >
          <SectionTitle title="New Arrivals" className="mb-0" align="left" />
          <Link
            href="/shop"
            className="hidden shrink-0 font-body text-sm font-medium text-crimson transition-colors hover:text-gold md:block"
          >
            View All →
          </Link>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {PRODUCTS.map((product) => {
                const p = enrichProduct(product);
                return (
                <CarouselItem
                  key={product.id}
                  className="basis-[66%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard
                    href={`/shop/${p.slug}`}
                    name={p.name}
                    price={p.price}
                    fabric={p.fabric}
                    category={p.category}
                    department={p.department}
                    imageUrl={p.imageUrl}
                    hoverImageUrl={p.hoverImageUrl}
                    isNew={p.isNew}
                    discount={p.discount}
                    originalPrice={p.originalPrice}
                    sizes={p.sizes}
                    scarcityNote={p.scarcityNote}
                    bagProduct={toBagProduct(p)}
                  />
                </CarouselItem>
              );})}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </motion.div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/shop"
            className="font-body text-sm font-medium text-crimson"
          >
            View All →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
