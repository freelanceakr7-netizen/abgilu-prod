import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import { verifyOTP } from './emailService';
import { RateLimitService, withRateLimit, getEmailFromArgs } from './rateLimitService';

// Helper to generate a deterministic password for OTP-only login
// This keeps Firebase happy while removing password management from the user
const getDeterministicPassword = (email) => {
  return `angilu-otp-auth-${email.split('@')[0]}-secure`;
};


// Sign in user with rate limiting
export const signInUser = withRateLimit(
  async (email, password) => {
    try {
      console.log('Attempting to sign in user:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User authenticated successfully:', user.uid);
      
      // Get user data from Firestore with timeout
      try {
        const userDoc = await Promise.race([
          getDoc(doc(db, 'users', user.uid)),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 3000)
          )
        ]);
        const userData = userDoc.data();
        console.log('User data retrieved:', userData);
        return { user, userData };
      } catch (firestoreError) {
        console.warn('Could not retrieve user data from Firestore:', firestoreError.message);
        // Return user without userData if Firestore fails
        return { user, userData: null };
      }
    } catch (error) {
      console.error('Sign in error:', error.code, error.message);
      throw error;
    }
  },
  'auth.login',
  getEmailFromArgs
);

// Combined Sign In or Register with OTP verification
export const signInOrRegisterWithOTP = withRateLimit(
  async (email, otp, displayName = '') => {
    try {
      console.log('signInOrRegisterWithOTP called with:', { email, otp, displayName });
      
      // 1. Verify the OTP
      const otpVerification = await verifyOTP(email, otp, true);
      if (!otpVerification.valid) {
        throw new Error(otpVerification.message);
      }
      
      const deterministicPassword = getDeterministicPassword(email);
      
      // 2. Check if user exists in Firestore
      const userRef = doc(db, 'users', email); // or search by email field if UID is unknown
      // Since we don't know the UID yet, we can't easily get the doc by UID.
      // However, Firebase Auth's fetchSignInMethodsForEmail can tell us if user exists.
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      const userExists = signInMethods.length > 0;
      
      let user;
      let userData;
      
      if (userExists) {
        // 3a. Login existing user
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, deterministicPassword);
          user = userCredential.user;
          console.log('User signed in successfully:', user.uid);
          
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          userData = userDoc.data();
          
          if (displayName && userData && displayName !== userData.displayName) {
            console.log('Updating display name for existing user');
            await updateProfile(user, { displayName });
            await setDoc(doc(db, 'users', user.uid), { displayName }, { merge: true });
            userData.displayName = displayName;
          }
        } catch (loginError) {
          // If password fails (e.g. old user with real password), we might need to reset it.
          // Since we verified OTP, we are authorized.
          // But we can't reset without old password or admin SDK.
          // For now, let's assume all users will use this deterministic password or alert if transition is needed.
          if (loginError.code === 'auth/wrong-password') {
            throw new Error('This account was created with a password. Please contact support to transition to OTP-only login.');
          }
          throw loginError;
        }
      } else {
        // 3b. Register new user
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, deterministicPassword);
          user = userCredential.user;
          
          const finalDisplayName = displayName || 'Valued Member';
          await updateProfile(user, { displayName: finalDisplayName });
          
          userData = {
            uid: user.uid,
            email,
            displayName: finalDisplayName,
            isAdmin: false,
            emailVerified: true,
            createdAt: new Date(),
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          };
          
          await setDoc(doc(db, 'users', user.uid), userData);
          console.log('New user registered successfully:', user.uid);
        } catch (regError) {
          if (regError.code === 'auth/email-already-in-use') {
             console.log('User already exists (hidden by protection), switching to sign-in');
             try {
                const userCredential = await signInWithEmailAndPassword(auth, email, deterministicPassword);
                user = userCredential.user;
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                
                if (userDoc.exists()) {
                  userData = userDoc.data();
                  // If a specific display name was provided in the login modal, update the records
                  if (displayName && displayName.trim() !== '' && displayName !== userData.displayName) {
                    userData.displayName = displayName;
                    await updateProfile(user, { displayName });
                    await setDoc(doc(db, 'users', user.uid), { displayName }, { merge: true });
                  }
                } else {
                  // Fallback for missing document
                  const finalDisplayName = displayName || user.displayName || 'Valued Member';
                  userData = { 
                    uid: user.uid, 
                    email, 
                    displayName: finalDisplayName,
                    createdAt: new Date(),
                    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  };
                  await setDoc(doc(db, 'users', user.uid), userData);
                }
             } catch (signInError) {
                if (signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/wrong-password') {
                  throw new Error('This account was created with a password before we moved to OTP-only login. To continue, please reset your password via the "Forgot Password" link or contact support to convert your account.');
                }
                throw signInError;
             }
          } else {
            throw regError;
          }
        }
      }
      
      return { user, userData };
    } catch (error) {
      console.error('CRITICAL: OTP Auth Flow Error:', error);
      if (error.code) {
        console.error('Firebase Error Code:', error.code);
      }
      throw error;
    }
  },
  'auth.otpVerify',
  getEmailFromArgs
);


