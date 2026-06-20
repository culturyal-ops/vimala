import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { LOOKBOOKS } from "@/lib/lookbook";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = pageMetadata({
  title: "Lookbook | Vimala Silk House",
  description:
    "Editorial lookbooks for bridal trousseau and festive collections from Vimala Silk House, Kattappana.",
  path: "/lookbook",
});

export default function LookbookIndexPage() {
  return (
    <div className="bg-ivory pt-header">
      <div className="page-container section-pad">
        <SectionTitle
          title="The Lookbook"
          subtitle="Styled edits for weddings, festivals, and family celebrations."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {LOOKBOOKS.map((book) => (
            <Link
              key={book.slug}
              href={`/lookbook/${book.slug}`}
              className="luxury-card group overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={book.heroImageUrl}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-crimson-dark/90 via-crimson-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="font-body text-[10px] uppercase tracking-[0.35em] text-gold">
                    Lookbook
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-ivory sm:text-3xl">
                    {book.title}
                  </h2>
                  <p className="mt-2 font-body text-sm text-ivory/60">{book.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
