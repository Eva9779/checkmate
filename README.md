
# 🚀 PRISTINEPAY LIVE TERMINAL

## 🛠️ HOW TO DEPLOY TO VERCEL (REQUIRED)

If you see "Connection Error" on your live site, it means your Stripe keys are missing from Vercel.

### 1. Add Environment Variables
Go to your **Vercel Dashboard** -> **Project Settings** -> **Environment Variables** and add these two EXACTLY as written. **DO NOT use "CLIENT_KEY" or other names.**

| Key | Value |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key (`sk_live_...` or `sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe Publishable Key (`pk_live_...` or `pk_test_...`) |

### 2. Redeploy
After adding the keys, go to the **Deployments** tab in Vercel, click the three dots on your latest deployment, and click **Redeploy**. This is necessary for the keys to take effect.

---

## 🔗 GITHUB RECONNECTION
To push updates:
1. **Open Terminal**
2. Run:
   ```bash
   git add .
   git commit -m "Update terminal logic"
   git push origin main
   ```

## ⚡ VERCEL BUILD FIX
Ensure the `vercel.json` file is present in your repository. Framework Preset must be **Next.js**.
