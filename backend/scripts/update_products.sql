-- Update Products with Sample Images
-- Run this script to add sample products with images to your database
-- Usage: mysql -u root -p ladies_tailor_db < backend/scripts/update_products.sql

USE ladies_tailor_db;

-- Clear existing products (optional - comment out if you want to keep existing products)
DELETE FROM order_items;
DELETE FROM products;

-- Reset auto increment
ALTER TABLE products AUTO_INCREMENT = 1;

-- Insert sample products with reliable placeholder images
INSERT INTO products (name, description, price, image_url, category, stock, is_available) VALUES
('Designer Blouse', 'Elegant designer blouse with intricate embroidery work', 1200.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Designer+Blouse', 'Blouses', 10, TRUE),
('Silk Saree with Blouse', 'Premium silk saree with matching blouse piece', 3500.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Silk+Saree', 'Sarees', 5, TRUE),
('Churidar Set', 'Complete churidar set with dupatta', 1800.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Churidar+Set', 'Churidar', 8, TRUE),
('Embroidered Kurti', 'Beautiful embroidered kurti for casual wear', 950.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Embroidered+Kurti', 'Kurtis', 15, TRUE),
('Lehenga Choli', 'Traditional lehenga choli for special occasions', 5500.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Lehenga+Choli', 'Lehenga', 3, TRUE),
('Cotton Salwar Suit', 'Comfortable cotton salwar suit for daily wear', 1100.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Salwar+Suit', 'Salwar', 12, TRUE),
('Anarkali Dress', 'Stunning anarkali dress with mirror work', 2800.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Anarkali+Dress', 'Anarkali', 6, TRUE),
('Palazzo Set', 'Trendy palazzo set with printed top', 1350.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Palazzo+Set', 'Palazzo', 10, TRUE),
('Banarasi Saree', 'Handwoven Banarasi silk saree with golden zari', 6500.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Banarasi+Saree', 'Sarees', 4, TRUE),
('Party Wear Gown', 'Elegant party wear gown with sequin work', 4200.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Party+Gown', 'Gowns', 5, TRUE),
('Printed Kurti', 'Vibrant printed kurti perfect for summer', 750.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Printed+Kurti', 'Kurtis', 20, TRUE),
('Bridal Lehenga', 'Exquisite bridal lehenga with heavy embroidery', 15000.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Bridal+Lehenga', 'Lehenga', 2, TRUE),
('Georgette Saree', 'Lightweight georgette saree with floral print', 2200.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Georgette+Saree', 'Sarees', 8, TRUE),
('Velvet Blouse', 'Luxurious velvet blouse with stone work', 1500.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Velvet+Blouse', 'Blouses', 7, TRUE),
('Indo-Western Dress', 'Fusion indo-western dress for modern look', 3200.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Indo+Western', 'Indo-Western', 6, TRUE),
('Sharara Set', 'Traditional sharara set with embroidered dupatta', 3800.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Sharara+Set', 'Sharara', 5, TRUE),
('Floral Maxi Dress', 'Elegant floral maxi dress for evening wear', 2100.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Maxi+Dress', 'Dresses', 9, TRUE),
('Embellished Dupatta', 'Designer dupatta with heavy embellishment', 850.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Dupatta', 'Accessories', 15, TRUE),
('Silk Blouse', 'Pure silk blouse with traditional design', 1350.00, 'https://placehold.co/800x800/e0c097/1B263B?text=Silk+Blouse', 'Blouses', 11, TRUE),
('Festive Lehenga', 'Colorful festive lehenga with mirror work', 7200.00, 'https://placehold.co/800x800/f5f3f0/1B263B?text=Festive+Lehenga', 'Lehenga', 4, TRUE);

SELECT 'Products updated successfully!' AS message;
SELECT COUNT(*) AS total_products FROM products;
