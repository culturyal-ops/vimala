/**
 * Complete Vimala Supabase setup via direct Postgres + Admin API.
 * Uses DB password from SUPABASE_DB_PASSWORD or defaults to project password.
 */
import fs from "fs";
import path from "path";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const { Client } = pg;

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

const PROJECT_REF = "iyojbohsiyzeawgphlcy";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  `https://${PROJECT_REF}.supabase.co`;
const ADMIN_EMAIL = process.env.VIMALA_ADMIN_EMAIL ?? "admin@vimalasilk.com";
const ADMIN_PASSWORD = process.env.VIMALA_ADMIN_PASSWORD ?? "vimala@revolq";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD ?? ADMIN_PASSWORD;

function getServiceKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SB_SECRET_KEY
  );
}

function getAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

async function connectDb() {
  const hosts = [
    `db.${PROJECT_REF}.supabase.co`,
    "aws-0-ap-south-1.pooler.supabase.com",
    "aws-0-ap-southeast-1.pooler.supabase.com",
  ];
  const users = ["postgres", `postgres.${PROJECT_REF}`];
  const ports = [5432, 6543];

  let lastErr;
  for (const host of hosts) {
    for (const user of users) {
      for (const port of ports) {
        const client = new Client({
          host,
          port,
          user,
          password: DB_PASSWORD,
          database: "postgres",
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 12000,
        });
        try {
          await client.connect();
          console.log(`  db via ${host}:${port} as ${user}`);
          return client;
        } catch (err) {
          lastErr = err;
          await client.end().catch(() => undefined);
        }
      }
    }
  }
  throw lastErr ?? new Error("Could not connect to Postgres");
}

async function ensureProducts(db) {
  const seedPath = path.join(process.cwd(), "supabase", "04-seed-catalog.sql");
  if (!fs.existsSync(seedPath)) {
    console.log("  skip seed — 04-seed-catalog.sql not found");
    return;
  }
  const { rows } = await db.query(
    "SELECT COUNT(*)::int AS n FROM products WHERE is_active = true"
  );
  const count = rows[0]?.n ?? 0;
  console.log(`  products in DB: ${count}`);
  if (count >= 24) return;

  console.log("  running seed SQL...");
  const sql = fs.readFileSync(seedPath, "utf8");
  await db.query(sql);
  const { rows: after } = await db.query(
    "SELECT COUNT(*)::int AS n FROM products WHERE is_active = true"
  );
  console.log(`  products after seed: ${after[0]?.n ?? 0}`);
}

async function ensureOwnerProfile(db) {
  const { rows } = await db.query(
    `SELECT id, email FROM auth.users WHERE email = $1 LIMIT 1`,
    [ADMIN_EMAIL]
  );
  if (rows.length === 0) {
    console.log(`  no auth user for ${ADMIN_EMAIL} yet`);
    return false;
  }
  const userId = rows[0].id;
  await db.query(
    `INSERT INTO public.profiles (id, email, full_name, role)
     VALUES ($1, $2, 'Vimala Owner', 'owner')
     ON CONFLICT (id) DO UPDATE SET
       role = 'owner',
       full_name = 'Vimala Owner',
       email = EXCLUDED.email`,
    [userId, ADMIN_EMAIL]
  );
  console.log(`  owner profile set for ${ADMIN_EMAIL}`);
  return true;
}

async function createAdminViaSignUp() {
  const anon = getAnonKey();
  if (!anon) return false;

  const client = createClient(SUPABASE_URL, anon);
  const { data, error } = await client.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    options: {
      data: { full_name: "Vimala Owner", role: "owner" },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      console.log(`  ${ADMIN_EMAIL} already registered`);
      return true;
    }
    console.log(`  signUp: ${error.message}`);
    return false;
  }

  if (data.user) {
    console.log(`  signed up ${ADMIN_EMAIL} (${data.user.id})`);
    return true;
  }
  return false;
}

async function createAdminViaApi() {
  const serviceKey = getServiceKey();
  if (!serviceKey) return false;

  const admin = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === ADMIN_EMAIL);

  if (!found) {
    const { data, error } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Vimala Owner", role: "owner" },
    });
    if (error) {
      console.error("  admin createUser failed:", error.message);
      return false;
    }
    console.log(`  created auth user ${ADMIN_EMAIL} (${data.user?.id})`);
  } else {
    console.log(`  auth user exists: ${ADMIN_EMAIL}`);
    await admin.auth.admin.updateUserById(found.id, {
      password: ADMIN_PASSWORD,
      user_metadata: { full_name: "Vimala Owner", role: "owner" },
    });
  }
  return true;
}

async function createAdminViaSql(db) {
  const { rows: existing } = await db.query(
    `SELECT id FROM auth.users WHERE email = $1`,
    [ADMIN_EMAIL]
  );
  if (existing.length > 0) {
    console.log(`  auth user already exists (SQL check)`);
    return true;
  }

  // GoTrue-compatible user + identity (email provider)
  const { rows } = await db.query(
    `
    WITH new_user AS (
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        $1,
        crypt($2, gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Vimala Owner","role":"owner"}'::jsonb,
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
      )
      RETURNING id, email
    )
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    SELECT
      gen_random_uuid(),
      id,
      jsonb_build_object('sub', id::text, 'email', email),
      'email',
      id::text,
      NOW(),
      NOW(),
      NOW()
    FROM new_user
    RETURNING user_id
    `,
    [ADMIN_EMAIL, ADMIN_PASSWORD]
  );

  console.log(`  created auth user via SQL (${rows[0]?.user_id})`);
  return true;
}

