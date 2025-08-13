import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAj0uGvfjqxrQAOGlLivMHIU8TzCimb0f4",
  authDomain: "longevai360-53c94.firebaseapp.com",
  databaseURL: "https://longevai360-53c94-default-rtdb.firebaseio.com",
  projectId: "longevai360-53c94",
  storageBucket: "longevai360-53c94.firebasestorage.app",
  messagingSenderId: "1034969417445",
  appId: "1:1034969417445:web:3ae7aa643a3e5aa683760c",
  measurementId: "G-QH1KXFZ55T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics (optional)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;