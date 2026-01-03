import https from 'https';

const data = JSON.stringify({
  name: 'Test User New',
  phone: '4444444444',
  password: 'test123'
});

const options = {
  hostname: 'ammadesigns.onrender.com',
  port: 443,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing signup with:');
console.log(JSON.parse(data));
console.log('\nSending request...\n');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  console.log('Headers:', res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    console.log(body);
    
    try {
      const json = JSON.parse(body);
      console.log('\nParsed Response:');
      console.log(JSON.stringify(json, null, 2));
      
      if (res.statusCode === 201) {
        console.log('\n✅ SIGNUP WORKS! 🎉');
      } else if (res.statusCode === 400) {
        console.log('\n⚠️  Validation error or duplicate');
      } else if (res.statusCode === 500) {
        console.log('\n❌ Server error - check Render logs');
      }
    } catch (e) {
      console.log('(Not JSON)');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
});

req.write(data);
req.end();
