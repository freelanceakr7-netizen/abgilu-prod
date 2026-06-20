import React from 'react';
import { Link } from 'react-router-dom';

// Social icon SVGs – larger and vibrant
const icons = {
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  x: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  pinterest: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
};

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/angilu_official?igsh=MXdxaXdzaHZrZ3pldA%3D%3D&utm_source=qr',
    icon: icons.instagram,
    color: '#E1306C',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61589671002449', // Updated link
    icon: icons.facebook,
    color: '#1877F2',
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/angilu_official',
    icon: icons.x,
    color: '#FFFFFF',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@angilu_official?si=M4ShV6LwWfowCL9D',
    icon: icons.youtube,
    color: '#FF0000',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/angilu/', // Updated link
    icon: icons.linkedin,
    color: '#0A66C2',
  },
  {
    name: 'Pinterest',
    href: 'https://in.pinterest.com/angilu_official/_profile/',
    icon: icons.pinterest,
    color: '#E60023',
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#4c0e0e] text-kora pt-6 md:pt-12 pb-4 md:pb-6 px-4 sm:px-8 md:px-[40px] border-t border-gold/10 font-sans tracking-wide">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-16 mb-6 md:mb-12 text-left">

          {/* Brand Column — spans 2 cols on mobile */}
          <div className="flex flex-col gap-3 col-span-2 md:col-span-1 lg:col-span-1">
            <div className="relative w-64 h-28 md:w-[300px] md:h-32 overflow-hidden -ml-2 mb-2">
              <img 
                src="/footer-logo.jpg" 
                alt="ANGILU Logo" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-none" 
              />
            </div>
            <p className="text-xs md:text-sm text-kora/80 leading-relaxed max-w-[320px] hidden sm:block">
              The future of apparel, shaped by ANGILU through India's first 3D graphic-designed T-shirts. A new visual language for modern-day fashion.
            </p>
            {/* Social Icons */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-kora/80 font-semibold mb-2">
                Follow &nbsp;•&nbsp; @angilu_official
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-none flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: social.color,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = social.color;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = social.color;
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Studio Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-kora/80 font-semibold mb-1">
              Studio
            </h4>
            <div className="space-y-1.5 md:space-y-3 text-xs md:text-[15px] font-light text-kora/70 leading-relaxed">
              <p className="font-semibold text-kora/90">Sri Bhavani Enterprises</p>
              <p>Shamshabad, Hyderabad.</p>
              <p>– 501218, India</p>
              <a href="tel:+919966486864" className="block hover:text-gold transition-colors">
                +91 99664 86864
              </a>
              <a href="mailto:Support@angilu.com" className="block hover:text-gold transition-colors">
                Support@angilu.com
              </a>
              <p className="text-kora/70 text-[11px] pt-1">Timing: 10:00 AM – 10:00 PM</p>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-kora/80 font-semibold mb-1">
              Navigate
            </h4>
            <ul className="space-y-2 md:space-y-4 text-xs md:text-[15px] font-light text-kora/80">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
              <li><Link to="/size-guide" className="hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link to="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-kora/80 font-semibold mb-1">
              Order &amp; Support
            </h4>
            <ul className="space-y-2 md:space-y-4 text-xs md:text-[15px] font-light text-kora/80">
              <li><Link to="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns-policy" className="hover:text-gold transition-colors">Returns Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/payment-policy" className="hover:text-gold transition-colors">Payment Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-gold transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/faqs" className="hover:text-gold transition-colors">FAQs</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="pt-4 md:pt-8 border-t border-kora/5 text-center">
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-kora/30 font-light">
            &copy; 2026 ANGILU. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


