import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { scrollToTop, useScrollToTop } from './src/utils/scrollUtils';
import { Product, Page } from './types';
import { isAdminEmail } from './src/utils/adminUtils';
import { Navbar as Header } from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import DownloadsPage from './pages/DownloadsPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WishlistSidebar from './components/WishlistSidebar';
import WishlistPage from './pages/WishlistPage';
import ReturnsPolicyPage from './pages/ReturnsPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import PaymentPolicyPage from './pages/PaymentPolicyPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import SizeGuidePage from './pages/SizeGuidePage';
import FaqsPage from './pages/FaqsPage';

import LoginModal from './components/LoginModal';
import LogoutSuccessModal from './components/LogoutSuccessModal';
import LoginPage from './pages/LoginPage';
import { AdminProvider, useAdmin } from './src/contexts/AdminContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProductProvider } from './src/contexts/ProductContext';
import { CategoryProvider } from './src/contexts/CategoryContext';
import { CartProvider } from './src/contexts/CartContext';
import { StoreProvider, useStore } from './src/contexts/StoreContext';
import { useCart } from './src/hooks/useCart';
import { useRealtimeWishlist } from './src/hooks/useRealtimeCart';
import { useWishlist } from './src/hooks/useWishlist';
import { initializeFirebaseData } from './src/firebase/initData';
import { saveUserCart, saveUserWishlist } from './src/firebase/services/cartService';
import { getProductById } from './src/firebase/services/productService';
// Error Monitoring & Logging imports
import ErrorBoundary from './src/components/ErrorBoundary';
import { initErrorMonitoring, setUserContext } from './src/utils/errorHandler';

import { ThemeProvider, ThemeContext } from './src/contexts/ThemeContext';
import { useContext } from 'react';
import ScrollToTopButton from './components/ScrollToTopButton';
import CartSidebar from './components/CartSidebar';
import WhatsAppWidget from './components/WhatsAppWidget';

