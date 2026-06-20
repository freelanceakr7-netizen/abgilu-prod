const axios = require('axios');

async function testOptions() {
  try {
    const res = await axios.options('https://us-central1-angilu-dev-e1042.cloudfunctions.net/shiprocketProxy/auth/login');
    console.log("SUCCESS:", res.headers);
  } catch (error) {
    console.log("ERROR STATUS:", error.response?.status);
    console.log("ERROR DATA:", error.response?.data);
  }
}

testOptions();
