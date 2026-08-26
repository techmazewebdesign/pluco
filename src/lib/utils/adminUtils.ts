/**
 * Admin role detection utility
 * Safe, flexible, single source of truth for admin checks
 * Works with multiple field naming conventions
 */

interface UserProfile {
  is_admin?: boolean;
  isAdmin?: boolean;
  role?: string;
  roles?: string[];
  email?: string;
  uid?: string;
}

const ALLOWED_ADMIN_EMAILS = [
  'desivo.de@gmail.com',
  'techmazewebdesign@gmail.com',
];

/**
 * Detect if user is admin from user profile
 * Checks multiple fields for flexibility and safety
 * Returns true if ANY condition is met
 */
export function isAdminUser(userProfile: UserProfile | null | undefined): boolean {
  if (!userProfile) {
    console.log('[Admin] No profile provided, user is NOT admin');
    return false;
  }

  // Check: is_admin: true (snake_case)
  if (userProfile.is_admin === true) {
    console.log('[Admin] Detected via is_admin field');
    return true;
  }

  // Check: isAdmin: true (camelCase)
  if (userProfile.isAdmin === true) {
    console.log('[Admin] Detected via isAdmin field');
    return true;
  }

  // Check: role === "admin"
  if (userProfile.role === 'admin') {
    console.log('[Admin] Detected via role field');
    return true;
  }

  // Check: roles array includes "admin"
  if (Array.isArray(userProfile.roles) && userProfile.roles.includes('admin')) {
    console.log('[Admin] Detected via roles array');
    return true;
  }

  // Check: email in allowed admin list (fallback for safety)
  if (userProfile.email && ALLOWED_ADMIN_EMAILS.includes(userProfile.email)) {
    console.log('[Admin] Detected via allowed admin email');
    return true;
  }

  console.log('[Admin] User is NOT admin');
  return false;
}

/**
 * Get the appropriate dashboard path for user based on admin status
 */
export function getDashboardPath(isAdmin: boolean): string {
  if (isAdmin) {
    return '/admin/dashboard';
  }
  return '/dashboard';
}

/**
 * Check if user can access admin section
 */
export function canAccessAdmin(userProfile: UserProfile | null | undefined): boolean {
  return isAdminUser(userProfile);
}
