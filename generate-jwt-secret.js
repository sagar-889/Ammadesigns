import crypto from 'crypto';

// Generate a secure random JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Generated JWT Secret:\n');
console.log(jwtSecret);
console.log('\n📋 Copy this value and use it as JWT_SECRET in your environment variables\n');
console.log('Length:', jwtSecret.length, 'characters');
console.log('\nFor Render Environment Variables:');
console.log('Key: JWT_SECRET');
console.log('Value:', jwtSecret);
