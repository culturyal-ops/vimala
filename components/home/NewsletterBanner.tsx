"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export function NewsletterBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setEmail("");
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-parchment-deep">
      <div className="botanical-bg pointer-events-none absolute inset-0 opacity-60" />

      {/* Two-column layout — image left, form right */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image side */}
        <div className="relative hidden min-h-[420px] md:block">
          <Image
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900"
            alt="Heritage silk — Vimala Silk House"
            fill
            className="object-cover"
            sizes="50vw"
          />
          {/* Vintage inner frame */}
          <div className="absolute inset-[10px] border border-antique/20 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-parchment-deep" />
        </div>

        {/* Form side */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col justify-center px-8 py-20 md:px-14 md:py-24 lg:px-20"
        >
          {/* Ornament */}
          <div className="mb-6 h-px w-10 bg-antique/50" />
          <p className="editorial-label mb-4">Stay Connected</p>

          <h2 className="mb-2 font-display text-4xl font-light leading-[0.96] text-ink md:text-5xl">
            Be the First
          </h2>
          <h2 className="mb-8 font-display text-4xl font-light leading-[0.96] text-ink md:text-5xl">
            to <em className="font-script not-italic text-rouge" style={{ fontSize: "1.05em" }}>Know</em>
          </h2>

          <p className="mb-8 font-display text-sm font-light italic text-ink/50 leading-relaxed max-w-sm">
            New arrivals, bridal collections, and exclusive offers — delivered
            with care to your inbox.
          </p>

          {sent ? (
            <p className="font-display text-base italic text-rouge">
              Thank you — you&apos;ll hear from us soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 border border-antique/40 bg-parchment px-5 py-3.5 font-body text-sm text-ink placeholder:text-stone/50 focus:border-rouge focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="btn-editorial-rouge whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="mt-4 font-body text-[9px] uppercase tracking-[0.2em] text-stone/50">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
