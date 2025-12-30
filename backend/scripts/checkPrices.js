import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function checkPrices() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    const [products] = await connection.query(
      'SELECT name, price FROM products LIMIT 5'
    );

    console.log('\n📦 Sample Product Prices:\n');
    products.forEach(p => {
      console.log(`   ${p.name}: ₹${p.price}`);
    });
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkPrices();
