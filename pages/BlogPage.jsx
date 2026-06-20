import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

// ─── Static Blog Data ─────────────────────────────────────────────────────────
export const BLOG_POSTS = [
  {
    id: 'rise-of-forward-fashion',
    title: 'The Rise of Forward Fashion: Why Modern Streetwear Is Changing',
    excerpt: 'Streetwear has evolved far beyond trends. Discover why modern streetwear is shifting toward identity, quality, and forward fashion with ANGILU.',
    category: 'Brand Story',
    date: 'May 20, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200',
    featured: true,
    content: `
Streetwear has evolved far beyond trends.

What once started as underground fashion culture has now become one of the strongest influences in modern style. But as streetwear became mainstream, much of it also became repetitive. The same graphics. The same designs. The same trend cycles repeated again and again.

People today want more than hype-driven clothing. They want fashion that feels personal.

This shift is where forward fashion begins.

At ANGILU, forward fashion means creating clothing built around individuality, visual identity, and long-term relevance instead of temporary trends. It is fashion designed to feel expressive without becoming disposable.

## What Is Forward Fashion?

Forward fashion is not about wearing louder clothes. It is about wearing pieces that carry identity.

Instead of following existing aesthetics, forward fashion focuses on:
- Original visual direction 
- Artistic graphic concepts 
- Timeless streetwear silhouettes 
- Long-term wearability 
- Personal expression 

Fashion today is no longer just about appearance. It has become part of how people express themselves. That is why graphic streetwear continues to grow globally.

## Why Graphic T-Shirts Have Become Essential in Streetwear

Graphic t-shirts have become one of the strongest forms of self-expression in modern fashion. Unlike plain basics, graphic clothing creates visual identity instantly. A strong design can communicate mood, creativity, and personality without saying anything.

At ANGILU, our collections are inspired by:
- Psychedelic visuals 
- 3D graphic design 
- Geometrical illusions 
- Mandala-inspired artwork 
- Futuristic digital aesthetics 

These concepts transform everyday clothing into wearable visual art.

## The Shift Away from Fast Fashion

Fast fashion created a culture of temporary clothing. Low-quality fabrics, copied designs, and rapidly changing trends made fashion disposable. But modern consumers are becoming more conscious about:
- Quality 
- Originality 
- Durability 
- Better fit 
- Long-lasting prints 

People now prefer clothing that feels meaningful rather than temporary.

Forward fashion responds to this shift by focusing on identity and quality instead of mass production. That is why many modern streetwear brands are moving toward curated collections instead of endless seasonal drops.

## Why Streetwear Works So Well in India

Streetwear fits naturally into modern Indian lifestyles. It works across:
- College culture 
- Creative industries 
- Content creation 
- Music culture 
- Travel 
- Urban fashion 
- Social media aesthetics 

People want clothing that feels comfortable enough for daily wear while still carrying visual impact.

Graphic t-shirts have become especially popular because they work across multiple styling directions:
- Minimal outfits 
- Layered looks 
- Casual streetwear 
- Travel styling 
- Sneaker culture 

The flexibility of streetwear makes it wearable without feeling forced.

## Final Thoughts

Streetwear is no longer just a trend category. It has become one of the strongest forms of modern self-expression.

And the future of streetwear belongs to brands that create identity instead of imitation.

That future is forward fashion. And that is exactly what ANGILU is built for.
    `
  },
  {
    id: 'why-original-graphics-matter',
    title: 'Why Original Graphics and Premium Streetwear Matter More Than Ever',
    excerpt: 'Discover why the market is shifting away from generic logo clothing toward clean visual composition, premium fabrics, and artistic design language.',
    category: 'Design',
    date: 'May 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200',
    featured: false,
    content: `
Modern streetwear is changing.

People are moving away from generic logo clothing and mass-produced fashion. Instead, they are looking for clothing that feels visually original, premium, and wearable in everyday life.

This is why original graphics and premium streetwear have become more important than ever.

At ANGILU, every collection is built around strong visual concepts instead of random trend-based designs. The goal is to create clothing that continues to feel relevant long after trends fade away.

## The Importance of Original Graphics

Most graphic clothing today looks repetitive because many brands follow the same trends. Originality creates stronger identity.

Strong graphic direction helps create:
- Better visual impact 
- Stronger emotional connection 
- More styling versatility 
- More memorable fashion 

That is the difference between trend clothing and forward fashion.

ANGILU collections focus on artistic visual concepts such as:
- Futuristic graphics 
- Psychedelic visuals 
- Geometric structures 
- Experimental compositions 
- Modern digital aesthetics 

These designs are created to feel expressive without becoming overcomplicated.

## Streetwear Is Becoming More Refined

Modern streetwear is no longer only about loud branding or exaggerated silhouettes. The market is shifting toward:
- Cleaner visual composition 
- Premium fabrics 
- Better proportions 
- Artistic design language 
- Elevated minimalism 

People now want clothing that balances comfort with visual sophistication. Fashion is becoming less about attention and more about presence.

## Why Premium Streetwear Is Growing

Consumers today are becoming more selective about what they buy. Instead of purchasing large amounts of low-quality clothing, many people now prefer:
- Better fabrics 
- Durable prints 
- Comfortable fits 
- Limited collections 
- Original design language 

Premium streetwear answers this demand by combining quality with individuality.

At ANGILU, every piece is designed to balance:
- Comfort 
- Everyday wearability 
- Visual identity 
- Long-term relevance 

Because clothing should not feel borrowed. It should feel like your own.

## Why ANGILU Focuses on Forward Fashion

ANGILU was created for people who want fashion that feels expressive without becoming trend-dependent.

Our philosophy is simple:
- Create wearable statement pieces 
- Prioritise originality 
- Focus on lasting visual appeal 
- Balance comfort with strong design identity 

This is not fast fashion. This is forward fashion.

## Final Thoughts

The future of fashion is moving toward individuality, quality, and stronger visual identity.

People no longer want clothing that simply follows trends. They want clothing that reflects who they are.

That is why forward fashion and premium streetwear continue to grow — and why ANGILU is built around exactly that vision.
    `
  },
  {
    id: 'what-is-forward-fashion',
    title: 'What Is Forward Fashion? ANGILU\'s Design Philosophy Explained',
    excerpt: 'We\'re not chasing trends — we\'re setting a new direction. Discover why ANGILU designs every piece to stand out in an era of visual noise, and what "forward fashion" truly means.',
    category: 'Brand Story',
    date: 'April 15, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a991?q=80&w=1200',
    featured: false,
    content: `
## The World Is Overstimulated — We Design for It

We live in a world of millions of frames per day. Your outfit is a frame too. At ANGILU, we believe clothing should create stronger visual identity — not blend into the background.

Forward Fashion is our answer to fast fashion's monotony. Where fast fashion rushes to copy what's already popular, forward fashion creates what hasn't been seen yet.

## Design With Depth

Every ANGILU piece is built around three principles:
- **Colour Precision** — hues crafted for camera-readiness and real-life vibrancy
- **Realistic Depth** — 3D graphic techniques that give flat fabric a sculptural feel
- **Personal Identity** — designs that make the wearer stand out rather than fit in

## The Camera Doesn't Lie

In the age of Instagram and personal branding, how you appear on screen matters as much as how you look in a mirror. We design every tee with RGB colour theory in mind — colours that pop in photographs, not wash out.

This is forward fashion. And this is just the beginning.
    `
  },
  {
    id: 'how-to-style-3d-graphic-tees',
    title: 'How to Style 3D Graphic Tees: 5 Looks for Every Occasion',
    excerpt: 'From streetwear to smart-casual, ANGILU\'s dimensional designs carry across every context. Here are five proven ways to build outfits around your graphic tee.',
    category: 'Style Guide',
    date: 'April 8, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    featured: false,
    content: `
## The Tee as a Statement Piece

When your tee has depth and dimension, it doesn't need much supporting it. Here are five outfit formulas:

**1. The Minimalist Stack**
Pair with slim-fit black joggers and white sneakers. Let the graphic speak.

**2. The Smart-Casual Flip**
Layer under a structured blazer. Tuck slightly into dark trousers.

**3. The Athleisure Edge**
Match with track pants and chunky sneakers to keep the energy sporty.

**4. The Street Layer**
Open a flannel shirt over it, leave it unbuttoned, pair with cargo pants.

**5. The Evening Transition**
Dark jeans, leather sneakers, and a minimal watch — your ANGILU tee travels into evening effortlessly.

The key rule: keep the rest understated. Your tee is already doing the work.
    `
  },
  {
    id: 'colour-theory-in-fashion',
    title: 'Colour Theory in Fashion: Why Your Tee Needs to Work On Camera',
    excerpt: 'The colours that look great in a store mirror and the colours that photograph well are sometimes completely different. We design for both — here\'s how.',
    category: 'Design',
    date: 'March 28, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200',
    featured: false,
    content: `
## The Instagram Problem

Have you ever bought a piece that looked incredible in the store, only to see it look flat or washed out in photos? That's not a lighting problem — it's a design problem.

At ANGILU, we run every colour decision through both physical and digital lens testing to ensure our pieces look exceptional in both contexts.

## Saturation vs. Vibrancy

There's a difference between a colour that's saturated and one that's vibrant. Saturation is intensity. Vibrancy is how the colour interacts with light at different angles.

## Our Colour System

Every ANGILU palette is built around three axes:
1. **Photographic performance** — how it reads on smartphone cameras
2. **Natural light response** — how it looks outdoors vs. indoors
3. **Emotional resonance** — what feeling the shade triggers at a glance

These aren't accidents. They're the result of hundreds of sample iterations.
    `
  },
  {
    id: 'fabric-guide-angilu',
    title: 'ANGILU Fabric Guide: What Makes Our Tees Feel Premium',
    excerpt: 'Premium isn\'t just a label — it\'s a decision made at every stage of production. From yarn count to finish treatment, here\'s what goes into an ANGILU tee.',
    category: 'Fabric & Care',
    date: 'March 15, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200',
    featured: false,
    content: `
## Beyond Thread Count

Most brands talk about "100% cotton" and stop there. We go further. The finish of a fabric — how it's pre-washed, how it's dried, how it holds colour across washes — is what separates a premium tee from an average one.

## What We Use

- **200 GSM Combed Cotton** — soft, breathable, holds print definition
- **Bio-washed finish** — pre-shrunk, keeps its shape wash after wash
- **Reactive dye printing** — bonds to the fibre rather than sitting on top

## Care Tips to Keep It Premium

1. Wash cold, inside out
2. Avoid tumble drying — air dry flat
3. Iron inside out on low heat only
4. Do not bleach

Simple rules. Big difference in longevity.
    `
  },
  {
    id: 'why-we-dont-chase-trends',
    title: 'Why ANGILU Doesn\'t Chase Trends — And Why That\'s Our Biggest Strength',
    excerpt: 'Fast fashion moves in seasons. We move in ideas. Here\'s why slow, intentional design is ANGILU\'s competitive advantage in an over-saturated market.',
    category: 'Brand Story',
    date: 'March 1, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200',
    featured: false,
    content: `
## The Trend Trap

Brands that chase trends are always behind them. By the time a trend reaches mass production, the early adopters have already moved on.

We solve this by designing timeless graphic language — shapes, depth effects, and colour systems that don't expire with the season.

## Originality As a Strategy

Our designers don't browse Pinterest for inspiration. They explore architecture, wildlife photography, digital art, and cinematic visuals. The result is a vocabulary that doesn't look like anything else in the market.

## The Long View

When you buy an ANGILU tee today, it should still feel current two years from now. That's our design commitment: not reactive fashion, but forward fashion.
    `
  },
  {
    id: 'angilu-sizing-guide',
    title: 'The Complete ANGILU Sizing Guide: Find Your Perfect Fit',
    excerpt: 'A great graphic tee needs the right fit to shine. Our sizing guide covers everything from measurement tips to how our cuts differ across collections.',
    category: 'Style Guide',
    date: 'February 20, 2025',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200',
    featured: false,
    content: `
## Getting the Fit Right

Every graphic tee fits differently depending on the cut. Here's how to measure for the best ANGILU fit:

**Chest** — Measure around the fullest part, keep tape level.

**Length** — Measure from the highest point of the shoulder to where you want the hem to sit.

**Shoulder** — Measure the distance between the two shoulder seams.

## Our Fit Guide

| Size | Chest (in) | Length (in) | Shoulder (in) |
|------|-----------|-------------|---------------|
| XS   | 34–36     | 26          | 15.5          |
| S    | 36–38     | 27          | 16.5          |
| M    | 38–40     | 28          | 17.5          |
| L    | 40–42     | 29          | 18.5          |
| XL   | 42–44     | 30          | 19.5          |
| XXL  | 44–46     | 31          | 20.5          |

## Tips

- If you're between sizes, size up for a relaxed fit
- Our oversized collection runs 1–2 sizes larger by design
- Graphic tees are designed to hold their shape — don't size down expecting it to shrink
    `
  }
];

