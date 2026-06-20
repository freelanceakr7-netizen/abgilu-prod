// shiprocketService.js - backend wrappers for Shiprocket API
const axios = require('axios');
const functions = require('firebase-functions');

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
const TOKEN_KEY = 'shiprocket_token';

// Helper to get token from env (set via .env or functions config)
async function getAuthToken() {
  // Try to get token from environment variables
  const token = process.env.SHIPROCKET_TOKEN;
  if (token) return token;
  // If not set, throw error – deployment should set this
  throw new Error('Shiprocket token not configured');
}

async function ensureAuth() {
  try {
    const token = await getAuthToken();
    return token;
  } catch (e) {
    // If token missing, try to login using env credentials
    const email = process.env.SHIPROCKET_EMAIL;
    const pass = process.env.SHIPROCKET_PASSWORD;
    if (!email || !pass) throw new Error('Shiprocket credentials missing');
    const resp = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, { email, password: pass });
    const token = resp.data.token;
    // Save token to functions config (not writable at runtime) – just return it
    return token;
  }
}

async function apiRequest(method, path, data = {}, params = {}) {
  const token = await ensureAuth();
  const config = {
    method,
    url: `${SHIPROCKET_BASE_URL}${path}`,
    headers: { Authorization: `Bearer ${token}` },
    data,
    params,
  };
  const response = await axios(config);
  return response.data;
}

exports.createShiprocketOrder = async (orderData) => {
  return await apiRequest('post', '/orders/create/adhoc', orderData);
};

exports.createShipment = async (orderId, courierId) => {
  return await apiRequest('post', '/orders/create/shipment', { order_id: orderId, courier_id: courierId });
};

exports.getAllCouriers = async () => {
  return await apiRequest('get', '/courier/listing');
};

exports.checkCourierServiceability = async (params) => {
  return await apiRequest('get', '/courier/serviceability', {}, params);
};

exports.getPickupLocations = async () => {
  return await apiRequest('get', '/locations/pickups');
};
