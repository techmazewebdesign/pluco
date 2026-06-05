'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, XCircle, Search, TrendingUp, Flag } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DocumentData {
  id: string;
  clientUid: string;
  name: string;
  category: string;
  status: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  clientName?: string;
  size: number;
  mimeType: string;
}

export default function DocumentReviewerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
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
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);

      // Load documents
      const q = query(collection(db, 'client_documents'));

      const snapshot = await getDocs(q);
      const docsData: DocumentData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as DocumentData));

      setDocuments(docsData);

      // Calculate stats
      const pending = docsData.filter(d => d.status === 'pending').length;
      const approved = docsData.filter(d => d.status === 'approved').length;
      const rejected = docsData.filter(d => d.status === 'rejected').length;
      const flagged = docsData.filter(d => d.status === 'flagged').length;

      setStats({
        totalDocuments: docsData.length,
        pending,
        approved,
        rejected,
        flagged,
      });
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.clientName && d.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || d.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: { bg: string; color: string; icon: any } } = {
      pending: { bg: '#FEF3C7', color: '#92400E', icon: AlertCircle },
      approved: { bg: '#DCFCE7', color: '#15803D', icon: CheckCircle },
      rejected: { bg: '#FEE2E2', color: '#DC2626', icon: XCircle },
      reviewed: { bg: '#DBEAFE', color: '#1E40AF', icon: CheckCircle },
      flagged: { bg: '#F3E8FF', color: '#9333EA', icon: Flag },
    };
    return colors[status] || colors.pending;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading documents for review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#071C3C' }}>Document Reviewer Dashboard</h1>
          <p style={{ color: '#5E6470' }}>Review and approve submitted documents</p>
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Total Documents</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.totalDocuments}</p>
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Pending Review</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.pending}</p>
              </div>
              <AlertCircle className="w-12 h-12" style={{ color: '#92400E' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.approved}</p>
              </div>
              <CheckCircle className="w-12 h-12" style={{ color: '#15803D' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.rejected}</p>
              </div>
              <XCircle className="w-12 h-12" style={{ color: '#DC2626' }} />
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
                <p style={{ color: '#5E6470' }} className="text-sm font-medium">Flagged</p>
                <p className="text-3xl font-bold" style={{ color: '#071C3C' }}>{stats.flagged}</p>
              </div>
              <Flag className="w-12 h-12" style={{ color: '#9333EA' }} />
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
                placeholder="Search by document name, category, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A35A]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected', 'flagged'].map(status => (
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

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} />
              <p style={{ color: '#5E6470' }}>No documents found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>File Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Size</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#1E2430' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const statusColor = getStatusColor(doc.status);
                  return (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1E2430' }}>
                        {doc.name}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {doc.category}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {formatFileSize(doc.size)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.color }}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5E6470' }}>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
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
