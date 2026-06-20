"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";

export function NewsletterBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="damask-pattern pointer-events-none absolute inset-0 opacity-10" />
      <motion.div
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative mx-auto max-w-[1440px] px-4 py-16 text-center md:px-16 md:py-24"
      >
        <h2 className="mb-4 font-display text-3xl uppercase tracking-[0.15em] text-ivory md:text-4xl">
          Be the First to Know
        </h2>
        <p className="mx-auto mb-8 max-w-lg font-body text-base text-ivory/60">
          New arrivals, bridal collections, and exclusive offers straight to
          your inbox.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="glass-panel w-full max-w-md flex-1 rounded-2xl border border-ivory/25 bg-ink-soft/80 px-5 py-3.5 font-body text-sm text-ivory shadow-luxury placeholder:text-ivory/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
          <Button type="submit" variant="gold" size="default">
            Subscribe
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
