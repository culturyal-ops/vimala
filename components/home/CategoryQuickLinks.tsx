import Image from "next/image";
import Link from "next/link";
import { QUICK_LINKS } from "@/lib/navigation";

export function CategoryQuickLinks() {
  return (
    <section className="border-b border-antique/20 bg-parchment py-10 md:py-12">
      <div className="page-container">
        <p className="editorial-label mb-6">Shop by Category</p>
        <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-none md:gap-8">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex w-[4rem] shrink-0 flex-col items-center gap-2.5 sm:w-[4.5rem]"
            >
              {/* Square image — fashion editorial, not circle */}
              <div className="relative h-[4rem] w-[4rem] overflow-hidden bg-parchment-deep sm:h-[4.5rem] sm:w-[4.5rem]">
                <Image
                  src={item.imageUrl}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="72px"
                />
                {/* Thin inner border on hover */}
                <div className="absolute inset-[3px] border border-antique/0 transition-all duration-300 group-hover:border-antique/40 z-10" />
              </div>
              <span className="text-center font-body text-[9px] uppercase tracking-[0.18em] text-stone transition-colors group-hover:text-rouge">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
