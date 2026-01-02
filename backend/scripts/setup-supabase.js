import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase connection
const client = new Client({
  host: 'db.cklxnpbibdmvcdwyqwkw.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'Sagar@#8897',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL');

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema_postgres.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('\nRunning schema...');
    await client.query(schema);
    console.log('✓ Schema applied successfully');

    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n✓ Tables created:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check data
    const counts = await client.query(`
      SELECT 'products' as table_name, COUNT(*) as count FROM products
      UNION ALL
      SELECT 'services', COUNT(*) FROM services
      UNION ALL
      SELECT 'gallery', COUNT(*) FROM gallery;
    `);

    console.log('\n✓ Sample data:');
    counts.rows.forEach(row => {
      console.log(`  - ${row.table_name}: ${row.count} records`);
    });

    console.log('\n✓ Supabase database setup complete!');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === '28P01') {
      console.error('\n❌ Authentication failed. Please check your password.');
      console.error('Make sure the password is correct: Sagar@#8897');
    }
  } finally {
    await client.end();
  }
}

setupDatabase();
