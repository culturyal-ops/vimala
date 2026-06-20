"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  badge?: string;
};

export function ProductGallery({ images, alt, badge }: ProductGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const gallery = (
    <Carousel setApi={setApi} opts={{ loop: images.length > 1 }} className="w-full">
      <CarouselContent className="-ml-0">
        {images.map((src, index) => (
          <CarouselItem key={`${src}-${index}`} className="pl-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-ivory-warm">
              <Image
                src={src}
                alt={`${alt} — view ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-3 top-1/2 hidden border-gold/30 bg-ivory/90 sm:flex" />
          <CarouselNext className="right-3 top-1/2 hidden border-gold/30 bg-ivory/90 sm:flex" />
        </>
      )}
    </Carousel>
  );

  return (
    <div className="relative">
      {gallery}

      {badge && (
        <span className="glass-dark pointer-events-none absolute bottom-4 left-4 z-10 rounded-2xl px-3 py-1.5 font-body text-xs text-ivory/90">
          {badge}
        </span>
      )}

      <button
        type="button"
        aria-label="View full screen"
        onClick={() => setFullscreen(true)}
        className="glass-panel touch-target absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-crimson sm:right-4 sm:top-4"
      >
        <Expand className="h-4 w-4" />
      </button>

      {images.length > 1 && (
        <>
          <div className="absolute right-4 top-4 z-10 rounded-full bg-ink/50 px-2.5 py-1 font-body text-[10px] text-ivory backdrop-blur-sm sm:hidden">
            {active + 1} / {images.length}
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {images.map((src, index) => (
              <button
                key={`dot-${src}-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  active === index ? "w-6 bg-crimson" : "w-1.5 bg-gold/35"
                )}
              />
            ))}
          </div>
          <div className="mt-3 hidden gap-2 sm:flex">
            {images.map((src, index) => (
              <button
                key={`thumb-${src}-${index}`}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  "relative h-16 w-14 overflow-hidden rounded-xl border-2 transition-all",
                  active === index
                    ? "border-crimson shadow-luxury-sm"
                    : "border-gold/20 opacity-70 hover:opacity-100"
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] border-gold/20 bg-ink p-0">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative aspect-[3/4] w-full min-w-[280px] sm:min-w-[360px]">
            <Image
              src={images[active] ?? images[0]}
              alt={alt}
              fill
              className="object-contain"
              sizes="95vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
