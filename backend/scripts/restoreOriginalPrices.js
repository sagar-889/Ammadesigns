import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function restoreOriginalPrices() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    console.log('Connected to database');

    // Check if backup exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'products_price_backup'"
    );

    if (tables.length === 0) {
      console.log('❌ No backup found. Cannot restore prices.');
      process.exit(1);
    }

    // Restore original prices
    const [result] = await connection.query(`
      UPDATE products p
      INNER JOIN products_price_backup b ON p.id = b.id
      SET p.price = b.original_price
    `);

    console.log(`✓ Restored original prices for ${result.affectedRows} products`);
    console.log('✓ Production mode restored\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

restoreOriginalPrices();
