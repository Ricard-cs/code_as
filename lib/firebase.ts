import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Access Replit secrets directly
const firebaseConfig = {
  apiKey: process.env.REPLIT_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.REPLIT_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REPLIT_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REPLIT_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REPLIT_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REPLIT_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Add debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : undefined
  });
}

// Initialize Firebase with fallback
let app;
try {
  if (!firebaseConfig.projectId) {
    console.error('Firebase Project ID is missing. Using fallback configuration.');
    // Fallback configuration - replace with your actual fallback values
    const fallbackConfig = {
      apiKey: "your-fallback-api-key",
      authDomain: "your-fallback-auth-domain",
      projectId: "your-fallback-project-id",
      storageBucket: "your-fallback-storage-bucket",
      messagingSenderId: "your-fallback-sender-id",
      appId: "your-fallback-app-id"
    };
    app = getApps().length === 0 ? initializeApp(fallbackConfig) : getApps()[0];
  } else {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const db = getFirestore(app);

export { db }; 