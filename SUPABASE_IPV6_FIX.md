# Fix Supabase IPv6 Connection Issue on Render

## Problem
Render tries to connect to Supabase via IPv6, which fails:
```
Error: connect ENETUNREACH 2406:da1a:6b0:f619:2b81:9674:4776:b5d7:5432
```

## Solution: Use Supabase Connection Pooler (IPv4)

Supabase provides a connection pooler that uses IPv4 and is optimized for serverless environments.

### Update Environment Variables on Render

Instead of direct database connection, use the pooler:

**Current (Direct Connection - IPv6 issue):**
```
DB_HOST=db.cklxnpbibdmvcdwyqwkw.supabase.co
DB_PORT=5432
```

**New (Connection Pooler - IPv4):**
```
DB_HOST=aws-0-ap-south-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.cklxnpbibdmvcdwyqwkw
DB_PASSWORD=Sagar@#8897
DB_NAME=postgres
```

### Steps to Update on Render:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on your backend service**
3. **Go to "Environment" tab**
4. **Update these variables:**
   - `DB_HOST` = `aws-0-ap-south-1.pooler.supabase.com`
   - `DB_PORT` = `6543`
   - `DB_USER` = `postgres.cklxnpbibdmvcdwyqwkw`
   - Keep `DB_PASSWORD` and `DB_NAME` same
5. **Save Changes**
6. **Render will auto-redeploy**

### Alternative: Use Supabase Session Mode

If transaction pooler doesn't work, try session mode:

```
DB_HOST=aws-0-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.cklxnpbibdmvcdwyqwkw
```

### How to Find Your Pooler URL

1. Go to Supabase Dashboard
2. Click on your project
3. Go to "Settings" → "Database"
4. Look for "Connection Pooling" section
5. Copy the connection string for "Transaction" mode
6. Extract host, port, and user from the connection string

### Connection String Format

**Transaction Mode (Port 6543):**
```
postgresql://postgres.cklxnpbibdmvcdwyqwkw:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Session Mode (Port 5432):**
```
postgresql://postgres.cklxnpbibdmvcdwyqwkw:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

### Why This Works

- **Direct connection** resolves to IPv6 on some servers
- **Connection pooler** uses IPv4 and is designed for serverless
- **Pooler** also provides better performance and connection management

### After Updating

1. Wait for Render to redeploy (1-2 minutes)
2. Test signup again
3. Should work without IPv6 errors

---

## Alternative Solution: Use Different Database

If Supabase pooler doesn't work, consider:

1. **Render PostgreSQL** (native, no IPv6 issues)
2. **Neon** (serverless PostgreSQL, IPv4)
3. **Railway** (PostgreSQL with IPv4)

### Quick Setup with Render PostgreSQL:

1. Render Dashboard → New → PostgreSQL
2. Create database
3. Copy "Internal Database URL"
4. Update `DATABASE_URL` in backend service
5. Run database init script

---

## Current Code Changes

The `backend/config/db.js` has been updated to:
- Use individual connection parameters instead of connection string
- This gives more control over connection settings
- Should work once environment variables are updated

---

## Test After Fix

```bash
curl -X POST https://ammadesigns.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"3333333333","password":"test123"}'
```

Should return:
```json
{
  "token": "eyJ...",
  "customer": {...}
}
```
