import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

// Your Supabase connection
const client = new Client({
  connectionString: 'postgresql://postgres:Sagar%40%238897@db.cklxnpbibdmvcdwyqwkw.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  try {
    console.log('🔌 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Read schema
    const schema = fs.readFileSync('./backend/database/schema_postgres.sql', 'utf8');

    console.log('📝 Creating tables...');
    await client.query(schema);
    console.log('✅ Tables created!\n');

    // Verify
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('✅ Tables in database:');
    tables.rows.forEach(row => console.log(`   • ${row.table_name}`));

    // Check counts
    const counts = await client.query(`
      SELECT 'products' as table_name, COUNT(*) as count FROM products
      UNION ALL
      SELECT 'services', COUNT(*) FROM services
      UNION ALL
      SELECT 'gallery', COUNT(*) FROM gallery
      UNION ALL
      SELECT 'customers', COUNT(*) FROM customers;
    `);

    console.log('\n📊 Data:');
    counts.rows.forEach(row => console.log(`   • ${row.table_name}: ${row.count} records`));

    console.log('\n🎉 Database initialized successfully!');
    console.log('\n✅ You can now:');
    console.log('   • Sign up on your website');
    console.log('   • Login with: admin@amma.com / amma@435');
    console.log('   • Create customer accounts');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42P07') {
      console.log('\n⚠️  Tables already exist - database was already initialized!');
      console.log('This is OK. Try signing up on your website.');
    }
  } finally {
    await client.end();
  }
}

initDatabase();
