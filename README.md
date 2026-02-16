
# 🚀 PRISTINEPAY LIVE TERMINAL

## 🛠️ HOW TO DEPLOY TO VERCEL (REQUIRED)

If you see "Connection Error" on your live site, it means your Stripe keys are missing from Vercel.

### ⚠️ IMPORTANT: "CLIENT_KEY" IS A PLACEHOLDER
When you are in the Vercel Dashboard, Vercel might suggest a name like `CLIENT_KEY`. **IGNORE THIS.** It is just a placeholder. You must manually type the names below.

### 1. Add Environment Variables
Go to your **Vercel Dashboard** -> **Project Settings** -> **Environment Variables** and add these two EXACTLY as written.

| Key (Type this exactly) | Value (Paste your key from Stripe) |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key (`sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe Publishable Key (`pk_live_...`) |

### 2. Redeploy
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
