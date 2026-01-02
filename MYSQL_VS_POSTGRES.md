# MySQL vs PostgreSQL: Side-by-Side Comparison

## Connection Setup

### MySQL
```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### PostgreSQL
```javascript
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Query Execution

### MySQL
```javascript
// Returns [rows, fields]
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
const [result] = await pool.query('INSERT INTO users (name) VALUES (?)', [name]);
const userId = result.insertId;
```

### PostgreSQL (Native)
```javascript
// Returns { rows, fields, rowCount }
const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
const rows = result.rows;

const insertResult = await pool.query(
  'INSERT INTO users (name) VALUES ($1) RETURNING id', 
  [name]
);
const userId = insertResult.rows[0].id;
```

### PostgreSQL (With db-helper)
```javascript
// Same as MySQL!
const [rows] = await pool('SELECT * FROM users WHERE id = ?', [id]);
const [result] = await pool('INSERT INTO users (name) VALUES (?) RETURNING id', [name]);
const userId = result[0].id;
```

## Schema Definitions

### MySQL
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### PostgreSQL
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Data Types

| MySQL | PostgreSQL | Notes |
|-------|------------|-------|
| `INT AUTO_INCREMENT` | `SERIAL` | Auto-incrementing integer |
| `BIGINT AUTO_INCREMENT` | `BIGSERIAL` | Auto-incrementing big integer |
| `TINYINT(1)` | `BOOLEAN` | Boolean type |
| `VARCHAR(n)` | `VARCHAR(n)` | Variable character |
| `TEXT` | `TEXT` | Long text |
| `DATETIME` | `TIMESTAMP` | Date and time |
| `DECIMAL(10,2)` | `DECIMAL(10,2)` | Fixed precision |
| `BLOB` | `BYTEA` | Binary data |
| `JSON` | `JSON` or `JSONB` | JSON data (JSONB is binary, faster) |

## Query Syntax Differences

### Parameter Placeholders
```sql
-- MySQL
SELECT * FROM users WHERE id = ? AND status = ?

-- PostgreSQL
SELECT * FROM users WHERE id = $1 AND status = $2
```

### LIMIT and OFFSET
```sql
-- MySQL
SELECT * FROM users LIMIT 10, 20;  -- Skip 10, take 20

-- PostgreSQL
SELECT * FROM users LIMIT 20 OFFSET 10;  -- Take 20, skip 10
```

### String Concatenation
```sql
-- MySQL
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;

-- PostgreSQL (both work)
SELECT first_name || ' ' || last_name AS full_name FROM users;
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;
```

### Case-Insensitive Search
```sql
-- MySQL
SELECT * FROM users WHERE name LIKE '%john%';

-- PostgreSQL (case-sensitive by default)
SELECT * FROM users WHERE name ILIKE '%john%';  -- Case-insensitive
SELECT * FROM users WHERE name LIKE '%john%';   -- Case-sensitive
```

### Upsert (Insert or Update)
```sql
-- MySQL
INSERT INTO users (id, name, email) 
VALUES (1, 'John', 'john@example.com')
ON DUPLICATE KEY UPDATE name = 'John', email = 'john@example.com';

-- PostgreSQL
INSERT INTO users (id, name, email) 
VALUES (1, 'John', 'john@example.com')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, email = EXCLUDED.email;
```

### Get Last Insert ID
```sql
-- MySQL
INSERT INTO users (name) VALUES ('John');
SELECT LAST_INSERT_ID();

-- PostgreSQL
INSERT INTO users (name) VALUES ('John') RETURNING id;
```

### Date Functions
```sql
-- MySQL
SELECT NOW(), CURDATE(), CURTIME();
SELECT DATE_ADD(NOW(), INTERVAL 1 DAY);

-- PostgreSQL
SELECT NOW(), CURRENT_DATE, CURRENT_TIME;
SELECT NOW() + INTERVAL '1 day';
```

## Common Operations

### Create Database
```sql
-- MySQL
CREATE DATABASE ladies_tailor_db;
USE ladies_tailor_db;

-- PostgreSQL
CREATE DATABASE ladies_tailor_db;
\c ladies_tailor_db
```

