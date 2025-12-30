-- Create Database
CREATE DATABASE IF NOT EXISTS ladies_tailor_db;
USE ladies_tailor_db;

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
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

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
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

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default admin (password: admin123)
-- Hash generated with bcrypt for 'admin123'
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2a$10$8K1p/a0dL3.I9/YS10Gusu7fUbE5.7p5.5p5.5p5.5p5.5p5.5p5.');

-- Sample Services
INSERT INTO services (title, description, price) VALUES
('Blouse Stitching', 'Custom blouse stitching with perfect fitting', 300.00),
('Saree Fall & Pico', 'Professional saree fall and pico work', 150.00),
('Churidar Stitching', 'Complete churidar set stitching', 500.00),
('Alteration Services', 'All types of dress alterations', 100.00);

-- Sample Gallery Images
INSERT INTO gallery (image_url, title) VALUES
('https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=400', 'Designer Blouse'),
('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 'Traditional Wear'),
('https://images.unsplash.com/photo-1583391733981-5babdc0b9c8c?w=400', 'Custom Stitching');

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
('Sharara Set', 'Traditional sharara set with embroidered dupatta', 3800.00, 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80', 'Sharara', 5, TRUE);
