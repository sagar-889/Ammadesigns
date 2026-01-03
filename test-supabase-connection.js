import pkg from 'pg';
const { Client } = pkg;

// Test different connection configurations

console.log('Testing Supabase Connection Pooler...\n');

// Configuration 1: Transaction pooler with postgres.PROJECT_REF
const config1 = {
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.cklxnpbibdmvcdwyqwkw',
  password: 'Sagar@#8897',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

// Configuration 2: Session pooler with postgres.PROJECT_REF
const config2 = {
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.cklxnpbibdmvcdwyqwkw',
  password: 'Sagar@#8897',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

// Configuration 3: Direct connection (original)
const config3 = {
  host: 'db.cklxnpbibdmvcdwyqwkw.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'Sagar@#8897',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

async function testConnection(config, name) {
  const client = new Client(config);
  try {
    console.log(`Testing ${name}...`);
    await client.connect();
    const result = await client.query('SELECT NOW()');
    console.log(`✅ ${name} - SUCCESS!`);
    console.log(`   Time: ${result.rows[0].now}\n`);
    await client.end();
    return true;
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`   Error: ${error.message}\n`);
    try { await client.end(); } catch {}
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  const result1 = await testConnection(config1, 'Transaction Pooler (port 6543)');
  const result2 = await testConnection(config2, 'Session Pooler (port 5432)');
  const result3 = await testConnection(config3, 'Direct Connection');
  console.log('='.repeat(60));
  
  if (result1) {
    console.log('\n✅ Use Transaction Pooler configuration (port 6543)');
  } else if (result2) {
    console.log('\n✅ Use Session Pooler configuration (port 5432)');
  } else if (result3) {
    console.log('\n✅ Use Direct Connection (may have IPv6 issues on Render)');
  } else {
    console.log('\n❌ All connections failed - check credentials');
  }
}

runTests();
