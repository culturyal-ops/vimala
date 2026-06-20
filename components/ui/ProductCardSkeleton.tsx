import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="luxury-inset aspect-[3/4] animate-pulse rounded-3xl bg-ivory-warm" />
      <div className="mt-4 space-y-2">
        <div className="h-2 w-1/3 animate-pulse rounded-full bg-ivory-dark/60" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-ivory-dark/50" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-ivory-dark/40" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
