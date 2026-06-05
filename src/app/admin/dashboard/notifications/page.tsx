'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, Trash2, Check, Eye } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AgentNotification } from '@/lib/types';
import { getNotifications, updateNotification } from '@/lib/services/aiLeadAgentService';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<AgentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterRead, setFilterRead] = useState('Unread');

  // Check auth and load notifications
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setIsAdmin(true);
    }
  }, [user, loading, router]);

  // Load notifications
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateNotification(id, { isRead: true });
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n => updateNotification(n.id, { isRead: true }))
      );
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterSeverity !== 'All' && n.severity !== filterSeverity) return false;
    if (filterRead === 'Unread' && n.isRead) return false;
    if (filterRead === 'Read' && !n.isRead) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return { bg: '#FEE2E2', color: '#DC2626', badge: '🔴 Urgent' };
      case 'warning': return { bg: '#FEF3C7', color: '#92400E', badge: '🟠 Warning' };
      case 'success': return { bg: '#DCFCE7', color: '#15803D', badge: '🟢 Success' };
      case 'info': return { bg: '#DBEAFE', color: '#1E40AF', badge: 'ℹ️ Info' };
      default: return { bg: '#F3F4F6', color: '#6B7280', badge: 'Info' };
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lead_hot': return '🔥';
      case 'lead_found': return '🎯';
      case 'consultation_ready': return '✅';
      case 'follow_up_due': return '📞';
      case 'task_failed': return '❌';
      case 'message': return '✉️';
      case 'system': return 'ℹ️';
      default: return '🔔';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
          <p style={{ color: '#5E6470' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold" style={{ color: '#071C3C' }}>Access Denied</h1>
          <p style={{ color: '#5E6470' }}>Only admins can access this page.</p>
          <Link href="/admin/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#071C3C' }}>
                Notifications
              </h1>
              <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="urgent">Urgent</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
            </select>

            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Unread">Unread Only</option>
              <option value="Read">Read Only</option>
            </select>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              <Check className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
        </motion.div>

        {/* Notifications Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
              <p style={{ color: '#5E6470' }}>Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-lg font-semibold mb-2" style={{ color: '#1E2430' }}>No notifications</p>
            <p style={{ color: '#5E6470' }}>You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, i) => {
              const severityColor = getSeverityColor(notification.severity);
              const icon = getNotificationIcon(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  style={{ borderLeftWidth: '4px', borderLeftColor: severityColor.bg }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: '#1E2430' }}>
                            {notification.title}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-xs px-2 py-1 rounded font-semibold"
                            style={{
                              backgroundColor: severityColor.bg,
                              color: severityColor.color,
                            }}
                          >
                            {severityColor.badge}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C9A35A' }}></div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        {new Date(notification.createdAt).toLocaleString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-3 flex-wrap">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors hover:bg-gray-100"
                            style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                          >
                            <Check className="w-4 h-4" />
                            Mark as Read
                          </button>
                        )}
                        {notification.relatedLeadId && (
                          <Link
                            href={`/admin/dashboard/leads#lead-${notification.relatedLeadId}`}
                            className="px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors hover:bg-gray-100"
                            style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                          >
                            <Eye className="w-4 h-4" />
                            View Related Lead
                          </Link>
                        )}
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="px-3 py-2 text-xs font-semibold rounded-lg transition-colors"
                            style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                          >
                            Take Action
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
