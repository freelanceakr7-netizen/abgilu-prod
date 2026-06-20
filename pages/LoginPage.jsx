import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import LoginModal from '../components/LoginModal';

const LoginPage = ({ navigateTo }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(true);

  const handleLoginSuccess = () => {
    // Navigate will be handled by the modal
  };

  return (
    <div className="bg-kora text-indigo pt-4 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-indigo/60 hover:text-terracotta transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <h1 className="font-serif text-4xl md:text-5xl text-indigo mb-12">Login</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Login Form */}
        <div className="lg:col-span-2">
          <div className="bg-kora border border-indigo/10 rounded-none p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-terracotta/10 rounded-none flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-terracotta" />
              </div>
              
              <h2 className="text-3xl font-serif text-indigo mb-3">
                Welcome Back
              </h2>
              
              <p className="text-indigo/60 text-lg leading-relaxed">
                Continue your journey with us
              </p>
            </div>

            <div className="text-center">
              <p className="text-indigo/60 mb-6">
                Click the button below to open the login form
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full bg-indigo text-kora py-3 rounded-none font-medium text-sm uppercase tracking-widest hover:bg-terracotta transition-colors"
              >
                Open Login Form
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="lg:col-span-1">
          <div className="bg-kora border border-indigo/10 rounded-none p-6 sticky top-[70px]">
            <h2 className="text-xl font-serif text-indigo mb-6">New to ANGILU?</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-none bg-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-indigo text-xs font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-indigo mb-1">Create an Account</h3>
                  <p className="text-sm text-indigo/60">Sign up to access your dashboard and order history</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-none bg-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-indigo text-xs font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-indigo mb-1">Shop Your Favorites</h3>
                  <p className="text-sm text-indigo/60">Browse our curated collection of handcrafted products</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-none bg-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-indigo text-xs font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-indigo mb-1">Track Your Orders</h3>
                  <p className="text-sm text-indigo/60">Stay updated on your order status and shipping</p>
                </div>
              </div>
            </div>

            <div className="border-t border-indigo/10 pt-6">
              <p className="text-sm text-indigo/60 mb-4">
                Already have an account? Simply login to continue shopping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        navigateTo={navigateTo}
      />
    </div>
  );
};

export default LoginPage;




