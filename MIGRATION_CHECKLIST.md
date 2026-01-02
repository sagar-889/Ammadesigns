# PostgreSQL Migration Checklist

Use this checklist to ensure a smooth migration from MySQL to PostgreSQL.

## Pre-Migration

- [ ] Backup existing MySQL database
  ```bash
  mysqldump -u root -p ladies_tailor_db > mysql_backup.sql
  ```
- [ ] Document current database credentials
- [ ] Test application with MySQL to ensure it's working
- [ ] Review all custom SQL queries in the codebase
- [ ] Check for MySQL-specific features being used

## Installation

- [ ] Install PostgreSQL
  - [ ] Windows: Download from postgresql.org or use Chocolatey
  - [ ] Linux: `sudo apt install postgresql postgresql-contrib`
  - [ ] macOS: `brew install postgresql`
- [ ] Verify PostgreSQL is running
  ```bash
  psql --version
  ```
- [ ] Start PostgreSQL service
  - [ ] Linux: `sudo systemctl start postgresql`
  - [ ] macOS: `brew services start postgresql`
  - [ ] Windows: Check Services app

## Database Setup

- [ ] Connect to PostgreSQL
  ```bash
  psql -U postgres
  ```
- [ ] Create database
  ```sql
  CREATE DATABASE ladies_tailor_db;
  ```
- [ ] Connect to new database
  ```sql
  \c ladies_tailor_db
  ```
- [ ] Run PostgreSQL schema
  ```bash
  psql -U postgres -d ladies_tailor_db -f backend/database/schema_postgres.sql
  ```
- [ ] Verify tables created
  ```sql
  \dt
  ```
- [ ] Check sample data loaded
  ```sql
  SELECT COUNT(*) FROM products;
  SELECT COUNT(*) FROM services;
  ```

## Code Updates

- [ ] Update `backend/package.json`
  - [ ] Remove `mysql2` dependency
  - [ ] Add `pg` dependency
- [ ] Update `backend/config/db.js`
  - [ ] Replace MySQL connection with PostgreSQL Pool
- [ ] Create `backend/config/db-helper.js`
  - [ ] Add compatibility layer for MySQL syntax
- [ ] Update `backend/.env.example`
  - [ ] Add `DB_PORT=5432`
  - [ ] Change default user to `postgres`
- [ ] Update `backend/.env`
  - [ ] Set PostgreSQL credentials
  - [ ] Update DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

## Route File Updates

Update each route file to use db-helper:

- [ ] `backend/routes/shop.js` ✓ (already updated)
- [ ] `backend/routes/public.js`
  - [ ] Change import to use db-helper
  - [ ] Replace `pool.query(` with `pool(`
- [ ] `backend/routes/auth.js`
  - [ ] Change import to use db-helper
  - [ ] Replace `pool.query(` with `pool(`
  - [ ] Update INSERT queries to use RETURNING
  - [ ] Replace `result.insertId` with `result[0].id`
- [ ] `backend/routes/admin.js`
  - [ ] Change import to use db-helper
  - [ ] Replace `pool.query(` with `pool(`
  - [ ] Update INSERT queries to use RETURNING
  - [ ] Replace `result.insertId` with `result[0].id`
- [ ] `backend/routes/services.js` (if exists)
  - [ ] Change import to use db-helper
  - [ ] Replace `pool.query(` with `pool(`
- [ ] `backend/routes/gallery.js` (if exists)
  - [ ] Change import to use db-helper
  - [ ] Replace `pool.query(` with `pool(`
- [ ] `backend/routes/tracking.js` (if exists)
  - [ ] Change import to use db-helper
  - [ ] Replace `pool.query(` with `pool(`

**Quick Update Option:**
- [ ] Run automated update script
  ```bash
  node backend/scripts/update-routes-for-postgres.js
  ```

## Dependencies

- [ ] Install new dependencies
  ```bash
  cd backend
  npm install
  ```
- [ ] Verify `pg` package installed
  ```bash
  npm list pg
  ```
- [ ] Remove `node_modules` and reinstall if issues
  ```bash
  rm -rf node_modules
  npm install
  ```

## Data Migration (if needed)

- [ ] Export data from MySQL
  ```bash
  mysqldump -u root -p --no-create-info ladies_tailor_db > data_only.sql
  ```
- [ ] Convert MySQL dump to PostgreSQL format
  - [ ] Replace AUTO_INCREMENT with SERIAL
  - [ ] Replace backticks with double quotes
  - [ ] Fix INSERT statements
- [ ] Import data to PostgreSQL
  ```bash
  psql -U postgres -d ladies_tailor_db -f converted_data.sql
  ```
