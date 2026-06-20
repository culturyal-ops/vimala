"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { CUSTOMER_VIDEO_FRAMES, type CustomerVideoFrame } from "@/lib/customer-videos";
import { cn } from "@/lib/utils";

function VideoFrame({ frame }: { frame: CustomerVideoFrame }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(frame.videoUrl);

  const togglePlay = useCallback(() => {
    if (!hasVideo || !videoRef.current) return;
    if (videoRef.current.paused) {
      void videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [hasVideo]);

  const handleMouseEnter = () => {
    if (!hasVideo || !videoRef.current) return;
    void videoRef.current.play();
    setPlaying(true);
  };

  const handleMouseLeave = () => {
    if (!hasVideo || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setPlaying(false);
  };

  return (
    <article
      className="group relative w-[10.5rem] shrink-0 snap-start sm:w-[11.5rem] md:w-[12.5rem]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={togglePlay}
        disabled={!hasVideo}
        className={cn(
          "relative block w-full overflow-hidden bg-surface-muted text-left",
          "aspect-[9/16] border border-border",
          hasVideo && "cursor-pointer",
          !hasVideo && "cursor-default"
        )}
        aria-label={
          hasVideo
            ? playing
              ? `Pause ${frame.label ?? "video"}`
              : `Play ${frame.label ?? "video"}`
            : `${frame.label ?? "Video"} — coming soon`
        }
      >
        {hasVideo && frame.videoUrl ? (
          <video
            ref={videoRef}
            src={frame.videoUrl}
            poster={frame.posterUrl}
            muted
            playsInline
            loop
            preload="metadata"
            className="h-full w-full object-cover"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : (
          <Image
            src={frame.posterUrl}
            alt={frame.label ?? "Customer moment"}
            fill
            className="object-cover"
            sizes="200px"
          />
        )}

        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent transition-opacity",
            hasVideo && playing && "opacity-40 md:opacity-0"
          )}
        />

        {hasVideo && (
          <span
            className={cn(
              "absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-canvas/90 text-ink transition-opacity",
              playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            )}
          >
            {playing ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
            )}
          </span>
        )}

        {!hasVideo && (
          <span className="absolute bottom-3 left-3 right-3 font-body text-[9px] font-medium uppercase tracking-widest text-canvas/80">
            Video soon
          </span>
        )}

        {frame.label && (
          <span className="absolute bottom-0 left-0 right-0 bg-ink/50 px-2.5 py-2 font-body text-[10px] font-medium uppercase tracking-wide text-canvas backdrop-blur-[2px]">
            {frame.label}
          </span>
        )}
      </button>
    </article>
  );
}

export function CustomerVideoReel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -320 : 320;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-border bg-canvas section-pad" aria-label="Loved across Kerala">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-caps mb-2">From Our Customers</p>
            <h2 className="font-display text-display-md text-ink">Loved Across Kerala</h2>
            <p className="mt-2 max-w-lg font-body text-sm text-stone">
              Real drapes, real celebrations — scroll through moments from weddings,
              festivals, and family visits to Vimala Silk House.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="border border-border px-4 py-2 font-body text-[10px] font-medium uppercase tracking-widest text-ink hover:border-ink"
              aria-label="Scroll videos left"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="border border-border px-4 py-2 font-body text-[10px] font-medium uppercase tracking-widest text-ink hover:border-ink"
              aria-label="Scroll videos right"
            >
              Next →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none snap-x snap-mandatory sm:gap-4 md:gap-5"
        >
          {CUSTOMER_VIDEO_FRAMES.map((frame) => (
            <VideoFrame key={frame.id} frame={frame} />
          ))}
        </div>
      </div>
    </section>
  );
}
