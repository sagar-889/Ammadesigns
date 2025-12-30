import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Real fashion images from Pexels (free to use)
const productImages = {
  'Designer Blouse': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Silk Saree with Blouse': 'https://images.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Churidar Set': 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Embroidered Kurti': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Lehenga Choli': 'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Cotton Salwar Suit': 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Anarkali Dress': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Palazzo Set': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Banarasi Saree': 'https://images.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Party Wear Gown': 'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Printed Kurti': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Bridal Lehenga': 'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Georgette Saree': 'https://images.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Velvet Blouse': 'https://images.ppexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Indo-Western Dress': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Sharara Set': 'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Floral Maxi Dress': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Embellished Dupatta': 'https://immages.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Silk Blouse': 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Festive Lehenga': 'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&cs=tinysrgb&w=800'
};

async function updateRealImages() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    console.log('Connected to database...');
    console.log('Updating products with real fashion images...\n');

    for (const [productName, imageUrl] of Object.entries(productImages)) {
      await connection.query(
        'UPDATE products SET image_url = ? WHERE name = ?',
        [imageUrl, productName]
      );
      console.log(`✓ Updated: ${productName}`);
    }

    console.log(`\n✓ Successfully updated ${Object.keys(productImages).length} products with real images!`);
    console.log('\nRefresh your shop page to see the changes!');

  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

updateRealImages();
