'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => ({ success: false }),
  error: null,
  clearError: () => {},
});

function parseFirebaseError(code: string | undefined): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to too many failed attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact info@plucogroup.com.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Please contact info@plucogroup.com.';
    case 'auth/expired-action-code':
      return 'This link has expired. Please request a new password reset.';
    default:
      return `Authentication error (${code || 'unknown'}). Please contact info@plucogroup.com.`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  // ── Sign In ────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      const msg = parseFirebaseError(code);
      setError(msg);
      throw e;
    }
  };

  // ── Sign Up ────────────────────────────────────────────────────────
  const signUp = async (email: string, password: string, name: string) => {
    clearError();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Set display name on Firebase Auth profile
      await updateProfile(cred.user, { displayName: name.trim() });

      // Create Firestore client profile
      const clientRef = doc(db, 'clients', cred.user.uid);
      const existing = await getDoc(clientRef);
      if (!existing.exists()) {
        await setDoc(clientRef, {
          uid: cred.user.uid,
          name: name.trim(),
          email: email.trim(),
          preferredLanguage: 'en',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      const msg = parseFirebaseError(code);
      setError(msg);
      throw e;
    }
  };

  // ── Sign Out ───────────────────────────────────────────────────────
  const signOut = async () => {
    clearError();
    await firebaseSignOut(auth);
  };

  // ── Reset Password ─────────────────────────────────────────────────
  const resetPassword = async (email: string): Promise<{ success: boolean }> => {
    clearError();
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      // Don't reveal whether the email exists (security best practice)
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        // Return success anyway so we don't leak user existence
        return { success: true };
      }
      const msg = parseFirebaseError(code);
      setError(msg);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error, clearError,
      signIn, signUp, signOut, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
