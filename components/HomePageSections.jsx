import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Palette, Shirt, CreditCard, Camera, Zap } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { MiniProductCard } from './MiniProductCard';
import { testimonials as REVIEWS } from '../data/testimonials';


const StarRating = ({ count = 5, filled = 5 }) => (
  <div className="flex gap-0.5">
    {[...Array(count)].map((_, i) => (
      <svg key={i} style={{ width: 14, height: 14, color: i < filled ? '#F5A623' : '#D4C5A9' }} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

export const CustomerReviews = () => (
  <section className="py-4 md:py-8 bg-kora overflow-hidden">
    {/* Heading */}
    <div className="text-center mb-8 px-4 sm:px-[40px]">
      <h2
        className="font-serif font-bold text-indigo"
        style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}
      >
        Our customers love us
      </h2>
      <div className="flex items-center justify-center gap-2 mt-3">
        <StarRating count={5} filled={5} />
        <span className="text-sm text-indigo/60 font-medium">4.7 star&nbsp;&nbsp;Based on 30 reviews</span>
      </div>
    </div>

    {/* Marquee Container */}
    {/* Marquee Container */}
    <div className="review-marquee-container relative w-full overflow-hidden scrollbar-hide" style={{ paddingBottom: '16px' }}>
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .review-marquee {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: scroll-left 45s linear infinite;
        }
        .review-marquee:hover {
          animation-play-state: paused;
        }

        .review-card {
          flex-shrink: 0 !important;
        }
      `}</style>
      <div className="review-marquee px-4">
        {/* Duplicate the reviews array to create a seamless loop */}
        {[...REVIEWS, ...REVIEWS].map((review, idx) => (
          <div
            key={`${review.id}-${idx}`}
            className="review-card"
            style={{
              minWidth: '260px',
              maxWidth: '300px',
              background: 'var(--kora-light)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(76, 14, 14, 0.15)',
              flexShrink: 0,
            }}
          >
            {/* Avatar row */}
            <div className="flex items-center gap-3 mb-3">
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: review.color || '#4c0e0e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.avatarAlt || review.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (review.initial || review.name.charAt(0)).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-indigo leading-tight">{review.name}</p>
                <StarRating count={5} filled={review.rating || 5} />
              </div>
            </div>

            {/* Review text */}
            <p
              className="text-xs text-indigo/65 leading-relaxed"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Best Sellers / Featured Collection ───────────────────────────────────────
export const FeaturedCollection = ({ products = [], viewProduct, toggleWishlist, wishlist }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-4 md:py-8 px-4 sm:px-[40px] bg-kora">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-row items-end justify-between mb-6 md:mb-8 border-b border-indigo/10 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-terracotta font-semibold block mb-2">
              Our Top Picks
            </span>
            <h2 className="text-xl md:text-4xl font-serif text-indigo font-bold leading-tight">
              Designed to Stand Out
            </h2>
          </div>
          <Link
            to="/collections"
            className="btn-slide inline-flex sm:inline-flex text-kora px-4 sm:px-6 py-2 sm:py-3 rounded-none text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase items-center gap-2"
            style={{ backgroundColor: '#4c0e0e' }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>View All</span>
          </Link>
        </div>
        {/* Mobile: Horizontal scroll with full ProductCard functionality */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-x-4 pb-6 pt-2">
          {products.slice(0, 8).map(product => (
            <div key={product.id} className="min-w-0 w-[48%] flex-shrink-0 snap-start">
              <ProductCard
                key={product.id}
                product={product}
                viewProduct={viewProduct}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            </div>
          ))}
        </div>

        {/* Desktop: horizontal scroll (unchanged) */}
        <div className="hidden md:flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-x-8 pb-8 pt-2">
          {products.slice(0, 8).map(product => (
            <div key={product.id} className="min-w-0 w-[calc(25%-24px)] flex-shrink-0 snap-start">
              <ProductCard
                key={product.id}
                product={product}
                viewProduct={viewProduct}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;


