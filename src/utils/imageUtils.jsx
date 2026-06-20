import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage Component
 * 
 * A reusable component that implements lazy loading for images using IntersectionObserver.
 * Images are only loaded when they come into the viewport, improving initial page load performance.
 * 
 * @param {Object} props
 * @param {string} props.src - The image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - CSS classes to apply to the image
 * @param {string} props.placeholder - Placeholder image to show before loading (optional)
 * @param {Object} props.style - Inline styles to apply to the image (optional)
 * @param {Function} props.onLoad - Callback function when image loads (optional)
 * @param {Function} props.onError - Callback function when image fails to load (optional)
 */
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.jpg',
  style = {},
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease-in-out'
      }}
      loading="lazy"
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

/**
 * LazyImageWithBackground Component
 * 
 * Similar to LazyImage but with a background color or placeholder div
 * while the image is loading. Useful for maintaining layout stability.
 * 
 * @param {Object} props
 * @param {string} props.src - The image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - CSS classes to apply to the container
 * @param {string} props.bgColor - Background color while loading (optional)
 * @param {Object} props.style - Inline styles to apply to the image (optional)
 */
export const LazyImageWithBackground = ({ 
  src, 
  alt, 
  className = '', 
  bgColor = '#f0f0f0',
  style = {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!window.IntersectionObserver) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={imgRef}
      className={className}
      style={{ 
        backgroundColor: bgColor,
        ...style 
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
