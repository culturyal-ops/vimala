"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Clock, TrendingUp, Sparkles } from "lucide-react";
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

const MAX_RESULTS = 6;
const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT = 4;

const TRENDING_SEARCHES = [
  "Silk Sarees",
  "Bridal Wear",
  "Kanjivaram",
  "Party Sarees",
];

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

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  try {
    const recent = getRecentSearches();
    const updated = [
      query,
      ...recent.filter((q) => q.toLowerCase() !== query.toLowerCase()),
    ].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

type SearchDialogProps = {
  trigger: React.ReactNode;
};

export function SearchDialog({ trigger }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const products = useMemo(() => getEnrichedProducts(), []);
  const results = useMemo(
    () => filterProducts(products, query),
    [products, query]
  );

  const hasQuery = query.trim().length > 0;
  const showEmpty = hasQuery && results.length === 0;
  const showRecent = !hasQuery && recentSearches.length > 0;
  const showTrending = !hasQuery && recentSearches.length === 0;

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setSelectedIndex(-1);
      // Focus input after a brief delay for smooth transition
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [open]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setRecentSearches(getRecentSearches());
    }
  }, []);

  const handleResultClick = useCallback(() => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    setOpen(false);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          saveRecentSearch(query.trim());
          setOpen(false);
          window.location.href = `/shop/${selected.slug}`;
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [results, selectedIndex, query]
  );

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedEl = resultsRef.current.children[selectedIndex] as HTMLElement;
      selectedEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        hideClose
        overlayClassName="bg-ink/95 backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300"
        className={cn(
          "left-0 top-0 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col",
          "items-center justify-start border-0 bg-transparent p-0 shadow-none",
          "duration-300 data-[state=closed]:zoom-out-[0.95] data-[state=open]:zoom-in-100",
          "data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]",
          "pt-[15vh] sm:pt-[20vh]"
        )}
      >
        {/* Close Button */}
        <DialogClose
          className="absolute right-5 top-5 rounded-full bg-crimson-dark/40 p-2 text-gold/70 backdrop-blur-sm transition-all hover:bg-crimson-dark/60 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 sm:right-8 sm:top-8"
          aria-label="Close search"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </DialogClose>

        {/* Keyboard Hint */}
        <div className="absolute left-5 top-5 hidden items-center gap-2 sm:left-8 sm:top-8 sm:flex">
          <kbd className="rounded border border-gold/30 bg-crimson-dark/40 px-2 py-1 font-mono text-xs text-gold/70 backdrop-blur-sm">
            ESC
          </kbd>
          <span className="font-body text-xs text-gold/50">to close</span>
        </div>

        <div className="w-full max-w-2xl px-6 sm:px-8">
          {/* Title with animation */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 animate-pulse text-gold/70 sm:h-7 sm:w-7" strokeWidth={1.5} />
            <DialogTitle className="text-center font-display text-3xl font-medium tracking-wide text-ivory sm:text-4xl">
              Search Store
            </DialogTitle>
            <Sparkles className="h-6 w-6 animate-pulse text-gold/70 sm:h-7 sm:w-7" strokeWidth={1.5} />
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search
              className={cn(
                "pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 transition-all duration-300",
                hasQuery ? "text-gold" : "text-gold/50"
              )}
              strokeWidth={1.5}
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search silk sarees, bridal wear, accessories..."
              className={cn(
                "w-full border-0 border-b bg-transparent transition-all duration-300",
                "py-4 pl-9 pr-2 font-display text-lg text-ivory sm:text-xl",
                "placeholder:font-display placeholder:text-ivory/35",
                "focus:outline-none focus:ring-0",
                hasQuery
                  ? "border-gold shadow-[0_1px_0_0_rgba(212,175,55,0.5)]"
                  : "border-gold/40"
              )}
            />
          </div>

          {/* Results Container */}
          <div className="mt-8 min-h-[200px]">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="mb-4 flex items-center gap-2 px-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <span className="font-body text-xs tracking-wider text-gold/60">
                    {results.length} {results.length === 1 ? "RESULT" : "RESULTS"}
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>
                <ul
                  ref={resultsRef}
                  className="space-y-1 overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 50vh)" }}
                  role="listbox"
                  aria-label="Search results"
                >
                  {results.map((product, index) => (
                    <li key={product.id}>
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={handleResultClick}
                        className={cn(
                          "group flex items-center gap-4 rounded-lg px-3 py-3.5 transition-all duration-200",
                          "hover:bg-crimson-dark/50 hover:shadow-[0_0_20px_rgba(139,0,0,0.15)]",
                          selectedIndex === index &&
                            "bg-crimson-dark/50 shadow-[0_0_20px_rgba(139,0,0,0.15)]"
                        )}
                        role="option"
                        aria-selected={selectedIndex === index}
                      >
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-crimson-dark/60 shadow-md transition-transform duration-200 group-hover:scale-105">
                          <Image
                            src={product.imageUrl}
                            alt={product.imageAlt}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-base text-ivory transition-colors group-hover:text-gold-pale">
                            {product.name}
                          </p>
                          <p className="font-body text-xs text-ivory/45">
                            {product.category}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <p className="font-body text-sm font-medium text-gold">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty State */}
            {showEmpty && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex flex-col items-center gap-4 py-12 duration-300">
                <div className="rounded-full bg-crimson-dark/40 p-4">
                  <Search className="h-8 w-8 text-gold/50" strokeWidth={1.5} />
                </div>
                <p className="text-center font-display text-base text-gold-muted">
                  No matches found for &quot;{query}&quot;
                </p>
                <p className="text-center font-body text-sm text-ivory/40">
                  Try &lsquo;saree&rsquo;, &lsquo;bridal&rsquo;, or
                  &lsquo;silk&rsquo;
                </p>
              </div>
            )}

            {/* Recent Searches */}
            {showRecent && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="mb-4 flex items-center gap-2 px-2">
                  <Clock className="h-4 w-4 text-gold/50" strokeWidth={1.5} />
                  <span className="font-body text-xs tracking-wider text-gold/60">
                    RECENT SEARCHES
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="group flex items-center gap-2 rounded-full border border-gold/30 bg-crimson-dark/40 px-4 py-2 font-body text-sm text-ivory/80 backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-crimson-dark/60 hover:text-ivory"
                    >
                      <Clock className="h-3.5 w-3.5 text-gold/40 transition-colors group-hover:text-gold/70" strokeWidth={1.5} />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {showTrending && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="mb-4 flex items-center gap-2 px-2">
                  <TrendingUp className="h-4 w-4 text-gold/50" strokeWidth={1.5} />
                  <span className="font-body text-xs tracking-wider text-gold/60">
                    TRENDING SEARCHES
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="group flex items-center gap-2 rounded-full border border-gold/30 bg-crimson-dark/40 px-4 py-2 font-body text-sm text-ivory/80 backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-crimson-dark/60 hover:text-ivory"
                    >
                      <TrendingUp className="h-3.5 w-3.5 text-gold/40 transition-colors group-hover:text-gold/70" strokeWidth={1.5} />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Keyboard Hints at Bottom */}
          {results.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-4 border-t border-gold/20 pt-4">
              <div className="flex items-center gap-1.5">
                <kbd className="rounded border border-gold/30 bg-crimson-dark/40 px-1.5 py-0.5 font-mono text-xs text-gold/70">
                  ↑
                </kbd>
                <kbd className="rounded border border-gold/30 bg-crimson-dark/40 px-1.5 py-0.5 font-mono text-xs text-gold/70">
                  ↓
                </kbd>
                <span className="font-body text-xs text-gold/50">navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="rounded border border-gold/30 bg-crimson-dark/40 px-2 py-0.5 font-mono text-xs text-gold/70">
                  ↵
                </kbd>
                <span className="font-body text-xs text-gold/50">select</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
