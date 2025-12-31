# Complete Deployment Guide - Amma Designs

## 🚀 Quick Deployment Options

### Option 1: Render + Netlify (Recommended - Free)
- **Backend**: Render (Free tier)
- **Frontend**: Netlify (Free tier)
- **Database**: Railway MySQL (Free $5 credit)

### Option 2: Vercel + Railway (Easy)
- **Full Stack**: Vercel
- **Database**: Railway MySQL

### Option 3: Railway (All-in-One)
- **Backend + Database**: Railway
- **Frontend**: Railway or Netlify

---

## 📋 Pre-Deployment Checklist

### 1. Restore Production Prices
```bash
node backend/scripts/restoreOriginalPrices.js
```

### 2. Enable Real Shipping Charges
Edit `frontend/src/pages/Checkout.jsx`:
- Comment out `return 0;` in `calculateShipping()`
- Uncomment the production shipping code

### 3. Update Environment Variables
- Set real Razorpay credentials
- Update shop name, phone, address
- Set strong JWT secret

### 4. Test Locally
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

---

## 🎯 Option 1: Render + Netlify (Detailed Steps)

### Part A: Database Setup (Railway)

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Provision MySQL"

#### Step 2: Get Database Credentials
1. Click on MySQL service
2. Go to "Variables" tab
3. Copy these values:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

#### Step 3: Import Database Schema
1. Install MySQL client or use Railway's built-in terminal
2. Connect to database:
```bash
mysql -h MYSQLHOST -u MYSQLUSER -p -P MYSQLPORT MYSQLDATABASE
```
3. Import schema:
```bash
mysql -h MYSQLHOST -u MYSQLUSER -p -P MYSQLPORT MYSQLDATABASE < backend/database/schema.sql
```

Or use Railway's web interface to run the SQL file.

#### Step 4: Run Migrations
```bash
# Update .env with Railway credentials
node backend/scripts/addShippingColumns.js
```

---

### Part B: Backend Deployment (Render)

#### Step 1: Prepare Backend
1. Ensure `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

#### Step 3: Configure Service
1. **Repository**: Select your GitHub repo
2. **Name**: `amma-designs-backend`
3. **Root Directory**: `backend`
4. **Environment**: Node
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. **Plan**: Free

#### Step 4: Set Environment Variables
Click "Environment" and add:

```env
PORT=5000
NODE_ENV=production

# Database (from Railway)
DB_HOST=your_railway_host
DB_USER=your_railway_user
DB_PASSWORD=your_railway_password
DB_NAME=your_railway_database
DB_PORT=your_railway_port

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Razorpay (Production credentials)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://amma-designs-backend.onrender.com`

#### Step 6: Test Backend
Visit: `https://your-backend-url.onrender.com/api/public/services`

Should return JSON data.

---

### Part C: Frontend Deployment (Netlify)

#### Step 1: Update Frontend Environment
Edit `frontend/.env`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SHOP_NAME=Amma Designs
VITE_PHONE=+919876543210
VITE_WHATSAPP=919876543210
VITE_EMAIL=contact@ammadesigns.com
VITE_ADDRESS=Your Shop Address, City, State
VITE_MAP_URL=https://maps.google.com/?q=Your+Location

# Razorpay (same as backend)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

#### Step 2: Build Frontend
```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder.

#### Step 3: Deploy to Netlify

**Method A: Drag & Drop (Easiest)**
1. Go to https://netlify.com
2. Sign up/Login
3. Drag the `frontend/dist` folder to Netlify
4. Done!

**Method B: GitHub Integration (Recommended)**
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Click "Deploy site"

#### Step 4: Set Environment Variables in Netlify
1. Go to Site settings → Environment variables
2. Add all variables from `frontend/.env`
3. Trigger redeploy

#### Step 5: Get Your URL
Your site will be live at: `https://random-name-123.netlify.app`

---

### Part D: Configure CORS (Backend)

Update `backend/server.js` to allow your frontend domain:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-netlify-site.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Redeploy backend on Render.

---

## 🎯 Option 2: Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy Backend
```bash
cd backend
vercel
```

Follow prompts:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: amma-designs-backend
- Directory: ./
- Override settings: No

### Step 3: Add Environment Variables
```bash
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add JWT_SECRET
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
```

### Step 4: Deploy Frontend
```bash
cd frontend
vercel
```

Same process as backend.

### Step 5: Link Frontend to Backend
Update frontend environment variables in Vercel dashboard with backend URL.

---

## 🎯 Option 3: Railway (All-in-One)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

### Step 2: Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will detect both frontend and backend

### Step 3: Configure Services

