import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:Sagar%40%238897@db.cklxnpbibdmvcdwyqwkw.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixCustomersTable() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('🔧 Fixing customers table structure...\n');

    // Make phone NOT NULL and UNIQUE
    await client.query(`
      ALTER TABLE customers 
      ALTER COLUMN phone SET NOT NULL;
    `);
    console.log('✓ Made phone NOT NULL');

    await client.query(`
      ALTER TABLE customers 
      ADD CONSTRAINT customers_phone_unique UNIQUE (phone);
    `);
    console.log('✓ Made phone UNIQUE');

    // Remove UNIQUE constraint from email (if exists)
    try {
      await client.query(`
        ALTER TABLE customers 
        DROP CONSTRAINT IF EXISTS customers_email_key;
      `);
      console.log('✓ Removed UNIQUE constraint from email');
    } catch (e) {
      console.log('  (email was not unique)');
    }

    // Make email nullable
    await client.query(`
      ALTER TABLE customers 
      ALTER COLUMN email DROP NOT NULL;
    `);
    console.log('✓ Made email nullable (optional)');

    console.log('\n✅ Customers table fixed!');
    console.log('\n📋 New structure:');
    console.log('   • phone: UNIQUE, NOT NULL (primary identifier)');
    console.log('   • email: nullable (optional)');

    // Verify
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'customers'
      ORDER BY ordinal_position;
    `);

    console.log('\n👤 Updated customers table:');
    columns.rows.forEach(row => {
      console.log(`   • ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : 'nullable'}`);
    });

    console.log('\n🎉 Done! Signup should work now.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '23502') {
      console.error('\n⚠️  Some customers have NULL phone numbers.');
      console.error('Need to update them first before making phone NOT NULL.');
    }
  } finally {
    await client.end();
  }
}

fixCustomersTable();
