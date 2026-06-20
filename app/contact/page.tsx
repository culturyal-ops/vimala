import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { STORE, CONTACT } from "@/lib/store-info";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Contact Vimala Silk House | Kattappana, Idukki, Kerala",
  description:
    "Reach Vimala Silk House via phone, WhatsApp, or visit our Kattappana store. Open 7 days a week, 8:00 AM – 9:30 PM.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="bg-ivory pt-header">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-16">
        <h1 className="font-display text-4xl font-medium text-crimson md:text-5xl">
          Contact Us
        </h1>

        <ul className="mt-10 space-y-6">
          <li className="flex gap-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                Visit us
              </p>
              <p className="font-body text-sm text-ink/65">
                {STORE.address.full}
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <Phone className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="font-body text-sm font-semibold text-ink">Call us</p>
              <a
                href={CONTACT.landlineHref}
                className="block font-body text-sm text-ink/65 hover:text-crimson"
              >
                {CONTACT.landline}
              </a>
              <a
                href={CONTACT.mobileHref}
                className="block font-body text-sm text-ink/65 hover:text-crimson"
              >
                Mobile: {CONTACT.mobile}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <MessageCircle className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                WhatsApp
              </p>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-ink/65 hover:text-crimson"
              >
                {CONTACT.whatsapp}
              </a>
            </div>
          </li>
          <li className="flex gap-4">
            <Clock className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                Store hours
              </p>
              <p className="font-body text-sm text-ink/65">
                Open all 7 days, {STORE.hours.open} – {STORE.hours.close}
              </p>
            </div>
          </li>
        </ul>

        <Button asChild className="mt-10">
          <Link href={CONTACT.whatsappUrl} target="_blank">
            Chat on WhatsApp
          </Link>
        </Button>
      </div>
    </div>
  );
}
