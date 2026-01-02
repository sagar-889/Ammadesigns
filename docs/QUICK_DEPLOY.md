# Quick Deployment Guide - 15 Minutes

## 🚀 Fastest Way to Deploy (Render + Netlify)

### Prerequisites
- GitHub account
- Razorpay account (for payments)
- 15 minutes of time

---

## Step 1: Prepare Code (2 minutes)

### Run Preparation Script
```bash
deploy-prep.bat
```

Or manually:
```bash
# Restore production prices
node backend/scripts/restoreOriginalPrices.js

# Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build
```

---

## Step 2: Database Setup (3 minutes)

### Railway MySQL
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Provision MySQL
4. Copy credentials from Variables tab
5. Import schema:
   - Use Railway's web terminal
   - Or connect via MySQL client
   - Run: `backend/database/schema.sql`

**Save these credentials - you'll need them!**

---

## Step 3: Deploy Backend (5 minutes)

### Render
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service → Connect your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=<from Railway>
   DB_USER=<from Railway>
   DB_PASSWORD=<from Railway>
   DB_NAME=<from Railway>
   DB_PORT=<from Railway>
   JWT_SECRET=<generate random string>
   RAZORPAY_KEY_ID=<your key>
   RAZORPAY_KEY_SECRET=<your secret>
   ```
6. Click "Create Web Service"
7. **Copy your backend URL!**

---

## Step 4: Deploy Frontend (5 minutes)

### Netlify
1. Go to https://netlify.com
2. Sign up with GitHub
3. Drag & drop `frontend/dist` folder

**OR** use GitHub integration:
1. New site → Import from Git
2. Select your repo
3. Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=<your Render backend URL>/api
   VITE_SHOP_NAME=Amma Designs
   VITE_PHONE=+919876543210
   VITE_WHATSAPP=919876543210
   VITE_EMAIL=contact@ammadesigns.com
   VITE_ADDRESS=Your Address
   VITE_MAP_URL=https://maps.google.com/?q=Your+Location
   VITE_RAZORPAY_KEY_ID=<your key>
   ```
5. Deploy!

---

## Step 5: Configure CORS (2 minutes)

Update `backend/server.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-site.netlify.app'  // Add your Netlify URL
  ],
  credentials: true
};
```

Push to GitHub - Render will auto-deploy.

---

## ✅ Quick Test

1. Visit your Netlify URL
2. Browse products
3. Add to cart
4. Try checkout (use Razorpay test card)
5. Login to admin: `https://your-site.netlify.app/admin/login`

---

## 🎉 Done!

Your site is live at: `https://your-site.netlify.app`

### Important URLs:
- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-backend.onrender.com
- **Admin**: https://your-site.netlify.app/admin/login
- **Database**: Railway dashboard

---

## 🔧 Common Issues

**Backend not responding?**
- Check Render logs
- Verify database credentials
- Wait 1-2 minutes for cold start

**Frontend can't connect?**
- Check VITE_API_URL in Netlify
- Verify CORS settings
- Check browser console

**Payment not working?**
- Verify Razorpay credentials
- Check if using test/live keys
- Ensure HTTPS is enabled

---

## 📱 Next Steps

1. **Change Admin Password**
   ```bash
   node backend/scripts/updateAdminPassword.js
   ```

2. **Add Custom Domain** (Optional)
   - Netlify: Domain settings → Add domain
   - Update DNS records

3. **Enable Production Mode**
   - Uncomment shipping charges in Checkout.jsx
   - Test with real orders

4. **Monitor**
   - Check Render logs daily
   - Monitor Netlify bandwidth
   - Watch Railway database usage

---

## 💡 Pro Tips

- **Free Tier Limits**: Render sleeps after 15 min inactivity
- **First Load**: May take 30-60 seconds to wake up
- **Upgrade**: $7/month for always-on backend
- **Backups**: Railway auto-backs up database
- **SSL**: Automatic on all platforms

---

## 📞 Need Help?

Check detailed guide: `DEPLOYMENT_COMPLETE.md`

**Test Cards (Razorpay):**
- Success: 4111 1111 1111 1111
- Failure: 4111 1111 1111 1112
- CVV: Any 3 digits
- Expiry: Any future date
