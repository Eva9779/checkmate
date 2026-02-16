
# 🚀 PRISTINEPAY LIVE TERMINAL

## 🛠️ HOW TO DEPLOY TO VERCEL (REQUIRED)

If you see "Connection Error" on your live site, it means your Stripe keys are missing.

### 1. Add Environment Variables
Go to your **Vercel Dashboard** -> **Project Settings** -> **Environment Variables** and add these two:

1. `STRIPE_SECRET_KEY`: Your Stripe secret key (sk_live_...)
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (pk_live_...)

### 2. Redeploy
After adding the keys, go to the **Deployments** tab in Vercel and click **Redeploy** on the latest build to make sure the keys are active.

---

## 🔗 GITHUB RECONNECTION
If you need to push new changes:
1. **Open Terminal**
2. Run:
   ```bash
   git add .
   git commit -m "Update payment logic"
   git push origin main
   ```

## ⚡ VERCEL BUILD FIX
If you see an error about a missing "public" directory:
1. Ensure the `vercel.json` file is present in your repository.
2. Framework Preset must be **Next.js**.
