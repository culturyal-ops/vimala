"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Car, Clock, MapPin, Star, Users } from "lucide-react";
import { STORE, STORE_HIGHLIGHTS, CONTACT } from "@/lib/store-info";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const icons = [Star, Car, Users, Clock];

export function StoreExperience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="border-t border-gold/10 bg-ivory section-pad">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="page-container"
      >
        <SectionTitle
          title="Visit the House"
          subtitle="Kattappana's multi-floor boutique. Silks, readymade, and personal service since 1987."
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div variants={fadeUp} className="space-y-4 lg:col-span-5">
            <div className="luxury-surface p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-display text-lg font-medium text-crimson">
                    {STORE.address.full}
                  </p>
                  <p className="mt-2 font-body text-sm text-ink/55">
                    {STORE.parking}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-gold/15 pt-5">
                <Clock className="h-5 w-5 text-gold" />
                <div>
                  <p className="font-display text-sm font-medium text-crimson">
                    {STORE.hours.label}
                  </p>
                  <p className="font-body text-sm text-ink/55">
                    {STORE.hours.open} – {STORE.hours.close}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <p className="font-display text-base text-crimson">Personal Stylist</p>
              <p className="mt-2 font-body text-sm text-ink/55">
                Share your occasion and budget. We&apos;ll curate silks and readymade
                picks on WhatsApp before you visit or order.
              </p>
              <Button variant="gold" asChild className="mt-4 w-full sm:w-auto">
                <Link href={CONTACT.whatsappUrl} target="_blank">
                  Chat on WhatsApp
                </Link>
              </Button>
            </div>

            <Button asChild variant="ghost">
              <Link href="/about">Our Story →</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
            {STORE_HIGHLIGHTS.map((item, i) => {
              const Icon = icons[i];
              return (
                <div key={item.title} className="luxury-card rounded-3xl p-5 sm:p-6">
                  <Icon className="mb-3 h-5 w-5 text-gold" strokeWidth={1.25} />
                  <h3 className="font-display text-base font-medium text-crimson">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 font-body text-xs leading-relaxed text-ink/55 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
