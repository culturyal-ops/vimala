import fs from "fs";
import path from "path";

const root = path.join(process.cwd());
const supabaseDir = path.join(root, "supabase");
const vrmDir = path.join(root, "..", "vimala vrm", "vimala-vrm", "supabase");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(name, content) {
  const out = path.join(supabaseDir, name);
  fs.writeFileSync(out, content.trimStart() + "\n");
  console.log(`  wrote ${name}`);
}

function extractPart(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + 1);
  if (start === -1 || end === -1) throw new Error(`Missing markers: ${startMarker}`);
  return source.slice(start + startMarker.length, end).trim();
}

// --- Fix seed generator inline ---
function buildSeedSql() {
  const catalog = read(path.join(root, "lib", "catalog.ts"));
  const seo = read(path.join(root, "lib", "product-seo.ts"));

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
  const blocks = catalog.match(/\{\s*\n\s*id: "[^"]+",[\s\S]*?\n\s*\},/g) ?? [];

  for (const block of blocks) {
    const get = (key) => block.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1];
    const getNum = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*(\\d+(?:\\.\\d+)?)`));
      return m ? Number(m[1]) : undefined;
    };
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
      isNew: block.includes("isNew: true"),
      scarcityNote: get("scarcityNote"),
      sizes,
    });
  }

  function seoForSlug(slug) {
    const block = seo.match(new RegExp(`"${slug}":\\s*\\{[\\s\\S]*?\\n  \\},`));
    if (!block) return {};
    const b = block[0];
    const pick = (key) => b.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1];
    return { sku: pick("sku"), description: pick("description") };
  }

  const lines = [
    "-- Vimala storefront catalog seed (24 products) — idempotent",
    "-- Run after 01-schema, 02-commerce, 03-storefront-catalog",
    "",
  ];

  for (const [i, p] of products.entries()) {
    const meta = seoForSlug(p.slug);
    const stock = p.scarcityNote?.toLowerCase().includes("only")
      ? "low_stock"
      : "in_stock";
    const inv = p.scarcityNote?.match(/only (\d+)/i)?.[1] ?? "25";
    const sizesSql = p.sizes?.length
      ? `ARRAY[${p.sizes.map((s) => `'${s.replace(/'/g, "''")}'`).join(", ")}]`
      : "NULL";
    const img = p.imageUrl ?? "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400";
    const hover = p.hoverImageUrl ? `'${p.hoverImageUrl}'` : "NULL";
    const scarcity = p.scarcityNote
      ? `'${p.scarcityNote.replace(/'/g, "''")}'`
      : "NULL";
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

  return lines.join("\n");
}

console.log("Building supabase SQL files...\n");

const setupAll = read(path.join(vrmDir, "setup-all.sql"));

const schema = `-- Vimala base schema (VRM + storefront)
-- Safe to re-run on existing project (IF NOT EXISTS + policy refresh)

${extractPart(setupAll, "-- PART 1 — DATABASE SCHEMA + RLS\n-- =============================================================================", "-- =============================================================================\n-- PART 2")}`;

const owner = `-- Run AFTER creating admin user in Supabase Auth dashboard
-- Suggested: admin@vimalasilk.com

${extractPart(setupAll, "-- PART 2 — OWNER ACCOUNT (run AFTER creating user in Auth dashboard)", "-- =============================================================================\n-- PART 3")}`;

const storage = `-- Storage buckets for product/banner images

${extractPart(setupAll, "-- PART 3 — STORAGE BUCKETS + POLICIES", "-- =============================================================================\n-- PART 4")}`;

const commerce = read(path.join(vrmDir, "commerce-schema.sql"));
const commerceIdempotent = `-- Commerce schema — orders, payments, carts, coupons, etc.
-- Safe to re-run (IF NOT EXISTS)

-- Drop commerce policies before recreate (safe re-run)
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN (
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'customers','customer_addresses','orders','order_items','payments',
        'shipments','returns','coupons','notifications','analytics_events',
        'abandoned_cart_snapshots','customer_segments','campaigns'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

${commerce.replace(/^-- Vimala Commerce Schema[^\n]*\n--[^\n]*\n\n/m, "")}`;

const storefront = read(path.join(supabaseDir, "storefront-catalog.sql"));
const storefrontNamed = storefront.replace(
  "-- Storefront catalog columns",
  "-- 03 — Storefront catalog columns"
);

const seed = buildSeedSql();

write("01-schema.sql", schema);
write("02-commerce-schema.sql", commerceIdempotent);
write("03-storefront-catalog.sql", storefrontNamed);
write("04-seed-catalog.sql", seed);
write("05-owner-profile.sql", owner);
write("06-storage-buckets.sql", storage);

// Legacy names (keep in sync)
write("seed-catalog.sql", seed);
fs.writeFileSync(path.join(supabaseDir, "storefront-catalog.sql"), storefrontNamed + "\n");

const setup = [
  "-- =============================================================================",
  "-- VIMALA SILK HOUSE — FULL SUPABASE SETUP (paste entire file in SQL Editor)",
  "-- =============================================================================",
  "-- Order: schema → commerce → storefront columns → seed → owner → storage",
  "-- After PART 5: create Auth user admin@vimalasilk.com in Supabase dashboard",
  "-- =============================================================================\n",
  "-- PART 1 — BASE SCHEMA\n",
  schema,
  "\n-- PART 2 — COMMERCE\n",
  commerceIdempotent,
  "\n-- PART 3 — STOREFRONT CATALOG COLUMNS\n",
  storefrontNamed,
  "\n-- PART 4 — SEED 24 PRODUCTS\n",
  seed,
  "\n-- PART 5 — OWNER PROFILE (create Auth user first if not exists)\n",
  owner,
  "\n-- PART 6 — STORAGE BUCKETS\n",
  storage,
  "\n-- Done. Run: npm run commerce:check",
].join("\n");

write("setup-all.sql", setup);

write(
  "README.md",
  `# Supabase setup — Vimala

## Quick start (recommended)

Open **Supabase Dashboard → SQL Editor**, paste the entire contents of:

\`\`\`
supabase/setup-all.sql
\`\`\`

Then create an admin user in **Authentication → Users**:
- Email: \`admin@vimalasilk.com\`
- Password: (your choice)

Re-run only **05-owner-profile.sql** if the user was created after setup.

---

## Or run step-by-step

| Step | File | What it does |
|------|------|--------------|
| 1 | \`01-schema.sql\` | Profiles, products, banners, RLS |
| 2 | \`02-commerce-schema.sql\` | Orders, carts, payments, coupons |
| 3 | \`03-storefront-catalog.sql\` | Extra product columns + anon read |
| 4 | \`04-seed-catalog.sql\` | 24 shop products with inventory |
| 5 | \`05-owner-profile.sql\` | Owner role for admin user |
| 6 | \`06-storage-buckets.sql\` | Image upload buckets |

All files are **idempotent** — safe to re-run.

---

## Regenerate seed after catalog edits

\`\`\`powershell
cd C:\\\\Users\\\\eathe\\\\vimala
npm run supabase:build
\`\`\`

---

## Env + verify

\`\`\`powershell
copy .env.example .env.local
# Fill Supabase URL, anon key, service role key

npm run commerce:check
npm run dev
\`\`\`
`
);

console.log("\nDone. Use supabase/setup-all.sql for one-shot setup.");
