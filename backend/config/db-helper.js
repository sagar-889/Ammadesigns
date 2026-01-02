import pool from './db.js';

/**
 * Helper function to execute queries with MySQL-like syntax
 * Converts ? placeholders to $1, $2, etc. for PostgreSQL
 * Returns results in MySQL format [rows] for backward compatibility
 */
export async function query(sql, params = []) {
  // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
  let paramIndex = 1;
  const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
  
  try {
    const result = await pool.query(pgSql, params);
    
    // Return in MySQL format for backward compatibility
    // MySQL returns [rows, fields], we return [rows] for simplicity
    return [result.rows, result.fields];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a raw PostgreSQL query
 * Use this when you need PostgreSQL-specific features
 */
export async function rawQuery(sql, params = []) {
  return await pool.query(sql, params);
}

export default { query, rawQuery };
