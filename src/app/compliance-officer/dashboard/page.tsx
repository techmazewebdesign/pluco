'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, TrendingDown, Search, BarChart3, Clock } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import RoleBadge from '@/components/shared/RoleBadge';

interface ComplianceRecord {
  id: string;
  userId: string;
  checkType: string;
  status: string;
  details?: string;
  findings?: string;
  severity?: string;
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
  userName?: string;
  userEmail?: string;
}

export default function ComplianceOfficerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChecks: 0,
    completed: 0,
    pending: 0,
    highRisk: 0,
    complianceRate: '0%',
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
      loadComplianceRecords();
    }
  }, [user]);

  const loadComplianceRecords = async () => {
    try {
      setIsLoading(true);

      // Load compliance records
      const q = query(collection(db, 'compliance_checks'));

      const snapshot = await getDocs(q);
      const recordsData: ComplianceRecord[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ComplianceRecord));

      setRecords(recordsData);

      // Calculate stats
      const completed = recordsData.filter(r => r.status === 'completed').length;
      const pending = recordsData.filter(r => r.status === 'pending').length;
      const highRisk = recordsData.filter(r => r.severity === 'high').length;
      const complianceRate = recordsData.length > 0
        ? Math.round((completed / recordsData.length) * 100)
        : 0;

      setStats({
        totalChecks: recordsData.length,
        completed,
        pending,
        highRisk,
        complianceRate: complianceRate + '%',
      });
    } catch (error) {
      console.error('Error loading compliance records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.checkType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.userName && r.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.userEmail && r.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || r.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: { bg: string; color: string } } = {
      pending: { bg: '#FEF3C7', color: '#92400E' },
      completed: { bg: '#DCFCE7', color: '#15803D' },
      flagged: { bg: '#FEE2E2', color: '#DC2626' },
      review: { bg: '#DBEAFE', color: '#1E40AF' },
    };
    return colors[status] || colors.pending;
  };

  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: { bg: string; color: string } } = {
      low: { bg: '#F3F4F6', color: '#374151' },
      medium: { bg: '#FEF3C7', color: '#92400E' },
      high: { bg: '#FEE2E2', color: '#DC2626' },
      critical: { bg: '#7F1D1D', color: '#FFFFFF' },
    };
    return colors[severity] || colors.low;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading compliance records...</p>
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
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#071C3C' }}>Compliance Officer Dashboard</h1>
            <p style={{ color: '#5E6470' }}>Monitor compliance checks and regulatory requirements</p>
          </div>
          <RoleBadge role="compliance_officer" email={user?.email} size="md" />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Total Checks</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.totalChecks}</p>
              </div>
              <Shield className="w-12 h-12" style={{ color: '#C9A35A' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.completed}</p>
              </div>
              <CheckCircle className="w-12 h-12" style={{ color: '#15803D' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.pending}</p>
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">High Risk</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.highRisk}</p>
              </div>
              <AlertCircle className="w-12 h-12" style={{ color: '#DC2626' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Compliance Rate</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.complianceRate}</p>
              </div>
              <BarChart3 className="w-12 h-12" style={{ color: '#15803D' }} />
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
                placeholder="Search by check type, user, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A35A]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'completed', 'flagged', 'review'].map(status => (
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
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
              <p style={{ color: '#5E6470' }}>No compliance records found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Check Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Findings</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const statusColor = getStatusColor(record.status);
                  const severityColor = getSeverityColor(record.severity || 'low');
                  return (
                    <tr key={record.id} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1E2430' }}>
                        {record.checkType}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div style={{ color: '#1E2430' }}>{record.userName || 'Unknown'}</div>
                        <div style={{ color: '#5E6470', fontSize: '12px' }}>{record.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.color }}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: severityColor.bg, color: severityColor.color }}
                        >
                          {record.severity || 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {record.findings ? record.findings.substring(0, 50) + '...' : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="px-3 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                          Review
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
