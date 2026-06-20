import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Heart, ChevronLeft, ChevronRight, Check, ShoppingCart, AlertCircle, Calendar, Truck, Info, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../src/contexts/AdminContext';
import { useCart } from '../src/hooks/useCart';
import { useWishlist } from '../src/hooks/useWishlist';
import { LazyImage } from '../src/utils/imageUtils.jsx';
import { getColorHex, getContrastColor } from '../src/utils/colorMap';
import { useProductContext } from '../src/contexts/ProductContext';
import MobilePDP from '../components/MobilePDP';
import { ProductCard } from '../components/ProductCard';
import {
  isProductAvailableForPreOrder,
  isProductInStock,
  validatePreOrderStock,
  checkCustomerPreOrderLimit,
  getPreOrderPricing
} from '../src/firebase/services/productService';

const ProductDetailPage = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAdmin();
  const { addToCart } = useCart();
  const { products: allProducts } = useProductContext();
  const {
    toggleWishlist,
    isItemInWishlist,
    syncGuestWishlistToUser
  } = useWishlist();
  const initialSize = Array.isArray(product.sizes) && product.sizes.length > 0 
    ? (typeof product.sizes[0] === 'object' ? product.sizes[0].size : product.sizes[0])
    : 'NA';
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const defaultColor = product.colors?.find(c => c.toLowerCase().includes('black')) || product.colors?.[0] || 'NA';
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [preOrderPricing, setPreOrderPricing] = useState(null);
  const [preOrderTermsAccepted, setPreOrderTermsAccepted] = useState(false);
  const [showPreOrderModal, setShowPreOrderModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  
  const isInWishlist = isItemInWishlist(product.id);
  
  // Check if product is in stock
  const stock = product.stock || 0;
  const isInStock = stock > 0;
  
  // Track recently visited + fetch related products
  useEffect(() => {
    // 1. Update recently visited in localStorage
    const STORAGE_KEY = 'angilu_recently_visited';
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const filtered = stored.filter(p => p.id !== product.id);
      const updated = [{ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        originalPrice: product.originalPrice, 
        images: product.images, 
        category: product.category,
        stock: product.stock || 0,
        sizes: product.sizes || [],
        colors: product.colors || []
      }, ...filtered].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Show previous recently visited (excluding current)
      setRecentlyVisited(filtered.slice(0, 4));
    } catch (e) { /* ignore */ }

    // 2. Fetch related products (same category, exclude current)
    if (allProducts && allProducts.length > 0) {
      const same = allProducts.filter(p => p.id !== product.id && p.category === product.category);
      const fallback = allProducts.filter(p => p.id !== product.id);
      const source = same.length >= 4 ? same : fallback;
      setRelatedProducts(source.slice(0, 4));
    }
  }, [product.id, allProducts]);

  // Pre-order state management
  useEffect(() => {
    const checkPreOrderStatus = async () => {
      try {
        const preOrderAvailable = await isProductAvailableForPreOrder(product.id);
        setIsPreOrder(preOrderAvailable);
        
        if (preOrderAvailable) {
          const pricing = await getPreOrderPricing(product.id);
          setPreOrderPricing(pricing);
        }
      } catch (error) {
        console.error('Error checking pre-order status:', error);
        setIsPreOrder(false);
      }
    };
    
    checkPreOrderStatus();
  }, [product.id]);

  const handleAddToCart = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // Find current size stock if using new size-stock object format
      const selectedSizeData = Array.isArray(product.sizes) 
        ? product.sizes.find(s => (typeof s === 'object' ? s.size : s) === selectedSize)
        : null;
      
      const isSizeInStock = selectedSizeData 
        ? (typeof selectedSizeData === 'object' ? selectedSizeData.stock > 0 : true) 
        : isInStock;

      // Check if product is available
      if (!isSizeInStock && !isPreOrder) {
        setToast({
          message: `Size ${selectedSize} is currently out of stock`,
          type: 'error',
          duration: 3000
        });
        return;
      }
      
      // For pre-order items, do additional validation
      if (isPreOrder) {
        // Check if terms are accepted
        if (!preOrderTermsAccepted) {
          setToast({
            message: 'Please accept the pre-order terms and conditions',
            type: 'error',
            duration: 3000
          });
          return;
        }
        
        // Validate pre-order stock
        const stockValidation = await validatePreOrderStock(product.id, quantity);
        if (!stockValidation.valid) {
          setToast({
            message: stockValidation.message,
            type: 'error',
            duration: 3000
          });
          return;
        }
        
        // Check pre-order limit if user is logged in
        if (user && product.preOrderLimit) {
          const limitCheck = await checkCustomerPreOrderLimit(product.id, user.uid, quantity);
          if (!limitCheck.valid) {
            setToast({
              message: limitCheck.message,
              type: 'error',
              duration: 3000
            });
            return;
          }
        }
        
        // Show pre-order confirmation
        setShowPreOrderModal(true);
        return;
      }
      
      // For regular products, proceed normally
      const productWithSelections = {
        ...product,
        selectedSize,
        selectedColor,
        quantity
      };

      setIsAddingToCart(true);
      // Use the unified cart hook
      await addToCart(productWithSelections);
      
      // Simulate artificial delay for animation smoothness like The Souled Store
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setIsAddingToCart(false);
      setAddedSuccess(true);
      
      setTimeout(() => {
        setAddedSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
      setToast({
        message: error.message || 'Error adding to cart',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleBuyNow = async () => {
    try {
      // Check if product is available
      if (!isInStock && !isPreOrder) {
        setToast({
          message: 'This product is currently out of stock',
          type: 'error',
          duration: 3000
        });
        return;
      }
      
      // For pre-order items, do additional validation
      if (isPreOrder) {
        // Check if terms are accepted
        if (!preOrderTermsAccepted) {
          setToast({
            message: 'Please accept the pre-order terms and conditions',
            type: 'error',
            duration: 3000
          });
          return;
        }
        
        // Validate pre-order stock
        const stockValidation = await validatePreOrderStock(product.id, quantity);
        if (!stockValidation.valid) {
          setToast({
            message: stockValidation.message,
            type: 'error',
            duration: 3000
          });
          return;
        }
        
        // Check pre-order limit if user is logged in
        if (user && product.preOrderLimit) {
          const limitCheck = await checkCustomerPreOrderLimit(product.id, user.uid, quantity);
          if (!limitCheck.valid) {
            setToast({
              message: limitCheck.message,
              type: 'error',
              duration: 3000
            });
            return;
          }
        }
        
        // Add to cart and navigate to checkout
        const productWithSelections = {
          ...product,
          selectedSize,
          selectedColor,
          quantity,
          isPreOrder: true,
          preOrderPrice: preOrderPricing?.price || product.price,
          expectedShippingDate: product.expectedShippingDate
        };

        await addToCart(productWithSelections);
        navigate('/checkout');
        return;
      }
      
      // For regular products, proceed normally
      const productWithSelections = {
        ...product,
        selectedSize,
        selectedColor,
        quantity
      };

      // Use the unified cart hook
      await addToCart(productWithSelections);
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({
        message: error.message || 'Error adding to cart',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQuantity = isPreOrder ? (product.preOrderStock || 10) : Math.min(stock, 10);
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };
  
  const handlePreOrderConfirm = async () => {
    try {
      const productWithSelections = {
        ...product,
        selectedSize,
        selectedColor,
        quantity,
        isPreOrder: true,
        preOrderPrice: preOrderPricing?.price || product.price,
        expectedShippingDate: product.expectedShippingDate
      };

      // Use the unified cart hook
      await addToCart(productWithSelections);
      setShowPreOrderModal(false);
      setToast({
        message: 'Pre-order added to cart',
        type: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error adding pre-order to cart:', error);
      setToast({
        message: error.message || 'Error adding pre-order to cart',
        type: 'error',
        duration: 3000
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const handleWishlistToggle = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // Allow both guest and logged-in users to toggle wishlist
      // The toggleWishlist hook handle the logic for both
      
      // For logged-in users, toggle wishlist
      const result = await toggleWishlist(product);
      
      if (result.added) {
        setToast({
          message: 'Item added to wishlist',
          type: 'success',
          duration: 2000
        });
      } else if (result.removed) {
        setToast({
          message: 'Item removed from wishlist',
          type: 'info',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setToast({
        message: 'Error updating wishlist',
        type: 'error',
        duration: 3000
      });
    }
  };

  // Sync guest wishlist when user logs in
  React.useEffect(() => {
    if (user) {
      const syncWishlist = async () => {
        try {
          const result = await syncGuestWishlistToUser();
          if (result.syncedItems > 0) {
            setToast({
              message: result.message,
              type: 'success',
              duration: 3000
            });
          }
        } catch (error) {
          console.error('Error syncing wishlist:', error);
        }
      };
      syncWishlist();
    }
  }, [user, syncGuestWishlistToUser]);

  // Accordion state
  const [openAccordion, setOpenAccordion] = React.useState('description');
  const toggleAccordion = (key) => setOpenAccordion(prev => prev === key ? null : key);

  const AccordionItem = ({ id, label, children }) => {
    const isOpen = openAccordion === id;
    return (
      <div>
        <button
          className="pdp-accordion-header w-full text-left"
          onClick={() => toggleAccordion(id)}
          aria-expanded={isOpen}
        >
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--indigo)' }}>
            {label}
          </span>
          <span className="pdp-accordion-icon" style={{ color: 'var(--indigo)', fontSize: 18, lineHeight: 1 }}>
            {isOpen ? 'âˆ’' : '+'}
          </span>
        </button>
        <div
          className={`pdp-accordion-content${isOpen ? '' : ' closed'}`}
          style={{ maxHeight: isOpen ? '600px' : '0px' }}
        >
          <div style={{ paddingBottom: 'var(--sp-3)', paddingTop: 'var(--sp-1)' }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-kora" style={{ minHeight: '100vh' }}>

      {/* â”€â”€ Main Product Grid â”€â”€ */}
      {/* Mobile Layout - Bluorng style (lg:hidden is inside MobilePDP) */}
      <MobilePDP
        product={product}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        isPreOrder={isPreOrder}
        preOrderPricing={preOrderPricing}
        isInWishlist={isInWishlist}
        handleWishlistToggle={handleWishlistToggle}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
        isAddingToCart={isAddingToCart}
        addedSuccess={addedSuccess}
        openAccordion={openAccordion}
        setOpenAccordion={setOpenAccordion}
      />

      {/* Desktop Layout - unchanged, hidden on mobile */}
      <div className="hidden lg:block">
      <div className="editorial-pdp-container grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_420px] max-w-[1800px] mx-auto min-h-screen"
      >

        {/* ─── COLUMN 1: Fixed Main Image ─── */}
        <div className="hidden lg:block p-[24px_12px_24px_24px] sticky top-[80px] h-[calc(100vh-80px)] align-start">
          <div style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '24px',
            background: 'var(--kora-dark)',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in'
          }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={(e) => {
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              setZoomPos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
            }}
          >
            <LazyImage
              src={product.images[0]}
              alt={product.name}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                display: 'block',
                transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                transformOrigin: zoomPos.x + '% ' + zoomPos.y + '%'
              }}
            />
          </div>
        </div>

        {/* ─── COLUMN 2: Scrollable Gallery ─── */}
        <div className="p-4 sm:p-6 lg:p-[24px_12px] flex flex-col gap-6">
          {/* Main Image for Mobile (Hidden on Desktop as it's in Column 1) */}
          <div className="lg:hidden relative aspect-[3/4] overflow-hidden rounded-2xl bg-kora-dark">
             <LazyImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {product.images.slice(1).map((img, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                background: 'var(--kora-dark)',
                width: '100%',
                aspectRatio: '3/4'
              }}
            >
              <LazyImage
                src={img}
                alt={`${product.name} — alternate ${idx + 1}`}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
              />
            </div>
          ))}
          
          {/* Fallback for single image */}
          {product.images.length === 1 && (
            <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5, fontStyle: 'italic', fontSize: '12px' }}>
              No additional views available for this piece.
            </div>
          )}
        </div>

        {/* ─── COLUMN 3: Sticky Product Info ─── */}
        <div className="p-6 sm:p-8 lg:p-[24px_24px_24px_12px] lg:sticky top-[80px] h-max align-start">

          {/* Product Name */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] leading-tight text-[#1A0D0D] mb-4 font-bold">
            {product.name}
          </h1>

          {/* Price Row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 600, color: '#1A0D0D', fontFamily: "'Poppins', sans-serif" }}>
              ₹{isPreOrder && preOrderPricing ? preOrderPricing.price : product.price}
            </span>
            {product.originalPrice && !isPreOrder && (
              <span style={{ fontSize: '18px', color: '#A0A0A0', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#707070', marginBottom: '32px' }}>
            Taxes included. <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Shipping</span> calculated at checkout
          </p>

          {/* Size Selector */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#1A0D0D', marginBottom: '12px' }}>
              Size: {selectedSize}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']).map(sizeInfo => {
                const sizeLabel = typeof sizeInfo === 'object' ? sizeInfo.size : sizeInfo;
                const hasStock = typeof sizeInfo === 'object' ? sizeInfo.stock > 0 : true;
                const isAvailable = hasStock || isPreOrder;

                return (
                  <button
                    key={sizeLabel}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(sizeLabel)}
                    style={{
                      minWidth: '64px', height: '36px',
                      border: isAvailable ? '1px solid #4C1414' : '1px solid #E0E0E0',
                      borderRadius: '2px', 
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      background: selectedSize === sizeLabel ? '#4C1414' : 'transparent',
                      color: selectedSize === sizeLabel ? '#FFFFFF' : (isAvailable ? '#4C1414' : '#CBCBCB'),
                      fontSize: '12px', fontWeight: 500,
                      transition: 'all 0.2s ease',
                      opacity: isAvailable ? 1 : 0.6,
                      position: 'relative'
                    }}
                  >
                    {sizeLabel}
                    {!isAvailable && (
                      <div style={{ 
                        position: 'absolute', top: '50%', left: '0', right: '0', 
                        height: '1px', background: '#CBCBCB', transform: 'rotate(-25deg)' 
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Buy Now Action row */}
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 mb-3">
            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', height: '52px', border: '1px solid #4C1414', borderRadius: '2px', background: 'transparent' }}>
              <button
                onClick={() => handleQuantityChange(-1)}
                style={{ width: '40px', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#4C1414', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <Minus size={14} />
              </button>
              <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#4C1414', userSelect: 'none' }}>
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                style={{ width: '40px', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#4C1414', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              style={{
                height: '52px',
                background: '#4C1414',
                color: '#FFFFFF',
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              BUY NOW
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            style={{
              width: '100%',
              height: '52px',
              background: addedSuccess ? '#2e7d32' : 'transparent',
              color: addedSuccess ? '#FFFFFF' : '#4C1414',
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: '1.5px solid #4C1414',
              borderRadius: '2px',
              cursor: isAddingToCart ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginBottom: '12px',
              transition: 'all 0.3s ease',
              opacity: isAddingToCart ? 0.7 : 1
            }}
          >
            {isAddingToCart ? (
              <>
                <span style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                ADDING...
              </>
            ) : addedSuccess ? (
              <><Check size={14} /> ADDED TO CART</>
            ) : (
              <><ShoppingCart size={14} /> ADD TO CART</>
            )}
          </button>

          {/* Wishlist & Size Guide half components */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={handleWishlistToggle}
              style={{
                height: '44px',
                border: '1.5px solid #4C1414',
                background: 'transparent',
                color: '#4C1414',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px'
              }}
            >
              WISHLIST <Heart size={14} fill={isInWishlist ? '#4C1414' : 'none'} stroke={isInWishlist ? '#4C1414' : 'currentColor'} />
            </button>
            <button
              style={{
                height: '44px',
                border: '1.5px solid #4C1414',
                background: 'transparent',
                color: '#4C1414',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px'
              }}
              onClick={() => navigate("/size-guide")}
            >
              SIZE GUIDE <Truck size={14} />
            </button>
          </div>

          {/* Description & Details tabs-like box */}
          <div style={{ marginTop: '32px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '32px', 
              borderBottom: '1px solid rgba(0,0,0,0.1)', 
              marginBottom: '20px',
              paddingBottom: '8px'
            }}>
              {['description', 'details'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setOpenAccordion(tab)} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '4px 0',
                    fontSize: '13px', 
                    fontWeight: 700, 
                    color: openAccordion === tab ? '#1A0D0D' : '#909090',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.toUpperCase()}
                  {openAccordion === tab && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: -9, 
                      left: 0, 
                      right: 0, 
                      height: '2px', 
                      background: '#1A0D0D' 
                    }} />
                  )}
                </button>
              ))}
            </div>
            
            <div style={{ minHeight: '120px', color: '#404040' }}>
              {openAccordion === 'description' && (
                <div style={{ fontSize: '14px', lineHeight: '1.7' }}>
                  <p style={{ margin: 0 }}>
                    {product.description || "Designed with precision and crafted from the finest materials, this piece embodies timeless elegance and modern coastal style."}
                  </p>
                </div>
              )}
              {openAccordion === 'details' && (
                <div style={{ fontSize: '14px', lineHeight: '1.7' }}>
                  <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc' }}>
                    <li>100% Premium Material</li>
                    <li>Handcrafted in India</li>
                    <li>Reinforced stitching for durability</li>
                    <li>{product.fabricDetails || "Signature weave pattern"}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* end desktop wrapper */}

      {/* â”€â”€ Toast â”€â”€ */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, animation: 'fadeInUp 0.3s ease' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px',
            background: toast.type === 'success' ? 'var(--indigo)' : toast.type === 'error' ? '#c62828' : '#1565c0',
            color: 'var(--kora)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            fontSize: '14px', fontWeight: 500, minWidth: '260px', maxWidth: '360px', borderRadius: 0
          }}>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, opacity: 0.7, fontSize: 20, lineHeight: 1, borderRadius: 0 }}>Ã—</button>
          </div>
        </div>
      )}

      {/* â”€â”€ Pre-Order Modal â”€â”€ */}
      {showPreOrderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: '16px' }}>
          <div style={{ background: 'var(--kora)', maxWidth: '440px', width: '100%', padding: '32px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--indigo)', marginBottom: '24px' }}>Confirm Pre-Order</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <LazyImage src={product.images[0]} alt={product.name} style={{ width: 72, height: 80, objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, color: 'var(--indigo)', fontSize: '14px', marginBottom: '4px' }}>{product.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(76,14,14,0.6)', lineHeight: '20px' }}>
                  {selectedSize && `Size: ${selectedSize}`}{selectedColor && ` Â· ${selectedColor}`}
                </p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--indigo)', marginTop: '8px' }}>
                  â‚¹{(preOrderPricing?.price || product.price) * quantity}
                </p>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(76,14,14,0.65)', lineHeight: '20px', marginBottom: '24px', padding: '12px', border: '1px solid rgba(76,14,14,0.1)', background: 'rgba(76,14,14,0.03)' }}>
              Payment will be charged immediately. Est. ship date: {product.expectedShippingDate ? new Date(product.expectedShippingDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowPreOrderModal(false)}
                className="btn-slide btn-slide-outline"
                style={{ flex: 1, height: '48px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>Cancel</span>
              </button>
              <button
                onClick={handlePreOrderConfirm}
                className="btn-slide"
                style={{ flex: 1, height: '48px', background: 'var(--indigo)', color: 'var(--kora)', border: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>Confirm Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── You May Also Like ── */}
      {relatedProducts.length > 0 && (
        <section className="py-10 px-4 sm:px-[40px]" style={{ background: 'var(--kora)' }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1A0D0D', fontWeight: 700, marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              YOU MAY ALSO LIKE
            </h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-x-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 pb-6">
              {relatedProducts.map(p => (
                <div key={p.id} className="min-w-0 w-[48%] sm:w-[45%] md:w-full flex-shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Recently Visited ── */}
      {recentlyVisited.length > 0 && (
        <section className="py-10 px-4 sm:px-[40px]" style={{ background: 'var(--kora)' }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1A0D0D', fontWeight: 700, marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RECENTLY VISITED
            </h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-x-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 pb-6">
              {recentlyVisited.map(p => (
                <div key={p.id} className="min-w-0 w-[48%] sm:w-[45%] md:w-full flex-shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Buy Now CTA Banner */}
            <div className="mt-16 rounded-3xl p-10 sm:p-16 flex flex-col items-center gap-5" style={{ background: '#4C1414' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Don't miss out</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#FFFFFF', fontWeight: 700, textAlign: 'center', margin: 0 }}>Elevate Your Everyday Style</h3>
              <button
                onClick={() => navigate('/shop')}
                style={{ marginTop: '12px', background: '#FFFFFF', color: '#4C1414', border: 'none', borderRadius: '100px', padding: '16px 48px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Shop the Collection
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Responsive grid override (now handled by Tailwind classes) */}
    </div>
  );
};

export default ProductDetailPage;