// Register new user (legacy function without OTP) with rate limiting
export const registerUser = withRateLimit(
  async (email, password, displayName, isAdmin = false) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, { displayName });
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        isAdmin,
        createdAt: new Date(),
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
      
      return { user, isAdmin };
    } catch (error) {
      throw error;
    }
  },
  'auth.register',
  getEmailFromArgs
);

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

import { onSnapshot } from 'firebase/firestore';

// Monitor auth state and user data changes
export const onAuthStateChange = (callback) => {
  let unsubDoc = null;

  const unsubAuth = onAuthStateChanged(auth, async (user) => {
    console.log('Auth state changed in onAuthStateChange:', user ? user.email : 'No user');
    
    // Clean up previous document listener if user changes
    if (unsubDoc) {
      unsubDoc();
      unsubDoc = null;
    }

    if (user) {
      // Set up real-time listener for user document
      unsubDoc = onSnapshot(doc(db, 'users', user.uid), 
        (docSnap) => {
          const userData = docSnap.data();
          console.log('Real-time user data update:', userData);
          callback({ user, userData });
        },
        (error) => {
          console.error('Error in user doc snapshot:', error);
          callback({ user, userData: null });
        }
      );
    } else {
      console.log('User signed out');
      callback({ user: null, userData: null });
    }
  });

  return () => {
    unsubAuth();
    if (unsubDoc) unsubDoc();
  };
};

// Update user password with rate limiting
export const updateUserPassword = async (user, currentPassword, newPassword) => {
  try {
    // Check rate limit for password updates
    if (user && user.email) {
      const rateLimitResult = RateLimitService.checkRateLimit(user.email, 'auth.passwordUpdate');
      
      if (!rateLimitResult.allowed) {
        const error = new Error(rateLimitResult.message);
        error.code = 'RATE_LIMIT_EXCEEDED';
        error.remainingTime = rateLimitResult.remainingTime;
        throw error;
      }
    }

    if (!user || !user.email) {
      throw new Error('No authenticated user found');
    }

    // Create credential with current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
    // Re-authenticate user with current password
    await reauthenticateWithCredential(user, credential);
    
    // Update password with new password
    await updatePassword(user, newPassword);
    
    console.log('Password updated successfully');
    
    // Record successful password update
    if (user && user.email) {
      RateLimitService.recordSuccess(user.email, 'auth.passwordUpdate');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    
    // Handle specific error cases
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('New password is too weak. Please choose a stronger password');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later');
    } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
      throw error;
    } else {
      throw new Error('Failed to update password. Please try again');
    }
  }
};

// Check if current user is admin
export const checkIsAdmin = async (user) => {
  if (!user) return false;
  
  // Special case for admin emails - always return true
  if (user.email === 'admin@angilu.com') {
    console.log('Admin email detected in checkIsAdmin, returning true');
    return true;
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    return userData?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
