# Migration Architecture Overview

## Before Migration (MySQL)

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  shop.js │  │ admin.js │  │  auth.js │  │ public.js│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │   db.js        │
                  │  (mysql2)      │
                  └────────┬───────┘
                           │
                           ▼
                  ┌────────────────┐
                  │     MySQL      │
                  │   Database     │
                  │   Port: 3306   │
                  └────────────────┘
```

## After Migration (PostgreSQL)

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  shop.js │  │ admin.js │  │  auth.js │  │ public.js│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  db-helper.js  │
                  │  (Compatibility)│
                  │  ? → $1, $2    │
                  └────────┬───────┘
                           │
                           ▼
                  ┌────────────────┐
                  │   db.js        │
                  │     (pg)       │
                  └────────┬───────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  PostgreSQL    │
                  │   Database     │
                  │   Port: 5432   │
                  └────────────────┘
```

## Migration Flow

```
┌─────────────────┐
│  Start          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Install         │
│ PostgreSQL      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create Database │
│ & Run Schema    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update          │
│ package.json    │
│ (mysql2 → pg)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update          │
│ db.js Config    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create          │
│ db-helper.js    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Route    │
│ Files           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ npm install     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Test & Verify   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Complete! ✓    │
└─────────────────┘
```

## Database Schema Comparison

### MySQL Schema
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### PostgreSQL Schema
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Query Transformation

### MySQL Query
```javascript
const [rows] = await pool.query(
  'SELECT * FROM orders WHERE customer_id = ?',
  [customerId]
);
```

### PostgreSQL Query (Native)
```javascript
const result = await pool.query(
  'SELECT * FROM orders WHERE customer_id = $1',
  [customerId]
);
const rows = result.rows;
```

### PostgreSQL Query (With db-helper)
```javascript
const [rows] = await pool(
  'SELECT * FROM orders WHERE customer_id = ?',
  [customerId]
);
// db-helper converts ? to $1 automatically!
```

## File Structure

```
webapp/
├── backend/
│   ├── config/
│   │   ├── db.js                    ← Modified (PostgreSQL)
│   │   └── db-helper.js             ← New (Compatibility)
│   ├── database/
│   │   ├── schema.sql               ← Old (MySQL)
│   │   ├── schema_postgres.sql      ← New (PostgreSQL)
│   │   ├── complete_schema.sql      ← Old (MySQL)
│   │   └── MIGRATION_GUIDE.md       ← New (Guide)
│   ├── routes/
│   │   ├── shop.js                  ← Modified
│   │   ├── admin.js                 ← Needs update
│   │   ├── auth.js                  ← Needs update
│   │   ├── public.js                ← Needs update
│   │   ├── services.js              ← Needs update
│   │   ├── gallery.js               ← Needs update
│   │   └── tracking.js              ← Needs update
│   ├── scripts/
│   │   ├── setup-postgres.bat       ← New (Windows)
│   │   ├── setup-postgres.sh        ← New (Linux/Mac)
│   │   └── update-routes-for-postgres.js ← New (Updater)
│   ├── package.json                 ← Modified
│   └── .env.example                 ← Modified
├── docs/
│   └── (existing documentation)
├── README_POSTGRES_MIGRATION.md     ← New (Main guide)
├── POSTGRES_MIGRATION_README.md     ← New (Detailed)
├── MIGRATION_SUMMARY.md             ← New (Overview)
├── MIGRATION_CHECKLIST.md           ← New (Checklist)
├── POSTGRES_QUICK_REFERENCE.md      ← New (Quick ref)
├── MYSQL_VS_POSTGRES.md             ← New (Comparison)
└── MIGRATION_ARCHITECTURE.md        ← This file
```

## Data Flow

### Before (MySQL)
```
Client Request
     ↓
Express Route
     ↓
pool.query('SELECT * FROM users WHERE id = ?', [id])
     ↓
mysql2 driver
     ↓
MySQL Database (Port 3306)
     ↓
Returns [rows, fields]
     ↓
Response to Client
```

