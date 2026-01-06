import { query as pool } from '../config/db-helper.js';

async function fixImageUrls() {
  try {
    console.log('Fixing image URLs to use HTTPS...');

    // Fix products table
    const [products] = await pool(
      "UPDATE products SET image_url = REPLACE(image_url, 'http://ammadesigns.onrender.com', 'https://ammadesigns.onrender.com') WHERE image_url LIKE 'http://ammadesigns.onrender.com%'"
    );
    console.log('Updated products:', products);

    // Fix gallery table
    const [gallery] = await pool(
      "UPDATE gallery SET image_url = REPLACE(image_url, 'http://ammadesigns.onrender.com', 'https://ammadesigns.onrender.com') WHERE image_url LIKE 'http://ammadesigns.onrender.com%'"
    );
    console.log('Updated gallery:', gallery);

    console.log('✅ Image URLs fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
    process.exit(1);
  }
}

fixImageUrls();