async function ensureOwnerProfileViaSignIn() {
  const anon = getAnonKey();
  if (!anon) return false;

  const client = createClient(SUPABASE_URL, anon);
  const { data, error } = await client.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (error) {
    console.log(`  signIn for owner profile: ${error.message}`);
    return false;
  }

  const userId = data.user?.id;
  if (!userId) return false;

  const { error: upErr } = await client
    .from("profiles")
    .update({ role: "owner", full_name: "Vimala Owner" })
    .eq("id", userId);

  if (upErr) {
    console.log(`  profile update: ${upErr.message}`);
    return false;
  }

  console.log(`  owner profile set via sign-in (${userId})`);
  return true;
}

async function syncVrmEnv(serviceKey) {
  const vrmEnv = path.join(
    process.cwd(),
    "..",
    "vimala vrm",
    "vimala-vrm",
    ".env.local"
  );
  if (!fs.existsSync(path.dirname(vrmEnv))) return;

  const anon = getAnonKey() ?? "";
  const lines = [
    `NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}`,
    `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${anon}`,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceKey ?? ""}`,
    `SUPABASE_SECRET_KEY=${serviceKey ?? ""}`,
    "NEXT_PUBLIC_SITE_URL=http://localhost:3001",
    "NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000",
    "CRON_SECRET=vimala-cron-local-dev",
  ];
  fs.writeFileSync(vrmEnv, lines.join("\n") + "\n");
  console.log("  synced VRM .env.local to same Supabase project");
}

async function updateStorefrontEnv(serviceKey) {
  if (!serviceKey) return;
  const envPath = path.join(process.cwd(), ".env.local");
  let content = fs.readFileSync(envPath, "utf8");
  for (const [key, val] of [
    ["SUPABASE_SERVICE_ROLE_KEY", serviceKey],
    ["SUPABASE_SECRET_KEY", serviceKey],
  ]) {
    const re = new RegExp(`^${key}=.*$`, "m");
    content = re.test(content)
      ? content.replace(re, `${key}=${val}`)
      : content + `\n${key}=${val}\n`;
  }
  fs.writeFileSync(envPath, content);
  console.log("  wrote secret key to storefront .env.local");
}

async function tryFetchServiceRoleFromDb(db) {
  // Supabase stores JWT secret in vault — service_role JWT is signed offline.
  // Some projects expose api keys in internal tables (not standard).
  try {
    const { rows } = await db.query(`
      SELECT decrypted_secret FROM vault.decrypted_secrets
      WHERE name ILIKE '%service%' OR name ILIKE '%jwt%'
      LIMIT 5
    `);
    if (rows.length > 0) {
      console.log("  vault secrets found:", rows.map((r) => r.decrypted_secret?.slice(0, 20)));
    }
  } catch {
    /* vault not accessible */
  }
  return null;
}

async function main() {
  console.log("Vimala complete setup\n");

  let db;
  try {
    try {
      db = await connectDb();
      console.log("Postgres: connected\n");
    } catch (dbErr) {
      console.log(`Postgres: skipped (${dbErr.message})\n`);
    }

    console.log("[1/4] Products");
    if (db) {
      await ensureProducts(db);
    } else {
      const anon = getAnonKey();
      if (anon) {
        const pub = createClient(SUPABASE_URL, anon);
        const { count } = await pub
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);
        console.log(`  products via API: ${count ?? 0}`);
      }
    }

    console.log("\n[2/4] Admin user");
    let adminOk = await createAdminViaApi();
    if (!adminOk) adminOk = await createAdminViaSignUp();
    if (!adminOk && db) {
      console.log("  trying SQL auth user creation...");
      await createAdminViaSql(db);
    }
    if (db) await ensureOwnerProfile(db);
    else await ensureOwnerProfileViaSignIn();

    console.log("\n[3/4] Secret / service key");
    let serviceKey = getServiceKey();
    if (!serviceKey) {
      await tryFetchServiceRoleFromDb(db);
      console.log(
        "  secret key not in env — paste sb_secret_ from Dashboard → Settings → API"
      );
      console.log("  Then run: npm run setup:complete");
      console.log("  Also run supabase/07-confirm-admin.sql in SQL Editor");
    } else {
      console.log("  service role key present");
      await updateStorefrontEnv(serviceKey);
    }

    console.log("\n[4/4] VRM env sync");
    await syncVrmEnv(serviceKey);

    const anon = getAnonKey();
    if (anon) {
      const pub = createClient(SUPABASE_URL, anon);
      const { count } = await pub
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      console.log(`\nStorefront read check: ${count ?? 0} active products`);
    }
  } catch (err) {
    console.error("\nSetup error:", err.message);
    if (err.message.includes("password authentication failed")) {
      console.log(
        "\nDB password wrong. Set SUPABASE_DB_PASSWORD in .env.local to your Supabase database password."
      );
    }
    process.exit(1);
  } finally {
    await db?.end().catch(() => undefined);
  }

  console.log("\nDone.");
  if (!getServiceKey()) {
    console.log(
      "\nAlmost done — add SUPABASE_SECRET_KEY to .env.local (see SETUP.md)"
    );
    process.exit(0);
  }
}

main();
