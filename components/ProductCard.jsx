import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { useCart } from '../src/hooks/useCart';
import { useWishlist } from '../src/hooks/useWishlist';
import { LazyImage } from '../src/utils/imageUtils.jsx';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isItemInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const isInWishlist = isItemInWishlist(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    try {
      const firstSize = product.sizes?.[0];
      const defaultSize = firstSize ? (typeof firstSize === 'object' ? firstSize.size : firstSize) : 'NA';
      const defaultColor = product.colors?.find(c => typeof c === 'string' && c.toLowerCase().includes('black')) || product.colors?.[0] || 'NA';
      
      const productWithSelections = {
        ...product,
        selectedSize: defaultSize,
        selectedColor: defaultColor,
        quantity: 1,
        stock: product.stock || 100
      };
      
      await addToCart(productWithSelections);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 600);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleCardClick = (e) => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className="group flex flex-col gap-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="relative aspect-[4/5] w-full rounded-none overflow-hidden bg-kora-dark cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image */}
        <LazyImage
          src={(product.images && product.images.length > 0) ? product.images[currentImageIdx] : '/placeholder.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Carousel Arrows */}
        {product.images && product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 px-2 pointer-events-none">
            <button 
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setCurrentImageIdx(p => (p > 0 ? p - 1 : product.images.length - 1)); 
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 text-[#6b0f10] pointer-events-auto backdrop-blur-sm transition-colors border border-white/30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setCurrentImageIdx(p => (p < product.images.length - 1 ? p + 1 : 0)); 
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 text-[#6b0f10] pointer-events-auto backdrop-blur-sm transition-colors border border-white/30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {/* Wishlist Icon - Rounded like Homepage Latest Drop */}
        <button 
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 backdrop-blur-sm bg-white/40 hover:bg-white/60 text-[#6b0f10]"
        >
          <Heart 
            className={`w-5 h-5 stroke-[2] transition-colors ${isInWishlist ? 'fill-[#6b0f10] text-[#6b0f10]' : 'text-[#6b0f10]'}`} 
          />
        </button>

        {/* Add to Cart Plus Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 backdrop-blur-md ${
            isAdding 
              ? 'bg-[#6b0f10] text-white' 
              : 'bg-white/40 text-[#6b0f10] hover:bg-white/60 border border-white/30'
          }`}
        >
          <Plus className={`w-5 h-5 stroke-[2] ${isAdding ? 'rotate-90' : ''} transition-transform`} />
        </button>
      </div>

      {/* Info Section */}
      <div 
        className="flex flex-col gap-1 px-1 text-left cursor-pointer group-hover:opacity-80 transition-opacity"
        onClick={handleCardClick}
      >
        <h3 className="text-sm font-medium text-indigo truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-terracotta">
            ₹{(Number(product.price) || 0).toLocaleString()}
          </span>
          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
            <span className="text-xs text-indigo/30 line-through">
              ₹{(Number(product.originalPrice) || 0).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
