'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LogOut, Bell, Trash2, Check, Loader2, AlertCircle, ArrowLeft, Filter
} from 'lucide-react';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import RoleBadge from '@/components/shared/RoleBadge';

interface Notification {
  id: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'review' | 'other';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load notifications
  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setError('');

        const notificationsSnap = await getDocs(
          query(
            collection(db, 'notifications'),
            where('recipientUid', '==', user.uid)
          )
        );

        const notificationsList = notificationsSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
          } as Notification))
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });

        setNotifications(notificationsList);
      } catch (e) {
        console.error('Error loading notifications:', e);
        setError('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        updatedAt: new Date().toISOString()
      });

      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (e) {
      console.error('Error deleting notification:', e);
    }
  };

  const filteredNotifications = filterType === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6" style={{ color: '#C9A35A' }} />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#071C3C' }}>Notifications</h1>
              <p className="text-xs" style={{ color: '#5E6470' }}>
                {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
              </p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: filterType === 'all' ? '#C9A35A' : '#F3F4F6',
              color: filterType === 'all' ? '#071C3C' : '#5E6470'
            }}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: filterType === 'unread' ? '#C9A35A' : '#F3F4F6',
              color: filterType === 'unread' ? '#071C3C' : '#5E6470'
            }}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {error ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <p style={{ color: '#5E6470' }}>{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} strokeWidth={1} />
            <p className="text-lg font-semibold" style={{ color: '#1E2430' }}>
              {filterType === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: !notification.read ? '#FFFBEB' : '#FFFFFF',
                  borderColor: !notification.read ? '#FCD34D' : '#E5E7EB'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor: notification.type === 'booking_request' ? '#DBEAFE' : '#F3F4F6'
                    }}
                  >
                    <span className="text-lg">
                      {notification.type === 'booking_request' ? '📅' : '🔔'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: '#071C3C' }}>
                          {notification.title}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
                          {notification.message}
                        </p>
                        <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                          {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#C9A35A' }} />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:brightness-105"
                          style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                        >
                          View Details
                        </Link>
                      )}

                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-gray-100 flex items-center gap-1"
                          style={{ color: '#5E6470' }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-red-50 flex items-center gap-1"
                        style={{ color: '#DC2626' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
