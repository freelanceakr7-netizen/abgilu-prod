import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBannerSettings, DEFAULT_BANNERS } from '../src/firebase/services/storefrontService';

const BannerButton = ({ btn }) => {
  const [hovered, setHovered] = useState(false);

  const isSolid = btn.btnStyle === 'solid';
  
  const style = {
    backgroundColor: isSolid 
      ? (hovered ? btn.btnHoverBg : (btn.btnBgColor || btn.btnTextColor))
      : (hovered ? btn.btnHoverBg : 'transparent'),
    color: isSolid
      ? (hovered ? btn.btnHoverText : '#fff')
      : (hovered ? btn.btnHoverText : btn.btnTextColor),
    border: isSolid
      ? 'none'
      : `1.5px solid ${btn.btnBorderColor || btn.btnTextColor}`,
    transition: 'all 0.3s ease',
    borderRadius: '3px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontSize: 'clamp(11px, 1.2vw, 13px)',
    fontFamily: "'Bebas Neue', sans-serif",
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
  };

  // Dynamically resolve target link based on the banner heading/context
  let targetLink = btn.btnLink || '/collections';
  if (targetLink === '/collections' || targetLink === '/shop' || !btn.btnLink) {
    const headingLower = (btn.heading || '').toLowerCase().trim();
    if (headingLower.includes('new arrival')) {
      targetLink = '/collections/new-arrivals';
    } else if (headingLower.includes('best seller') || headingLower.includes('best sellers')) {
      targetLink = '/collections/best-sellers';
    } else if (headingLower.includes('limited run')) {
      targetLink = '/collections/limited-run';
    }
  }

  return (
    <Link
      to={targetLink}
      style={style}
      className="px-8 py-3 md:px-11 md:py-[14px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {btn.btnLabel || 'SHOP NOW'}
    </Link>
  );
};

const StickyStackBanners = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [banners, setBanners] = useState(() => {
    try {
      const cached = localStorage.getItem('storefront_banners_cache');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return DEFAULT_BANNERS;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load banners from Firestore
  useEffect(() => {
    getBannerSettings().then(data => {
      setBanners(data);
      localStorage.setItem('storefront_banners_cache', JSON.stringify(data));
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrolled = -rect.top;
      const totalScrollable = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} style={{ height: `${banners.length * 100}vh`, position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .banner-heading {
          font-family: 'Bebas Neue', sans-serif;
          line-height: 1;
          letter-spacing: 0.02em;
          font-size: clamp(36px, 10vw, 120px);
          text-align: center;
          margin-bottom: 16px;
        }
        .banner-sub {
          font-size: clamp(13px, 1.5vw, 17px);
          letter-spacing: 0.2em;
          text-align: center;
          text-transform: uppercase;
          opacity: 0.8;
          margin-bottom: 40px;
        }
      `}</style>

      {/* Sticky container */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {banners.map((banner, index) => {
          const triggerPoint = index === 0 ? 0 : index / banners.length;
          const slideProgress =
            index === 0
              ? 1
              : Math.max(0, Math.min(1, (scrollProgress - triggerPoint) / (1 / banners.length)));

          const translateY = index === 0 ? 0 : (1 - slideProgress) * 100;

          let underScale = 1;
          if (index < banners.length - 1) {
            const nextTrigger = (index + 1) / banners.length;
            const nextProgress = Math.max(
              0,
              Math.min(1, (scrollProgress - nextTrigger) / (1 / banners.length))
            );
            underScale = 1 - nextProgress * 0.05;
          }

          return (
            <div
              key={banner.id}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: banner.bgColor || '#111',
                borderRadius: index === 0 ? '0' : '18px 18px 0 0',
                transform: `translateY(${translateY}vh) scale(${underScale})`,
                transition: 'transform 0.05s linear',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: index + 1,
              }}
            >
              {/* Resolve image source safely */}
              {(() => {
                const imgSrc = (isMobile && banner.bgImageMobile && banner.bgImageMobile.trim() !== '') 
                  ? banner.bgImageMobile 
                  : (banner.bgImage && banner.bgImage.trim() !== '' ? banner.bgImage : null);
                  
                return imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={banner.heading || 'Banner'}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 1,
                    }}
                  />
                ) : null;
              })()}
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
                <h2
                  className="banner-heading"
                  style={{ color: banner.headingColor || '#fff' }}
                >
                  {banner.heading}
                </h2>
                <p
                  className="banner-sub"
                  style={{ color: banner.subColor || 'rgba(255,255,255,0.75)' }}
                >
                  {banner.subText}
                </p>
                <BannerButton btn={banner} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StickyStackBanners;


