import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import firebaseListenerManager from '../utils/firebaseListenerManager';
import { getUserCart } from '../firebase/services/cartService';

/**
 * Hook for real-time cart data synchronization
 * Provides real-time updates to cart data without manual refreshes
 */
export const useRealtimeCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAdmin();
  const unsubscribeRef = useRef(null);
  const componentId = useRef(`useRealtimeCart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const isInitializedRef = useRef(false);

  /**
   * Setup real-time listener for user's cart
   */
  const setupCartListener = useCallback(async () => {
    if (!user?.uid) {
      // Guest user: load from localStorage
      try {
        const { getGuestCart } = await import('../firebase/services/guestCartService');
        const guestCart = getGuestCart();
        setCartItems(guestCart || []);
      } catch (e) {
        console.error('Error loading guest cart:', e);
        setCartItems([]);
      }
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Clean up any existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // First, do an initial fetch to populate cart immediately
    try {
      const initialCart = await getUserCart(user.uid);
      setCartItems(Array.isArray(initialCart) ? initialCart : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial cart:', error);
      setCartItems([]);
      setError(error.message);
      setLoading(false);
      return;
    }

    // Then set up real-time listener
    unsubscribeRef.current = firebaseListenerManager.subscribe(
      componentId.current,
      'cart',
      { userId: user.uid },
      (cartData) => {
        const normalizedCartData = Array.isArray(cartData) ? cartData.map(item => ({
          id: item.id,
          name: item.name || 'Unknown Product',
          price: parseFloat(item.price) || 0,
          discountedPrice: item.discountedPrice ? parseFloat(item.discountedPrice) : null,
          image: item.image || item.images?.[0],
          quantity: parseInt(item.quantity) || 1,
          selectedSize: (typeof item.selectedSize === 'object' && item.selectedSize !== null) ? item.selectedSize.size : (item.selectedSize || null),
          selectedColor: item.selectedColor || null,
          stock: parseInt(item.stock) || 0,
          sizes: Array.isArray(item.sizes) ? item.sizes : [],
          colors: Array.isArray(item.colors) ? item.colors : []
        })) : [];
        
        setCartItems(normalizedCartData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Real-time cart listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
  }, [user?.uid]);

  /**
   * Manually refresh cart data
   */
  const refreshCart = useCallback(() => {
    setupCartListener();
  }, [setupCartListener]);

  /**
   * Calculate cart total
   */
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.discountedPrice || item.price || 0;
      return total + (price * (item.quantity || 1));
    }, 0);
  }, [cartItems]);

  /**
   * Get cart item count
   */
  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  }, [cartItems]);

  /**
   * Check if product is in cart
   */
  const isProductInCart = useCallback((productId, selectedSize, selectedColor) => {
    return cartItems.some(item => 
      item.id === productId &&
      (item.selectedSize || '') === (selectedSize || '') &&
      (item.selectedColor || '') === (selectedColor || '')
    );
  }, [cartItems]);

  /**
   * Get cart item quantity
   */
  const getItemQuantity = useCallback((productId, selectedSize, selectedColor) => {
    const item = cartItems.find(item => 
      item.id === productId &&
      (item.selectedSize || '') === (selectedSize || '') &&
      (item.selectedColor || '') === (selectedColor || '')
    );
    return item?.quantity || 0;
  }, [cartItems]);

  // Setup listener when user changes
  useEffect(() => {
    // Reset initialization flag when user changes
    if (!user?.uid) {
      isInitializedRef.current = false;
      setupCartListener(); // Still setup even for guest to load local storage
      return;
    }
    
    // Always set up listener when user changes
    setupCartListener();
    isInitializedRef.current = true;

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      firebaseListenerManager.unsubscribeAll(componentId.current);
      isInitializedRef.current = false;
    };
  }, [user?.uid, setupCartListener]);

  return {
    cartItems,
    loading,
    error,
    refreshCart,
    getCartTotal,
    getCartItemCount,
    isProductInCart,
    getItemQuantity
  };
};

/**
 * Hook for real-time wishlist data synchronization
 * Provides real-time updates to wishlist data without manual refreshes
 */
export const useRealtimeWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAdmin();
  const unsubscribeRef = useRef(null);
  const componentId = useRef(`useRealtimeWishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  /**
   * Setup real-time listener for user's wishlist
   */
  const setupWishlistListener = useCallback(async () => {
    if (!user?.uid) {
      // Guest user: load from localStorage
      try {
        const { getGuestWishlist } = await import('../firebase/services/guestWishlistService');
        const guestWishlist = getGuestWishlist();
        setWishlistItems(guestWishlist || []);
      } catch (e) {
        console.error('Error loading guest wishlist:', e);
        setWishlistItems([]);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Clean up any existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe using the centralized manager
    unsubscribeRef.current = firebaseListenerManager.subscribe(
      componentId.current,
      'wishlist',
      { userId: user.uid },
      (wishlistData) => {
        setWishlistItems(wishlistData || []);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Real-time wishlist listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
  }, [user?.uid]);

  /**
   * Manually refresh wishlist data
   */
  const refreshWishlist = useCallback(() => {
    setupWishlistListener();
  }, [setupWishlistListener]);

  /**
   * Check if product is in wishlist
   */
  const isProductInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  /**
   * Get wishlist item count
   */
  const getWishlistItemCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  // Setup listener when user changes
  useEffect(() => {
    setupWishlistListener();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      firebaseListenerManager.unsubscribeAll(componentId.current);
    };
  }, [setupWishlistListener]);

  return {
    wishlistItems,
    loading,
    error,
    refreshWishlist,
    isProductInWishlist,
    getWishlistItemCount
  };
};