const AppContent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use unified store for cart and wishlist state
  const { 
    cartItems, 
    wishlistItems, 
    loading: storeLoading, 
    getCartTotal, 
    getCartItemCount, 
    getWishlistItemCount, 
    toggleWishlist: toggleWishlistHook,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen
  } = useStore();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Automatically scroll to top on route change
  useScrollToTop();

  // Initialize error monitoring on app startup
  useEffect(() => {
    try {
      initErrorMonitoring();
      console.log('Error monitoring initialized successfully');
    } catch (error) {
      console.error('Failed to initialize error monitoring:', error);
      // App continues to work even if error monitoring fails
    }
  }, []);

  // Set user context when authentication state changes
  useEffect(() => {
    try {
      if (user) {
        // Set user context when user is logged in
        setUserContext({
          id: user.uid || user.id,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          role: isAdminEmail(user.email) ? 'admin' : 'user'
        });
      } else {
        // Clear user context when user logs out
        setUserContext(null);
      }
    } catch (error) {
      console.error('Failed to set user context:', error);
      // App continues to work even if user context setting fails
    }
  }, [user]);


  // Initialize Firebase data on app start
  useEffect(() => {
    const initializeData = async () => {
      try {
        const { checkDataInitialized } = await import('./src/firebase/initData');
        const isInitialized = await checkDataInitialized();
        
        if (!isInitialized) {
          console.log('Firebase data not initialized, initializing now...');
          await initializeFirebaseData();
        } else {
          console.log('Firebase data already initialized');
        }
      } catch (error) {
        console.error('Failed to initialize Firebase data:', error);
      }
    };

    initializeData();
  }, []);

  // Cart and wishlist are now handled by real-time hooks
  // No need for localStorage effects or manual Firebase loading

  // Auto-redirect admin users to admin dashboard only on initial login or when accessing home
  useEffect(() => {
    const hasRedirected = sessionStorage.getItem('adminRedirected');
    if (user && isAdminEmail(user.email) && !hasRedirected) {
      // Only redirect if user is on home page or login page
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
        console.log('Admin user detected on home/login page, redirecting to admin dashboard');
        navigate('/admin');
        sessionStorage.setItem('adminRedirected', 'true');
      } else if (location.pathname !== '/admin') {
        // If admin is accessing other pages (not admin), set the flag but don't redirect
        sessionStorage.setItem('adminRedirected', 'true');
      }
    }
  }, [user, navigate, location.pathname]);

  // Prevent regular users from accessing admin dashboard
  useEffect(() => {
    if (location.pathname === '/admin' && user && !isAdminEmail(user.email)) {
      console.log('Regular user trying to access admin dashboard, redirecting to user dashboard');
      navigate('/dashboard');
    }
    
    // Clear admin redirect flag when user logs out
    if (!user) {
      sessionStorage.removeItem('adminRedirected');
    }
  }, [location.pathname, user, navigate]);


  const navigateTo = (page) => {
    if (page === 'logout') {
      handleLogout();
      return;
    }
    
    const routeMap = {
      'home': '/',
      'shop': '/shop',
      'about': '/about',
      'contact': '/contact',

      'product': '/product',
      'checkout': '/checkout',
      'dashboard': '/dashboard',
      'admin': '/admin',
      'orders': '/orders',
      'downloads': '/downloads',
      'addresses': '/addresses',
      'account-details': '/account-details',
     'wishlist': '/wishlist',
     'returns-policy': '/returns-policy',
     'terms-conditions': '/terms-conditions',
     'privacy-policy': '/privacy-policy',
     'shipping-policy': '/shipping-policy',
     'payment-policy': '/payment-policy',
     'login': '/login',
     'register': '/register',
     'size-guide': '/size-guide',
     'faqs': '/faqs'
    };
    
    const path = routeMap[page] || '/';
    navigate(path);
    scrollToTop();
  };
  
  const viewProduct = (product) => {
    // Navigate to specific product page using its ID
    if (product && product.id) {
      // Convert ID to string to ensure proper URL formatting
      const productId = String(product.id);
      navigate(`/product/${productId}`);
      // Scroll to top after navigation
      scrollToTop();
    } else {
      // Fallback to old behavior if no ID is available
      setSelectedProduct(product);
      navigate('/product');
      // Scroll to top after navigation
      scrollToTop();
    }
  };

  const updateCart = (newCart) => {
    // Cart is now managed by the unified cart hook
    // This function is kept for compatibility but will be replaced by hook functions
    console.log('updateCart called - cart is now managed by the unified cart hook');
  };

  const toggleWishlist = async (product) => {
    // Use the wishlist hook for proper functionality
    try {
      await toggleWishlistHook(product);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const resetCartAndWishlist = () => {
    // Cart and wishlist are now managed by real-time hooks
    // This function is kept for compatibility but will be replaced by hook functions
    console.log('resetCartAndWishlist called - cart and wishlist are now managed by real-time hooks');
    // Clear localStorage for guest users
    localStorage.removeItem('guestCart');
    localStorage.removeItem('guestWishlist');
  };

  const handleLogout = async () => {
    try {
      const { signOutUser } = await import('./src/firebase/services/authService');
      await signOutUser();
      resetCartAndWishlist();
      setIsLogoutModalOpen(true);
      // Redirect to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderLoginPage = () => (
    <LoginPage navigateTo={navigateTo} />
  );

  // Wrapper component to handle dynamic product loading
  const ProductDetailPageWrapper = ({ toggleWishlist, wishlist, cart, updateCart }) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const productData = await getProductById(productId);
          
          if (productData) {
            setProduct(productData);
          } else {
            // Fallback to local products if not found in Firebase
            setError('Product not found');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Failed to load product');
        } finally {
          setLoading(false);
        }
      };

      if (productId) {
        fetchProduct();
      }
    }, [productId]);

    if (loading) {
      return (
        <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
          </div>
        </div>
      );
    }

    if (error || !product) {
      return (
        <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-6xl mb-4 text-indigo">Product Not Found</h1>
            <p className="text-indigo/60 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/80 transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
      );
    }

    return <ProductDetailPage product={product} toggleWishlist={toggleWishlist} wishlist={wishlist} />;
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-kora text-indigo'} min-h-screen flex flex-col`}>
      <Header
        navigateTo={navigateTo}
        openLoginModal={() => setIsLoginModalOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
        openCart={() => setIsCartOpen(true)}
        wishlistCount={getWishlistItemCount()}
        cartCount={getCartItemCount()}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-grow pt-[60px] md:pt-[70px]">
        <Routes>
          <Route path="/" element={<HomePage navigateTo={navigateTo} viewProduct={viewProduct} toggleWishlist={toggleWishlist} wishlist={wishlistItems} cart={cartItems} updateCart={updateCart} />} />
          <Route path="/shop" element={<ShopPage viewProduct={viewProduct} navigateTo={navigateTo} toggleWishlist={toggleWishlist} />} />
          <Route path="/collections" element={<Navigate to="/shop" replace />} />
          <Route path="/collections/:slug" element={<ShopPage viewProduct={viewProduct} navigateTo={navigateTo} toggleWishlist={toggleWishlist} />} />
          <Route path="/product/:productId" element={<ProductDetailPageWrapper />} />
          <Route path="/checkout" element={<CheckoutPage navigateTo={navigateTo} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />

          <Route path="/login" element={renderLoginPage()} />
          <Route path="/register" element={renderLoginPage()} />
          <Route path="/dashboard" element={<DashboardPage navigateTo={navigateTo} />} />
          <Route path="/admin" element={<AdminDashboardPage navigateTo={navigateTo} />} />
          <Route path="/orders" element={<OrdersPage navigateTo={navigateTo} />} />
          <Route path="/downloads" element={<DownloadsPage navigateTo={navigateTo} />} />
          <Route path="/addresses" element={<AddressesPage navigateTo={navigateTo} />} />
         <Route path="/account-details" element={<AccountDetailsPage navigateTo={navigateTo} />} />
         <Route path="/wishlist" element={<WishlistPage navigateTo={navigateTo} toggleWishlist={toggleWishlist} wishlist={wishlistItems} viewProduct={viewProduct} />} />
         <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
         <Route path="/terms-conditions" element={<TermsConditionsPage />} />
         <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
         <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/payment-policy" element={<PaymentPolicyPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/faqs" element={<FaqsPage />} />
       </Routes>
      </main>
      <Footer />
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        toggleWishlist={toggleWishlist}
        viewProduct={(p) => {
          viewProduct(p);
          setIsWishlistOpen(false);
        }}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        navigateTo={navigateTo}
      />
      <LogoutSuccessModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      <WhatsAppWidget />
      <ScrollToTopButton />
      </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AuthProvider>
          <ProductProvider>
            <CategoryProvider>
              <StoreProvider>
                <CartProvider>
                  <ThemeProvider>
                    <AppContent />
                  </ThemeProvider>
                </CartProvider>
              </StoreProvider>
            </CategoryProvider>
          </ProductProvider>
        </AuthProvider>
      </AdminProvider>
    </ErrorBoundary>
  );
};

export default App;