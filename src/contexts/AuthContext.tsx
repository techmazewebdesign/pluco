'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string) => Promise<User>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => { throw new Error('AuthProvider is not ready'); },
  signUp: async () => { throw new Error('AuthProvider is not ready'); },
  signOut: async () => {},
  error: null,
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u && window.sessionStorage.getItem('pluco-logout') === '1') {
        window.location.replace('/');
        return;
      }
      setUser(u);
      setLoading(false);
    });
    if (window.location.pathname === '/') {
      window.sessionStorage.removeItem('pluco-logout');
    }
    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    clearError();
    const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    return credential.user;
  };

  const signUp = async (email: string, password: string, name: string) => {
    clearError();
    const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    await updateProfile(credential.user, { displayName: name.trim() });
    return credential.user;
  };

  // ── Sign Out ───────────────────────────────────────────────────────
  const signOut = async () => {
    clearError();
    window.sessionStorage.setItem('pluco-logout', '1');
    await firebaseSignOut(auth);
    window.location.replace('/');
    await new Promise<void>(() => undefined);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error, clearError,
      signIn, signUp, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
