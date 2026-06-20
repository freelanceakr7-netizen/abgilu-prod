import React, { useState } from 'react';

const faqData = [
  {
    question: "What makes ANGILU different from other streetwear brands in India?",
    answer: "ANGILU is built around forward fashion — premium graphic clothing designed for individuality, visual identity, and everyday wearability. Instead of following short-term trends, ANGILU creates statement pieces with lasting visual appeal and high-quality craftsmanship."
  },
  {
    question: "Are ANGILU t-shirts suitable for everyday wear?",
    answer: "Yes. ANGILU t-shirts are designed for everyday comfort while maintaining a premium streetwear aesthetic. The fabrics are breathable, comfortable for Indian weather, and made for long daily wear."
  },
  {
    question: "Does ANGILU use premium-quality fabric?",
    answer: "Yes. ANGILU uses carefully selected premium fabrics that provide softness, durability, shape retention, and comfort. Every piece is designed to maintain its fit and feel even after repeated washes."
  },
  {
    question: "Do ANGILU graphic prints fade or crack after washing?",
    answer: "ANGILU uses high-quality printing techniques designed for long-lasting colour retention and durability. With proper care, the graphics remain sharp and visually strong over time."
  },
  {
    question: "How should I wash ANGILU t-shirts?",
    answer: "For best results:\n• Wash inside out\n• Use cold water\n• Use mild detergent\n• Avoid bleach\n• Do not iron directly on prints\nThese steps help maintain print quality and fabric longevity."
  },
  {
    question: "What sizes are available at ANGILU?",
    answer: "ANGILU offers multiple sizes designed for comfortable modern fits. A detailed size chart is available on every product page to help you choose the right fit."
  },
  {
    question: "Does ANGILU ship across India?",
    answer: "Yes. ANGILU delivers across India with secure packaging and tracking support for every order."
  },
  {
    question: "How long does ANGILU delivery take?",
    answer: "Most orders are delivered within 5–7 business days depending on your location."
  },
  {
    question: "Can I track my ANGILU order?",
    answer: "Yes. Once your order is shipped, tracking details are shared through email or SMS so you can monitor your delivery status easily."
  },
  {
    question: "Is Cash on Delivery available on ANGILU?",
    answer: "Yes. Cash on Delivery (COD) is available for eligible locations across India."
  },
  {
    question: "Is online payment safe on ANGILU?",
    answer: "Yes. All online payments on ANGILU are processed through secure and trusted payment gateways to ensure complete payment safety."
  },
  {
    question: "Does ANGILU offer returns and exchanges?",
    answer: "Yes. ANGILU offers returns and exchanges according to our policy guidelines. Customers can contact support for assistance with eligible orders."
  },
  {
    question: "What type of clothing does ANGILU specialise in?",
    answer: "ANGILU specialises in:\n• Graphic T-Shirts\n• Streetwear Apparel\n• 3D Graphic Designs\n• Psychedelic Artwork Clothing\n• Geometrical Illusion Designs\n• Mandala Art Inspired Fashion\n• Minimal Statement Wear"
  },
  {
    question: "Are ANGILU designs limited edition?",
    answer: "Selected ANGILU collections are released in limited quantities to maintain originality and exclusivity."
  },
  {
    question: "Is ANGILU a fast fashion brand?",
    answer: "No. ANGILU focuses on forward fashion — clothing designed with originality, quality, and long-term visual appeal rather than mass-produced trend cycles."
  },
  {
    question: "Who is ANGILU made for?",
    answer: "ANGILU is designed for people who want clothing that feels expressive, modern, and visually distinctive without compromising comfort."
  },
  {
    question: "Can ANGILU t-shirts be styled for streetwear outfits?",
    answer: "Yes. ANGILU pieces are designed for versatile streetwear styling and pair naturally with cargos, denim, jackets, sneakers, and layered fashion looks."
  },
  {
    question: "Are ANGILU products good for gifting?",
    answer: "Yes. ANGILU graphic apparel makes a strong gifting option for people who appreciate fashion, streetwear culture, graphic design, and modern aesthetics."
  },
  {
    question: "Why are ANGILU graphics unique?",
    answer: "ANGILU collections are inspired by futuristic concepts, psychedelic visuals, geometric structures, and artistic design directions that create a distinct visual identity instead of generic trend-based prints."
  },
  {
    question: "Where can I buy ANGILU clothing online?",
    answer: "You can shop directly from the official ANGILU website for the latest collections, new arrivals, and limited releases."
  }
];

const FaqsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-kora text-indigo min-h-screen" style={{ lineHeight: '1.8' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-terracotta font-medium">Customer Support</span>
          <h1 className="text-4xl md:text-5xl font-serif text-indigo">Frequently Asked Questions</h1>
          <div className="w-24 h-[1px] bg-terracotta mx-auto"></div>
          <p className="text-indigo/70 font-light leading-relaxed">
            Find answers to common questions about ANGILU, our products, shipping, and more.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none shadow-sm overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-serif text-indigo pr-8">{faq.question}</h3>
                <span className="text-terracotta text-2xl transition-transform duration-300 transform" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0)' }}>
                  +
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ 
                  maxHeight: openIndex === index ? '500px' : '0',
                  opacity: openIndex === index ? 1 : 0,
                  paddingBottom: openIndex === index ? '1.25rem' : '0'
                }}
              >
                <div className="text-indigo/80 font-light whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqsSection;
