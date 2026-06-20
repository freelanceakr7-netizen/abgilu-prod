/**
 * Script to set up admin and test accounts in Firebase
 */

import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1JwHxWz0nQyo8mXsZ0t_AkrGLs0i7nPs",
  authDomain: "haathsaga.firebaseapp.com",
  projectId: "haathsaga",
  storageBucket: "haathsaga.firebasestorage.app",
  messagingSenderId: "341217028782",
  appId: "1:341217028782:web:33f429c31c47ea9bbedb3f",
  measurementId: "G-5B3F0Q7N4J"
};

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId
  });
}

const auth = getAuth();
const db = admin.firestore();

// Account credentials
const accounts = [
  {
    email: 'haathsaga.mauryas19@gmail.com',
    password: 'admin123456',
    displayName: 'Admin User',
    isAdmin: true
  },
  {
    email: 'test@haathsaga.com',
    password: 'test123456',
    displayName: 'Test User',
    isAdmin: false
  }
];

async function createAccount(account) {
  try {
    console.log(`\nCreating account: ${account.email}`);
    
    // Check if user already exists
    try {
      const userRecord = await auth.getUserByEmail(account.email);
      console.log(`  User already exists with UID: ${userRecord.uid}`);
      
      // Update user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: account.email,
        displayName: account.displayName,
        isAdmin: account.isAdmin,
        isActive: true,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        updatedAt: new Date()
      }, { merge: true });
      
      console.log(`  ✓ User document updated in Firestore`);
      return { uid: userRecord.uid, email: account.email, status: 'updated' };
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, create new user
        const userRecord = await auth.createUser({
          email: account.email,
          password: account.password,
          displayName: account.displayName,
          emailVerified: true
        });
        
        console.log(`  ✓ User created with UID: ${userRecord.uid}`);
        
        // Create user document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: account.email,
          displayName: account.displayName,
          isAdmin: account.isAdmin,
          isActive: true,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`  ✓ User document created in Firestore`);
        return { uid: userRecord.uid, email: account.email, status: 'created' };
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`  ✗ Error creating account ${account.email}:`, error.message);
    return { email: account.email, status: 'error', error: error.message };
  }
}

async function setupAccounts() {
  console.log('========================================');
  console.log('Firebase Account Setup');
  console.log('========================================');
  
  const results = [];
  
  for (const account of accounts) {
    const result = await createAccount(account);
    results.push(result);
  }
  
  console.log('\n========================================');
  console.log('Setup Summary');
  console.log('========================================');
  
  results.forEach(result => {
    if (result.status === 'created' || result.status === 'updated') {
      console.log(`✓ ${result.email} - ${result.status} (UID: ${result.uid})`);
    } else {
      console.log(`✗ ${result.email} - ${result.error}`);
    }
  });
  
  console.log('\n========================================');
  console.log('Account Credentials');
  console.log('========================================');
  
  accounts.forEach(account => {
    console.log(`\n${account.displayName}:`);
    console.log(`  Email: ${account.email}`);
    console.log(`  Password: ${account.password}`);
    console.log(`  Role: ${account.isAdmin ? 'Admin' : 'User'}`);
  });
  
  console.log('\n========================================');
  console.log('Setup Complete!');
  console.log('========================================');
  
  process.exit(0);
}

setupAccounts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
