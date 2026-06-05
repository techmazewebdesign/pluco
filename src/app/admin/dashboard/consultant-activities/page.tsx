'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LogOut, Activity, Filter, Download, Loader2, AlertCircle, ArrowLeft, Calendar, Users
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import RoleBadge from '@/components/shared/RoleBadge';

interface ConsultantActivity {
  id: string;
  consultantUid: string;
  consultantEmail: string;
  consultantName: string;
  bookingId?: string;
  clientName?: string;
  clientEmail?: string;
  actionType: 'meeting_created' | 'meeting_sent' | 'meeting_cancelled' | 'meeting_rescheduled' | 'profile_updated' | 'availability_set';
  details: any;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function ConsultantActivitiesPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const [activities, setActivities] = useState<ConsultantActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterConsultant, setFilterConsultant] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7days'); // 7days, 30days, all
  const [consultants, setConsultants] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load activities
  useEffect(() => {
    if (!user) return;

    const loadActivities = async () => {
      try {
        setIsLoading(true);
        setError('');

        let startDate = new Date();
        if (dateRange === '7days') {
          startDate.setDate(startDate.getDate() - 7);
        } else if (dateRange === '30days') {
          startDate.setDate(startDate.getDate() - 30);
        }

        let q = query(
          collection(db, 'consultant_activities'),
          orderBy('createdAt', 'desc')
        );

        const activitiesSnap = await getDocs(q);

        let activitiesList = activitiesSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
          } as ConsultantActivity))
          .filter(a => {
            const actDate = new Date(a.createdAt);
            return dateRange === 'all' || actDate >= startDate;
          });

        // Apply filters
        if (filterConsultant) {
          activitiesList = activitiesList.filter(a => a.consultantUid === filterConsultant);
        }
        if (filterAction) {
          activitiesList = activitiesList.filter(a => a.actionType === filterAction);
        }

        setActivities(activitiesList);

        // Get unique consultants
        const consultantsMap = new Map<string, string>();
        activitiesList.forEach(a => {
          if (!consultantsMap.has(a.consultantUid)) {
            consultantsMap.set(a.consultantUid, a.consultantName);
          }
        });
        setConsultants(consultantsMap);
      } catch (e) {
        console.error('Error loading activities:', e);
        setError('Failed to load activities');
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [user, dateRange, filterConsultant, filterAction]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'meeting_sent':
        return '#3B82F6';
      case 'meeting_cancelled':
        return '#DC2626';
      case 'meeting_rescheduled':
        return '#F59E0B';
      case 'meeting_created':
        return '#10B981';
      case 'profile_updated':
        return '#8B5CF6';
      case 'availability_set':
        return '#6366F1';
      default:
        return '#6B7280';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'meeting_sent':
        return '📧 Meeting Sent';
      case 'meeting_cancelled':
        return '❌ Meeting Cancelled';
      case 'meeting_rescheduled':
        return '🔄 Meeting Rescheduled';
      case 'meeting_created':
        return '✅ Meeting Created';
      case 'profile_updated':
        return '👤 Profile Updated';
      case 'availability_set':
        return '📅 Availability Set';
      default:
        return action;
    }
  };

  const handleExport = () => {
    const csv = [
      ['Consultant', 'Email', 'Action', 'Client', 'Date', 'Details'],
      ...activities.map(a => [
        a.consultantName,
        a.consultantEmail,
        a.actionType,
        a.clientName || 'N/A',
        new Date(a.createdAt).toLocaleString(),
        JSON.stringify(a.details)
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consultant-activities-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>Loading activities...</p>
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
            <Activity className="w-6 h-6" style={{ color: '#C9A35A' }} />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#071C3C' }}>Consultant Activities</h1>
              <p className="text-xs" style={{ color: '#5E6470' }}>Monitor all consultant actions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RoleBadge role="admin" email={user?.email} size="sm" />
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#071C3C' }}>Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* Consultant Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#071C3C' }}>Consultant</label>
              <select
                value={filterConsultant || ''}
                onChange={(e) => setFilterConsultant(e.target.value || null)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              >
                <option value="">All Consultants</option>
                {Array.from(consultants.entries()).map(([uid, name]) => (
                  <option key={uid} value={uid}>{name}</option>
                ))}
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#071C3C' }}>Action Type</label>
              <select
                value={filterAction || ''}
                onChange={(e) => setFilterAction(e.target.value || null)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              >
                <option value="">All Actions</option>
                <option value="meeting_sent">Meeting Sent</option>
                <option value="meeting_created">Meeting Created</option>
                <option value="meeting_cancelled">Meeting Cancelled</option>
                <option value="meeting_rescheduled">Meeting Rescheduled</option>
                <option value="profile_updated">Profile Updated</option>
                <option value="availability_set">Availability Set</option>
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {(filterConsultant || filterAction || dateRange !== '7days') && (
            <button
              onClick={() => {
                setFilterConsultant(null);
                setFilterAction(null);
                setDateRange('7days');
              }}
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
            >
              Clear Filters
            </button>
          )}
        </motion.div>

        {/* Activities List */}
        {error ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <p style={{ color: '#5E6470' }}>{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} />
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} strokeWidth={1} />
            <p className="text-lg font-semibold" style={{ color: '#1E2430' }}>No activities found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ backgroundColor: getActionColor(activity.actionType) + '20', color: getActionColor(activity.actionType) }}
                  >
                    {activity.actionType === 'meeting_sent' && '📧'}
                    {activity.actionType === 'meeting_cancelled' && '❌'}
                    {activity.actionType === 'meeting_rescheduled' && '🔄'}
                    {activity.actionType === 'meeting_created' && '✅'}
                    {activity.actionType === 'profile_updated' && '👤'}
                    {activity.actionType === 'availability_set' && '📅'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: '#071C3C' }}>
                          {getActionLabel(activity.actionType)}
                        </h3>
                        <p className="text-sm" style={{ color: '#5E6470' }}>
                          {activity.consultantName} ({activity.consultantEmail})
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getActionColor(activity.actionType) + '20', color: getActionColor(activity.actionType) }}>
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {activity.clientName && (
                      <p className="text-xs mb-2" style={{ color: '#5E6470' }}>
                        <strong>Client:</strong> {activity.clientName} ({activity.clientEmail})
                      </p>
                    )}

                    {activity.details && (
                      <p className="text-xs" style={{ color: '#94A3B8' }}>
                        <strong>Details:</strong> {JSON.stringify(activity.details).substring(0, 150)}...
                      </p>
                    )}

                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {activity.ipAddress && ` • IP: ${activity.ipAddress}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!error && activities.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs" style={{ color: '#5E6470' }}>Total Activities</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#071C3C' }}>{activities.length}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs" style={{ color: '#5E6470' }}>Active Consultants</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#071C3C' }}>{consultants.size}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs" style={{ color: '#5E6470' }}>Meetings Sent</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#071C3C' }}>
                {activities.filter(a => a.actionType === 'meeting_sent').length}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs" style={{ color: '#5E6470' }}>Cancellations</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#DC2626' }}>
                {activities.filter(a => a.actionType === 'meeting_cancelled').length}
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
