# Supabase IPv6 Issue - Final Solution

## The Problem

Render servers are trying to connect to Supabase via IPv6, which fails:
```
Error: connect ENETUNREACH 2406:da1a:6b0:f619:2b81:9674:4776:b5d7:5432
```

## Solutions (Try in Order)

### Solution 1: Use Supabase IPv4 Pooler (Recommended)

Supabase provides an IPv4-only connection pooler. Update Render environment variables:

**Transaction Mode (Port 6543):**
```
DB_HOST = aws-0-ap-south-1.pooler.supabase.com
DB_PORT = 6543
DB_USER = postgres.cklxnpbibdmvcdwyqwkw
DB_PASSWORD = Sagar@#8897
DB_NAME = postgres
```

**OR Session Mode (Port 5432):**
```
DB_HOST = aws-0-ap-south-1.pooler.supabase.com
DB_PORT = 5432
DB_USER = postgres.cklxnpbibdmvcdwyqwkw
DB_PASSWORD = Sagar@#8897
DB_NAME = postgres
```

**Note:** The username format for pooler is `postgres.PROJECT_REF`

---

### Solution 2: Get Supabase IPv4 Address

Find the IPv4 address of your Supabase database:

1. **On your local machine**, run:
   ```bash
   nslookup db.cklxnpbibdmvcdwyqwkw.supabase.co
   ```

2. **Look for the IPv4 address** (format: xxx.xxx.xxx.xxx)

3. **Update Render environment variables:**
   ```
   DB_HOST = [IPv4 address from step 2]
   DB_PORT = 5432
   DB_USER = postgres
   DB_PASSWORD = Sagar@#8897
   DB_NAME = postgres
   ```

---

### Solution 3: Use Different Database Provider

If Supabase IPv6 issue persists, consider:

#### Option A: Render PostgreSQL (Native, No IPv6 Issues)

1. **Create Render PostgreSQL:**
   - Render Dashboard → New → PostgreSQL
   - Name: `ammadesigns-db`
   - Plan: Free

2. **Copy Internal Database URL**

3. **Update Backend Environment:**
   ```
   DATABASE_URL = [Internal Database URL from Render]
   ```

4. **Initialize Database:**
   - Go to backend service Shell
   - Run: `node scripts/init-database.js`

#### Option B: Neon (Serverless PostgreSQL)

1. **Create account:** https://neon.tech
2. **Create project**
3. **Copy connection string**
4. **Update Render environment variables**

#### Option C: Railway PostgreSQL

1. **Create account:** https://railway.app
2. **Create PostgreSQL database**
3. **Copy connection details**
4. **Update Render environment variables**

---

### Solution 4: Force IPv4 in Node.js (Code Change)

Update `backend/config/db.js`:

```javascript
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Force IPv4 resolution
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  // Force IPv4
  family: 4,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export default pool;
```

---

## Recommended Approach

**Try Solution 1 first** (Supabase Pooler with Session Mode):

1. Update Render environment variables:
   ```
   DB_HOST = aws-0-ap-south-1.pooler.supabase.com
   DB_PORT = 5432
   DB_USER = postgres.cklxnpbibdmvcdwyqwkw
   DB_PASSWORD = Sagar@#8897
   DB_NAME = postgres
   ```

2. Save and wait for redeploy

3. Test signup

**If that fails**, try Solution 4 (code change to force IPv4).

**If still failing**, use Solution 3 (switch to Render PostgreSQL).

---

## Why This Happens

- Supabase uses dual-stack DNS (both IPv4 and IPv6)
- Render's infrastructure prefers IPv6 when available
- But Render's IPv6 routing to Supabase doesn't work
- Solution: Force IPv4 connection

---

## Testing After Fix

```bash
curl -X POST https://ammadesigns.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"7777777777","password":"test123"}'
```

Should return:
```json
{
  "token": "eyJ...",
  "customer": {...}
}
```
