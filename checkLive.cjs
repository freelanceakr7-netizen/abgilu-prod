const https = require('https');
https.get('https://2.testdemo.store/admin', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      console.log('FOUND SCRIPT:', match[1]);
      https.get('https://2.testdemo.store' + match[1], (jsRes) => {
        let jsData = '';
        jsRes.on('data', chunk => jsData += chunk);
        jsRes.on('end', () => {
          if (jsData.includes('cloudfunctions.net/shiprocketProxy')) {
            console.log('PROXY IS DEPLOYED!');
          } else if (jsData.includes('https://apiv2.shiprocket.in/v1/external')) {
            console.log('OLD DIRECT URL DETECTED!');
          } else {
            console.log('SOMETHING ELSE DETECTED...');
          }
        });
      });
    } else {
      console.log('NO SCRIPT MATCH');
    }
  });
});
