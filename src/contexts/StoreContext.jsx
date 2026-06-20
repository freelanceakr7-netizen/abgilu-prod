import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAdmin } from './AdminContext';
import { useRealtimeCart, useRealtimeWishlist } from '../hooks/useRealtimeCart';
import { 
  getGuestCart, 
  addToGuestCart, 
  updateGuestCartItemQuantity, 
  removeFromGuestCart,
  getGuestCartTotal,
  getGuestCartItemCount,
  isProductInGuestCart,
  getGuestCartItemQuantity,
  migrateGuestCartToUserCart,
  clearGuestCart
} from '../firebase/services/guestCartService';
import {
  getGuestWishlist,
  addToGuestWishlist,
  removeFromGuestWishlist,
  toggleGuestWishlist,
  clearGuestWishlist
} from '../firebase/services/guestWishlistService';
import { 
  addToUserCart, 
  updateCartItemQuantity as updateUserCartItemQuantity, 
  removeFromUserCart as removeFromUserCartService,
  toggleUserWishlist,
  addToUserWishlist,
  removeFromUserWishlist,
  getUserWishlist
} from '../firebase/services/cartService';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { user } = useAdmin();
  
  // Real-time state for authenticated users
  const { 
    cartItems: userCart, 
    loading: userCartLoading, 
    error: userCartError,
    refreshCart: refreshUserCart,
    getCartTotal: getUserCartTotal,
    getCartItemCount: getUserCartItemCount,
    isProductInCart: isProductInUserCart,
    getItemQuantity: getUserItemQuantity
  } = useRealtimeCart();

  const { 
    wishlistItems: userWishlist, 
    loading: userWishlistLoading, 
    error: userWishlistError,
    refreshWishlist: refreshUserWishlist,
    getWishlistItemCount: getUserWishlistCount,
    isProductInWishlist: isItemInUserWishlist
  } = useRealtimeWishlist();

  // Local state for guests
  const [guestCart, setGuestCart] = useState([]);
  const [guestWishlist, setGuestWishlist] = useState([]);
  const [guestLoading, setGuestLoading] = useState(true);
  
  // UI State for sidebars
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Initialize guest state
  useEffect(() => {
    if (!user) {
      setGuestCart(getGuestCart());
      setGuestWishlist(getGuestWishlist());
      setGuestLoading(false);
    } else {
      // Auto-migrate guest items when user logs in
      const performMigration = async () => {
        try {
          const currentGuestCart = getGuestCart();
          const currentGuestWishlist = getGuestWishlist();

          if (currentGuestCart.length > 0) {
            console.log('Migrating guest cart to user cart...');
            await migrateGuestCartToUserCart(user.uid, addToUserCart);
            clearGuestCart();
            setGuestCart([]);
          }

          if (currentGuestWishlist.length > 0) {
            console.log('Migrating guest wishlist to user wishlist...');
            for (const item of currentGuestWishlist) {
              await addToUserWishlist(user.uid, item);
            }
            clearGuestWishlist();
            setGuestWishlist([]);
          }
          
          // Force a refresh of the user cart if needed
          if (currentGuestCart.length > 0) {
            refreshUserCart();
          }
        } catch (error) {
          console.error('Migration error:', error);
        }
      };
      
      performMigration();
    }
  }, [user, refreshUserCart]);

  // Unified derived values
  const cartItems = user ? userCart : guestCart;
  const wishlistItems = user ? userWishlist : guestWishlist;
  const loading = user ? (userCartLoading || userWishlistLoading) : guestLoading;

  // --- Cart Actions ---
  const addToCart = async (product) => {
    if (user) {
      await addToUserCart(user.uid, product);
    } else {
      const updated = await addToGuestCart(product);
      setGuestCart(updated);
    }
    // Auto-open cart when item is added
    setIsCartOpen(true);
  };

  const updateQuantity = async (productId, quantity, selectedSize, selectedColor) => {
    if (user) {
      await updateUserCartItemQuantity(user.uid, productId, quantity, selectedSize, selectedColor);
    } else {
      const updated = await updateGuestCartItemQuantity(productId, quantity, selectedSize, selectedColor);
      setGuestCart(updated);
    }
  };

  const removeFromCart = async (productId, selectedSize, selectedColor) => {
    if (user) {
      await removeFromUserCartService(user.uid, productId, selectedSize, selectedColor);
    } else {
      const updated = await removeFromGuestCart(productId, selectedSize, selectedColor);
      setGuestCart(updated);
    }
  };

  const getCartTotal = () => {
    if (user) return getUserCartTotal();
    return getGuestCartTotal();
  };

  const getCartItemCount = () => {
    if (user) return getUserCartItemCount();
    return getGuestCartItemCount();
  };

  const isProductInCart = (productId, selectedSize, selectedColor) => {
    if (user) return isProductInUserCart(productId, selectedSize, selectedColor);
    return isProductInGuestCart(productId, selectedSize, selectedColor);
  };

  const getItemQuantity = (productId, selectedSize, selectedColor) => {
    if (user) return getUserItemQuantity(productId, selectedSize, selectedColor);
    return getGuestCartItemQuantity(productId, selectedSize, selectedColor);
  };

  // --- Wishlist Actions ---
  const toggleWishlist = async (product) => {
    if (user) {
      return await toggleUserWishlist(user.uid, product);
    } else {
      const result = await toggleGuestWishlist(product);
      setGuestWishlist(getGuestWishlist());
      return result;
    }
  };

  const getWishlistItemCount = () => {
    if (user) return getUserWishlistCount();
    return guestWishlist.length;
  };

  const isItemInWishlist = (productId) => {
    if (user) return isItemInUserWishlist(productId);
    return guestWishlist.some(item => item.id === productId);
  };

  const addToWishlist = async (item) => {
    if (user) {
      await addToUserWishlist(user.uid, item);
    } else {
      await addToGuestWishlist(item);
      setGuestWishlist(getGuestWishlist());
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (user) {
      await removeFromUserWishlist(user.uid, itemId);
    } else {
      await removeFromGuestWishlist(itemId);
      setGuestWishlist(getGuestWishlist());
    }
  };

  const clearWishlist = async () => {
    if (user) {
      // In cartService, we might need a way to clear the entire wishlist
      // For now, removing each might be slow, but let's assume we can save empty array
      // await saveUserWishlist(user.uid, []); // Need to check if this exists
    } else {
      await clearGuestWishlist();
      setGuestWishlist([]);
    }
  };

  const value = {
    cartItems,
    wishlistItems,
    loading,
    error: userCartError || userWishlistError,
    // Cart
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
    isProductInCart,
    getItemQuantity,
    refreshCart: refreshUserCart,
    // Wishlist
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistItemCount,
    isItemInWishlist,
    refreshWishlist: refreshUserWishlist,
    // UI Toggles
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
