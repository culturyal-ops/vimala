const STORAGE_KEY = "vimala-recently-viewed";
const MAX_ITEMS = 8;

export type RecentItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  viewedAt: number;
};

export function getRecentlyViewed(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: Omit<RecentItem, "viewedAt">): void {
  if (typeof window === "undefined") return;
  const existing = getRecentlyViewed().filter((i) => i.slug !== item.slug);
  const next: RecentItem[] = [
    { ...item, viewedAt: Date.now() },
    ...existing,
  ].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
