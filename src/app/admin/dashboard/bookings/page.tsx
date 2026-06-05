'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, AlertCircle, Loader2, CheckCircle, Clock, AlertTriangle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  urgency: string;
  preferredDate?: string;
  preferredTime?: string;
  status: 'pending' | 'assigned' | 'confirmed' | 'completed';
  consultantId?: string;
  consultantName?: string;
  preferredContactMethod?: string;
  createdAt: string;
}

interface Consultant {
  uid: string;
  name: string;
  email: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Load all enquiries
        const enquiriesSnap = await getDocs(collection(db, 'enquiries'));
        const enquiriesList = enquiriesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Enquiry));

        // Load all consultants
        const consultantsSnap = await getDocs(
          query(collection(db, 'agents'), where('role', '==', 'consultant'))
        );
        const consultantsList = consultantsSnap.docs.map(doc => ({
          uid: doc.id,
          name: doc.data().name || '',
          email: doc.data().email || '',
        } as Consultant));

        setEnquiries(enquiriesList.sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        ));
        setConsultants(consultantsList);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load bookings data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAssignConsultant = async (enquiryId: string, consultantUid: string) => {
    const consultant = consultants.find(c => c.uid === consultantUid);
    if (!consultant) return;

    try {
      setAssigningId(enquiryId);
      await updateDoc(doc(db, 'enquiries', enquiryId), {
        consultantId: consultantUid,
        consultantName: consultant.name,
        status: 'assigned',
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setEnquiries(prev => prev.map(e =>
        e.id === enquiryId
          ? { ...e, consultantId: consultantUid, consultantName: consultant.name, status: 'assigned' }
          : e
      ));
    } catch (err) {
      console.error('Error assigning consultant:', err);
      setError('Failed to assign consultant');
    } finally {
      setAssigningId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const pendingEnquiries = enquiries.filter(e => e.status === 'pending');
  const assignedEnquiries = enquiries.filter(e => e.status === 'assigned');
  const confirmedEnquiries = enquiries.filter(e => e.status === 'confirmed');

  const getUrgencyColor = (urgency: string | undefined) => {
    switch (urgency) {
      case 'Very Urgent':
        return { bg: '#FEE2E2', color: '#991B1B', icon: '🔴' };
      case 'Urgent':
        return { bg: '#FEF3C7', color: '#92400E', icon: '🟠' };
      default:
        return { bg: '#DCFCE7', color: '#15803D', icon: '🟢' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEE2E2', color: '#DC2626', icon: '⏳' };
      case 'assigned':
        return { bg: '#FEF3C7', color: '#92400E', icon: '👤' };
      case 'confirmed':
        return { bg: '#DCFCE7', color: '#15803D', icon: '✓' };
      case 'completed':
        return { bg: '#DBEAFE', color: '#1E40AF', icon: '✅' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280', icon: '❓' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: '#071C3C' }}>
              Enquiry Bookings
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
            style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg flex items-center gap-3"
            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Bookings</p>
                <p className="text-3xl font-bold" style={{ color: '#DC2626' }}>{pendingEnquiries.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8" style={{ color: '#DC2626' }} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned Bookings</p>
                <p className="text-3xl font-bold" style={{ color: '#92400E' }}>{assignedEnquiries.length}</p>
              </div>
              <Zap className="w-8 h-8" style={{ color: '#92400E' }} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmed Bookings</p>
                <p className="text-3xl font-bold" style={{ color: '#15803D' }}>{confirmedEnquiries.length}</p>
              </div>
              <CheckCircle className="w-8 h-8" style={{ color: '#15803D' }} />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          </div>
        ) : (
          <>
            {/* Pending Bookings */}
            {pendingEnquiries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>
                  Pending Bookings (Unassigned)
                </h2>
                <div className="space-y-4">
                  {pendingEnquiries.map(enquiry => {
                    const urgencyColors = getUrgencyColor(enquiry.urgency);
                    return (
                      <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#1E2430' }}>
                              {enquiry.firstName} {enquiry.lastName}
                            </p>
                            <p className="text-xs text-gray-600">{enquiry.email}</p>
                            {enquiry.phone && <p className="text-xs text-gray-600">{enquiry.phone}</p>}
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#1E2430' }}>
                              {enquiry.service}
                            </p>
                            <div className="flex gap-2">
                              <span
                                className="text-xs px-2 py-1 rounded"
                                style={{ backgroundColor: urgencyColors.bg, color: urgencyColors.color }}
                              >
                                {urgencyColors.icon} {enquiry.urgency || 'Normal'}
                              </span>
                              {enquiry.preferredContactMethod && (
                                <span className="text-xs px-2 py-1 rounded bg-blue-100" style={{ color: '#1E40AF' }}>
                                  📱 {enquiry.preferredContactMethod}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {enquiry.preferredDate && (
                          <p className="text-xs text-gray-600 mb-3">
                            📅 Preferred: {enquiry.preferredDate} {enquiry.preferredTime && `@ ${enquiry.preferredTime}`}
                          </p>
                        )}

                        {/* Consultant Assignment */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-600">Assign to:</span>
                          <select
                            onChange={e => {
                              if (e.target.value) {
                                handleAssignConsultant(enquiry.id, e.target.value);
                              }
                            }}
                            disabled={assigningId === enquiry.id}
                            className="text-xs px-2 py-1.5 border border-gray-300 rounded"
                            defaultValue=""
                          >
                            <option value="">Select consultant...</option>
                            {consultants.map(c => (
                              <option key={c.uid} value={c.uid}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          {assigningId === enquiry.id && (
                            <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#C9A35A' }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Assigned Bookings */}
            {assignedEnquiries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>
                  Assigned Bookings
                </h2>
                <div className="space-y-4">
                  {assignedEnquiries.map(enquiry => {
                    const urgencyColors = getUrgencyColor(enquiry.urgency);
                    return (
                      <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#1E2430' }}>
                              {enquiry.firstName} {enquiry.lastName}
                            </p>
                            <p className="text-xs text-gray-600">{enquiry.email}</p>
                            {enquiry.phone && <p className="text-xs text-gray-600">{enquiry.phone}</p>}
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#1E2430' }}>
                              {enquiry.service}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <span
                                className="text-xs px-2 py-1 rounded"
                                style={{ backgroundColor: urgencyColors.bg, color: urgencyColors.color }}
                              >
                                {urgencyColors.icon} {enquiry.urgency || 'Normal'}
                              </span>
                              {enquiry.consultantName && (
                                <span
                                  className="text-xs px-2 py-1 rounded"
                                  style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                                >
                                  👤 {enquiry.consultantName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {enquiry.preferredDate && (
                          <p className="text-xs text-gray-600">
                            📅 Preferred: {enquiry.preferredDate} {enquiry.preferredTime && `@ ${enquiry.preferredTime}`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Confirmed Bookings */}
            {confirmedEnquiries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>
                  Confirmed Bookings
                </h2>
                <div className="space-y-4">
                  {confirmedEnquiries.map(enquiry => {
                    const urgencyColors = getUrgencyColor(enquiry.urgency);
                    return (
                      <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#1E2430' }}>
                              {enquiry.firstName} {enquiry.lastName}
                            </p>
                            <p className="text-xs text-gray-600">{enquiry.email}</p>
                            {enquiry.phone && <p className="text-xs text-gray-600">{enquiry.phone}</p>}
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#1E2430' }}>
                              {enquiry.service}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <span
                                className="text-xs px-2 py-1 rounded"
                                style={{ backgroundColor: urgencyColors.bg, color: urgencyColors.color }}
                              >
                                {urgencyColors.icon} {enquiry.urgency || 'Normal'}
                              </span>
                              {enquiry.consultantName && (
                                <span
                                  className="text-xs px-2 py-1 rounded"
                                  style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}
                                >
                                  ✓ {enquiry.consultantName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {enquiry.preferredDate && (
                          <p className="text-xs text-gray-600">
                            📅 Scheduled: {enquiry.preferredDate} {enquiry.preferredTime && `@ ${enquiry.preferredTime}`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {enquiries.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-semibold mb-2" style={{ color: '#1E2430' }}>
                  No bookings yet
                </p>
                <p style={{ color: '#5E6470' }}>
                  Enquiry bookings will appear here when clients submit the private enquiry form.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
