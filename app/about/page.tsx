import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { STORE, CONTACT, BRAND_ECOSYSTEM } from "@/lib/store-info";
import { DEPARTMENTS } from "@/lib/catalog";
import { ABOUT_BELIEFS } from "@/lib/copy";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { Button } from "@/components/ui/button";
import { CRAFT_STATS } from "@/lib/constants";

export const metadata: Metadata = pageMetadata({
  title: "About Vimala Silk House | A Kattappana Legacy in Silk & Fashion",
  description:
    "Discover the story of Vimala Silk House, part of Kattappana's trusted Vimala group, bringing generations of textile expertise to silk sarees and fashion worldwide.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="bg-ivory pt-header">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-16 md:py-20">
        <OrnamentalDivider className="mb-6" />
        <h1 className="font-display text-4xl font-medium text-crimson md:text-5xl">
          Our Legacy
        </h1>
        <p className="mt-4 font-body text-sm text-ink/55">
          Part of the Vimala name in Kattappana — silk, fashion, and trust
          across generations.
        </p>
      </div>

      <section className="bg-crimson py-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-16">
          <div className="grid gap-8 md:grid-cols-3">
            {CRAFT_STATS.map((stat) => (
              <div key={stat.value} className="text-center">
                <p className="font-display text-3xl text-ivory">{stat.value}</p>
                <p className="mt-1 font-body text-xs uppercase tracking-widest text-ivory/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 md:px-16 md:py-20">
        <ul className="space-y-2 font-body text-sm text-ink/70">
          {ABOUT_BELIEFS.map((belief) => (
            <li key={belief} className="flex gap-2">
              <span className="text-gold">·</span> {belief}
            </li>
          ))}
        </ul>

        <div className="grid gap-3 sm:grid-cols-2">
          {BRAND_ECOSYSTEM.map((b) => (
            <div
              key={b.name}
              className="rounded-xl border border-gold/15 bg-ivory-warm px-4 py-3"
            >
              <p className="font-display text-base text-crimson">{b.name}</p>
            </div>
          ))}
        </div>

        <p className="font-body text-xs text-ink/45">{STORE.note}.</p>

        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/collections/silk-sarees">Shop Silk Sarees</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href={CONTACT.whatsappUrl} target="_blank">
              WhatsApp Us
            </Link>
          </Button>
        </div>
      </div>

      <section className="border-t border-gold/15 bg-ivory-warm py-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-16">
          <SectionTitle title="Departments" align="left" />
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {DEPARTMENTS.map((d) => (
              <Link
                key={d.id}
                href={d.href}
                className="rounded-xl border border-gold/15 bg-ivory px-4 py-3 font-body text-sm text-ink transition-colors hover:border-gold hover:text-crimson"
              >
                {d.label} · {d.count}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
