-- ============================================
-- PostgreSQL Database Schema
-- Ladies Tailor Shop Management System
-- ============================================

-- Create Database (run this separately as postgres superuser)
-- CREATE DATABASE ladies_tailor_db;
-- \c ladies_tailor_db;

-- ============================================
-- TABLES
-- ============================================

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(50),
    stock INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table (with shipping columns)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_state VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    shipping_charges DECIMAL(10, 2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(200),
    order_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default admin (password: admin123)
-- Note: This is a placeholder hash, should be updated with proper bcrypt hash
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2a$10$8K1p/a0dL3.I9/YS10Gusu7fUbE5.7p5.5p5.5p5.5p5.5p5.5p5.')
ON CONFLICT (username) DO NOTHING;

-- Sample Services
INSERT INTO services (title, description, price) VALUES
('Blouse Stitching', 'Custom blouse stitching with perfect fitting', 300.00),
('Saree Fall & Pico', 'Professional saree fall and pico work', 150.00),
('Churidar Stitching', 'Complete churidar set stitching', 500.00),
('Alteration Services', 'All types of dress alterations', 100.00)
ON CONFLICT DO NOTHING;

-- Sample Gallery Images
INSERT INTO gallery (image_url, title) VALUES
('https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=400', 'Designer Blouse'),
('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 'Traditional Wear'),
('https://images.unsplash.com/photo-1583391733981-5babdc0b9c8c?w=400', 'Custom Stitching')
ON CONFLICT DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, price, image_url, category, stock, is_available) VALUES
('Designer Blouse', 'Elegant designer blouse with intricate embroidery work', 1200.00, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Blouses', 10, TRUE),
('Silk Saree with Blouse', 'Premium silk saree with matching blouse piece', 3500.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Sarees', 5, TRUE),
('Churidar Set', 'Complete churidar set with dupatta', 1800.00, 'https://images.unsplash.com/photo-1583391733981-5babdc0b9c8c?w=800&q=80', 'Churidar', 8, TRUE),
('Embroidered Kurti', 'Beautiful embroidered kurti for casual wear', 950.00, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80', 'Kurtis', 15, TRUE),
('Lehenga Choli', 'Traditional lehenga choli for special occasions', 5500.00, 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80', 'Lehenga', 3, TRUE),
('Cotton Salwar Suit', 'Comfortable cotton salwar suit for daily wear', 1100.00, 'https://images.unsplash.com/photo-1610030469829-1e71d6d79f2f?w=800&q=80', 'Salwar', 12, TRUE),
('Anarkali Dress', 'Stunning anarkali dress with mirror work', 2800.00, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80', 'Anarkali', 6, TRUE),
('Palazzo Set', 'Trendy palazzo set with printed top', 1350.00, 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80', 'Palazzo', 10, TRUE),
('Banarasi Saree', 'Handwoven Banarasi silk saree with golden zari', 6500.00, 'https://images.unsplash.com/photo-1610030469964-e7a0e23e2b1f?w=800&q=80', 'Sarees', 4, TRUE),
('Party Wear Gown', 'Elegant party wear gown with sequin work', 4200.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', 'Gowns', 5, TRUE),
('Printed Kurti', 'Vibrant printed kurti perfect for summer', 750.00, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Kurtis', 20, TRUE),
('Bridal Lehenga', 'Exquisite bridal lehenga with heavy embroidery', 15000.00, 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80', 'Lehenga', 2, TRUE),
('Georgette Saree', 'Lightweight georgette saree with floral print', 2200.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Sarees', 8, TRUE),
('Velvet Blouse', 'Luxurious velvet blouse with stone work', 1500.00, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 'Blouses', 7, TRUE),
('Indo-Western Dress', 'Fusion indo-western dress for modern look', 3200.00, 'https://images.unsplash.com/photo-1583391733981-5babdc0b9c8c?w=800&q=80', 'Indo-Western', 6, TRUE),
('Sharara Set', 'Traditional sharara set with embroidered dupatta', 3800.00, 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80', 'Sharara', 5, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count records in each table
SELECT 'admins' as table_name, COUNT(*) as record_count FROM admins
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'gallery', COUNT(*) FROM gallery
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;
