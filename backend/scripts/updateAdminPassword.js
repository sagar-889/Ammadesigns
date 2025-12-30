import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

async function updateAdminPassword() {
  try {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Generated hash:', hash);
    
    const [result] = await pool.query(
      'UPDATE admins SET password_hash = ? WHERE username = ?',
      [hash, 'admin']
    );
    
    console.log('Admin password updated successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

updateAdminPassword();
