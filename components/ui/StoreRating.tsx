import { Star } from "lucide-react";
import { STORE } from "@/lib/store-info";
import { cn } from "@/lib/utils";

type StoreRatingProps = {
  size?: "sm" | "md";
  showReviews?: boolean;
  className?: string;
};

export function StoreRating({
  size = "sm",
  showReviews = true,
  className,
}: StoreRatingProps) {
  const { score, count } = STORE.rating;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-body font-medium text-ink/70",
        size === "sm" && "text-[11px]",
        size === "md" && "text-sm",
        className
      )}
      aria-label={`Rated ${score} out of 5 from over ${count} reviews`}
    >
      <Star
        className={cn(
          "shrink-0 fill-gold text-gold",
          size === "sm" && "h-3 w-3",
          size === "md" && "h-3.5 w-3.5"
        )}
        strokeWidth={0}
      />
      <span className="text-ink/80">{score}★</span>
      {showReviews && (
        <span className="text-ink/45">({count}+)</span>
      )}
    </div>
  );
}
