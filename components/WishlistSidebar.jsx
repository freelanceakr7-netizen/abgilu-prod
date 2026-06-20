import React from 'react';
import { Product } from '../types';
import { X, Trash2, Heart } from 'lucide-react';
import { LazyImage } from '../src/utils/imageUtils.jsx';

const WishlistSidebar = ({ isOpen, onClose, wishlistItems, toggleWishlist, viewProduct }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-kora shadow-2xl z-[120] transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-indigo/10">
            <h2 className="text-xl font-serif font-black text-indigo uppercase tracking-widest">My Wishlist</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-indigo/5 rounded-none transition-colors text-indigo"
              aria-label="Close wishlist"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-indigo/5 rounded-none flex items-center justify-center">
                  <Heart className="w-10 h-10 text-indigo/20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-serif font-bold text-indigo">Your wishlist is empty</h3>
                  <p className="text-indigo/50 text-xs tracking-wide">Save pieces you love for later.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {wishlistItems.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-28 flex-shrink-0 bg-indigo/5 overflow-hidden">
                      <LazyImage 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                        onClick={() => { viewProduct(item); onClose(); }}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center gap-1">
                      <h4 
                        className="font-bold text-indigo text-xs uppercase tracking-wider cursor-pointer hover:text-terracotta transition-colors" 
                        onClick={() => { viewProduct(item); onClose(); }}
                      >
                        {item.name}
                      </h4>
                      <p className="text-indigo/80 font-black text-sm">RS: {item.price}</p>
                    </div>
                    <button 
                      onClick={() => toggleWishlist(item)} 
                      className="self-center p-2 text-indigo/30 hover:text-red-500 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-8 border-t border-indigo/10 bg-white/40">
            <button 
              onClick={onClose}
              className="w-full bg-indigo text-kora font-bold py-4 px-6 uppercase tracking-[0.2em] text-[10px] shadow-lg hover:bg-terracotta transition-all duration-300 transform active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;

