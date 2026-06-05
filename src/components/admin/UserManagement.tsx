'use client';

import { useState, useEffect } from 'react';
import { Plus, Shield, User, Trash2, Edit2, X, Check } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, setDoc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';

interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [updateingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const auth = getAuth();

  // Load users from Firestore
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData: AdminUser[] = usersSnap.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email || '',
        displayName: doc.data().displayName,
        role: doc.data().role === 'admin' ? 'admin' : 'user',
        createdAt: doc.data().createdAt,
      }));
      setUsers(usersData.sort((a, b) => (b.role === 'admin' ? 1 : -1)));
      setError(null);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRole = async (user: AdminUser) => {
    try {
      setUpdatingUserId(user.uid);
      const newRole = user.role === 'admin' ? 'user' : 'admin';

      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        role: newRole,
        updatedAt: Timestamp.now(),
      });

      // Update local state
      setUsers(users.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
      setSuccess(`${user.email} is now a ${newRole}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminEmail.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      // Check if user already exists
      const existingUser = users.find(u => u.email === newAdminEmail.toLowerCase());
      if (existingUser) {
        setError('This email is already registered');
        return;
      }

      // Create user in Firestore
      await setDoc(doc(db, 'users', newAdminEmail.toLowerCase()), {
        email: newAdminEmail.toLowerCase(),
        displayName: newAdminName || newAdminEmail.split('@')[0],
        role: 'admin',
        createdAt: Timestamp.now(),
        createdBy: auth.currentUser?.email,
        status: 'pending', // User needs to set password via sign-up
      });

      // Add to local list
      setUsers([...users, {
        uid: newAdminEmail.toLowerCase(),
        email: newAdminEmail.toLowerCase(),
        displayName: newAdminName,
        role: 'admin',
        createdAt: new Date().toISOString(),
      }]);

      setSuccess(`Admin user created: ${newAdminEmail}`);
      setNewAdminEmail('');
      setNewAdminName('');
      setShowCreateModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating admin:', err);
      setError('Failed to create admin user');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
          <p style={{ color: '#5E6470' }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1E2430' }}>User Management</h2>
          <p style={{ color: '#5E6470' }}>Manage admin and user roles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all"
          style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
        >
          <Plus className="w-4 h-4" />
          Create Admin
        </button>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
        >
          <AlertIcon className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}
        >
          <Check className="w-5 h-5" />
          {success}
        </motion.div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
            <p style={{ color: '#5E6470' }}>No users yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Created</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm" style={{ color: '#1E2430' }}>
                    <p className="font-medium">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                    {user.displayName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: user.role === 'admin' ? '#DBEAFE' : '#F3F4F6',
                        color: user.role === 'admin' ? '#1E40AF' : '#5E6470',
                      }}
                    >
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="w-3 h-3" /> Admin
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" /> User
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleRole(user)}
                      disabled={updateingUserId === user.uid}
                      className="px-3 py-1 text-xs font-semibold rounded transition-colors"
                      style={{
                        backgroundColor: updateingUserId === user.uid ? '#E5E7EB' : '#F3F4F6',
                        color: '#5E6470',
                        opacity: updateingUserId === user.uid ? 0.6 : 1,
                      }}
                    >
                      {updateingUserId === user.uid ? (
                        'Updating...'
                      ) : user.role === 'admin' ? (
                        'Make User'
                      ) : (
                        'Make Admin'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Create New Admin</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
                />
              </div>

              <p className="text-xs" style={{ color: '#5E6470' }}>
                The user will need to sign up using this email to complete their account setup.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                style={{ color: '#5E6470' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={isCreating || !newAdminEmail.trim()}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
                style={{
                  backgroundColor: isCreating || !newAdminEmail.trim() ? '#CBD5E0' : '#C9A35A',
                  color: '#071C3C',
                }}
              >
                {isCreating ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}
