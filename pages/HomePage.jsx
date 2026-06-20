import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { EditorialGrid } from '../components/EditorialGrid';
import { useProductContext } from '../src/contexts/ProductContext';
import StickyStackBanners from '../components/StickyStackBanners';
import ShopByCategory from '../components/ShopByCategory';
import OurStoryTeaser from '../components/OurStoryTeaser';
import FeaturesSection from '../components/FeaturesSection';
import { CustomerReviews, FeaturedCollection } from '../components/HomePageSections';
import SEOContent from '../components/SEOContent';
import { MiniProductCard } from '../components/MiniProductCard';

const HomePage = ({ navigateTo, viewProduct, toggleWishlist, wishlist, cart, updateCart }) => {
  const { products: firebaseProducts, loading, getProductsByOptions } = useProductContext();
  const [latestProducts, setLatestProducts] = useState([]);
  const [topPicks, setTopPicks] = useState([]);

  // Update displayed products whenever Firebase data changes
  useEffect(() => {
    if (firebaseProducts && firebaseProducts.length > 0) {
      // 1. Get the 4 latest products for "Latest Drop"
      const latest = getProductsByOptions({ 
        includeStock: true, 
        limit: 4,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setLatestProducts(latest || []);

      // 2. Get the top 4 products by their manually set 'position' for "Our Top Picks"
      const picks = getProductsByOptions({ 
        includeStock: true, 
        limit: 4,
        sortBy: 'position',
        sortOrder: 'asc'
      });
      setTopPicks(picks || []);
    }
  }, [firebaseProducts, getProductsByOptions]);

  return (
    <div>
      {/* Load Bebas Neue font for "Latest Drop" heading */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

      {/* Hero Section with mask-reveal animation */}
      <EditorialGrid />

      {/* Latest Drop */}
      <section id="collections" className="py-3 md:py-8 px-4 sm:px-[40px] bg-kora">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-row items-center justify-between mb-4 md:mb-8 px-2 md:px-0">
            <h2 className="font-bold text-xs md:text-base uppercase tracking-widest text-indigo">
              Latest Drop
            </h2>
            <Link
              to="/shop"
              className="btn-slide inline-flex bg-indigo text-kora px-4 sm:px-8 py-2 sm:py-4 rounded-none text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg"
            >
              <span style={{ position: 'relative', zIndex: 2 }}>Discover More</span>
            </Link>
          </div>

          {/* Mobile: Horizontal scroll with full ProductCard functionality */}
          <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-x-4 pb-6 pt-2">
            {latestProducts.map(product => (
              <div key={product.id} className="min-w-0 w-[48%] flex-shrink-0 snap-start">
                <ProductCard
                  product={product}
                  viewProduct={viewProduct}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                />
              </div>
            ))}
          </div>

          {/* Desktop: horizontal scroll (unchanged) */}
          <div className="hidden md:flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-x-4 md:gap-x-6 pb-6 md:pb-8 pt-2">
            {latestProducts.map(product => (
              <div key={product.id} className="min-w-0 w-[calc(25%-18px)] flex-shrink-0 snap-start">
                <ProductCard
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

      {/* Sticky Stacking Banners (no text — user will use custom images) */}
      <StickyStackBanners />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Best Sellers / Featured Collection */}
      <FeaturedCollection
        products={topPicks}
        viewProduct={viewProduct}
        toggleWishlist={toggleWishlist}
        wishlist={wishlist}
      />

      {/* Brand Introduction */}
      <OurStoryTeaser />

      {/* Brand Features (Icons) */}
      <FeaturesSection />

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Minimalist Bottom Sections Matching Ektaraa style */}
      <SEOContent />
    </div>
  );
};

export default HomePage;




