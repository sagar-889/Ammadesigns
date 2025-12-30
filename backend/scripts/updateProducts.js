import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: 'Designer Blouse',
    description: 'Elegant designer blouse with intricate embroidery work',
    price: 1200.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Designer+Blouse',
    category: 'Blouses',
    stock: 10,
    is_available: true
  },
  {
    name: 'Silk Saree with Blouse',
    description: 'Premium silk saree with matching blouse piece',
    price: 3500.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Silk+Saree',
    category: 'Sarees',
    stock: 5,
    is_available: true
  },
  {
    name: 'Churidar Set',
    description: 'Complete churidar set with dupatta',
    price: 1800.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Churidar+Set',
    category: 'Churidar',
    stock: 8,
    is_available: true
  },
  {
    name: 'Embroidered Kurti',
    description: 'Beautiful embroidered kurti for casual wear',
    price: 950.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Embroidered+Kurti',
    category: 'Kurtis',
    stock: 15,
    is_available: true
  },
  {
    name: 'Lehenga Choli',
    description: 'Traditional lehenga choli for special occasions',
    price: 5500.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Lehenga+Choli',
    category: 'Lehenga',
    stock: 3,
    is_available: true
  },
  {
    name: 'Cotton Salwar Suit',
    description: 'Comfortable cotton salwar suit for daily wear',
    price: 1100.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Salwar+Suit',
    category: 'Salwar',
    stock: 12,
    is_available: true
  },
  {
    name: 'Anarkali Dress',
    description: 'Stunning anarkali dress with mirror work',
    price: 2800.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Anarkali+Dress',
    category: 'Anarkali',
    stock: 6,
    is_available: true
  },
  {
    name: 'Palazzo Set',
    description: 'Trendy palazzo set with printed top',
    price: 1350.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Palazzo+Set',
    category: 'Palazzo',
    stock: 10,
    is_available: true
  },
  {
    name: 'Banarasi Saree',
    description: 'Handwoven Banarasi silk saree with golden zari',
    price: 6500.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Banarasi+Saree',
    category: 'Sarees',
    stock: 4,
    is_available: true
  },
  {
    name: 'Party Wear Gown',
    description: 'Elegant party wear gown with sequin work',
    price: 4200.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Party+Gown',
    category: 'Gowns',
    stock: 5,
    is_available: true
  },
  {
    name: 'Printed Kurti',
    description: 'Vibrant printed kurti perfect for summer',
    price: 750.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Printed+Kurti',
    category: 'Kurtis',
    stock: 20,
    is_available: true
  },
  {
    name: 'Bridal Lehenga',
    description: 'Exquisite bridal lehenga with heavy embroidery',
    price: 15000.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Bridal+Lehenga',
    category: 'Lehenga',
    stock: 2,
    is_available: true
  },
  {
    name: 'Georgette Saree',
    description: 'Lightweight georgette saree with floral print',
    price: 2200.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Georgette+Saree',
    category: 'Sarees',
    stock: 8,
    is_available: true
  },
  {
    name: 'Velvet Blouse',
    description: 'Luxurious velvet blouse with stone work',
    price: 1500.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Velvet+Blouse',
    category: 'Blouses',
    stock: 7,
    is_available: true
  },
  {
    name: 'Indo-Western Dress',
    description: 'Fusion indo-western dress for modern look',
    price: 3200.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Indo+Western',
    category: 'Indo-Western',
    stock: 6,
    is_available: true
  },
  {
    name: 'Sharara Set',
    description: 'Traditional sharara set with embroidered dupatta',
    price: 3800.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Sharara+Set',
    category: 'Sharara',
    stock: 5,
    is_available: true
  },
  {
    name: 'Floral Maxi Dress',
    description: 'Elegant floral maxi dress for evening wear',
    price: 2100.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Maxi+Dress',
    category: 'Dresses',
    stock: 9,
    is_available: true
  },
  {
    name: 'Embellished Dupatta',
    description: 'Designer dupatta with heavy embellishment',
    price: 850.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Dupatta',
    category: 'Accessories',
    stock: 15,
    is_available: true
  },
  {
    name: 'Silk Blouse',
    description: 'Pure silk blouse with traditional design',
    price: 1350.00,
    image_url: 'https://placehold.co/800x800/e0c097/1B263B?text=Silk+Blouse',
    category: 'Blouses',
    stock: 11,
    is_available: true
  },
  {
    name: 'Festive Lehenga',
    description: 'Colorful festive lehenga with mirror work',
    price: 7200.00,
    image_url: 'https://placehold.co/800x800/f5f3f0/1B263B?text=Festive+Lehenga',
    category: 'Lehenga',
    stock: 4,
    is_available: true
  }
];

async function updateProducts() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    console.log('Connected to database...');

    // Clear existing products (optional - comment out if you want to keep existing)
    console.log('Clearing existing products...');
    await connection.query('DELETE FROM order_items');
    await connection.query('DELETE FROM products');
    await connection.query('ALTER TABLE products AUTO_INCREMENT = 1');

    // Insert new products
    console.log('Inserting sample products...');
    for (const product of products) {
      await connection.query(
        'INSERT INTO products (name, description, price, image_url, category, stock, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.image_url, product.category, product.stock, product.is_available]
      );
      console.log(`✓ Added: ${product.name}`);
    }

    const [result] = await connection.query('SELECT COUNT(*) as count FROM products');
    console.log(`\n✓ Successfully added ${result[0].count} products!`);

  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

updateProducts();
