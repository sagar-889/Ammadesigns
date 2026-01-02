# Your Next Steps - PostgreSQL Setup

## ✅ What's Already Done

1. ✓ `.env` file updated with your PostgreSQL password (`sagar@8897`)
2. ✓ All route files updated for PostgreSQL
3. ✓ Database configuration files ready
4. ✓ PostgreSQL schema created

## 📋 What You Need to Do Now

### Step 1: Install PostgreSQL (15-20 minutes)

**Download and Install:**
1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download the latest version (PostgreSQL 16)
4. Run the installer

**During Installation:**
- When asked for a password, enter: `sagar@8897`
- Keep the default port: `5432`
- Install all components (including pgAdmin 4)
- Complete the installation

### Step 2: Create Database (2 minutes)

After installation, open PowerShell and run:

```powershell
# Add PostgreSQL to PATH (adjust version number if different)
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"

# Connect to PostgreSQL (password: sagar@8897)
psql -U postgres

# In the psql prompt, type these commands:
CREATE DATABASE ladies_tailor_db;
\c ladies_tailor_db
\q
```

### Step 3: Run Schema (1 minute)

```powershell
# From your project root (C:\webapp)
psql -U postgres -d ladies_tailor_db -f backend\database\schema_postgres.sql
```

When prompted for password, enter: `sagar@8897`

### Step 4: Install Dependencies (2 minutes)

```powershell
cd backend
npm install
```

### Step 5: Start Your Server (1 minute)

```powershell
npm start
```

You should see:
```
Server running on port 5000
Connected to PostgreSQL database
```

### Step 6: Test It (1 minute)

Open a new PowerShell window and test:

```powershell
# Test health endpoint
curl http://localhost:5000/

# Test services
curl http://localhost:5000/api/services

# Test products
curl http://localhost:5000/api/shop/products
```

## 🎯 Quick Commands

### If psql command not found:
```powershell
# Add to PATH
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"
```

### Connect to database:
```powershell
psql -U postgres -d ladies_tailor_db
```

### Check tables:
```sql
\dt
```

### Check data:
```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM services;
```

### Exit psql:
```sql
\q
```

## 🔧 Your Configuration

```
Database Host: localhost
Database Port: 5432
Database User: postgres
Database Password: sagar@8897
Database Name: ladies_tailor_db
```

## ⚠️ Troubleshooting

### PostgreSQL service not running?
1. Press Win + R
2. Type `services.msc`
3. Find "postgresql-x64-16"
4. Right-click → Start

### Can't connect?
- Check password is exactly: `sagar@8897`
- Make sure PostgreSQL service is running
- Verify port 5432 is not blocked

### Port 5432 already in use?
```powershell
netstat -ano | findstr :5432
```

## 📚 Documentation

If you need more help:
- **Quick Start**: `SETUP_INSTRUCTIONS.md`
- **Full Guide**: `README_POSTGRES_MIGRATION.md`
- **Commands**: `POSTGRES_QUICK_REFERENCE.md`

## ✨ That's It!

Once you complete these steps, your application will be running on PostgreSQL!

**Total time needed: ~25-30 minutes**

---

**Current Status:**
- ✅ Code updated
- ✅ Configuration ready
- ⚠️ PostgreSQL needs to be installed
- ⚠️ Database needs to be created
- ⚠️ Schema needs to be applied

**Start with Step 1 above!**
