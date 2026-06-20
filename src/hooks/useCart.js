import { useStore } from '../contexts/StoreContext';

/**
 * Compatibility wrapper around the global StoreContext for Cart functionality.
 * This ensures all components use the same shared state.
 */
export const useCart = () => {
  const store = useStore();
  
  return {
    cartItems: store.cartItems,
    loading: store.loading,
    error: store.error,
    addToCart: store.addToCart,
    updateQuantity: store.updateQuantity,
    removeFromCart: store.removeFromCart,
    getCartTotal: store.getCartTotal,
    getCartItemCount: store.getCartItemCount,
    isProductInCart: store.isProductInCart,
    getItemQuantity: store.getItemQuantity,
    refreshCart: store.refreshCart
  };
};