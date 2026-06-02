'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
    if (!user) { setAgent(null); setLoadingAgent(false); return; }
    const load = async () => {
      setLoadingAgent(true);
      try {
        const snap = await getDoc(doc(db, 'agents', user.uid));
        if (snap.exists() && snap.data().active) {
          setAgent({ uid: user.uid, ...snap.data() } as Agent);
        } else {
          setAgent(null);
        }
      } catch { setAgent(null); }
      finally { setLoadingAgent(false); }
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

export function useAgent() { return useContext(AgentContext); }
