import fs from "fs";

// Parse catalog.ts and product-seo.ts as text for seed generation

const root = new URL("..", import.meta.url);
const catalog = fs.readFileSync(new URL("lib/catalog.ts", root), "utf8");
const seo = fs.readFileSync(new URL("lib/product-seo.ts", root), "utf8");

const imgMap = {};
const imgBlock = catalog.match(/const IMG = \{([\s\S]*?)\};/);
if (imgBlock) {
  for (const m of imgBlock[1].matchAll(/(\w+):\s*"([^"]+)"/g)) {
    imgMap[m[1]] = m[2];
  }
}

function resolveImg(raw) {
  if (!raw) return undefined;
  const ref = raw.replace(/"/g, "");
  if (ref.startsWith("IMG.")) return imgMap[ref.slice(4)];
  return ref;
}

const products = [];
const productBlocks = catalog.match(/\{\s*\n\s*id: "[^"]+",[\s\S]*?\n\s*\},/g) ?? [];

for (const block of productBlocks) {
  const get = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*"([^"]*)"`));
    return m?.[1];
  };
  const getNum = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*(\\d+(?:\\.\\d+)?)`));
    return m ? Number(m[1]) : undefined;
  };
  const getBool = (key) => block.includes(`${key}: true`);
  const getImg = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*(IMG\\.\\w+|"[^"]+")`));
    return m ? resolveImg(m[1]) : undefined;
  };
  const sizesMatch = block.match(/sizes:\s*\[([^\]]*)\]/);
  const sizes = sizesMatch
    ? sizesMatch[1].match(/"([^"]+)"/g)?.map((s) => s.replace(/"/g, ""))
    : null;

  products.push({
    id: get("id"),
    slug: get("slug"),
    name: get("name"),
    department: get("department"),
    category: get("category"),
    fabric: get("fabric"),
    price: getNum("price"),
    originalPrice: getNum("originalPrice"),
    discount: getNum("discount"),
    imageUrl: getImg("imageUrl"),
    hoverImageUrl: getImg("hoverImageUrl"),
    isNew: getBool("isNew"),
    scarcityNote: get("scarcityNote"),
    sizes,
  });
}

function seoForSlug(slug) {
  const block = seo.match(new RegExp(`"${slug}":\\s*\\{[\\s\\S]*?\\n  \\},`));
  if (!block) return {};
  const b = block[0];
  const pick = (key) => b.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1];
  return {
    sku: pick("sku"),
    description: pick("description"),
  };
}

const lines = [
  "-- Vimala storefront catalog seed — idempotent",
  "-- Run after schema.sql + commerce-schema.sql + storefront-catalog.sql",
  "",
];

for (const [i, p] of products.entries()) {
  const meta = seoForSlug(p.slug);
  const stock =
    p.scarcityNote?.toLowerCase().includes("only") ? "low_stock" : "in_stock";
  const inv = p.scarcityNote?.match(/only (\d+)/i)?.[1] ?? "25";
  const sizesSql = p.sizes?.length
    ? `ARRAY[${p.sizes.map((s) => `'${s.replace(/'/g, "''")}'`).join(", ")}]`
    : "NULL";
  const img = p.imageUrl ?? "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400";
  const hover = p.hoverImageUrl ? `'${p.hoverImageUrl}'` : "NULL";
  const scarcity = p.scarcityNote ? `'${p.scarcityNote.replace(/'/g, "''")}'` : "NULL";
  const orig = p.originalPrice ?? "NULL";
  const disc = p.discount ?? "NULL";

  lines.push(`INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  '${p.id}',
  '${p.name.replace(/'/g, "''")}',
  '${p.slug}',
  '${(meta.description ?? p.name).replace(/'/g, "''")}',
  '${p.fabric.replace(/'/g, "''")}',
  ${p.price},
  ${orig},
  '${stock}',
  ${p.isNew ? "true" : "false"},
  '${img}',
  ARRAY['${img}'${p.hoverImageUrl ? `, '${p.hoverImageUrl}'` : ""}],
  '${meta.sku}',
  500,
  ${inv},
  0,
  '${p.department}',
  '${p.category.replace(/'/g, "''")}',
  ${sizesSql},
  ${scarcity},
  ${disc},
  ${hover},
  'published',
  true,
  ${i + 1}
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;`);
  lines.push("");
}

const out = new URL("../supabase/04-seed-catalog.sql", import.meta.url);
fs.mkdirSync(new URL("../supabase/", import.meta.url), { recursive: true });
fs.writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${products.length} products to supabase/seed-catalog.sql`);
