'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, MapPin, Globe, Filter, BookOpen, Calendar, Clock, MessageSquare, Loader2, ChevronDown, Users
} from 'lucide-react';
import { collection, getDocs, query, where, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface Consultant {
  uid: string;
  name: string;
  email: string;
  bio?: string;
  photo?: string;
  timezone?: string;
  languages?: string[];
  specializations?: string[];
  averageRating?: number;
  totalConsultations?: number;
  consultationFee?: number;
  currency?: string;
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface BookingData {
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  meetingPlatform: 'google_meet' | 'discord' | 'zoom' | 'teams' | 'other';
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();

  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [consultantAvailability, setConsultantAvailability] = useState<Availability[]>([]);
  const [booking, setBooking] = useState<BookingData>({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '09:00',
    duration: 30,
    meetingPlatform: 'google_meet'
  });

  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    language: '',
    sortBy: 'rating' // rating, price, consultations
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'browse' | 'select' | 'book'>('browse');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  // Check auth
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load consultants
  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setLoading(true);
        const snap = await getDocs(
          query(collection(db, 'agents'), where('role', '==', 'consultant'), where('active', '==', true))
        );

        const consultantsList = snap.docs.map(doc => ({
          uid: doc.id,
          name: doc.data().name || '',
          email: doc.data().email || '',
          bio: doc.data().bio,
          photo: doc.data().photo,
          timezone: doc.data().timezone,
          languages: doc.data().languages || [],
          specializations: doc.data().specializations || [],
          averageRating: doc.data().averageRating,
          totalConsultations: doc.data().totalConsultations || 0,
          consultationFee: doc.data().consultationFee,
          currency: doc.data().currency || 'EUR'
        } as Consultant));

        setConsultants(consultantsList);
      } catch (e) {
        console.error('Error loading consultants:', e);
        setError('Failed to load consultants');
      } finally {
        setLoading(false);
      }
    };

    loadConsultants();
  }, []);

  // Load consultant availability
  useEffect(() => {
    if (!selectedConsultant) return;

    const loadAvailability = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'consultant_availability'), where('consultantUid', '==', selectedConsultant.uid))
        );

        const availability = snap.docs.map(doc => ({
          dayOfWeek: doc.data().dayOfWeek,
          startTime: doc.data().startTime,
          endTime: doc.data().endTime
        } as Availability));

        setConsultantAvailability(availability);
      } catch (e) {
        console.error('Error loading availability:', e);
      }
    };

    loadAvailability();
  }, [selectedConsultant]);

  // Filter consultants
  const filteredConsultants = consultants.filter(c => {
    if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.specialization && !c.specializations?.includes(filters.specialization)) return false;
    if (filters.language && !c.languages?.includes(filters.language)) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'rating') {
      return (b.averageRating || 0) - (a.averageRating || 0);
    } else if (filters.sortBy === 'price') {
      return (a.consultationFee || 0) - (b.consultationFee || 0);
    } else {
      return (b.totalConsultations || 0) - (a.totalConsultations || 0);
    }
  });

  const handleBookConsultation = async () => {
    if (!user || !selectedConsultant || !booking.title || !booking.scheduledDate || !booking.scheduledTime) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const scheduledAt = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`).toISOString();

      await addDoc(collection(db, 'consultation_bookings'), {
        clientUid: user.uid,
        clientName: user.displayName || 'Unknown',
        clientEmail: user.email,
        consultantUid: selectedConsultant.uid,
        consultantName: selectedConsultant.name,
        title: booking.title,
        description: booking.description,
        status: 'pending',
        scheduledAt,
        duration: booking.duration,
        meetingPlatform: booking.meetingPlatform,
        createdAt: new Date().toISOString()
      });

      setSuccess('Consultation booked successfully! The consultant will confirm shortly.');
      setTimeout(() => {
        router.push('/dashboard/tickets');
      }, 2000);
    } catch (e) {
      console.error('Error booking consultation:', e);
      setError('Failed to book consultation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'رزرو مشاوره' : 'Book a Consultation'}
              </h1>
              <p className="text-sm mt-1" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'مشاورین ما را انتخاب کنید و یک جلسه آنلاین رزرو کنید' : 'Select from our team of consultants and book an online session'}
              </p>
            </div>
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E5E7EB', color: '#5E6470' }}>
              {isRTL ? 'بازگشت' : 'Back'}
            </Link>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            {(['browse', 'select', 'book'] as const).map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    (step === 'browse' && i <= 0) || (step === 'select' && i <= 1) || (step === 'book' && i <= 2)
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}
                  style={{
                    backgroundColor:
                      (step === 'browse' && i <= 0) || (step === 'select' && i <= 1) || (step === 'book' && i <= 2)
                        ? '#C9A35A'
                        : '#E5E7EB'
                  }}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontFamily: isRTL ? ff : undefined }}>
            ✅ {success}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Browse Consultants */}
          {step === 'browse' && (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'جستجو' : 'Search'}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                      <input
                        type="text"
                        placeholder={isRTL ? 'نام مشاور' : 'Consultant name'}
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                        style={{ fontFamily: isRTL ? ff : undefined }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'تخصص' : 'Specialization'}
                    </label>
                    <select
                      value={filters.specialization}
                      onChange={e => setFilters({ ...filters, specialization: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                      style={{ fontFamily: isRTL ? ff : undefined }}
                    >
                      <option value="">{isRTL ? 'همه' : 'All'}</option>
                      <option value="immigration">{isRTL ? 'مهاجرت' : 'Immigration'}</option>
                      <option value="business">{isRTL ? 'کسب‌وکار' : 'Business'}</option>
                      <option value="finance">{isRTL ? 'مالی' : 'Finance'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'زبان' : 'Language'}
                    </label>
                    <select
                      value={filters.language}
                      onChange={e => setFilters({ ...filters, language: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                      style={{ fontFamily: isRTL ? ff : undefined }}
                    >
                      <option value="">{isRTL ? 'همه' : 'All'}</option>
                      <option value="English">English</option>
                      <option value="Farsi">فارسی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'مرتب‌سازی' : 'Sort'}
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={e => setFilters({ ...filters, sortBy: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                      style={{ fontFamily: isRTL ? ff : undefined }}
                    >
                      <option value="rating">{isRTL ? 'امتیاز' : 'Rating'}</option>
                      <option value="price">{isRTL ? 'قیمت' : 'Price'}</option>
                      <option value="consultations">{isRTL ? 'تجربه' : 'Experience'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Consultants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultants.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                    <p style={{ color: '#94A3B8' }}>{isRTL ? 'هیچ مشاوری یافت نشد' : 'No consultants found'}</p>
                  </div>
                ) : (
                  filteredConsultants.map(consultant => (
                    <motion.div
                      key={consultant.uid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        {/* Photo & Name */}
                        <div className="flex items-center gap-4 mb-4">
                          {consultant.photo && (
                            <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0">
                              <Image src={consultant.photo} alt={consultant.name} fill className="object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                              {consultant.name}
                            </p>
                            {consultant.timezone && (
                              <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                                {consultant.timezone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {consultant.bio && (
                          <p className="text-xs mb-3 line-clamp-2" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                            {consultant.bio}
                          </p>
                        )}

                        {/* Rating & Stats */}
                        <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: '#5E6470' }}>
                          {consultant.averageRating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5" style={{ color: '#C9A35A' }} fill="#C9A35A" />
                              {consultant.averageRating.toFixed(1)}
                            </span>
                          )}
                          <span>👥 {consultant.totalConsultations || 0}</span>
                        </div>

                        {/* Languages & Specializations */}
                        {consultant.languages && consultant.languages.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs mb-1 font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                              {isRTL ? 'زبان‌ها' : 'Languages'}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {consultant.languages.map(lang => (
                                <span key={lang} className="text-xs px-2 py-1 rounded"
                                  style={{ backgroundColor: '#F0F9FF', color: '#0369A1', fontFamily: isRTL ? ff : undefined }}>
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        {consultant.consultationFee && (
                          <p className="text-sm font-bold mb-4" style={{ color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                            €{consultant.consultationFee} / {isRTL ? 'جلسه' : 'session'}
                          </p>
                        )}

                        {/* Book Button */}
                        <button
                          onClick={() => {
                            setSelectedConsultant(consultant);
                            setStep('select');
                          }}
                          className="w-full py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all"
                          style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}
                        >
                          {isRTL ? 'انتخاب و رزرو' : 'Book Now'}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 'select' && selectedConsultant && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Consultant Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                    {selectedConsultant.photo && (
                      <div className="w-full h-40 rounded-lg overflow-hidden relative mb-4">
                        <Image src={selectedConsultant.photo} alt={selectedConsultant.name} fill className="object-cover" />
                      </div>
                    )}
                    <p className="font-bold text-lg mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {selectedConsultant.name}
                    </p>
                    {selectedConsultant.averageRating && (
                      <p className="text-sm mb-3 flex items-center gap-2" style={{ color: '#5E6470' }}>
                        <Star className="w-4 h-4" style={{ color: '#C9A35A' }} fill="#C9A35A" />
                        {selectedConsultant.averageRating.toFixed(1)} ({selectedConsultant.totalConsultations} {isRTL ? 'جلسه' : 'sessions'})
                      </p>
                    )}
                    {selectedConsultant.bio && (
                      <p className="text-xs mb-4" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                        {selectedConsultant.bio}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedConsultant(null);
                        setStep('browse');
                      }}
                      className="w-full py-2 text-sm font-semibold rounded-lg border transition-colors hover:bg-gray-50"
                      style={{ borderColor: '#E5E7EB', color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
                    >
                      {isRTL ? 'انتخاب دیگر' : 'Choose Different'}
                    </button>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'موضوع مشاوره' : 'Consultation Title *'}
                      </label>
                      <input
                        type="text"
                        value={booking.title}
                        onChange={e => setBooking({ ...booking, title: e.target.value })}
                        placeholder={isRTL ? 'مثال: مشاوره مهاجرت' : 'e.g., Immigration Consultation'}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                        style={{ fontFamily: isRTL ? ff : undefined }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'توضیح (اختیاری)' : 'Description (optional)'}
                      </label>
                      <textarea
                        rows={3}
                        value={booking.description}
                        onChange={e => setBooking({ ...booking, description: e.target.value })}
                        placeholder={isRTL ? 'توضیح مختصر درباره موضوع...' : 'Brief description of your topic...'}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                        style={{ fontFamily: isRTL ? ff : undefined }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'تاریخ' : 'Date *'}
                        </label>
                        <input
                          type="date"
                          value={booking.scheduledDate}
                          onChange={e => setBooking({ ...booking, scheduledDate: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'زمان' : 'Time *'}
                        </label>
                        <input
                          type="time"
                          value={booking.scheduledTime}
                          onChange={e => setBooking({ ...booking, scheduledTime: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'مدت زمان' : 'Duration'}
                        </label>
                        <select
                          value={booking.duration}
                          onChange={e => setBooking({ ...booking, duration: Number(e.target.value) })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        >
                          <option value={30}>30 {isRTL ? 'دقیقه' : 'minutes'}</option>
                          <option value={60}>1 {isRTL ? 'ساعت' : 'hour'}</option>
                          <option value={90}>1.5 {isRTL ? 'ساعت' : 'hours'}</option>
                          <option value={120}>2 {isRTL ? 'ساعت' : 'hours'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'پلتفرم' : 'Platform *'}
                        </label>
                        <select
                          value={booking.meetingPlatform}
                          onChange={e => setBooking({ ...booking, meetingPlatform: e.target.value as any })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white"
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        >
                          <option value="google_meet">{isRTL ? 'گوگل میت' : 'Google Meet'}</option>
                          <option value="discord">Discord</option>
                          <option value="zoom">Zoom</option>
                          <option value="teams">Microsoft Teams</option>
                          <option value="other">{isRTL ? 'سایر' : 'Other'}</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleBookConsultation}
                      disabled={submitting}
                      className="w-full py-3 rounded-lg font-semibold hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {isRTL ? 'رزرو درحال' : 'Booking...'}
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          {isRTL ? 'تأیید رزرو' : 'Confirm Booking'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
