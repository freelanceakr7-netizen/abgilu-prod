const axios = require('axios');

async function testProxy() {
  try {
    const res = await axios.post('https://us-central1-angilu-dev-e1042.cloudfunctions.net/shiprocketProxy/auth/login', {
      email: 'swaroopindpro@gmail.com',
      password: 'wrong_password_test'
    });
    console.log("SUCCESS HTTP STATUS:", res.status);
    console.log("SUCCESS DATA:", res.data);
  } catch (error) {
    console.log("ERROR STATUS:", error.response?.status);
    console.log("ERROR DATA:", error.response?.data);
    console.log("RAW ERROR:", error.message);
  }
}

testProxy();
