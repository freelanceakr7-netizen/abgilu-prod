import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, RefreshCw } from 'lucide-react';
import { verifyOTP, initiateOTPVerification } from '../src/firebase/services/emailService';

const OTPVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  onVerificationSuccess, 
  onBackToRegister,
  debugOtp: initialDebugOtp,
  isProcessing = false
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);      // 5-minute OTP expiry
  const [resendCooldown, setResendCooldown] = useState(30); // 30-second resend lock
  const [canResend, setCanResend] = useState(false);
  const [debugOtp, setDebugOtp] = useState(initialDebugOtp);

  // ─── OTP expiry: 5-minute countdown ───────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    // Reset everything when the modal opens fresh
    setTimeLeft(300);
    setResendCooldown(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setDebugOtp(initialDebugOtp);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // ─── Resend cooldown: 30-second lock ──────────────────────────────────────
  // Using a ref-based approach to avoid re-registering the interval on every tick.
  const resendCooldownRef = useRef(resendCooldown);
  resendCooldownRef.current = resendCooldown;

  useEffect(() => {
    if (!isOpen || canResend) return;

    const resendTimer = setInterval(() => {
      const next = resendCooldownRef.current - 1;
      if (next <= 0) {
        setResendCooldown(0);
        setCanResend(true);
        clearInterval(resendTimer);
      } else {
        setResendCooldown(next);
      }
    }, 1000);

    return () => clearInterval(resendTimer);
  }, [isOpen, canResend]); // only re-run when isOpen or canResend changes

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft <= 0;

  // ─── OTP input handlers ───────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const nextEmptyIndex = newOtp.findIndex((val) => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    setTimeout(() => {
      const input = document.getElementById(`otp-${focusIndex}`);
      if (input) input.focus();
    }, 0);
  };

  // ─── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    // Guard: prevent submission if the code has already expired on the frontend
    if (isExpired) {
      setError('This code has expired. Please request a new one.');
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(email, otpString, false);
      if (result.valid) {
        await onVerificationSuccess(otpString);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────────────────────
  // Calling initiateOTPVerification writes a brand-new OTP document to Firestore
  // (via setDoc, which overwrites the entire document), so the previous code is
  // immediately invalidated on the backend the moment the new one is stored.
  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await initiateOTPVerification(email);

      // Update debugOtp if the new call returns one (fallback / dev mode)
      if (result?.otp) {
        setDebugOtp(result.otp);
      }

      // Reset timers and clear inputs for the fresh code
      setTimeLeft(300);        // New 5-minute window
      setResendCooldown(30);   // Lock resend for another 30 seconds
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError('');

      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }, 0);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-indigo/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 md:p-12" onClick={onClose}>
      <div className="bg-kora border border-indigo/10 rounded-none shadow-2xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-indigo/60 hover:text-terracotta transition-colors">
          <X size={24} />
        </button>

        <div className="pt-16 pb-12 px-8 md:px-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-terracotta/10 rounded-none mb-6">
              <Mail className="w-10 h-10 text-terracotta" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-indigo mb-3">
              Security Verification
            </h2>
            <p className="text-indigo/60 font-light text-lg">
              We've sent a 6-digit code to
            </p>
            <p className="font-medium text-indigo text-lg mb-4">{email}</p>

            {debugOtp && (
              <div className="mt-4 p-4 bg-indigo/5 border border-indigo/10 rounded-none">
                <p className="text-xs text-indigo/40 uppercase tracking-widest mb-1">Developer Mode: OTP Code</p>
                <p className="text-3xl font-serif text-terracotta tracking-[0.5em]">{debugOtp}</p>
                <p className="text-[10px] text-indigo/30 mt-2 italic">
                  This code is shown because the automated email service is currently in fallback mode.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-8 p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta rounded-none">
              {error}
            </div>
          )}

          {/* Expired overlay message */}
          {isExpired && (
            <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta rounded-none text-center text-sm font-medium">
              ⏰ This code has expired. Please request a new one below.
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <label className="block text-indigo text-sm font-medium mb-4 text-center">
                Enter OTP Code
              </label>
              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isExpired}
                    className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-serif bg-kora-light border rounded-none focus:outline-none transition-colors text-indigo
                      ${isExpired
                        ? 'border-terracotta/20 opacity-40 cursor-not-allowed'
                        : 'border-indigo/20 focus:border-terracotta'
                      }`}
                    required
                  />
                ))}
              </div>
            </div>

            {/* Expiry / countdown display */}
            <div className="mb-6 text-center">
              {isExpired ? (
                <p className="text-sm text-terracotta font-medium">Code has expired</p>
              ) : (
                <p className="text-sm text-indigo/60">
                  Code expires in <span className={`font-medium ${timeLeft <= 60 ? 'text-terracotta' : ''}`}>{formatTime(timeLeft)}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isProcessing || otp.join('').length !== 6 || isExpired}
              className="w-full bg-indigo text-kora py-3 rounded-none font-medium text-sm uppercase tracking-widest hover:bg-terracotta transition-colors disabled:opacity-50 mb-6"
            >
              {isLoading || isProcessing ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <div className="text-center space-y-6">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isLoading}
              className="text-sm text-indigo/60 hover:text-terracotta transition-colors disabled:opacity-50 flex items-center justify-center mx-auto gap-2"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              {canResend ? 'Resend Code' : `Resend in ${resendCooldown}s`}
            </button>

            <button
              type="button"
              onClick={onBackToRegister}
              className="text-sm text-indigo font-medium tracking-wider hover:text-terracotta transition-colors border-t border-indigo/10 pt-6 w-full uppercase"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
