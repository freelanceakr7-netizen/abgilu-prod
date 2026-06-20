import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Heart, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useCart } from '../src/hooks/useCart';
import { useWishlist } from '../src/hooks/useWishlist';
import { signOutUser } from '../src/firebase/services/authService';
import { isAdminEmail } from '../src/utils/adminUtils';
import { useCategoryContext } from '../src/contexts/CategoryContext';
import { categoryNameToSlug, SPECIAL_CATEGORIES } from '../src/utils/slugUtils.js';

// Custom Staggered Menu Icon
const StaggeredMenu = ({ className = "" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="4" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" y1="17" x2="14" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Logo Component
const Logo = ({ className = "" }) => {
  return (
    <div className={`relative w-24 h-8 sm:w-32 sm:h-10 md:w-40 md:h-12 overflow-hidden select-none cursor-pointer ${className}`}>
      <img 
        src="/header-logo.jpg" 
        alt="ANGILU Logo" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] max-w-none" 
      />
    </div>
  );
};

// Navbar Component
export const Navbar = ({ openCart, openWishlist, ...props }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  
  const { user, userData } = useAuth();
  const { getCartItemCount } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const { categoriesWithSubcategories } = useCategoryContext();
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  
  const cartCount = getCartItemCount();
  const wishlistCount = getWishlistItemCount();

  // Main categories for dropdown
  const mainCategories = categoriesWithSubcategories.filter(c => !c.parentId);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search/dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUserDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Desktop left nav — only 2 items as per design
  const desktopNavItems = [
    { label: 'Collections', path: '/collections' },
    { label: 'Contact', path: '/contact' },
  ];

  // Mobile menu — shows all pages
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Size Guide', path: '/size-guide' },
    { label: 'Our Story', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isAdmin = userData?.isAdmin || isAdminEmail(user?.email);

  return (
    <>
      {/* Desktop Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 sm:px-[40px] h-[60px] md:h-[70px] flex items-center ${
        isScrolled
          ? 'bg-kora border-b border-indigo/5 shadow-sm'
          : 'bg-kora'
      }`}>
        <div className="w-full mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex-1 lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-1 -ml-1 text-indigo">
              <StaggeredMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Left Navigation – desktop only */}
          <nav className="hidden lg:flex flex-1 justify-start gap-10 items-center">
            {desktopNavItems.map(item => (
              <Link key={item.path} to={item.path} className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-colors relative group text-indigo hover:text-terracotta whitespace-nowrap flex items-center gap-1">
                {item.label.toUpperCase()}
                <span className="absolute -bottom-1 left-0 h-[1px] bg-terracotta transition-all duration-300 w-0 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Logo - Desktop (Center) */}
          <div className="flex-1 hidden lg:flex justify-center items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Logo - Mobile (centered absolutely) */}
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <Link to="/" className="pointer-events-auto">
                <Logo />
              </Link>
            </div>
             
            {/* Search Icon - hidden on mobile, shown from sm */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex text-indigo hover:text-terracotta transition-colors items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
              <span className="hidden xl:block whitespace-nowrap">SEARCH</span>
            </button>

            {/* Wishlist Icon - hidden on mobile, shown from sm */}
            <button 
              onClick={(e) => {
                if (openWishlist) {
                  e.preventDefault();
                  openWishlist();
                } else {
                  navigate('/wishlist');
                }
              }}
              className="hidden sm:flex text-indigo hover:text-terracotta transition-colors relative items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
            >
              <div className="relative">
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-kora text-[8px] w-4 h-4 rounded-none flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block whitespace-nowrap">WISHLIST</span>
            </button>
            
            {/* Shopping Bag Icon with Text */}
            <button 
              onClick={(e) => {
                if (openCart) {
                  e.preventDefault();
                  openCart();
                } else {
                  navigate('/checkout');
                }
              }}
              className="text-indigo hover:text-terracotta transition-colors relative flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-kora text-[8px] w-4 h-4 rounded-none flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block whitespace-nowrap">CART</span>
            </button>
            
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="text-indigo hover:text-terracotta transition-colors flex items-center gap-1 p-1"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                <ChevronDown className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-kora rounded-none shadow-xl border border-indigo/10 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-indigo/20">
                        <p className="text-sm font-bold text-indigo">
                          {userData?.displayName ? (userData.displayName.charAt(0).toUpperCase() + userData.displayName.slice(1)) : 'Member'}
                        </p>
                        <p className="text-[10px] text-indigo/60 mt-0.5 truncate uppercase tracking-wider">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-indigo hover:bg-kora-dark hover:text-terracotta transition-colors"
                      >
                        My Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-indigo hover:bg-kora-dark hover:text-terracotta transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-terracotta hover:bg-kora-dark transition-colors font-semibold"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-indigo hover:bg-kora-dark"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-indigo hover:bg-kora-dark"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <div className={`fixed inset-0 z-[150] transition-all duration-500 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-indigo/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
        <div className={`absolute top-0 left-0 right-0 bg-kora p-8 md:p-12 shadow-2xl transition-transform duration-500 ease-out ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo/40">Search Angilu</span>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-indigo/5 rounded-none transition-colors"
              >
                <X className="w-6 h-6 text-indigo" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative group">
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="WHAT ARE YOU LOOKING FOR?"
                className="w-full bg-transparent border-b-2 border-indigo/10 py-6 md:py-8 text-2xl md:text-5xl font-serif text-indigo placeholder:text-indigo/10 focus:outline-none focus:border-indigo transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-indigo hover:text-terracotta transition-colors"
              >
                <ArrowRight className="w-8 h-8 md:w-12 md:h-12" />
              </button>
            </form>
            <div className="mt-12 md:mt-16">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo/40 mb-6">Popular Searches</p>
              <div className="flex flex-wrap gap-3">
                {['Core Collection', 'Black Edit', 'Accessories', 'New Arrivals'].map(term => (
                  <button 
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-6 py-3 rounded-none border border-indigo/10 text-xs font-bold text-indigo hover:border-indigo hover:bg-indigo hover:text-kora transition-all"
                  >
                    {term.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[150] bg-indigo text-kora p-6 sm:p-10 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 hover:bg-white/10 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Search Bar Refined */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH OUR COLLECTIONS..."
                className="w-full bg-transparent border-b border-white/20 py-4 text-sm font-sans uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 opacity-50 hover:opacity-100 transition-opacity">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Main Navigation */}
          <nav className="flex flex-col gap-6 mb-12 overflow-y-auto max-h-[50vh] pr-2">
            {navItems.map((item, index) => {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center justify-between"
                >
                  <span className="text-3xl sm:text-4xl font-serif italic tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {item.label}
                  </span>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              );
            })}
          </nav>
          
          {/* Actions & Account */}
          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (openWishlist) openWishlist();
                  else navigate('/wishlist');
                }}
                className="flex items-center gap-3 py-3 border-b border-white/10"
              >
                <Heart className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Wishlist ({wishlistCount})</span>
              </button>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (openCart) openCart();
                  else navigate('/checkout');
                }}
                className="flex items-center gap-3 py-3 border-b border-white/10"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Cart ({cartCount})</span>
              </button>
            </div>

            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Signed in as</p>
                    <p className="text-xs font-bold truncate max-w-[200px]">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-400"
                  >
                    Logout
                  </button>
                </div>
                <div className="flex gap-6 mt-2">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20 pb-1">Account</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20 pb-1">Admin</Link>}
                </div>
              </div>
            ) : (
              <div className="flex gap-8">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1">Create Account</Link>
              </div>
            )}


          </div>
        </div>
      )}
    </>
  );
};


export default Navbar;


