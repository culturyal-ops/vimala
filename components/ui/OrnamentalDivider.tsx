import { LotusIcon } from "./LotusIcon";
import { cn } from "@/lib/utils";

interface OrnamentalDividerProps {
  className?: string;
  color?: "gold" | "ivory";
}

export function OrnamentalDivider({
  className,
  color = "gold",
}: OrnamentalDividerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        color === "gold" ? "text-gold" : "text-ivory/60",
        className
      )}
      aria-hidden
    >
      <span className="h-px w-12 bg-current opacity-40 md:w-20" />
      <LotusIcon />
      <span className="h-px w-12 bg-current opacity-40 md:w-20" />
    </div>
  );
}
