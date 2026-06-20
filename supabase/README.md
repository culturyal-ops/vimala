# Supabase setup — Vimala

## Quick start (recommended)

Open **Supabase Dashboard → SQL Editor**, paste the entire contents of:

```
supabase/setup-all.sql
```

Then create an admin user in **Authentication → Users**:
- Email: `admin@vimalasilk.com`
- Password: (your choice)

Re-run only **05-owner-profile.sql** if the user was created after setup.

---

## Or run step-by-step

| Step | File | What it does |
|------|------|--------------|
| 1 | `01-schema.sql` | Profiles, products, banners, RLS |
| 2 | `02-commerce-schema.sql` | Orders, carts, payments, coupons |
| 3 | `03-storefront-catalog.sql` | Extra product columns + anon read |
| 4 | `04-seed-catalog.sql` | 24 shop products with inventory |
| 5 | `05-owner-profile.sql` | Owner role for admin user |
| 6 | `06-storage-buckets.sql` | Image upload buckets |

All files are **idempotent** — safe to re-run.

---

## Regenerate seed after catalog edits

```powershell
cd C:\\Users\\eathe\\vimala
npm run supabase:build
```

---

## Env + verify

```powershell
copy .env.example .env.local
# Fill Supabase URL, anon key, service role key

npm run commerce:check
npm run dev
```

