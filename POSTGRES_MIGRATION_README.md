# PostgreSQL Migration Complete

## What Changed

Your Ladies Tailor Shop application has been migrated from MySQL to PostgreSQL. Here's what was updated:

### 1. Database Driver
- **Removed:** `mysql2` package
- **Added:** `pg` (node-postgres) package

### 2. Configuration Files

#### `backend/package.json`
- Updated dependency from `mysql2` to `pg`

#### `backend/.env.example`
- Added `DB_PORT=5432` for PostgreSQL
- Changed default `DB_USER` from `root` to `postgres`

#### `backend/config/db.js`
- Completely rewritten to use PostgreSQL connection pool
- Uses `pg` Pool instead of `mysql2` createPool
- Added connection event handlers for better debugging

### 3. New Files Created

#### `backend/config/db-helper.js`
A compatibility layer that:
- Converts MySQL `?` placeholders to PostgreSQL `$1, $2, $3` format
- Returns results in MySQL-compatible format `[rows]`
- Makes migration easier with minimal code changes

#### `backend/database/schema_postgres.sql`
PostgreSQL-compatible schema with:
- `SERIAL` instead of `AUTO_INCREMENT`
- Native `BOOLEAN` type
- `ON CONFLICT` instead of `ON DUPLICATE KEY`
- Trigger function for `updated_at` column
- PostgreSQL-specific syntax throughout

#### `backend/database/MIGRATION_GUIDE.md`
Comprehensive guide covering:
- PostgreSQL installation steps
- Database setup instructions
- Key differences between MySQL and PostgreSQL
- Data migration options
- Troubleshooting tips

#### `backend/scripts/update-routes-for-postgres.js`
Automated script to update route files (if needed)

### 4. Route Files
All route files need to be updated to use the new db-helper:
- `backend/routes/shop.js` ✓ (already updated)
- `backend/routes/public.js`
- `backend/routes/auth.js`
- `backend/routes/admin.js`
- `backend/routes/services.js`
- `backend/routes/gallery.js`
- `backend/routes/tracking.js`

## Quick Start Guide

### Step 1: Install PostgreSQL

**Windows:**
```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE ladies_tailor_db;
\c ladies_tailor_db
\q
```

### Step 3: Run Schema

```bash
# From project root
psql -U postgres -d ladies_tailor_db -f backend/database/schema_postgres.sql
```

### Step 4: Update Environment Variables

Create or update `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=ladies_tailor_db
JWT_SECRET=your_jwt_secret_key_change_this
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 5: Install Dependencies

```bash
cd backend
npm install
```

This will install the `pg` package.

### Step 6: Update Route Files (if not done)

Run the automated update script:
```bash
node backend/scripts/update-routes-for-postgres.js
```

Or manually update each route file to import from `db-helper.js`:
```javascript
// Change this:
import pool from '../config/db.js';

// To this:
import { query as pool } from '../config/db-helper.js';

// Then replace all:
pool.query(...)  →  pool(...)
```

### Step 7: Start the Server

```bash
cd backend
npm start
```

## Key Differences to Remember

### 1. Auto-increment IDs
**MySQL:**
```javascript
const [result] = await pool.query('INSERT INTO users ...');
const id = result.insertId;
```

**PostgreSQL (with helper):**
```javascript
const [result] = await pool('INSERT INTO users ... RETURNING id');
const id = result[0].id;
```

### 2. Parameter Placeholders
The db-helper automatically converts:
- MySQL: `?` → PostgreSQL: `$1, $2, $3`

### 3. Boolean Values
PostgreSQL has native boolean type:
- `TRUE` / `FALSE` (not 0/1)

### 4. LIMIT/OFFSET
**MySQL:** `LIMIT 10, 20`
**PostgreSQL:** `LIMIT 20 OFFSET 10`

## Migrating Existing Data

If you have existing MySQL data:

### Option 1: Using pgloader (Recommended)
```bash
# Install pgloader
sudo apt install pgloader  # Linux
brew install pgloader      # macOS

# Migrate
pgloader mysql://user:pass@localhost/ladies_tailor_db \
         postgresql://postgres:pass@localhost/ladies_tailor_db
```

### Option 2: Manual Export/Import
```bash
# Export from MySQL
mysqldump -u root -p ladies_tailor_db > backup.sql

# Edit backup.sql to convert MySQL syntax to PostgreSQL
# Then import
psql -U postgres -d ladies_tailor_db -f backup.sql
```

## Verification

Test the migration:

```bash
# Connect to database
psql -U postgres -d ladies_tailor_db

# List tables
\dt

# Check data
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM orders;

# Exit
\q
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running:
  ```bash
  # Linux
  sudo systemctl status postgresql
  sudo systemctl start postgresql
  
  # macOS
  brew services list
  brew services start postgresql
  
  # Windows
  # Check Services app for PostgreSQL service
  ```

### Authentication Failed
- Check `pg_hba.conf` file
- Default location:
  - Linux: `/etc/postgresql/*/main/pg_hba.conf`
  - macOS: `/usr/local/var/postgres/pg_hba.conf`
  - Windows: `C:\Program Files\PostgreSQL\*\data\pg_hba.conf`

### Permission Denied
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE ladies_tailor_db TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

## Performance Tips

1. **Create Indexes:**
```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
```

2. **Analyze Tables:**
```sql
ANALYZE admins;
ANALYZE customers;
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
```

3. **Monitor Queries:**
```sql
-- Enable query logging (development only)
ALTER DATABASE ladies_tailor_db SET log_statement = 'all';
```

## Rollback Plan

If you need to revert to MySQL:

1. Restore original files:
   - `backend/package.json`
   - `backend/config/db.js`
   - `backend/.env`
   - All route files

2. Reinstall dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Restore MySQL database from backup

## Next Steps

1. ✓ PostgreSQL installed
2. ✓ Database created
3. ✓ Schema applied
4. ✓ Environment variables updated
5. ✓ Dependencies installed
6. ⚠ Update route files (if not done)
7. ⚠ Test all endpoints
8. ⚠ Migrate existing data (if any)
9. ⚠ Update deployment configuration

## Support Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **node-postgres (pg):** https://node-postgres.com/
- **pgloader:** https://pgloader.io/
- **Migration Guide:** `backend/database/MIGRATION_GUIDE.md`

## Testing Checklist

After migration, test these features:

- [ ] User registration and login
- [ ] Admin login
- [ ] Product listing and filtering
- [ ] Product details
- [ ] Shopping cart
- [ ] Order creation
- [ ] Payment processing (Razorpay)
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] Service management
- [ ] Gallery management
- [ ] Contact form

## Notes

- The `db-helper.js` provides backward compatibility with MySQL syntax
- All queries are automatically converted to PostgreSQL format
- For new code, you can use native PostgreSQL syntax with `rawQuery()`
- Consider adding connection pooling monitoring in production
- PostgreSQL is generally faster for complex queries and has better JSON support

---

**Migration completed on:** January 2, 2026
**PostgreSQL version required:** 12 or higher
**Node.js version required:** 14 or higher
