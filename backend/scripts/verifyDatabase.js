import db from '../config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function verifyDatabase() {
  console.log('🔍 Verifying Database Schema...\n');

  try {
    // Check if database exists
    const [databases] = await db.query("SHOW DATABASES LIKE 'ladies_tailor_db'");
    if (databases.length === 0) {
      console.log('❌ Database "ladies_tailor_db" does not exist!');
      console.log('   Run: mysql -u root -p < backend/database/complete_schema.sql');
      process.exit(1);
    }
    console.log('✅ Database exists: ladies_tailor_db');

    // Use the database
    await db.query('USE ladies_tailor_db');

    // Check all required tables
    const requiredTables = [
      'admins',
      'customers',
      'services',
      'gallery',
      'contacts',
      'products',
      'orders',
      'order_items'
    ];

    console.log('\n📋 Checking Tables:');
    const [tables] = await db.query('SHOW TABLES');
    const existingTables = tables.map(t => Object.values(t)[0]);

    for (const table of requiredTables) {
      if (existingTables.includes(table)) {
        const [count] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table.padEnd(15)} - ${count[0].count} records`);
      } else {
        console.log(`❌ ${table.padEnd(15)} - MISSING!`);
      }
    }

    // Check orders table for shipping columns
    console.log('\n🚚 Checking Orders Table Columns:');
    const [columns] = await db.query("SHOW COLUMNS FROM orders");
    const columnNames = columns.map(c => c.Field);
    
    const requiredOrderColumns = ['subtotal', 'shipping_charges', 'customer_state'];
    for (const col of requiredOrderColumns) {
      if (columnNames.includes(col)) {
        console.log(`✅ ${col}`);
      } else {
        console.log(`❌ ${col} - MISSING! Run: mysql -u root -p < backend/database/add_shipping_columns.sql`);
      }
    }

    // Check for sample data
    console.log('\n📊 Sample Data Status:');
    const [services] = await db.query('SELECT COUNT(*) as count FROM services');
    const [gallery] = await db.query('SELECT COUNT(*) as count FROM gallery');
    const [products] = await db.query('SELECT COUNT(*) as count FROM products');

    console.log(`   Services: ${services[0].count} items`);
    console.log(`   Gallery:  ${gallery[0].count} items`);
    console.log(`   Products: ${products[0].count} items`);

    console.log('\n✅ Database verification complete!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Database verification failed:', error.message);
    console.log('\n💡 To fix:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Run: mysql -u root -p < backend/database/complete_schema.sql');
    console.log('   3. Check your .env file for correct database credentials');
    process.exit(1);
  }
}

verifyDatabase();
