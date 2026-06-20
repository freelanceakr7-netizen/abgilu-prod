// Shiprocket API Service
import axios from 'axios';

// Use Vite proxy for local dev, and Firebase Cloud Function proxy for production
const SHIPROCKET_BASE_URL = import.meta.env.PROD 
  ? 'https://us-central1-angilu-dev-e1042.cloudfunctions.net/shiprocketProxy'
  : '/shiprocket-api';

// Store token in localStorage for persistence
const TOKEN_KEY = 'shiprocket_token';

// Create axios instance with base configuration
const shiprocketApi = axios.create({
  baseURL: SHIPROCKET_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
shiprocketApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
shiprocketApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear it
      localStorage.removeItem(TOKEN_KEY);
      throw new Error('Authentication token expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

/**
 * Authenticate with Shiprocket API
 * @param {string} email - Shiprocket account email
 * @param {string} password - Shiprocket account password
 * @returns {Promise<string>} - Authentication token
 */
export const authenticateShiprocket = async (email, password) => {
  try {
    // MOCK TEST MODE
    if (email === 'test@angilu.com' || email.includes('test')) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockToken = 'mock_shiprocket_token_12345';
      localStorage.setItem(TOKEN_KEY, mockToken);
      return mockToken;
    }

    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      return response.data.token;
    } else {
      throw new Error('Invalid response from authentication API');
    }
  } catch (error) {
    console.error('Shiprocket authentication error:', error);
    throw new Error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
  }
};

/**
 * Check if user is authenticated with Shiprocket
 * @returns {boolean} - Authentication status
 */
export const isShiprocketAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

/**
 * Logout from Shiprocket
 */
export const logoutShiprocket = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Get all orders from Shiprocket
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - List of orders
 */
export const getShiprocketOrders = async (params = {}) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === 'mock_shiprocket_token_12345') {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        data: [
          { id: '987654321', customer_name: 'Rohith Sharma', status: 'PROCESSING', created_at: new Date().toISOString() },
          { id: '987654322', customer_name: 'Anjali Verma', status: 'SHIPPED', created_at: new Date().toISOString() }
        ]
      };
    }

    const response = await shiprocketApi.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Shiprocket orders:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders from Shiprocket');
  }
};

/**
 * Get order details by ID
 * @param {string} orderId - Shiprocket order ID
 * @returns {Promise<Object>} - Order details
 */
