"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { HERO_SLIDES } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function EditorialHero() {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const timer = window.setInterval(() => api.scrollNext(), 9000);
    return () => window.clearInterval(timer);
  }, [api]);

  const scrollTo = useCallback((index: number) => { api?.scrollTo(index); }, [api]);

  return (
    <section className="relative bg-parchment pt-header overflow-hidden">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={slide.title} className="pl-0">
              {/* Single responsive container */}
              <div className="relative w-full h-[85vh] min-h-[520px] max-h-[900px]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-ink/50 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="page-container pb-12 md:pb-16 lg:pb-20">
                    <div className="max-w-3xl">
                      {/* Eyebrow */}
                      <p className="mb-4 font-body text-[9px] uppercase tracking-[0.45em] text-antique/80 md:mb-5">
                        Est. 1987 · Kattappana, Kerala
                      </p>

                      {/* Large editorial serif headline */}
                      <h1 className="font-display font-light leading-none tracking-tight text-parchment">
                        <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                          {slide.title.split(" ").slice(0, -1).join(" ")}
                        </span>
                        {/* Last word in script */}
                        <span 
                          className="font-script text-antique"
                          style={{ fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 1 }}
                        >
                          {slide.title.split(" ").slice(-1)[0]}
                        </span>
                      </h1>

                      {/* Divider */}
                      <div className="my-6 h-px w-16 bg-antique/40" />

                      {/* Subtitle */}
                      <p className="mb-8 max-w-md font-display text-sm font-light italic leading-relaxed text-parchment/65">
                        {slide.subtitle}
                      </p>

                      {/* CTAs */}
                      <div className="flex flex-wrap gap-4">
                        <Link
                          href={slide.href}
                          className="group inline-flex items-center gap-3 border border-parchment/50 px-7 py-3.5 font-body text-[9px] uppercase tracking-[0.25em] text-parchment transition-all duration-300 hover:border-antique hover:text-antique"
                        >
                          {slide.cta}
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1.5" />
                        </Link>
                        <Link
                          href="/lookbook/bridal"
                          className="inline-flex items-center gap-3 border border-parchment/20 px-7 py-3.5 font-body text-[9px] uppercase tracking-[0.25em] text-parchment/55 transition-all duration-300 hover:border-parchment/40 hover:text-parchment/80"
                        >
                          Lookbook
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide counter — desktop only */}
      <div className="absolute right-6 bottom-8 z-10 hidden flex-col items-end gap-3 md:flex">
        <span className="font-body text-[9px] uppercase tracking-[0.3em] text-parchment/50">
          {String(active + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
        </span>
        <div className="flex flex-col gap-1.5">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-px transition-all duration-700",
                active === index ? "w-8 bg-antique" : "w-4 bg-parchment/25"
              )}
            />
          ))}
        </div>
      </div>

      {/* Mobile dots */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:hidden">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-px transition-all duration-500",
              active === index ? "w-8 bg-antique" : "w-4 bg-parchment/30"
            )}
          />
        ))}
      </div>
    </section>
  );
}
