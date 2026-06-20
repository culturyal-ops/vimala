import { formatPrice } from "@/lib/constants";
import { getSaveAmount } from "@/lib/conversion";
import { cn } from "@/lib/utils";

type ProductPriceProps = {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function ProductPrice({
  price,
  originalPrice,
  size = "sm",
  className,
}: ProductPriceProps) {
  const saveAmount =
    originalPrice && originalPrice > price
      ? getSaveAmount(originalPrice, price)
      : null;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex flex-wrap items-baseline gap-2">
        {originalPrice && (
          <span
            className={cn(
              "font-body text-ink/40 line-through",
              size === "sm" && "text-sm",
              size === "md" && "text-base",
              size === "lg" && "text-lg"
            )}
          >
            {formatPrice(originalPrice)}
          </span>
        )}
        <span
          className={cn(
            "font-body font-semibold text-crimson",
            size === "sm" && "text-base",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}
        >
          {formatPrice(price)}
        </span>
      </div>
      {saveAmount !== null && saveAmount > 0 && (
        <p
          className={cn(
            "font-body font-medium text-gold-muted",
            size === "sm" && "text-[10px]",
            size === "md" && "text-xs",
            size === "lg" && "text-sm"
          )}
        >
          Save {formatPrice(saveAmount)}
        </p>
      )}
    </div>
  );
}
