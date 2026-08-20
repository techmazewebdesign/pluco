'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Shield, User, Edit2, X, Check, Activity, AlertTriangle, Search, Mail, Clock, UserPlus, ChevronDown } from 'lucide-react';
import { collection, getDocs, getDoc, doc, updateDoc, setDoc, Timestamp, query, deleteDoc, addDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';
import HistoricalClientTools from '@/components/admin/HistoricalClientTools';

interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  createdAt?: string;
  status?: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

const ROLE_OPTIONS = [
  { value: 'user', label: 'Client/User' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'admin', label: 'Admin' },
  { value: 'case_manager', label: 'Case Manager' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'document_reviewer', label: 'Document Reviewer' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'enquiry_handler', label: 'Enquiry Handler' },
];

// Helper function to format dates from Firestore
const formatDate = (date: unknown): string => {
  if (!date) return '—';
  try {
    // Handle Firestore Timestamp objects
    if (typeof date === 'object' && date !== null && 'toDate' in date && typeof date.toDate === 'function') {
      return (date.toDate as () => Date)().toLocaleDateString();
    }
    // Handle string dates
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    // Handle Date objects
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    // Handle seconds (Unix timestamp from Firestore)
    if (typeof date === 'number') {
      return new Date(date * 1000).toLocaleDateString();
    }
    return '—';
  } catch (err) {
    console.error('Error formatting date:', date, err);
    return '—';
  }
};

export default function ProUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'customize' | 'invite' | 'activity'>('customize');
  const [searchQuery, setSearchQuery] = useState('');

  // Invite user states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('user');

  // Edit user states
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUser | null>(null);
  const [editingRole, setEditingRole] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const auth = getAuth();

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load all users from all collections
      const allUsers: AdminUser[] = [];
      const userEmails = new Set<string>(); // Track emails to avoid duplicates

      // Load from users collection
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        usersSnap.docs.forEach(doc => {
          const userData = doc.data();
          const email = userData.email || doc.id;
          if (!userEmails.has(email)) {
            userEmails.add(email);
            allUsers.push({
              uid: userData.uid || doc.id,
              email: email,
              displayName: userData.displayName || userData.name,
              role: userData.role || 'user',
              createdAt: userData.createdAt,
              status: userData.status || 'pending',
            });
          }
        });
      } catch (err) {
        console.error('Error loading users:', err);
      }

      // Load from agents collection
      try {
        const agentsSnap = await getDocs(collection(db, 'agents'));
        agentsSnap.docs.forEach(doc => {
          const agentData = doc.data();
          const email = agentData.email || doc.id;
          if (!userEmails.has(email)) {
            userEmails.add(email);
            allUsers.push({
              uid: agentData.uid || doc.id,
              email: email,
              displayName: agentData.name || agentData.displayName,
              role: agentData.role || 'consultant',
              createdAt: agentData.createdAt,
              status: agentData.status || 'active',
            });
          }
        });
      } catch (err) {
        console.error('Error loading agents:', err);
      }

      // Load from clients collection
      try {
        const clientsSnap = await getDocs(collection(db, 'clients'));
        clientsSnap.docs.forEach(doc => {
          const clientData = doc.data();
          const email = clientData.email || clientData.emailAddress || doc.id;
          if (!userEmails.has(email)) {
            userEmails.add(email);
            allUsers.push({
              uid: clientData.uid || doc.id,
              email: email,
              displayName: clientData.displayName || clientData.fullName || clientData.firstName || clientData.name,
              role: 'client',
              createdAt: clientData.createdAt || clientData.registeredAt,
              status: clientData.status || 'active',
            });
          }
        });
      } catch (err) {
        console.error('Error loading clients:', err);
      }

      setUsers(allUsers.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }));

      // Load activities
      try {
        const activitiesSnap = await getDocs(
          query(collection(db, 'user_activity'), orderBy('timestamp', 'desc'))
        );
        const activitiesData: UserActivity[] = activitiesSnap.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          action: doc.data().action,
          details: doc.data().details,
          performedBy: doc.data().performedBy,
          timestamp: doc.data().timestamp,
        }));
        setActivities(activitiesData);
      } catch (err) {
        console.error('Error loading activities:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

  const handleInviteUser = async () => {
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

      const userEmail = newUserEmail.toLowerCase();
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
        status: 'pending',
      }, { merge: true });

      // Send invitation email and report the real delivery result.
      const idToken = await auth.currentUser?.getIdToken();
      const invitationResponse = await fetch('/api/auth/send-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
          body: JSON.stringify({
            email: userEmail,
            name: newUserName || userEmail.split('@')[0],
            role: newUserRole,
            invitedBy: auth.currentUser?.email || 'admin',
          }),
        });
      const invitationResult = await invitationResponse.json().catch(() => null);
      if (!invitationResponse.ok || invitationResult?.success !== true) {
        throw new Error(invitationResult?.error || invitationResult?.message || 'The user record was saved, but the invitation email was not delivered.');
      }

      // Log activity
      await addDoc(collection(db, 'user_activity'), {
        userId: userEmail,
        action: 'user_invited',
        details: `${newUserRole} user invited: ${userEmail}`,
        performedBy: auth.currentUser?.email || 'admin',
        timestamp: new Date().toISOString(),
      });

      setSuccess(`${newUserRole} user invited to ${newUserEmail}`);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('user');
      setShowInviteModal(false);
      setTimeout(() => setSuccess(null), 5000);

      await loadAllData();
    } catch (err) {
      console.error('Error inviting user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to invite user';
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUserForEdit || !editingRole) {
      setError('Please select a role');
      return;
    }

    if (editingRole === selectedUserForEdit.role) {
      setError('Select a different role');
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      const userEmail = selectedUserForEdit.email;
      const isAgent = editingRole !== 'user' && editingRole !== 'client';
      const newCollectionName = isAgent ? 'agents' : 'users';
      const oldCollectionName = selectedUserForEdit.role !== 'user' && selectedUserForEdit.role !== 'client' ? 'agents' : 'users';

      // If moving between collections, copy data and delete old
      if (oldCollectionName !== newCollectionName) {
        // Get existing data from old location
        const oldRef = doc(db, oldCollectionName, userEmail);
        const oldSnap = await getDoc(oldRef);

        if (oldSnap.exists()) {
          const userData = oldSnap.data();
          const newStatus = isAgent ? 'active' : 'pending';

          // Create in new collection with updated role and status
          const newData = {
            ...userData,
            role: editingRole,
            active: editingRole !== 'user',
            status: newStatus, // Set appropriate status for the new collection
            updatedAt: new Date().toISOString(),
            updatedBy: auth.currentUser?.email,
          };

          await setDoc(doc(db, newCollectionName, userEmail), newData);

          // Delete from old collection
          try {
            await deleteDoc(oldRef);
            console.log(`✓ Deleted from ${oldCollectionName}`);
          } catch (deleteErr) {
            console.error(`✗ Failed to delete from ${oldCollectionName}:`, deleteErr);
            // Don't throw - continue even if delete fails
          }

          console.log(`✓ User moved from ${oldCollectionName} to ${newCollectionName} with role ${editingRole} and status ${newStatus}`);
        } else {
          throw new Error(`User not found in ${oldCollectionName} collection`);
        }
      } else {
        // Same collection, just update role and status
        const newStatus = isAgent ? 'active' : 'pending';
        const userRef = doc(db, newCollectionName, userEmail);

        await updateDoc(userRef, {
          role: editingRole,
          active: editingRole !== 'user',
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: auth.currentUser?.email,
        });

        console.log(`✓ Role updated in ${newCollectionName} to ${editingRole} with status ${newStatus}`);
      }

      // Log activity
      await addDoc(collection(db, 'user_activity'), {
        userId: userEmail,
        action: 'role_changed',
        details: `User role changed from ${selectedUserForEdit.role} to ${editingRole}`,
        performedBy: auth.currentUser?.email || 'admin',
        timestamp: new Date().toISOString(),
      });

      setSuccess(`User role updated to ${editingRole}`);
      setShowEditModal(false);
      setSelectedUserForEdit(null);
      setEditingRole('');
      setTimeout(() => setSuccess(null), 5000);

      await loadAllData();
    } catch (err) {
      console.error('Error updating user role:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredActivities = activities.filter(activity =>
    activity.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#071C3C' }}>
            User Management
          </h1>
          <p style={{ color: '#5E6470' }}>
            {users.length} total users • {activities.length} activity records
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <HistoricalClientTools onComplete={loadAllData} />
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-all hover:brightness-110"
            style={{ backgroundColor: '#C9A35A' }}
          >
            <Plus className="w-4 h-4" />
            Invite User
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200"
        >
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="font-semibold text-green-900 text-sm">{success}</p>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('customize')}
          className="px-4 py-3 font-medium text-sm transition-colors"
          style={{
            borderBottom: activeTab === 'customize' ? '2px solid #C9A35A' : 'none',
            color: activeTab === 'customize' ? '#C9A35A' : '#5E6470',
          }}
        >
          <Edit2 className="w-4 h-4 inline-block mr-2" />
          Customize Users ({filteredUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('invite')}
          className="px-4 py-3 font-medium text-sm transition-colors"
          style={{
            borderBottom: activeTab === 'invite' ? '2px solid #C9A35A' : 'none',
            color: activeTab === 'invite' ? '#C9A35A' : '#5E6470',
          }}
        >
          <UserPlus className="w-4 h-4 inline-block mr-2" />
          Invite New User
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className="px-4 py-3 font-medium text-sm transition-colors"
          style={{
            borderBottom: activeTab === 'activity' ? '2px solid #C9A35A' : 'none',
            color: activeTab === 'activity' ? '#C9A35A' : '#5E6470',
          }}
        >
          <Activity className="w-4 h-4 inline-block mr-2" />
          History ({filteredActivities.length})
        </button>
      </div>

      {/* Customize Users Tab */}
      {activeTab === 'customize' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p style={{ color: '#5E6470' }}>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#1E2430' }}>Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#1E2430' }}>Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#1E2430' }}>Current Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#1E2430' }}>Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#1E2430' }}>Created</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold" style={{ color: '#1E2430' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} style={{ borderBottom: '1px solid #E2E8F0' }} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium" style={{ color: '#1E2430' }}>{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {user.displayName || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: user.role === 'admin' ? '#FEE2E2' : '#EFF6FF',
                            color: user.role === 'admin' ? '#991B1B' : '#1E40AF',
                          }}
                        >
                          {user.role.replace(/_/g, ' ').charAt(0).toUpperCase() + user.role.slice(1).replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: user.status === 'active' ? '#DCFCE7' : '#FEF3C7',
                            color: user.status === 'active' ? '#166534' : '#92400E',
                          }}
                        >
                          {user.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedUserForEdit(user);
                            setEditingRole(user.role);
                            setShowEditModal(true);
                          }}
                          className="px-3 py-1 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110"
                          style={{ backgroundColor: '#C9A35A' }}
                        >
                          <Edit2 className="w-4 h-4 inline-block mr-1" />
                          Change Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Invite User Tab */}
      {activeTab === 'invite' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold mb-6" style={{ color: '#071C3C' }}>
              Invite New User
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  Select Role *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                >
                  {ROLE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleInviteUser}
                  disabled={isCreating}
                  className="w-full px-6 py-3 rounded-lg text-white font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: '#C9A35A' }}
                >
                  {isCreating ? 'Sending Invitation...' : 'Send Invitation Email'}
                </button>
              </div>

              <p className="text-xs mt-4" style={{ color: '#5E6470' }}>
                An invitation email will be sent to the user with a link to complete their signup and account creation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p style={{ color: '#5E6470' }}>No activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: activity.action === 'role_changed' ? '#DCE7F1' : '#FEF3C7'
                        }}
                      >
                        {activity.action === 'role_changed' ? (
                          <Shield className="w-4 h-4" style={{ color: '#1E40AF' }} />
                        ) : (
                          <UserPlus className="w-4 h-4" style={{ color: '#92400E' }} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#1E2430' }}>
                          {activity.action === 'role_changed' ? 'Role Changed' : activity.action === 'user_created' ? 'User Created' : 'User Invited'}
                        </p>
                        <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
                          {activity.details}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
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

      {/* Edit Role Modal */}
      {showEditModal && selectedUserForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#071C3C' }}>
                Change User Role
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUserForEdit(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#5E6470' }}>User Email</p>
                <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>{selectedUserForEdit.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#5E6470' }}>Current Role</p>
                <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>
                  {selectedUserForEdit.role.replace(/_/g, ' ').charAt(0).toUpperCase() + selectedUserForEdit.role.slice(1).replace(/_/g, ' ')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  New Role
                </label>
                <div className="relative">
                  <select
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A] appearance-none"
                  >
                    {ROLE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUserForEdit(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#5E6470' }}
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: '#C9A35A' }}
              >
                {isUpdating ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#071C3C' }}>
                Invite New User
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Full name (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  Role
                </label>
                <div className="relative">
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A] appearance-none"
                  >
                    {ROLE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#5E6470' }}
              >
                Cancel
              </button>
              <button
                onClick={handleInviteUser}
                disabled={isCreating}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: '#C9A35A' }}
              >
                {isCreating ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
