# Vercel + Render + Railway Deployment Guide

Complete guide to deploy your e-commerce website using:
- **Vercel** - Frontend (React) - FREE
- **Render** - Backend (Node.js) - FREE
- **Railway** - MySQL Database - $5 credit/month

---

## 💰 Cost Breakdown

| Service | Plan | Cost | What You Get |
|---------|------|------|--------------|
| **Vercel** | Free | $0 | Unlimited bandwidth, Global CDN, Auto SSL |
| **Render** | Free | $0 | 750 hours/month, Auto-deploy, SSL |
| **Railway** | Hobby | $5 credit/month | MySQL 8.0, 1GB storage, 100GB bandwidth |

**Total: $0-5/month** (Railway credit usually covers small traffic)

---

## 🎯 Deployment Overview

```
┌─────────────────────────────────────────────────┐
│                   USERS                          │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────┐            ┌──────────────┐
│   VERCEL     │            │   RENDER     │
│  (Frontend)  │───────────▶│  (Backend)   │
│   React      │   API      │   Node.js    │
│   FREE       │  Calls     │   FREE       │
└──────────────┘            └──────┬───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │   RAILWAY    │
                            │   (MySQL)    │
                            │  $5 credit   │
                            └──────────────┘
```

---

## 📋 Prerequisites

- GitHub account (for code hosting)
- Vercel account (sign up free)
- Render account (sign up free)
- Railway account (sign up free, need credit card)
- Your project code ready

---

## 🚀 Part 1: Setup Railway (MySQL Database)

### Step 1: Create Railway Account

1. Go to: https://railway.app/
2. Click "Start a New Project"
3. Sign up with GitHub
4. Verify email

### Step 2: Create MySQL Database

1. **Click**: "New Project"
2. **Select**: "Provision MySQL"
3. **Wait**: Database will be created (1-2 minutes)

### Step 3: Get Database Credentials

1. **Click** on the MySQL service
2. **Go to**: "Variables" tab
3. **Copy these values**:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `DATABASE_URL` (complete connection string)

**Example values:**
```
MYSQL_HOST=containers-us-west-123.railway.app
MYSQL_PORT=6789
MYSQL_USER=root
MYSQL_PASSWORD=abc123xyz789
MYSQL_DATABASE=railway
DATABASE_URL=mysql://root:abc123xyz789@containers-us-west-123.railway.app:6789/railway
```

### Step 4: Import Database Schema

**Option A: Using Railway Web Interface**

1. Click on MySQL service
2. Go to "Data" tab
3. Click "Query"
4. Copy your `complete_schema.sql` content
5. Paste and execute

**Option B: Using MySQL Workbench**

1. Download MySQL Workbench
2. Create new connection:
   - Hostname: `MYSQL_HOST`
   - Port: `MYSQL_PORT`
   - Username: `MYSQL_USER`
   - Password: `MYSQL_PASSWORD`
3. Connect and import `complete_schema.sql`

**Option C: Using Command Line**

```bash
# Install MySQL client if needed
# On Windows: Download from mysql.com

# Connect to Railway MySQL
mysql -h MYSQL_HOST -P MYSQL_PORT -u MYSQL_USER -p

# Enter password when prompted

# Use database
USE railway;

# Import schema (from your local machine)
source C:/path/to/backend/database/complete_schema.sql;

# Verify tables
SHOW TABLES;

# Exit
EXIT;
```

### Step 5: Configure Database Settings

1. In Railway MySQL service
2. Go to "Settings" tab
3. **Enable**: "Public Networking" (if not already enabled)
4. Note the connection details

---

## 🚀 Part 2: Deploy Backend to Render

### Step 1: Prepare Backend Code

**Update backend/config/database.js:**

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

module.exports = pool;
```

**Update backend/server.js (add at the top):**

```javascript
// Add CORS configuration for Vercel
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Will be your Vercel URL
  /\.vercel\.app$/ // Allow all Vercel preview deployments
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### Step 2: Push Code to GitHub

```bash
# Initialize git (if not already)
cd C:\webapp
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create GitHub repository (on github.com)
# Then push:
git remote add origin https://github.com/yourusername/tailor-shop.git
git branch -M main
git push -u origin main
```

### Step 3: Create Render Account

1. Go to: https://render.com/
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 4: Create Web Service on Render

