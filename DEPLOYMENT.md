# Security Hardening Deployment Guide

This document provides step-by-step instructions for deploying the security-hardened Vimala Silk House platform.

---

## Prerequisites

Before deployment, ensure you have:

1. ✅ **Vercel Account** with project created
2. ✅ **Supabase Project** (already configured)
3. ✅ **Upstash Redis Account** (free tier works)
4. ✅ **Razorpay Account** (for payments)
5. ✅ **Git Repository** (for version control)

---

## Step 1: Set up Upstash Redis

### 1.1 Create Redis Database

1. Go to [upstash.com](https://upstash.com) and sign up/login
2. Click **"Create Database"**
3. Choose:
   - **Name:** `vimala-rate-limiting`
   - **Type:** Regional (select closest region to your users)
   - **Primary Region:** Select your preferred region
   - **TLS:** Enabled (default)
4. Click **"Create"**

### 1.2 Get Redis Credentials

After creation, copy these values from the dashboard:

- **REST URL:** `https://xxxxxxxx.upstash.io`
- **REST TOKEN:** `AXXXxxx...`

You'll need these for environment variables.

---

## Step 2: Run SQL Migrations in Supabase

Open your Supabase project's SQL Editor and run these files **in order**:

### 2.1 OTP Codes Table
```sql
-- Copy and run: supabase/12-otp-codes-table.sql
```

### 2.2 Failed Login Attempts
```sql
-- Copy and run: supabase/13-failed-login-attempts.sql
```

### 2.3 Verify Tables Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('otp_codes', 'failed_login_attempts');
```

You should see both tables listed.

---

## Step 3: Update Environment Variables

### 3.1 Local Development (`.env.local`)

Add these new variables to your `.env.local` file:

```bash
# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxx...
```

### 3.2 Vercel Production Environment

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables for **Production, Preview, and Development**:

```bash
# Existing variables (keep these)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# NEW: Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxx...
```

---

## Step 4: Test Locally

### 4.1 Install Dependencies
```bash
npm install
```

### 4.2 Start Development Server
```bash
npm run dev
```

### 4.3 Test Key Features

1. **Rate Limiting**
   - Try hitting `/api/commerce/checkout` rapidly
   - Should get 429 error after 5 requests per minute

2. **OTP Authentication**
   - Go to `/login`
   - Request OTP 4 times quickly
   - Should be rate-limited after 3 attempts

3. **Security Headers**
   - Open DevTools → Network → Select any page
   - Check Response Headers for:
     - `X-Frame-Options: DENY`
     - `Content-Security-Policy: ...`
     - `Strict-Transport-Security: ...`

---

## Step 5: Commit and Push to Git

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: implement comprehensive security hardening

- Add Upstash Redis distributed rate limiting
- Implement secure OTP authentication
- Add security headers (CSP, HSTS, X-Frame-Options)
- Create account lockout protection
- Update all API routes to use new rate limiter
- Add SQL migrations for otp_codes and failed_login_attempts tables"

# Push to main branch
git push origin main
```

---

## Step 6: Deploy to Vercel

### 6.1 Automatic Deployment

If connected to Git, Vercel will automatically deploy when you push.

### 6.2 Manual Deployment

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Deploy
vercel --prod
```

### 6.3 Verify Deployment

1. Wait for deployment to complete
2. Visit your live URL
3. Check that site loads without errors

---

## Step 7: Post-Deployment Verification

### 7.1 Security Headers Check

Use [securityheaders.com](https://securityheaders.com) to scan your live site:

```
https://securityheaders.com/?q=https://your-domain.vercel.app
```

Expected grade: **A** or **A+**

### 7.2 Rate Limiting Verification

Test rate limiting on production:

```bash
# Test API rate limiting (should fail after 100 requests/min)
for i in {1..150}; do curl https://your-domain.vercel.app/api/commerce/cart/sync -X POST -H "Content-Type: application/json" -d '{"sessionToken":"test","lines":[]}'; done
```

### 7.3 SSL/TLS Check

Verify HTTPS is enforced:
- Visit `http://your-domain.vercel.app` (no s)
- Should redirect to `https://your-domain.vercel.app`

---

## Step 8: Monitor and Alert Setup (Optional but Recommended)

### 8.1 Upstash Dashboard Monitoring

1. Go to your Upstash Redis dashboard
2. Check **Metrics** tab for:
   - Request count
   - Error rate
   - Latency

### 8.2 Vercel Analytics

Enable Vercel Analytics for traffic monitoring:
1. Go to your Vercel project
2. Click **Analytics** tab
3. Enable Web Analytics

---

## Rollback Procedure

If issues arise after deployment:

### Quick Rollback (Vercel)

1. Go to Vercel project → **Deployments**
2. Find previous working deployment
3. Click **...** → **Promote to Production**

### Code Rollback (Git)

```bash
# Find previous commit hash
git log --oneline

# Revert to previous commit
git revert HEAD

# Or hard reset (use carefully!)
git reset --hard <previous-commit-hash>
git push origin main --force
```

---

## Troubleshooting

### Redis Connection Errors

**Error:** `Missing Upstash Redis configuration`

**Solution:**
1. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in Vercel
2. Redeploy the app

### Rate Limiting Not Working

**Issue:** No 429 errors when testing

**Solutions:**
1. Check if Redis is configured properly
2. Verify middleware is running (check `/middleware.ts` exists)
3. In development, rate limiting may be disabled if Redis not configured

### OTP Not Working

**Issue:** OTP codes not verifying

**Solutions:**
1. Verify SQL migrations ran successfully
2. Check Supabase service role key is correct
3. Check `otp_codes` table exists and has correct schema

### Security Headers Missing

**Issue:** Headers not appearing in browser

**Solutions:**
1. Check `next.config.mjs` has headers configuration
2. Check `middleware.ts` is applying headers
3. Hard refresh browser (Ctrl+Shift+R)

---

## Security Checklist

Before going live, verify:

- [ ] All SQL migrations completed successfully
- [ ] Environment variables set in Vercel
- [ ] Redis connection working (check Upstash dashboard)
- [ ] Rate limiting active (test with repeated requests)
- [ ] Security headers present (check with DevTools)
- [ ] OTP authentication working
- [ ] HTTPS enforced (no HTTP traffic)
- [ ] Secret keys not exposed in client bundle
- [ ] Test checkout flow end-to-end
- [ ] Monitor logs for errors in first 24 hours

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Check Upstash Redis metrics
4. Review error messages in browser console
5. Test locally first, then deploy

---

## Next Steps After Deployment

1. **Enable Alerting** — Set up email/Slack alerts for:
   - High rate limit violations
   - Failed authentication attempts
   - Payment verification failures

2. **Regular Security Audits**
   - Run `npm audit` weekly
   - Update dependencies monthly
   - Review logs for suspicious activity

3. **Performance Monitoring**
   - Monitor Redis latency in Upstash
   - Check API response times in Vercel
   - Track rate limit hit rates

---

**Deployment Complete! 🎉**

Your e-commerce platform now has enterprise-grade security:
- ✅ Distributed rate limiting
- ✅ Secure OTP authentication
- ✅ Account lockout protection
- ✅ Security headers configured
- ✅ Ready for production traffic
