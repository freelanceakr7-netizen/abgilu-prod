import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { scrollToTop } from '../src/utils/scrollUtils';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Check initial scroll position
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-[84px] right-4 sm:right-8 z-[90] flex h-11 w-11 items-center justify-center rounded-full bg-indigo text-kora shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-terracotta hover:scale-110 active:scale-95 group focus:outline-none ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
      title="Back to Top"
      aria-label="Scroll to top"
    >
      <div className="relative z-10 flex flex-col items-center">
        <ChevronUp className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" />
        <span className="text-[8px] uppercase tracking-[0.2em] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
          Top
        </span>
      </div>
    </button>
  );
};

export default ScrollToTopButton;


