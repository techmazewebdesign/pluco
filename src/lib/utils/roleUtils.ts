/**
 * Comprehensive Role Detection and Management
 * Single source of truth for role-based access control
 *
 * Roles: admin, customer_service, consultant, user
 */

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type Role = 'admin' | 'customer_service' | 'consultant' | 'user';

export interface UserRole {
  uid: string;
  email: string;
  role: Role;
  profileCompleted: boolean;
  isAdmin: boolean;
  fullName?: string;
  phone?: string;
  timezone?: string;
}

export interface RoleConfig {
  dashboardPath: string;
  canAccessAdminDashboard: boolean;
  canAccessCustomerServiceDashboard: boolean;
  canAccessConsultantDashboard: boolean;
  canAccessUserDashboard: boolean;
  requiresProfileCompletion: boolean;
  profileCompletionPath: string;
}

/**
 * Detect and normalize role from multiple Firestore sources
 */
export async function detectUserRole(uid: string, email: string): Promise<UserRole> {
  if (!uid) {
    console.log('[Auth] No UID provided, defaulting to user role');
    return {
      uid,
      email,
      role: 'user',
      profileCompleted: false,
      isAdmin: false,
    };
  }

  try {
    console.log('[Auth] Detecting role for uid:', uid);
    console.log('[Auth] Email:', email);

    // Try to get from users collection first (primary source)
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log('[Auth] Found user document');

      // Check for admin flag
      if (userData.is_admin === true || userData.isAdmin === true) {
        console.log('[Auth] Detected via is_admin/isAdmin flag');
        const userRole: UserRole = {
          uid,
          email,
          role: 'admin',
          profileCompleted: userData.profileCompleted ?? false,
          isAdmin: true,
          fullName: userData.fullName,
          phone: userData.phone,
          timezone: userData.timezone,
        };
        console.log('[Auth] Normalized role:', userRole.role);
        return userRole;
      }

      // Check for role field
      if (userData.role) {
        const normalizedRole = normalizeRole(userData.role);
        console.log('[Auth] Found role field:', userData.role, '→', normalizedRole);
        const userRole: UserRole = {
          uid,
          email,
          role: normalizedRole,
          profileCompleted: userData.profileCompleted ?? false,
          isAdmin: false,
          fullName: userData.fullName,
          phone: userData.phone,
          timezone: userData.timezone,
        };
        console.log('[Auth] Normalized role:', userRole.role);
        return userRole;
      }
    }

    // Try agent_profiles collection
    const agentProfileRef = doc(db, 'agent_profiles', uid);
    const agentProfileSnap = await getDoc(agentProfileRef);

    if (agentProfileSnap.exists()) {
      const agentData = agentProfileSnap.data();
      console.log('[Auth] Found agent_profiles document');

      if (agentData.role) {
        const normalizedRole = normalizeRole(agentData.role);
        console.log('[Auth] Found agent role:', agentData.role, '→', normalizedRole);
        const userRole: UserRole = {
          uid,
          email,
          role: normalizedRole,
          profileCompleted: agentData.profileCompleted ?? false,
          isAdmin: false,
          fullName: agentData.fullName,
          phone: agentData.phone,
          timezone: agentData.timezone,
        };
        console.log('[Auth] Normalized role:', userRole.role);
        return userRole;
      }
    }

    // Try role_profiles collection
    const roleProfileRef = doc(db, 'role_profiles', uid);
    const roleProfileSnap = await getDoc(roleProfileRef);

    if (roleProfileSnap.exists()) {
      const roleData = roleProfileSnap.data();
      console.log('[Auth] Found role_profiles document');

      if (roleData.role) {
        const normalizedRole = normalizeRole(roleData.role);
        console.log('[Auth] Found role:', roleData.role, '→', normalizedRole);
        const userRole: UserRole = {
          uid,
          email,
          role: normalizedRole,
          profileCompleted: roleData.profileCompleted ?? false,
          isAdmin: false,
          fullName: roleData.fullName,
          phone: roleData.phone,
          timezone: roleData.timezone,
        };
        console.log('[Auth] Normalized role:', userRole.role);
        return userRole;
      }
    }

    // If no role found, default to user
    console.log('[Auth] No role document found, defaulting to user role');
    const defaultUserRole: UserRole = {
      uid,
      email,
      role: 'user',
      profileCompleted: false,
      isAdmin: false,
    };
    console.log('[Auth] Normalized role:', defaultUserRole.role);
    return defaultUserRole;
  } catch (error) {
    console.error('[Auth] Error detecting role:', error);
    // Fallback to user role on error
    return {
      uid,
      email,
      role: 'user',
      profileCompleted: false,
      isAdmin: false,
    };
  }
}

/**
 * Normalize role names to standard format
 * Converts: consult → consultant, admin_user → admin, etc.
 */
