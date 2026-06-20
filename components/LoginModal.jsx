import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { signInOrRegisterWithOTP } from '../src/firebase/services/authService';
import { initiateOTPVerification } from '../src/firebase/services/emailService';
import { isAdminEmail } from '../src/utils/adminUtils';
import { useAdmin } from '../src/contexts/AdminContext';
import OTPVerificationModal from './OTPVerificationModal';
import { Sparkles } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess, navigateTo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null);
  const { user } = useAdmin();



  if (!isOpen || user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Both login and registration now use OTP
      const result = await initiateOTPVerification(email);
      // Store auth data for after OTP verification
      setPendingAuth({ 
        email, 
        displayName, 
        isLogin,
        debugOtp: result.otp // Capture OTP for dev mode if email fails
      });
      setShowOTPModal(true);
    } catch (error) {
      console.error('CRITICAL: OTP Sign-in/Register error:', error);
      // Log more details if it's a Firebase Error
      if (error.code) {
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
      }
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };


  const handleOTPVerificationSuccess = async (otp) => {
    if (!pendingAuth) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInOrRegisterWithOTP(
        pendingAuth.email,
        otp,
        pendingAuth.displayName
      );
      
      // Navigation logic based on the email we just authenticated
      const userEmail = pendingAuth.email;
      
      console.log('Authentication with OTP successful:', result);
      setShowOTPModal(false);
      
      // Close modal immediately after successful authentication
      onClose();
      
      if (isAdminEmail(userEmail)) {
        if (navigateTo) navigateTo('admin');
      } else {
        if (navigateTo) navigateTo('dashboard');
      }
      
      // Clear state after we're done with it
      setPendingAuth(null);
      
      // Notify parent component of successful authentication
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      console.error('Authentication with OTP error:', error);
      setError(error.message || 'Authentication failed');
      throw error; // Re-throw for the modal to catch
    } finally {
      setIsLoading(false);
    }
  };


  const handleBackToRegister = () => {
    setShowOTPModal(false);
    setPendingAuth(null);
  };

  return (
    <div className="fixed inset-0 bg-indigo/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 md:p-12" onClick={onClose}>
      <div className="bg-kora border border-indigo/10 rounded-none shadow-2xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-indigo/60 hover:text-terracotta transition-colors">
          <X size={24} />
        </button>
        <div className="pt-16 pb-12 px-8 md:px-12">
          {/* Decorative Icon */}
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-terracotta/10 rounded-none flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-terracotta" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif text-indigo text-center mb-3">
            {isLogin ? 'Welcome Back' : 'Join Our Story'}
          </h2>
          
          <p className="text-indigo/60 text-center mb-10 font-light text-lg leading-relaxed">
            {isLogin ? 'Continue your journey with us' : 'Begin your journey with ANGILU'}
          </p>
          
          {error && (
            <div className="mb-8 p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta rounded-none">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo mb-2">
                User Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-indigo/20 rounded-none bg-kora-light text-indigo focus:outline-none focus:border-terracotta transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo mb-2">
                Email <span className="text-terracotta">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-indigo/20 rounded-none bg-kora-light text-indigo focus:outline-none focus:border-terracotta transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo text-kora py-3 rounded-none font-medium text-sm uppercase tracking-widest hover:bg-terracotta transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Sending Code...' : 'Continue'}
            </button>

          </form>
          
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-indigo/60 hover:text-terracotta transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
      
      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={pendingAuth?.email || ''}
        onVerificationSuccess={handleOTPVerificationSuccess}
        onBackToRegister={handleBackToRegister}
        debugOtp={pendingAuth?.debugOtp}
        isProcessing={isLoading}
      />
    </div>
  );
};

export default LoginModal;

