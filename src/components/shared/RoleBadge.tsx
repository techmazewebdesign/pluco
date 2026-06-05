'use client';

import { Shield } from 'lucide-react';

interface RoleBadgeProps {
  role?: string;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const getRoleColor = (role?: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return { bg: '#FEE2E2', text: '#991B1B', icon: '#DC2626' };
    case 'consultant':
      return { bg: '#DCE7F1', text: '#1E40AF', icon: '#1E40AF' };
    case 'case_manager':
      return { bg: '#D1E7DD', text: '#0F5132', icon: '#198754' };
    case 'customer_service':
      return { bg: '#FFF3CD', text: '#664D03', icon: '#FFC107' };
    case 'document_reviewer':
      return { bg: '#E7D4F5', text: '#5A189A', icon: '#7209B7' };
    case 'compliance_officer':
      return { bg: '#D1FAE5', text: '#065F46', icon: '#10B981' };
    case 'enquiry_handler':
      return { bg: '#DBEAFE', text: '#1E3A8A', icon: '#3B82F6' };
    default:
      return { bg: '#F3F4F6', text: '#374151', icon: '#9CA3AF' };
  }
};

const getRoleLabel = (role?: string) => {
  if (!role) return 'User';
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function RoleBadge({ role, email, size = 'md' }: RoleBadgeProps) {
  const colors = getRoleColor(role);
  const label = getRoleLabel(role);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <div className={`rounded-lg ${sizeClasses[size]} flex items-center gap-2`} style={{ backgroundColor: colors.bg }}>
      <Shield className="w-4 h-4" style={{ color: colors.icon }} />
      <div>
        <div className="font-semibold" style={{ color: colors.text }}>
          {label}
        </div>
        {email && (
          <div className="text-xs opacity-75" style={{ color: colors.text }}>
            {email}
          </div>
        )}
      </div>
    </div>
  );
}
