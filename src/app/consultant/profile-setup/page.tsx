'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, Loader, AlertCircle, ArrowRight } from 'lucide-react';
import { doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PRODUCT_TYPES } from '@/lib/types';

interface ConsultantProfile {
  name: string;
  personalEmail: string;
  phone: string;
  bio: string;
  linkedin: string;
  yearsOfExperience: number;
  certifications: string;
  productTypes: string[];
  photo: File | null;
}

export default function ConsultantProfileSetup() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isRTL, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ConsultantProfile>({
    name: '',
    personalEmail: '',
    phone: '',
    bio: '',
    linkedin: '',
    yearsOfExperience: 0,
    certifications: '',
    productTypes: [],
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Load existing profile data
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'agents', user.email!.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(prev => ({
            ...prev,
            name: data.name || '',
            personalEmail: data.personalEmail || '',
            phone: data.phone || '',
            bio: data.bio || '',
            linkedin: data.linkedin || '',
            yearsOfExperience: data.yearsOfExperience || 0,
            certifications: data.certifications || '',
            productTypes: data.productTypes || [],
          }));

          if (data.photo) {
            setPhotoPreview(data.photo);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductTypeToggle = (type: string) => {
    setProfile(prev => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter(t => t !== type)
        : [...prev.productTypes, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!profile.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!profile.personalEmail.trim()) {
      setError('Personal email is required');
      return;
    }
    if (!profile.phone.trim()) {
      setError('Phone number is required');
      return;
      }
    if (profile.productTypes.length === 0) {
      setError('Please select at least one product specialization');
      return;
    }
    if (!profile.bio.trim()) {
      setError('Bio is required');
      return;
    }

    try {
      setIsSubmitting(true);

      let photoUrl = photoPreview;

      // Upload photo if changed
      if (profile.photo && photoPreview.startsWith('data:')) {
        const photoRef = ref(storage, `consultant-photos/${user.uid}-${Date.now()}.jpg`);
        const blob = await fetch(photoPreview).then(r => r.blob());
        const snapshot = await uploadBytes(photoRef, blob);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      // Update Firestore (use setDoc to create or merge)
      const docRef = doc(db, 'agents', user.email!.toLowerCase());
      await setDoc(docRef, {
        name: profile.name,
        personalEmail: profile.personalEmail,
        phone: profile.phone,
        bio: profile.bio,
        linkedin: profile.linkedin,
        yearsOfExperience: parseInt(profile.yearsOfExperience.toString()) || 0,
        certifications: profile.certifications,
        productTypes: profile.productTypes,
        photo: photoUrl,
        profileComplete: true,
        profileCompletedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }, { merge: true });

      // Redirect to dashboard
      router.push('/consultant/dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#071C3C' }}>
            Complete Your Profile
          </h1>
          <p style={{ color: '#5E6470' }}>
            Setup your consultant profile to start accepting bookings
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {[1, 2, 3].map(step => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`w-10 h-10 rounded-full font-semibold transition-all ${
                  step <= currentStep
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                style={{
                  backgroundColor: step <= currentStep ? '#C9A35A' : undefined,
                }}
              >
                {step}
              </button>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: '#C9A35A',
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#071C3C' }}>
                Personal Information
              </h2>

              <div className="space-y-5">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#1E2430' }}>
                    Professional Photo *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-[#C9A35A]"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    {photoPreview ? (
                      <div>
                        <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-lg mx-auto mb-3 object-cover" />
                        <p className="text-sm font-medium" style={{ color: '#1E2430' }}>Click to change photo</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium" style={{ color: '#1E2430' }}>Click to upload photo</p>
                        <p className="text-xs" style={{ color: '#5E6470' }}>PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                    placeholder="Your full name"
                  />
                </div>

                {/* Personal Email */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                    Personal Email *
                  </label>
                  <input
                    type="email"
                    value={profile.personalEmail}
                    onChange={(e) => setProfile(prev => ({ ...prev, personalEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full mt-8 py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A' }}
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Professional Info */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#071C3C' }}>
                Professional Details
              </h2>

              <div className="space-y-5">
                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={profile.yearsOfExperience}
                    onChange={(e) => setProfile(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                    placeholder="10"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                    Certifications & Qualifications
                  </label>
                  <textarea
                    value={profile.certifications}
                    onChange={(e) => setProfile(prev => ({ ...prev, certifications: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                    placeholder="e.g., MBA, Legal Certification, etc."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold border border-gray-300 transition-colors"
                  style={{ color: '#5E6470' }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
                  style={{ backgroundColor: '#C9A35A' }}
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Specializations & Bio */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#071C3C' }}>
                Specializations
              </h2>

              <div className="space-y-5">
                {/* Product Types */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#1E2430' }}>
                    Select Your Specializations * (at least one)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(PRODUCT_TYPES).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleProductTypeToggle(key)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          profile.productTypes.includes(key)
                            ? 'border-[#C9A35A] bg-[#FEF5E7]'
                            : 'border-gray-200 hover:border-[#C9A35A]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {profile.productTypes.includes(key) && (
                            <CheckCircle className="w-5 h-5" style={{ color: '#C9A35A' }} />
                          )}
                          <div>
                            <div className="font-semibold text-sm" style={{ color: '#1E2430' }}>
                              {value.en}
                            </div>
                            <div className="text-xs" style={{ color: '#5E6470' }}>
                              {value.fa}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                    Professional Bio * (min. 50 characters)
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A35A]"
                    placeholder="Tell clients about your expertise and experience..."
                    rows={5}
                  />
                  <p className="text-xs mt-1" style={{ color: '#5E6470' }}>
                    {profile.bio.length} characters
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold border border-gray-300 transition-colors"
                  style={{ color: '#5E6470' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: '#C9A35A' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Profile
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
