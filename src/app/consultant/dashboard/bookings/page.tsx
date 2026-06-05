'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Calendar, Clock, Mail, Video, Trash2, Settings, Loader2, AlertCircle,
  Check, X, ChevronDown, Phone, Copy, ArrowLeft
} from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import RoleBadge from '@/components/shared/RoleBadge';

interface ConsultationBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  scheduledAt: string;
  duration: number;
  meetingPlatform: 'google_meet' | 'discord' | 'zoom' | 'teams' | 'other';
  meetingLink?: string;
  meetingLinkCreatedAt?: string;
}

export default function ConsultantBookingsPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [creatingMeetLinkId, setCreatingMeetLinkId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const bookingsSnap = await getDocs(
          query(collection(db, 'consultation_bookings'), where('consultantUid', '==', user.uid))
        );

        const bookingsList = bookingsSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as ConsultationBooking))
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        setBookings(bookingsList);
      } catch (e) {
        console.error('Error loading bookings:', e);
        setError('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateMeetLink = async (booking: ConsultationBooking) => {
    if (booking.meetingLink) {
      alert('This booking already has a meeting link');
      return;
    }

    setCreatingMeetLinkId(booking.id);
    try {
      const response = await fetch('/api/bookings/create-meet-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          clientEmail: booking.clientEmail,
          clientName: booking.clientName,
          consultantEmail: user?.email,
          consultantName: user?.displayName,
          consultantUid: user?.uid,
          scheduledAt: booking.scheduledAt,
          title: booking.title
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookings(bookings.map(b =>
          b.id === booking.id
            ? { ...b, meetingLink: data.meetLink, meetingLinkCreatedAt: new Date().toISOString() }
            : b
        ));
        alert('Google Meet link created and sent to client!');
      } else {
        alert('Failed to create meeting link: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating meet link:', error);
      alert('Failed to create meeting link');
    } finally {
      setCreatingMeetLinkId(null);
    }
  };

  const handleCancelBooking = async (booking: ConsultationBooking) => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setCancellingId(booking.id);
    try {
      const response = await fetch('/api/bookings/update-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          action: 'cancel',
          reason: cancelReason,
          performedBy: 'consultant',
          consultantEmail: user?.email,
          consultantName: user?.displayName,
          consultantUid: user?.uid,
          clientEmail: booking.clientEmail,
          clientName: booking.clientName,
          clientUid: booking.clientEmail // Note: clientUid might not be available, using email
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookings(bookings.map(b =>
          b.id === booking.id ? { ...b, status: 'cancelled' } : b
        ));
        setCancellingId(null);
        setCancelReason('');
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCopyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Meeting link copied to clipboard!');
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FEF3C7';
      case 'confirmed':
        return '#DCFCE7';
      case 'completed':
        return '#E0E7FF';
      case 'cancelled':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#92400E';
      case 'confirmed':
        return '#15803D';
      case 'completed':
        return '#3730A3';
      case 'cancelled':
        return '#991B1B';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6" style={{ color: '#C9A35A' }} />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#071C3C' }}>Manage Bookings</h1>
              <p className="text-xs" style={{ color: '#5E6470' }}>View and manage your consultations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RoleBadge role="consultant" email={user?.email} size="sm" />
            <Link href="/consultant/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-2">
          {(['all', 'pending', 'confirmed', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
              style={{
                backgroundColor: filterStatus === status ? '#C9A35A' : '#F3F4F6',
                color: filterStatus === status ? '#071C3C' : '#5E6470'
              }}
            >
              {status}
            </button>
          ))}
        </motion.div>

        {error ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <p style={{ color: '#5E6470' }}>{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} strokeWidth={1} />
            <p className="text-lg font-semibold" style={{ color: '#1E2430' }}>
              No bookings found
            </p>
            <p style={{ color: '#5E6470' }} className="text-sm mt-1">
              No consultations match the selected filter
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Main Content */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold" style={{ color: '#071C3C' }}>
                          {booking.title}
                        </h3>
                        <span className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
                          style={{
                            backgroundColor: getStatusColor(booking.status),
                            color: getStatusTextColor(booking.status)
                          }}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2" style={{ color: '#5E6470' }}>
                          <Phone className="w-4 h-4" />
                          {booking.clientName}
                        </div>
                        <div className="flex items-center gap-2" style={{ color: '#5E6470' }}>
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2" style={{ color: '#5E6470' }}>
                          <Clock className="w-4 h-4" />
                          {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({booking.duration} min)
                        </div>
                      </div>
                    </div>

                    <ChevronDown
                      className="w-5 h-5 transition-transform"
                      style={{
                        color: '#5E6470',
                        transform: expandedBookingId === booking.id ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedBookingId === booking.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 p-4 space-y-4"
                      style={{ backgroundColor: '#F9FAFB' }}
                    >
                      {/* Client Info */}
                      <div>
                        <p className="text-sm font-semibold mb-2" style={{ color: '#071C3C' }}>Client Information</p>
                        <div className="space-y-1 text-sm" style={{ color: '#5E6470' }}>
                          <p><strong>Name:</strong> {booking.clientName}</p>
                          <p><strong>Email:</strong> {booking.clientEmail}</p>
                        </div>
                      </div>

                      {/* Description */}
                      {booking.description && (
                        <div>
                          <p className="text-sm font-semibold mb-2" style={{ color: '#071C3C' }}>Description</p>
                          <p className="text-sm" style={{ color: '#5E6470' }}>{booking.description}</p>
                        </div>
                      )}

                      {/* Meeting Link */}
                      {booking.meetingLink && (
                        <div>
                          <p className="text-sm font-semibold mb-2" style={{ color: '#071C3C' }}>Google Meet Link</p>
                          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                            <Video className="w-4 h-4" style={{ color: '#C9A35A' }} />
                            <code className="text-xs flex-1 break-all" style={{ color: '#5E6470' }}>
                              {booking.meetingLink}
                            </code>
                            <button
                              onClick={() => handleCopyMeetLink(booking.meetingLink!)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Copy className="w-4 h-4" style={{ color: '#5E6470' }} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col gap-2 pt-2">
                        {!booking.meetingLink && booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCreateMeetLink(booking)}
                            disabled={creatingMeetLinkId === booking.id}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                            style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                          >
                            {creatingMeetLinkId === booking.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Video className="w-4 h-4" />
                                Create & Send Google Meet Link
                              </>
                            )}
                          </button>
                        )}

                        {booking.status !== 'cancelled' && (
                          <>
                            {cancellingId !== booking.id ? (
                              <button
                                onClick={() => setCancellingId(booking.id)}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110"
                                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                              >
                                <X className="w-4 h-4" />
                                Cancel Booking
                              </button>
                            ) : (
                              <div className="space-y-2 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                                <textarea
                                  placeholder="Enter cancellation reason..."
                                  value={cancelReason}
                                  onChange={(e) => setCancelReason(e.target.value)}
                                  className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleCancelBooking(booking)}
                                    disabled={!cancelReason.trim() || cancellingId === booking.id}
                                    className="flex-1 px-3 py-1 rounded text-sm font-semibold transition-all"
                                    style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                                  >
                                    Confirm Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCancellingId(null);
                                      setCancelReason('');
                                    }}
                                    className="flex-1 px-3 py-1 rounded text-sm font-semibold transition-all"
                                    style={{ backgroundColor: '#E5E7EB', color: '#6B7280' }}
                                  >
                                    Keep It
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
