import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="bg-kora text-indigo pt-12 md:pt-16 pb-16 px-6 md:px-12">

    {/* ── Hero ─────────────────────────────────────────────── */}
    <div className="max-w-4xl mx-auto text-center mb-12">
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo uppercase tracking-wider">
        OUR STORY
      </h1>
    </div>

    {/* ── Brand Story ──────────────────────────────────────── */}
    <div className="max-w-3xl mx-auto space-y-6 text-base md:text-lg text-indigo/80 font-light leading-relaxed mb-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-indigo mb-4">
        INTRODUCING THE FUTURE OF APPAREL
      </h2>
      <p className="font-semibold text-indigo text-lg italic font-serif">
        Wear it. Frame it. Own it.
      </p>
      <p>
        At ANGILU, we believe the future does not arrive by accident — it is designed.
      </p>
      <p>
        Our mission is to bring the future of style to you before it becomes mainstream. We study movement, culture, confidence, and individuality to create pieces that feel ahead of their time while remaining timeless in presence.
      </p>
      <p>
        Futuristic fashion, to us, is not about trends that fade. Every piece is shaped through an understanding of movement, individuality, confidence, and visual identity.
      </p>
      <p>
        We do not see fashion as temporary noise. True design is built through silhouettes that empower, details that speak quietly, and craftsmanship that holds its value beyond seasons.
      </p>
      <p>
        Every collection is developed with intention — blending innovation with identity, modern energy with refined discipline.
      </p>
      <p>
        We are not here to replicate what already exists.
      </p>
      <p>
        We are here to redefine what comes next.
      </p>
      <p>
        The future of fashion is not distant.
      </p>
      <p>
        It is wearable.
      </p>
      <p>
        It is present.
      </p>
      <p className="font-bold text-indigo text-xl">
        It is ANGILU.
      </p>
      <p className="font-semibold text-terracotta tracking-wide">
        ANGILU — The Photogenic You
      </p>
    </div>



    {/* ── Our Vision ───────────────────────────────────────── */}
    <div className="max-w-3xl mx-auto mb-16 space-y-6 text-base md:text-lg text-indigo/80 font-light leading-relaxed">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-indigo mb-4">OUR VISION</h2>
      <p>
        The future of ANGILU is global in vision, disciplined in execution, and timeless in ambition. We are building more than clothing; we are shaping a new visual language for modern fashion — one that stands apart through depth, design, and distinction.
      </p>
      <p>
        Each piece is created for the spotlight, for mirror glances, for captured moments, and for memories that remain.
      </p>
      <p>You are not the background.</p>
      <p>You define the scene.</p>
      <p>Our future stands on three pillars:</p>
      <ul className="space-y-3 pl-4">
        {[
          ['Innovation in Design', 'Silhouettes that move ahead of trends.'],
          ['Precision in Craftsmanship', 'Quality that speaks before you do.'],
          ['Confidence in Identity', 'Fashion that reflects who you are becoming.'],
        ].map(([heading, desc]) => (
          <li key={heading} className="flex gap-3">
            <span className="text-terracotta font-bold shrink-0">◆</span>
            <span>
              <strong className="text-indigo">{heading}</strong> — {desc}
            </span>
          </li>
        ))}
      </ul>
      <p>
        We are not here to follow fashion cycles. We are here to shape what comes next — with clarity, discipline, and a vision that extends far beyond the present.
      </p>
      <p className="font-bold text-terracotta tracking-wide">
        ANGILU — The future is already being worn.
      </p>

      {/* ── Pull Quote (moved below Our Vision) ── */}
      <div className="mt-8 text-center">
        <p className="text-xl md:text-2xl font-serif italic text-indigo leading-relaxed mb-2">
          "This is not Fast fashion. This is Forward fashion."
        </p>
        <cite className="text-[11px] uppercase tracking-[0.3em] text-indigo/50 not-italic">
          — Team ANGILU
        </cite>
      </div>
    </div>

    {/* ── Our Commitments ──────────────────────────────────── */}
    <div className="max-w-3xl mx-auto mb-16 space-y-6 text-base md:text-lg text-indigo/80 font-light leading-relaxed">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-indigo mb-4">OUR COMMITMENTS</h2>
      <p>
        At ANGILU, we believe style is a responsibility — not just a product.
      </p>
      <p>
        We are dedicated to bringing you the latest expressions of fashion, thoughtfully curated to reflect evolving trends while staying true to timeless confidence.
      </p>
      <p className="font-semibold text-indigo">Quality is never an option — it is our standard.</p>
      <p>
        Every piece is crafted with precision, ensuring exceptional value without compromise.
      </p>
      <p>We respect your time as much as your trust.</p>
      <p>
        Our commitment to timely delivery is as important as the design itself.
      </p>
      <p>Your voice matters.</p>
      <p>
        Every suggestion, every review, and every piece of feedback is welcomed and carefully considered because growth begins with listening.
      </p>
      <p>
        Above all, your satisfaction stands at the heart of everything we do — not as a goal, but as a principle.
      </p>
      <p className="font-semibold text-indigo">This is more than a brand.</p>
      <p>
        It is a journey built on trust, style, and shared ambition.
      </p>
      <p>Join us.</p>
      <p>Grow with us.</p>
      <p className="font-bold text-terracotta tracking-wide">
        Shape what comes next with ANGILU.
      </p>
    </div>

    {/* ── CTA ──────────────────────────────────────────────── */}
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <h2 className="text-3xl font-serif text-indigo">Ready to own the future?</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/collections"
          className="btn-slide bg-indigo text-kora px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold rounded-none"
        >
          <span style={{ position: 'relative', zIndex: 2 }}>Shop the Collection</span>
        </Link>
        <Link
          to="/contact"
          className="btn-slide-outline border border-indigo text-indigo px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all rounded-none relative overflow-hidden"
        >
          <span style={{ position: 'relative', zIndex: 2 }}>Get in Touch</span>
        </Link>
      </div>
    </div>
  </div>
);

export default AboutPage;




