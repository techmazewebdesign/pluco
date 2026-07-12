'use client';

/**
 * Loading and error fallback components for dashboard access
 */

/**
 * Simple loading component for dashboard
 */
export function DashboardLoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
        <p style={{ color: '#5E6470' }}>Loading dashboard...</p>
      </div>
    </div>
  );
}

/**
 * Access denied component
 */
export function DashboardAccessDenied({ currentRole, requiredDashboard }: { currentRole?: string; requiredDashboard?: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EF4444' }}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m0-10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#071C3C' }}>
          Access Denied
        </h1>
        <p style={{ color: '#5E6470' }} className="mb-6">
          You don't have permission to access this dashboard.
        </p>
        {currentRole && (
          <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
            Current role: <span className="font-semibold">{currentRole}</span>
          </p>
        )}
        <a
          href="/dashboard"
          className="inline-block px-6 py-2 rounded font-semibold text-white transition"
          style={{ backgroundColor: '#071C3C' }}
        >
          Go to My Dashboard
        </a>
      </div>
    </div>
  );
}
