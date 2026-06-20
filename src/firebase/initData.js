import { createProduct } from './services/productService';
import { registerUser } from './services/authService';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Initialize Firebase with sample data
export const initializeFirebaseData = async () => {
  try {
    // Quick check: if already initialized in this browser session, skip networking
    if (localStorage.getItem('haathsaga_initialized') === 'true') {
      console.log('App already initialized (local flag found).');
      return true;
    }

    console.log('Initializing Firebase data...');
    
    // Create admin user (if not exists)
    try {
      const result = await registerUser(
        'admin@angilu.com',
        'admin@123',
        'ANGILU Admin',
        true
      );
      console.log('Admin user created successfully');
      
      // Ensure admin user document exists in Firestore with proper admin status
      if (result && result.user) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: 'admin@angilu.com',
          displayName: 'ANGILU Admin',
          isAdmin: true,
          createdAt: new Date(),
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }, { merge: true });
        console.log('Admin user document created/updated in Firestore');
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin user already exists in Authentication');
        
        // Check if admin user document exists in Firestore
        try {
          // We need to get UID of admin user, but since we can't directly get it by email,
          // we'll create a placeholder check that will be handled by admin login process
          console.log('Admin user document will be created/updated during login');
        } catch (docError) {
          console.error('Error checking admin user document:', docError);
        }
      } else {
        console.error('Error creating admin user:', error);
      }
    }
    
    // Products should be added manually through admin dashboard
    console.log('Products should be added manually through admin dashboard');
    
    // Mark as initialized locally and in DB
    localStorage.setItem('haathsaga_initialized', 'true');
    await setDoc(doc(db, '_system', 'initialization'), {
      initialized: true,
      initializedAt: new Date(),
      version: '1.0.0'
    });
    
    console.log('Firebase data initialization completed');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
    return false;
  }
};

// Function to check if data is already initialized
export const checkDataInitialized = async () => {
  try {
    // 1. Fast path: Check localStorage first
    if (localStorage.getItem('haathsaga_initialized') === 'true') {
      return true;
    }

    // 2. Network path: Check Firestore with a strict 3-second timeout
    const checkPromise = (async () => {
      const initDoc = await getDoc(doc(db, '_system', 'initialization'));
      return initDoc.exists() && initDoc.data().initialized;
    })();

    const timeoutPromise = new Promise((resolve) => 
      setTimeout(() => resolve(false), 3000)
    );

    const isInitialized = await Promise.race([checkPromise, timeoutPromise]);
    
    if (isInitialized) {
      localStorage.setItem('haathsaga_initialized', 'true');
    }
    
    console.log('Checking if data is initialized:', isInitialized);
    return isInitialized;
  } catch (error) {
    console.error('Error checking data initialization:', error);
    return false;
  }
};