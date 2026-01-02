import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema_postgres.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('\n📝 Running schema...');
    await client.query(schema);
    console.log('✅ Schema applied successfully');

    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n✅ Tables created:');
    result.rows.forEach(row => {
      console.log(`   • ${row.table_name}`);
    });

    // Check data counts
    const counts = await client.query(`
      SELECT 'products' as table_name, COUNT(*) as count FROM products
      UNION ALL
      SELECT 'services', COUNT(*) FROM services
      UNION ALL
      SELECT 'gallery', COUNT(*) FROM gallery
      UNION ALL
      SELECT 'customers', COUNT(*) FROM customers;
    `);

    console.log('\n📊 Data summary:');
    counts.rows.forEach(row => {
      console.log(`   • ${row.table_name}: ${row.count} records`);
    });

    console.log('\n🎉 Database initialization complete!');
    console.log('\n📌 Next steps:');
    console.log('   1. Test signup: POST /api/auth/signup');
    console.log('   2. Test login: POST /api/auth/login');
    console.log('   3. Access admin: admin@amma.com / amma@435');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Database connection refused. Check:');
      console.error('   • DATABASE_URL environment variable is set');
      console.error('   • Database server is running');
      console.error('   • Network/firewall allows connection');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check:');
      console.error('   • Database password is correct');
      console.error('   • User has proper permissions');
    } else if (error.code === '42P07') {
      console.log('\n⚠️  Tables already exist. This is OK!');
      console.log('   Database was previously initialized.');
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase();
}

export default initDatabase;
