# Frontend Deployment Guide

## ✅ Backend is Live
Your backend is running at: **https://ammadesigns.onrender.com**

## 🔗 Frontend is Now Linked

The frontend has been configured to connect to your Render backend:
- Production: `https://ammadesigns.onrender.com/api`
- Local Development: `http://localhost:5000/api`

---

## Deploy Frontend to Vercel (Recommended - FREE)

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Link frontend to Render backend"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/)**

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**

4. **Configure the project:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables:**
   ```
   VITE_API_URL=https://ammadesigns.onrender.com/api
   VITE_SHOP_NAME=AmmaCollections
   VITE_PHONE=+918247588435
   VITE_WHATSAPP=918247588435
   VITE_ADDRESS=9-262 pallapuveedhy, sankhavaram
   VITE_MAP_URL=https://maps.app.goo.gl/E9ccmQFJHA1nArE87
   VITE_RAZORPAY_KEY_ID=rzp_test_RxuczeVL33p8DO
   VITE_LATITUDE=17.0005
   VITE_LONGITUDE=82.2466
   ```

6. **Click "Deploy"**

7. **Done!** Your site will be live at `https://your-project.vercel.app`

---

## Alternative: Deploy Frontend to Render

### Step 1: Create Static Site on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Static Site"**

3. **Connect your GitHub repository**

4. **Configure:**
   - Name: `ammadesigns-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

5. **Add Environment Variables:**
   (Same as above)

6. **Click "Create Static Site"**

---

## Test Your Deployment

After deployment, test these features:

### 1. Homepage
- ✅ Hero section loads
- ✅ Services display
- ✅ Gallery images load

### 2. Shop Page
- ✅ Products load from backend
- ✅ Add to cart works
- ✅ Cart displays correctly

### 3. Admin Login
- ✅ Login page accessible
- ✅ Can login with credentials
- ✅ Admin dashboard loads

### 4. Order Tracking
- ✅ Can enter order ID
- ✅ Order status displays

---

## Local Development

For local development, use `.env.local`:

```bash
# Start backend locally
cd backend
npm start

# Start frontend locally (in another terminal)
cd frontend
npm run dev
```

The frontend will use `http://localhost:5000/api` when running locally.

---

## Environment Files Explained

- `.env` - Default configuration (now points to production)
- `.env.production` - Production build configuration
- `.env.local` - Local development (not committed to git)
- `.env.example` - Template for other developers

---

## Update Backend CORS (If Needed)

If you get CORS errors, update your backend to allow your frontend domain:

1. Go to `backend/server.js`
2. Update CORS configuration:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-frontend.vercel.app',
       'https://your-frontend.onrender.com'
     ]
   }));
   ```

---

## Next Steps

1. ✅ Push changes to GitHub
2. ✅ Deploy frontend to Vercel or Render
3. ✅ Initialize database (run `node scripts/init-db.js` in backend shell)
4. ✅ Test the complete application
5. ✅ Update admin credentials
6. ✅ Add products and services

---

## Troubleshooting

### Frontend can't connect to backend
- Check if `VITE_API_URL` is set correctly
- Verify backend is running: https://ammadesigns.onrender.com
- Check browser console for errors

### Images not loading
- Ensure images are uploaded through admin panel
- Check if backend `/uploads` directory is accessible

### Payment not working
- Verify Razorpay keys are correct
- Test with Razorpay test mode first

---

## Support

- Backend URL: https://ammadesigns.onrender.com
- Backend Health: https://ammadesigns.onrender.com/ (should return JSON)
- API Docs: See `docs/API_DOCUMENTATION.md`