1. **Click**: "New +" → "Web Service"
2. **Connect**: Your GitHub repository
3. **Configure**:

   **Basic Settings:**
   - Name: `tailor-shop-backend`
   - Region: `Oregon (US West)` or closest to you
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

   **Instance Type:**
   - Select: `Free` (750 hours/month)

4. **Click**: "Advanced" → "Add Environment Variables"

### Step 5: Add Environment Variables

Add these variables in Render:

```env
PORT=5000
NODE_ENV=production

# Database (from Railway)
DB_HOST=your-railway-host
DB_PORT=your-railway-port
DB_USER=root
DB_PASSWORD=your-railway-password
DB_NAME=railway

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (will update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
```

### Step 6: Deploy

1. **Click**: "Create Web Service"
2. **Wait**: Render will build and deploy (3-5 minutes)
3. **Note**: Your backend URL (e.g., `https://tailor-shop-backend.onrender.com`)

### Step 7: Test Backend

Visit: `https://your-backend.onrender.com/api/health`

Should return: `{"status": "ok"}`

---

## 🚀 Part 3: Deploy Frontend to Vercel

### Step 1: Prepare Frontend Code

**Update frontend/.env.production:**

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Update frontend/src/config/api.js:**

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

### Step 2: Commit Changes

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 3: Create Vercel Account

1. Go to: https://vercel.com/
2. Sign up with GitHub
3. Authorize Vercel

### Step 4: Import Project

1. **Click**: "Add New..." → "Project"
2. **Import**: Your GitHub repository
3. **Configure**:

   **Framework Preset:** Vite
   
   **Root Directory:** `frontend`
   
   **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables** (click "Add"):

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Step 5: Deploy

1. **Click**: "Deploy"
2. **Wait**: Vercel will build and deploy (2-3 minutes)
3. **Note**: Your frontend URL (e.g., `https://tailor-shop.vercel.app`)

### Step 6: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Save (Render will auto-redeploy)

---

## 🔒 Part 4: Configure Custom Domain (Optional)

### For Vercel (Frontend)

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your domain (e.g., `www.tailorshop.com`)
   - Follow DNS configuration instructions

2. **In your domain registrar**:
   - Add CNAME record:
     - Name: `www`
     - Value: `cname.vercel-dns.com`

### For Render (Backend)

1. **In Render Dashboard**:
   - Go to your service
   - Click "Settings" → "Custom Domain"
   - Add subdomain (e.g., `api.tailorshop.com`)

2. **In your domain registrar**:
   - Add CNAME record:
     - Name: `api`
     - Value: `your-app.onrender.com`

---

## ✅ Part 5: Verify Deployment

### Test Checklist

- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Backend API works: `https://your-backend.onrender.com/api/health`
- [ ] Database connected (check backend logs)
- [ ] Products load on shop page
- [ ] User registration works
- [ ] Login works
- [ ] Add to cart works
- [ ] Checkout flow works
- [ ] Payment integration works (test mode)
- [ ] Admin panel accessible
- [ ] Order tracking works

### Check Logs

**Render Backend Logs:**
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Check for errors

**Vercel Frontend Logs:**
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on latest deployment
5. View build logs

**Railway Database:**
1. Go to Railway dashboard
2. Click on MySQL service
3. Go to "Metrics" tab
4. Check connections and queries

---

## 🔧 Part 6: Maintenance & Updates

### Update Backend

```bash
# Make changes to backend code
git add backend/
git commit -m "Update backend"
git push origin main

# Render will auto-deploy
```

### Update Frontend

```bash
# Make changes to frontend code
git add frontend/
git commit -m "Update frontend"
git push origin main

# Vercel will auto-deploy
```

### Update Database Schema

```bash
# Connect to Railway MySQL
mysql -h MYSQL_HOST -P MYSQL_PORT -u MYSQL_USER -p

# Run your SQL updates
ALTER TABLE products ADD COLUMN new_field VARCHAR(255);

# Exit
EXIT;
```

### Monitor Usage

**Railway:**
- Dashboard → MySQL service → "Metrics"
- Check: Storage, Bandwidth, Connections
- $5 credit = ~500 hours runtime

**Render:**
- Dashboard → Service → "Metrics"
- Check: CPU, Memory, Requests
- Free tier = 750 hours/month

**Vercel:**
- Dashboard → Project → "Analytics"
- Check: Bandwidth, Build minutes
- Free tier = Unlimited bandwidth

---

## 🚨 Troubleshooting

