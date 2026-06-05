'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Plus, Edit2, Trash2, X, Check, Loader2, ArrowLeft, LogOut, Shield, Mail, Globe, Users
} from 'lucide-react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

interface Consultant {
  uid: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  bio?: string;
  timezone?: string;
  languages?: string[];
  specializations?: string[];
  consultationFee?: number;
  currency?: string;
  photo?: string;
  createdAt?: string;
}

export default function ConsultantsManagementPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    timezone: 'UTC',
    languages: 'English,Farsi',
    specializations: '',
    consultationFee: '',
    currency: 'EUR'
  });

  // Check if admin
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user) {
      user.getIdTokenResult().then((idTokenResult) => {
        const userRole = idTokenResult.claims.role as string | undefined;
        if (userRole === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/admin/dashboard');
        }
      });
    }
  }, [user, loading, router]);

  // Load consultants
  useEffect(() => {
    if (!isAdmin) return;

    const loadConsultants = async () => {
      try {
        setIsLoading(true);
        const snap = await getDocs(
          query(collection(db, 'agents'), where('role', '==', 'consultant'))
        );

        const consultantsList = snap.docs.map(doc => ({
          uid: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          role: doc.data().role,
          active: doc.data().active,
          bio: doc.data().bio,
          timezone: doc.data().timezone,
          languages: doc.data().languages,
          specializations: doc.data().specializations,
          consultationFee: doc.data().consultationFee,
          photo: doc.data().photo,
          createdAt: doc.data().createdAt
        } as Consultant));

        setConsultants(consultantsList);
      } catch (e) {
        console.error('Error loading consultants:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsultants();
  }, [isAdmin]);

  const handleAddConsultant = async () => {
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    try {
      await addDoc(collection(db, 'agents'), {
        name: formData.name,
        email: formData.email,
        role: 'consultant',
        bio: formData.bio,
        timezone: formData.timezone,
        languages: formData.languages.split(',').map(l => l.trim()),
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
        consultationFee: formData.consultationFee ? Number(formData.consultationFee) : undefined,
        currency: formData.currency,
        active: true,
        createdAt: new Date().toISOString()
      });

      setFormData({
        name: '',
        email: '',
        bio: '',
        timezone: 'UTC',
        languages: 'English,Farsi',
        specializations: '',
        consultationFee: '',
        currency: 'EUR'
      });
      setShowModal(false);
      window.location.reload();
    } catch (e) {
      console.error('Error adding consultant:', e);
      alert('Failed to add consultant');
    }
  };

  const handleDeleteConsultant = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this consultant?')) return;

    try {
      await deleteDoc(doc(db, 'agents', uid));
      setConsultants(consultants.filter(c => c.uid !== uid));
    } catch (e) {
      console.error('Error deleting consultant:', e);
      alert('Failed to delete consultant');
    }
  };

  const handleToggleActive = async (consultant: Consultant) => {
    try {
      await updateDoc(doc(db, 'agents', consultant.uid), {
        active: !consultant.active
      });
      setConsultants(consultants.map(c =>
        c.uid === consultant.uid ? { ...c, active: !c.active } : c
      ));
    } catch (e) {
      console.error('Error updating consultant:', e);
      alert('Failed to update consultant');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#071C3C' }}>
                <Shield className="w-6 h-6" style={{ color: '#C9A35A' }} />
                Consultant Management
              </h1>
              <p className="text-xs mt-1" style={{ color: '#5E6470' }}>Manage your consulting team</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              <Plus className="w-4 h-4" />
              Add Consultant
            </button>
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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          </div>
        ) : consultants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
            <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>No consultants yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              <Plus className="w-4 h-4" />
              Add First Consultant
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {consultants.map(consultant => (
              <motion.div
                key={consultant.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Consultant Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {consultant.photo && (
                      <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image src={consultant.photo} alt={consultant.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: '#1E2430' }}>{consultant.name}</p>
                      <p className="text-xs" style={{ color: '#5E6470' }}>{consultant.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {consultant.timezone && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: '#F0F9FF', color: '#0369A1' }}>
                            <Globe className="w-3 h-3" />
                            {consultant.timezone}
                          </span>
                        )}
                        {consultant.consultationFee && (
                          <span className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                            {consultant.currency}{consultant.consultationFee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(consultant)}
                      className={`p-2 rounded-lg transition-colors ${
                        consultant.active
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-red-100 hover:bg-red-200'
                      }`}
                    >
                      {consultant.active ? (
                        <Check className="w-4 h-4" style={{ color: '#15803D' }} />
                      ) : (
                        <X className="w-4 h-4" style={{ color: '#DC2626' }} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteConsultant(consultant.uid)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add Consultant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>Add New Consultant</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                  Bio
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                  placeholder="e.g., UTC, EST, CET"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={e => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={e => setFormData({ ...formData, specializations: e.target.value })}
                  placeholder="e.g., Immigration, Business, Finance"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Consultation Fee
                  </label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={e => setFormData({ ...formData, consultationFee: e.target.value })}
                    placeholder="e.g., 99.99"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                  >
                    <option value="EUR">EUR €</option>
                    <option value="USD">USD $</option>
                    <option value="GBP">GBP £</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB', color: '#5E6470' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddConsultant}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                Add Consultant
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
