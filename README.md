
# 🚀 PRISTINEPAY LIVE TERMINAL

## 🔗 HOW TO RECONNECT GITHUB (BYPASSING SECRET SCANNING)
GitHub blocked the previous push because it contained live Stripe keys in the history. We have now moved to environment variables and need to reset the history.

1. **Run these commands in the Terminal** to wipe the old history and push clean:
   ```bash
   rm -rf .git
   git init
   git remote add origin https://github.com/Eva9779/checkmate.git
   git add .
   git commit -m "Initial clean deployment"
   git push -u origin main --force
   ```

2. **Add the keys to Vercel**:
   Go to your Vercel Dashboard -> Project Settings -> Environment Variables and add:
   - `STRIPE_SECRET_KEY`: Your live secret key.
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your live publishable key.

## ⚡ DEPLOYMENT TO VERCEL
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New"** -> **"Project"**.
3. Import the `checkmate` repository from your GitHub account.
