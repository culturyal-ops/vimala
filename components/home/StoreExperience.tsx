"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { STORE, CONTACT } from "@/lib/store-info";
import { Button } from "@/components/ui/button";

export function StoreExperience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="overflow-hidden">

      {/* Feature split: image left, text right */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/3] md:aspect-auto md:min-h-[600px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900"
            alt="Inside Vimala Silk House boutique"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Polaroid-style floating photo — like the Showit reference */}
          <div className="absolute bottom-6 right-6 hidden rotate-3 bg-ivory p-2 shadow-premium-md md:block">
            <div className="relative h-28 w-24 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300"
                alt="Silk saree detail"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <p className="mt-2 text-center font-body text-[8px] uppercase tracking-widest text-stone">
              Since 1987
            </p>
          </div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col justify-center bg-ivory-cream px-8 py-16 md:px-14 md:py-20 lg:px-20"
        >
          <p className="mb-3 font-body text-[9px] uppercase tracking-[0.5em] text-stone">Visit Us</p>
          <h2 className="mb-6 font-display text-3xl font-light text-ink md:text-4xl lg:text-5xl">
            Experience it<br />
            <span className="font-script text-5xl text-crimson md:text-6xl">in person</span>
          </h2>
          <p className="mb-8 font-display text-sm font-light leading-loose text-ink/55">
            Kattappana&apos;s largest fashion destination. Eight departments, hundreds
            of silks, bridal specialists, and a team that genuinely loves what
            they do. Come in — we&apos;d love to help.
          </p>

          <div className="mb-8 space-y-4 border-t border-gold/20 pt-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <p className="font-body text-sm font-medium text-ink">{STORE.address.full}</p>
                <p className="font-body text-xs text-stone">{STORE.parking}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-gold" />
              <p className="font-body text-sm text-ink">
                Open daily · {STORE.hours.open} – {STORE.hours.close}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild className="btn-primary px-7 py-3 text-[10px] uppercase tracking-[0.2em]">
              <Link href={CONTACT.whatsappUrl} target="_blank">
                Chat on WhatsApp
              </Link>
            </Button>
            <Button variant="ghost" asChild className="border border-gold/30 px-7 py-3 text-[10px] uppercase tracking-[0.2em] hover:border-crimson hover:text-crimson">
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Full-bleed crimson CTA — like the big red "Elevating Ideas" from the reference */}
      <div className="relative overflow-hidden bg-crimson py-20 md:py-28">
        <div className="damask-pattern pointer-events-none absolute inset-0 opacity-10" />
        {/* Decorative polaroid images floating at sides */}
        <div className="pointer-events-none absolute -left-4 top-1/2 hidden -translate-y-1/2 -rotate-6 bg-ivory p-2 shadow-premium-lg md:block">
          <div className="relative h-40 w-32 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300"
              alt="Bridal moment"
              fill
              className="object-cover grayscale"
              sizes="128px"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 rotate-6 bg-ivory p-2 shadow-premium-lg md:block">
          <div className="relative h-40 w-32 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300"
              alt="Festival saree"
              fill
              className="object-cover grayscale"
              sizes="128px"
            />
          </div>
        </div>

        <div className="relative page-container text-center">
          <p className="mb-4 font-body text-[9px] uppercase tracking-[0.5em] text-gold/60">
            [ Worldwide Shipping Available ]
          </p>
          <h2 className="font-display text-3xl font-light text-ivory md:text-5xl lg:text-6xl">
            Can&apos;t Visit?
            <br />
            <span className="font-script text-5xl md:text-7xl">We Come to You</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-display text-sm font-light italic text-ivory/55">
            Share your occasion, size, and budget on WhatsApp. We&apos;ll curate
            a personal selection and ship it anywhere in the world.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={CONTACT.whatsappUrl}
              target="_blank"
              className="inline-flex items-center gap-3 border border-gold/50 bg-gold/10 px-8 py-4 font-body text-[10px] uppercase tracking-[0.25em] text-ivory backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-ink"
            >
              WhatsApp Us Now
            </Link>
            <Link
              href="/shipping"
              className="inline-flex items-center gap-3 border border-ivory/20 px-8 py-4 font-body text-[10px] uppercase tracking-[0.25em] text-ivory/70 transition-all duration-300 hover:border-ivory/50 hover:text-ivory"
            >
              Shipping Info
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
