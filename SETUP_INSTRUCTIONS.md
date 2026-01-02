# PostgreSQL Setup Instructions for Your System

## Your Configuration
- **Database Password**: `sagar@8897`
- **Database User**: `postgres`
- **Database Name**: `ladies_tailor_db`
- **Port**: `5432`

Your `.env` file has been updated with these credentials! ✓

## Step 1: Install PostgreSQL

### Option A: Download Installer (Recommended for Windows)
1. Go to: https://www.postgresql.org/download/windows/
2. Download the latest PostgreSQL installer
3. Run the installer
4. **Important**: When asked for a password, use: `sagar@8897`
5. Keep default port: `5432`
6. Complete the installation

### Option B: Using Chocolatey (if you have it)
```powershell
# Run PowerShell as Administrator
choco install postgresql
```

## Step 2: Verify Installation

After installation, open a new PowerShell window and run:
```powershell
# Add PostgreSQL to PATH (if not done automatically)
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"

# Verify installation
psql --version
```

## Step 3: Create Database

Open PowerShell and run:
```powershell
# Connect to PostgreSQL (password: sagar@8897)
psql -U postgres

# In the psql prompt, run:
CREATE DATABASE ladies_tailor_db;

# Connect to the database
\c ladies_tailor_db

# Exit psql
\q
```

## Step 4: Run Schema

```powershell
# From your project root (C:\webapp)
cd backend\database

# Run the schema
psql -U postgres -d ladies_tailor_db -f schema_postgres.sql
```

When prompted for password, enter: `sagar@8897`

## Step 5: Update Route Files

```powershell
# From project root
cd backend
node scripts\update-routes-for-postgres.js
```

## Step 6: Install Dependencies

```powershell
# Still in backend folder
npm install
```

## Step 7: Start the Server

```powershell
npm start
```

## Quick Commands Reference

### Connect to Database
```powershell
psql -U postgres -d ladies_tailor_db
```

### List Tables
```sql
\dt
```

### Check Data
```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM services;
```

### Exit psql
```sql
\q
```

## Troubleshooting

### If psql command not found after installation:
Add PostgreSQL to your PATH:
```powershell
# Add to current session
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"

# Or add permanently via System Environment Variables
```

### If connection fails:
1. Check PostgreSQL service is running:
   - Open Services (Win + R, type `services.msc`)
   - Find "postgresql-x64-16" (or similar)
   - Ensure it's running

2. Verify password is correct: `sagar@8897`

### If port 5432 is in use:
Check what's using the port:
```powershell
netstat -ano | findstr :5432
```

## Alternative: Use pgAdmin (GUI Tool)

If you prefer a graphical interface:
1. pgAdmin is usually installed with PostgreSQL
2. Open pgAdmin
3. Connect to localhost
4. Create database: `ladies_tailor_db`
5. Run the schema file through the Query Tool

## Next Steps After Setup

1. ✓ PostgreSQL installed
2. ✓ Database created
3. ✓ Schema applied
4. ✓ Route files updated
5. ✓ Dependencies installed
6. ✓ Server started

Then test:
```powershell
# Test health endpoint
curl http://localhost:5000/

# Test API
curl http://localhost:5000/api/services
```

## Your Current Status

✓ `.env` file updated with PostgreSQL credentials
⚠ PostgreSQL needs to be installed
⚠ Database needs to be created
⚠ Schema needs to be applied
⚠ Route files need to be updated
⚠ Dependencies need to be installed

---

**Start with Step 1 above to install PostgreSQL!**
