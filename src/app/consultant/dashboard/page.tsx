'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LogOut, Calendar, Bell, Settings, Home, BookOpen, User, Loader2, AlertCircle
} from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import RoleBadge from '@/components/shared/RoleBadge';

interface ConsultationBooking {
  id: string;
  firstName?: string;
  lastName?: string;
  clientName: string;
  clientEmail: string;
  service?: string;
  title?: string;
  status: 'pending' | 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  preferredDate?: string;
  preferredTime?: string;
  scheduledAt?: string;
  duration?: number;
  urgency?: string;
  preferredContactMethod?: string;
}

interface ConsultantData {
  uid: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
  profileComplete: boolean;
  phone?: string;
  personalEmail?: string;
}

export default function ConsultantDashboard() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const [consultant, setConsultant] = useState<ConsultantData | null>(null);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load consultant data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Load consultant profile - check by both UID and email
        let consultantDoc = await getDoc(doc(db, 'agents', user.uid));

        // If not found by UID, try by email
        if (!consultantDoc.exists() && user.email) {
          consultantDoc = await getDoc(doc(db, 'agents', user.email.toLowerCase()));
        }

        if (!consultantDoc.exists()) {
          setError('Consultant profile not found');
          return;
        }

        const data = consultantDoc.data();

        // Check if profile is complete
        if (!data.profileComplete) {
          router.push('/consultant/profile-setup');
          return;
        }

        setConsultant({
          uid: user.uid,
          name: data.name || user.displayName || 'Consultant',
          email: user.email || '',
          role: data.role,
          photo: data.photo,
          profileComplete: data.profileComplete,
          phone: data.phone,
          personalEmail: data.personalEmail,
        });

        // Load bookings - from both consultation_bookings and enquiry bookings
        // Query by consultantId (for enquiries) and consultantUid (for consultation bookings)
        const [bookingsSnap1, bookingsSnap2] = await Promise.all([
          getDocs(
            query(collection(db, 'enquiries'),
              where('consultantId', '==', user.uid),
              where('status', 'in', ['assigned', 'confirmed', 'completed'])
            )
          ),
          getDocs(
            query(collection(db, 'consultation_bookings'),
              where('consultantUid', '==', user.uid)
            )
          )
        ]);

        const enquiryBookings = bookingsSnap1.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            firstName: data.firstName,
            lastName: data.lastName,
            clientName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Client',
            clientEmail: data.email,
            service: data.service,
            status: data.status || 'assigned',
            preferredDate: data.preferredDate,
            preferredTime: data.preferredTime,
            urgency: data.urgency,
            preferredContactMethod: data.preferredContactMethod,
          } as ConsultationBooking;
        });

        const consultationBookings = bookingsSnap2.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          clientName: doc.data().clientName || 'Client',
          clientEmail: doc.data().clientEmail || '',
          status: doc.data().status || 'pending',
          scheduledAt: doc.data().scheduledAt,
          duration: doc.data().duration,
        } as ConsultationBooking));

        const allBookings = [...enquiryBookings, ...consultationBookings]
          .sort((a, b) => {
            const dateA = new Date(a.preferredDate || a.scheduledAt || 0).getTime();
            const dateB = new Date(b.preferredDate || b.scheduledAt || 0).getTime();
            return dateA - dateB;
          });

        setBookings(allBookings);

        // Load unread notifications count
        const notificationsSnap = await getDocs(
          query(
            collection(db, 'notifications'),
            where('recipientUid', '==', user.uid),
            where('read', '==', false)
          )
        );
        setUnreadNotifications(notificationsSnap.docs.length);
      } catch (e) {
        console.error('Error loading consultant data:', e);
        setError('Failed to load consultant data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const upcomingBookings = bookings
    .filter(b => {
      const bookingDate = new Date(b.preferredDate || b.scheduledAt || 0);
      return bookingDate > new Date() && b.status !== 'cancelled';
    })
    .slice(0, 3);

  const totalBookings = bookings.filter(b => b.status === 'assigned' || b.status === 'confirmed' || b.status === 'completed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  if (error && !consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E2430' }}>Error</h1>
          <p className="text-sm mb-6" style={{ color: '#5E6470' }}>{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 rounded-lg font-semibold"
            style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!consultant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {consultant.photo && (
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  <img src={consultant.photo} alt={consultant.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="font-bold" style={{ color: '#071C3C' }}>Consultant Dashboard</h1>
                <p className="text-xs" style={{ color: '#5E6470' }}>{consultant.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <RoleBadge role="consultant" email={consultant.email} size="sm" />
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{totalBookings}</p>
              </div>
              <Calendar className="w-8 h-8" style={{ color: '#C9A35A' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{completedBookings}</p>
              </div>
              <BookOpen className="w-8 h-8" style={{ color: '#10B981' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Notifications</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{unreadNotifications}</p>
              </div>
              <Bell className="w-8 h-8" style={{ color: '#F59E0B' }} />
            </div>
          </motion.div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Upcoming Bookings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>Upcoming Consultations</h2>
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming consultations</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map(booking => {
                  const bookingDate = booking.preferredDate || booking.scheduledAt;
                  const bookingTime = booking.preferredTime || '';
                  return (
                    <div key={booking.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-semibold text-sm" style={{ color: '#071C3C' }}>{booking.clientName}</p>
                      {booking.service && <p className="text-xs text-gray-600 mt-1">Service: {booking.service}</p>}
                      {booking.title && <p className="text-xs text-gray-600 mt-1">{booking.title}</p>}
                      {bookingDate && (
                        <p className="text-xs text-gray-600 mt-1">
                          📅 {new Date(bookingDate).toLocaleDateString()}
                          {bookingTime && ` at ${bookingTime}`}
                        </p>
                      )}
                      {booking.urgency && <p className="text-xs text-gray-600 mt-1">Urgency: {booking.urgency}</p>}
                      {booking.duration && <p className="text-xs text-gray-600 mt-1">⏱️ {booking.duration} minutes</p>}
                      <p className="text-xs mt-1 px-2 py-0.5 rounded inline-block"
                        style={{
                          backgroundColor: booking.status === 'assigned' ? '#FEF3C7' : booking.status === 'confirmed' ? '#DCFCE7' : '#DBEAFE',
                          color: booking.status === 'assigned' ? '#92400E' : booking.status === 'confirmed' ? '#15803D' : '#1E40AF'
                        }}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <Link href="/consultant/dashboard/bookings"
              className="block text-center mt-4 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              View All Bookings
            </Link>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/consultant/dashboard/bookings"
                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                <Calendar className="w-5 h-5" style={{ color: '#3B82F6' }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#071C3C' }}>Manage Bookings</p>
                  <p className="text-xs text-gray-600">Create meet links, cancel appointments</p>
                </div>
              </Link>

              <Link href="/consultant/dashboard/notifications"
                className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                <Bell className="w-5 h-5" style={{ color: '#10B981' }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#071C3C' }}>Notifications</p>
                  <p className="text-xs text-gray-600">{unreadNotifications} unread</p>
                </div>
              </Link>

              <Link href="/consultant/profile-setup"
                className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <User className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#071C3C' }}>Update Profile</p>
                  <p className="text-xs text-gray-600">Edit professional information</p>
                </div>
              </Link>

              <Link href="/consultants"
                className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
                <Home className="w-5 h-5" style={{ color: '#D97706' }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#071C3C' }}>View Your Profile</p>
                  <p className="text-xs text-gray-600">See how clients see you</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold" style={{ color: '#071C3C' }}>{consultant.email}</p>
            </div>
            {consultant.personalEmail && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Personal Email</p>
                <p className="font-semibold" style={{ color: '#071C3C' }}>{consultant.personalEmail}</p>
              </div>
            )}
            {consultant.phone && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-semibold" style={{ color: '#071C3C' }}>{consultant.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Profile Status</p>
              <p className="font-semibold text-green-600">✅ Complete</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
