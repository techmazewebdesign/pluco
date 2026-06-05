'use client';

import { useState, useEffect } from 'react';
import { Plus, Shield, User, Trash2, Edit2, X, Check, History, Activity, AlertTriangle } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, setDoc, Timestamp, query, where, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';

import { AgentRole, AGENT_ROLE_LABELS } from '@/lib/types';

interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  createdAt?: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

interface RoleHistory {
  id: string;
  userId: string;
  userEmail: string;
  oldRole: string;
  newRole: string;
  changedBy: string;
  timestamp: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [roleHistory, setRoleHistory] = useState<RoleHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<AdminUser | null>(null);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<AdminUser | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('user');
  const [isCreating, setIsCreating] = useState(false);
  const [updateingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'history'>('users');

  const auth = getAuth();

  // Load users, activities, and history from Firestore
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);

      // Load users
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData: AdminUser[] = usersSnap.docs.map(doc => ({
          uid: doc.id,
          email: doc.data().email || '',
          displayName: doc.data().displayName,
          role: doc.data().role || 'user',
          createdAt: doc.data().createdAt,
        }));
        setUsers(usersData.sort((a, b) => {
          const aIsAdmin = a.role === 'admin' ? 1 : 0;
          const bIsAdmin = b.role === 'admin' ? 1 : 0;
          return bIsAdmin - aIsAdmin;
        }));
      } catch (err) {
        console.error('Error loading users:', err);
        setUsers([]);
      }

      // Load activity logs
      try {
        const activitiesSnap = await getDocs(
          query(collection(db, 'user_activity'), where('deleted', '!=', true))
        );
        const activitiesData: UserActivity[] = activitiesSnap.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          action: doc.data().action,
          details: doc.data().details,
          performedBy: doc.data().performedBy,
          timestamp: doc.data().timestamp,
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(activitiesData);
      } catch (err) {
        console.error('Error loading activities:', err);
        setActivities([]);
      }

      // Load role history
      try {
        const historySnap = await getDocs(collection(db, 'role_history'));
        const historyData: RoleHistory[] = historySnap.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          userEmail: doc.data().userEmail,
          oldRole: doc.data().oldRole,
          newRole: doc.data().newRole,
          changedBy: doc.data().changedBy,
          timestamp: doc.data().timestamp,
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRoleHistory(historyData);
      } catch (err) {
        console.error('Error loading role history:', err);
        setRoleHistory([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from Firestore. Check your database connection and Firestore rules.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (user: AdminUser, newRole: string) => {
    if (user.role === newRole) return;

    try {
      setUpdatingUserId(user.uid);

      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        role: newRole,
        updatedAt: Timestamp.now(),
      });

      // Add to role history
      await addDoc(collection(db, 'role_history'), {
        userId: user.uid,
        userEmail: user.email,
        oldRole: user.role,
        newRole: newRole,
        changedBy: auth.currentUser?.email || 'unknown',
        timestamp: new Date().toISOString(),
      });

      // Add to activity log
      await addDoc(collection(db, 'user_activity'), {
        userId: user.uid,
        action: 'role_changed',
        details: `Role changed from ${user.role} to ${newRole}`,
        performedBy: auth.currentUser?.email || 'unknown',
        timestamp: new Date().toISOString(),
      });

      // Update local state
      setUsers(users.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
      setSuccess(`${user.email} is now a ${newRole}`);
      setTimeout(() => setSuccess(null), 3000);

      // Reload data
      await loadAllData();
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserForDelete) return;

    try {
      setIsDeleting(true);

      // Add to activity log
      await addDoc(collection(db, 'user_activity'), {
        userId: selectedUserForDelete.uid,
        action: 'user_deleted',
        details: `User account deleted: ${selectedUserForDelete.email}`,
        performedBy: auth.currentUser?.email || 'unknown',
        timestamp: new Date().toISOString(),
      });

      // Delete from Firestore (soft delete - mark as deleted)
      await updateDoc(doc(db, 'users', selectedUserForDelete.uid), {
        deleted: true,
        deletedAt: Timestamp.now(),
        deletedBy: auth.currentUser?.email,
      });

      // Remove from local state
      setUsers(users.filter(u => u.uid !== selectedUserForDelete.uid));
      setSuccess(`User ${selectedUserForDelete.email} has been deleted`);
      setShowDeleteModal(false);
      setSelectedUserForDelete(null);
      setTimeout(() => setSuccess(null), 3000);

      await loadAllData();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail.trim()) {
      setError('Email is required');
      return;
    }

    if (!newUserRole) {
      setError('Please select a role');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      // Check if user already exists
      const existingUser = users.find(u => u.email === newUserEmail.toLowerCase());
      if (existingUser) {
        setError('This email is already registered');
        return;
      }

      const userEmail = newUserEmail.toLowerCase();

      // Determine where to create the user (agents or users collection)
      const isAgent = newUserRole !== 'user' && newUserRole !== 'client';
      const collection_name = isAgent ? 'agents' : 'users';

      // Create user in Firestore
      await setDoc(doc(db, collection_name, userEmail), {
        email: userEmail,
        displayName: newUserName || userEmail.split('@')[0],
        name: newUserName || userEmail.split('@')[0],
        role: newUserRole,
        active: newUserRole !== 'user',
        createdAt: Timestamp.now(),
        createdBy: auth.currentUser?.email,
        status: 'pending', // User needs to set password via sign-up
      });

      // Add to activity log
      await addDoc(collection(db, 'user_activity'), {
        userId: userEmail,
        action: 'user_created',
        details: `New ${newUserRole} user created: ${userEmail}`,
        performedBy: auth.currentUser?.email || 'unknown',
        timestamp: new Date().toISOString(),
      });

      // Add to local list
      setUsers([...users, {
        uid: userEmail,
        email: userEmail,
        displayName: newUserName,
        role: newUserRole,
        createdAt: new Date().toISOString(),
      }]);

      setSuccess(`${newUserRole} user created: ${newUserEmail}`);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('user');
      setShowCreateModal(false);
      setTimeout(() => setSuccess(null), 3000);

      await loadAllData();
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      if (errorMessage.includes('permission')) {
        setError('Permission denied. Check your Firestore security rules.');
      } else {
        setError(errorMessage);
      }
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
      <div className="flex items-center justify-between mb-8">
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

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className="px-4 py-3 text-sm font-semibold border-b-2 transition-colors"
          style={{
            borderColor: activeTab === 'users' ? '#C9A35A' : 'transparent',
            color: activeTab === 'users' ? '#C9A35A' : '#5E6470',
          }}
        >
          <Shield className="w-4 h-4 inline-block mr-2" />
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className="px-4 py-3 text-sm font-semibold border-b-2 transition-colors"
          style={{
            borderColor: activeTab === 'activity' ? '#C9A35A' : 'transparent',
            color: activeTab === 'activity' ? '#C9A35A' : '#5E6470',
          }}
        >
          <Activity className="w-4 h-4 inline-block mr-2" />
          Activity Log ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className="px-4 py-3 text-sm font-semibold border-b-2 transition-colors"
          style={{
            borderColor: activeTab === 'history' ? '#C9A35A' : 'transparent',
            color: activeTab === 'history' ? '#C9A35A' : '#5E6470',
          }}
        >
          <History className="w-4 h-4 inline-block mr-2" />
          Role History ({roleHistory.length})
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

      {/* Content Based on Active Tab */}
      {activeTab === 'users' && (
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
                      ) : user.role === 'consultant' ? (
                        <>
                          <User className="w-3 h-3" /> Consultant
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" /> {user.role}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm space-y-2">
                    <div className="flex flex-col gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user, e.target.value)}
                        disabled={updateingUserId === user.uid}
                        className="px-3 py-1 text-xs font-semibold rounded border border-gray-300 transition-colors"
                        style={{
                          backgroundColor: updateingUserId === user.uid ? '#E5E7EB' : 'white',
                          color: '#5E6470',
                          opacity: updateingUserId === user.uid ? 0.6 : 1,
                          cursor: updateingUserId === user.uid ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <option value="user">Client/User</option>
                        <option value="consultant">Consultant</option>
                        <option value="admin">Admin</option>
                        <option value="case_manager">Case Manager</option>
                        <option value="customer_service">Customer Service</option>
                        <option value="document_reviewer">Document Reviewer</option>
                        <option value="compliance_officer">Compliance Officer</option>
                        <option value="enquiry_handler">Enquiry Handler</option>
                      </select>
                      <button
                        onClick={() => {
                          setSelectedUserForHistory(user);
                          setShowHistoryModal(true);
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded transition-colors"
                        style={{
                          backgroundColor: '#F3F4F6',
                          color: '#5E6470',
                        }}
                      >
                        <History className="w-3 h-3 inline-block mr-1" />
                        History
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUserForDelete(user);
                          setShowDeleteModal(true);
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded transition-colors"
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                        }}
                      >
                        <Trash2 className="w-3 h-3 inline-block mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === 'activity' && (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
            <p style={{ color: '#5E6470' }}>No activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1E2430' }}>
                      {activity.action.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
                      {activity.details}
                    </p>
                  </div>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs" style={{ color: '#5E6470' }}>
                  By: <span className="font-medium">{activity.performedBy}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Role History Tab */}
      {activeTab === 'history' && (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {roleHistory.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
            <p style={{ color: '#5E6470' }}>No role changes yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>User Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Old Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>New Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Changed By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {roleHistory.map((history) => (
                <tr key={history.id} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm" style={{ color: '#1E2430' }}>{history.userEmail}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: history.oldRole === 'admin' ? '#DBEAFE' : '#F3F4F6',
                        color: history.oldRole === 'admin' ? '#1E40AF' : '#5E6470',
                      }}
                    >
                      {history.oldRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: history.newRole === 'admin' ? '#DBEAFE' : '#F3F4F6',
                        color: history.newRole === 'admin' ? '#1E40AF' : '#5E6470',
                      }}
                    >
                      {history.newRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>{history.changedBy}</td>
                  <td className="px-6 py-4 text-sm text-xs" style={{ color: '#94A3B8' }}>
                    {new Date(history.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUserForDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: '#DC2626' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Delete User</h3>
                  <p className="text-sm" style={{ color: '#5E6470' }}>This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm mb-4" style={{ color: '#5E6470' }}>
                Are you sure you want to delete <span className="font-bold">{selectedUserForDelete.email}</span>? This will remove all their access.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUserForDelete(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                style={{ color: '#5E6470' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
                style={{
                  backgroundColor: isDeleting ? '#CBD5E0' : '#DC2626',
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedUserForHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>
                Role History: {selectedUserForHistory.email}
              </h3>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSelectedUserForHistory(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
            </div>

            <div className="p-6">
              {roleHistory.filter(h => h.userId === selectedUserForHistory.uid).length === 0 ? (
                <p className="text-center py-8" style={{ color: '#5E6470' }}>
                  No role changes for this user
                </p>
              ) : (
                <div className="space-y-4">
                  {roleHistory.filter(h => h.userId === selectedUserForHistory.uid).map((history) => (
                    <div key={history.id} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: history.oldRole === 'admin' ? '#DBEAFE' : '#F3F4F6',
                              color: history.oldRole === 'admin' ? '#1E40AF' : '#5E6470',
                            }}
                          >
                            {history.oldRole}
                          </span>
                          <span style={{ color: '#5E6470' }}>→</span>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: history.newRole === 'admin' ? '#DBEAFE' : '#F3F4F6',
                              color: history.newRole === 'admin' ? '#1E40AF' : '#5E6470',
                            }}
                          >
                            {history.newRole}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>
                          {new Date(history.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#5E6470' }}>
                        Changed by: <span className="font-medium">{history.changedBy}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Create New User</h3>
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
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  Role *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
                >
                  <option value="user">Client/User</option>
                  <option value="consultant">Consultant</option>
                  <option value="admin">Admin</option>
                  <option value="case_manager">Case Manager</option>
                  <option value="customer_service">Customer Service</option>
                  <option value="document_reviewer">Document Reviewer</option>
                  <option value="compliance_officer">Compliance Officer</option>
                  <option value="enquiry_handler">Enquiry Handler</option>
                </select>
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
                onClick={handleCreateUser}
                disabled={isCreating || !newUserEmail.trim()}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
                style={{
                  backgroundColor: isCreating || !newUserEmail.trim() ? '#CBD5E0' : '#C9A35A',
                  color: '#071C3C',
                }}
              >
                {isCreating ? 'Creating...' : 'Create User'}
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
