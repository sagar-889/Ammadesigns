import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function addShippingColumns() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    console.log('Connected to database');

    // Check if columns already exist
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM orders LIKE 'shipping_charges'`
    );

    if (columns.length > 0) {
      console.log('✓ Shipping columns already exist');
      return;
    }

    // Add columns
    console.log('Adding shipping columns...');
    
    await connection.query(`
      ALTER TABLE orders 
      ADD COLUMN subtotal DECIMAL(10, 2) DEFAULT 0 AFTER total_amount,
      ADD COLUMN shipping_charges DECIMAL(10, 2) DEFAULT 0 AFTER subtotal,
      ADD COLUMN customer_state VARCHAR(100) AFTER customer_address
    `);

    console.log('✓ Added subtotal, shipping_charges, and customer_state columns');

    // Update existing orders
    await connection.query(`
      UPDATE orders 
      SET subtotal = total_amount, shipping_charges = 0 
      WHERE subtotal = 0
    `);

    console.log('✓ Updated existing orders with default values');
    console.log('✓ Migration completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addShippingColumns();
