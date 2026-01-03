# Switch to Render PostgreSQL - Complete Guide

## Why Switch?

Supabase has persistent IPv6 connection issues on Render that can't be fixed with code changes. Render PostgreSQL:
- ✅ No IPv6 issues (same infrastructure)
- ✅ Faster (internal network, no internet routing)
- ✅ Free tier available (256 MB storage)
- ✅ Automatic backups
- ✅ Easy to manage

---

## Step-by-Step Migration

### Step 1: Create Render PostgreSQL Database

1. Go to: https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"PostgreSQL"**
4. Fill in details:
   - **Name:** `ammadesigns-db`
   - **Database:** `ammadesigns` (or leave default)
   - **User:** `ammadesigns` (or leave default)
   - **Region:** **Oregon** (same as your backend)
   - **PostgreSQL Version:** 16 (latest)
   - **Plan:** **Free**
5. Click **"Create Database"**
6. Wait 1-2 minutes for creation

### Step 2: Get Connection String

After creation, you'll see the database dashboard with:

- **Internal Database URL** ← Use this one!
- **External Database URL**
- **PSQL Command**

**Copy the Internal Database URL** - it looks like:
```
postgres://ammadesigns:XXXXX@dpg-XXXXX/ammadesigns
```

### Step 3: Update Backend Environment Variables

Go to: **Backend Service → Environment**

**Remove these 5 variables:**
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

**Add this 1 variable:**
- **Key:** `DATABASE_URL`
- **Value:** [paste the Internal Database URL from Step 2]

**Keep these variables:**
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `JWT_SECRET` = (your current value)
- `RAZORPAY_KEY_ID` = (your current value)
- `RAZORPAY_KEY_SECRET` = (your current value)

Click **"Save Changes"**

Render will auto-redeploy (2-3 minutes)

### Step 4: Initialize Database

After redeploy completes:

1. Go to **Backend Service → Shell** tab
2. Run this command:
   ```bash
   node scripts/init-database.js
   ```

3. You should see:
   ```
   ✅ Connected to PostgreSQL
   ✅ Schema applied successfully
   ✅ Tables created
   🎉 Database initialization complete!
   ```

### Step 5: Verify & Test

**Test backend health:**
```bash
curl https://ammadesigns.onrender.com
```

**Test signup:**
```bash
curl -X POST https://ammadesigns.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"9999999999","password":"test123"}'
```

Should return:
```json
{
  "token": "eyJ...",
  "customer": {
    "id": 1,
    "name": "Test User",
    "email": "9999999999@phone.local",
    "phone": "9999999999"
  }
}
```

**Test on website:**
1. Go to https://ammacollections.vercel.app/signup
2. Fill in form and submit
3. Should redirect to shop page ✅

---

## Migrating Existing Data (Optional)

If you have important data in Supabase that you want to keep:

### Export from Supabase:

```bash
# On your local machine
pg_dump "postgresql://postgres:Sagar@#8897@db.cklxnpbibdmvcdwyqwkw.supabase.co:5432/postgres" > supabase_backup.sql
```

### Import to Render:

1. Go to Render PostgreSQL → **Shell** tab
2. Click **"Connect"**
3. Run:
   ```bash
   psql $DATABASE_URL < supabase_backup.sql
   ```

---

## Comparison

| Feature | Supabase | Render PostgreSQL |
|---------|----------|-------------------|
| **Connection** | ❌ IPv6 issues | ✅ Works perfectly |
| **Speed** | 🐌 External routing | ⚡ Internal network |
| **Free Tier** | ✅ 500 MB | ✅ 256 MB |
| **Backups** | ✅ Automatic | ✅ Automatic |
| **Management** | Web UI | Web UI |
| **Cost** | Free | Free |

---

## Troubleshooting

### If init-database.js fails:

**Option A: Use SQL directly**

1. Go to Render PostgreSQL → **Shell** tab
2. Click **"Connect"**
3. Copy and paste the contents of `backend/database/schema_postgres.sql`
4. Press Enter

**Option B: Use PSQL command**

```bash
psql $DATABASE_URL -f backend/database/schema_postgres.sql
```

### If you get "permission denied":

Make sure you're using the **Internal Database URL**, not External.

### If tables already exist:

That's OK! The schema uses `CREATE TABLE IF NOT EXISTS`, so it won't error.

---

## After Migration

### Update Your Documentation:

- Database: Render PostgreSQL (was Supabase)
- Connection: Internal (fast, secure)
- No more IPv6 issues!

### Monitor Database:

- Render Dashboard → PostgreSQL → Metrics
- Check storage usage
- Monitor connection count

### Upgrade if Needed:

Free tier: 256 MB storage
- If you need more, upgrade to Starter ($7/month) for 1 GB

---

## Rollback (If Needed)

If you want to go back to Supabase:

1. Remove `DATABASE_URL` from environment
2. Add back the 5 individual variables:
   - `DB_HOST` = `db.cklxnpbibdmvcdwyqwkw.supabase.co`
   - `DB_PORT` = `5432`
   - `DB_USER` = `postgres`
   - `DB_PASSWORD` = `Sagar@#8897`
   - `DB_NAME` = `postgres`
3. Save and redeploy

(But you'll still have IPv6 issues)

---

## Summary

**Time Required:** 10 minutes  
**Difficulty:** Easy  
**Result:** No more connection issues! 🎉

**Steps:**
1. Create Render PostgreSQL (2 min)
2. Update environment variables (2 min)
3. Wait for redeploy (3 min)
4. Initialize database (2 min)
5. Test (1 min)

**Total:** 10 minutes to a working application!

---

## Need Help?

If you encounter any issues during migration, check:
- Render PostgreSQL logs
- Backend service logs
- Make sure DATABASE_URL is set correctly
- Verify database is in same region as backend

---

**Ready to migrate? Follow Step 1 above!** 🚀
