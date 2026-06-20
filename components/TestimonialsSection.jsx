import React, { useState, useEffect } from 'react';
import { testimonials } from '../data/testimonials';
import { ThemeContext } from '../src/contexts/ThemeContext';
import { useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const { theme } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToTestimonial = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-primary">From Our Client's Hearts</h2>
          <div className="w-20 h-1 bg-brand-secondary mx-auto"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div 
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className={`text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-none shadow-lg p-12 mx-4 md:mx-8`}>
                    <div className="flex justify-center mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.avatarAlt}
                        className="w-20 h-20 rounded-none object-cover"
                      />
                    </div>
                    <blockquote className={`mb-6 text-lg italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p>"{testimonial.text}"</p>
                    </blockquote>
                    <cite className={`not-italic ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      <span className="font-semibold">{testimonial.name}</span>
                      <span className={`block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.title}</span>
                    </cite>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className={`absolute left-1 md:left-0 top-1/2 transform -translate-y-1/2 md:-translate-x-4 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-black'} rounded-none p-2 shadow-lg transition-colors duration-200 z-10`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextTestimonial}
            className={`absolute right-1 md:right-0 top-1/2 transform -translate-y-1/2 md:translate-x-4 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-black'} rounded-none p-2 shadow-lg transition-colors duration-200 z-10`}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-none transition-colors duration-200 ${
                currentIndex === index
                  ? theme === 'dark' ? 'bg-white' : 'bg-black'
                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;

