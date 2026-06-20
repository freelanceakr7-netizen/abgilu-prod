import { createOrder, updateOrderStatus } from './orderService';
import { updateProductStock } from './productService';

// Initialize Razorpay with your key ID
// In production, this should come from environment variables
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; // Using the key from .env file

// Debug: Log the key ID (remove in production)
console.log('Razorpay Key ID:', RAZORPAY_KEY_ID);

/**
 * Load Razorpay script dynamically
 * @returns {Promise} Promise that resolves when Razorpay is loaded
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Create a Razorpay order and initiate payment
 * @param {Object} orderData - Order data including items, amount, user info
 * @param {Function} onSuccess - Callback function on successful payment
 * @param {Function} onError - Callback function on payment failure
 * @returns {Promise} Razorpay order
 */
export const initiatePayment = async (orderData, onSuccess, onError) => {
  try {
    console.log('Initiating payment with orderData:', orderData);
    
    // Create order in Firebase first
    console.log('Creating Firebase order...');
    
    // Ensure userId is included in the order data and properly map item properties
    const orderWithUser = {
      ...orderData,
      status: 'pending',
      paymentStatus: 'pending',
      // Map selectedSize and selectedColor to size and color for each item
      // Only include size and color if they exist to avoid undefined values
      items: orderData.items.map(item => {
        const mappedItem = { ...item };
        if (item.selectedSize !== undefined) {
          mappedItem.size = item.selectedSize;
        }
        if (item.selectedColor !== undefined) {
          mappedItem.color = item.selectedColor;
        }
        return mappedItem;
      })
    };
    
    // Validate that userId is present
    if (!orderWithUser.userId) {
      throw new Error('User ID is required to create an order');
    }
    
    console.log('Order data for Firebase:', orderWithUser);
    
    const firebaseOrder = await createOrder(orderWithUser);
    console.log('Firebase order created successfully:', firebaseOrder);
    console.log('Order ID type:', typeof firebaseOrder.id);
    console.log('Order ID value:', firebaseOrder.id);
    console.log('Order userId:', firebaseOrder.userId);

    // Load Razorpay script
    console.log('Loading Razorpay script...');
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load payment gateway');
    }
    console.log('Razorpay script loaded successfully');

    // For Razorpay checkout, we don't need to create an order beforehand
    // Razorpay will handle the order creation when we open the checkout
    // We'll use the amount directly from the order data
    const amountInPaise = Math.round(orderData.total * 100); // Convert to paise and ensure it's an integer

    // Initialize Razorpay options
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR',
      name: 'ANGILU',
      description: 'Purchase from ANGILU',
      prefill: {
        name: orderData.customerName || '',
        email: orderData.customerEmail || '',
        contact: orderData.customerPhone || ''
      },
      notes: {
        firebaseOrderId: firebaseOrder.id,
        userId: orderData.userId
      },
      theme: {
        color: '#000000'
      },
      handler: async (response) => {
        try {
          console.log('Payment successful:', response);
          console.log('Firebase Order ID:', firebaseOrder.id);
          console.log('Firebase Order Data:', firebaseOrder);
          
          // Validate required fields before updating
          if (!firebaseOrder.id) {
            throw new Error('Firebase Order ID is missing');
          }
          
          if (!response.razorpay_payment_id) {
            throw new Error('Razorpay Payment ID is missing');
          }
          
          // Payment successful - update order in Firebase
          console.log('Attempting to update order status...');
          const updateData = {
            paymentStatus: 'paid',
            paymentId: response.razorpay_payment_id,
            paidAt: new Date()
          };
          
          // Only include these fields if they exist in the response
          if (response.razorpay_order_id) {
            updateData.orderId = response.razorpay_order_id;
          }
          
          if (response.razorpay_signature) {
            updateData.signature = response.razorpay_signature;
          }
          
          console.log('Update data:', updateData);
          
          await updateOrderStatus(firebaseOrder.id, 'processing', updateData);
          console.log('Order status updated successfully');

          // Stock is now updated in orderService, no need to update here again
          console.log('Stock already updated in orderService');

          if (onSuccess) {
            onSuccess({
              ...response,
              firebaseOrderId: firebaseOrder.id,
              orderData: firebaseOrder
            });
          }
        } catch (error) {
          console.error('Error updating order after payment:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            firebaseOrderId: firebaseOrder?.id,
            paymentResponse: response
          });
          if (onError) {
            onError(`Payment successful but failed to update order: ${error.message || 'Unknown error'}. Please contact support.`);
          }
        }
      },
      modal: {
        ondismiss: async () => {
          console.log('Payment modal dismissed');
          // Payment modal closed without completion
          try {
            await updateOrderStatus(firebaseOrder.id, 'cancelled', {
              paymentStatus: 'cancelled',
              cancelledAt: new Date(),
              cancellationReason: 'Payment modal closed by user'
            });
          } catch (error) {
            console.error('Error updating order after cancellation:', error);
          }
          
          if (onError) {
            onError('Payment cancelled');
          }
        },
        escape: true,
        handleback: true,
        confirm_close: true,
        animation: 'fade'
      }
    };

    // Create and open Razorpay instance using window.Razorpay
    console.log('Creating Razorpay instance with key:', RAZORPAY_KEY_ID);
    console.log('Razorpay options:', options);
    const razorpay = new window.Razorpay(options);
    console.log('Razorpay instance created, opening...');
    razorpay.open();
    console.log('Razorpay modal opened');

    return {
      id: firebaseOrder.id,
      amount: amountInPaise,
      currency: 'INR'
    };
  } catch (error) {
    console.error('Error initiating payment:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    if (onError) {
      onError(`Failed to initiate payment: ${error.message || 'Unknown error'}`);
    }
    throw error;
  }
};

/**
 * Verify payment signature (should be done on backend in production)
 * @param {Object} paymentData - Payment response data
 * @returns {boolean} Whether payment is valid
 */
export const verifyPayment = (paymentData) => {
  // In production, this verification should be done on your backend
  // This is a simplified version for demo purposes
  return paymentData && 
         paymentData.razorpay_payment_id && 
         paymentData.razorpay_order_id && 
         paymentData.razorpay_signature;
};

/**
 * Process refund (should be done on backend in production)
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Refund amount in paise
 * @returns {Promise} Refund result
 */
export const processRefund = async (paymentId, amount) => {
  try {
    // In production, this should be done on your backend
    // For demo purposes, we'll just return a mock response
    console.log(`Refund initiated for payment ${paymentId}, amount: ${amount}`);
    
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      message: 'Refund processed successfully'
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

/**
 * Get payment methods available
 * @returns {Array} List of available payment methods
 */
export const getPaymentMethods = () => {
  const methods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay via UPI, Credit Card, Debit Card, Net Banking',
      icon: '💳',
      popular: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive the order',
      icon: '💵',
      popular: false
    }
  ];
  
  console.log('Payment methods defined:', methods);
  return methods;
};

export default {
  initiatePayment,
  verifyPayment,
  processRefund,
  getPaymentMethods
};