'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Eye, Check, ArrowRight } from 'lucide-react';
import { AgentNotification } from '@/lib/types';
import Link from 'next/link';
import { getNotifications, updateNotification } from '@/lib/services/aiLeadAgentService';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<AgentNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateNotification(id, { isRead: true });
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return { bg: '#FEE2E2', color: '#DC2626', borderColor: '#FCA5A5' };
      case 'warning': return { bg: '#FEF3C7', color: '#92400E', borderColor: '#FCD34D' };
      case 'success': return { bg: '#DCFCE7', color: '#15803D', borderColor: '#86EFAC' };
      case 'info': return { bg: '#DBEAFE', color: '#1E40AF', borderColor: '#93C5FD' };
      default: return { bg: '#F3F4F6', color: '#6B7280', borderColor: '#D1D5DB' };
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

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" style={{ color: '#5E6470' }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: '#DC2626' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 rounded-lg shadow-xl border border-gray-200 bg-white z-50"
          style={{ maxHeight: '500px', overflowY: 'auto' }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: '#1E2430' }}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: '#C9A35A' }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4" style={{ color: '#5E6470' }} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-10 h-10 mx-auto mb-2" style={{ color: '#CBD5E0' }} />
              <p className="text-xs" style={{ color: '#94A3B8' }}>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentNotifications.map((notification) => {
                const severityColor = getSeverityColor(notification.severity);
                const icon = getNotificationIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className="p-3 hover:bg-gray-50 transition-colors border-l-4"
                    style={{ borderLeftColor: severityColor.borderColor }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-semibold" style={{ color: '#1E2430' }}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-semibold flex-shrink-0"
                              style={{
                                backgroundColor: severityColor.bg,
                                color: severityColor.color,
                              }}
                            >
                              {notification.severity.charAt(0).toUpperCase() + notification.severity.slice(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mb-2" style={{ color: '#5E6470' }}>
                          {notification.message}
                        </p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                          {new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-200 transition-colors"
                              style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                            >
                              <Check className="w-3 h-3" />
                              Read
                            </button>
                          )}
                          {notification.relatedLeadId && (
                            <Link
                              href={`/admin/dashboard/leads#lead-${notification.relatedLeadId}`}
                              className="text-xs px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-200 transition-colors"
                              style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                            >
                              <Eye className="w-3 h-3" />
                              View Lead
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer - View All Link */}
          {notifications.length > 5 && (
            <div className="sticky bottom-0 bg-gray-50 px-4 py-3 border-t border-gray-200">
              <Link
                href="/admin/dashboard/notifications"
                className="text-xs font-semibold flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 transition-colors"
                style={{ color: '#C9A35A' }}
              >
                View All Notifications
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
