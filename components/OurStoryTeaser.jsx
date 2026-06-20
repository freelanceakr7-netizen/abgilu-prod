import React from 'react';
import { Link } from 'react-router-dom';

const OurStoryTeaser = () => (
  <section className="py-6 md:py-10 px-4 sm:px-[40px] bg-kora">
    <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 lg:gap-24">
      
      {/* Left Image Banner */}
      <div className="w-full md:w-1/2 flex-shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80" 
          alt="ANGILU Our Story" 
          className="w-full object-cover shadow-2xl"
          style={{ aspectRatio: '4/3', minHeight: 'unset' }}
        />
      </div>

      {/* Right Content */}
      <div className="w-full md:w-1/2 text-left">
        {/* Heading */}
        <h2 className="text-2xl md:text-5xl font-serif text-indigo font-bold mb-4 md:mb-8 leading-tight">
          This is not Fast fashion,<br />
          <span className="text-terracotta italic">This is Forward fashion.</span>
        </h2>

        {/* Body */}
        <p className="text-base md:text-lg text-indigo/70 font-light leading-relaxed mb-8">
          ANGILU introduces 3D graphic-designed T-shirts that move beyond flat fashion. Every ANGILU piece is crafted to create stronger visual identity through refined colour precision, realistic depth, and elevated personal style — transforming a simple T-shirt into wearable visual expression where modern identity meets future-facing design.
        </p>

        {/* Pull quote */}
        <blockquote className="border-l-4 border-terracotta pl-5 my-10 text-left">
          <p className="text-indigo/80 font-serif italic text-lg leading-relaxed">
            "ANGILU don't just make tees. Angilu brings a new dimension to everyday apparel, where design is seen, felt, and remembered."
          </p>
          <cite className="text-[10px] uppercase tracking-widest text-indigo/40 mt-3 block not-italic">
            — Team ANGILU
          </cite>
        </blockquote>

        {/* Read Our Story CTA */}
        <Link
          to="/about"
          className="btn-slide inline-flex mt-4 px-8 py-4 text-kora text-[11px] uppercase tracking-[0.2em] font-bold rounded-none"
          style={{ backgroundColor: '#4c0e0e' }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>Read Our Story</span>
        </Link>
      </div>
    </div>
  </section>
);

export default OurStoryTeaser;


