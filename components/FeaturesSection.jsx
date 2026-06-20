import React, { useContext } from 'react';
import { ThemeContext } from '../src/contexts/ThemeContext';

const FeaturesSection = () => {
  const { theme } = useContext(ThemeContext);

  const features = [
    {
      title: 'PREMIUM COMFORT FABRIC',
      description: 'Ultra-soft, breathable fabric designed for premium everyday comfort.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a8.59 8.59 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
        </svg>
      ),
    },
    {
      title: 'AUTHENTIC COLOR PRECISION',
      description: 'Tones designed to hold richness, depth, and clarity in every capture.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
      ),
    },
    {
      title: 'CAMERA-READY FITS',
      description: 'Tailored to deliver clean structure, natural drape, and a confident visual silhouette.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      ),
    },
    {
      title: 'FLEXIBLE PAYMENT',
      description: 'Pay with Multiple Payment Methods',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          <line x1="2" x2="22" y1="10" y2="10"/>
        </svg>
      ),
    },
  ];

  return (
    <div className={`pb-8 md:pb-10 pt-4 px-6 md:px-12 ${theme === 'dark' ? 'bg-black' : 'bg-kora'}`}>
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center border border-[#4c0e0e]/15 p-4 sm:p-6 bg-kora-light/50">
              <div 
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-none flex items-center justify-center mb-3 sm:mb-6 shrink-0
                ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-[#EADDCF] text-[#4c0e0e]'}`}
              >
                {feature.icon}
              </div>
              
              <h3
                className={`font-black text-[10px] md:text-[11px] tracking-[0.2em] uppercase mb-4
                  ${theme === 'dark' ? 'text-white' : 'text-[#4c0e0e]'}`}
              >
                {feature.title}
              </h3>
              
              <p
                className={`text-sm md:text-[14px] leading-relaxed font-light
                  ${theme === 'dark' ? 'text-gray-400' : 'text-[#4c0e0e]/80'}`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

