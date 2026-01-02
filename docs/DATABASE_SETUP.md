# 🗄️ Database Setup & Verification Guide

Complete guide to set up and verify your MySQL database for Amma designs.

## 📊 Database Overview

**Database Name:** `ladies_tailor_db`

**Total Tables:** 8
1. `admins` - Admin users
2. `customers` - Customer accounts
3. `services` - Tailoring services
4. `gallery` - Gallery images
5. `contacts` - Customer enquiries
6. `products` - Shop products
7. `orders` - Customer orders
8. `order_items` - Order line items

## 🚀 Quick Setup

### Step 1: Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS ladies_tailor_db;
exit;
```

### Step 2: Import Schema
```bash
mysql -u root -p ladies_tailor_db < backend/database/schema.sql
```

### Step 3: Verify Setup
```bash
mysql -u root -p ladies_tailor_db
```

```sql
SHOW TABLES;
```

You should see 8 tables.

## 📋 Database Schema Details

### 1. Admins Table
```sql
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Store admin login credentials
**Default Admin:** 
- Username: `admin`
- Password: `admin123` (⚠️ Change this!)

### 2. Customers Table
```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Store customer accounts
**Features:**
- Unique email addresses
- Hashed passwords
- Optional phone and address

### 3. Services Table
```sql
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Tailoring services offered
**Sample Data:** 4 services pre-loaded
- Blouse Stitching (₹300)
- Saree Fall & Pico (₹150)
- Churidar Stitching (₹500)
- Alteration Services (₹100)

### 4. Gallery Table
```sql
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Gallery images
**Sample Data:** 3 images pre-loaded

### 5. Contacts Table
```sql
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Store customer enquiries from contact form

### 6. Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(50),
    stock INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** E-commerce products
**Sample Data:** 6 products pre-loaded
- Designer Blouse (₹1,200)
- Silk Saree with Blouse (₹3,500)
- Churidar Set (₹1,800)
- Embroidered Kurti (₹950)
- Lehenga Choli (₹5,500)
- Cotton Salwar Suit (₹1,100)

### 7. Orders Table
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(200),
    order_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);
```

**Purpose:** Store customer orders
**Features:**
- Unique order numbers
- Links to customers (optional)
- Razorpay payment integration
- Order and payment status tracking

### 8. Order Items Table
```sql
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Purpose:** Store individual items in each order
**Features:**
- Links to orders and products
- Cascade delete with orders

## 🔍 Verification Queries

### Check All Tables
```sql
USE ladies_tailor_db;
SHOW TABLES;
```

Expected output:
```
+----------------------------+
| Tables_in_ladies_tailor_db |
+----------------------------+
| admins                     |
| contacts                   |
| customers                  |
| gallery                    |
| order_items                |
| orders                     |
| products                   |
| services                   |
+----------------------------+
```

### Check Admin User
```sql
SELECT id, username, created_at FROM admins;
```

Expected: 1 admin user

### Check Services
```sql
SELECT id, title, price FROM services;
```

Expected: 4 services

### Check Products
```sql
SELECT id, name, price, category, stock FROM products;
```

Expected: 6 products

### Check Gallery
```sql
SELECT id, title FROM gallery;
```

Expected: 3 images

### Check Table Structures
```sql
DESCRIBE admins;
DESCRIBE customers;
DESCRIBE services;
DESCRIBE gallery;
DESCRIBE contacts;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE order_items;
```

## 🔗 Relationships

```
customers (1) -----> (many) orders
orders (1) -----> (many) order_items
products (1) -----> (many) order_items
```

**Foreign Keys:**
- `orders.customer_id` → `customers.id` (SET NULL on delete)
- `order_items.order_id` → `orders.id` (CASCADE on delete)
- `order_items.product_id` → `products.id`

## 📊 Sample Data Summary

