# PostgreSQL Quick Reference

## Installation

### Windows
```cmd
# Download installer from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### macOS
```bash
brew install postgresql
brew services start postgresql
```

## Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ladies_tailor_db;

# Connect to database
\c ladies_tailor_db

# Run schema
\i /path/to/backend/database/schema_postgres.sql

# Exit
\q
```

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ladies_tailor_db
```

## Common psql Commands

```bash
# Connect to database
psql -U postgres -d ladies_tailor_db

# List databases
\l

# List tables
\dt

# Describe table
\d table_name

# Show table data
SELECT * FROM table_name;

# Count records
SELECT COUNT(*) FROM table_name;

# Exit
\q
```

## Code Changes

### Import Statement
```javascript
// OLD (MySQL)
import pool from '../config/db.js';

// NEW (PostgreSQL with helper)
import { query as pool } from '../config/db-helper.js';
```

### Query Execution
```javascript
// OLD (MySQL)
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

// NEW (PostgreSQL with helper - same syntax!)
const [rows] = await pool('SELECT * FROM users WHERE id = ?', [id]);
```

### INSERT with ID Return
```javascript
// OLD (MySQL)
const [result] = await pool.query('INSERT INTO users (name) VALUES (?)', [name]);
const id = result.insertId;

// NEW (PostgreSQL with helper)
const [result] = await pool('INSERT INTO users (name) VALUES (?) RETURNING id', [name]);
const id = result[0].id;
```

## SQL Syntax Differences

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Auto-increment | `INT AUTO_INCREMENT` | `SERIAL` or `BIGSERIAL` |
| Boolean | `BOOLEAN` (stored as TINYINT) | `BOOLEAN` (native) |
| String concat | `CONCAT(a, b)` | `a \|\| b` or `CONCAT(a, b)` |
| Limit/Offset | `LIMIT 10, 20` | `LIMIT 20 OFFSET 10` |
| Upsert | `ON DUPLICATE KEY UPDATE` | `ON CONFLICT DO UPDATE` |
| Current time | `NOW()` | `NOW()` or `CURRENT_TIMESTAMP` |
| Case insensitive | `LIKE` | `ILIKE` |

## Useful Queries

### Check Connection
```sql
SELECT version();
```

### List All Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Table Row Counts
```sql
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

### Create Index
```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_products_category ON products(category);
```

### Grant Permissions
```sql
GRANT ALL PRIVILEGES ON DATABASE ladies_tailor_db TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

## Troubleshooting

### Connection Refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS

# Start PostgreSQL
sudo systemctl start postgresql   # Linux
brew services start postgresql    # macOS
```

### Authentication Failed
```bash
# Edit pg_hba.conf
# Linux: /etc/postgresql/*/main/pg_hba.conf
# macOS: /usr/local/var/postgres/pg_hba.conf
# Windows: C:\Program Files\PostgreSQL\*\data\pg_hba.conf

# Change authentication method to 'md5' or 'trust'
# Then restart PostgreSQL
sudo systemctl restart postgresql
```

### Reset Password
```bash
# Connect as postgres user
sudo -u postgres psql

# Change password
ALTER USER postgres PASSWORD 'new_password';
```

## Performance Tips

### Analyze Tables
```sql
ANALYZE users;
ANALYZE products;
ANALYZE orders;
```

### Vacuum Database
```sql
VACUUM ANALYZE;
```

### Check Query Performance
```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 1;
```

## Backup & Restore

### Backup
```bash
# Backup entire database
pg_dump -U postgres ladies_tailor_db > backup.sql

# Backup with compression
pg_dump -U postgres -Fc ladies_tailor_db > backup.dump
```

### Restore
```bash
# Restore from SQL file
psql -U postgres -d ladies_tailor_db < backup.sql

# Restore from compressed dump
pg_restore -U postgres -d ladies_tailor_db backup.dump
```

## Migration Commands

### Run Setup Script
```bash
# Windows
cd backend\scripts
setup-postgres.bat

# Linux/macOS
cd backend/scripts
chmod +x setup-postgres.sh
./setup-postgres.sh
```

### Update Route Files
```bash
cd backend
node scripts/update-routes-for-postgres.js
```

### Install Dependencies
```bash
cd backend
npm install
```

### Start Server
```bash
npm start
```

## Connection String Format

```
postgresql://username:password@host:port/database

# Example
postgresql://postgres:mypassword@localhost:5432/ladies_tailor_db
```

## Useful Links

- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **node-postgres:** https://node-postgres.com/
- **pgAdmin (GUI):** https://www.pgadmin.org/
- **DBeaver (GUI):** https://dbeaver.io/

## Quick Test

```bash
# Test connection
psql -U postgres -d ladies_tailor_db -c "SELECT COUNT(*) FROM products;"

# Test server
curl http://localhost:5000/api/services
```

---

**Keep this file handy for quick reference during development!**
