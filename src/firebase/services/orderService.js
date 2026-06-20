import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config';
import { updateProductStock, updatePreOrderStock, getProductById } from './productService';

const ORDERS_COLLECTION = 'orders';

// Create new order
export const createOrder = async (orderData) => {
  try {
    console.log('createOrder called with:', orderData);
    
    if (!orderData) {
      throw new Error('Order data is required');
    }
    
    // Process items to ensure pre-order information is included
    const processedItems = [];
    for (const item of orderData.items || []) {
      // Get product details to check if it's a pre-order
      const product = await getProductById(item.id);
      
      const processedItem = {
        ...item,
        isPreOrder: product?.isPreOrder || false,
        expectedShippingDate: product?.expectedShippingDate || null,
        preOrderMessage: product?.preOrderMessage || ''
      };
      
      processedItems.push(processedItem);
    }
    
    // Create the order first without transaction to avoid permission issues
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const newOrder = {
      ...orderData,
      items: processedItems,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: orderData.status || 'processing',
      // Add pre-order specific fields
      hasPreOrderItems: processedItems.some(item => item.isPreOrder)
    };
    
    const docRef = await addDoc(ordersRef, newOrder);
    const createdOrder = { id: docRef.id, ...newOrder };
    
    // Then update stock separately
    try {
      for (const item of processedItems) {
        if (item.isPreOrder) {
          // Update pre-order stock for pre-order items
          await updatePreOrderStock(item.id, -item.quantity);
        } else {
          // Update regular stock for regular items, passing the selected size if available
          await updateProductStock(item.id, -item.quantity, item.selectedSize);
        }
      }
      console.log('Stock updated for all items');
    } catch (stockError) {
      console.error('Error updating stock:', stockError);
      // Continue even if stock update fails
    }
    
    // Update order statistics asynchronously
    try {
      updateOrderStatistics().catch(error => {
        console.error('Error updating order statistics:', error);
        // Don't fail the order creation if statistics update fails
      });
    } catch (statsError) {
      console.error('Error triggering order statistics update:', statsError);
    }
    
    console.log('Order created with ID:', createdOrder.id);
    console.log('Stock updated for all items');
    
    return createdOrder;
  } catch (error) {
    console.error('Error in createOrder:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      orderData
    });
    throw error;
  }
};

// Get all orders (for admin)
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    throw error;
  }
};

// Get paginated orders (for admin with server-side pagination)
export const getPaginatedOrders = async (pageSize, startAfterDoc = null, filters = {}) => {
  try {
    const { searchTerm, statusFilter } = filters;
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const queryConstraints = [];

    // Add status filter if specified
    if (statusFilter && statusFilter !== 'all') {
      queryConstraints.push(where('status', '==', statusFilter));
    }

    // Add ordering (must come before startAfter)
    queryConstraints.push(orderBy('createdAt', 'desc'));

    // Add pagination
    if (startAfterDoc) {
      queryConstraints.push(startAfter(startAfterDoc));
    }
    queryConstraints.push(limit(pageSize));

    const q = query(ordersRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    const orders = [];
    let lastDoc = null;

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
      lastDoc = doc;
    });

    // Apply search filter client-side (since Firebase doesn't support partial string matching)
    let filteredOrders = orders;
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchLower)
      );
    }

    // Determine if there are more pages
    // If we got fewer orders than requested, we're on the last page
    // If we got exactly pageSize orders, there might be more
    const hasMore = orders.length === pageSize;

    return {
      orders: filteredOrders,
      lastDoc,
      hasMore,
      totalFetched: orders.length
    };
  } catch (error) {
    console.error('Error in getPaginatedOrders:', error);
    throw error;
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userId) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      return { id: orderDoc.id, ...orderDoc.data() };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status, additionalData = {}) => {
  try {
    console.log('updateOrderStatus called with:', { orderId, status, additionalData });
    
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    
    // First, get the current order to ensure we preserve the userId
    console.log('Fetching current order to preserve userId...');
    const currentOrder = await getOrderById(orderId);
    console.log('Current order:', currentOrder);
    
    if (!currentOrder.userId) {
      throw new Error('Order does not have a userId - this should not happen');
    }
    
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    console.log('Order reference created:', orderRef.path);
    
    const updateData = {
      status,
      updatedAt: new Date(),
      userId: currentOrder.userId, // Ensure userId is preserved
      ...additionalData
    };
    
    console.log('Update data prepared:', updateData);
    
    // Add timestamp and invoice data for specific status changes
    if (status === 'shipped' && !additionalData.shippedAt) {
      updateData.shippedAt = new Date();
      // Automatic Invoice Generation Logic
      updateData.invoiceGenerated = true;
      updateData.invoiceDate = new Date();
      // Generate a clean invoice number: INV-ORDID(short)-TIMESTAMP(short)
      const shortId = orderId.substring(0, 6).toUpperCase();
      const timeStamp = Date.now().toString().slice(-4);
      updateData.invoiceNumber = `INV-${shortId}-${timeStamp}`;
    } else if (status === 'delivered' && !additionalData.deliveredAt) {
      updateData.deliveredAt = new Date();
    }
    
    console.log('Attempting to update document...');
    await updateDoc(orderRef, updateData);
    console.log('Document updated successfully');
    
    // Update order statistics asynchronously
    try {
      updateOrderStatistics().catch(error => {
        console.error('Error updating order statistics:', error);
        // Don't fail the order status update if statistics update fails
      });
    } catch (statsError) {
      console.error('Error triggering order statistics update:', statsError);
    }
    
    // Return updated order
    console.log('Fetching updated order...');
    const updatedOrder = await getOrderById(orderId);
    console.log('Updated order retrieved:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      orderId,
      status
    });
    throw error;
  }
};

