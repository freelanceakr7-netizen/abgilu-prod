import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ChevronRight, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { BLOG_POSTS } from './BlogPage';
import ReactMarkdown from 'react-markdown';

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // Find the post by ID
    const currentPost = BLOG_POSTS.find(p => p.id === postId);
    
    if (currentPost) {
      setPost(currentPost);
      
      // Find related posts (same category, excluding current)
      const related = BLOG_POSTS.filter(
        p => p.category === currentPost.category && p.id !== currentPost.id
      ).slice(0, 3);
      
      // If we don't have enough related by category, just add some others
      if (related.length < 3) {
        const others = BLOG_POSTS.filter(
          p => p.id !== currentPost.id && !related.find(r => r.id === p.id)
        ).slice(0, 3 - related.length);
        
        setRelatedPosts([...related, ...others]);
      } else {
        setRelatedPosts(related);
      }
    } else {
      // If post not found, redirect to blog home
      navigate('/blog');
    }
  }, [postId, navigate]);

  if (!post) return null; // Will redirect

  return (
    <div className="bg-kora text-indigo min-h-screen pt-6 pb-16">
      
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="max-w-4xl mx-auto px-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em]">
          <Link to="/blog" className="text-indigo/50 hover:text-indigo transition-colors">
            Journal
          </Link>
          <ChevronRight size={12} className="text-indigo/30" />
          <span className="text-gold">{post.category}</span>
        </div>
        
        <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-bold text-indigo/60 hover:text-indigo transition-colors">
          <ArrowLeft size={12} />
          Back to all articles
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        {/* ── Header ── */}
        <header className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-indigo font-bold leading-tight mb-6 mt-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-indigo/50 uppercase tracking-widest mb-10">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {post.date}
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-indigo/20" />
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* ── Featured Image ── */}
        <div className="w-full aspect-video md:aspect-[21/9] mb-12 overflow-hidden border border-gold/30 bg-indigo/5">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── Article Content & Sidebar ── */}
        <div className="w-full mx-auto md:w-[80%] lg:w-[70%]">
          {/* Excerpt */}
          <p className="text-xl md:text-2xl text-indigo/80 font-serif italic leading-relaxed mb-10 border-l-2 border-gold pl-6 py-2">
            "{post.excerpt}"
          </p>

          {/* Social Share (inline) */}
          <div className="flex items-center justify-between border-y border-gold/30 py-4 mb-10">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-indigo/60">Share</span>
            </div>
            <div className="flex gap-4">
              <button className="text-indigo/50 hover:text-gold transition-colors"><Facebook size={16} /></button>
              <button className="text-indigo/50 hover:text-gold transition-colors"><Twitter size={16} /></button>
              <button className="text-indigo/50 hover:text-gold transition-colors"><Linkedin size={16} /></button>
              <button className="text-indigo/50 hover:text-gold transition-colors"><Share2 size={16} /></button>
            </div>
          </div>

          {/* Main Markdown Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-indigo prose-headings:font-bold prose-p:text-indigo/80 prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-indigo">
            <ReactMarkdown>
              {post.content}
            </ReactMarkdown>
          </div>
          
          {/* Tags/Categories */}
          <div className="mt-12 pt-8 border-t border-gold/30">
            <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-indigo/50 mr-4">
              Filed under:
            </span>
            <span className="inline-block px-3 py-1 bg-indigo/5 border border-indigo/10 text-[9px] uppercase font-bold tracking-[0.15em] text-indigo">
              {post.category}
            </span>
          </div>
        </div>
      </article>

      {/* ── Related Articles ── */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-24 mb-10 pt-16 border-t border-gold/30">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl font-bold text-indigo mb-2">Read Next</h3>
            <span className="inline-block w-12 h-0.5 bg-gold"></span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(related => (
              <Link 
                key={related.id} 
                to={`/blog/${related.id}`}
                className="group border border-gold/20 bg-cream/50 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={related.image} 
                    alt={related.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[9px] text-gold font-bold uppercase tracking-[0.2em] mb-2 block">
                    {related.category}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-indigo mb-2 group-hover:opacity-70 transition-opacity">
                    {related.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[9px] text-indigo/40 uppercase tracking-widest">
                    <Clock size={10} />
                    {related.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Newsletter Footer ── */}
      <section className="bg-indigo max-w-4xl mx-auto mt-16 p-10 md:p-14 text-center">
        <h4 className="font-serif text-2xl text-kora font-bold mb-3">
          Join the Movement
        </h4>
        <p className="text-kora/60 text-sm mb-6 max-w-sm mx-auto">
          Get the latest ANGILU stories, style guides, and new arrivals directly to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-2 bg-kora/10 border border-kora/20 text-kora placeholder-kora/30 text-sm outline-none focus:border-kora transition-colors"
          />
          <button className="btn-slide px-6 py-2 bg-kora text-indigo border border-kora text-[10px] font-bold uppercase tracking-[0.2em]">
            <span style={{ position: 'relative', zIndex: 2 }}>Subscribe</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default BlogPostPage;



