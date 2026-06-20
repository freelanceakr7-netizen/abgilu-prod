import { doc, setDoc, getDoc, deleteField } from 'firebase/firestore';
import { db } from '../config';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config';
import { RateLimitService, withRateLimit, getEmailFromArgs } from './rateLimitService';

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in Firestore with expiration time (5 minutes)
export const storeOTP = async (email, otp) => {
  try {
    console.log('Storing OTP for email:', email);
    console.log('OTP to store:', otp);
    
    const otpDoc = doc(db, 'otps', email);
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    const otpData = {
      otp,
      email,
      createdAt: new Date(),
      expiresAt: expirationTime,
      attempts: 0
    };
    
    console.log('OTP data to store:', otpData);
    
    await setDoc(otpDoc, otpData);
    
    // Verify it was stored correctly
    const storedDoc = await getDoc(otpDoc);
    if (storedDoc.exists()) {
      console.log('OTP successfully stored in Firestore:', storedDoc.data());
    } else {
      console.error('Failed to store OTP in Firestore - document does not exist after setDoc');
    }
    
    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }
};

// Verify OTP from Firestore with rate limiting
export const verifyOTP = async (email, enteredOTP, deleteAfterSuccess = true) => {
  try {
    console.log('Verifying OTP for email:', email);
    console.log('Entered OTP:', enteredOTP);
    console.log('Delete after success:', deleteAfterSuccess);
    
    // Check rate limit for OTP verification
    const rateLimitResult = RateLimitService.checkRateLimit(email, 'auth.otpVerify');
    
    if (!rateLimitResult.allowed) {
      console.warn(`OTP verification rate limit exceeded for ${email}`);
      return { 
        valid: false, 
        message: rateLimitResult.message,
        rateLimited: true,
        remainingTime: rateLimitResult.remainingTime
      };
    }
    
    const otpDoc = doc(db, 'otps', email);
    const otpSnapshot = await getDoc(otpDoc);
    
    console.log('OTP document exists:', otpSnapshot.exists());
    
    if (!otpSnapshot.exists()) {
      return { valid: false, message: 'OTP not found or expired' };
    }
    
    const otpData = otpSnapshot.data();
    console.log('Retrieved OTP data:', otpData);
    
    // Check if OTP has expired
    if (new Date() > otpData.expiresAt.toDate()) {
      await setDoc(otpDoc, { otp: deleteField() }, { merge: true });
      return { valid: false, message: 'OTP has expired' };
    }
    
    // Check if too many attempts
    if (otpData.attempts >= 3) {
      await setDoc(otpDoc, { otp: deleteField() }, { merge: true });
      return { valid: false, message: 'Too many attempts. Please request a new OTP' };
    }
    
    // Verify OTP first - ensure both are strings for consistent comparison
    const storedOTP = String(otpData.otp).trim();
    const enteredOTPStr = String(enteredOTP).trim();
    
    console.log('OTP Verification Debug:');
    console.log('Stored OTP:', storedOTP, 'Type:', typeof storedOTP);
    console.log('Entered OTP:', enteredOTPStr, 'Type:', typeof enteredOTPStr);
    console.log('Comparison result:', storedOTP === enteredOTPStr);
    
    if (storedOTP === enteredOTPStr) {
      // Clear OTP after successful verification (only if deleteAfterSuccess is true)
      if (deleteAfterSuccess) {
        await setDoc(otpDoc, { otp: deleteField() }, { merge: true });
      }
      
      // Record successful verification
      RateLimitService.recordSuccess(email, 'auth.otpVerify');
      
      return { valid: true, message: 'OTP verified successfully' };
    } else {
      // Increment attempt count only for failed attempts
      await setDoc(otpDoc, { attempts: otpData.attempts + 1 }, { merge: true });
      return { valid: false, message: 'Invalid OTP' };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Send OTP via email using Firebase Cloud Function with rate limiting
export const sendOTPEmail = withRateLimit(
  async (email, otp) => {
    try {
      console.log('Attempting to send OTP email via Firebase Callable Function');
      console.log('Email:', email);
      console.log('OTP:', otp);
      
      // Call Firebase Cloud Function using httpsCallable
      const sendOTPEmailFn = httpsCallable(functions, 'sendOTPEmail');
      const response = await sendOTPEmailFn({ email, otp });
      
      console.log('Email sent successfully via Cloud Function:', response.data);
      return { success: true, message: 'OTP sent successfully', ...response.data };
      
    } catch (error) {
      console.error('Error sending OTP email via Cloud Function:', error);
      
      // Still log the OTP for testing purposes if in fallback mode
      console.log('==========================================');
      console.log('EMAIL OTP VERIFICATION - FALLBACK MODE');
      console.log('Email:', email);
      console.log('OTP:', otp);
      console.log('Error details:', error.message);
      console.log('==========================================');
      
      // Return success false to correctly indicate failure instead of faking it
      return {
        success: false,
        message: `OTP email delivery failed: ${error.message}`,
        error: error.message,
        otp: otp, // Return OTP so frontend can potentially show it in dev mode
        fallback: true
      };
    }
  },
  'auth.otpRequest',
  getEmailFromArgs
);

// Complete OTP process: generate, store, and send with rate limiting
export const initiateOTPVerification = withRateLimit(
  async (email) => {
    try {
      console.log('Initiating OTP verification for email:', email);
      const otp = generateOTP();
      console.log('Generated OTP:', otp);
      await storeOTP(email, otp);
      const emailResult = await sendOTPEmail(email, otp);
      
      if (!emailResult.success) {
        if (emailResult.fallback) {
          console.log('OTP email failed, but continuing in fallback mode. Check console for OTP.');
          return { 
            success: true, 
            message: 'OTP generated. Check console (fallback mode)',
            otp: otp,
            fallback: true
          };
        }
        throw new Error(emailResult.message || 'Failed to send OTP email');
      }
      
      return { success: true, message: 'OTP sent to your email' };
    } catch (error) {
      console.error('Error initiating OTP verification:', error);
      throw error;
    }
  },
  'auth.otpRequest',
  getEmailFromArgs
);
