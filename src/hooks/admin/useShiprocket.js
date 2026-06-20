import { useState, useEffect } from 'react';
import {
  authenticateShiprocket,
  isShiprocketAuthenticated,
  logoutShiprocket,
  getShiprocketOrders,
  createShiprocketOrder,
  checkCourierServiceability,
  createShipment,
  getPickupLocations,
  createPickupLocation
} from '../../firebase/services/shiprocketService';

export const useShiprocket = () => {
  const [shiprocketAuthenticated, setShiprocketAuthenticated] = useState(false);
  const [shiprocketOrders, setShiprocketOrders] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pickupLocations, setPickupLocations] = useState([
    {
      id: '1',
      pickup_code: 'DEFAULT001',
      pickup_location: 'Default Warehouse',
      name: 'Main Warehouse',
      address: '123 Storage Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin_code: '400001',
      phone: '+91 9876543210',
      email: 'warehouse@example.com'
    }
  ]);

  const fetchPickupLocationsFromApi = async () => {
    try {
      const locationsData = await getPickupLocations();
      if (locationsData && locationsData.data && locationsData.data.length > 0) {
        setPickupLocations(locationsData.data);
      }
    } catch (error) {
      console.error('Error fetching pickup locations:', error);
    }
  };

  useEffect(() => {
    const isAuth = isShiprocketAuthenticated();
    setShiprocketAuthenticated(isAuth);
    if (isAuth) {
      fetchPickupLocationsFromApi();
    }
  }, []);

  const handleShiprocketAuth = async (email, password) => {
    setIsAuthenticating(true);
    try {
      await authenticateShiprocket(email, password);
      setShiprocketAuthenticated(true);
      await fetchShiprocketOrders();
      await fetchPickupLocationsFromApi();
      return { success: true };
    } catch (error) {
      console.error('Shiprocket authentication error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleShiprocketLogout = () => {
    logoutShiprocket();
    setShiprocketAuthenticated(false);
    setShiprocketOrders([]);
  };

  const fetchShiprocketOrders = async () => {
    try {
      const ordersData = await getShiprocketOrders();
      setShiprocketOrders(ordersData.data || []);
      return { success: true };
    } catch (error) {
      console.error('Error fetching Shiprocket orders:', error);
      return { success: false, error: error.message };
    }
  };

  const calculateShippingRates = async (selectedEcommerceOrder, selectedPickupLocation) => {
    if (!selectedEcommerceOrder || !selectedPickupLocation) {
      return { success: false, error: 'Missing order or pickup location' };
    }
    
    // Validate pincode before making API call
    const deliveryPincode = selectedEcommerceOrder.shippingAddress?.pincode;
    const pickupPincode = selectedPickupLocation.pin_code;
    
    if (!deliveryPincode || deliveryPincode.length < 3) {
      return { success: false, error: 'Invalid delivery pincode' };
    }
    
    if (!pickupPincode || pickupPincode.length < 3) {
      return { success: false, error: 'Invalid pickup location pincode' };
    }
    
    try {
      // Calculate weight from order items
      const totalWeight = selectedEcommerceOrder.items?.reduce((sum, item) => {
        return sum + (item.weight || 0.5) * (item.quantity || 1); // Default 0.5kg per item if not specified
      }, 0);
      
      const params = {
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
        cod: 0, // Assuming prepaid orders
        weight: totalWeight
      };
      
      const response = await checkCourierServiceability(params);
      if (response.data && response.data.available_courier_companies) {
        return { success: true, data: response.data.available_courier_companies };
      }
      return { success: false, error: 'No couriers available' };
    } catch (error) {
      console.error('Error calculating shipping rates:', error);
      return { success: false, error: error.message };
    }
  };

  const handleCreateShipment = async (selectedEcommerceOrder, selectedPickupLocation, selectedCourier) => {
    if (!selectedEcommerceOrder || !selectedPickupLocation || !selectedCourier) {
      return { success: false, error: 'Missing required information' };
    }
    
    // Validate shipping address
    const shippingAddress = selectedEcommerceOrder.shippingAddress;
    const requiredShippingFields = ['address', 'city', 'state', 'pincode', 'phone'];
    const missingShippingFields = requiredShippingFields.filter(field => !shippingAddress || !shippingAddress[field]);
    
    // Check for both name and fullName for backward compatibility
    const hasName = shippingAddress?.fullName || shippingAddress?.name;
    if (!hasName) {
      missingShippingFields.push('name');
    }
    
    if (missingShippingFields.length > 0) {
      return { 
        success: false, 
        error: 'Please add complete shipping address first (name, address, city, state, pincode, and phone are required)' 
      };
    }
    
    // Validate billing address
    const billingAddress = selectedEcommerceOrder.billingAddress;
    const requiredBillingFields = ['address', 'city', 'state', 'pincode', 'phone'];
    
    // If billing address exists, validate it
    if (billingAddress) {
      const missingBillingFields = requiredBillingFields.filter(field => !billingAddress[field]);
      
      // Check for both name and fullName for backward compatibility
      const hasBillingName = billingAddress?.fullName || billingAddress?.name;
      if (!hasBillingName) {
        missingBillingFields.push('name');
      }
      
      if (missingBillingFields.length > 0) {
        return { 
          success: false, 
          error: 'Please add complete billing address first (name, address, city, state, pincode, and phone are required)' 
        };
      }
    }
    // If billing address doesn't exist, we'll fall back to shipping address (which is already validated above)
    
    try {
      // Determine if billing address is the same as shipping address
      // billing address is considered same as shipping if:
      // 1. It doesn't exist or is incomplete, OR
      // 2. It exists and matches the shipping address
      const hasBillingAddress = selectedEcommerceOrder.billingAddress && 
        selectedEcommerceOrder.billingAddress.address &&
        selectedEcommerceOrder.billingAddress.city &&
        selectedEcommerceOrder.billingAddress.state &&
        selectedEcommerceOrder.billingAddress.pincode;
      
      let shippingIsBilling = !hasBillingAddress;
      
      // If both addresses exist, check if they are the same
      if (hasBillingAddress && selectedEcommerceOrder.shippingAddress) {
        const billing = selectedEcommerceOrder.billingAddress;
        const shipping = selectedEcommerceOrder.shippingAddress;
        
        // Normalize names (check both name and fullName fields)
        const billingName = billing.fullName || billing.name || '';
        const shippingName = shipping.fullName || shipping.name || '';
        
        // Compare key address fields
        const addressesMatch = 
          billingName === shippingName &&
          billing.address === shipping.address &&
          (billing.address_2 || '') === (shipping.address_2 || '') &&
          billing.city === shipping.city &&
          billing.state === shipping.state &&
          billing.pincode === shipping.pincode &&
          billing.phone === shipping.phone;
        
        if (addressesMatch) {
          shippingIsBilling = true;
        }
      }
      
      // Format order data according to Shiprocket API specification
      const orderData = {
        order_id: `ECOM_${selectedEcommerceOrder.id}_${Date.now()}`, // Unique order ID
        order_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        pickup_location: selectedPickupLocation.pickup_code,
        billing_customer_name: selectedEcommerceOrder.customerName || selectedEcommerceOrder.billingAddress?.fullName || selectedEcommerceOrder.billingAddress?.name || selectedEcommerceOrder.shippingAddress?.fullName || selectedEcommerceOrder.shippingAddress?.name || '',
        billing_last_name: '', // Optional
        billing_address: selectedEcommerceOrder.billingAddress?.address || selectedEcommerceOrder.shippingAddress?.address || '',
        billing_address_2: selectedEcommerceOrder.billingAddress?.address_2 || selectedEcommerceOrder.shippingAddress?.address_2 || '',
        billing_city: selectedEcommerceOrder.billingAddress?.city || selectedEcommerceOrder.shippingAddress?.city || '',
        billing_state: selectedEcommerceOrder.billingAddress?.state || selectedEcommerceOrder.shippingAddress?.state || '',
        billing_country: selectedEcommerceOrder.billingAddress?.country || selectedEcommerceOrder.shippingAddress?.country || 'India',
        billing_pincode: selectedEcommerceOrder.billingAddress?.pincode || selectedEcommerceOrder.shippingAddress?.pincode || '',
        billing_email: selectedEcommerceOrder.customerEmail || '',
        billing_phone: selectedEcommerceOrder.billingAddress?.phone || selectedEcommerceOrder.shippingAddress?.phone || '',
        billing_alternate_phone: '', // Optional
        shipping_is_billing: shippingIsBilling, // Set to true when billing is same as shipping
        shipping_customer_name: selectedEcommerceOrder.shippingAddress?.fullName || selectedEcommerceOrder.shippingAddress?.name || selectedEcommerceOrder.customerName || '',
        shipping_last_name: '', // Optional
        shipping_address: selectedEcommerceOrder.shippingAddress?.address || '',
        shipping_address_2: selectedEcommerceOrder.shippingAddress?.address_2 || '',
        shipping_city: selectedEcommerceOrder.shippingAddress?.city || '',
        shipping_state: selectedEcommerceOrder.shippingAddress?.state || '',
        shipping_country: selectedEcommerceOrder.shippingAddress?.country || 'India',
        shipping_pincode: selectedEcommerceOrder.shippingAddress?.pincode || '',
        shipping_email: selectedEcommerceOrder.customerEmail || '',
        shipping_phone: selectedEcommerceOrder.shippingAddress?.phone || '',
        order_items: selectedEcommerceOrder.items?.map(item => ({
          name: item.name,
          sku: item.sku || `SKU_${item.id}`,
          units: item.quantity || 1,
          selling_price: item.price || 0,
          discount: item.discount || 0,
          tax: item.tax || 0,
          hsn: item.hsn || '' // Optional
        })) || [],
        payment_method: selectedEcommerceOrder.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
        shipping_charges: selectedCourier.rate || 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: selectedEcommerceOrder.discount || 0,
        sub_total: selectedEcommerceOrder.subtotal || selectedEcommerceOrder.total || 0,
        length: 10, // Default dimensions
        breadth: 10,
        height: 5,
        weight: selectedEcommerceOrder.items?.reduce((sum, item) => sum + (item.weight || 0.5) * (item.quantity || 1), 0) || 1,
        ewaybill_no: '', // Optional
        customer_gstin: '', // Optional
        invoice_number: '', // Optional
        order_type: '' // Optional
      };
      
      // Create order first
      const orderResponse = await createShiprocketOrder(orderData);
      
      if (orderResponse.data && orderResponse.data.order_id) {
        // Then create shipment for the order with selected courier
        const shipmentResponse = await createShipment(orderResponse.data.order_id, selectedCourier.courier_id);
        
        if (shipmentResponse.data) {
          return {
            success: true,
            data: {
              orderResponse: orderResponse.data,
              shipmentResponse: shipmentResponse.data
            }
          };
        }
      }
      return { success: false, error: 'Failed to create shipment' };
    } catch (error) {
      console.error('Error creating shipment:', error);
      return { success: false, error: error.message };
    }
  };

  const addPickupLocation = async (newLocation) => {
    try {
      // First create it in Shiprocket
      const response = await createPickupLocation(newLocation);
      
      // Then fetch the updated list to ensure we have the correct data
      await fetchPickupLocationsFromApi();
      return { success: true };
    } catch (error) {
      console.error('Error adding pickup location:', error);
      
      // Fallback: add to local state if API fails but we still want to test
      const locationWithId = {
        id: Date.now().toString(),
        ...newLocation,
        pickup_location: newLocation.pickup_code || newLocation.pickup_location
      };
      setPickupLocations([...pickupLocations, locationWithId]);
      
      return { success: false, error: error.message || 'Failed to add to Shiprocket, added locally only' };
    }
  };

  return {
    shiprocketAuthenticated,
    shiprocketOrders,
    isAuthenticating,
    pickupLocations,
    handleShiprocketAuth,
    handleShiprocketLogout,
    fetchShiprocketOrders,
    calculateShippingRates,
    handleCreateShipment,
    addPickupLocation
  };
};