const STORAGE_KEY = "vimala-wishlist";

export function getWishlistSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleWishlistSlug(slug: string): string[] {
  const current = getWishlistSlugs();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function isWishlisted(slug: string): boolean {
  return getWishlistSlugs().includes(slug);
}

/** @deprecated Use slug-based wishlist helpers */
export function getWishlistIds(): string[] {
  return getWishlistSlugs();
}

/** @deprecated Use toggleWishlistSlug */
export function toggleWishlistId(slug: string): string[] {
  return toggleWishlistSlug(slug);
}