### Show Tables
```sql
-- MySQL
SHOW TABLES;

-- PostgreSQL
\dt
-- or
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Describe Table
```sql
-- MySQL
DESCRIBE users;
-- or
SHOW COLUMNS FROM users;

-- PostgreSQL
\d users
-- or
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';
```

### Create Index
```sql
-- MySQL
CREATE INDEX idx_email ON users(email);

-- PostgreSQL (same)
CREATE INDEX idx_email ON users(email);
```

### Drop Table
```sql
-- MySQL
DROP TABLE IF EXISTS users;

-- PostgreSQL (same)
DROP TABLE IF EXISTS users;
```

## Transaction Handling

### MySQL
```javascript
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();
  await connection.query('INSERT INTO users (name) VALUES (?)', ['John']);
  await connection.query('INSERT INTO orders (user_id) VALUES (?)', [1]);
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```

### PostgreSQL
```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users (name) VALUES ($1)', ['John']);
  await client.query('INSERT INTO orders (user_id) VALUES ($1)', [1]);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Command Line Tools

### MySQL
```bash
# Connect
mysql -u root -p

# Execute query
mysql -u root -p -e "SELECT * FROM users;"

# Import SQL file
mysql -u root -p database_name < file.sql

# Export database
mysqldump -u root -p database_name > backup.sql

# Show databases
mysql -u root -p -e "SHOW DATABASES;"
```

### PostgreSQL
```bash
# Connect
psql -U postgres

# Execute query
psql -U postgres -d database_name -c "SELECT * FROM users;"

# Import SQL file
psql -U postgres -d database_name -f file.sql

# Export database
pg_dump -U postgres database_name > backup.sql

# Show databases
psql -U postgres -l
```

## Environment Variables

### MySQL
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=ladies_tailor_db
```

### PostgreSQL
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=ladies_tailor_db
```

## Performance Considerations

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| **Read Performance** | Excellent for simple queries | Excellent for complex queries |
| **Write Performance** | Very fast | Fast, with better concurrency |
| **Concurrency** | Table-level locking | Row-level locking (better) |
| **Full-text Search** | Built-in | Built-in (more powerful) |
| **JSON Support** | Basic | Advanced (JSONB) |
| **Replication** | Master-slave | Master-slave, streaming |
| **Partitioning** | Supported | Better support |
| **Window Functions** | Limited | Extensive |
| **CTEs (WITH)** | Supported | Better support |

## Advantages

### MySQL Advantages
- Simpler setup
- Faster for simple read operations
- More hosting providers support it
- Larger community
- Better for web applications with simple queries

### PostgreSQL Advantages
- Better for complex queries
- Superior data integrity
- Advanced features (arrays, JSON, full-text search)
- Better concurrency handling
- More SQL standard compliant
- Better for analytical queries
- Superior indexing options
- Better for large datasets

## Migration Path

### From MySQL to PostgreSQL
1. Export MySQL schema and data
2. Convert schema (AUTO_INCREMENT → SERIAL, etc.)
3. Convert data (if needed)
4. Update application code (placeholders, query results)
5. Test thoroughly
6. Deploy

### Tools for Migration
- **pgloader** - Automated migration tool (recommended)
- **AWS DMS** - For AWS deployments
- **Manual** - Export/convert/import

## Best Practices

### MySQL
- Use prepared statements
- Enable query cache
- Optimize indexes
- Use connection pooling
- Monitor slow query log

### PostgreSQL
- Use prepared statements
- Analyze tables regularly
- Optimize indexes
- Use connection pooling
- Monitor pg_stat_statements
- Use EXPLAIN ANALYZE for query optimization

## Conclusion

Both databases are excellent choices. PostgreSQL offers:
- Better standards compliance
- More advanced features
- Better for complex applications
- Superior data integrity

MySQL offers:
- Simpler setup
- Faster for simple operations
- Wider hosting support

For the Ladies Tailor Shop application, PostgreSQL provides:
- Better scalability
- More robust transaction handling
- Advanced querying capabilities
- Better for future growth

---

**Recommendation:** PostgreSQL is the better choice for this application due to its robustness, advanced features, and better handling of complex queries that may be needed as the application grows.
