import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function checkAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔍 Connecting to database...\n');
    await client.connect();
    console.log('✅ Connected!\n');

    // Check if admins table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admins'
      );
    `);
    
    console.log('📋 Admins table exists:', tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      // Check admin records
      const adminCheck = await client.query('SELECT id, username, created_at FROM admins');
      console.log('\n👤 Admin records found:', adminCheck.rows.length);
      
      if (adminCheck.rows.length > 0) {
        console.log('\nAdmin details:');
        adminCheck.rows.forEach(admin => {
          console.log(`  - ID: ${admin.id}`);
          console.log(`    Username: ${admin.username}`);
          console.log(`    Created: ${admin.created_at}`);
        });
      } else {
        console.log('\n⚠️  No admin records found in database!');
      }

      // Check password hash
      const hashCheck = await client.query('SELECT username, password_hash FROM admins');
      if (hashCheck.rows.length > 0) {
        console.log('\n🔐 Password hash check:');
        hashCheck.rows.forEach(admin => {
          console.log(`  - ${admin.username}: ${admin.password_hash.substring(0, 20)}...`);
        });
      }
    }

    console.log('\n📝 Note: The app uses HARDCODED admin login:');
    console.log('   Email: admin@amma.com');
    console.log('   Password: amma@435');
    console.log('\n   This is in backend/routes/auth.js (line ~60)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAdmin();
