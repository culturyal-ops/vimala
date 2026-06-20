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
    const timer = window.setInterval(() => api.scrollNext(), 7000);
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
              <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/9]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end page-container pb-10 sm:pb-14 lg:pb-16">
                  <p className="label-caps mb-4 text-canvas/70">
                    Est. 1987 · Kattappana, Kerala
                  </p>
                  <h1 className="max-w-2xl font-display text-display-md text-canvas sm:text-display-lg lg:text-display-xl">
                    {slide.title}
                  </h1>
                  <p className="mt-3 max-w-md font-body text-sm font-light text-canvas/75 sm:text-base">
                    {slide.subtitle}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button variant="sharp" asChild size="lg">
                      <Link href={slide.href}>
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="sharpOutline"
                      asChild
                      className="border-canvas/40 text-canvas hover:bg-canvas/10"
                    >
                      <Link href="/lookbook/bridal">View Lookbook</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-px transition-all duration-500",
              active === index ? "w-10 bg-gold" : "w-4 bg-canvas/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}
