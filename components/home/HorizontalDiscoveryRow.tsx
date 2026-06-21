import Image from "next/image";
import Link from "next/link";
import { DEPARTMENTS } from "@/lib/catalog";

export function HorizontalDiscoveryRow() {
  return (
    <section className="border-t border-border bg-canvas pb-12 sm:pb-16">
      <div className="page-container pt-12 sm:pt-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 font-body text-[9px] uppercase tracking-[0.5em] text-stone">Departments</p>
            <h2 className="font-script text-4xl text-ink md:text-5xl">The Whole Family</h2>
          </div>
          <Link
            href="/shop"
            className="font-body text-[10px] font-medium uppercase tracking-widest text-ink-muted hover:text-crimson"
          >
            View all →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none md:gap-4">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.id}
              href={`/shop/category/${dept.id}`}
              className="group w-[8.5rem] shrink-0 sm:w-40"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
                <Image
                  src={dept.imageUrl}
                  alt={dept.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-display text-base text-canvas">{dept.label}</p>
                  <p className="font-body text-[10px] text-canvas/60">{dept.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
