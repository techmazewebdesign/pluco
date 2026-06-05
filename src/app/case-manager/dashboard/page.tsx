'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Users, Clock, CheckCircle, AlertCircle, Search, Plus } from 'lucide-react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CaseData {
  id: string;
  clientName: string;
  clientEmail: string;
  caseNumber: string;
  service: string;
  status: string;
  stage: string;
  nextDeadline?: string;
  nextAppointment?: string;
  documentsRequired?: string[];
  documentsReceived?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function CaseManagerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    inProgress: 0,
    awaitingDocuments: 0,
    completedThisMonth: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadCases();
    }
  }, [user]);

  const loadCases = async () => {
    try {
      setIsLoading(true);

      // Load cases assigned to this case manager or all cases if admin
      const q = query(
        collection(db, 'cases'),
        where('assignedTo', '==', user?.uid)
      );

      const snapshot = await getDocs(q);
      const casesData: CaseData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as CaseData));

      setCases(casesData);

      // Calculate stats
      const inProgress = casesData.filter(c => c.status === 'in_progress').length;
      const awaitingDocs = casesData.filter(c => c.status === 'awaiting_documents').length;
      const completed = casesData.filter(c => c.status === 'closed' &&
        new Date(c.updatedAt || '').getMonth() === new Date().getMonth()
      ).length;

      setStats({
        totalCases: casesData.length,
        inProgress,
        awaitingDocuments: awaitingDocs,
        completedThisMonth: completed,
      });
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCases = cases.filter(c =>
    c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: { bg: string; color: string } } = {
      pending: { bg: '#FEF3C7', color: '#92400E' },
      in_progress: { bg: '#DBEAFE', color: '#1E40AF' },
      awaiting_documents: { bg: '#F3E8FF', color: '#9333EA' },
      under_review: { bg: '#CCFBF1', color: '#0F766E' },
      approved: { bg: '#DCFCE7', color: '#15803D' },
      closed: { bg: '#F3F4F6', color: '#374151' },
    };
    return colors[status] || colors.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading your cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#071C3C' }}>Case Manager Dashboard</h1>
          <p style={{ color: '#5E6470' }}>Manage and track all your assigned cases</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Total Cases</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.totalCases}</p>
              </div>
              <FileText className="w-12 h-12" style={{ color: '#C9A35A' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.inProgress}</p>
              </div>
              <Clock className="w-12 h-12" style={{ color: '#1E40AF' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Awaiting Documents</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.awaitingDocuments}</p>
              </div>
              <AlertCircle className="w-12 h-12" style={{ color: '#9333EA' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Completed This Month</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.completedThisMonth}</p>
              </div>
              <CheckCircle className="w-12 h-12" style={{ color: '#15803D' }} />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5" style={{ color: '#5E6470' }} />
            <input
              type="text"
              placeholder="Search by case number, client name, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A35A]"
            />
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredCases.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
              <p style={{ color: '#5E6470' }}>No cases found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Case #</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseItem) => {
                  const colors = getStatusColor(caseItem.status);
                  return (
                    <tr key={caseItem.id} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1E2430' }}>
                        {caseItem.caseNumber}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#1E2430' }}>
                        <div>{caseItem.clientName}</div>
                        <div style={{ color: '#5E6470', fontSize: '12px' }}>{caseItem.clientEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {caseItem.service}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: colors.bg, color: colors.color }}
                        >
                          {caseItem.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {caseItem.nextDeadline ? new Date(caseItem.nextDeadline).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="px-3 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                          View
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
