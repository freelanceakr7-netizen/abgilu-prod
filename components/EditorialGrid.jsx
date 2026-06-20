import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHeroSettings, DEFAULT_HERO } from '../src/firebase/services/storefrontService';

export const EditorialGrid = () => {
  const headlineRef = useRef(null);
  const [hero, setHero] = useState(() => {
    try {
      const cached = localStorage.getItem('storefront_hero_cache');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return DEFAULT_HERO;
  });
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load settings from Firestore
  useEffect(() => {
    getHeroSettings().then(data => {
      setHero(data);
      localStorage.setItem('storefront_hero_cache', JSON.stringify(data));
      setLoaded(true);
    });
  }, []);

  // Stagger word reveal after settings are loaded
  useEffect(() => {
    if (!loaded) return;
    const words = headlineRef.current?.querySelectorAll('.hero-word');
    if (!words) return;
    words.forEach((word, i) => {
      word.style.animationDelay = `${i * 0.12}s`;
    });
  }, [loaded]);

  const heroLines = hero.heading.split('\n');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@700&display=swap');

        .hero-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 0.05em;
        }

        .hero-word {
          display: inline-block;
          font-family: 'Bebas Neue', 'Oswald', sans-serif;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        .hero-sub-reveal {
          /* Animation removed */
        }

        .hero-btn-reveal {
          /* Animation removed */
        }

        .hero-shop-btn {
          display: inline-block;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.25em;
          font-size: clamp(12px, 1.5vw, 15px);
          text-transform: uppercase;
          text-decoration: none;
          color: inherit;
          padding-bottom: 6px;
          border-bottom: 1.5px solid currentColor;
          transition: opacity 0.3s ease, letter-spacing 0.3s ease;
        }
        .hero-shop-btn:hover {
          opacity: 0.7;
          letter-spacing: 0.35em;
        }
        
        .hero-bg-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transform: scale(1.15);
          transition: transform 2.2s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        
        .hero-container:hover .hero-bg-image {
          transform: scale(1.0);
        }
      `}</style>

      {/* Full-width Hero Banner matching edge-to-edge requirement */}
      <div className="w-full bg-kora">
        <div
          className="hero-container relative w-full overflow-hidden flex flex-col items-center justify-center p-6 md:p-10 group cursor-pointer"
          style={{
            minHeight: 'clamp(500px, 80vh, 900px)',
            backgroundColor: hero.bgColor,
            borderRadius: '0px',
          }}
        >
          {/* Background image with hover zoom */}
          {(() => {
            const imgSrc = (isMobile && hero.bgImageMobile && hero.bgImageMobile.trim() !== '') 
              ? hero.bgImageMobile 
              : (hero.bgImage && hero.bgImage.trim() !== '' ? hero.bgImage : null);
              
            return imgSrc ? (
              <img
                src={imgSrc}
                alt="Hero background"
                className="hero-bg-image"
              />
            ) : null;
          })()}

          {/* Dark overlay removed */}

          {/* Centered Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full">

            {/* Optional Heading with subtle hover scale-down */}
            {hero.heading && (
              <h1
                ref={headlineRef}
                className="leading-[0.85] mb-8 w-full transition-transform duration-700 ease-out group-hover:scale-[0.97]"
                style={{ 
                  fontSize: 'clamp(32px, 10vw, 110px)',
                  color: hero.headingColor || '#FFFFFF',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {heroLines.map((line, li) => (
                  <div key={li} className="block">
                    {line.split(' ').map((word, wi) => (
                      <span key={wi} className="hero-word-wrap mr-[0.22em] last:mr-0">
                        <span
                          className="hero-word"
                          style={{
                            color: 'inherit',
                            animationDelay: `${(li * 3 + wi) * 0.12}s`,
                          }}
                        >
                          {word}
                        </span>
                      </span>
                    ))}
                  </div>
                ))}
              </h1>
            )}

            {/* Sub text */}
            {hero.subText && (
              <p
                className="hero-sub-reveal text-sm md:text-lg tracking-[0.3em] uppercase mb-12 font-medium"
                style={{ color: hero.subColor || '#FFFFFF' }}
              >
                {hero.subText}
              </p>
            )}

            {/* Centered SHOP NOW button */}
            <div className="hero-btn-reveal" style={{ animationDelay: '0.2s', opacity: 1, animation: 'none' }}>
              <Link
                to={hero.btnLink || '#collections'}
                onClick={(e) => {
                  const target = hero.btnLink || '#collections';
                  if (target.startsWith('#')) {
                    e.preventDefault();
                    const element = document.querySelector(target);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      // Update URL without reloading
                      window.history.pushState(null, '', target);
                    }
                  }
                }}
                className="inline-block tracking-[0.3em] font-bold text-[14px] md:text-[18px] uppercase pb-2 transition-transform hover:scale-105"
                style={{
                  color: hero.headingColor || '#FFFFFF',
                  borderBottom: `2px solid ${hero.headingColor || '#FFFFFF'}`,
                  fontFamily: "'Bebas Neue', 'Oswald', sans-serif"
                }}
              >
                {hero.btnLabel || 'SHOP NOW'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorialGrid;


