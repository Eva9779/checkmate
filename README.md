
# 🚀 PRISTINEPAY LIVE TERMINAL

## 🔗 HOW TO RECONNECT GITHUB
If you need to reset your connection to the GitHub repository:

1. **Run these commands in the Terminal**:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/Eva9779/checkmate.git
   git add .
   git commit -m "Deployment fix"
   git push -u origin main --force
   ```

## ⚡ VERCEL BUILD FIX
If you see an error about a missing "public" directory on Vercel:
1. Ensure the `vercel.json` file is present in your repository.
2. Go to your **Vercel Project Settings**.
3. Set the **Framework Preset** to **Next.js**.
4. Set the **Output Directory** to the default for Next.js (usually `.next`).

## 🔐 STRIPE KEYS (REQUIRED)
Go to your Vercel Dashboard -> Project Settings -> Environment Variables and add:
- `STRIPE_SECRET_KEY`: Your live secret key.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your live publishable key.
