"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/constants";
import {
  getEnrichedProducts,
  type EnrichedProduct,
} from "@/lib/product-seo";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 5;

function filterProducts(
  products: EnrichedProduct[],
  query: string
): EnrichedProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  return products
    .filter((product) => {
      const haystack = [
        product.name,
        product.category,
        product.fabric,
        product.department,
        product.sku,
      ]
        .join(" ")
        .toLowerCase();

      return terms.every((term) => haystack.includes(term));
    })
    .slice(0, MAX_RESULTS);
}

type SearchDialogProps = {
  trigger: React.ReactNode;
};

export function SearchDialog({ trigger }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const products = useMemo(() => getEnrichedProducts(), []);
  const results = useMemo(
    () => filterProducts(products, query),
    [products, query]
  );

  const hasQuery = query.trim().length > 0;
  const showEmpty = hasQuery && results.length === 0;

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        hideClose
        overlayClassName="bg-ink/95 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
        className={cn(
          "left-0 top-0 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col",
          "items-center justify-start border-0 bg-transparent p-0 shadow-none",
          "duration-200 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98]",
          "data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0",
          "data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0",
          "pt-[18vh] sm:pt-[22vh]"
        )}
      >
        <DialogClose
          className="absolute right-5 top-5 text-gold/70 transition-colors hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 sm:right-8 sm:top-8"
          aria-label="Close search"
        >
          <X className="h-5 w-5" strokeWidth={1.25} />
        </DialogClose>

        <div className="w-full max-w-xl px-6 sm:px-8">
          <DialogTitle className="mb-8 text-center font-display text-3xl font-medium tracking-wide text-ivory sm:text-4xl">
            Search Store
          </DialogTitle>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gold"
              strokeWidth={1.5}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search silk sarees, bridal wear, accessories..."
              className={cn(
                "w-full border-0 border-b border-gold/50 bg-transparent",
                "py-4 pl-8 pr-2 font-display text-lg text-ivory sm:text-xl",
                "placeholder:font-display placeholder:text-ivory/35",
                "focus:border-gold focus:outline-none focus:ring-0"
              )}
              autoFocus
            />
          </div>

          {results.length > 0 && (
            <ul className="mt-8 space-y-1" role="listbox" aria-label="Search results">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/shop/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-crimson-dark/40"
                    role="option"
                  >
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-crimson-dark/60">
                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base text-ivory group-hover:text-gold-pale">
                        {product.name}
                      </p>
                      <p className="font-body text-xs text-ivory/45">
                        {product.category}
                      </p>
                    </div>
                    <p className="shrink-0 font-body text-sm font-medium text-gold">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {showEmpty && (
            <p className="mt-8 text-center font-display text-base italic text-gold-muted">
              No matches — try &lsquo;saree&rsquo; or &lsquo;bridal&rsquo;
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