| Table | Records | Purpose |
|-------|---------|---------|
| admins | 1 | Default admin account |
| customers | 0 | Empty (users will register) |
| services | 4 | Sample tailoring services |
| gallery | 3 | Sample gallery images |
| contacts | 0 | Empty (will fill with enquiries) |
| products | 6 | Sample shop products |
| orders | 0 | Empty (will fill with orders) |
| order_items | 0 | Empty (will fill with order details) |

## 🛠️ Useful Queries

### View All Data
```sql
-- Services
SELECT * FROM services;

-- Products
SELECT * FROM products;

-- Gallery
SELECT * FROM gallery;

-- Recent contacts
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;

-- Recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Customers
SELECT id, name, email, phone, created_at FROM customers;
```

### Statistics
```sql
-- Total products
SELECT COUNT(*) as total_products FROM products;

-- Products by category
SELECT category, COUNT(*) as count FROM products GROUP BY category;

-- Total orders
SELECT COUNT(*) as total_orders FROM orders;

-- Revenue (completed orders)
SELECT SUM(total_amount) as total_revenue 
FROM orders 
WHERE payment_status = 'completed';

-- Orders by status
SELECT order_status, COUNT(*) as count 
FROM orders 
GROUP BY order_status;
```

## 🔧 Maintenance Queries

### Clear Test Data
```sql
-- Clear contacts
TRUNCATE TABLE contacts;

-- Clear orders (will also clear order_items due to CASCADE)
TRUNCATE TABLE orders;

-- Clear customers
TRUNCATE TABLE customers;
```

### Reset Auto Increment
```sql
ALTER TABLE contacts AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
```

### Backup Database
```bash
mysqldump -u root -p ladies_tailor_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u root -p ladies_tailor_db < backup_20240101.sql
```

## 🚨 Troubleshooting

### Error: Database already exists
```sql
DROP DATABASE ladies_tailor_db;
CREATE DATABASE ladies_tailor_db;
```

### Error: Table already exists
```sql
DROP TABLE IF EXISTS table_name;
```

### Error: Foreign key constraint fails
- Ensure parent records exist before inserting child records
- Check foreign key relationships
- Disable foreign key checks temporarily:
```sql
SET FOREIGN_KEY_CHECKS = 0;
-- Your queries here
SET FOREIGN_KEY_CHECKS = 1;
```

### Error: Access denied
- Check MySQL user permissions
- Grant privileges:
```sql
GRANT ALL PRIVILEGES ON ladies_tailor_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## 🔐 Security

### Change Admin Password
```bash
cd backend
node scripts/hashPassword.js your_new_password
```

Copy the hash, then:
```sql
UPDATE admins 
SET password_hash = 'your_generated_hash' 
WHERE username = 'admin';
```

### Create Additional Admin
```sql
INSERT INTO admins (username, password_hash) 
VALUES ('newadmin', 'hash_from_script');
```

## 📈 Performance Tips

### Add Indexes
```sql
-- Index on email for faster customer lookup
CREATE INDEX idx_customer_email ON customers(email);

-- Index on order_number for faster order lookup
CREATE INDEX idx_order_number ON orders(order_number);

-- Index on category for faster product filtering
CREATE INDEX idx_product_category ON products(category);
```

### Optimize Tables
```sql
OPTIMIZE TABLE orders;
OPTIMIZE TABLE order_items;
OPTIMIZE TABLE products;
```

## ✅ Setup Checklist

- [ ] MySQL installed and running
- [ ] Database created: `ladies_tailor_db`
- [ ] Schema imported successfully
- [ ] 8 tables created
- [ ] Sample data loaded
- [ ] Admin user exists
- [ ] Can connect from backend
- [ ] Backend `.env` configured with DB credentials
- [ ] Test connection successful

## 🎯 Next Steps

1. **Update backend/.env** with your MySQL password
2. **Start backend server** to test connection
3. **Test admin login** with default credentials
4. **Change admin password** immediately
5. **Add your own products** via admin panel
6. **Update services** with your actual services
7. **Add real gallery images**

---

**Your database is ready!** All tables are created with sample data. 🎉
