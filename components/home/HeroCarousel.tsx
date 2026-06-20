"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/lib/navigation";

export function HeroCarousel() {
  return (
    <section className="pt-[7.5rem] md:pt-[8.5rem]">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {HERO_SLIDES.map((slide) => (
            <CarouselItem key={slide.title}>
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-stone-200 md:aspect-[21/8]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-ink/20 to-transparent" />
                <div className="absolute bottom-8 left-6 max-w-md md:bottom-12 md:left-12">
                  <h1 className="font-display text-3xl font-medium text-white md:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="mt-2 font-body text-sm text-white/80 md:text-base">
                    {slide.subtitle}
                  </p>
                  <Button asChild className="mt-5 bg-[#722F37] hover:bg-[#722F37]/90">
                    <Link href={slide.href}>{slide.cta}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden border-white/30 bg-white/90 text-ink md:flex" />
        <CarouselNext className="right-4 hidden border-white/30 bg-white/90 text-ink md:flex" />
      </Carousel>
    </section>
  );
}