const CATEGORIES = ['All', 'Brand Story', 'Style Guide', 'Design', 'Fabric & Care'];

const CATEGORY_COLORS = {
  'Brand Story': { bg: 'bg-indigo', text: 'text-kora' },
  'Style Guide': { bg: 'bg-terracotta', text: 'text-kora' },
  'Design': { bg: 'bg-terracotta-light', text: 'text-kora' },
  'Fabric & Care': { bg: 'bg-gray-600', text: 'text-kora' },
};

// ─── Blog Card Component ───────────────────────────────────────────────────────
const BlogCard = ({ post, featured = false }) => {
  const catStyle = CATEGORY_COLORS[post.category] || { bg: 'bg-indigo', text: 'text-kora' };

  if (featured) {
    return (
      <article className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-kora border border-gold/20 overflow-hidden mb-12">
        {/* Image */}
        <div className="relative overflow-hidden h-[320px] lg:h-auto">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-indigo/10 group-hover:bg-indigo/20 transition-colors duration-500" />
          <span
            className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${catStyle.bg} ${catStyle.text}`}
          >
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-8 lg:p-12 bg-cream-light">
          <span className="text-[9px] uppercase tracking-[0.3em] text-indigo/50 font-bold mb-3">
            Featured Post
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl text-indigo font-bold leading-tight mb-4 group-hover:opacity-80 transition-opacity">
            {post.title}
          </h2>
          <p className="text-gray-600/70 text-sm leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-[10px] text-indigo/40 uppercase tracking-widest mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {post.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo/20" />
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {post.readTime}
            </span>
          </div>
          <Link
            to={`/blog/${post.id}`}
            className="btn-slide inline-flex items-center gap-3 px-6 py-3 bg-indigo text-kora text-[10px] font-bold uppercase tracking-[0.2em] self-start"
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Read Article</span>
            <ArrowRight size={14} style={{ position: 'relative', zIndex: 2 }} />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-kora border border-gold/20 overflow-hidden hover:border-indigo/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-indigo/5 group-hover:bg-indigo/15 transition-colors duration-500" />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ${catStyle.bg} ${catStyle.text}`}
        >
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-lg text-indigo font-bold leading-tight mb-3 group-hover:opacity-70 transition-opacity">
          {post.title}
        </h3>
        <p className="text-gray-600/60 text-xs leading-relaxed mb-4 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[9px] text-indigo/40 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {post.readTime}
            </span>
          </div>
          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo border-b border-indigo/30 pb-0.5 hover:border-indigo transition-colors"
          >
            Read More
            <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

// ─── Main Blog Page ────────────────────────────────────────────────────────────
const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = BLOG_POSTS.find(p => p.featured);
  const filteredPosts = useMemo(() => {
    const rest = BLOG_POSTS.filter(p => !p.featured);
    if (activeCategory === 'All') return rest;
    return rest.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-kora text-indigo">

      {/* ── Hero Banner ─── */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-indigo">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/linen-unbleached.png')" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-4">
            ANGILU Editorial
          </span>
          <h1
            className="font-serif font-bold leading-tight mb-6 text-kora"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
          >
            The ANGILU Journal
          </h1>
          <p className="text-kora/60 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Insights on forward fashion, 3D design, personal style, and the thinking behind every ANGILU piece.
          </p>
        </div>
      </section>

      {/* ── Category Filter ─── */}
      <section className="sticky top-[80px] md:top-[90px] z-[55] border-b border-gold/30 bg-kora/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex items-center gap-0 py-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] border-b-[2.5px] transition-all duration-200 ${
                  activeCategory === cat
                    ? 'border-indigo text-indigo'
                    : 'border-transparent text-indigo/40 hover:text-indigo/70 hover:border-indigo/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ─── */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">

        {/* Featured post */}
        {featured && activeCategory === 'All' && (
          <BlogCard post={featured} featured />
        )}

        {/* Grid */}
        {filteredPosts.length > 0 ? (
          <>
            {activeCategory === 'All' && (
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-indigo/40 font-bold">Latest Articles</span>
                <div className="flex-1 h-px bg-gold/30" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif italic text-2xl text-indigo/30">
              No articles in this category yet...
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <section className="mt-20 md:mt-28 p-10 md:p-16 text-center border border-gold/30 bg-indigo">
          <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold block mb-3">Stay in the Loop</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-kora mb-3">
            Forward Fashion, Delivered
          </h2>
          <p className="text-kora/50 text-sm mb-8 max-w-md mx-auto">
            Get the latest ANGILU stories, style guides, and new arrivals directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 bg-kora/10 border border-kora/20 text-kora placeholder-kora/30 text-sm outline-none focus:border-kora transition-colors"
            />
            <button className="btn-slide px-6 py-3 bg-kora text-indigo border border-kora text-[10px] font-bold uppercase tracking-[0.2em]">
              <span style={{ position: 'relative', zIndex: 2 }}>Subscribe</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;


