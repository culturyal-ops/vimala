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
    <section className="relative overflow-hidden bg-crimson-deep">
      <div className="damask-pattern pointer-events-none absolute inset-0 opacity-15" />
      <div className="paisley-pattern pointer-events-none absolute inset-0 opacity-10" />
      <motion.div
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative mx-auto max-w-[1440px] px-4 py-16 text-center md:px-16 md:py-24"
      >
        <p className="mb-4 font-body text-[9px] uppercase tracking-[0.5em] text-gold/60">
          Stay Connected
        </p>
        <h2 className="mb-2 font-script text-5xl text-ivory md:text-6xl">
          Be the First to Know
        </h2>
        <div className="mx-auto mb-8 mt-4 h-[1px] w-16 bg-gold/40" />
        <p className="mx-auto mb-8 max-w-lg font-display text-sm font-light italic text-ivory/55">
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
