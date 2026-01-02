# Signup Issue Troubleshooting Guide

## Problem
Users unable to signup on the deployed website.

## Possible Causes & Solutions

### 1. Database Not Initialized ⚠️ MOST LIKELY

**Check if database tables exist:**

1. Go to Render Dashboard → Your Backend Service → Shell
2. Run this command to check if customers table exists:
   ```bash
   node -e "import('./config/db-helper.js').then(m => m.query('SELECT * FROM customers LIMIT 1').then(r => console.log('✓ Table exists:', r)).catch(e => console.error('✗ Error:', e.message)))"
   ```

**If table doesn't exist, initialize the database:**

```bash
# In Render Shell
node -e "import('pg').then(pkg => {
  const client = new pkg.default.Client(process.env.DATABASE_URL);
  client.connect().then(() => {
    const fs = require('fs');
    const schema = fs.readFileSync('./database/schema_postgres.sql', 'utf8');
    return client.query(schema);
  }).then(() => console.log('✓ Database initialized')).catch(e => console.error('Error:', e));
})"
```

**OR use the setup script:**
```bash
node scripts/setup-supabase.js
```

---

### 2. Email Validation Issue

**Problem:** Frontend makes email optional, but backend requires it.

**Backend validation (auth.js line 12):**
```javascript
body('email').isEmail().withMessage('Valid email is required')
```

**Frontend (Signup.jsx line 95):**
```html
<input type="email" name="email" placeholder="Enter your email" />
<!-- No 'required' attribute -->
```

**Solution A: Make email required in frontend**
Add `required` attribute to email input in `frontend/src/pages/Signup.jsx`

**Solution B: Make email optional in backend**
Change backend validation to:
```javascript
body('email').optional().isEmail().withMessage('Valid email format required')
```

---

### 3. CORS Issues

**Check browser console for errors like:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Update backend CORS to allow your frontend domain

In `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app',
    'https://your-frontend-domain.onrender.com'
  ],
  credentials: true
}));
```

---

### 4. API URL Configuration

**Check if frontend is pointing to correct backend:**

In browser console:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Should show: `https://ammadesigns.onrender.com/api`

**If wrong, check:**
- Vercel environment variables
- `.env.production` file
- Rebuild and redeploy frontend

---

### 5. Backend Service Down

**Check if backend is running:**
```bash
curl https://ammadesigns.onrender.com
```

Should return: `{"message":"Ladies Tailor Shop API is running"}`

**If not responding:**
- Check Render logs for errors
- Verify DATABASE_URL is set
- Check if service is sleeping (free tier)

---

## Quick Diagnostic Steps

### Step 1: Test Backend Directly
```bash
curl -X POST https://ammadesigns.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "customer": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210"
  }
}
```

**Error Responses:**

**Database Error:**
```json
{"error": "Signup failed"}
```
→ Database not initialized or connection issue

**Validation Error:**
```json
{
  "errors": [
    {"msg": "Valid email is required", "param": "email"}
  ]
}
```
→ Email validation issue

**Duplicate Email:**
```json
{"error": "Email already registered"}
```
→ User already exists (this is actually good - means DB works!)

---

### Step 2: Check Browser Console

Open browser DevTools (F12) → Console tab

Look for:
- ❌ Network errors (CORS, 404, 500)
- ❌ API URL issues
- ❌ JavaScript errors

---

### Step 3: Check Network Tab

Open DevTools → Network tab → Try signup

Check the request:
- **URL:** Should be `https://ammadesigns.onrender.com/api/auth/signup`
- **Method:** POST
- **Status:** Should be 201 (success) or 400/500 (error)
- **Response:** Check error message

---

## Most Common Fix

**90% of signup issues are due to database not being initialized.**

### Initialize Database Now:

1. **Go to Render Dashboard**
2. **Click on your backend service**
3. **Go to "Shell" tab**
4. **Run:**
   ```bash
   node scripts/setup-supabase.js
   ```
   OR if that doesn't work:
   ```bash
   psql $DATABASE_URL -f database/schema_postgres.sql
   ```

5. **Verify:**
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM customers;"
   ```

---

## Fix Email Validation Mismatch

Since email is optional in the UI but required in backend, let's fix the backend:

**Update `backend/routes/auth.js` line 12:**

```javascript
// OLD (requires email)
body('email').isEmail().withMessage('Valid email is required'),

// NEW (makes email optional)
body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email format required'),
```

**Also update line 26 to handle optional email:**

```javascript
// Check if customer already exists (only if email provided)
if (email) {
  const [existing] = await pool('SELECT * FROM customers WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(400).json({ error: 'Email already registered' });
  }
}
```

---

## After Fixing

1. **Test signup with email**
2. **Test signup without email**
3. **Test login with phone number**
4. **Test login with email**

---

## Need More Help?

Check these logs:
- Render backend logs (Dashboard → Service → Logs)
- Browser console (F12 → Console)
- Network requests (F12 → Network)

Common error patterns:
- `ECONNREFUSED` → Backend not running
- `404` → Wrong API URL
- `500` → Database or server error
- `400` → Validation error
- `CORS` → CORS configuration issue
