import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Map product names to image filenames
const productImageMap = {
  'Designer Blouse': 'designer-blouse',
  'Velvet Blouse': 'velvet-blouse',
  'Silk Blouse': 'silk-blouse',
  'Silk Saree with Blouse': 'silk-saree',
  'Banarasi Saree': 'banarasi-saree',
  'Georgette Saree': 'georgette-saree',
  'Lehenga Choli': 'lehenga-choli',
  'Bridal Lehenga': 'bridal-lehenga',
  'Festive Lehenga': 'festive-lehenga',
  'Embroidered Kurti': 'embroidered-kurti',
  'Printed Kurti': 'printed-kurti',
  'Churidar Set': 'churidar-set',
  'Cotton Salwar Suit': 'salwar-suit',
  'Anarkali Dress': 'anarkali-dress',
  'Palazzo Set': 'palazzo-set',
  'Party Wear Gown': 'party-gown',
  'Indo-Western Dress': 'indo-western',
  'Sharara Set': 'sharara-set',
  'Floral Maxi Dress': 'maxi-dress',
  'Embellished Dupatta': 'dupatta'
};

// Check if image file exists with any extension
function findImageFile(baseName, imagesDir) {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  
  for (const ext of extensions) {
    const filePath = path.join(imagesDir, baseName + ext);
    if (fs.existsSync(filePath)) {
      return baseName + ext;
    }
  }
  return null;
}

async function updateLocalImages() {
  let connection;
  
  try {
    // Path to images folder
    const imagesDir = path.join(__dirname, '../../frontend/public/images/products');
    
    // Check if images directory exists
    if (!fs.existsSync(imagesDir)) {
      console.error('❌ Images directory not found!');
      console.log('Expected path:', imagesDir);
      return;
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'ladies_tailor_db'
    });

    console.log('Connected to database...');
    console.log('Checking for product images...\n');

    let updatedCount = 0;
    let missingCount = 0;
    const missingImages = [];

    for (const [productName, imageBaseName] of Object.entries(productImageMap)) {
      const imageFile = findImageFile(imageBaseName, imagesDir);
      
      if (imageFile) {
        // Image found - update database with local path
        const imageUrl = `/images/products/${imageFile}`;
        await connection.query(
          'UPDATE products SET image_url = ? WHERE name = ?',
          [imageUrl, productName]
        );
        console.log(`✓ Updated: ${productName} → ${imageFile}`);
        updatedCount++;
      } else {
        console.log(`⚠ Missing: ${productName} (expected: ${imageBaseName}.jpg/png/webp)`);
        missingImages.push(`${imageBaseName}.jpg`);
        missingCount++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ Updated: ${updatedCount} products`);
    console.log(`⚠ Missing: ${missingCount} images`);
    
    if (missingImages.length > 0) {
      console.log(`\nMissing images:`);
      missingImages.forEach(img => console.log(`  - ${img}`));
      console.log(`\nPlease add these images to: ${imagesDir}`);
    } else {
      console.log('\n🎉 All product images updated successfully!');
      console.log('Refresh your shop page to see the changes!');
    }

  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

updateLocalImages();
