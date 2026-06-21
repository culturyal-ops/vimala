import Image from "next/image";
import Link from "next/link";
import { DEPARTMENTS } from "@/lib/catalog";

export function HorizontalDiscoveryRow() {
  return (
    <section className="border-t border-antique/20 bg-parchment-warm pb-16 md:pb-20">
      <div className="page-container pt-16 md:pt-20">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="editorial-label mb-3">Departments</p>
            <h2 className="font-display text-4xl font-light leading-none text-ink md:text-5xl lg:text-[3.75rem]">
              The Whole{" "}
              <em className="font-script not-italic text-rouge" style={{ fontSize: "1.05em" }}>Family</em>
            </h2>
          </div>
          <Link
            href="/shop"
            className="self-end pb-2 font-body text-[9px] uppercase tracking-[0.25em] text-stone transition-colors hover:text-rouge"
          >
            View All →
          </Link>
        </div>

        {/* Departments — tall portrait cards, no rounded corners */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none md:gap-4">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.id}
              href={`/shop/category/${dept.id}`}
              className="group w-[9rem] shrink-0 sm:w-44"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-parchment-deep">
                <Image
                  src={dept.imageUrl}
                  alt={dept.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="176px"
                />
                {/* Dark overlay — text always legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                {/* Hover: thin antique border inside */}
                <div className="absolute inset-[6px] border border-antique/0 transition-all duration-500 group-hover:border-antique/30 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display text-base font-light text-parchment leading-tight">{dept.label}</p>
                  <p className="mt-0.5 font-body text-[8px] uppercase tracking-[0.15em] text-parchment/50">{dept.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
