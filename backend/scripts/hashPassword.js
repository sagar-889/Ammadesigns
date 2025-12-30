import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.log('Usage: node hashPassword.js <password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nPassword Hash:');
console.log(hash);
console.log('\nUse this hash in your database or .env file\n');
