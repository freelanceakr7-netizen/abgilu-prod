const https = require('https');

const req = https.request('https://us-central1-angilu-dev-e1042.cloudfunctions.net/sendOTPEmail', { method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});
req.write(JSON.stringify({ data: { email: 'test@example.com', otp: '123456' } }));
req.end();
