import { CATEGORY_HIGHLIGHTS } from "@/lib/copy";
import { SectionTitle } from "@/components/ui/SectionTitle";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function CategoryHighlights() {
  return (
    <section className="bg-ivory-warm section-pad">
      <div className="page-container">
        <SectionTitle title="Shop Our Collections" />
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
          {CATEGORY_HIGHLIGHTS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="luxury-card group flex items-center gap-4 rounded-3xl p-4 transition-all duration-300 hover:shadow-luxury active:scale-[0.99] sm:gap-5 sm:p-6 md:p-8"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl shadow-luxury-sm sm:h-24 sm:w-20">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="80px"
                />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <h3 className="font-display text-lg font-medium text-crimson sm:text-xl">
                  {item.title}
                </h3>
                <span className="glass-panel inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gold-muted transition-colors group-hover:text-crimson">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