export const getShiprocketOrderById = async (orderId) => {
  try {
    const response = await shiprocketApi.get(`/orders/show/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Shiprocket order details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch order details');
  }
};

/**
 * Create a new order in Shiprocket
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} - Created order details
 */
export const createShiprocketOrder = async (orderData) => {
  try {
    const response = await shiprocketApi.post('/orders/create/adhoc', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating Shiprocket order:', error);
    throw new Error(error.response?.data?.message || 'Failed to create order in Shiprocket');
  }
};

/**
 * Check courier serviceability and get rates
 * @param {Object} params - Serviceability parameters
 * @returns {Promise<Object>} - Available couriers and rates
 */
export const checkCourierServiceability = async (params) => {
  try {
    // Validate required parameters
    if (!params.pickup_postcode || !params.delivery_postcode) {
      throw new Error('Both pickup and delivery postal codes are required');
    }
    
    // Ensure postal codes are valid (not empty strings and not single characters like 'e')
    if (params.delivery_postcode.length < 3 || params.pickup_postcode.length < 3) {
      throw new Error('Invalid postal codes provided');
    }
    
    const response = await shiprocketApi.get('/courier/serviceability', { params });
    return response.data;
  } catch (error) {
    console.error('Error checking courier serviceability:', error, error.response?.data);
    throw new Error(error.response?.data?.message || JSON.stringify(error.response?.data) || error.message || 'Failed to check courier serviceability');
  }
};

/**
 * Get pickup locations
 * @returns {Promise<Array>} - List of pickup locations
 */
export const getPickupLocations = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === 'mock_shiprocket_token_12345') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: [
          { pickup_code: 'HYD_WAREHOUSE', name: 'Hyderabad Main', address: 'Plot 42, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pin_code: '500033' },
          { pickup_code: 'MUM_HUB', name: 'Mumbai Hub', address: 'Andheri East', city: 'Mumbai', state: 'Maharashtra', pin_code: '400069' }
        ]
      };
    }

    // Use the correct settings endpoint for fetching locations
    const response = await shiprocketApi.get('/settings/company/pickup');
    
    // Shiprocket returns data inside response.data.data.shipping_address
    if (response.data && response.data.data && response.data.data.shipping_address) {
      return { data: response.data.data.shipping_address };
    }
    return response.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching pickup locations:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch pickup locations');
  }
};

/**
 * Create a new pickup location
 * @param {Object} locationData - Pickup location data
 * @returns {Promise<Object>} - Created location details
 */
export const createPickupLocation = async (locationData) => {
  try {
    // Format the data according to Shiprocket API requirements
    const formattedData = {
      pickup_location: locationData.pickup_code || locationData.pickup_location,
      name: locationData.name,
      email: locationData.email,
      phone: locationData.phone,
      address: locationData.address,
      address_2: locationData.address_2 || '',
      city: locationData.city,
      state: locationData.state,
      country: locationData.country || 'India',
      pin_code: locationData.pin_code
    };
    
    // Fix the endpoint path - it should be /locations/pickups (plural)
    const response = await shiprocketApi.post('/locations/pickups', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating pickup location:', error);
    throw new Error(error.response?.data?.message || 'Failed to create pickup location');
  }
};

/**
 * Update a pickup location
 * @param {string} locationId - Location ID
 * @param {Object} locationData - Updated location data
 * @returns {Promise<Object>} - Updated location details
 */
export const updatePickupLocation = async (locationId, locationData) => {
  try {
    // Fix endpoint path - it should be /locations/pickups (plural) for consistency
    const response = await shiprocketApi.put(`/locations/pickups/${locationId}`, locationData);
    return response.data;
  } catch (error) {
    console.error('Error updating pickup location:', error);
    throw new Error(error.response?.data?.message || 'Failed to update pickup location');
  }
};

/**
 * Create a shipment for an order
 * @param {string} orderId - Order ID
 * @param {number} courierId - Selected courier ID
 * @returns {Promise<Object>} - Shipment details
 */
export const createShipment = async (orderId, courierId) => {
  try {
    const response = await shiprocketApi.post('/orders/create/shipment', {
      order_id: orderId,
      courier_id: courierId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw new Error(error.response?.data?.message || 'Failed to create shipment');
  }
};

/**
 * Get shipment tracking information
 * @param {string} shipmentId - Shipment ID
 * @returns {Promise<Object>} - Tracking information
 */
export const trackShipment = async (shipmentId) => {
  try {
    const response = await shiprocketApi.get(`/courier/track/shipment/${shipmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw new Error(error.response?.data?.message || 'Failed to track shipment');
  }
};

/**
 * Generate shipping label
 * @param {Array} orderIds - Array of order IDs
 * @returns {Promise<Object>} - Label generation response
 */
export const generateShippingLabel = async (orderIds) => {
  try {
    const response = await shiprocketApi.post('/orders/print/label', {
      order_ids: orderIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating shipping label:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate shipping label');
  }
};

/**
 * Generate manifest
 * @param {Array} orderIds - Array of order IDs
 * @returns {Promise<Object>} - Manifest generation response
 */
export const generateManifest = async (orderIds) => {
  try {
    const response = await shiprocketApi.post('/orders/manifests/generate', {
      order_ids: orderIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating manifest:', error);
    throw new Error(error.response?.data?.message || 'Failed to generate manifest');
  }
};

/**
 * Schedule pickup for shipments
 * @param {Object} pickupData - Pickup details
 * @returns {Promise<Object>} - Pickup scheduling response
 */
export const schedulePickup = async (pickupData) => {
  try {
    const response = await shiprocketApi.post('/pickups/create', pickupData);
    return response.data;
  } catch (error) {
    console.error('Error scheduling pickup:', error);
    throw new Error(error.response?.data?.message || 'Failed to schedule pickup');
  }
};

/**
 * Cancel an order
 * @param {Array} orderIds - Array of order IDs to cancel
 * @returns {Promise<Object>} - Cancellation response
 */
export const cancelShiprocketOrder = async (orderIds) => {
  try {
    const response = await shiprocketApi.post('/orders/cancel', {
      ids: orderIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
};

/**
 * Get wallet balance
 * @returns {Promise<Object>} - Wallet balance information
 */
export const getWalletBalance = async () => {
  try {
    const response = await shiprocketApi.get('/wallet/balance');
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch wallet balance');
  }
};

/**
 * Get all available couriers
 * @returns {Promise<Array>} - List of available couriers
 */
export const getAllCouriers = async () => {
  try {
    const response = await shiprocketApi.get('/courier/listing');
    return response.data;
  } catch (error) {
    console.error('Error fetching couriers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch couriers');
  }
};