### Issue: Backend sleeps after 15 minutes

**Problem:** Render free tier spins down after inactivity

**Solution 1: Keep-Alive Service (Free)**

Use UptimeRobot to ping your backend every 10 minutes:

1. Go to: https://uptimerobot.com/
2. Sign up (free)
3. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://your-backend.onrender.com/api/health`
   - Interval: 10 minutes
4. Save

**Solution 2: Loading State in Frontend**

Add a loading message for first request:

```javascript
// In your API calls
const [isWakingUp, setIsWakingUp] = useState(false);

const fetchData = async () => {
  setIsWakingUp(true);
  try {
    const response = await api.get('/endpoint');
    // Handle response
  } catch (error) {
    // Handle error
  } finally {
    setIsWakingUp(false);
  }
};

// Show loading message
{isWakingUp && <p>Waking up server, please wait...</p>}
```

### Issue: CORS errors

**Check:**
1. `FRONTEND_URL` in Render environment variables
2. CORS configuration in `backend/server.js`
3. API URL in frontend `.env.production`

**Fix:**
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

### Issue: Database connection fails

**Check:**
1. Railway MySQL is running
2. Database credentials are correct in Render
3. Public networking is enabled in Railway

**Test connection:**
```bash
mysql -h MYSQL_HOST -P MYSQL_PORT -u MYSQL_USER -p
```

### Issue: Environment variables not working

**Render:**
1. Go to service → "Environment"
2. Check all variables are set
3. Click "Manual Deploy" to redeploy

**Vercel:**
1. Go to project → "Settings" → "Environment Variables"
2. Check all variables are set
3. Redeploy from "Deployments" tab

### Issue: Images not loading

**Problem:** Uploaded images stored on Render (ephemeral storage)

**Solution:** Use Cloudinary for image storage

1. Sign up at cloudinary.com (free)
2. Get API credentials
3. Update backend to upload to Cloudinary
4. Store Cloudinary URLs in database

---

## 💡 Optimization Tips

### 1. Enable Caching

**In Vercel (automatic):**
- Static assets cached automatically
- CDN enabled globally

**In Render:**
Add to `backend/server.js`:

```javascript
// Cache static assets
app.use(express.static('uploads', {
  maxAge: '30d'
}));
```

### 2. Optimize Database Queries

```javascript
// Use connection pooling (already configured)
// Add indexes to frequently queried columns

// In Railway MySQL:
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(order_status);
```

### 3. Compress Responses

```javascript
// backend/server.js
const compression = require('compression');
app.use(compression());
```

### 4. Monitor Performance

**Vercel Analytics:**
- Enable in project settings
- Track page load times
- Monitor Core Web Vitals

**Render Metrics:**
- Check response times
- Monitor memory usage
- Track error rates

---

## 💰 Cost Management

### Stay Within Free/Low Cost

**Railway ($5 credit/month):**
- Optimize queries to reduce CPU usage
- Use indexes for faster queries
- Monitor storage usage
- Delete old logs/data

**Render (750 hours/month):**
- One service = 31 days × 24 hours = 744 hours
- You're within free tier!
- Use UptimeRobot to keep it awake

**Vercel (Free):**
- Unlimited bandwidth
- No worries about cost

**Total: $0-5/month** (Railway usually stays under $5)

### When to Upgrade

**Upgrade Railway when:**
- Exceeding $5/month consistently
- Need more storage (>1GB)
- High traffic (>100GB bandwidth)

**Upgrade Render when:**
- Need always-on (no sleeping)
- Need more resources
- High traffic

**Cost after upgrade:**
- Railway: ~$10-20/month
- Render: $7/month (Starter plan)
- Vercel: Still free!

---

## 🎉 Success!

Your e-commerce website is now live!

**URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Admin: `https://your-app.vercel.app/admin`

**Features:**
- ✅ Global CDN (Vercel)
- ✅ Auto SSL (both)
- ✅ Auto-deploy from GitHub
- ✅ Professional infrastructure
- ✅ Scalable architecture
- ✅ $0-5/month cost

---

## 📞 Support Resources

**Vercel:**
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

**Render:**
- Docs: https://render.com/docs
- Community: https://community.render.com/

**Railway:**
- Docs: https://docs.railway.app/
- Discord: https://discord.gg/railway

---

**Congratulations! Your business website is now deployed on professional infrastructure! 🎊**
