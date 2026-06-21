import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
}

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
  variant = "light",
}: SectionTitleProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "mb-16 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div>
        <h2
          className={cn(
            "font-display font-light tracking-tight",
            "text-4xl md:text-5xl lg:text-6xl",
            isDark ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-5 max-w-2xl font-body text-base md:text-lg leading-relaxed",
              isDark ? "text-white/80" : "text-stone",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className={cn(
        "h-[1px] w-16 mt-2",
        isDark ? "bg-white/30" : "bg-ink/20"
      )} />
    </div>
  );
}
