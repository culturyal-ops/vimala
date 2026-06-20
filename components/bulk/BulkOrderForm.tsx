"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/store-info";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/SectionTitle";

const STEPS = [
  "Tell us the occasion, quantity, and timeline",
  "We'll recommend collections that fit your budget and theme",
  "We confirm sizing, pricing, and delivery — including international shipping if needed",
  "Your order ships in time for the event",
] as const;

export function BulkOrderForm() {
  const [occasion, setOccasion] = useState("");
  const [quantity, setQuantity] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Bulk Order Enquiry\nName: ${name}\nOccasion: ${occasion}\nQuantity: ${quantity}\nTimeline: ${timeline}\nNotes: ${notes}`
    );
    window.open(`${CONTACT.whatsappUrl}?text=${message}`, "_blank");
  };

  return (
    <>
      <h2 className="mt-10 font-display text-xl text-crimson">How it works</h2>
      <ol className="mt-4 space-y-3">
        {STEPS.map((step, i) => (
          <li key={step} className="flex gap-3 font-body text-sm text-ink/70">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson font-body text-xs text-ivory">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <form
        onSubmit={handleSubmit}
        className="premium-card-shadow mt-12 space-y-4 rounded-2xl border border-gold/15 bg-ivory-warm p-8"
      >
        <SectionTitle
          title="Request a Quote"
          subtitle="Bulk orders need a quote — tell us what you need"
          align="left"
          className="mb-6"
        />
        <input
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gold/25 bg-ivory px-4 py-3 font-body text-sm focus:border-gold focus:outline-none"
        />
        <input
          required
          placeholder="Occasion (wedding, parish function, festival…)"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          className="w-full border border-gold/25 bg-ivory px-4 py-3 font-body text-sm focus:border-gold focus:outline-none"
        />
        <input
          required
          placeholder="Approximate quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border border-gold/25 bg-ivory px-4 py-3 font-body text-sm focus:border-gold focus:outline-none"
        />
        <input
          required
          placeholder="Event date / timeline"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="w-full border border-gold/25 bg-ivory px-4 py-3 font-body text-sm focus:border-gold focus:outline-none"
        />
        <textarea
          placeholder="Additional notes (sizing, theme, budget…)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border border-gold/25 bg-ivory px-4 py-3 font-body text-sm focus:border-gold focus:outline-none"
        />
        <Button type="submit" className="w-full">
          Send Enquiry via WhatsApp
        </Button>
      </form>
    </>
  );
}
