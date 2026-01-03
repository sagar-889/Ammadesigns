# Render Configuration - AmmaDesigns

## ✅ Working Configuration (Tested & Verified)

### Backend Service Configuration

**Service Type:** Web Service  
**Name:** ammadesigns-backend  
**Region:** Oregon (or closest to your users)  
**Branch:** main  

---

## Build & Deploy Settings

### Build Command:
```bash
cd backend && npm install
```

### Start Command:
```bash
cd backend && node server.js
```

**OR** if using Root Directory:

**Root Directory:** `backend`  
**Build Command:** `npm install`  
**Start Command:** `node server.js`

---

## Environment Variables (CRITICAL)

Copy these **exact values** to your Render service:

```
NODE_ENV=production
PORT=10000
DB_HOST=db.cklxnpbibdmvcdwyqwkw.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Sagar@#8897
DB_NAME=postgres
JWT_SECRET=ce45d4bf88a1da9e352a59716b7b44304b99b801537da8006e3c5f9102ed4bd7b74b173d76b05e9c47b1b054d14aab81c9b52d83cb78379ef1dea29ce7ac8a80
RAZORPAY_KEY_ID=rzp_test_RxuczeVL33p8DO
RAZORPAY_KEY_SECRET=kpkVZfk34dNVkfurAcY6WJUw
```

### Important Notes:
- ✅ **DB_HOST**: Direct Supabase connection (tested and working)
- ✅ **DB_PORT**: 5432 (standard PostgreSQL port)
- ✅ **DB_USER**: postgres (not postgres.PROJECT_REF)
- ⚠️ **JWT_SECRET**: Use the generated secure token above
- ⚠️ **Razorpay**: Currently using test keys (update for production)

---

## Health Check

**Path:** `/`  
**Expected Response:** `{"message":"Ladies Tailor Shop API is running"}`

---

## Auto Deploy

**Enable Auto-Deploy:** ✅ Yes  
**Branch:** main  

This will automatically redeploy when you push to GitHub.

---

## Instance Type

**Free Tier:** 512 MB RAM, 0.1 CPU  
**Recommended for Production:** Starter ($7/month) - 512 MB RAM, 0.5 CPU

---

## Disk Storage

**Persistent Disk:** Not required (using external database)  
**Uploads:** Stored in `/uploads` (ephemeral on free tier)

⚠️ **Note:** On free tier, uploaded files will be lost on redeploy. Consider using cloud storage (AWS S3, Cloudinary) for production.

---

## Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add your domain (e.g., `api.ammadesigns.com`)
3. Update DNS records as instructed
4. Update frontend `VITE_API_URL` to use custom domain

---

## Troubleshooting

### If deployment fails:

1. **Check Build Logs:**
   - Dashboard → Service → Logs → Build Logs
   - Look for red error messages

2. **Common Issues:**
   - ❌ Wrong build/start command
   - ❌ Missing environment variables
   - ❌ Wrong root directory
   - ❌ Database connection issues

3. **Verify Environment Variables:**
   - All 10 variables are set
   - No typos in variable names
   - Values are correct (especially DB credentials)

### If getting 500 errors:

1. **Check Runtime Logs:**
   - Dashboard → Service → Logs
   - Look for "Database query error" or "Signup error"

2. **Test Database Connection:**
   - Run `node backend/test-connection.js` locally
   - Should show "✅ Connected successfully!"

3. **Common Database Errors:**
   - "Tenant or user not found" → Wrong DB_USER
   - "ENETUNREACH" → IPv6 issue (use direct connection)
   - "password authentication failed" → Wrong DB_PASSWORD

---

## Deployment Checklist

Before deploying, verify:

- [ ] All environment variables are set correctly
- [ ] Build command includes `cd backend &&`
- [ ] Start command includes `cd backend &&`
- [ ] Database is initialized (customers table exists)
- [ ] JWT_SECRET is set to secure random string
- [ ] NODE_ENV is set to `production`
- [ ] Auto-deploy is enabled

---

## Post-Deployment Steps

1. **Verify Backend is Running:**
   ```bash
   curl https://ammadesigns.onrender.com
   ```
   Should return: `{"message":"Ladies Tailor Shop API is running"}`

2. **Test Signup:**
   ```bash
   curl -X POST https://ammadesigns.onrender.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","phone":"9999999999","password":"test123"}'
   ```
   Should return: `{"token":"...","customer":{...}}`

3. **Update Frontend:**
   - Ensure `VITE_API_URL` points to Render backend
   - Redeploy frontend if needed

4. **Test Complete Flow:**
   - Signup on website
   - Login
   - Add to cart
   - Place order
   - Track order

---

## Monitoring

### Free Tier Limitations:
- ⏰ Spins down after 15 minutes of inactivity
- 🐌 First request after spin-down takes 30-60 seconds
- 📊 750 hours/month free (enough for 24/7 operation)

### Keep Service Awake (Optional):
Use a service like UptimeRobot or Cron-job.org to ping your backend every 10 minutes:
```
https://ammadesigns.onrender.com
```

---

## Upgrade to Paid Plan

**When to upgrade:**
- High traffic (> 100 requests/day)
- Need always-on service (no spin-down)
- Need more resources (RAM/CPU)
- Need persistent disk storage

**Starter Plan ($7/month):**
- 512 MB RAM, 0.5 CPU
- Always on (no spin-down)
- Better performance
- Persistent disk available

---

## Security Best Practices

1. **JWT Secret:**
   - ✅ Use long random string (128+ characters)
   - ✅ Never commit to Git
   - ✅ Rotate periodically

2. **Database Credentials:**
   - ✅ Use environment variables
   - ✅ Never hardcode in code
   - ✅ Use strong passwords

3. **Razorpay Keys:**
   - ⚠️ Currently using test keys
   - 🔒 Update to live keys for production
   - 🔒 Keep secret key secure

4. **CORS:**
   - Update to allow only your frontend domain
   - Remove `*` wildcard in production

---

## Backup & Recovery

### Database Backup:
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Code Backup:
- ✅ Code is in GitHub (automatic backup)
- ✅ Use tags for releases: `git tag v1.0.0`

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## Quick Reference

**Backend URL:** https://ammadesigns.onrender.com  
**Health Check:** https://ammadesigns.onrender.com/  
**API Base:** https://ammadesigns.onrender.com/api  
**Admin Login:** admin@amma.com / amma@435  

**Database:** Supabase PostgreSQL  
**Payment:** Razorpay (test mode)  
**Hosting:** Render (free tier)  

---

## Last Updated
January 3, 2026

**Status:** ✅ Backend deployed and running  
**Issue:** Database connection configured correctly  
**Next:** Update environment variables on Render dashboard
