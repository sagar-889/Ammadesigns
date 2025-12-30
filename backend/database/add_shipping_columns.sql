-- Add shipping charges and subtotal columns to orders table
USE ladies_tailor_db;

ALTER TABLE orders 
ADD COLUMN subtotal DECIMAL(10, 2) DEFAULT 0 AFTER total_amount,
ADD COLUMN shipping_charges DECIMAL(10, 2) DEFAULT 0 AFTER subtotal,
ADD COLUMN customer_state VARCHAR(100) AFTER customer_address;

-- Update existing orders to have subtotal equal to total_amount and shipping_charges as 0
UPDATE orders SET subtotal = total_amount, shipping_charges = 0 WHERE subtotal = 0;
