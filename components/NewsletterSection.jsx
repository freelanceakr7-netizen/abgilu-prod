import React from 'react';

const NewsletterSection = () => {
  return (
    <section className="bg-kora py-6 px-[40px] border-t border-indigo/5">
      <div className="max-w-screen-xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <h2 className="font-serif text-[32px] md:text-[42px] text-indigo leading-tight">
            Join Angilu's Newsletter
          </h2>
          <p className="text-indigo/50 text-[14px] md:text-[16px] tracking-wide">
            Where timeless stories and new creations meet you first.
          </p>
        </div>
        
        <form 
          className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto pt-8 border-b border-indigo/10 pb-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input 
            type="email" 
            placeholder="Enter Your Email" 
            className="w-full bg-transparent border-none outline-none text-center md:text-left text-lg text-indigo placeholder:text-indigo/20 font-light"
          />
          <button 
            type="submit" 
            className="text-indigo/60 hover:text-indigo font-bold text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap"
          >
            Send Now —&gt;
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
