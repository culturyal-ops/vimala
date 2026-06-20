"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DEPARTMENTS } from "@/lib/catalog";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { fadeScale, staggerContainer } from "@/lib/animations";

export function DepartmentsGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-ivory">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto max-w-[1440px] px-4 py-16 md:px-16 md:py-24"
      >
        <SectionTitle title="Shop by Department" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {DEPARTMENTS.map((dept) => (
            <motion.div key={dept.id} variants={fadeScale}>
              <Link
                href={dept.href}
                className="group premium-card-shadow relative block overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={dept.imageUrl}
                    alt={dept.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-lg font-medium text-ivory md:text-xl">
                      {dept.label}
                    </h3>
                    <p className="mt-0.5 font-body text-[10px] text-ivory/60">
                      {dept.count} styles
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-widest text-gold">
                      Shop Now <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