### After (PostgreSQL with db-helper)
```
Client Request
     ↓
Express Route
     ↓
pool('SELECT * FROM users WHERE id = ?', [id])
     ↓
db-helper.js (converts ? to $1)
     ↓
db.js (pg Pool)
     ↓
pg driver
     ↓
PostgreSQL Database (Port 5432)
     ↓
Returns { rows, fields, rowCount }
     ↓
db-helper converts to [rows, fields]
     ↓
Response to Client
```

## Connection Pool Architecture

### MySQL Connection Pool
```
┌─────────────────────────────────────┐
│      mysql2.createPool()            │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Conn1│ │Conn2│ │Conn3│ │...10│  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│                                     │
│  waitForConnections: true           │
│  connectionLimit: 10                │
│  queueLimit: 0                      │
└─────────────────────────────────────┘
```

### PostgreSQL Connection Pool
```
┌─────────────────────────────────────┐
│         new Pool()                  │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Conn1│ │Conn2│ │Conn3│ │...10│  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│                                     │
│  max: 10                            │
│  idleTimeoutMillis: 30000           │
│  connectionTimeoutMillis: 2000      │
└─────────────────────────────────────┘
```

## Environment Configuration

### Before (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=ladies_tailor_db
```

### After (.env)
```
DB_HOST=localhost
DB_PORT=5432              ← New
DB_USER=postgres          ← Changed
DB_PASSWORD=password
DB_NAME=ladies_tailor_db
```

## Deployment Architecture

### Development
```
┌──────────────┐
│  Developer   │
│   Machine    │
│              │
│ PostgreSQL   │
│ localhost    │
│ Port: 5432   │
└──────────────┘
```

### Production Options

#### Option 1: Self-Hosted
```
┌──────────────┐      ┌──────────────┐
│  App Server  │─────▶│  PostgreSQL  │
│  (Node.js)   │      │    Server    │
│  Port: 5000  │      │  Port: 5432  │
└──────────────┘      └──────────────┘
```

#### Option 2: Cloud Database
```
┌──────────────┐      ┌──────────────┐
│  App Server  │─────▶│   AWS RDS    │
│  (Railway/   │      │  PostgreSQL  │
│   Render)    │      │              │
└──────────────┘      └──────────────┘
```

#### Option 3: Managed Platform
```
┌──────────────┐      ┌──────────────┐
│   Vercel     │─────▶│   Supabase   │
│  (Frontend)  │      │  PostgreSQL  │
└──────────────┘      └──────────────┘
       │
       ▼
┌──────────────┐
│   Railway    │
│  (Backend)   │
└──────────────┘
```

## Migration Timeline

```
Day 1: Preparation
├── Install PostgreSQL
├── Review documentation
└── Backup MySQL database

Day 2: Database Setup
├── Create PostgreSQL database
├── Run schema
└── Verify tables created

Day 3: Code Updates
├── Update package.json
├── Update db.js
├── Create db-helper.js
└── Update route files

Day 4: Testing
├── Test all endpoints
├── Verify data integrity
└── Performance testing

Day 5: Deployment
├── Update production config
├── Deploy to staging
├── Final testing
└── Deploy to production
```

## Rollback Strategy

```
Issue Detected
     ↓
Stop Application
     ↓
Restore Original Files
├── package.json
├── db.js
├── .env
└── route files
     ↓
Restore MySQL Database
     ↓
npm install
     ↓
Restart Application
     ↓
Verify Working
```

## Success Metrics

```
✓ Database Connection: Working
✓ Query Performance: Improved
✓ Data Integrity: Maintained
✓ All Tests: Passing
✓ API Endpoints: Functional
✓ Error Rate: < 0.1%
✓ Response Time: < 200ms
```

## Key Benefits

```
┌─────────────────────────────────────┐
│         PostgreSQL Benefits         │
├─────────────────────────────────────┤
│ ✓ Better Performance                │
│ ✓ Advanced Features                 │
│ ✓ Superior Data Integrity           │
│ ✓ Better Concurrency                │
│ ✓ More Scalable                     │
│ ✓ Standards Compliant               │
│ ✓ Better JSON Support               │
│ ✓ Advanced Indexing                 │
└─────────────────────────────────────┘
```

---

**This architecture provides a clear visual representation of the migration process and the new system structure.**
