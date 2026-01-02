import https from 'https';

const data = JSON.stringify({
  name: 'Test User',
  phone: '7777777777',
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

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse:');
    try {
      const json = JSON.parse(body);
      console.log(JSON.stringify(json, null, 2));
      
      if (res.statusCode === 201) {
        console.log('\n✅ SIGNUP WORKS! 🎉');
        console.log('Token:', json.token.substring(0, 20) + '...');
        console.log('Customer:', json.customer);
      } else {
        console.log('\n❌ Signup failed');
      }
    } catch (e) {
      console.log(body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();