- [ ] Or use pgloader (recommended)
  ```bash
  pgloader mysql://user:pass@localhost/ladies_tailor_db \
           postgresql://postgres:pass@localhost/ladies_tailor_db
  ```

## Testing

### Database Connection
- [ ] Test PostgreSQL connection
  ```bash
  psql -U postgres -d ladies_tailor_db -c "SELECT version();"
  ```

### Application Testing
- [ ] Start the server
  ```bash
  cd backend
  npm start
  ```
- [ ] Check server logs for connection success
- [ ] Test health endpoint
  ```bash
  curl http://localhost:5000/
  ```

### API Endpoints
- [ ] Test public endpoints
  - [ ] GET `/api/services`
  - [ ] GET `/api/gallery`
  - [ ] POST `/api/contact`
- [ ] Test shop endpoints
  - [ ] GET `/api/shop/products`
  - [ ] GET `/api/shop/products/:id`
  - [ ] GET `/api/shop/categories`
- [ ] Test authentication
  - [ ] POST `/api/auth/signup`
  - [ ] POST `/api/auth/login`
  - [ ] GET `/api/auth/profile` (with token)
- [ ] Test admin endpoints (with admin token)
  - [ ] POST `/api/admin/login`
  - [ ] GET `/api/admin/products`
  - [ ] POST `/api/admin/products`
  - [ ] PUT `/api/admin/products/:id`
  - [ ] DELETE `/api/admin/products/:id`
- [ ] Test order flow
  - [ ] POST `/api/shop/create-order`
  - [ ] POST `/api/shop/verify-payment`
  - [ ] GET `/api/shop/orders/:orderNumber`

### Functionality Testing
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Product listing displays
- [ ] Product filtering works
- [ ] Shopping cart functions
- [ ] Order creation works
- [ ] Payment processing works (test mode)
- [ ] Order tracking works
- [ ] Admin dashboard loads
- [ ] Product CRUD operations work
- [ ] Service CRUD operations work
- [ ] Gallery CRUD operations work
- [ ] Order management works

## Performance Optimization

- [ ] Create indexes
  ```sql
  CREATE INDEX idx_orders_customer_id ON orders(customer_id);
  CREATE INDEX idx_order_items_order_id ON order_items(order_id);
  CREATE INDEX idx_products_category ON products(category);
  CREATE INDEX idx_customers_email ON customers(email);
  CREATE INDEX idx_customers_phone ON customers(phone);
  ```
- [ ] Analyze tables
  ```sql
  ANALYZE admins;
  ANALYZE customers;
  ANALYZE products;
  ANALYZE orders;
  ANALYZE order_items;
  ANALYZE services;
  ANALYZE gallery;
  ANALYZE contacts;
  ```
- [ ] Test query performance
  ```sql
  EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 1;
  ```

## Documentation

- [ ] Update README.md with PostgreSQL instructions
- [ ] Document new environment variables
- [ ] Update deployment documentation
- [ ] Update developer setup guide
- [ ] Document rollback procedure

## Deployment

- [ ] Update deployment scripts
- [ ] Update CI/CD pipeline
- [ ] Configure PostgreSQL on production server
- [ ] Update environment variables on production
- [ ] Test deployment in staging environment
- [ ] Plan production deployment window
- [ ] Notify team of database change

## Post-Migration

- [ ] Monitor application logs
- [ ] Check for any database errors
- [ ] Monitor query performance
- [ ] Verify all features working
- [ ] Check data integrity
- [ ] Monitor connection pool usage
- [ ] Set up database backups
  ```bash
  # Add to cron
  0 2 * * * pg_dump -U postgres ladies_tailor_db > /backup/db_$(date +\%Y\%m\%d).sql
  ```

## Cleanup

- [ ] Remove MySQL dependencies from package.json
- [ ] Archive MySQL backup files
- [ ] Update .gitignore if needed
- [ ] Remove old MySQL configuration files
- [ ] Update team documentation

## Rollback (if needed)

- [ ] Stop application
- [ ] Restore original code files
- [ ] Restore MySQL database from backup
- [ ] Update .env to MySQL credentials
- [ ] Run `npm install`
- [ ] Restart application
- [ ] Verify application working with MySQL

## Final Verification

- [ ] All tests passing
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] All features working
- [ ] Team trained on PostgreSQL
- [ ] Documentation updated
- [ ] Backup strategy in place

## Sign-off

- [ ] Developer approval
- [ ] QA approval
- [ ] DevOps approval
- [ ] Product owner approval

---

**Migration Date:** _________________

**Completed By:** _________________

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

**Issues Encountered:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

**Resolution:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
