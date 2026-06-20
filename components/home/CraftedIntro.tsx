"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { HOMEPAGE_INTRO } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { fadeUp } from "@/lib/animations";

export function CraftedIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-ivory py-16 md:py-24">
      <motion.div
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mx-auto max-w-3xl px-4 text-center md:px-16"
      >
        <OrnamentalDivider className="mb-6" />
        <p className="font-body text-base leading-relaxed text-ink/70 md:text-lg">
          {HOMEPAGE_INTRO}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/collections/silk-sarees">Silk Sarees Online</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/shipping">International Shipping</Link>
          </Button>
        </div>
        <OrnamentalDivider className="mt-8" />
      </motion.div>
    </section>
  );
}
