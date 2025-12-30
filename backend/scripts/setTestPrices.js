import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function setTestPrices() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    console.log('Connected to database');

    // Backup original prices (create backup table if not exists)
    console.log('Creating backup of original prices...');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products_price_backup (
        id INT PRIMARY KEY,
        name VARCHAR(200),
        original_price DECIMAL(10, 2),
        backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if backup already exists
    const [existingBackup] = await connection.query(
      'SELECT COUNT(*) as count FROM products_price_backup'
    );

    if (existingBackup[0].count === 0) {
      await connection.query(`
        INSERT INTO products_price_backup (id, name, original_price)
        SELECT id, name, price FROM products
      `);
      console.log('✓ Original prices backed up');
    } else {
      console.log('✓ Backup already exists');
    }

    // Set all products to ₹1
    const [result] = await connection.query(`
      UPDATE products SET price = 1.00
    `);

    console.log(`✓ Updated ${result.affectedRows} products to ₹1 for testing`);
    console.log('\n⚠️  TESTING MODE ACTIVE');
    console.log('All products are now ₹1');
    console.log('To restore original prices, run: node backend/scripts/restoreOriginalPrices.js\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setTestPrices();
