import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Force IPv4 resolution to avoid IPv6 connection issues
dns.setDefaultResultOrder('ipv4first');

// Use DATABASE_URL if available (for Render PostgreSQL), otherwise use individual params
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      family: 4, // Force IPv4
    })
  : new Pool({
      host: process.env.DB_HOST || 'db.cklxnpbibdmvcdwyqwkw.supabase.co',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Sagar@#8897',
      database: process.env.DB_NAME || 'postgres',
      ssl: { rejectUnauthorized: false },
      family: 4, // Force IPv4
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
