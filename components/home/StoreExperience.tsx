"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { STORE, CONTACT } from "@/lib/store-info";

export function StoreExperience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="overflow-hidden bg-parchment">

      {/* ── Split: image left / text right ── */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative min-h-[420px] md:min-h-[640px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000"
            alt="Inside Vimala Silk House, Kattappana"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Vintage inner frame */}
          <div className="absolute inset-[10px] border border-antique/20 pointer-events-none z-10" />

          {/* Polaroid floating detail */}
          <motion.div
            initial={{ opacity: 0, rotate: 4 }}
            animate={isInView ? { opacity: 1, rotate: 3 } : {}}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="polaroid absolute bottom-8 right-8 hidden w-28 md:block"
            style={{ transform: "rotate(3deg)" }}
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200"
                alt="Silk detail"
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <p className="mt-2 text-center font-body text-[7px] uppercase tracking-widest text-stone">Since 1987</p>
          </motion.div>
        </motion.div>

        {/* Text panel */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col justify-center bg-parchment-warm px-8 py-16 md:px-12 md:py-20 lg:px-16"
        >
          <p className="editorial-label mb-4">Visit Us</p>
          <h2 className="mb-2 font-display text-4xl font-light leading-[0.96] text-ink md:text-5xl lg:text-[3.5rem]">
            Experience
          </h2>
          <h2 className="mb-8 font-display text-4xl font-light leading-[0.96] text-ink md:text-5xl lg:text-[3.5rem]">
            it <em className="font-script not-italic text-rouge" style={{ fontSize: "1.05em" }}>in person</em>
          </h2>

          <div className="mb-8 h-px w-12 bg-antique/40" />

          <p className="mb-8 font-display text-[15px] font-light leading-[1.9] text-ink/55">
            Kattappana&apos;s largest fashion destination. Eight departments,
            hundreds of silks, bridal specialists, and a team that genuinely
            cares about finding the perfect piece for you.
          </p>

          <div className="mb-10 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-antique" strokeWidth={1.5} />
              <div>
                <p className="font-body text-sm text-ink">{STORE.address.full}</p>
                <p className="font-body text-xs text-stone mt-0.5">{STORE.parking}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-3.5 w-3.5 shrink-0 text-antique" strokeWidth={1.5} />
              <p className="font-body text-sm text-ink">
                Open daily · {STORE.hours.open} – {STORE.hours.close}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href={CONTACT.whatsappUrl} target="_blank" className="btn-editorial-rouge">
              Chat on WhatsApp
            </Link>
            <Link href="/about" className="btn-editorial">
              Our Story
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Full-bleed rouge CTA with floating polaroids ── */}
      <div className="relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "#8B4A3A" }}>
        <div className="damask-pattern pointer-events-none absolute inset-0 opacity-[0.07]" />

        {/* Polaroid left */}
        <div
          className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 md:block"
          style={{ transform: "translateY(-50%) rotate(-8deg)" }}
        >
          <div className="polaroid w-28 opacity-70">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200" alt="" fill className="object-cover grayscale" sizes="112px" />
            </div>
          </div>
        </div>

        {/* Polaroid right */}
        <div
          className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 md:block"
          style={{ transform: "translateY(-50%) rotate(7deg)" }}
        >
          <div className="polaroid w-28 opacity-70">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200" alt="" fill className="object-cover grayscale" sizes="112px" />
            </div>
          </div>
        </div>

        <div className="relative page-container text-center">
          <p className="editorial-label mb-5 text-antique/60">[ Worldwide Shipping Available ]</p>
          <h2 className="font-display text-4xl font-light leading-none text-parchment md:text-5xl lg:text-6xl">
            Can&apos;t Visit?
          </h2>
          <h2 className="mt-1 font-display text-4xl font-light text-parchment md:text-5xl lg:text-6xl">
            We <em className="font-script not-italic text-antique" style={{ fontSize: "1.1em" }}>Come to You</em>
          </h2>

          <div className="mx-auto my-8 h-px w-12 bg-antique/30" />

          <p className="mx-auto max-w-md font-display text-sm font-light italic text-parchment/50 leading-relaxed">
            Share your occasion, size, and budget on WhatsApp. We&apos;ll curate
            a personal selection and ship it anywhere in the world.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link href={CONTACT.whatsappUrl} target="_blank" className="btn-editorial-light">
              WhatsApp Us Now
            </Link>
            <Link href="/shipping" className="inline-flex items-center gap-2 font-body text-[9px] uppercase tracking-[0.25em] text-parchment/45 transition-colors hover:text-parchment/80 border-b border-parchment/20 pb-px hover:border-parchment/50">
              Shipping Info →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
