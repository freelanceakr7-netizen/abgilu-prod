import React from 'react';

export const BrandStory = () => {
  return (
    <section className="py-6 md:py-10 px-6 md:px-12 bg-kora overflow-hidden">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] bg-indigo overflow-hidden">
            <img 
              src="/F1.jpg" 
              alt="Artisan at work"
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-64 aspect-square bg-terracotta/90 p-8 flex flex-col justify-end text-kora hidden md:flex">
             <span className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-2">Signature Quality</span>
             <h3 className="text-2xl font-serif italic">The Perfect Fit</h3>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] text-terracotta font-medium">Our Design Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-serif text-indigo leading-tight">
              A Standard Forged in <br />
              <span className="italic text-gold">Style & Comfort.</span>
            </h2>
          </div>
          
          <div className="space-y-6 text-indigo/80 font-light leading-relaxed text-lg max-w-xl">
            <p>
              Born from the desire for the perfect everyday staple, ANGILU is more than a label. 
              It is a dedication to uncompromising quality and the essential pieces that form 
              the foundation of personal style.
            </p>
            <p>
              We engineer our collections with premium textiles and meticulous attention to detail, 
              where the playful iteration of heavyweight cotton and modern silhouettes 
              creates casual luxury for the contemporary wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <div>
              <h4 className="text-2xl font-serif text-indigo mb-2">12+</h4>
              <p className="text-[10px] uppercase tracking-widest text-indigo/40">Signature Fits</p>
            </div>
            <div>
              <h4 className="text-2xl font-serif text-indigo mb-2">100%</h4>
              <p className="text-[10px] uppercase tracking-widest text-indigo/40">Premium Cotton</p>
            </div>
          </div>

          <button className="text-xs uppercase tracking-[0.3em] font-semibold text-terracotta border-b border-terracotta pb-2 hover:text-indigo hover:border-indigo transition-all">
            Explore the Collection
          </button>
        </div>
      </div>
    </section>
  );
};


