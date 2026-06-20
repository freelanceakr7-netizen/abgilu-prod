// Firebase Cloud Function to automatically create a Shiprocket order and shipment when a new order is added.
// This function runs on Firestore document creation in the 'orders' collection.
// It uses the shiprocketService API wrappers defined in the client code.
// NOTE: This is a simple demo; in production you should add proper validation, error handling,
// and possibly a queue to avoid race conditions.

const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
admin.initializeApp();

// Import shiprocket service functions (adjust the relative path if needed)
const {
  createShiprocketOrder,
  createShipment,
  getAllCouriers,
  checkCourierServiceability,
} = require('./shiprocketService');

/**
 * Triggered when a new order document is created.
 * Expected order document shape (as used in the app):
 * {
 *   id: string,
 *   customerName: string,
 *   shippingAddress: { name, address, city, state, pincode, phone },
 *   billingAddress?: {...},
 *   items: [{ name, sku, quantity, price, weight }],
 *   paymentMethod: 'COD' | 'Prepaid',
 *   subtotal: number,
 *   discount?: number
 * }
 */
exports.autoShiprocketShipment = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    if (!order) {
      console.warn('No order data found');
      return null;
    }

    // Choose a pickup location – for demo we take the first configured one in the client hook.
    // In a real app you would store pickup locations in Firestore or config.
    const defaultPickup = {
      pickup_code: 'DEFAULT001',
    };

    // Find an available courier – we request serviceability first.
    let courier = null;
    try {
      const rates = await checkCourierServiceability({
        pickup_postcode: defaultPickup.pickup_code,
        delivery_postcode: order.shippingAddress?.pincode,
        weight: order.items?.reduce((s, i) => s + (i.weight || 0.5) * (i.quantity || 1), 0),
      });
      if (rates && rates.available_courier_companies && rates.available_courier_companies.length) {
        courier = rates.available_courier_companies[0];
      }
    } catch (e) {
      console.error('Failed to get courier rates', e);
    }

    // Fallback: fetch all couriers and pick the first.
    if (!courier) {
      try {
        const allCouriers = await getAllCouriers();
        if (allCouriers && allCouriers.length) {
          courier = allCouriers[0];
        }
      } catch (e) {
        console.error('Failed to fetch courier list', e);
      }
    }

    if (!courier) {
      console.warn('No courier available for order', order.id);
      return null;
    }

    // Build Shiprocket order payload – reuse the same logic from the client hook.
    const orderPayload = {
      order_id: `ECOM_${order.id}_${Date.now()}`,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: defaultPickup.pickup_code,
      billing_customer_name: order.customerName || '',
      billing_address: order.billingAddress?.address || order.shippingAddress?.address || '',
      billing_city: order.billingAddress?.city || order.shippingAddress?.city || '',
      billing_state: order.billingAddress?.state || order.shippingAddress?.state || '',
      billing_country: order.billingAddress?.country || order.shippingAddress?.country || 'India',
      billing_pincode: order.billingAddress?.pincode || order.shippingAddress?.pincode || '',
      billing_email: order.customerEmail || '',
      billing_phone: order.billingAddress?.phone || order.shippingAddress?.phone || '',
      shipping_is_billing: !!order.billingAddress ? false : true,
      shipping_customer_name: order.shippingAddress?.name || order.customerName || '',
      shipping_address: order.shippingAddress?.address || '',
      shipping_city: order.shippingAddress?.city || '',
      shipping_state: order.shippingAddress?.state || '',
      shipping_country: order.shippingAddress?.country || 'India',
      shipping_pincode: order.shippingAddress?.pincode || '',
      shipping_email: order.customerEmail || '',
      shipping_phone: order.shippingAddress?.phone || '',
      order_items: (order.items || []).map(item => ({
        name: item.name,
        sku: item.sku || `SKU_${item.id}`,
        units: item.quantity || 1,
        selling_price: item.price || 0,
        discount: item.discount || 0,
        tax: item.tax || 0,
        hsn: item.hsn || ''
      })),
      payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      shipping_charges: courier.rate || 0,
      sub_total: order.subtotal || order.total || 0,
      weight: order.items?.reduce((s, i) => s + (i.weight || 0.5) * (i.quantity || 1), 0) || 1
    };

    try {
      // Create order in Shiprocket
      const orderResp = await createShiprocketOrder(orderPayload);
      if (!orderResp || !orderResp.data?.order_id) {
        console.error('Shiprocket order creation failed', orderResp);
        return null;
      }

      // Create shipment using selected courier
      const shipmentResp = await createShipment(orderResp.data.order_id, courier.courier_id);
      console.log('Shipment created successfully', shipmentResp.data);
    } catch (err) {
      console.error('Error during automatic Shiprocket integration', err);
    }

    return null;
  });

// Export email services
const emailService = require('./emailService');
exports.sendOTPEmail = emailService.sendOTPEmail;
exports.sendOrderConfirmation = emailService.sendOrderConfirmation;
exports.sendCustomFitEmail = emailService.sendCustomFitEmail;

// Export order statistics
const orderStatistics = require('./orderStatistics');
exports.onOrderCreated = orderStatistics.onOrderCreated;
exports.onOrderUpdated = orderStatistics.onOrderUpdated;
exports.onOrderDeleted = orderStatistics.onOrderDeleted;
exports.updateOrderStatisticsDaily = orderStatistics.updateOrderStatisticsDaily;
exports.manualUpdateOrderStatistics = orderStatistics.manualUpdateOrderStatistics;

// Export user search index
const userSearchIndex = require('./userSearchIndex');
exports.onUserCreate = userSearchIndex.onUserCreate;
exports.onUserUpdate = userSearchIndex.onUserUpdate;
exports.onUserDelete = userSearchIndex.onUserDelete;
exports.rebuildUserSearchIndex = userSearchIndex.rebuildUserSearchIndex;
exports.getUserSearchIndexStats = userSearchIndex.getUserSearchIndexStats;

// --- SHIPROCKET PROXY ---
const axios = require('axios');

exports.shiprocketProxy = functions.https.onRequest(async (req, res) => {
  // 1. Handle CORS preflight requests
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // 2. Extract path (everything after /shiprocketProxy)
    // In Firebase functions, req.path is the trailing part. E.g. "/auth/login"
    let targetPath = req.path;
    
    // We want to proxy to https://apiv2.shiprocket.in/v1/external
    const targetUrl = `https://apiv2.shiprocket.in/v1/external${targetPath}`;

    // 3. Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // 4. Forward the request to Shiprocket
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      params: req.query,
      headers: headers
    });

    // 5. Return the successful response back to the client
    res.status(response.status).send(response.data);

  } catch (error) {
    console.error('Shiprocket Proxy Error:', error.response?.data || error.message);
    
    // 6. If Shiprocket returns an error, forward that error status and data
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
});