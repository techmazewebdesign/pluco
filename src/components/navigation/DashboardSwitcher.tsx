'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Home, User, Shield, Headphones, Briefcase } from 'lucide-react';
import { getDashboardSwitcherOptions, type Role } from '@/lib/utils/roleUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSwitcherProps {
  currentRole: Role;
  currentPath: string;
  fullName?: string;
  email?: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
};

const roleLabels: Record<Role, string> = {
  admin: 'Administrator',
  customer_service: 'Customer Service',
  consultant: 'Consultant',
  user: 'User',
};

export default function DashboardSwitcher({
  currentRole,
  currentPath,
  fullName,
  email,
}: DashboardSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const options = getDashboardSwitcherOptions(currentRole);

  const currentOption = options.find(opt => opt.path === currentPath) || options[0];

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-2">
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-600">{roleLabels[currentRole]}</p>
            <p className="text-sm font-bold text-gray-900">{currentOption.label}</p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 text-gray-400 transition-transform"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            {/* User Info */}
            {(fullName || email) && (
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                {fullName && (
                  <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                )}
                {email && (
                  <p className="text-xs text-gray-600">{email}</p>
                )}
              </div>
            )}

            {/* Navigation Options */}
            <div className="py-2">
              {options.map((option, idx) => {
                const isActive = option.path === currentPath;
                const icon = roleIcons[option.icon] || roleIcons.Home;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleNavigate(option.path)}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="text-gray-400">{icon}</div>
                    {option.label}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-100 px-4 py-2">
              <Link
                href="/logout"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
