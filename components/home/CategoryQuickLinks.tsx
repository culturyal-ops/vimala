import Image from "next/image";
import Link from "next/link";
import { QUICK_LINKS } from "@/lib/navigation";

export function CategoryQuickLinks() {
  return (
    <section className="border-b border-border bg-canvas py-8 md:py-10">
      <div className="page-container">
        <p className="label-caps mb-5">Shop by Category</p>
        <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex w-[4.5rem] shrink-0 flex-col items-center gap-2 sm:w-[5rem]"
            >
              <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden bg-surface-muted sm:h-20 sm:w-20">
                <Image
                  src={item.imageUrl}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="80px"
                />
              </div>
              <span className="text-center font-body text-[10px] font-medium uppercase tracking-wide text-ink group-hover:text-crimson">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
