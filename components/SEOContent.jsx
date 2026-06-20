import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SEOContent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-kora pt-16 pb-12 px-4 sm:px-[40px] border-t border-indigo/5">
      <div className="max-w-screen-2xl mx-auto">
        {/* Title — always visible */}
        <h2 className="font-serif text-[32px] md:text-[48px] text-indigo mb-6 leading-tight max-w-5xl">
          ANGILU – Premium Streetwear &amp; Graphic T-Shirts for Everyday Expression in India
        </h2>

        <div className="max-w-4xl space-y-6">
          {/* Always visible paragraph */}
          <p className="text-indigo/70 text-lg md:text-xl font-light leading-relaxed">
            ANGILU is an Indian streetwear brand built for people who refuse to blend into the background. Every piece is designed around individuality, visual identity, and everyday wearability. From statement graphic t-shirts and artistic prints to futuristic visuals and conceptual collections, ANGILU creates clothing that feels expressive without trying too hard.
          </p>

          {/* Collapsible section */}
          <div
            className={`text-indigo/70 text-base md:text-lg font-light leading-relaxed space-y-8 transition-all duration-1000 overflow-hidden ${
              isExpanded ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <p className="font-semibold text-terracotta tracking-wider uppercase text-sm">
              This is not fast fashion. This is forward fashion.
            </p>

            <p>
              Our collections combine premium fabrics, bold graphic direction, and wearable silhouettes designed for everyday life in India. Whether you are building a modern streetwear wardrobe, looking for standout graphic t-shirts, or searching for apparel that feels original, ANGILU creates pieces that become part of your identity rather than just another outfit.
            </p>

            {/* What Is Forward Fashion */}
            <div className="space-y-4 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">What Is Forward Fashion?</h3>
              <p>Most fashion follows trends. Forward fashion creates presence.</p>
              <p>
                ANGILU was built around the idea that clothing should feel personal, visual, and lasting instead of disposable. Our pieces are not designed to chase short-lived hype cycles. They are designed to hold visual impact season after season.
              </p>
              <p>Every collection is created around distinct artistic directions:</p>
              <ul className="list-disc pl-6 space-y-1 text-base">
                <li>3D Graphic Designs</li>
                <li>Geometrical Illusions</li>
                <li>Psychedelic Visuals</li>
                <li>Mandala Art</li>
                <li>Futuristic Concepts</li>
                <li>Minimal Streetwear Essentials</li>
              </ul>
              <p>The result is clothing that feels expressive, modern, and wearable at the same time.</p>
            </div>

            {/* Premium Fabric */}
            <div className="space-y-4 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">Premium Fabric &amp; Everyday Comfort</h3>
              <p>A graphic t-shirt should not just look good online. It should feel good every time you wear it.</p>
              <p>ANGILU uses premium-quality fabrics selected for:</p>
              <ul className="list-disc pl-6 space-y-1 text-base">
                <li>Breathability in Indian weather</li>
                <li>Soft everyday comfort</li>
                <li>Long-lasting durability</li>
                <li>Shape retention after washes</li>
                <li>Smooth surface finish for detailed graphics</li>
              </ul>
              <p>Our t-shirts are designed to maintain their structure, fit, and print quality through regular daily wear.</p>
              <p>
                Whether you are wearing them for college, work, travel, night outings, content creation, or casual everyday styling, ANGILU pieces are made to move naturally with your lifestyle.
              </p>
            </div>

            {/* High-Quality Graphic Printing */}
            <div className="space-y-4 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">High-Quality Graphic Printing</h3>
              <p>Graphic clothing loses its impact when prints crack, fade, or peel after a few washes.</p>
              <p>ANGILU uses premium printing methods designed for:</p>
              <ul className="list-disc pl-6 space-y-1 text-base">
                <li>Sharp visual detailing</li>
                <li>Deep colour retention</li>
                <li>Clean contrast</li>
                <li>Long-lasting durability</li>
                <li>Smooth texture integration with fabric</li>
              </ul>
              <p>Our graphics are designed as wearable visual art rather than temporary trend prints.</p>
            </div>

            {/* Why ANGILU Stands Out */}
            <div className="space-y-4 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">Why ANGILU Stands Out in India's Streetwear Market</h3>
              <p>Most streetwear today falls into two extremes:</p>
              <ul className="list-disc pl-6 space-y-1 text-base">
                <li>Mass-produced trend clothing</li>
                <li>Overpriced hype-focused fashion</li>
              </ul>
              <p>ANGILU was created to build something different. We make streetwear that:</p>
              <ul className="list-disc pl-6 space-y-1 text-base">
                <li>Feels visually original</li>
                <li>Prioritises fit and comfort equally</li>
                <li>Works for everyday styling</li>
                <li>Maintains premium aesthetics without overcomplication</li>
                <li>Balances bold graphics with wearable silhouettes</li>
              </ul>
              <p>Our clothing is designed for people who want presence without forcing attention.</p>
            </div>

            {/* Explore Collections */}
            <div className="space-y-6 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">Explore ANGILU Collections</h3>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Graphic T-Shirts</h4>
                <p>ANGILU graphic t-shirts are designed with balanced proportions, comfortable silhouettes, and sharp visual direction. Our collection includes:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Minimal essentials</li>
                  <li>Heavy graphic prints</li>
                  <li>Futuristic concepts</li>
                  <li>Psychedelic artwork</li>
                  <li>Geometric illusion designs</li>
                  <li>Statement back-print t-shirts</li>
                </ul>
                <p>Each piece is designed to layer naturally and work across multiple styling directions.</p>
                <Link to="/shop" className="text-terracotta hover:underline font-medium block mt-1">Explore the full Graphic T-Shirts Collection →</Link>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">3D Graphic Designed T-Shirts</h4>
                <p>The 3D Graphics collection focuses on depth, dimension, and futuristic visual composition. These designs include:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Metallic visual effects</li>
                  <li>Cyber aesthetics</li>
                  <li>Abstract rendering</li>
                  <li>Digital textures</li>
                  <li>Optical depth illusions</li>
                  <li>Futuristic layouts</li>
                </ul>
                <p>Designed for people who want graphic clothing that feels immersive and visually sharp.</p>
                <Link to="/shop" className="text-terracotta hover:underline font-medium block mt-1">Explore the full 3D Graphic Collection →</Link>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Psychedelic Collection</h4>
                <p>The Psychedelic collection explores distorted visuals, surreal colour play, and altered perspectives. These pieces combine:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Trippy artwork</li>
                  <li>Dream-like visuals</li>
                  <li>Abstract storytelling</li>
                  <li>High-energy compositions</li>
                  <li>Experimental graphics</li>
                </ul>
                <p>Built for expressive styling and bold visual identity.</p>
                <Link to="/shop" className="text-terracotta hover:underline font-medium block mt-1">Explore the full Psychedelic Collection →</Link>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Geometrical Illusion Collection</h4>
                <p>Geometry meets visual experimentation. This collection is built around:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Optical illusion graphics</li>
                  <li>Symmetry-based artwork</li>
                  <li>Structured linework</li>
                  <li>Dimensional patterns</li>
                  <li>Precision-focused layouts</li>
                </ul>
                <p>The designs feel modern, architectural, and visually intelligent.</p>
                <Link to="/shop" className="text-terracotta hover:underline font-medium block mt-1">Explore the full Geometrical Illusion Collection →</Link>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Mandala Art Collection</h4>
                <p>The Mandala collection combines symmetry, calm structure, and spiritual-inspired visual balance. These designs focus on:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Sacred geometry</li>
                  <li>Detailed circular artwork</li>
                  <li>Minimal spiritual aesthetics</li>
                  <li>Balanced compositions</li>
                  <li>Clean visual harmony</li>
                </ul>
                <p>Designed for everyday wear with artistic depth.</p>
                <Link to="/shop" className="text-terracotta hover:underline font-medium block mt-1">Explore the full Mandala Art Collection →</Link>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Essentials Collection</h4>
                <p>Not every outfit needs noise. The Essentials collection is built around:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Clean silhouettes</li>
                  <li>Minimal branding</li>
                  <li>Versatile colours</li>
                  <li>Everyday layering</li>
                  <li>Timeless styling</li>
                </ul>
                <p>These are pieces designed to work effortlessly across daily wardrobes.</p>
                <Link to="/shop" className="text-terracotta hover:underline font-medium block mt-1">Explore the full Essentials Collection →</Link>
              </div>
            </div>

            {/* Streetwear for Everyday Life */}
            <div className="space-y-6 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">Streetwear for Everyday Life</h3>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Everyday Wear</h4>
                <p>ANGILU clothing is designed for repeated wear, not occasional use. Our pieces work across:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>College</li>
                  <li>Cafes</li>
                  <li>Creative workspaces</li>
                  <li>Travel</li>
                  <li>Casual outings</li>
                  <li>Daily streetwear styling</li>
                </ul>
                <p>Comfort, structure, and visual identity remain balanced in every design.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Travel &amp; Content Creation</h4>
                <p>Travel and content creation demand clothing that photographs well while remaining comfortable for long hours. ANGILU designs are created with:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Strong visual composition</li>
                  <li>Layer-friendly silhouettes</li>
                  <li>Statement graphics</li>
                  <li>Social-media-friendly aesthetics</li>
                  <li>Comfortable movement</li>
                </ul>
                <p>The pieces are designed to look equally strong in person and on camera.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Streetwear Layering</h4>
                <p>Modern styling is built around layering and proportion. ANGILU silhouettes are designed to pair naturally with:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Cargo pants</li>
                  <li>Denim</li>
                  <li>Jackets</li>
                  <li>Streetwear sneakers</li>
                  <li>Minimal accessories</li>
                  <li>Utility fashion</li>
                </ul>
                <p>The collections are intentionally versatile across styling directions.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl text-indigo font-semibold">Limited Releases</h4>
                <p>ANGILU focuses on curated releases instead of overwhelming quantity. Rather than producing endless repetitive designs, we release collections selectively to maintain originality and stronger visual identity.</p>
                <p className="font-medium text-indigo/80">Because forward fashion should feel intentional.</p>
              </div>
            </div>

            {/* Fit & Silhouette */}
            <div className="space-y-4 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">Fit &amp; Silhouette Philosophy</h3>
              <p>Fit changes how clothing feels emotionally. ANGILU silhouettes are designed to create:</p>
              <ul className="list-disc pl-6 space-y-1 text-base">
                <li>Relaxed confidence</li>
                <li>Structured drape</li>
                <li>Clean shoulder fall</li>
                <li>Comfortable movement</li>
                <li>Strong visual proportions</li>
              </ul>
              <p>Every measurement is considered to balance comfort with streetwear aesthetics.</p>
            </div>

            {/* Care Instructions */}
            <div className="space-y-4 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">Care Instructions</h3>
              <p>To maintain print quality and fabric longevity:</p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Washing</h4>
                  <ul className="list-disc pl-6 space-y-1 text-base">
                    <li>Wash inside out</li>
                    <li>Use cold water</li>
                    <li>Mild detergent only</li>
                    <li>Avoid bleach</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Drying</h4>
                  <ul className="list-disc pl-6 space-y-1 text-base">
                    <li>Air dry recommended</li>
                    <li>Avoid excessive heat drying</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Ironing</h4>
                  <ul className="list-disc pl-6 space-y-1 text-base">
                    <li>Iron inside out only</li>
                    <li>Avoid direct heat on graphics</li>
                  </ul>
                </div>
              </div>
              <p>Proper care helps preserve print sharpness and fabric structure for long-term wear.</p>
            </div>

            {/* Most Loved & New Arrivals */}
            <div className="space-y-6 pt-2 border-t border-indigo/10">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-indigo font-bold">Most Loved Pieces</h3>
                <p>Our Best Sellers collection highlights the designs customers return to most. These are pieces chosen for:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Visual impact</li>
                  <li>Everyday versatility</li>
                  <li>Premium comfort</li>
                  <li>Strong fit</li>
                  <li>Long-lasting wearability</li>
                </ul>
                <Link to="/shop" className="text-terracotta hover:underline font-medium block mt-1">Explore the Best Sellers Collection →</Link>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-indigo font-bold">New Arrivals</h3>
                <p>ANGILU releases new designs regularly while staying consistent with the brand's visual identity. Our New Arrivals section features:</p>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  <li>Fresh graphics</li>
                  <li>New silhouettes</li>
                  <li>Updated concepts</li>
                  <li>Experimental visual directions</li>
                </ul>
                <p>Every release is built to add something meaningful rather than follow temporary trends.</p>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4 pt-2 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold">Frequently Asked Questions</h3>
              <div className="space-y-4 text-base">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">What makes ANGILU different from other streetwear brands?</h4>
                  <p>ANGILU focuses on forward fashion — clothing designed around originality, visual identity, and everyday wearability rather than trend chasing.</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Do ANGILU graphic prints fade after washing?</h4>
                  <p>Our prints are created using premium printing methods designed for long-lasting colour and detail retention when cared for properly.</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Is ANGILU suitable for everyday wear?</h4>
                  <p>Yes. ANGILU clothing is designed for daily comfort while maintaining strong visual presence.</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Does ANGILU ship across India?</h4>
                  <p>Yes. We deliver across India with secure checkout and order tracking support.</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">How long does ANGILU delivery take?</h4>
                  <p>Most orders are delivered within 5–7 business days depending on your location.</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Is Cash on Delivery available on ANGILU?</h4>
                  <p>Yes. Cash on Delivery (COD) is available for eligible locations across India.</p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-indigo">Can I exchange sizes?</h4>
                  <p>Yes. Easy size exchange options are available according to our exchange policy.</p>
                </div>
              </div>
            </div>

            {/* Philosophy */}
            <div className="space-y-4 pt-6 border-t border-indigo/10">
              <h3 className="font-serif text-2xl text-indigo font-bold text-center">The ANGILU Philosophy</h3>
              <p className="italic text-center text-xl text-indigo/80 font-serif leading-relaxed max-w-2xl mx-auto">
                "Style should not feel borrowed. The clothes you wear should feel like an extension of your mindset, your energy, and your presence. Not just another trend copied from somewhere else."
              </p>
              <p className="text-center font-light">
                ANGILU was built for people who dress with intention. People who want their clothing to feel visual, expressive, and memorable without becoming loud for the sake of attention. Every graphic, silhouette, texture, and composition is designed with that purpose: to create clothing that feels like identity, not costume.
              </p>
              <p className="text-center font-semibold text-terracotta tracking-wider uppercase text-sm">
                This is not fast fashion. This is forward fashion.
              </p>
            </div>

            {/* Sitemap Navigation */}
            <div className="pt-8 border-t border-indigo/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-sm font-light">
              <div className="space-y-2">
                <h4 className="font-bold text-indigo uppercase tracking-wider">Shop by Collection</h4>
                <div className="flex flex-col gap-1 text-indigo/70">
                  <Link to="/shop" className="hover:text-terracotta transition-colors">Graphic T-Shirts</Link>
                  <Link to="/shop" className="hover:text-terracotta transition-colors">3D Graphics</Link>
                  <Link to="/shop" className="hover:text-terracotta transition-colors">Psychedelic</Link>
                  <Link to="/shop" className="hover:text-terracotta transition-colors">Geometrical Illusion</Link>
                  <Link to="/shop" className="hover:text-terracotta transition-colors">Mandala Art</Link>
                  <Link to="/shop" className="hover:text-terracotta transition-colors">Essentials</Link>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-indigo uppercase tracking-wider">Discover</h4>
                <div className="flex flex-col gap-1 text-indigo/70">
                  <Link to="/shop" className="hover:text-terracotta transition-colors">New Arrivals</Link>
                  <Link to="/shop" className="hover:text-terracotta transition-colors">Best Sellers</Link>
                  <Link to="/shop" className="hover:text-terracotta transition-colors">Limited Releases</Link>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-indigo uppercase tracking-wider">Learn More</h4>
                <div className="flex flex-col gap-1 text-indigo/70">
                  <Link to="/about" className="hover:text-terracotta transition-colors">About ANGILU</Link>
                  <Link to="/shipping-policy" className="hover:text-terracotta transition-colors">Shipping Policy</Link>
                  <Link to="/returns-policy" className="hover:text-terracotta transition-colors">Returns &amp; Exchanges</Link>
                  <Link to="/contact" className="hover:text-terracotta transition-colors">Contact Us</Link>
                  <Link to="/faqs" className="hover:text-terracotta transition-colors">FAQ's</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="pt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="border border-indigo text-indigo px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-indigo hover:text-kora transition-all duration-300"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContent;
