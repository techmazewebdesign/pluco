'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Agent, AgentRole } from '@/lib/types';
import { ROLE_PERMISSIONS } from '@/lib/types';

interface AgentContextValue {
  agent: Agent | null;
  isAgent: boolean;
  loadingAgent: boolean;
  can: (permission: keyof typeof ROLE_PERMISSIONS[AgentRole]) => boolean;
}

const AgentContext = createContext<AgentContextValue>({
  agent: null,
  isAgent: false,
  loadingAgent: true,
  can: () => false,
});

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(true);

  useEffect(() => {
    if (!user) {
      setAgent(null);
      setLoadingAgent(false);
      return;
    }

    const load = async () => {
      setLoadingAgent(true);
      try {
        // ── 1. Check custom claim first (most reliable, no Firestore rules needed) ──
        const tokenResult = await user.getIdTokenResult(true); // force refresh
        const isAdminClaim = !!tokenResult.claims.admin;
        const claimRole = (tokenResult.claims.role as AgentRole) || 'admin';

        if (isAdminClaim) {
          // Try to get rich data from Firestore (name, role etc.)
          // If this fails due to rules, fall back to claim data
          try {
            const snap = await getDoc(doc(db, 'agents', user.uid));
            if (snap.exists() && snap.data().active !== false) {
              setAgent({ uid: user.uid, ...snap.data() } as Agent);
              setLoadingAgent(false);
              return;
            }
          } catch {
            // Firestore read blocked — use claim data + Firebase Auth profile
          }

          // Firestore doc missing or blocked — build agent from claim + auth profile
          const fallbackAgent: Agent = {
            uid: user.uid,
            name: user.displayName || user.email || 'Admin',
            email: user.email || '',
            role: claimRole,
            active: true,
            createdAt: new Date().toISOString(),
          };

          // Silently try to create the Firestore doc if it doesn't exist
          try {
            await setDoc(doc(db, 'agents', user.uid), fallbackAgent, { merge: true });
          } catch { /* ignore if rules block write */ }

          setAgent(fallbackAgent);
          setLoadingAgent(false);
          return;
        }

        // ── 2. No admin claim — check Firestore as fallback ──
        try {
          const snap = await getDoc(doc(db, 'agents', user.uid));
          if (snap.exists() && snap.data().active) {
            setAgent({ uid: user.uid, ...snap.data() } as Agent);
          } else {
            setAgent(null);
          }
        } catch {
          setAgent(null);
        }
      } catch (e) {
        console.error('AgentContext load error:', e);
        setAgent(null);
      } finally {
        setLoadingAgent(false);
      }
    };

    load();
  }, [user]);

  const can = (permission: keyof typeof ROLE_PERMISSIONS[AgentRole]) => {
    if (!agent) return false;
    return ROLE_PERMISSIONS[agent.role]?.[permission] ?? false;
  };

  return (
    <AgentContext.Provider value={{ agent, isAgent: !!agent, loadingAgent, can }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  return useContext(AgentContext);
}
