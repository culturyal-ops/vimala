import Link from "next/link";
import {
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { FOOTER_DEEP_LINKS } from "@/lib/navigation";
import { STORE, CONTACT } from "@/lib/store-info";

export function Footer() {
  return (
    <>
      <footer id="contact" className="bg-ink-soft text-ivory/70">
        <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 font-script text-3xl text-ivory">
                Vimala Silk House
              </h3>
              <p className="font-body text-sm leading-relaxed">
                Kattappana&apos;s premier multi-brand fashion destination. Silks,
                readymade garments, accessories and more for the whole family.
              </p>
              <p className="mt-3 font-body text-xs text-ivory/50">
                {STORE.note}
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-widest text-gold">
                Shop
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/shop/category/silks"
                    className="font-body text-sm hover:text-gold"
                  >
                    Silk Sarees
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/category/bridal"
                    className="font-body text-sm hover:text-gold"
                  >
                    Bridal Wear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/category/readymade"
                    className="font-body text-sm hover:text-gold"
                  >
                    Readymade Fashion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/category/accessories"
                    className="font-body text-sm hover:text-gold"
                  >
                    Jewellery &amp; Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/bulk-orders" className="font-body text-sm hover:text-gold">
                    Bulk Orders
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="font-body text-sm hover:text-gold">
                    International Shipping
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-widest text-gold">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-body text-sm hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-widest text-gold">
                Contact
              </h4>
              <ul className="flex flex-col gap-3 font-body text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{STORE.address.full}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-gold" />
                  <span>
                    {STORE.hours.open} – {STORE.hours.close} daily
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a href={CONTACT.landlineHref} className="hover:text-gold">
                    {CONTACT.landline}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a href={CONTACT.mobileHref} className="hover:text-gold">
                    {CONTACT.mobile}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold"
                  >
                    {CONTACT.whatsapp}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">
                    {CONTACT.email}
                  </a>
                </li>
              </ul>
              <div className="mt-4 flex gap-4">
                <a href="https://instagram.com" aria-label="Instagram" className="hover:text-gold">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" aria-label="Facebook" className="hover:text-gold">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-ivory/10 pt-10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              {FOOTER_DEEP_LINKS.map((column) => (
                <div key={column.title}>
                  <h5 className="mb-3 font-body text-[10px] font-medium uppercase tracking-widest text-gold">
                    {column.title}
                  </h5>
                  <ul className="flex flex-col gap-1.5">
                    {column.links.map((link) => (
                      <li key={`${column.title}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="font-body text-xs text-ivory/55 transition-colors hover:text-gold"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-crimson py-4 text-center">
          <p className="font-body text-xs text-ivory/90">
            &copy; {new Date().getFullYear()} Vimala Silk House · GSTIN {STORE.gstin} ·{" "}
            {STORE.rating.score}★ from {STORE.rating.count}+ reviews
          </p>
        </div>
      </footer>

      <a
        href={CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-[calc(var(--bottom-nav-height)+1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-luxury transition-transform hover:scale-105 hover:bg-green-700 md:bottom-6 md:right-6"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}
