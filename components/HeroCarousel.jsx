import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../src/contexts/ThemeContext';
import { Page } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from '../src/utils/imageUtils.jsx';

const HeroCarousel = ({ navigateTo }) => {
  const { theme } = useContext(ThemeContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Slides data with images that provide good contrast for purple/pink text colors
  const slides = [
    {
      id: 1,
      title: "Haath Saga",
      subtitle: "The Story of Hands",
      description: "Where heritage weaves meet modern silhouettes through our curated service offerings.",
      exclusive: "The Heritage Edit",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Explore Now +"
    },
    {
      id: 2,
      title: "The Custom Atelier",
      subtitle: "Made For You",
      description: "Why fit the garment when the garment was meant to fit you?",
      exclusive: "Premium Bespoke Service",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Discover More +"
    },
    {
      id: 3,
      title: "The Signature Line",
      subtitle: "Ready-to-Wear",
      description: "Pre-designed collections with functional details for modern lifestyles.",
      exclusive: "Office-Appropriate Collections",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Shop Collection +"
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    // Reset progress when slide changes
    setProgress(0);
    
    // Increment progress every 100ms
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / 70); // 7000ms / 100ms = 70 steps
      });
    }, 100);
    
    // Change slide after 7 seconds
    const slideInterval = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideInterval);
    };
  }, [isAutoPlay, slides.length, currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    setIsAutoPlay(false);
  };

  const handleShopNow = () => {
    // Navigate to shop page
    navigateTo(Page.SHOP);
  };

  return (
    <div className={`relative w-full overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'} h-[65vh] md:h-[500px]`}>
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <LazyImage
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Overlay */}
            {index === currentSlide && (
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
                  <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0 md:ml-[5%] lg:ml-[260px]">
                    {/* Subtitle with animation */}
                    <div
                      className="mb-2 md:mb-4 animate-fade-in-up font-medium"
                      style={{
                        color: '#4c0e0e',
                        fontSize: 'clamp(18px, 4vw, 28px)',
                        lineHeight: '1.2',
                        animationDelay: '300ms'
                      }}
                    >
                      {slide.subtitle}
                    </div>

                    {/* Main Title with animation */}
                    <h1
                      className="mb-2 md:mb-4 font-bold animate-fade-in-up uppercase tracking-tight px-4 md:px-0"
                      style={{
                        color: '#4c0e0e',
                        fontSize: 'clamp(24px, 6vw, 42px)',
                        lineHeight: '1.1',
                        letterSpacing: '-0.02em',
                        animationDelay: '1000ms'
                      }}
                    >
                      {slide.title}
                    </h1>

                    {/* Description with animation */}
                    <div
                      className="mb-2 animate-fade-in-up uppercase px-4 md:px-0"
                      style={{
                        color: '#4c0e0e',
                        fontSize: 'clamp(14px, 3vw, 18px)',
                        lineHeight: '1.2',
                        animationDelay: '2000ms'
                      }}
                    >
                      {slide.description}
                    </div>

                    {/* Exclusive tag with animation */}
                    <div
                      className="mb-6 font-bold animate-fade-in-up uppercase px-4 md:px-0"
                      style={{
                        color: '#4c0e0e',
                        fontSize: 'clamp(14px, 3vw, 18px)',
                        lineHeight: '1.2',
                        fontWeight: '700',
                        animationDelay: '2500ms'
                      }}
                    >
                      {slide.exclusive}
                    </div>

                    {/* Shop Now Button with animation */}
                    <button
                      onClick={handleShopNow}
                      className="animate-fade-in-up font-bold uppercase text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black shadow-lg px-6 py-3 md:px-9 md:py-4"
                      style={{
                        backgroundColor: '#4c0e0e',
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        letterSpacing: '0.1em',
                        fontWeight: '700',
                        borderRadius: '30px',
                        border: 'none',
                        animationDelay: '3000ms'
                      }}
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - styled similarly but responsive */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 lg:left-[4%] top-1/2 -translate-y-1/2 z-30 items-center justify-center transition-all duration-300 hover:opacity-80 rounded-none bg-black/10 hover:bg-black/20 w-12 h-12 lg:w-[70px] lg:h-[70px]"
      >
        <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 lg:right-[4%] top-1/2 -translate-y-1/2 z-30 items-center justify-center transition-all duration-300 hover:opacity-80 rounded-none bg-black/10 hover:bg-black/20 w-12 h-12 lg:w-[70px] lg:h-[70px]"
      >
        <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
      </button>

      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-gray-300 z-30"
        style={{
          width: '100%',
          height: '3px',
          backgroundColor: 'rgba(0, 0, 0, 0.15)'
        }}
      >
        <div
          className="h-full transition-all duration-100 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: '#4c0e0e'
          }}
        ></div>
      </div>

      {/* Bullets Navigation */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-30"
        style={{ width: '62px', height: '12px' }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative transition-all duration-300"
            style={{
              position: 'absolute',
              left: `${index * 25}px`,
              top: '0px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              boxShadow: index === currentSlide
                ? '0 0 0 2px #4c0e0e'
                : '0 0 0 2px rgba(255,255,255,0)',
              backgroundColor: 'transparent'
            }}
          >
            <span 
              className="absolute inset-0 rounded-none"
              style={{
                backgroundColor: index === currentSlide ? '#4c0e0e' : '#3e444a',
                transform: index === currentSlide ? 'scale(0.4)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            ></span>
          </button>
        ))}
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;