function normalizeRole(roleInput: string): Role {
  const role = String(roleInput).toLowerCase().trim();

  // Direct matches
  if (role === 'admin') return 'admin';
  if (role === 'customer_service' || role === 'customerservice') return 'customer_service';
  if (role === 'consultant') return 'consultant';
  if (role === 'user' || role === 'client') return 'user';

  // Alias matches
  if (role === 'consult') return 'consultant';
  if (role === 'cs' || role === 'support') return 'customer_service';
  if (role === 'admin_user') return 'admin';

  // Default
  console.log('[Auth] Unknown role:', roleInput, '→ defaulting to user');
  return 'user';
}

/**
 * Get role configuration and access rules
 */
export function getRoleConfig(role: Role): RoleConfig {
  const configs: Record<Role, RoleConfig> = {
    admin: {
      dashboardPath: '/admin/dashboard',
      canAccessAdminDashboard: true,
      canAccessCustomerServiceDashboard: true,
      canAccessConsultantDashboard: true,
      canAccessUserDashboard: true,
      requiresProfileCompletion: false,
      profileCompletionPath: '/admin/dashboard',
    },
    customer_service: {
      dashboardPath: '/customer-service/dashboard',
      canAccessAdminDashboard: false,
      canAccessCustomerServiceDashboard: true,
      canAccessConsultantDashboard: false,
      canAccessUserDashboard: true,
      requiresProfileCompletion: true,
      profileCompletionPath: '/customer-service/profile-setup',
    },
    consultant: {
      dashboardPath: '/consultant/dashboard',
      canAccessAdminDashboard: false,
      canAccessCustomerServiceDashboard: false,
      canAccessConsultantDashboard: true,
      canAccessUserDashboard: true,
      requiresProfileCompletion: true,
      profileCompletionPath: '/consultant/profile-setup',
    },
    user: {
      dashboardPath: '/dashboard',
      canAccessAdminDashboard: false,
      canAccessCustomerServiceDashboard: false,
      canAccessConsultantDashboard: false,
      canAccessUserDashboard: true,
      requiresProfileCompletion: false,
      profileCompletionPath: '/dashboard',
    },
  };

  return configs[role];
}

/**
 * Check if user can access a specific dashboard
 */
export function canAccessDashboard(userRole: Role, dashboardPath: string): boolean {
  const config = getRoleConfig(userRole);

  switch (dashboardPath) {
    case '/admin/dashboard':
      return config.canAccessAdminDashboard;
    case '/customer-service/dashboard':
      return config.canAccessCustomerServiceDashboard;
    case '/consultant/dashboard':
    case '/consult/dashboard':
      return config.canAccessConsultantDashboard;
    case '/dashboard':
      return config.canAccessUserDashboard;
    default:
      return false;
  }
}

/**
 * Get primary dashboard path for role
 */
export function getPrimaryDashboardPath(userRole: Role): string {
  return getRoleConfig(userRole).dashboardPath;
}

/**
 * Check if role requires profile completion
 */
export function requiresProfileCompletion(userRole: Role): boolean {
  return getRoleConfig(userRole).requiresProfileCompletion;
}

/**
 * Get profile completion path for role
 */
export function getProfileCompletionPath(userRole: Role): string {
  return getRoleConfig(userRole).profileCompletionPath;
}

/**
 * Get all dashboard switcher options for role
 */
export function getDashboardSwitcherOptions(userRole: Role) {
  const baseOptions = [
    { label: 'My Profile & Documents', path: '/dashboard', icon: 'User' },
    { label: 'Main Website', path: '/', icon: 'Home' },
  ];

  const roleOptions: Record<Role, { label: string; path: string; icon: string }[]> = {
    admin: [
      { label: 'Admin Dashboard', path: '/admin/dashboard', icon: 'Shield' },
      ...baseOptions,
    ],
    customer_service: [
      { label: 'Customer Service Dashboard', path: '/customer-service/dashboard', icon: 'Headphones' },
      ...baseOptions,
    ],
    consultant: [
      { label: 'Consultant Dashboard', path: '/consultant/dashboard', icon: 'Briefcase' },
      ...baseOptions,
    ],
    user: baseOptions,
  };

  return roleOptions[userRole];
}

/**
 * Check if user is admin (convenience function)
 */
export function isAdmin(userRole: Role | UserRole): boolean {
  const role = typeof userRole === 'string' ? userRole : userRole.role;
  return role === 'admin';
}

/**
 * Check if user is customer service
 */
export function isCustomerService(userRole: Role | UserRole): boolean {
  const role = typeof userRole === 'string' ? userRole : userRole.role;
  return role === 'customer_service';
}

/**
 * Check if user is consultant
 */
export function isConsultant(userRole: Role | UserRole): boolean {
  const role = typeof userRole === 'string' ? userRole : userRole.role;
  return role === 'consultant';
}

/**
 * Check if user is regular user
 */
export function isRegularUser(userRole: Role | UserRole): boolean {
  const role = typeof userRole === 'string' ? userRole : userRole.role;
  return role === 'user';
}
