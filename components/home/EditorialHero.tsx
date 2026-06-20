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
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/5 to-ink/40" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4 max-w-5xl">
                    <p className="label-caps mb-8 text-canvas/80">
                      Est. 1987 · Kattappana, Kerala
                    </p>
                    <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-canvas tracking-tight leading-[0.95] mb-6">
                      {slide.title}
                    </h1>
                    <p className="font-body text-base md:text-lg font-light text-canvas/90 max-w-2xl mx-auto mb-10">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link 
                        href={slide.href}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-ink font-body text-sm uppercase tracking-widest transition-all duration-300 hover:bg-ink hover:text-white"
                      >
                        {slide.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/lookbook/bridal"
                        className="inline-flex items-center gap-3 px-8 py-4 border border-canvas/40 text-canvas font-body text-sm uppercase tracking-widest transition-all duration-300 hover:bg-canvas/10 backdrop-blur-sm"
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

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-[2px] transition-all duration-500 rounded-full",
              active === index ? "w-12 bg-white" : "w-6 bg-white/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}
