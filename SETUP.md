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

## Security

Rotate Supabase keys in Dashboard if these were shared publicly.
