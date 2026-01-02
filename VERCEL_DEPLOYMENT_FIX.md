# Vercel Deployment Fix - Vite Project

## Problem
Vercel was trying to build your Vite project as a Create React App (CRA), causing the error:
```
react-scripts: command not found
```

## Solution

### Option 1: Deploy Frontend Only (Recommended)

1. **Go to Vercel Dashboard**
   - Go to your project settings
   - Click on "Settings" → "General"

2. **Update Build Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Root Directory: frontend
   ```

3. **Environment Variables (if needed):**
   - Add `VITE_API_URL` with your backend URL

4. **Save and Redeploy**

### Option 2: Using vercel.json (Already Created)

I've created `frontend/vercel.json` with the correct configuration:

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### Option 3: Manual Vercel CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

## Vercel Dashboard Settings

### For Frontend Deployment:

**General Settings:**
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Node.js Version: `18.x` or `20.x`

**Build & Development Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Development Command: `npm run dev`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.railway.app
```

## Backend Deployment (Railway/Render)

Since Vercel doesn't support long-running Node.js servers well, deploy your backend separately:

### Railway (Recommended for Backend):

1. Go to https://railway.app/
2. Connect your GitHub repository
3. Select the `backend` folder as root
4. Add environment variables:
   ```
   PORT=5000
   DATABASE_URL=postgresql://postgres:Sagar%40%238897@db.cklxnpbibdmvcdwyqwkw.supabase.co:5432/postgres
   JWT_SECRET=your_jwt_secret_key_change_this_to_random_string
   NODE_ENV=production
   RAZORPAY_KEY_ID=rzp_test_RxuczeVL33p8DO
   RAZORPAY_KEY_SECRET=kpkVZfk34dNVkfurAcY6WJUw
   ```
5. Deploy!

### Render (Alternative):

1. Go to https://render.com/
2. Create new Web Service
3. Connect GitHub repository
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add same environment variables as above

## Update Frontend API URL

After deploying backend, update frontend to use the backend URL:

**frontend/.env:**
```env
VITE_API_URL=https://your-backend-url.railway.app
```

**Or in Vercel Environment Variables:**
```
VITE_API_URL=https://your-backend-url.railway.app
```

## Quick Fix Steps

1. **Commit the vercel.json files:**
   ```bash
   git add vercel.json frontend/vercel.json
   git commit -m "Add Vercel configuration for Vite"
   git push
   ```

2. **Update Vercel Project Settings:**
   - Go to Vercel Dashboard
   - Project Settings → General
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**

3. **Redeploy:**
   - Click "Deployments"
   - Click "Redeploy" on the latest deployment

## Verification

After deployment:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.railway.app`
- Test: `https://your-project.vercel.app` should load
- API Test: `https://your-backend.railway.app/api/services`

## Common Issues

### Issue 1: API calls failing
**Fix:** Update `VITE_API_URL` in Vercel environment variables

### Issue 2: Build still failing
**Fix:** Make sure Root Directory is set to `frontend`

### Issue 3: 404 on routes
**Fix:** Vercel should auto-handle this for Vite, but if not, the vercel.json includes rewrites

## Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  Port: 443      │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Railway/Render │
│  (Backend)      │
│  Port: 5000     │
└────────┬────────┘
         │
         │ Database
         ▼
┌─────────────────┐
│  Supabase       │
│  (PostgreSQL)   │
│  Port: 5432     │
└─────────────────┘
```

## Next Steps

1. ✅ Vercel configuration created
2. ⚠️ Commit and push changes
3. ⚠️ Update Vercel project settings
4. ⚠️ Deploy backend to Railway/Render
5. ⚠️ Update frontend API URL
6. ⚠️ Redeploy on Vercel

---

**Your project is a Vite project, not Create React App!**
Make sure Vercel knows this by setting Framework Preset to "Vite".
