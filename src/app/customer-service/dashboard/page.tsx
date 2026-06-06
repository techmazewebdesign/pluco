'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, AlertCircle, LogOut, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomerServiceProfile, SupportTicket, CustomerServiceActivity } from '@/lib/types/customerService';

export default function CustomerServiceDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerServiceProfile | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activities, setActivities] = useState<CustomerServiceActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load customer service profile and check if complete
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Check if profile exists and is complete
        const profileRef = doc(db, 'customerServiceProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          setProfileIncomplete(true);
          router.push('/customer-service/profile');
          return;
        }

        const profileData = profileSnap.data() as CustomerServiceProfile;

        if (!profileData.profileCompleted) {
          setProfileIncomplete(true);
          router.push('/customer-service/profile');
          return;
        }

        setProfile(profileData);

        // Load assigned tickets
        const ticketsQuery = query(
          collection(db, 'supportTickets'),
          where('assignedTo', '==', user.uid),
          where('status', '!=', 'resolved')
        );
        const ticketsSnap = await getDocs(ticketsQuery);
        const ticketsList: SupportTicket[] = [];
        ticketsSnap.forEach(doc => {
          ticketsList.push(doc.data() as SupportTicket);
        });
        setTickets(ticketsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

        // Load recent activities
        const activitiesQuery = query(
          collection(db, 'customerServiceActivity'),
          where('userId', '==', user.uid)
        );
        const activitiesSnap = await getDocs(activitiesQuery);
        const activitiesList: CustomerServiceActivity[] = [];
        activitiesSnap.forEach(doc => {
          activitiesList.push(doc.data() as CustomerServiceActivity);
        });
        setActivities(activitiesList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10));
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  if (!user || profileIncomplete) {
    return null;
  }

  const urgentTickets = tickets.filter(t => t.priority === 'urgent');
  const highPriorityTickets = tickets.filter(t => t.priority === 'high');
  const totalOpen = tickets.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold" style={{ color: '#071C3C' }}>
              Customer Service Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
              Welcome, {profile?.fullName} • {profile?.roleTitle}
            </p>
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total Open Tickets</p>
            <p className="text-3xl font-bold" style={{ color: '#C9A35A' }}>{totalOpen}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Urgent</p>
            <p className="text-3xl font-bold" style={{ color: '#DC2626' }}>{urgentTickets.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">High Priority</p>
            <p className="text-3xl font-bold" style={{ color: '#F59E0B' }}>{highPriorityTickets.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Department</p>
            <p className="text-xl font-bold" style={{ color: '#071C3C' }}>{profile?.department.toUpperCase()}</p>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg flex items-center gap-3"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tickets */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#1E2430' }}>
                Open Support Tickets
              </h2>

              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500" style={{ color: '#5E6470' }}>No open tickets assigned to you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold" style={{ color: '#1E2430' }}>{ticket.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                            ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {ticket.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-4 text-xs text-gray-600">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>Status: {ticket.status.replace(/_/g, ' ').toUpperCase()}</span>
                        {ticket.tags && ticket.tags.length > 0 && (
                          <div className="flex gap-2">
                            {ticket.tags.map(tag => (
                              <span key={tag} className="bg-gray-100 px-2 py-1 rounded">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Profile & Activities */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold mb-4" style={{ color: '#1E2430' }}>Your Profile</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="font-semibold" style={{ color: '#1E2430' }}>{profile?.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold" style={{ color: '#1E2430' }}>{profile?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold" style={{ color: '#1E2430' }}>{profile?.phoneWhatsApp}</p>
                </div>
                <div>
                  <p className="text-gray-600">Experience Level</p>
                  <p className="font-semibold" style={{ color: '#1E2430' }}>{profile?.experienceLevel.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Department</p>
                  <p className="font-semibold" style={{ color: '#1E2430' }}>{profile?.department.replace(/-/g, ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    profile?.availabilityStatus === 'available' ? 'bg-green-100 text-green-700' :
                    profile?.availabilityStatus === 'busy' ? 'bg-amber-100 text-amber-700' :
                    profile?.availabilityStatus === 'away' ? 'bg-gray-100 text-gray-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {profile?.availabilityStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold mb-4" style={{ color: '#1E2430' }}>Recent Activity</h3>
              {activities.length === 0 ? (
                <p className="text-sm text-gray-600">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {activities.map(activity => (
                    <motion.div key={activity.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs pb-3 border-b border-gray-200 last:border-b-0">
                      <p className="font-semibold" style={{ color: '#1E2430' }}>{activity.description}</p>
                      <p className="text-gray-600 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
