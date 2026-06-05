'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, TrendingUp } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import RoleBadge from '@/components/shared/RoleBadge';

interface TicketData {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  clientName: string;
  clientEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
  unreadAgent?: number;
}

export default function CustomerServiceDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgResponseTime: '2h',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);

      // Load all tickets or assigned tickets
      const q = query(
        collection(db, 'tickets')
      );

      const snapshot = await getDocs(q);
      const ticketsData: TicketData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as TicketData));

      setTickets(ticketsData);

      // Calculate stats
      const open = ticketsData.filter(t => t.status === 'open').length;
      const inProgress = ticketsData.filter(t => t.status === 'in_progress').length;
      const resolved = ticketsData.filter(t => t.status === 'resolved').length;

      setStats({
        totalTickets: ticketsData.length,
        open,
        inProgress,
        resolved,
        avgResponseTime: '2h',
      });
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: { bg: string; color: string } } = {
      low: { bg: '#F3F4F6', color: '#374151' },
      medium: { bg: '#DBEAFE', color: '#1E40AF' },
      high: { bg: '#FEF3C7', color: '#92400E' },
      urgent: { bg: '#FEE2E2', color: '#DC2626' },
    };
    return colors[priority] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: { bg: string; color: string } } = {
      open: { bg: '#DBEAFE', color: '#1E40AF' },
      in_progress: { bg: '#FEF3C7', color: '#92400E' },
      waiting_client: { bg: '#F3E8FF', color: '#9333EA' },
      resolved: { bg: '#DCFCE7', color: '#15803D' },
      closed: { bg: '#F3F4F6', color: '#374151' },
    };
    return colors[status] || colors.open;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#071C3C' }}>Customer Service Dashboard</h1>
            <p style={{ color: '#5E6470' }}>Manage customer support tickets and inquiries</p>
          </div>
          <RoleBadge role="customer_service" email={user?.email} size="md" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Total Tickets</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.totalTickets}</p>
              </div>
              <MessageSquare className="w-12 h-12" style={{ color: '#C9A35A' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Open</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.open}</p>
              </div>
              <AlertCircle className="w-12 h-12" style={{ color: '#1E40AF' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.inProgress}</p>
              </div>
              <Clock className="w-12 h-12" style={{ color: '#92400E' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.resolved}</p>
              </div>
              <CheckCircle className="w-12 h-12" style={{ color: '#15803D' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Avg Response</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.avgResponseTime}</p>
              </div>
              <TrendingUp className="w-12 h-12" style={{ color: '#15803D' }} />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Search className="w-5 h-5" style={{ color: '#5E6470' }} />
              <input
                type="text"
                placeholder="Search by ticket number, subject, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A35A]"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'open', 'in_progress', 'resolved', 'closed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'text-white'
                      : 'border border-gray-300 hover:border-[#C9A35A]'
                  }`}
                  style={{
                    backgroundColor: filterStatus === status ? '#C9A35A' : 'transparent',
                    color: filterStatus === status ? '#071C3C' : '#5E6470',
                  }}
                >
                  {status.replace(/_/g, ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
              <p style={{ color: '#5E6470' }}>No tickets found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Ticket #</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => {
                  const priorityColors = getPriorityColor(ticket.priority);
                  const statusColors = getStatusColor(ticket.status);
                  return (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1E2430' }}>
                        {ticket.ticketNumber}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#1E2430' }}>
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div style={{ color: '#1E2430' }}>{ticket.clientName}</div>
                        <div style={{ color: '#5E6470', fontSize: '12px' }}>{ticket.clientEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: priorityColors.bg, color: priorityColors.color }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: statusColors.bg, color: statusColors.color }}
                        >
                          {ticket.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="px-3 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                          Reply
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
