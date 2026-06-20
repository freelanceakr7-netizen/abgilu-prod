import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../src/hooks/useCart';
import { LazyImage } from '../src/utils/imageUtils.jsx';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop with premium blur */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose}
      />

      {/* Sidebar with elegant transition */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm md:max-w-md bg-kora shadow-2xl z-[120] transform transition-transform duration-500 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header matching Angilu design */}
          <div className="flex justify-between items-center p-6 border-b border-indigo/10">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-indigo" />
              <h2 className="text-xl font-serif font-black text-indigo uppercase tracking-wider">Your Cart</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-indigo/5 rounded-none transition-colors text-indigo"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Scrollable Cart Content */}
          <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="w-24 h-24 bg-indigo/5 rounded-none flex items-center justify-center mb-2">
                  <ShoppingBag className="w-10 h-10 text-indigo/20" />
                </div>
                <h3 className="text-xl font-serif font-bold text-indigo">Your cart is empty</h3>
                <p className="text-indigo/60 text-sm max-w-[260px] mx-auto">Explore our collections and add your favorites to get started.</p>
                <button 
                  onClick={onClose} 
                  className="btn-slide mt-6 bg-indigo text-kora font-bold py-4 px-10 rounded-none uppercase tracking-[0.2em] text-[10px] shadow-lg"
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>Start Shopping</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex gap-5 group">
                    {/* Product Image */}
                    <div className="w-24 h-32 flex-shrink-0 bg-indigo/5 rounded-none overflow-hidden relative">
                      <LazyImage 
                        src={item.image || item.images?.[0] || '/placeholder.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-indigo leading-tight line-clamp-2 pr-2 text-sm md:text-base">
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 bg-red-50 dark:bg-red-900/10 rounded-none shadow-sm"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-indigo/50 font-black">
                          {item.selectedSize && item.selectedSize !== 'NA' && (
                            <span className="px-2 py-0.5 bg-indigo/5 rounded-none">{typeof item.selectedSize === 'object' ? item.selectedSize.size : item.selectedSize}</span>
                          )}
                          <span className="px-2 py-0.5 bg-indigo/5 rounded-none">{item.selectedColor}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-indigo/10 rounded-none px-1.5 py-1 bg-white/40 ring-1 ring-white/20">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1), item.selectedSize, item.selectedColor)}
                            className="w-6 h-6 flex items-center justify-center text-indigo/60 hover:text-indigo hover:bg-white rounded-none transition-all"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-black text-indigo select-none">{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1, item.selectedSize, item.selectedColor)}
                            className="w-6 h-6 flex items-center justify-center text-indigo/60 hover:text-indigo hover:bg-white rounded-none transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <p className="font-black text-indigo text-sm md:text-base">
                          ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Checkout Section */}
          {cartItems.length > 0 && (
            <div className="p-8 border-t border-indigo/10 bg-white/40 backdrop-blur-xl space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-indigo/40 font-black">Subtotal</p>
                  <p className="text-2xl font-serif font-black text-indigo leading-none">
                    ₹{getCartTotal().toLocaleString()}
                  </p>
                </div>
                <p className="text-[10px] text-indigo/30 font-medium italic text-right">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full btn-slide text-kora font-bold py-5 hover:bg-terracotta transition-all duration-500 uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-4 group shadow-2xl shadow-indigo/30"
                style={{
                  background: 'var(--indigo)',
                  border: 'none',
                }}
              >
                <span className="relative z-10">Proceed to Checkout</span>
                <div className="w-8 h-[1.5px] bg-kora/30 group-hover:w-14 transition-all duration-500 relative z-10" />
              </button>
              
              <button 
                onClick={onClose}
                className="w-full text-indigo/60 hover:text-indigo text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;


