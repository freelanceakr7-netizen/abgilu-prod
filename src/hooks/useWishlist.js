import { useStore } from '../contexts/StoreContext';

/**
 * Compatibility wrapper around the global StoreContext for Wishlist functionality.
 * This ensures all components use the same shared state.
 */
export const useWishlist = () => {
  const store = useStore();
  
  return {
    wishlistItems: store.wishlistItems,
    loading: store.loading,
    error: store.error,
    addToWishlist: store.addToWishlist,
    removeFromWishlist: store.removeFromWishlist,
    toggleWishlist: store.toggleWishlist,
    isItemInWishlist: store.isItemInWishlist,
    getWishlistItemCount: store.getWishlistItemCount,
    clearWishlist: store.clearWishlist,
    syncGuestWishlistToUser: async () => ({ success: true, syncedItems: 0 }) // Handled automatically by StoreProvider
  };
};