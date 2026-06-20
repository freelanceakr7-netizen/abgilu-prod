import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../src/contexts/ThemeContext';

const BrandCarousel = ({ logos }) => {
  const { theme } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Default logos if none provided
  const defaultLogos = [
    "/images/Logo.png",
    "/images/Logo.png",
    "/images/Logo.png",
    "/images/Logo.png",
    "/images/Logo.png"
  ];
  
  const logosList = logos || defaultLogos;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logosList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [logosList.length]);

  return (
    <div className={`py-6 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="overflow-hidden mx-[-2rem]">
          <div className="flex space-x-12 px-8 transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(-${currentIndex * 28}%)` }}>
            {[...logosList, ...logosList].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-1/5 md:w-1/5 lg:w-1/5"
              >
                <div className={`${theme === 'dark' ? '' : ''} rounded-none p-6 flex items-center justify-center h-24 transition-colors duration-300 mx-2`}>
                  <img
                    src={logo}
                    alt={`Brand ${index + 1}`}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;