**Backend Service:**
- Root directory: `backend`
- Start command: `npm start`
- Add environment variables

**Frontend Service:**
- Root directory: `frontend`
- Build command: `npm run build`
- Start command: `npm run preview`
- Add environment variables

### Step 4: Add MySQL Database
1. Click "New" → "Database" → "Add MySQL"
2. Link to backend service
3. Environment variables auto-populate

---

## 🔒 Security Configuration

### 1. Update Admin Password
```bash
node backend/scripts/updateAdminPassword.js
```

### 2. Secure Environment Variables
- Never commit `.env` files
- Use strong, random JWT secret
- Rotate database passwords regularly

### 3. Enable HTTPS
- Automatic on Render, Netlify, Vercel
- Ensure all API calls use HTTPS

### 4. Configure CORS Properly
Only allow your frontend domain in CORS settings.

---

## 📱 Custom Domain Setup

### Netlify Custom Domain
1. Go to Domain settings
2. Click "Add custom domain"
3. Enter your domain (e.g., `ammadesigns.com`)
4. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### Render Custom Domain
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS:
   ```
   Type: CNAME
   Name: api (or backend)
   Value: your-service.onrender.com
   ```

---

## 🧪 Post-Deployment Testing

### 1. Test Backend Endpoints
```bash
# Public endpoints
curl https://your-backend.onrender.com/api/public/services
curl https://your-backend.onrender.com/api/shop/products

# Admin login
curl -X POST https://your-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

### 2. Test Frontend
- [ ] Homepage loads
- [ ] Shop page shows products
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Payment gateway connects
- [ ] Admin login works
- [ ] Order book displays

### 3. Test on Mobile
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] Images load properly

---

## 📊 Monitoring & Maintenance

### Render Monitoring
1. Go to your service dashboard
2. Check "Logs" tab for errors
3. Monitor "Metrics" for performance

### Netlify Monitoring
1. Check "Deploys" for build status
2. Review "Functions" logs if using serverless
3. Monitor bandwidth usage

### Database Monitoring
1. Railway dashboard shows DB metrics
2. Set up alerts for high usage
3. Regular backups (automatic on Railway)

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Starting)
- **Render**: Free (sleeps after 15 min inactivity)
- **Netlify**: Free (100GB bandwidth/month)
- **Railway**: $5 credit/month free
- **Total**: $0-5/month

### Paid Tier (For Production)
- **Render**: $7/month (always-on)
- **Netlify**: Free or $19/month (Pro)
- **Railway**: ~$10/month (database + backend)
- **Domain**: $10-15/year
- **Total**: ~$17-36/month

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot connect to database**
- Check DB credentials in environment variables
- Verify database is running
- Check firewall rules

**Error: CORS policy blocked**
- Add frontend URL to CORS whitelist
- Ensure credentials: true is set

**Error: Module not found**
- Run `npm install` in backend directory
- Check package.json dependencies

### Frontend Issues

**Error: API calls failing**
- Verify VITE_API_URL is correct
- Check backend is running
- Inspect browser console for errors

**Error: Environment variables not working**
- Ensure variables start with `VITE_`
- Rebuild frontend after changing .env
- Check Netlify environment variables

**Error: Payment gateway not working**
- Verify Razorpay credentials
- Check if using test/live keys correctly
- Ensure HTTPS is enabled

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

**Render:**
- Automatically deploys on push to main branch
- Configure in Settings → Build & Deploy

**Netlify:**
- Automatically deploys on push
- Configure branch in Site settings

**Railway:**
- Automatically deploys on push
- Configure in service settings

### Manual Deployment

**Render:**
```bash
# Trigger manual deploy from dashboard
# Or push to GitHub
```

**Netlify:**
```bash
cd frontend
npm run build
netlify deploy --prod
```

**Vercel:**
```bash
vercel --prod
```

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Razorpay Integration](https://razorpay.com/docs)

---

## ✅ Final Checklist

Before going live:

- [ ] Database schema imported
- [ ] Migrations run successfully
- [ ] Production prices restored
- [ ] Real shipping charges enabled
- [ ] Razorpay live credentials set
- [ ] Admin password changed
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] All features tested
- [ ] Mobile responsiveness verified
- [ ] Payment flow tested
- [ ] Order management tested
- [ ] Contact form tested
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

## 🎉 You're Live!

Your Amma Designs e-commerce platform is now deployed and ready to accept orders!

**Next Steps:**
1. Share your website URL
2. Test with real orders (small amounts first)
3. Monitor for any issues
4. Gather customer feedback
5. Iterate and improve

**Support:**
- Check logs regularly
- Monitor error rates
- Keep dependencies updated
- Regular database backups
