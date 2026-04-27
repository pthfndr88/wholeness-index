# Wholeness Index v3 — Setup Guide
## Stack: Supabase · Resend · Stripe · Next.js 15 · Azure App Service

---

## 1. Supabase setup (~10 minutes)

1. Create a project at supabase.com
2. Go to SQL Editor → paste the contents of `supabase/schema.sql` → Run
3. Go to Settings → API → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to Authentication → URL Configuration:
   - Site URL: `https://wholenessindex.com`
   - Redirect URLs: add `https://wholenessindex.com/api/auth/callback`

---

## 2. Resend setup (~5 minutes)

1. Create account at resend.com
2. Add domain: wholenessindex.com → add DNS records Resend gives you
3. Go to API Keys → Create → copy → `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL=noreply@wholenessindex.com`

---

## 3. Stripe setup (~15 minutes)

### Create products
1. Stripe dashboard → Products → Add product
2. **Full Assessment**: Name "Wholeness Index — Full Assessment" · Price £197 one-time
   - Copy Price ID → `STRIPE_PRICE_FULL_ASSESSMENT`
3. **Coaching Bundle**: Name "Assessment + Coaching" · Price £1,497 one-time
   - Copy Price ID → `STRIPE_PRICE_COACHING_BUNDLE`

### Create discount coupon
1. Stripe dashboard → Coupons → Create coupon
2. Type: Percentage · 59.4% off (reduces £197 to £79.99)
   - Or: Fixed amount · £117.01 off
3. Create promotion code: e.g. `APEX2025`
4. This code is entered at checkout — no code needed in your app

### Set up webhook
1. Stripe dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://wholenessindex.com/api/stripe/webhook`
3. Events: `checkout.session.completed`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### Test mode first
- Use `sk_test_...` keys while testing
- Test card: 4242 4242 4242 4242 · any future date · any CVV
- Test discount code works at checkout
- Switch to `sk_live_...` before going live

---

## 4. Promote your account to coach

After signing in via magic link:

```sql
-- In Supabase SQL Editor
UPDATE profiles SET role = 'coach' WHERE email = 'your@email.com';
```

---

## 5. Deploy to Azure

```bash
npm install
npm run build   # verify clean build locally first

git add .
git commit -m "v3 — Supabase, Resend, Stripe"
git push origin main
```

Add these to Azure App Service settings (or GitHub secrets):
- All variables from `.env.example`

Add to Azure App Service settings:
```bash
az webapp config appsettings set --name wholeness-index-app \
  --resource-group wholeness-index-rg \
  --settings \
    NEXT_PUBLIC_SUPABASE_URL="..." \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="..." \
    SUPABASE_SERVICE_ROLE_KEY="..." \
    RESEND_API_KEY="..." \
    RESEND_FROM_EMAIL="noreply@wholenessindex.com" \
    STRIPE_SECRET_KEY="..." \
    STRIPE_WEBHOOK_SECRET="..." \
    STRIPE_PRICE_FULL_ASSESSMENT="price_..." \
    STRIPE_PRICE_COACHING_BUNDLE="price_..." \
    NEXT_PUBLIC_APP_URL="https://wholenessindex.com" \
    NODE_ENV="production"
```

---

## 6. Full user journey to test

1. `wholenessindex.com/take` → complete 15-item assessment → see archetype
2. Enter email → receive result email
3. Click "Unlock full assessment" → `/upgrade`
4. Sign in (magic link) → Stripe checkout → enter discount code `APEX2025`
5. Payment succeeds → redirect to `/upgrade/success`
6. Stripe webhook fires → access granted in Supabase
7. Go to `/platform` → begin full assessment (stub) → coaching upsell shown

---

## What is not yet built

- 130-item full assessment questions (schema and scoring ready, questions TBD)
- PDF report (email contains rich HTML; PDF is a separate sprint)
- In-platform development pathway content (framework ready, content TBD)
- Coach SSO via Azure AD (available when enterprise-ready)

---

*Wholeness Index · Sterizo Research Group · Pathfinder Educational Ltd.*
