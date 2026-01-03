import pkg from 'pg';
const { Client } = pkg;

console.log('Testing Supabase Connections...\n');

// Test Direct Connection
const config = {
  host: 'db.cklxnpbibdmvcdwyqwkw.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'Sagar@#8897',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

const client = new Client(config);

try {
  await client.connect();
  console.log('✅ Connected successfully!');
  const result = await client.query('SELECT NOW(), COUNT(*) FROM customers');
  console.log('✅ Query successful!');
  console.log('Time:', result.rows[0].now);
  console.log('Customers:', result.rows[0].count);
  await client.end();
} catch (error) {
  console.log('❌ Connection failed:');
  console.log('Error:', error.message);
  console.log('Code:', error.code);
}
