'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, FileText, Users, Camera, Save,
  Loader2, Plus, Trash2, ChevronDown, CheckCircle, AlertCircle,
} from 'lucide-react';
import {
  doc, getDoc, setDoc, collection, getDocs,
  addDoc, deleteDoc, updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

// ── Types ────────────────────────────────────────────────────────────
interface ClientProfile {
  // Personal
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  secondNationality?: string;
  countryOfResidence?: string;
  city?: string;
  address?: string;
  maritalStatus?: string;
  numberOfChildren?: string;
  numberOfFamilyMembers?: string;
  photo?: string;
  photoPath?: string;
  // Professional
  companyName?: string;
  jobTitle?: string;
  employmentStatus?: string;
  industry?: string;
  incomeRange?: string;
  businessDescription?: string;
  // Immigration
  passportNumber?: string;
  passportExpiry?: string;
  passportIssuingCountry?: string;
  secondPassportCountry?: string;
  currentVisaStatus?: string;
  previousVisaRefusals?: boolean;
  previousVisaRefusalsDetails?: string;
  languagesSpoken?: string;
  // Source of funds
  sourceOfFunds?: string;
  sourceOfWealth?: string;
  // Preferences
  preferredLanguage?: string;
  preferredCommunication?: string;
  updatedAt?: string;
}

interface FamilyMember {
  id: string;
  relationship: string;
  name: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  maritalStatus?: string;
  occupation?: string;
  photo?: string;
  photoPath?: string;
  addedAt?: string;
}

// ── Options ──────────────────────────────────────────────────────────
const MARITAL_STATUS = [
  { en: 'Single', fa: 'مجرد' },
  { en: 'Married', fa: 'متأهل' },
  { en: 'Divorced', fa: 'مطلقه' },
  { en: 'Widowed', fa: 'بیوه' },
  { en: 'Separated', fa: 'جدا شده' },
];
const EMPLOYMENT_STATUS = [
  { en: 'Employed', fa: 'کارمند' },
  { en: 'Self-Employed', fa: 'خوداشتغال' },
  { en: 'Business Owner', fa: 'صاحب کسب‌وکار' },
  { en: 'Investor', fa: 'سرمایه‌گذار' },
  { en: 'Retired', fa: 'بازنشسته' },
  { en: 'Student', fa: 'دانشجو' },
  { en: 'Other', fa: 'سایر' },
];
const INCOME_RANGES = [
  { en: 'Under €50,000', fa: 'زیر €50,000' },
  { en: '€50,000 – €150,000', fa: '€50,000 – €150,000' },
  { en: '€150,000 – €500,000', fa: '€150,000 – €500,000' },
  { en: '€500,000 – €1,000,000', fa: '€500,000 – €1,000,000' },
  { en: 'Over €1,000,000', fa: 'بیش از €1,000,000' },
  { en: 'Prefer not to say', fa: 'ترجیح می‌دهم نگویم' },
];
const RELATIONSHIPS = [
  { en: 'Spouse / Partner', fa: 'همسر / شریک زندگی' },
  { en: 'Child', fa: 'فرزند' },
  { en: 'Parent', fa: 'والدین' },
  { en: 'Sibling', fa: 'خواهر / برادر' },
  { en: 'Other Dependent', fa: 'سایر وابستگان' },
];
const VISA_STATUS = [
  { en: 'No current visa', fa: 'بدون ویزای فعلی' },
  { en: 'Tourist / Visit Visa', fa: 'ویزای توریستی' },
  { en: 'Student Visa', fa: 'ویزای دانشجویی' },
  { en: 'Work Permit', fa: 'مجوز کار' },
  { en: 'Temporary Residence', fa: 'اقامت موقت' },
  { en: 'Permanent Residence', fa: 'اقامت دائم' },
  { en: 'Citizenship', fa: 'شهروندی' },
];

// ── Photo Uploader Component ─────────────────────────────────────────
function PhotoUploader({
  currentUrl, storagePath, onUploaded, size = 'lg', label, isRTL
}: {
  currentUrl?: string;
  storagePath: string;
  onUploaded: (url: string, path: string) => void;
  size?: 'sm' | 'lg';
  label?: string;
  isRTL: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadErr, setUploadErr] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const dim = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';

  const handleFile = async (file: File) => {
    setUploadErr('');
    if (!file.type.startsWith('image/')) {
      setUploadErr('Please select an image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErr('File is too large. Maximum size is 5MB.');
      return;
    }
    setUploading(true);
    setProgress(10); // show immediate feedback
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `${storagePath}.${ext}`;
      const storageRef = ref(storage, path);
      setProgress(30);
      const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
      setProgress(80);
      const url = await getDownloadURL(snapshot.ref);
      setProgress(100);
      onUploaded(url, path);
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      const code = err?.code || '';
      const msg = err?.message || String(e);
      console.error('Storage upload error:', code, msg);
      if (code === 'storage/unauthorized') {
        setUploadErr('Permission denied. Check Firebase Storage rules.');
      } else if (code === 'storage/object-not-found') {
        setUploadErr('Storage path error. Please try again.');
      } else if (code.includes('cors') || msg.includes('CORS')) {
        setUploadErr('CORS error. Check Firebase Storage CORS config.');
      } else {
        setUploadErr(`Upload failed: ${code || msg}`);
      }
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${dim} rounded-full overflow-hidden relative cursor-pointer border-2 flex items-center justify-center`}
        style={{ borderColor: uploadErr ? '#DC2626' : '#C9A35A', backgroundColor: '#F1F5F9' }}
        onClick={() => { setUploadErr(''); inputRef.current?.click(); }}
      >
        {currentUrl ? (
          <Image src={currentUrl} alt="Profile" fill className="object-cover" />
        ) : (
          <User className="w-8 h-8" style={{ color: '#94A3B8' }} strokeWidth={1.5} />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
          {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
        </div>
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-full">
            <div className="h-1 rounded-b-full transition-all" style={{ width: `${progress}%`, backgroundColor: '#C9A35A' }} />
          </div>
        )}
      </div>
      {uploadErr && (
        <p className="text-xs text-center max-w-[140px]" style={{ color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>
          {uploadErr}
        </p>
      )}
      {label && <p className="text-xs text-center" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{label}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

// ── Field Component ──────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors bg-white";
const selectCls = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white";

// ── Main Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'immigration' | 'family'>('personal');
  const [profile, setProfile] = useState<ClientProfile>({});
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({ relationship: 'Child' });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [profileSnap, familySnap] = await Promise.all([
          getDoc(doc(db, 'clients', user.uid)),
          getDocs(collection(db, 'clients', user.uid, 'family')),
        ]);
        if (profileSnap.exists()) setProfile(profileSnap.data() as ClientProfile);
        setFamilyMembers(familySnap.docs.map(d => ({ id: d.id, ...d.data() } as FamilyMember)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'clients', user.uid), {
        ...profile,
        uid: user.uid,
        email: user.email,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleAddMember = async () => {
    if (!user || !newMember.name) return;
    try {
      const ref = await addDoc(collection(db, 'clients', user.uid, 'family'), {
        ...newMember, addedAt: new Date().toISOString(),
      });
      setFamilyMembers(prev => [...prev, { id: ref.id, name: '', relationship: 'Child', ...newMember } as FamilyMember]);
      setNewMember({ relationship: 'Child' });
      setShowAddMember(false);
    } catch (e) { console.error(e); }
  };

  const handleUpdateMember = async (id: string, data: Partial<FamilyMember>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'clients', user.uid, 'family', id), data as Record<string, unknown>);
      setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
      setEditingMember(null);
    } catch (e) { console.error(e); }
  };

  const handleDeleteMember = async (id: string) => {
    if (!user || !confirm('Remove this family member?')) return;
    try {
      await deleteDoc(doc(db, 'clients', user.uid, 'family', id));
      setFamilyMembers(prev => prev.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
  };

  const set = (field: keyof ClientProfile, value: string | boolean) =>
    setProfile(p => ({ ...p, [field]: value }));

  const tabs = [
    { key: 'personal',       labelEn: 'Personal',       labelFa: 'اطلاعات شخصی',    Icon: User },
    { key: 'professional',   labelEn: 'Professional',   labelFa: 'اطلاعات حرفه‌ای',  Icon: Briefcase },
    { key: 'immigration',    labelEn: 'Immigration',    labelFa: 'اطلاعات مهاجرتی',  Icon: FileText },
    { key: 'family',         labelEn: 'Family Members', labelFa: 'اعضای خانواده',    Icon: Users, badge: familyMembers.length },
  ] as const;

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} /></div>
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'پروفایل من' : 'My Profile'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'اطلاعات شخصی، حرفه‌ای، مهاجرتی و خانوادگی شما' : 'Your personal, professional, immigration and family information'}
          </p>
        </div>
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
              <CheckCircle className="w-4 h-4" />
              {isRTL ? 'ذخیره شد' : 'Saved'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0"
            style={{ borderColor: activeTab === tab.key ? '#C9A35A' : 'transparent', color: activeTab === tab.key ? '#C9A35A' : '#94A3B8', fontFamily: isRTL ? ff : undefined }}
          >
            <tab.Icon className="w-3.5 h-3.5" />
            {isRTL ? tab.labelFa : tab.labelEn}
            {'badge' in tab && tab.badge > 0 && (
              <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Personal ── */}
      {activeTab === 'personal' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Photo */}
          <div className="flex items-center gap-6">
            <PhotoUploader
              currentUrl={profile.photo}
              storagePath={`profiles/${user?.uid}/photo`}
              onUploaded={(url, path) => setProfile(p => ({ ...p, photo: url, photoPath: path }))}
              size="lg"
              label={isRTL ? 'عکس پروفایل' : 'Profile Photo'}
              isRTL={isRTL}
            />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'عکس پروفایل' : 'Profile Photo'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'JPG، PNG · حداکثر ۵ مگابایت' : 'JPG, PNG · Max 5MB'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={isRTL ? 'نام کامل *' : 'Full Name *'}>
              <input className={inputCls} value={profile.name || ''} onChange={e => set('name', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'تاریخ تولد' : 'Date of Birth'}>
              <input type="date" className={inputCls} value={profile.dateOfBirth || ''} onChange={e => set('dateOfBirth', e.target.value)} dir="ltr" />
            </Field>
            <Field label={isRTL ? 'جنسیت' : 'Gender'}>
              <select className={selectCls} value={profile.gender || ''} onChange={e => set('gender', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
                <option value="">{isRTL ? 'انتخاب کنید' : 'Select…'}</option>
                <option value="Male">{isRTL ? 'مرد' : 'Male'}</option>
                <option value="Female">{isRTL ? 'زن' : 'Female'}</option>
                <option value="Prefer not to say">{isRTL ? 'ترجیح می‌دهم نگویم' : 'Prefer not to say'}</option>
              </select>
            </Field>
            <Field label={isRTL ? 'وضعیت تأهل' : 'Marital Status'}>
              <select className={selectCls} value={profile.maritalStatus || ''} onChange={e => set('maritalStatus', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
                <option value="">{isRTL ? 'انتخاب کنید' : 'Select…'}</option>
                {MARITAL_STATUS.map(s => <option key={s.en} value={s.en}>{isRTL ? s.fa : s.en}</option>)}
              </select>
            </Field>
            <Field label={isRTL ? 'ملیت اول' : 'Primary Nationality'}>
              <input className={inputCls} value={profile.nationality || ''} onChange={e => set('nationality', e.target.value)} placeholder={isRTL ? 'مثال: ایرانی' : 'e.g. Iranian'} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'ملیت دوم (اگر دارید)' : 'Second Nationality (if any)'}>
              <input className={inputCls} value={profile.secondNationality || ''} onChange={e => set('secondNationality', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'کشور محل اقامت' : 'Country of Residence'}>
              <input className={inputCls} value={profile.countryOfResidence || ''} onChange={e => set('countryOfResidence', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'شهر' : 'City'}>
              <input className={inputCls} value={profile.city || ''} onChange={e => set('city', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'آدرس' : 'Address'}>
              <input className={inputCls} value={profile.address || ''} onChange={e => set('address', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'تلفن / واتساپ' : 'Phone / WhatsApp'}>
              <input type="tel" className={inputCls} dir="ltr" value={profile.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+1 234 567 8900" />
            </Field>
            <Field label={isRTL ? 'تعداد فرزندان' : 'Number of Children'}>
              <input type="number" min="0" className={inputCls} value={profile.numberOfChildren || ''} onChange={e => set('numberOfChildren', e.target.value)} />
            </Field>
            <Field label={isRTL ? 'تعداد کل اعضای خانواده' : 'Total Family Members'}>
              <input type="number" min="1" className={inputCls} value={profile.numberOfFamilyMembers || ''} onChange={e => set('numberOfFamilyMembers', e.target.value)} />
            </Field>
            <Field label={isRTL ? 'زبان ترجیحی' : 'Preferred Language'}>
              <select className={selectCls} value={profile.preferredLanguage || 'en'} onChange={e => set('preferredLanguage', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
                <option value="en">English</option>
                <option value="fa">فارسی</option>
              </select>
            </Field>
            <Field label={isRTL ? 'روش ارتباط ترجیحی' : 'Preferred Communication'}>
              <select className={selectCls} value={profile.preferredCommunication || ''} onChange={e => set('preferredCommunication', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
                <option value="">{isRTL ? 'انتخاب کنید' : 'Select…'}</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone Call">{isRTL ? 'تماس تلفنی' : 'Phone Call'}</option>
                <option value="Video Call">{isRTL ? 'تماس تصویری' : 'Video Call'}</option>
              </select>
            </Field>
          </div>
          <SaveButton saving={saving} saved={saved} onSave={handleSave} isRTL={isRTL} ff={ff} />
        </motion.div>
      )}

      {/* ── Professional ── */}
      {activeTab === 'professional' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={isRTL ? 'نام شرکت' : 'Company Name'}>
              <input className={inputCls} value={profile.companyName || ''} onChange={e => set('companyName', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'عنوان شغلی' : 'Job Title / Profession'}>
              <input className={inputCls} value={profile.jobTitle || ''} onChange={e => set('jobTitle', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'وضعیت اشتغال' : 'Employment Status'}>
              <select className={selectCls} value={profile.employmentStatus || ''} onChange={e => set('employmentStatus', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
                <option value="">{isRTL ? 'انتخاب کنید' : 'Select…'}</option>
                {EMPLOYMENT_STATUS.map(s => <option key={s.en} value={s.en}>{isRTL ? s.fa : s.en}</option>)}
              </select>
            </Field>
            <Field label={isRTL ? 'صنعت / حوزه فعالیت' : 'Industry / Sector'}>
              <input className={inputCls} value={profile.industry || ''} onChange={e => set('industry', e.target.value)} placeholder={isRTL ? 'مثال: فناوری، نفت، ساختمان' : 'e.g. Technology, Oil & Gas, Construction'} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'محدوده درآمد سالانه' : 'Annual Income Range'}>
              <select className={selectCls} value={profile.incomeRange || ''} onChange={e => set('incomeRange', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
                <option value="">{isRTL ? 'انتخاب کنید' : 'Select…'}</option>
                {INCOME_RANGES.map(s => <option key={s.en} value={s.en}>{isRTL ? s.fa : s.en}</option>)}
              </select>
            </Field>
          </div>
          <Field label={isRTL ? 'توضیح کسب‌وکار / فعالیت حرفه‌ای' : 'Business / Professional Activity Description'}>
            <textarea rows={4} className={inputCls} value={profile.businessDescription || ''} onChange={e => set('businessDescription', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} placeholder={isRTL ? 'توضیح مختصر در مورد فعالیت کسب‌وکار یا حرفه‌ای خود...' : 'Brief description of your business or professional activity...'} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={isRTL ? 'منبع وجوه' : 'Source of Funds'}>
              <textarea rows={3} className={inputCls} value={profile.sourceOfFunds || ''} onChange={e => set('sourceOfFunds', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} placeholder={isRTL ? 'توضیح منبع وجوه جاری...' : 'Describe the source of your current funds...'} />
            </Field>
            <Field label={isRTL ? 'منبع ثروت' : 'Source of Wealth'}>
              <textarea rows={3} className={inputCls} value={profile.sourceOfWealth || ''} onChange={e => set('sourceOfWealth', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} placeholder={isRTL ? 'توضیح چگونگی انباشت ثروت...' : 'Describe how your overall wealth was accumulated...'} />
            </Field>
          </div>
          <p className="text-xs p-3 rounded-lg" style={{ backgroundColor: '#FFF8E8', color: '#92400E', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'اطلاعات منبع وجوه و ثروت محرمانه است و صرفاً برای اهداف انطباق و مستندسازی استفاده می‌شود.' : 'Source of funds and wealth information is confidential and used solely for compliance and documentation purposes.'}
          </p>
          <SaveButton saving={saving} saved={saved} onSave={handleSave} isRTL={isRTL} ff={ff} />
        </motion.div>
      )}

      {/* ── Immigration ── */}
      {activeTab === 'immigration' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={isRTL ? 'شماره گذرنامه' : 'Passport Number'}>
              <input className={inputCls} dir="ltr" value={profile.passportNumber || ''} onChange={e => set('passportNumber', e.target.value)} placeholder="AB1234567" />
            </Field>
            <Field label={isRTL ? 'کشور صادرکننده گذرنامه' : 'Passport Issuing Country'}>
              <input className={inputCls} value={profile.passportIssuingCountry || ''} onChange={e => set('passportIssuingCountry', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'تاریخ انقضای گذرنامه' : 'Passport Expiry Date'}>
              <input type="date" className={inputCls} dir="ltr" value={profile.passportExpiry || ''} onChange={e => set('passportExpiry', e.target.value)} />
            </Field>
            <Field label={isRTL ? 'گذرنامه دوم (کشور)' : 'Second Passport Country (if any)'}>
              <input className={inputCls} value={profile.secondPassportCountry || ''} onChange={e => set('secondPassportCountry', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
            <Field label={isRTL ? 'وضعیت ویزای فعلی' : 'Current Visa / Residence Status'}>
              <select className={selectCls} value={profile.currentVisaStatus || ''} onChange={e => set('currentVisaStatus', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
                <option value="">{isRTL ? 'انتخاب کنید' : 'Select…'}</option>
                {VISA_STATUS.map(s => <option key={s.en} value={s.en}>{isRTL ? s.fa : s.en}</option>)}
              </select>
            </Field>
            <Field label={isRTL ? 'زبان‌های مورد تسلط' : 'Languages Spoken'}>
              <input className={inputCls} value={profile.languagesSpoken || ''} onChange={e => set('languagesSpoken', e.target.value)} placeholder={isRTL ? 'مثال: فارسی، انگلیسی، آلمانی' : 'e.g. Farsi, English, German'} style={{ fontFamily: isRTL ? ff : undefined }} />
            </Field>
          </div>

          {/* Previous visa refusals */}
          <div className="border border-gray-200 rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!profile.previousVisaRefusals}
                onChange={e => set('previousVisaRefusals', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'رد ویزا یا اقامت در گذشته' : 'Previous Visa or Residence Refusals'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'آیا در گذشته درخواست ویزا یا اقامت شما رد شده است؟' : 'Have you ever had a visa or residence application refused?'}
                </p>
              </div>
            </label>
            {profile.previousVisaRefusals && (
              <div className="mt-4">
                <Field label={isRTL ? 'جزئیات (کشور، سال، دلیل)' : 'Details (country, year, reason)'}>
                  <textarea rows={3} className={inputCls} value={profile.previousVisaRefusalsDetails || ''} onChange={e => set('previousVisaRefusalsDetails', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
                </Field>
              </div>
            )}
          </div>

          <div className="rounded-lg p-4" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0369A1' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#0C4A6E', fontFamily: isRTL ? ff : undefined }}>
                {isRTL
                  ? 'تمام اطلاعات مهاجرتی محرمانه است. اطلاعات دقیق به ارائه مشاوره بهتر و آماده‌سازی پرونده قوی‌تر کمک می‌کند.'
                  : 'All immigration information is strictly confidential. Accurate information helps us provide better advice and prepare a stronger case file.'}
              </p>
            </div>
          </div>
          <SaveButton saving={saving} saved={saved} onSave={handleSave} isRTL={isRTL} ff={ff} />
        </motion.div>
      )}

      {/* ── Family Members ── */}
      {activeTab === 'family' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? `${familyMembers.length} عضو خانواده ثبت شده` : `${familyMembers.length} family member${familyMembers.length !== 1 ? 's' : ''} registered`}
            </p>
            <button onClick={() => setShowAddMember(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg hover:brightness-110 transition-all" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              <Plus className="w-3.5 h-3.5" />
              {isRTL ? 'افزودن عضو' : 'Add Member'}
            </button>
          </div>

          {/* Existing members */}
          {familyMembers.length === 0 && !showAddMember && (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
              <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
              <p className="text-sm font-medium" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'هنوز عضو خانواده‌ای اضافه نشده' : 'No family members added yet'}
              </p>
            </div>
          )}

          {familyMembers.map(member => (
            <div key={member.id} className="border border-gray-200 rounded-xl overflow-hidden">
              {editingMember?.id === member.id ? (
                <MemberForm
                  member={editingMember}
                  onChange={setEditingMember}
                  onSave={() => handleUpdateMember(member.id, editingMember)}
                  onCancel={() => setEditingMember(null)}
                  uid={user?.uid || ''}
                  isRTL={isRTL}
                  ff={ff}
                />
              ) : (
                <div className="flex items-center gap-4 p-5">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative flex-shrink-0 border-2" style={{ borderColor: '#C9A35A', backgroundColor: '#F1F5F9' }}>
                    {member.photo ? (
                      <Image src={member.photo} alt={member.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6" style={{ color: '#94A3B8' }} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{member.name}</p>
                    <p className="text-xs" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>{member.relationship}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                      {[member.nationality, member.dateOfBirth].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingMember(member)} className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: '#E5E7EB', color: '#5E6470' }}>
                      {isRTL ? 'ویرایش' : 'Edit'}
                    </button>
                    <button onClick={() => handleDeleteMember(member.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new member form */}
          {showAddMember && (
            <div className="border-2 border-dashed border-yellow-400 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b" style={{ backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }}>
                <p className="text-sm font-semibold" style={{ color: '#92400E', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'افزودن عضو جدید' : 'Add New Family Member'}
                </p>
              </div>
              <MemberForm
                member={newMember as FamilyMember}
                onChange={m => setNewMember(m as Partial<FamilyMember>)}
                onSave={handleAddMember}
                onCancel={() => setShowAddMember(false)}
                uid={user?.uid || ''}
                isRTL={isRTL}
                ff={ff}
                isNew
              />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ── Save Button ──────────────────────────────────────────────────────
function SaveButton({ saving, saved, onSave, isRTL, ff }: { saving: boolean; saved: boolean; onSave: () => void; isRTL: boolean; ff: string }) {
  return (
    <div className="flex justify-end pt-4 border-t border-gray-100">
      <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-60 transition-all" style={{ backgroundColor: '#071C3C', color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isRTL ? 'ذخیره تغییرات' : 'Save Changes'}
      </button>
    </div>
  );
}

// ── Member Form ──────────────────────────────────────────────────────
function MemberForm({ member, onChange, onSave, onCancel, uid, isRTL, ff, isNew }:
  { member: FamilyMember; onChange: (m: FamilyMember) => void; onSave: () => void; onCancel: () => void; uid: string; isRTL: boolean; ff: string; isNew?: boolean }) {
  const set = (field: keyof FamilyMember, value: string) => onChange({ ...member, [field]: value });
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600 bg-white";
  const selectCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600 bg-white";

  return (
    <div className="p-5 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Photo */}
      <div className="flex items-center gap-4">
        <PhotoUploader
          currentUrl={member.photo}
          storagePath={`profiles/${uid}/family/${member.id || 'new'}/photo`}
          onUploaded={(url, path) => onChange({ ...member, photo: url, photoPath: path })}
          size="sm"
          label={isRTL ? 'عکس' : 'Photo'}
          isRTL={isRTL}
        />
        <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
          {isRTL ? 'عکس عضو خانواده (اختیاری)' : 'Member photo (optional)'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'رابطه' : 'Relationship *'}
          </label>
          <select className={selectCls} value={member.relationship || ''} onChange={e => set('relationship', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
            {RELATIONSHIPS.map(r => <option key={r.en} value={r.en}>{isRTL ? r.fa : r.en}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'نام کامل *' : 'Full Name *'}
          </label>
          <input className={inputCls} value={member.name || ''} onChange={e => set('name', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'تاریخ تولد' : 'Date of Birth'}
          </label>
          <input type="date" className={inputCls} dir="ltr" value={member.dateOfBirth || ''} onChange={e => set('dateOfBirth', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'جنسیت' : 'Gender'}
          </label>
          <select className={selectCls} value={member.gender || ''} onChange={e => set('gender', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }}>
            <option value="">{isRTL ? 'انتخاب کنید' : 'Select…'}</option>
            <option value="Male">{isRTL ? 'مرد' : 'Male'}</option>
            <option value="Female">{isRTL ? 'زن' : 'Female'}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'ملیت' : 'Nationality'}
          </label>
          <input className={inputCls} value={member.nationality || ''} onChange={e => set('nationality', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'شماره گذرنامه' : 'Passport Number'}
          </label>
          <input className={inputCls} dir="ltr" value={member.passportNumber || ''} onChange={e => set('passportNumber', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'تاریخ انقضای گذرنامه' : 'Passport Expiry'}
          </label>
          <input type="date" className={inputCls} dir="ltr" value={member.passportExpiry || ''} onChange={e => set('passportExpiry', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430', letterSpacing: isRTL ? 'normal' : '0.05em', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'شغل' : 'Occupation'}
          </label>
          <input className={inputCls} value={member.occupation || ''} onChange={e => set('occupation', e.target.value)} style={{ fontFamily: isRTL ? ff : undefined }} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
          <Save className="w-3.5 h-3.5" />
          {isNew ? (isRTL ? 'افزودن عضو' : 'Add Member') : (isRTL ? 'ذخیره' : 'Save')}
        </button>
        <button onClick={onCancel} className="px-4 py-2 text-xs font-medium rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: '#E5E7EB', color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
          {isRTL ? 'انصراف' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
