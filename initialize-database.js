import https from 'https';

console.log('🚀 Initializing database on Render...\n');

const data = '';

const options = {
  hostname: 'ammadesigns.onrender.com',
  port: 443,
  path: '/api/setup/initialize',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode} ${res.statusMessage}\n`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      console.log('Response:');
      console.log(JSON.stringify(json, null, 2));
      
      if (res.statusCode === 200 && json.success) {
        console.log('\n✅ Database initialized successfully! 🎉');
        console.log('\nTables created:');
        json.tables.forEach(table => console.log(`   • ${table}`));
        console.log('\n✅ You can now signup and login on your website!');
      } else {
        console.log('\n❌ Database initialization failed');
        console.log('Error:', json.error || json.details);
      }
    } catch (e) {
      console.log('Response:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
});

req.write(data);
req.end();
