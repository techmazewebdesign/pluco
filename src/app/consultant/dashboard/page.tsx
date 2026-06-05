'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LogOut, Calendar, Clock, Users, Star, MessageSquare, Settings, Loader2,
  CheckCircle, AlertCircle, Plus, Eye, BarChart3
} from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc, updateDoc, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

interface ConsultationBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  scheduledAt: string;
  duration: number;
  meetingPlatform: 'google_meet' | 'discord' | 'zoom' | 'teams' | 'other';
  meetingLink?: string;
}

interface Consultant {
  uid: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  averageRating?: number;
  totalConsultations?: number;
  photo?: string;
}

export default function ConsultantDashboard() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [stats, setStats] = useState({
    upcomingCount: 0,
    todayCount: 0,
    totalCompleted: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if consultant
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

        // Load consultant profile
        const consultantDoc = await getDoc(doc(db, 'agents', user.uid));
        if (consultantDoc.exists() && consultantDoc.data().role === 'consultant') {
          setConsultant({
            uid: user.uid,
            name: consultantDoc.data().name || user.displayName || '',
            email: user.email || '',
            role: consultantDoc.data().role,
            active: consultantDoc.data().active,
            averageRating: consultantDoc.data().averageRating,
            totalConsultations: consultantDoc.data().totalConsultations || 0,
            photo: consultantDoc.data().photo || user.photoURL || ''
          } as Consultant);
        } else {
          setError('You do not have access to the consultant dashboard. Please contact your administrator.');
          return;
        }

        // Load bookings
        const bookingsSnap = await getDocs(
          query(collection(db, 'consultation_bookings'), where('consultantUid', '==', user.uid))
        );
        const bookingsList = bookingsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ConsultationBooking)).sort((a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        );

        setBookings(bookingsList);

        // Calculate stats
        const now = new Date().toISOString();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const upcomingCount = bookingsList.filter(b => b.status === 'confirmed' && b.scheduledAt > now).length;
        const todayCount = bookingsList.filter(b =>
          new Date(b.scheduledAt) >= todayStart && new Date(b.scheduledAt) <= todayEnd && b.status !== 'cancelled'
        ).length;
        const completedCount = bookingsList.filter(b => b.status === 'completed').length;

        setStats({
          upcomingCount,
          todayCount,
          totalCompleted: completedCount,
          averageRating: consultant?.averageRating || 0
        });
      } catch (e) {
        console.error('Error loading data:', e);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, consultant?.uid]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'consultation_bookings', bookingId), {
        status: 'confirmed',
        updatedAt: new Date().toISOString()
      });

      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
    } catch (e) {
      console.error('Error confirming booking:', e);
      alert('Failed to confirm booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>Loading consultant dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !consultant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#1E2430' }}>Access Denied</h1>
          <p className="text-sm mt-2" style={{ color: '#5E6470' }}>{error}</p>
          <Link href="/login" className="inline-block mt-4 px-6 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {consultant?.photo && (
              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                <Image src={consultant.photo} alt={consultant.name} fill className="object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#071C3C' }}>Consultant Dashboard</h1>
              <p className="text-xs" style={{ color: '#5E6470' }}>{consultant?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/consultant/profile" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" style={{ color: '#5E6470' }} />
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8" style={{ color: '#C9A35A' }} />
              <p className="text-sm font-semibold" style={{ color: '#5E6470' }}>Today</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1E2430' }}>{stats.todayCount}</p>
            <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Consultations</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8" style={{ color: '#C9A35A' }} />
              <p className="text-sm font-semibold" style={{ color: '#5E6470' }}>Upcoming</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1E2430' }}>{stats.upcomingCount}</p>
            <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Confirmed bookings</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8" style={{ color: '#C9A35A' }} />
              <p className="text-sm font-semibold" style={{ color: '#5E6470' }}>Completed</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1E2430' }}>{stats.totalCompleted}</p>
            <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Total consultations</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8" style={{ color: '#C9A35A' }} />
              <p className="text-sm font-semibold" style={{ color: '#5E6470' }}>Rating</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: '#1E2430' }}>
              {consultant?.averageRating ? consultant.averageRating.toFixed(1) : 'N/A'}
            </p>
            <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Out of 5</p>
          </motion.div>
        </div>

        {/* Upcoming Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>Upcoming Consultations</h2>
            <Link href="/consultant/dashboard/bookings" className="text-xs font-semibold flex items-center gap-2"
              style={{ color: '#C9A35A' }}>
              View all <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
              <p className="text-sm" style={{ color: '#94A3B8' }}>No upcoming consultations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: '#1E2430' }}>{booking.clientName}</p>
                      <p className="text-xs" style={{ color: '#5E6470' }}>{booking.title}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full`}
                      style={{
                        backgroundColor: booking.status === 'confirmed' ? '#DCFCE7' : '#FEF3C7',
                        color: booking.status === 'confirmed' ? '#15803D' : '#92400E'
                      }}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: '#5E6470' }}>
                    <span>📅 {new Date(booking.scheduledAt).toLocaleDateString()}</span>
                    <span>🕐 {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>⏱️ {booking.duration} min</span>
                  </div>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      className="mt-3 text-xs font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all"
                      style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/consultant/dashboard/bookings"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <Calendar className="w-8 h-8 mb-3" style={{ color: '#C9A35A' }} />
            <h3 className="font-semibold mb-1" style={{ color: '#1E2430' }}>Manage Bookings</h3>
            <p className="text-xs" style={{ color: '#5E6470' }}>View and manage all your consultations</p>
          </Link>

          <Link href="/consultant/dashboard/availability"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <Clock className="w-8 h-8 mb-3" style={{ color: '#C9A35A' }} />
            <h3 className="font-semibold mb-1" style={{ color: '#1E2430' }}>Set Availability</h3>
            <p className="text-xs" style={{ color: '#5E6470' }}>Update your working hours and timezone</p>
          </Link>

          <Link href="/consultant/dashboard/reviews"
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <Star className="w-8 h-8 mb-3" style={{ color: '#C9A35A' }} />
            <h3 className="font-semibold mb-1" style={{ color: '#1E2430' }}>Reviews & Ratings</h3>
            <p className="text-xs" style={{ color: '#5E6470' }}>See what clients think about you</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
