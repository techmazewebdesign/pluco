/**
 * Hook for dashboard access control and role-based routing
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  detectUserRole,
  getRoleConfig,
  canAccessDashboard,
  requiresProfileCompletion,
  type UserRole,
} from '@/lib/utils/roleUtils';

interface UseDashboardAccessResult {
  isLoading: boolean;
  isAllowed: boolean;
  userRole: UserRole | null;
  profileCompleted: boolean;
  redirectPath: string | null;
  error: string | null;
}

/**
 * Hook to check dashboard access and handle redirects
 * Usage in dashboard pages:
 *
 * const { isLoading, isAllowed, userRole } = useDashboardAccess('/admin/dashboard');
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAllowed) return <AccessDenied />;
 * // Render dashboard
 */
export function useDashboardAccess(requiredDashboard: string): UseDashboardAccessResult {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      console.log('[Routing] No user authenticated, redirecting to login');
      setRedirectPath('/login');
      setIsLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        console.log('[Routing] Checking access to:', requiredDashboard);
        console.log('[Routing] User UID:', user.uid);

        // Detect user role
        const role = await detectUserRole(user.uid, user.email || '');
        console.log('[Routing] Detected role:', role.role);
        setUserRole(role);

        // Check if dashboard access is allowed
        const allowed = canAccessDashboard(role.role, requiredDashboard);
        console.log('[Routing] Access allowed:', allowed);

        if (!allowed) {
          console.log('[Routing] Access denied, redirecting to primary dashboard');
          const config = getRoleConfig(role.role);
          setRedirectPath(config.dashboardPath);
          setIsAllowed(false);
          setIsLoading(false);
          return;
        }

        // Check if profile completion is required
        const needsProfile = requiresProfileCompletion(role.role);
        const profileDone = role.profileCompleted;
        console.log('[Routing] Requires profile completion:', needsProfile);
        console.log('[Routing] Profile completed:', profileDone);

        if (needsProfile && !profileDone) {
          console.log('[Routing] Profile incomplete, redirecting to profile setup');
          const config = getRoleConfig(role.role);
          setRedirectPath(config.profileCompletionPath);
          setIsAllowed(false);
          setIsLoading(false);
          return;
        }

        setProfileCompleted(profileDone);
        setIsAllowed(true);
        setIsLoading(false);
      } catch (err: any) {
        console.error('[Routing] Error checking access:', err?.message);
        setError(err?.message || 'Failed to check dashboard access');
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, authLoading, requiredDashboard]);

  // Handle redirects
  useEffect(() => {
    if (redirectPath && pathname !== redirectPath) {
      console.log('[Routing] Redirecting to:', redirectPath);
      router.push(redirectPath);
    }
  }, [redirectPath, pathname, router]);

  return {
    isLoading,
    isAllowed,
    userRole,
    profileCompleted,
    redirectPath,
    error,
  };
}

