import { cn } from "@/lib/utils";

interface ArchFrameProps {
  children: React.ReactNode;
  className?: string;
  frameClassName?: string;
}

export function ArchFrame({
  children,
  className,
  frameClassName,
}: ArchFrameProps) {
  return (
    <div className={cn("group relative", className)}>
      <div
        className={cn(
          "arch-clip relative overflow-hidden bg-crimson-dark",
          frameClassName
        )}
      >
        {children}
      </div>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 200 280"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M8 272 L8 118 Q8 12 100 12 Q192 12 192 118 L192 272"
          stroke="#D4AF37"
          strokeWidth="1.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M20 272 L20 128 Q20 36 100 36 Q180 36 180 128 L180 272"
          stroke="#D4AF37"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
