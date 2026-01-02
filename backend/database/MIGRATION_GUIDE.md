# MySQL to PostgreSQL Migration Guide

## Overview
This guide helps you migrate the Ladies Tailor Shop database from MySQL to PostgreSQL.

## Prerequisites
- PostgreSQL 12 or higher installed
- Access to your MySQL database (for data export if needed)

## Installation Steps

### 1. Install PostgreSQL
**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember the password you set for the postgres user

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ladies_tailor_db;

# Connect to the new database
\c ladies_tailor_db

# Exit psql
\q
```

### 3. Run Schema
```bash
# Run the PostgreSQL schema
psql -U postgres -d ladies_tailor_db -f backend/database/schema_postgres.sql
```

### 4. Update Environment Variables
Update your `.env` file with PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=ladies_tailor_db
```

### 5. Install Dependencies
```bash
cd backend
npm install
```

This will install the `pg` package (PostgreSQL client) instead of `mysql2`.

### 6. Start the Server
```bash
npm start
```

## Key Differences Between MySQL and PostgreSQL

### 1. Auto-increment
- **MySQL:** `INT AUTO_INCREMENT`
- **PostgreSQL:** `SERIAL` or `BIGSERIAL`

### 2. Boolean Type
- **MySQL:** `BOOLEAN` (stored as TINYINT)
- **PostgreSQL:** `BOOLEAN` (native type)

### 3. String Concatenation
- **MySQL:** `CONCAT()`
- **PostgreSQL:** `||` operator or `CONCAT()`

### 4. LIMIT Syntax
- **MySQL:** `LIMIT offset, count`
- **PostgreSQL:** `LIMIT count OFFSET offset`

### 5. Date Functions
- **MySQL:** `NOW()`
- **PostgreSQL:** `NOW()` or `CURRENT_TIMESTAMP`

### 6. ON DUPLICATE KEY
- **MySQL:** `ON DUPLICATE KEY UPDATE`
- **PostgreSQL:** `ON CONFLICT DO UPDATE` or `ON CONFLICT DO NOTHING`

### 7. Query Results
- **MySQL (mysql2):** Returns `[rows, fields]` array
- **PostgreSQL (pg):** Returns `{ rows, fields, rowCount }` object

## Code Changes Required

### Database Query Pattern Changes

**MySQL (mysql2/promise):**
```javascript
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
```

**PostgreSQL (pg):**
```javascript
const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
const rows = result.rows;
```

### Parameter Placeholders
- **MySQL:** Uses `?` for parameters
- **PostgreSQL:** Uses `$1, $2, $3` for parameters

## Migrating Existing Data

If you have existing data in MySQL:

### Option 1: Using pg_loader (Recommended)
```bash
# Install pgloader
sudo apt install pgloader  # Linux
brew install pgloader      # macOS

# Create migration config
pgloader mysql://user:pass@localhost/ladies_tailor_db \
         postgresql://postgres:pass@localhost/ladies_tailor_db
```

### Option 2: Manual Export/Import
```bash
# Export from MySQL
mysqldump -u root -p ladies_tailor_db > backup.sql

# Convert MySQL dump to PostgreSQL format (manual editing required)
# Then import to PostgreSQL
psql -U postgres -d ladies_tailor_db -f converted_backup.sql
```

## Verification

After migration, verify the setup:

```bash
# Connect to PostgreSQL
psql -U postgres -d ladies_tailor_db

# List tables
\dt

# Check table structure
\d admins
\d customers
\d orders

# Count records
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM services;

# Exit
\q
```

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL service is running
- Check `pg_hba.conf` for authentication settings
- Verify firewall settings

### Permission Issues
```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE ladies_tailor_db TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### Port Conflicts
- PostgreSQL default port: 5432
- MySQL default port: 3306
- Update `DB_PORT` in `.env` if using non-standard port

## Performance Tips

1. **Create Indexes:**
```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
```

2. **Enable Query Logging (Development):**
```sql
ALTER DATABASE ladies_tailor_db SET log_statement = 'all';
```

3. **Connection Pooling:**
The `pg` package already uses connection pooling (configured in `config/db.js`).

## Rollback Plan

If you need to rollback to MySQL:
1. Keep your MySQL database backup
2. Restore the original `package.json`, `config/db.js`, and `.env` files
3. Run `npm install` to reinstall MySQL dependencies
4. Restart the server

## Support

For issues specific to:
- **PostgreSQL:** https://www.postgresql.org/docs/
- **pg (Node.js driver):** https://node-postgres.com/
- **Migration tools:** https://pgloader.io/
