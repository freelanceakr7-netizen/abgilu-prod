const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: 'angilu.info@gmail.com',
      password: '...',
    });
    console.log("LOGIN SUCCESS", loginRes.data.token.substring(0, 10));
    
    const params = {
      pickup_postcode: '400001',
      delivery_postcode: '500059',
      cod: 0,
      weight: 1
    };
    
    const response = await axios.get('https://apiv2.shiprocket.in/v1/external/courier/serviceability', { 
      params,
      headers: { Authorization: `Bearer ${loginRes.data.token}` }
    });
    console.log("RATES:", response.data);
  } catch (e) {
    console.log("ERROR:", e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  }
}
test();
