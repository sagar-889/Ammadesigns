import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixImages() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    console.log('Connected to database...');
    console.log('Updating product images...');

    // Get all products
    const [products] = await connection.query('SELECT id, name FROM products');

    for (const product of products) {
      // Create a simple colored image URL with product name
      const encodedName = encodeURIComponent(product.name);
      const imageUrl = `https://via.placeholder.com/800x800/e0c097/1B263B?text=${encodedName}`;
      
      await connection.query(
        'UPDATE products SET image_url = ? WHERE id = ?',
        [imageUrl, product.id]
      );
      console.log(`✓ Updated: ${product.name}`);
    }

    console.log(`\n✓ Successfully updated ${products.length} product images!`);

  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

fixImages();
