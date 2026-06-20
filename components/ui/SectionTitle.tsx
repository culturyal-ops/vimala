import { GoldDivider } from "./GoldDivider";
import { LotusIcon } from "./LotusIcon";
import { OrnamentalDivider } from "./OrnamentalDivider";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
  showLotus?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
  variant = "light",
  showLotus = true,
}: SectionTitleProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {showLotus && (
        <LotusIcon
          className={cn(isDark ? "text-gold" : "text-gold")}
        />
      )}
      <div>
        <h2
          className={cn(
            "font-display text-2xl font-medium uppercase tracking-[0.2em] md:text-3xl lg:text-4xl",
            isDark ? "text-ivory" : "text-crimson"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-3 max-w-xl font-body text-sm leading-relaxed md:text-base",
              isDark ? "text-ivory/60" : "text-ink/60",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {showLotus ? (
        <OrnamentalDivider color={isDark ? "ivory" : "gold"} />
      ) : (
        <GoldDivider />
      )}
    </div>
  );
}
