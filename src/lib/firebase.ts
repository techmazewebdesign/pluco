import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDIZ0PZ7yPdjMqHdWFYgTNPMTDVaM1Yvkg',
  authDomain: 'pluco-group.firebaseapp.com',
  projectId: 'pluco-group',
  storageBucket: 'pluco-group.firebasestorage.app',
  messagingSenderId: '591351934366',
  appId: '1:591351934366:web:e09cdfdaa0690a3a9efa8f',
  measurementId: 'G-56MTBRMS79',
};

// Prevent duplicate app initialisation in Next.js HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
