import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryContext } from '../src/contexts/CategoryContext';
import { categoryNameToSlug } from '../src/utils/slugUtils.js';

// Animation keyframes removed for simple movement

// ─── Constants ───────────────────────────────────────────────────────────────
const DARK_GRADIENTS = [
  'linear-gradient(135deg, #1B2838, #0B121A)',
  'linear-gradient(135deg, #2A3A2C, #121A13)',
  'linear-gradient(135deg, #4A3B2C, #241A12)',
  'linear-gradient(135deg, #2C2C2C, #111111)',
  'linear-gradient(135deg, #3A2222, #1C0A0A)',
];

const MOCK_CATEGORIES = [
  { id: 'mock-1', name: 'T-Shirts',    imageUrl: '', isActive: true, parentId: null },
  { id: 'mock-2', name: 'Oversized',   imageUrl: '', isActive: true, parentId: null },
  { id: 'mock-3', name: 'Essentials',  imageUrl: '', isActive: true, parentId: null },
  { id: 'mock-4', name: 'Edition',     imageUrl: '', isActive: true, parentId: null },
  { id: 'mock-5', name: 'Graphic Tees',imageUrl: '', isActive: true, parentId: null },
];

// ─── Component ───────────────────────────────────────────────────────────────
const ShopByCategory = () => {
  const { categories, loading } = useCategoryContext();
  const navigate   = useNavigate();
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated]   = useState(true);
  const [isVisible,   setIsVisible]     = useState(true);
  const [orderedCats, setOrderedCats]   = useState([]);
  const [touchStartX, setTouchStartX]   = useState(null);
  const [animKey,     setAnimKey]       = useState(0); // re-trigger anim on rotate

  // ── Category data ──────────────────────────────────────────────────────────
  const allMain    = categories.filter(cat => !cat.parentId);
  const activeMain = allMain.filter(cat => cat.isActive === true);
  const inactiveMain = allMain.filter(cat => cat.isActive !== true);

  const dedupe = (arr) =>
    arr.filter((cat, idx, self) =>
      idx === self.findIndex(c => c.name.trim().toLowerCase() === cat.name.trim().toLowerCase())
    );

  const merged = [...dedupe(activeMain), ...dedupe(inactiveMain)].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    const dateA = a.createdAt?.seconds || new Date(a.createdAt).getTime() || 0;
    const dateB = b.createdAt?.seconds || new Date(b.createdAt).getTime() || 0;
    return dateB - dateA;
  });

  let displayCategories = merged.length > 0 ? merged : MOCK_CATEGORIES;
  displayCategories = displayCategories.slice(0, 8);

  // ── Sync orderedCats ───────────────────────────────────────────────────────
  useEffect(() => {
    if (displayCategories.length > 0) {
      setOrderedCats(displayCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(displayCategories.map(c => c.id + c.name + c.isActive))]);

  // ── IntersectionObserver removed to ensure cards are always visible ──────
  useEffect(() => {
    // Animation will run on mount naturally
  }, []);

  // ── Rotation helpers ───────────────────────────────────────────────────────
  const rotateNext = (e) => {
    if (e) e.stopPropagation();
    setOrderedCats(prev => {
      const arr = [...prev];
      arr.push(arr.shift());
      return arr;
    });
  };

  const rotatePrev = (e) => {
    if (e) e.stopPropagation();
    setOrderedCats(prev => {
      const arr = [...prev];
      arr.unshift(arr.pop());
      return arr;
    });
  };

  const handleItemClick = (index, cat, offset) => {
    if (offset === 0) {
      navigate(`/collections/${categoryNameToSlug(cat.name)}`);
    } else if (offset < 0) {
      rotatePrev();
    } else {
      rotateNext();
    }
  };

  if (loading && displayCategories.length === 0) return null;
  if (orderedCats.length === 0) return null;

  const isMobile = window.innerWidth < 768;

  return (
    <section
      ref={sectionRef}
      className="py-4 md:pt-8 md:pb-0 overflow-hidden"
      style={{ backgroundColor: '#F0E1C6' }}
    >
      <div className="max-w-[1400px] mx-auto px-4">

        {/* ── Title ── */}
        <h2
          className={isVisible ? 'sbc-title-animate' : ''}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(28px, 6vw, 54px)',
            color: '#4c0e0e',
            letterSpacing: '0.15em',
            lineHeight: '1.1',
            fontWeight: 700,
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            opacity: isVisible ? undefined : 0,
            animationDelay: '0.05s',
          }}
        >
          SHOP BY CATEGORY
        </h2>

        {/* ── Fan cards container ── */}
        <div
          className="relative w-full mx-auto flex justify-center"
          style={{
            height: isMobile ? 'min(380px, 90vw)' : 'min(700px, 55vw)',
            marginTop: isMobile ? '1.5rem' : '3.5rem',
            pointerEvents: 'none',
            touchAction: 'pan-y',
          }}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? rotateNext() : rotatePrev();
            setTouchStartX(null);
          }}
        >
          {orderedCats.map((cat, index) => {
            const centerIndex  = Math.floor(orderedCats.length / 2);
            const offset       = index - centerIndex;
            const absOffset    = Math.abs(offset);
            const isActive     = offset === 0;
            const originalIndex = displayCategories.findIndex(c => c.id === cat.id) || 0;

            // ── Final fan positions ──────────────────────────────────────────
            let translateX = '0px';
            let rotate     = '0deg';
            let scale      = 1;
            let opacity    = 1;

            if      (offset === -2) { translateX = 'calc(-1 * min(280px, 40vw))'; rotate = '-24deg'; scale = 0.70; }
            else if (offset === -1) { translateX = 'calc(-1 * min(160px, 22vw))'; rotate = '-12deg'; scale = 0.85; }
            else if (offset ===  0) { translateX = '0px';                         rotate =   '0deg'; scale = 1; }
            else if (offset ===  1) { translateX = 'min(160px, 22vw)';            rotate =  '12deg'; scale = 0.85; }
            else if (offset ===  2) { translateX = 'min(280px, 40vw)';            rotate =  '24deg'; scale = 0.70; }
            else if (offset  < -2)  { translateX = 'calc(-1 * min(480px, 60vw))'; rotate = '-40deg'; scale = 0.60; opacity = 0; }
            else if (offset  >  2)  { translateX = 'min(480px, 60vw)';            rotate =  '40deg'; scale = 0.60; opacity = 0; }

            const zIndex = 50 - absOffset * 10;

            // ── Stagger delay: center card first, then outward ───────────────
            // offset 0 → 0s, offset ±1 → 0.1s, offset ±2 → 0.2s …
            const staggerDelay = isVisible ? `${absOffset * 0.12 + 0.15}s` : '0s';

            // CSS vars used in the @keyframes final state
            const cssVars = {
              '--card-translate-x': translateX,
              '--card-scale':  scale,
              '--card-rotate': rotate,
            };

            return (
              <div
                key={cat.id}
                className="absolute top-0 cursor-pointer pointer-events-auto"
                style={{
                  ...cssVars,
                  width:  isMobile ? 'min(260px, 65vw)' : 'min(420px, 75vw)',
                  height: isMobile ? 'min(360px, 85vw)' : 'min(580px, 100vw)',
                  zIndex,
                  transformOrigin: 'bottom center',
                  /* After animation finishes, hold the fan position */
                  transform: isVisible
                    ? `translateX(${translateX}) scale(${scale}) rotate(${rotate})`
                    : 'translateY(120px) scale(0.7) rotate(0deg)',
                  opacity: isVisible ? opacity : 0,
                  visibility: opacity === 0 ? 'hidden' : 'visible',
                  /* Smooth rotation transition when cards are clicked */
                  transition: isVisible
                    ? 'opacity 0.4s ease, box-shadow 0.3s'
                    : 'none',
                  animationDelay: staggerDelay,
                  animationFillMode: 'both',
                }}
                onClick={() => handleItemClick(index, cat, offset)}
              >
                <div
                  className="block w-full h-full rounded-[1.2rem] overflow-hidden relative group"
                  style={{
                    background: cat.imageUrl
                      ? `url(${cat.imageUrl}) center/cover`
                      : DARK_GRADIENTS[originalIndex % DARK_GRADIENTS.length],
                    boxShadow: isActive
                      ? '0px 32px 60px -10px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.06)'
                      : '0px 15px 30px -10px rgba(0,0,0,0.35)',
                    transition: 'box-shadow 0.45s ease',
                  }}
                >
                  {/* Shimmer overlay on active card */}
                  {isActive && (
                    <div
                      className="sbc-shimmer-line absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)',
                        backgroundSize: '200% 100%',
                        borderRadius: 'inherit',
                      }}
                    />
                  )}

                  {/* Gradient overlay at bottom */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)',
                    }}
                  />

                  {/* Category label */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-left">
                    <h3
                      className="text-white font-bold tracking-wide transition-transform duration-500 group-hover:scale-105"
                      style={{
                        fontSize: isMobile ? '1.25rem' : '1.6rem',
                        textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                      }}
                    >
                      {cat.name}
                    </h3>
                    {isActive && (
                      <span
                        className="text-white/70 text-xs mt-1 tracking-widest uppercase font-medium transition-opacity duration-500 group-hover:text-white/90"
                      >
                        Shop Now →
                      </span>
                    )}
                  </div>

                  {/* Left arrow */}
                  {offset === -1 && (
                    <div
                      className="absolute top-1/2 left-4 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 bg-black/40 text-white flex items-center justify-center pointer-events-auto opacity-90 hover:bg-black/60 transition-all z-50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); rotateNext(e); }}
                    >
                      <span className="text-3xl md:text-4xl leading-none" style={{ marginTop: '-2px' }}>‹</span>
                    </div>
                  )}

                  {/* Right arrow */}
                  {offset === 1 && (
                    <div
                      className="absolute top-1/2 right-4 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 bg-black/40 text-white flex items-center justify-center pointer-events-auto opacity-90 hover:bg-black/60 transition-all z-50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); rotatePrev(e); }}
                    >
                      <span className="text-3xl md:text-4xl leading-none" style={{ marginTop: '-2px' }}>›</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Dot indicators ── */}
        <div className="flex justify-center mt-8 md:mt-12 gap-2 relative z-50">
          {displayCategories.map((cat, idx) => {
            const centerCat   = orderedCats[Math.floor(orderedCats.length / 2)];
            const isActiveDot = centerCat && centerCat.id === cat.id;

            return (
              <button
                key={idx}
                onClick={() => {
                  const currentIndex = orderedCats.findIndex(c => c.id === cat.id);
                  const centerIndex  = Math.floor(orderedCats.length / 2);
                  handleItemClick(currentIndex, cat, currentIndex - centerIndex);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActiveDot ? 'sbc-dot-active w-10 bg-[#4c0e0e]' : 'w-2.5 bg-[#4c0e0e]/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
