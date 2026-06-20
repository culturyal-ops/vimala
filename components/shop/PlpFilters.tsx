"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import {
  PRICE_RANGES,
  SORT_OPTIONS,
  type PriceRangeId,
  type SortId,
} from "@/lib/plp-filters";
import { cn } from "@/lib/utils";

type PlpToolbarProps = {
  sort: SortId;
  onSortChange: (sort: SortId) => void;
  selectedPrices: PriceRangeId[];
  selectedFabrics: string[];
  onRemovePrice: (id: PriceRangeId) => void;
  onRemoveFabric: (fabric: string) => void;
  onClearAll: () => void;
  resultCount: number;
};

export function PlpToolbar({
  sort,
  onSortChange,
  selectedPrices,
  selectedFabrics,
  onRemovePrice,
  onRemoveFabric,
  onClearAll,
  resultCount,
}: PlpToolbarProps) {
  const hasActiveFilters =
    selectedPrices.length > 0 || selectedFabrics.length > 0;

  return (
    <div className="mb-6 space-y-3 border-b border-border pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-body text-sm text-stone">{resultCount} pieces</p>
        <label className="relative">
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortId)}
            className="appearance-none border border-border bg-canvas py-2 pl-3 pr-9 font-body text-[11px] font-medium uppercase tracking-widest text-ink focus:border-ink focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone" />
        </label>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedPrices.map((id) => {
            const label = PRICE_RANGES.find((r) => r.id === id)?.label ?? id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onRemovePrice(id)}
                className="inline-flex items-center gap-1.5 border border-border bg-surface px-2.5 py-1 font-body text-[10px] uppercase tracking-wide text-ink"
              >
                {label}
                <X className="h-3 w-3" />
              </button>
            );
          })}
          {selectedFabrics.map((fabric) => (
            <button
              key={fabric}
              type="button"
              onClick={() => onRemoveFabric(fabric)}
              className="inline-flex items-center gap-1.5 border border-border bg-surface px-2.5 py-1 font-body text-[10px] uppercase tracking-wide text-ink"
            >
              {fabric}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="font-body text-[10px] uppercase tracking-wide text-stone underline-offset-2 hover:text-crimson hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

type PlpFiltersProps = {
  fabrics: string[];
  selectedPrices: PriceRangeId[];
  selectedFabrics: string[];
  onPriceChange: (id: PriceRangeId) => void;
  onFabricChange: (fabric: string) => void;
  onClear: () => void;
};

function FilterChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "border px-3 py-2 text-left font-body text-xs transition-colors",
        checked
          ? "border-ink bg-ink text-canvas"
          : "border-border bg-canvas text-ink-muted hover:border-ink hover:text-ink"
      )}
    >
      {label}
    </button>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-4 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between font-body text-[11px] font-medium uppercase tracking-widest text-ink">
        {title}
        <ChevronDown className="h-3.5 w-3.5 text-stone transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </details>
  );
}

export function PlpFilters({
  fabrics,
  selectedPrices,
  selectedFabrics,
  onPriceChange,
  onFabricChange,
  onClear,
}: PlpFiltersProps) {
  const hasFilters =
    selectedPrices.length > 0 || selectedFabrics.length > 0;

  return (
    <aside className="border border-border bg-canvas p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-body text-[11px] font-medium uppercase tracking-widest text-ink">
          Filter
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="font-body text-[10px] uppercase tracking-wide text-stone hover:text-crimson"
          >
            Clear
          </button>
        )}
      </div>

      <FilterSection title="Price">
        {PRICE_RANGES.map((range) => (
          <FilterChip
            key={range.id}
            label={range.label}
            checked={selectedPrices.includes(range.id)}
            onChange={() => onPriceChange(range.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Fabric">
        {fabrics.map((fabric) => (
          <FilterChip
            key={fabric}
            label={fabric}
            checked={selectedFabrics.includes(fabric)}
            onChange={() => onFabricChange(fabric)}
          />
        ))}
      </FilterSection>
    </aside>
  );
}

export function MobileFilterBar({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mb-4 flex w-full items-center justify-between border border-border bg-canvas px-4 py-3 font-body text-[11px] font-medium uppercase tracking-widest text-ink md:hidden"
    >
      <span className="flex items-center gap-2">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter {count > 0 && `(${count})`}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-stone" />
    </button>
  );
}
