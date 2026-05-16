// ── FILE: src/firebase.ts ──────────────────────────────
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

if (!isFirebaseConfigured) {
  console.warn('Firebase API Key is missing. Infrastructure synchronization is disabled. Running in local-only mode.');
}

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null as any;
export const auth = app ? getAuth(app) : null as any;