// Update order tracking information
export const updateOrderTracking = async (orderId, trackingNumber, carrier = '') => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    
    await updateDoc(orderRef, {
      trackingNumber,
      carrier,
      status: 'shipped',
      shippedAt: new Date(),
      updatedAt: new Date()
    });
    
    return await getOrderById(orderId);
  } catch (error) {
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId, reason = '') => {
  try {
    // Use a transaction to ensure stock is restored atomically with order cancellation
    const updatedOrder = await runTransaction(db, async (transaction) => {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      const orderDoc = await transaction.get(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      
      const order = orderDoc.data();
      
      // Only restore stock if the order is not already cancelled
      if (order.status !== 'cancelled') {
        // Restore stock for each item
        for (const item of order.items || []) {
          const productRef = doc(db, 'products', item.id);
          const productDoc = await transaction.get(productRef);
          
          if (productDoc.exists()) {
            const product = productDoc.data();
            
            if (item.isPreOrder) {
              // Restore pre-order stock for pre-order items
              const currentPreOrderStock = product.preOrderStock || 0;
              const newPreOrderStock = currentPreOrderStock + item.quantity;
              
              transaction.update(productRef, {
                preOrderStock: newPreOrderStock,
                updatedAt: new Date()
              });
            } else if (item.selectedSize && Array.isArray(product.sizes)) {
              // Restore size-specific stock
              const updatedSizes = product.sizes.map(s => {
                if (typeof s === 'object' && s.size === item.selectedSize) {
                  return { ...s, stock: (s.stock || 0) + item.quantity };
                }
                return s;
              });

              // Recalculate total stock
              const totalStock = updatedSizes.reduce((sum, s) => {
                return sum + (typeof s === 'object' ? (parseInt(s.stock) || 0) : 0);
              }, 0);

              transaction.update(productRef, {
                sizes: updatedSizes,
                stock: totalStock,
                updatedAt: new Date()
              });
            } else {
              // Restore regular stock for legacy items
              const currentStock = product.stock || 0;
              const newStock = currentStock + item.quantity;
              
              transaction.update(productRef, {
                stock: newStock,
                updatedAt: new Date()
              });
            }
          }
        }
      }
      
      // Update the order status
      transaction.update(orderRef, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        updatedAt: new Date()
      });
      
      return { id: orderId, ...order, status: 'cancelled', cancellationReason: reason };
    });
    
    // Update order statistics asynchronously
    try {
      updateOrderStatistics().catch(error => {
        console.error('Error updating order statistics:', error);
        // Don't fail the order cancellation if statistics update fails
      });
    } catch (statsError) {
      console.error('Error triggering order statistics update:', statsError);
    }
    
    console.log('Order cancelled with ID:', orderId);
    console.log('Stock restored for all items');
    
    return updatedOrder;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// Get orders by status
export const getOrdersByStatus = async (status) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    throw error;
  }
};

// Get order statistics (for admin dashboard)
export const getOrderStatistics = async () => {
  try {
    // First try to get from the statistics collection
    const statsRef = doc(db, 'statistics', 'orders');
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
      return statsDoc.data();
    }
    
    // Fallback to calculation if statistics document doesn't exist
    return await calculateOrderStatistics();
  } catch (error) {
    console.error('Error getting order statistics:', error);
    // Fallback to direct calculation if statistics read fails
    return await calculateOrderStatistics();
  }
};

// Calculate order statistics from all orders (fallback function)
export const calculateOrderStatistics = async () => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const querySnapshot = await getDocs(ordersRef);
    
    const stats = {
      total: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
      lastUpdated: new Date()
    };
    
    querySnapshot.forEach((doc) => {
      const order = doc.data();
      stats.total++;
      
      // Count by status
      if (stats[order.status] !== undefined) {
        stats[order.status]++;
      }
      
      // Calculate total revenue (only from delivered orders)
      if (order.status === 'delivered' && order.total) {
        stats.totalRevenue += order.total;
      }
    });
    
    // Update the statistics collection for future queries
    try {
      const statsRef = doc(db, 'statistics', 'orders');
      await setDoc(statsRef, stats);
    } catch (updateError) {
      console.error('Error updating statistics collection:', updateError);
      // Don't fail the function if statistics update fails
    }
    
    return stats;
  } catch (error) {
    throw error;
  }
};

// Update order statistics (to be called when orders change)
export const updateOrderStatistics = async () => {
  try {
    const stats = await calculateOrderStatistics();
    return stats;
  } catch (error) {
    console.error('Error updating order statistics:', error);
    throw error;
  }
};

// Get recent orders (for admin dashboard)
export const getRecentOrders = async (limitCount = 10) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      orderBy('createdAt', 'desc'), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    throw error;
  }
};

// Delete order (admin only)
export const deleteOrder = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderRef);
    return true;
  } catch (error) {
    throw error;
  }
};