# Vimala setup — COMPLETE

All keys configured. Commerce is live locally.

## Verify

```powershell
cd C:\Users\eathe\vimala
npm run commerce:check   # all green except optional Razorpay
npm run dev              # storefront → http://localhost:3000
```

```powershell
cd "C:\Users\eathe\vimala vrm\vimala-vrm"
npm run dev              # admin → http://localhost:3001
```

## Admin login

- **Email:** `admin@vimalasilk.com`
- **Password:** `vimala@revolq`

## Test checkout

1. `/shop` → add Kanjivaram to bag
2. `/checkout` → fill address (pincode 685508 for Kerala)
3. Payment: **Cash on delivery** → Place order

## Optional SQL (VRM profile policy fix)

If VRM shows profile errors, run `supabase/08-fix-profiles-rls.sql` in SQL Editor.

## Optional: Razorpay

Add keys to `.env.local` when ready for online payments.

## Vercel deployment

Copy env vars from **[vercel.env](./vercel.env)** (your local file with real keys).

1. Vercel → your project → **Settings** → **Environment Variables**
2. Click **Bulk Edit** (or paste one-by-one)
3. Copy the entire contents of [vercel.env](./vercel.env) and paste
4. Apply to **Production**, **Preview**, and **Development**
5. Redeploy

Template (no secrets): [vercel.env.example](./vercel.env.example)

Local dev keys: [.env.local](./.env.local)

> `SUPABASE_DB_PASSWORD`, `VIMALA_ADMIN_*` are setup-script only — not needed on Vercel.

## Security

Rotate Supabase keys in Dashboard if these were shared publicly.
