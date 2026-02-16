
# 🚀 PRISTINEPAY LIVE TERMINAL

## 🛠️ HOW TO DEPLOY TO VERCEL (REQUIRED)

If you see "Connection Error" on your live site, it means your Stripe keys are missing from Vercel. **DO NOT LEAVE THE VALUE FIELDS BLANK.**

### 1. Get your keys from Stripe
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. Look for **Publishable key** (starts with `pk_live_...`).
3. Look for **Secret key** (starts with `sk_live_...`).

### 2. Add Environment Variables in Vercel
Go to your **Vercel Dashboard** -> **Project Settings** -> **Environment Variables**. Add these two EXACTLY as written.

| Key (Type this exactly) | Value (Paste your key from Stripe) |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | Paste your **Secret key** (`sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Paste your **Publishable key** (`pk_live_...`) |

**Note:** If Vercel suggests `CLIENT_KEY`, ignore it. Manually type the names above.

### 3. Redeploy
After adding the keys, go to the **Deployments** tab in Vercel, click the three dots on your latest deployment, and click **Redeploy**. This is necessary for the keys to take effect.

---

## 🔗 GITHUB UPDATES
To push changes to your repository:
1. **Open Terminal**
2. Run:
   ```bash
   git add .
   git commit -m "Update payment configuration"
   git push origin main
   ```
