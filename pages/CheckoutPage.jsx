import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, MapPin, CreditCard, Tag, Check } from 'lucide-react';
import { useAdmin } from '../src/contexts/AdminContext';
import PaymentModal from '../components/PaymentModal';
import { useCart } from '../src/hooks/useCart';
import { clearUserCart } from '../src/firebase/services/cartService';
import { getUserAddresses } from '../src/firebase/services/addressService';
import { validateCoupon, calculateCouponDiscount, applyCouponAfterOrder } from '../src/firebase/services/couponService';
import { calculateShippingEstimates, validatePreOrderItems, formatPreOrderInfo, calculateSubtotals } from '../src/utils/preOrderUtils';

export const CheckoutPage = () => {
  const { user, userData } = useAdmin();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemCount, loading: cartLoading } = useCart();
  
  // Debug logging for checkout page
  useEffect(() => {
    console.log('CheckoutPage: Cart items state:', {
      user: user?.email,
      cartItems,
      cartItemsLength: cartItems.length,
      isAuthenticated: !!user,
      cartLoading
    });
  }, [cartItems, user, cartLoading]);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    // Fetch saved addresses when user is available
    const fetchAddresses = async () => {
      if (user) {
        try {
          const addresses = await getUserAddresses(user.uid);
          setSavedAddresses(addresses);
          
          // If there's a default address, select it
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            setUseNewAddress(false);
            // Map address fields to match checkout format
            setShippingAddress({
              fullName: defaultAddress.name || userData.displayName || '',
              phone: defaultAddress.phone || userData.phone || '',
              address: defaultAddress.address || '',
              city: defaultAddress.city || '',
              state: defaultAddress.state || '',
              pincode: defaultAddress.postcode || '',
              country: defaultAddress.country || 'India'
            });
          } else if (addresses.length > 0) {
            // If no default, select the first address
            setSelectedAddressId(addresses[0].id);
            setUseNewAddress(false);
            setShippingAddress({
              fullName: addresses[0].name || userData.displayName || '',
              phone: addresses[0].phone || userData.phone || '',
              address: addresses[0].address || '',
              city: addresses[0].city || '',
              state: addresses[0].state || '',
              pincode: addresses[0].postcode || '',
              country: addresses[0].country || 'India'
            });
          } else {
            // No saved addresses, use new address form
            setUseNewAddress(true);
            if (userData) {
              setShippingAddress(prev => ({
                ...prev,
                fullName: userData.displayName || '',
                phone: userData.phone || ''
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
          setUseNewAddress(true);
        }
      } else {
        // No user, use new address form
        setUseNewAddress(true);
      }
    };

    fetchAddresses();
  }, [user, userData]);

  // Use utility functions to calculate shipping and subtotals
  const shippingData = calculateShippingEstimates(cartItems);
  const subtotals = calculateSubtotals(cartItems);
  const preOrderValidation = validatePreOrderItems(cartItems);
  
  // Separate regular and pre-order items
  const regularItems = cartItems.filter(item => !item.isPreOrder);
  const preOrderItems = cartItems.filter(item => item.isPreOrder);
  
  // Calculate shipping based on cart composition
  const subtotal = subtotals.totalSubtotal;
  const shipping = 0; // Normal shipping is free
  const shippingInfo = shippingData.shippingInfo;
  const hasPreOrderItems = shippingData.hasPreOrderItems;
  const hasRegularItems = shippingData.hasRegularItems;
  
  const tax = subtotal * 0; // 18% GST
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = async (itemId, change, selectedSize, selectedColor) => {
    try {
      const existingItem = cartItems.find(item =>
        item.id === itemId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      );
      if (!existingItem) return;

      const newQuantity = Math.max(1, existingItem.quantity + change);
      
      // Use the unified cart hook
      await updateQuantity(itemId, newQuantity, selectedSize, selectedColor);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeItem = async (itemId, selectedSize, selectedColor) => {
    try {
      // Use the unified cart hook
      await removeFromCart(itemId, selectedSize, selectedColor);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setShippingAddress({
        fullName: selectedAddress.name || userData?.displayName || '',
        phone: selectedAddress.phone || userData?.phone || '',
        address: selectedAddress.address || '',
        city: selectedAddress.city || '',
        state: selectedAddress.state || '',
        pincode: selectedAddress.postcode || selectedAddress.pincode || selectedAddress.zip || '00000',
        country: selectedAddress.country || 'India'
      });
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId('');
    // Reset form with user data if available
    setShippingAddress({
      fullName: userData?.displayName || '',
      phone: userData?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    });
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      setCouponError('');
      const userEmail = user?.email || userData?.email;
      const discountCalculation = await calculateCouponDiscount(promoCode, userEmail, subtotal, user?.uid);
      
      if (!discountCalculation.valid) {
        setCouponError(discountCalculation.message);
        return;
      }

      setDiscount(discountCalculation.discountAmount);
      setAppliedCoupon(discountCalculation.coupon);
      setCouponError('');
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Failed to apply coupon. Please try again.');
    }
  };

  const removeCoupon = () => {
    setPromoCode('');
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Update coupon usage count after successful payment
      if (appliedCoupon) {
        await applyCouponAfterOrder(appliedCoupon.id);
      }
      
      // Clear cart after successful payment
      if (user) {
        // For logged-in users, clear cart in Firebase
        await clearUserCart(user.uid);
      }
      
      // Navigate to order success page
      window.location.href = '/orders';
      
      // Show success message
      if (response.method === 'COD') {
        alert(response.message);
      } else {
        alert('Payment successful! Your order has been placed.');
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      // Still navigate even if coupon update or cart clear fails
      window.location.href = '/orders';
    }
  };

  const handlePaymentError = (error) => {
    alert(error);
  };

  const proceedToPayment = () => {
    if (!user) {
      alert('Please login to continue with checkout');
      window.location.href = '/login';
      return;
    }

    // Validate shipping address
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'state'];
    // Only require pincode when entering a new address (not for saved addresses)
    if (useNewAddress || !selectedAddressId) {
      requiredFields.push('pincode');
    }
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate that all items have size and color selected
    const itemsWithoutSizeOrColor = cartItems.filter(item => {
      // Check if item has size options but no size selected
      const hasSizeOptions = item.sizes && item.sizes.length > 0;
      const missingSize = hasSizeOptions && !item.selectedSize;
      
      // Check if item has color options but no color selected
      const hasColorOptions = item.colors && item.colors.length > 0;
      const missingColor = hasColorOptions && !item.selectedColor;
      
      return missingSize || missingColor;
    });

    if (itemsWithoutSizeOrColor.length > 0) {
      const itemNames = itemsWithoutSizeOrColor.map(item => item.name).join(', ');
      alert(`Please select size and/or color for the following items: ${itemNames}`);
      return;
    }

    // Prepare order data
    const orderData = {
      items: cartItems.map(item => ({
        ...item,
        price: parseFloat(item.price) || 0
      })),
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress,
      promoCode: promoCode || null,
      orderNotes,
      createdAt: new Date()
    };

    setIsPaymentModalOpen(true);
  };

  // Show loading state while cart is being fetched
  if (cartLoading) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-indigo mx-auto mb-4"></div>
          <p className="text-indigo/60">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message only after loading is complete
  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-indigo mb-4">Your Cart is Empty</h1>
          <p className="text-indigo/60 mb-6">Add some items to your cart to proceed with checkout</p>
          <Link
            to="/collections"
            className="inline-block bg-indigo text-kora px-8 py-3 text-sm uppercase tracking-widest hover:bg-terracotta transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-kora text-indigo pt-2 pb-6 px-6 md:px-12 max-w-[1440px] mx-auto">
      <Link
        to="/collections"
        className="inline-flex items-center gap-2 text-sm text-indigo/60 hover:text-terracotta transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shopping
      </Link>

      <h1 className="font-serif text-4xl md:text-5xl text-indigo mb-4">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Cart Items and Shipping */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cart Items */}
          <div>
            <h2 className="text-xl font-serif text-indigo mb-4">Order Items</h2>
            
            {/* Regular Items */}
            {regularItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-indigo/80 mb-4">Regular Items</h3>
                <div className="space-y-4">
                  {regularItems.map((item) => (
                    <div key={`${item.id}-${(typeof item.selectedSize === 'object' ? item.selectedSize?.size : item.selectedSize) || 'default'}-${item.selectedColor || 'default'}`} className="bg-kora border border-indigo/10 rounded-none p-4 flex gap-4 hover:shadow-md hover:border-indigo/20 transition-all">
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-none border border-indigo/5"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-indigo text-sm mb-1">{item.name}</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.selectedSize && (
                            <span className="text-xs bg-indigo/10 text-indigo px-2 py-1 rounded-none">
                              Size: {typeof item.selectedSize === 'object' ? item.selectedSize.size : item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-xs bg-indigo/10 text-indigo px-2 py-1 rounded-none flex items-center gap-1">
                              Color:
                              <span
                                className="w-3 h-3 rounded-none border border-indigo/30"
                                style={{ backgroundColor: item.selectedColor.toLowerCase().replace(' ', '') }}
                                title={item.selectedColor}
                              ></span>
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-indigo">
                            ₹{(parseFloat(item.discountedPrice || item.price) || 0).toFixed(2)}
                          </p>
                          {item.discountedPrice && (
                            <p className="text-xs text-indigo/50 line-through">
                              ₹{(parseFloat(item.price) || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                          className="text-indigo/40 hover:text-terracotta transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 border border-indigo/20 rounded-none">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:bg-indigo/5 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-indigo" />
                          </button>
                          <span className="text-sm font-medium text-indigo w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:bg-indigo/5 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-indigo" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-terracotta">
                          ₹{((parseFloat(item.discountedPrice || item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pre-order Items */}
            {preOrderItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-4">Pre-order Items</h3>
                <div className="space-y-4">
                  {preOrderItems.map((item) => (
                    <div key={`${item.id}-${(typeof item.selectedSize === 'object' ? item.selectedSize?.size : item.selectedSize) || 'default'}-${item.selectedColor || 'default'}`} className="bg-kora border border-indigo/20 rounded-none p-4 flex gap-4 hover:shadow-md hover:border-indigo/30 transition-all">
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-none border border-indigo/5"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-indigo text-sm mb-1 flex items-center gap-2">
                          {item.name}
                          <span className="text-xs bg-indigo/10 text-indigo px-2 py-1 rounded-none uppercase font-bold tracking-widest">
                            Pre-order
                          </span>
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.selectedSize && (
                            <span className="text-xs bg-indigo/10 text-indigo px-2 py-1 rounded-none">
                              Size: {typeof item.selectedSize === 'object' ? item.selectedSize.size : item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-xs bg-indigo/10 text-indigo px-2 py-1 rounded-none flex items-center gap-1">
                              Color:
                              <span
                                className="w-3 h-3 rounded-none border border-indigo/30"
                                style={{ backgroundColor: item.selectedColor.toLowerCase().replace(' ', '') }}
                                title={item.selectedColor}
                              ></span>
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                        {(() => {
                          const preOrderInfo = formatPreOrderInfo(item);
                          return (
                            <>
                              {preOrderInfo.shippingInfo && (
                                <div className="text-xs text-purple-600 mb-1">
                                  {preOrderInfo.shippingInfo}
                                </div>
                              )}
                              {preOrderInfo.message && (
                                <div className="text-xs text-indigo/50 mb-2 italic">
                                  {preOrderInfo.message}
                                </div>
                              )}
                            </>
                          );
                        })()}
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-indigo">
                            ₹{(parseFloat(item.discountedPrice || item.price) || 0).toFixed(2)}
                          </p>
                          {item.discountedPrice && (
                            <p className="text-xs text-indigo/50 line-through">
                              ₹{(parseFloat(item.price) || 0).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                          className="text-indigo/40 hover:text-terracotta transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 border border-indigo/20 rounded-none">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:bg-indigo/5 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-indigo" />
                          </button>
                          <span className="text-sm font-medium text-indigo w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:bg-indigo/5 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-indigo" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-terracotta">
                          ₹{((parseFloat(item.discountedPrice || item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Shipping Information for Mixed Carts */}
            {shippingInfo && (
              <div className="mt-4 p-4 bg-kora-light border border-indigo/20 rounded-none flex items-start gap-3">
                <p className="text-[11px] uppercase tracking-widest font-bold text-indigo/60">{shippingInfo}</p>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-xl font-serif text-indigo mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            
            {/* Saved Addresses */}
            {user && savedAddresses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-indigo/80 mb-4">Select a saved address</h3>
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-none p-5 cursor-pointer transition-all duration-300 ${
                        selectedAddressId === address.id && !useNewAddress
                          ? 'border-indigo bg-kora-light shadow-md'
                          : 'border-indigo/10 hover:border-indigo/30 bg-kora'
                      }`}
                      onClick={() => handleAddressSelection(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-5 h-5 rounded-none border-2 flex items-center justify-center transition-all ${
                              selectedAddressId === address.id && !useNewAddress
                                ? 'border-indigo bg-indigo shadow-inner'
                                : 'border-indigo/30'
                            }`}>
                              {selectedAddressId === address.id && !useNewAddress && (
                                <Check size={14} className="text-kora" />
                              )}
                            </div>
                            <span className="font-bold text-indigo uppercase tracking-widest text-xs">{address.name}</span>
                            {address.isDefault && (
                              <span className="text-[9px] bg-indigo text-white px-2 py-0.5 rounded-none uppercase tracking-tighter font-black">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-indigo/60 ml-6">
                            <p>{address.address}</p>
                            {address.apartment && <p>{address.apartment}</p>}
                            <p>{address.city}, {address.state} {address.postcode}</p>
                            <p>{address.country}</p>
                            <p>{address.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleUseNewAddress}
                  className={`mt-4 w-full py-4 px-6 rounded-none border-2 border-dashed transition-all duration-300 ${
                    useNewAddress
                      ? 'border-indigo bg-kora-light text-indigo shadow-inner'
                      : 'border-indigo/20 text-indigo/60 hover:border-indigo/40 hover:bg-kora-light/30'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={18} />
                    <span>Use a new address</span>
                  </div>
                </button>
              </div>
            )}
            
            {/* New Address Form */}
            {(!user || savedAddresses.length === 0 || useNewAddress) && (
              <div>
                {user && savedAddresses.length > 0 && (
                  <h3 className="text-sm font-medium text-indigo/80 mb-4">Enter a new address</h3>
                )}
                <div className="bg-kora border border-indigo/10 rounded-none p-5 md:p-6 space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">
                        Name <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">
                        Phone <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo mb-2">
                      Address <span className="text-terracotta">*</span>
                    </label>
                    <textarea
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors resize-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">
                        City <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">
                        State <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo mb-2">
                        Pincode <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                        className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Notes */}
          <div>
            <h2 className="text-xl font-serif text-indigo mb-6">Order Notes (Optional)</h2>
            <div className="bg-kora border border-indigo/10 rounded-none p-5 md:p-6 shadow-sm">
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions for your order..."
                className="w-full px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-kora border border-indigo/10 rounded-none p-6 md:p-8 sticky top-32 shadow-xl">
            <h2 className="text-xl font-serif text-indigo mb-4">Order Summary</h2>
            
            {/* Coupon Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-indigo mb-2">Coupon Code</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 bg-kora border border-indigo/20 rounded-none focus:outline-none focus:border-terracotta transition-colors text-sm"
                    disabled={!!appliedCoupon}
                  />
                  {!appliedCoupon ? (
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-indigo/5 text-indigo text-sm font-medium rounded-none hover:bg-indigo hover:text-kora transition-colors flex items-center gap-1"
                    >
                      <Tag size={16} />
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={removeCoupon}
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-none hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <Check size={16} />
                      Remove
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-red-600 text-sm mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="bg-kora-light border border-indigo/10 rounded-none p-4 mt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Coupon Applied: {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-green-600">
                          {appliedCoupon.description || `${appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `₹${appliedCoupon.discountValue} off`}`}
                        </p>
                      </div>
                      <Check className="text-green-600" size={20} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pre-order Information */}
            {hasPreOrderItems && (
              <div className="mb-6 p-5 bg-kora-light border border-indigo/10 rounded-none">
                <h4 className="font-medium text-purple-800 mb-2">Pre-order Information</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Pre-order items will be shipped on their expected dates</li>
                  <li>• You will be notified when pre-order items are ready to ship</li>
                  <li>• Payment is processed at the time of order</li>
                  {hasRegularItems && <li>• Regular items will be shipped separately</li>}
                </ul>
              </div>
            )}
            
            {/* Standard Shipping Information */}
            {!hasPreOrderItems && (
              <div className="mb-6 p-4 bg-indigo/5 border border-indigo/10 rounded-none flex items-start gap-3">
                <p className="text-sm font-medium text-indigo">Items will be shipped in 5-7 days.</p>
              </div>
            )}
            
            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b border-indigo/10">
              <div className="flex justify-between text-sm">
                <span className="text-indigo/70">Subtotal:</span>
                <span className="font-medium text-indigo">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo/70">Shipping:</span>
                <span className="font-medium text-green-600">
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo/70">Tax:</span>
                <span className="font-medium text-indigo">₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-serif text-indigo">Total:</span>
              <span className="text-2xl font-bold text-terracotta">₹{total.toFixed(2)}</span>
            </div>

            {/* Proceed Button */}
            <button
              onClick={proceedToPayment}
              className="btn-slide w-full bg-indigo text-kora py-3 rounded-none font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <CreditCard size={20} style={{ position: 'relative', zIndex: 2 }} />
              <span style={{ position: 'relative', zIndex: 2 }}>Proceed to Payment</span>
            </button>

            <p className="text-xs text-center text-indigo/50 mt-4">
              Secure checkout powered by Razorpay<br />
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={{
          items: cartItems,
          subtotal,
          shipping,
          tax,
          discount,
          total,
          shippingAddress,
          promoCode,
          orderNotes
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default CheckoutPage;





