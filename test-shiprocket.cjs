const axios = require('axios');

async function testShiprocket() {
  const email = 'saiswaroop.mukkanti1999@gmail.com';
  const password = 'XSYkkhOKS8jk#VAM1y0q9M52g@0q$&#4';
  
  console.log('Testing Shiprocket API with:');
  console.log('Email:', email);
  console.log('Password length:', password.length);

  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('SUCCESS!');
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
  } catch (error) {
    console.log('\nFAILED!');
    console.log('Status:', error.response ? error.response.status : error.message);
    console.log('Error Data:', error.response ? error.response.data : '');
  }
}

testShiprocket();
