import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:Sagar%40%238897@db.cklxnpbibdmvcdwyqwkw.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('📋 Tables:');
    tables.rows.forEach(row => console.log(`   ✓ ${row.table_name}`));

    // Check customers table structure
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'customers'
      ORDER BY ordinal_position;
    `);

    console.log('\n👤 Customers table structure:');
    columns.rows.forEach(row => {
      console.log(`   • ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });

    // Check data counts
    const counts = await client.query(`
      SELECT 'customers' as table_name, COUNT(*) as count FROM customers
      UNION ALL
      SELECT 'products', COUNT(*) FROM products
      UNION ALL
      SELECT 'services', COUNT(*) FROM services
      UNION ALL
      SELECT 'orders', COUNT(*) FROM orders;
    `);

    console.log('\n📊 Data counts:');
    counts.rows.forEach(row => console.log(`   • ${row.table_name}: ${row.count} records`));

    console.log('\n✅ Database is ready!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
