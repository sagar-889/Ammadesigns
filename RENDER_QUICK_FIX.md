# 🚀 RENDER DEPLOYMENT - IMMEDIATE FIX

## The Problem
```
Error: Cannot find module '/opt/render/project/src/server.js'
```

Render is looking for `server.js` in the root, but it's in the `backend/` folder.

---

## ✅ SOLUTION (Choose One)

### Option A: Fix Your Existing Service (FASTEST)

1. **Go to Render Dashboard** → Your Service → Settings

2. **Update these fields:**
   ```
   Build Command:  cd backend && npm install
   Start Command:  cd backend && node server.js
   ```

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_secret_key_here
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   ```

4. **Save Changes** and **Manual Deploy**

✅ **Done!** Your backend will now start correctly.

---

### Option B: Deploy as Blueprint (RECOMMENDED)

1. **Delete your current service** on Render

2. **Push the updated render.yaml to GitHub:**
   ```bash
   git add render.yaml
   git commit -m "Fix Render configuration with rootDir"
   git push origin main
   ```

3. **On Render Dashboard:**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repo
   - Render will create both backend and frontend services automatically

4. **Add Environment Variables** to the backend service:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `RAZORPAY_KEY_ID` - Your Razorpay key
   - `RAZORPAY_KEY_SECRET` - Your Razorpay secret
   - (JWT_SECRET is auto-generated)

---

## 🎯 What Changed in render.yaml

Added `rootDir` to tell Render where to find the code:

```yaml
services:
  - type: web
    name: ammadesigns-backend
    rootDir: backend          # ← This tells Render to work in backend folder
    buildCommand: npm install  # ← No need for 'cd backend' anymore
    startCommand: node server.js
```

---

## 📋 After Deployment

1. **Initialize Database:**
   - Go to your backend service Shell tab on Render
   - Run: `node scripts/init-db.js`

2. **Verify Backend:**
   - Visit: `https://your-backend-name.onrender.com`
   - Should see: `{"message":"Ladies Tailor Shop API is running"}`

3. **Update Frontend:**
   - Make sure `VITE_API_URL` points to your backend URL
   - Redeploy if needed

---

## 🆘 Still Having Issues?

### Check These:
- ✅ Build Command includes `cd backend &&` OR `rootDir: backend` is set
- ✅ Start Command includes `cd backend &&` OR `rootDir: backend` is set
- ✅ Environment variables are set correctly
- ✅ Database is accessible from Render

### Common Mistakes:
- ❌ Using `yarn` instead of `npm` (your project uses npm)
- ❌ Forgetting to add `cd backend &&` in commands
- ❌ Not setting `rootDir` in render.yaml
- ❌ Missing environment variables

---

## 💡 Pro Tip

For the free tier, your backend will spin down after 15 minutes of inactivity. First request after spin-down takes 30-60 seconds to wake up. This is normal!
