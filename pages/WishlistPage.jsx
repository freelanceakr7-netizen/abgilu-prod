import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../src/contexts/AdminContext';
import { useCart } from '../src/hooks/useCart';
import { getUserWishlist, removeFromUserWishlist } from '../src/firebase/services/cartService';

const WishlistPage = ({ navigateTo, toggleWishlist, wishlist, viewProduct }) => {
  const { user } = useAdmin();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const userWishlist = await getUserWishlist(user.uid);
          setWishlistItems(userWishlist);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // For guest users, use the wishlist from props
        setWishlistItems(wishlist);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, wishlist]);

  const handleRemoveFromWishlist = async (item) => {
    try {
      if (user) {
        await removeFromUserWishlist(user.uid, item.id);
        setWishlistItems(prev => prev.filter(wishlistItem => wishlistItem.id !== item.id));
      } else {
        // For guest users, update local state
        toggleWishlist(item);
        setWishlistItems(prev => prev.filter(wishlistItem => wishlistItem.id !== item.id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      // Use the unified cart hook
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Error adding to cart');
    }
  };


  if (loading) {
    return (
      <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-indigo"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-indigo/60 hover:text-terracotta transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="font-serif text-4xl md:text-5xl text-indigo mb-12">My Wishlist</h1>
      <p className="text-indigo/60 mb-8">
        {wishlistItems.length === 0
          ? 'Your wishlist is empty. Start adding items you love!'
          : `You have ${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} in your wishlist`
        }
      </p>

      {wishlistItems.length === 0 ? (
        <div className="bg-kora border border-indigo/10 rounded-none p-8 text-center">
          <Heart size={48} className="mx-auto text-indigo/40 mb-4" />
          <h3 className="font-serif text-2xl text-indigo mb-2">Your wishlist is empty</h3>
          <p className="text-indigo/60 mb-6">
            Browse our products and add items you love to your wishlist
          </p>
          <Link
            to="/collections"
            className="btn-slide inline-block bg-indigo text-kora px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-bold rounded-none"
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-kora border border-indigo/10 rounded-none overflow-hidden group hover:shadow-lg transition-all shadow-sm">
              <div className="relative">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => viewProduct(item)}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
                  className="absolute top-2 right-2 p-2 bg-kora rounded-none shadow-md opacity-0 group-hover:opacity-100 transition-all hover:text-terracotta"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} className="text-indigo/40" />
                </button>
              </div>
              
              <div className="p-4">
                <h3
                  className="font-medium text-indigo text-sm mb-2 cursor-pointer hover:text-terracotta transition-all"
                  onClick={() => viewProduct(item)}
                >
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-indigo">₹{item.price.toLocaleString()}</span>
                  {item.originalPrice && (
                    <span className="text-[8px] text-indigo/50 line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => viewProduct(item)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-indigo/20 rounded-none hover:bg-indigo/5 transition-all text-sm text-indigo"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-slide flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo text-kora rounded-none text-[11px] font-bold uppercase tracking-[0.12em]"
                  >
                    <ShoppingCart size={15} style={{ position: 'relative', zIndex: 2 }} />
                    <span style={{ position: 'relative', zIndex: 2 }}>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;



