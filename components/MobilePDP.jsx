import React, { useState } from 'react';
import { Heart, Check, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * MobilePDP — Bluorng-style mobile product detail layout.
 * Fonts: font-serif (Playfair Display) for headings, font-sans (Poppins) for body.
 * Colors match the Angilu desktop design system exactly.
 * Hidden on lg+ screens (desktop uses the 3-column editorial grid).
 */
const MobilePDP = ({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  isPreOrder,
  preOrderPricing,
  isInWishlist,
  handleWishlistToggle,
  handleAddToCart,
  handleBuyNow,
  isAddingToCart,
  addedSuccess,
  openAccordion,
  setOpenAccordion,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const images = product.images || [];
  const total = images.length;

  const next = () => setCurrentIndex(i => (i + 1) % total);
  const prev = () => setCurrentIndex(i => (i - 1 + total) % total);

  return (
    <div className="lg:hidden font-sans" style={{ background: 'var(--kora)', minHeight: '100vh' }}>

      {/* ── Full-width swipeable carousel ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '3/4', background: 'var(--kora-dark)', touchAction: 'pan-y' }}
        onTouchStart={e => {
          setTouchStartX(e.touches[0].clientX);
          setTouchStartY(e.touches[0].clientY);
        }}
        onTouchEnd={e => {
          if (touchStartX === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
          if (Math.abs(dx) > 40 && dy < 80) { if (dx < 0) next(); else prev(); }
          setTouchStartX(null);
          setTouchStartY(null);
        }}
      >
        {/* Sliding strip */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0">
              <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Counter pill */}
        {total > 1 && (
          <div
            className="absolute bottom-3 left-4 text-xs font-semibold px-2.5 py-1 rounded-full select-none font-sans"
            style={{ background: 'rgba(76,14,14,0.55)', color: 'var(--kora)' }}
          >
            {currentIndex + 1} / {total}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
          style={{ background: 'rgba(240,225,198,0.92)' }}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={17}
            fill={isInWishlist ? 'var(--terracotta)' : 'none'}
            stroke="var(--terracotta)"
          />
        </button>
      </div>

      {/* ── Product info panel ── */}
      <div className="px-4 pt-5 pb-12 font-sans" style={{ background: 'var(--kora)' }}>

        {/* Name row + Size Guide button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          {/* Product name — Playfair Display (font-serif) matching desktop h1 */}
          <h1
            className="flex-1 font-serif font-bold leading-snug"
            style={{ fontSize: '18px', color: 'var(--indigo)' }}
          >
            {product.name}
          </h1>
          <button
            onClick={() => navigate('/size-guide')}
            className="flex-shrink-0 self-start mt-0.5 font-sans font-bold uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.15em',
              border: '1px solid var(--terracotta)',
              color: 'var(--terracotta)',
              background: 'transparent',
              padding: '5px 10px',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            Size Guide
          </button>
        </div>

        {/* Price — Poppins matching desktop price row */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="font-sans font-semibold" style={{ fontSize: '16px', color: 'var(--indigo)' }}>
            ₹{(Number(isPreOrder && preOrderPricing ? preOrderPricing.price : product.price) || 0).toLocaleString()}
          </span>
          {product.originalPrice && !isPreOrder && (
            <span className="font-sans" style={{ fontSize: '13px', color: 'rgba(76,14,14,0.45)', textDecoration: 'line-through' }}>
              ₹{(Number(product.originalPrice) || 0).toLocaleString()}
            </span>
          )}
        </div>

        {/* Size label — Poppins uppercase matching desktop */}
        <div className="mb-5">
          <p
            className="font-sans font-semibold uppercase mb-2.5"
            style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--indigo)' }}
          >
            Size: <span className="font-bold">{selectedSize}</span>
          </p>
          {/* Size buttons — square style matching desktop */}
          <div className="flex gap-2 flex-wrap">
            {(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']).map(sizeInfo => {
              const sizeLabel = typeof sizeInfo === 'object' ? sizeInfo.size : sizeInfo;
              const hasStock = typeof sizeInfo === 'object' ? sizeInfo.stock > 0 : true;
              const isAvailable = hasStock || isPreOrder;

              return (
                <button
                  key={sizeLabel}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSize(sizeLabel)}
                  className="font-sans font-semibold transition-all duration-150 relative"
                  style={{
                    minWidth: '52px',
                    height: '38px',
                    border: isAvailable ? `1.5px solid var(--terracotta)` : '1.5px solid #E0E0E0',
                    borderRadius: '2px',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    background: selectedSize === sizeLabel ? 'var(--terracotta)' : 'transparent',
                    color: selectedSize === sizeLabel ? 'var(--kora)' : (isAvailable ? 'var(--terracotta)' : '#CBCBCB'),
                    fontSize: '12px',
                    padding: '0 10px',
                    opacity: isAvailable ? 1 : 0.6,
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

        {/* ADD TO CART — outlined, Poppins uppercase matching desktop */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full flex items-center justify-center gap-2 mb-3 font-sans font-bold uppercase transition-all"
          style={{
            height: '52px',
            border: `1.5px solid var(--terracotta)`,
            borderRadius: '2px',
            background: addedSuccess ? 'var(--terracotta)' : 'transparent',
            color: addedSuccess ? 'var(--kora)' : 'var(--terracotta)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            cursor: isAddingToCart ? 'not-allowed' : 'pointer',
            opacity: isAddingToCart ? 0.7 : 1,
          }}
        >
          {isAddingToCart ? (
            <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Adding...</>
          ) : addedSuccess ? (
            <><Check size={14} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={14} /> ADD TO CART</>
          )}
        </button>

        {/* BUY NOW — solid terracotta, Poppins uppercase matching desktop */}
        <button
          onClick={handleBuyNow}
          className="w-full font-sans font-bold uppercase mb-6"
          style={{
            height: '52px',
            background: 'var(--terracotta)',
            color: 'var(--kora)',
            border: 'none',
            borderRadius: '2px',
            fontSize: '11px',
            letterSpacing: '0.12em',
            cursor: 'pointer',
          }}
        >
          BUY NOW
        </button>

        {/* Tab section */}
        <div style={{ borderTop: '1px solid rgba(76,14,14,0.12)', paddingTop: '16px' }}>
          {/* Tab row — Poppins uppercase */}
          <div
            className="flex gap-5 mb-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', borderBottom: '1px solid rgba(76,14,14,0.1)' }}
          >
            {['description', 'details'].map(tab => (
              <button
                key={tab}
                onClick={() => setOpenAccordion(tab)}
                className="flex-shrink-0 pb-2 font-sans font-bold uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  color: openAccordion === tab ? 'var(--indigo)' : 'rgba(76,14,14,0.3)',
                  borderBottom: openAccordion === tab ? '2px solid var(--indigo)' : '2px solid transparent',
                  marginBottom: '-1px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 0 8px 0',
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab content — Poppins body text matching desktop */}
          <div
            className="font-sans"
            style={{ fontSize: '13px', color: 'rgba(76,14,14,0.7)', lineHeight: 1.7 }}
          >
            {openAccordion === 'description' && (
              <p style={{ margin: 0 }}>
                {product.description || 'Designed with precision and crafted from the finest materials, this piece embodies timeless elegance and modern style.'}
              </p>
            )}
            {openAccordion === 'details' && (
              <ul style={{ margin: 0, paddingLeft: '16px', listStyleType: 'disc' }}>
                <li>100% Premium Material</li>
                <li>Handcrafted in India</li>
                <li>Reinforced stitching for durability</li>
                <li>{product.fabricDetails || 'Signature weave pattern'}</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePDP;
