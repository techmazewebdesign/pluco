'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Save, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { CustomerServiceProfile, ExperienceLevel, Department, AvailabilityStatus } from '@/lib/types/customerService';

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['junior', 'mid', 'senior'];
const DEPARTMENTS: Department[] = ['leads', 'client-support', 'documents', 'bookings', 'general'];
const AVAILABILITY_STATUS: AvailabilityStatus[] = ['available', 'busy', 'away', 'offline'];
const LANGUAGES = ['English', 'Farsi / Persian', 'French', 'German', 'Spanish', 'Italian'];

export default function CustomerServiceProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [profile, setProfile] = useState<Partial<CustomerServiceProfile>>({
    fullName: '',
    email: '',
    phoneWhatsApp: '',
    preferredLanguage: 'English',
    department: 'general',
    experienceLevel: 'mid',
    roleTitle: '',
    availabilityStatus: 'available',
    notes: '',
    profileCompleted: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load existing profile if it exists
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const profileRef = doc(db, 'customerServiceProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as CustomerServiceProfile);
        } else {
          // Pre-fill with user data
          setProfile(prev => ({
            ...prev,
            uid: user.uid,
            email: user.email || '',
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!profile.fullName?.trim()) {
      setError('Full name is required');
      return;
    }
    if (!profile.phoneWhatsApp?.trim()) {
      setError('Phone/WhatsApp is required');
      return;
    }
    if (!profile.roleTitle?.trim()) {
      setError('Role title is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const now = new Date().toISOString();
      const profileData: CustomerServiceProfile = {
        uid: user.uid,
        fullName: profile.fullName!,
        email: profile.email || user.email || '',
        phoneWhatsApp: profile.phoneWhatsApp!,
        preferredLanguage: profile.preferredLanguage || 'English',
        department: profile.department || 'general',
        experienceLevel: profile.experienceLevel || 'mid',
        roleTitle: profile.roleTitle!,
        profilePhoto: profile.profilePhoto,
        availabilityStatus: profile.availabilityStatus || 'available',
        notes: profile.notes,
        profileCompleted: true,
        createdAt: profile.createdAt || now,
        updatedAt: now,
      };

      // Save to customerServiceProfiles collection
      await setDoc(doc(db, 'customerServiceProfiles', user.uid), profileData);

      // Update users collection with profileCompleted flag
      await setDoc(
        doc(db, 'users', user.uid),
        { profileCompleted: true, updatedAt: now },
        { merge: true }
      );

      setSuccess(true);
      setProfile(profileData);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/customer-service/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold" style={{ color: '#071C3C' }}>
              Complete Your Profile
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              Set up your customer service profile to get started
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold">Profile saved! Redirecting to dashboard...</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold">{error}</p>
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#1E2430' }}>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.fullName || ''}
                    onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={profile.phoneWhatsApp || ''}
                    onChange={(e) => setProfile(p => ({ ...p, phoneWhatsApp: e.target.value }))}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Preferred Language
                  </label>
                  <select
                    value={profile.preferredLanguage || 'English'}
                    onChange={(e) => setProfile(p => ({ ...p, preferredLanguage: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#1E2430' }}>
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Role Title *
                  </label>
                  <input
                    type="text"
                    value={profile.roleTitle || ''}
                    onChange={(e) => setProfile(p => ({ ...p, roleTitle: e.target.value }))}
                    placeholder="e.g. Lead Coordinator, Support Specialist"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Department *
                  </label>
                  <select
                    value={profile.department || 'general'}
                    onChange={(e) => setProfile(p => ({ ...p, department: e.target.value as Department }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>
                        {dept.charAt(0).toUpperCase() + dept.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Experience Level
                  </label>
                  <select
                    value={profile.experienceLevel || 'mid'}
                    onChange={(e) => setProfile(p => ({ ...p, experienceLevel: e.target.value as ExperienceLevel }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
                  >
                    {EXPERIENCE_LEVELS.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                    Availability Status
                  </label>
                  <select
                    value={profile.availabilityStatus || 'available'}
                    onChange={(e) => setProfile(p => ({ ...p, availabilityStatus: e.target.value as AvailabilityStatus }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
                  >
                    {AVAILABILITY_STATUS.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430' }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={profile.notes || ''}
                onChange={(e) => setProfile(p => ({ ...p, notes: e.target.value }))}
                placeholder="Any additional information about yourself..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A35A] focus:border-transparent"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
