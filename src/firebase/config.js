import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyC0QU2BLabGySxm3NL8rDHEKWbjX3rX6yk",
  authDomain: "angilu-dev-e1042.firebaseapp.com",
  projectId: "angilu-dev-e1042",
  storageBucket: "angilu-dev-e1042.firebasestorage.app",
  messagingSenderId: "603257310608",
  appId: "1:603257310608:web:f279083afbfd54240db715",
  measurementId: "G-LZNNPED5PQ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase services with offline persistence enabled
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;