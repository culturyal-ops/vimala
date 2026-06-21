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
import { Button } from "@/components/ui/button";
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
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const timer = window.setInterval(() => api.scrollNext(), 8000);
    return () => window.clearInterval(timer);
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="relative bg-canvas pt-header">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={slide.title} className="pl-0">
              <div className="relative aspect-[4/5] w-full md:aspect-[16/9] lg:aspect-[21/9]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Deep crimson overlay gradient like the reference */}
                <div className="absolute inset-0 bg-gradient-to-b from-crimson-deep/30 via-crimson/20 to-ink/70" />
                {/* Subtle damask texture overlay */}
                <div className="damask-pattern pointer-events-none absolute inset-0 opacity-20" />

                <div className="absolute inset-0 flex items-end justify-start pb-12 md:pb-16 lg:pb-20">
                  <div className="page-container max-w-4xl">
                    <p className="mb-4 font-body text-[9px] uppercase tracking-[0.5em] text-gold/80 md:text-[10px]">
                      Est. 1987 · Kattappana, Kerala
                    </p>
                    {/* Script headline like "Atmosphere" in the reference */}
                    <h1 className="font-script text-6xl leading-none text-ivory drop-shadow-lg md:text-8xl lg:text-[7rem]">
                      {slide.title}
                    </h1>
                    <p className="mt-4 font-display text-sm font-light italic text-ivory/75 md:text-base lg:max-w-xl">
                      {slide.subtitle}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href={slide.href}
                        className="group inline-flex items-center gap-3 border border-gold/60 bg-gold/10 px-7 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-ivory backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-ink"
                      >
                        {slide.cta}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/lookbook/bridal"
                        className="inline-flex items-center gap-3 border border-ivory/25 px-7 py-3.5 font-body text-[11px] uppercase tracking-[0.2em] text-ivory/70 transition-all duration-300 hover:border-ivory/60 hover:text-ivory"
                      >
                        Lookbook
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-[1.5px] transition-all duration-500",
              active === index ? "w-10 bg-gold" : "w-5 bg-ivory/30"
            )}
          />
        ))}
      </div>
    </section>
  );
}
