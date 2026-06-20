import { createAnonClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DepartmentId } from "@/lib/catalog";
import type { EnrichedProduct } from "@/lib/product-seo";
import { getEnrichedProducts } from "@/lib/product-seo";

type DbProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  fabric: string | null;
  price: number;
  original_price: number | null;
  stock_status: string;
  is_new: boolean;
  thumbnail: string | null;
  images: string[] | null;
  sku: string | null;
  department: string | null;
  category_label: string | null;
  sizes: string[] | null;
  scarcity_note: string | null;
  discount_percent: number | null;
  hover_image_url: string | null;
  publish_status: string | null;
  is_active: boolean;
};

function mapDbRow(row: DbProductRow): EnrichedProduct {
  const imageUrl = row.thumbnail ?? row.images?.[0] ?? "";
  const hoverImageUrl = row.hover_image_url ?? row.images?.[1];
  const department = (row.department ?? "women") as DepartmentId;

  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku ?? row.slug.toUpperCase(),
    description:
      row.description ??
      `${row.name} — available at Vimala Silk House, Kattappana.`,
    imageAlt: `${row.name} — ${row.fabric ?? "premium fabric"}`,
    name: row.name,
    department,
    category: row.category_label ?? "General",
    fabric: row.fabric ?? "",
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    discount: row.discount_percent ?? undefined,
    imageUrl,
    hoverImageUrl: hoverImageUrl ?? undefined,
    isNew: row.is_new,
    sizes: row.sizes ?? undefined,
    scarcityNote:
      row.scarcity_note ??
      (row.stock_status === "low_stock" ? "Limited stock" : undefined),
  };
}

export async function fetchProductsFromDb(): Promise<EnrichedProduct[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, fabric, price, original_price, stock_status, is_new, thumbnail, images, sku, department, category_label, sizes, scarcity_note, discount_percent, hover_image_url, publish_status, is_active"
    )
    .eq("is_active", true)
    .eq("publish_status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as DbProductRow[]).map(mapDbRow);
}

export async function fetchProductBySlugFromDb(
  slug: string
): Promise<EnrichedProduct | undefined> {
  if (!isSupabaseConfigured()) return undefined;

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, fabric, price, original_price, stock_status, is_new, thumbnail, images, sku, department, category_label, sizes, scarcity_note, discount_percent, hover_image_url, publish_status, is_active"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("publish_status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;
  return mapDbRow(data as DbProductRow);
}

export async function getCatalogProducts(): Promise<EnrichedProduct[]> {
  try {
    const fromDb = await fetchProductsFromDb();
    if (fromDb.length > 0) return fromDb;
  } catch (err) {
    console.warn("[catalog] Supabase unavailable, using static catalog:", err);
  }
  return getEnrichedProducts();
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<EnrichedProduct | undefined> {
  try {
    const fromDb = await fetchProductBySlugFromDb(slug);
    if (fromDb) return fromDb;
  } catch (err) {
    console.warn(`[catalog] Supabase lookup failed for ${slug}:`, err);
  }
  return getEnrichedProducts().find((p) => p.slug === slug);
}

export async function getCatalogSlugs(): Promise<string[]> {
  const products = await getCatalogProducts();
  return products.map((p) => p.slug);
}
