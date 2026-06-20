import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Vimala commerce check\n");
console.log(`Supabase (anon reads):  ${url && anonKey ? "OK" : "MISSING — static catalog only"}`);
console.log(`Supabase (service role): ${url && serviceKey ? "OK" : "MISSING — checkout API will fail"}`);
console.log(
  `Razorpay keys:           ${
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? "OK" : "MISSING — COD still works"
  }`
);

if (!url || !anonKey) {
  console.log("\nCopy .env.example → .env.local and add Supabase keys.");
  process.exit(0);
}

const supabase = createClient(url, anonKey);
const { data, error } = await supabase
  .from("products")
  .select("id, slug, inventory_quantity")
  .eq("is_active", true)
  .eq("publish_status", "published")
  .limit(5);

if (error) {
  console.error("\nSupabase query failed:", error.message);
  console.log("Run migrations — see supabase/README.md");
  process.exit(1);
}

console.log(`\nPublished products in DB: ${data?.length ?? 0} (sample)`);
for (const row of data ?? []) {
  console.log(`  - ${row.slug} (stock: ${row.inventory_quantity})`);
}

if ((data?.length ?? 0) === 0) {
  console.log("\nNo products — run supabase/seed-catalog.sql in Supabase SQL editor");
  process.exit(1);
}

console.log("\nReady for checkout E2E.");
