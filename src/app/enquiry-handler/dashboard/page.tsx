'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Inbox, Clock, CheckCircle, TrendingUp, Search, MessageSquare } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EnquiryData {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  service?: string;
  status: string;
  description?: string;
  assignedTo?: string;
  agentNotes?: string;
  submittedAt: string;
  updatedAt?: string;
}

export default function EnquiryHandlerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    new: 0,
    assigned: 0,
    inProgress: 0,
    closed: 0,
    avgResponseTime: '4h',
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
      loadEnquiries();
    }
  }, [user]);

  const loadEnquiries = async () => {
    try {
      setIsLoading(true);

      // Load enquiries
      const q = query(collection(db, 'enquiries'));

      const snapshot = await getDocs(q);
      const enquiriesData: EnquiryData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as EnquiryData));

      setEnquiries(enquiriesData);

      // Calculate stats
      const newCount = enquiriesData.filter(e => e.status === 'new').length;
      const assigned = enquiriesData.filter(e => e.status === 'assigned').length;
      const inProgress = enquiriesData.filter(e => e.status === 'in_progress').length;
      const closed = enquiriesData.filter(e => e.status === 'closed').length;

      setStats({
        totalEnquiries: enquiriesData.length,
        new: newCount,
        assigned,
        inProgress,
        closed,
        avgResponseTime: '4h',
      });
    } catch (error) {
      console.error('Error loading enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.service && e.service.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || e.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: { bg: string; color: string } } = {
      new: { bg: '#FEF3C7', color: '#92400E' },
      assigned: { bg: '#DBEAFE', color: '#1E40AF' },
      in_progress: { bg: '#F3E8FF', color: '#9333EA' },
      closed: { bg: '#DCFCE7', color: '#15803D' },
    };
    return colors[status] || colors.new;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#071C3C' }}>Enquiry Handler Dashboard</h1>
          <p style={{ color: '#5E6470' }}>Process and manage incoming client inquiries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Total Enquiries</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.totalEnquiries}</p>
              </div>
              <Mail className="w-12 h-12" style={{ color: '#C9A35A' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">New</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.new}</p>
              </div>
              <Inbox className="w-12 h-12" style={{ color: '#92400E' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Assigned</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.assigned}</p>
              </div>
              <Clock className="w-12 h-12" style={{ color: '#1E40AF' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.inProgress}</p>
              </div>
              <MessageSquare className="w-12 h-12" style={{ color: '#9333EA' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Closed</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.closed}</p>
              </div>
              <CheckCircle className="w-12 h-12" style={{ color: '#15803D' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
                placeholder="Search by name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A35A]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'new', 'assigned', 'in_progress', 'closed'].map(status => (
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

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
              <p style={{ color: '#5E6470' }}>No enquiries found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => {
                  const statusColor = getStatusColor(enquiry.status);
                  return (
                    <tr key={enquiry.id} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1E2430' }}>
                        {enquiry.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#1E2430' }}>
                        {enquiry.email}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {enquiry.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {enquiry.service || 'General Inquiry'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.color }}
                        >
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {new Date(enquiry.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="px-3 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                          Process
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
