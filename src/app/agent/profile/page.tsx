'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Camera, Loader2, CheckCircle, ShieldCheck,
} from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage, auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import Image from 'next/image';
import { AGENT_ROLE_LABELS, ROLE_PERMISSIONS } from '@/lib/types';
import type { AgentRole } from '@/lib/types';

const inp = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white transition-colors";

export default function AgentProfilePage() {
  const { user } = useAuth();
  const { agent } = useAgent();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [photo, setPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !agent) return;
    // Load extended profile from Firestore
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'agents', user.uid));
        setName(agent.name || '');
        setEmail(user.email || '');
        if (snap.exists()) {
          const d = snap.data();
          setPhone(d.phone || '');
          setBio(d.bio || '');
          setLanguages(d.languages || '');
          setPhoto(d.photo || user.photoURL || '');
        }
      } catch (e) {
        setName(agent.name || '');
        setEmail(user.email || '');
        console.error(e);
      }
    };
    load();
  }, [user, agent]);

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/')) { setPhotoError('Please select an image file (JPG, PNG, WEBP).'); return; }
    if (file.size > 5 * 1024 * 1024) { setPhotoError('File is too large. Maximum size is 5MB.'); return; }
    setPhotoUploading(true); setPhotoError('');
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `agents/${user.uid}/photo.${ext}`;
      const storageRef = ref(storage, path);

      console.log('Uploading agent photo to path:', path);
      const snap = await uploadBytes(storageRef, file, { contentType: file.type });
      console.log('Getting download URL...');
      const url = await getDownloadURL(snap.ref);
      setPhoto(url);
      console.log('Agent photo upload successful:', { path, url });

      // Update Firebase Auth profile photo
      if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL: url });
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      const code = err?.code || '';
      const msg = err?.message || String(e);
      console.error('Agent photo upload error:', code, msg, e);

      let errorMsg = 'Upload failed. Please try again.';
      if (code === 'storage/unauthorized') {
        errorMsg = 'Permission denied. Make sure you\'re signed in.';
      } else if (code === 'storage/object-not-found') {
        errorMsg = 'Storage configuration error. Contact support.';
      } else if (code.includes('cors') || msg.includes('CORS')) {
        errorMsg = 'Network error. Check your connection and try again.';
      } else if (code === 'storage/quota-exceeded') {
        errorMsg = 'Storage quota exceeded. Please contact support.';
      } else if (msg.includes('Network')) {
        errorMsg = 'Network error. Check your connection.';
      }

      setPhotoError(errorMsg);
    } finally { setPhotoUploading(false); }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true); setSaveError(''); setSaved(false);
    try {
      // Update Firebase Auth display name
      if (auth.currentUser && name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      // Update Firestore agent doc
      await setDoc(doc(db, 'agents', user.uid), {
        name, phone, bio, languages,
        ...(photo ? { photo } : {}),
        email: user.email,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code || String(e);
      setSaveError(code === 'permission-denied' ? 'Permission denied. Check Firestore rules.' : `Save failed: ${code}`);
    } finally { setSaving(false); }
  };

  const role = agent?.role as AgentRole | undefined;
  const roleLabel = role ? AGENT_ROLE_LABELS[role] : null;
  const permissions = role ? ROLE_PERMISSIONS[role] : null;

  return (
    <AgentShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430' }}>My Profile</h1>
            <p className="text-sm mt-1" style={{ color: '#5E6470' }}>Manage your agent profile and photo</p>
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                <CheckCircle className="w-4 h-4" />Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {saveError && (
          <div className="mb-4 p-3 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>⚠ {saveError}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: photo + role */}
          <div className="space-y-5">
            {/* Photo */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 cursor-pointer"
                  style={{ borderColor: '#C9A35A' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photo ? (
                    <Image src={photo} alt={name} fill sizes="96px" unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                      {name.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                    {photoUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
              </div>
              {photoError && <p className="text-xs mb-2" style={{ color: '#DC2626' }}>{photoError}</p>}
              <p className="text-sm font-bold" style={{ color: '#1E2430' }}>{name || 'Agent'}</p>
              <p className="text-xs mt-0.5" style={{ color: '#5E6470' }}>{email}</p>
              <button onClick={() => fileInputRef.current?.click()} className="mt-3 text-xs font-medium" style={{ color: '#C9A35A' }}>
                Change Photo
              </button>
            </div>

            {/* Role & permissions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                <h3 className="text-sm font-bold" style={{ color: '#1E2430' }}>Role & Access</h3>
              </div>
              <div className="mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                  {roleLabel?.en || 'Agent'}
                </span>
              </div>
              {permissions && (
                <div className="space-y-1">
                  {Object.entries(permissions).map(([key, allowed]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs capitalize" style={{ color: '#5E6470' }}>{key.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-semibold" style={{ color: allowed ? '#15803D' : '#94A3B8' }}>
                        {allowed ? '✓' : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-serif font-bold mb-4" style={{ color: '#1E2430' }}>Profile Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Full Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Email</label>
                  <input value={email} readOnly className={inp} style={{ backgroundColor: '#F8F9FA', color: '#94A3B8' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Phone / WhatsApp</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inp} dir="ltr" placeholder="+48 123 456 789" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Languages Spoken</label>
                  <input value={languages} onChange={e => setLanguages(e.target.value)} className={inp} placeholder="e.g. English, Farsi, Polish" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Short Bio</label>
                <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className={inp} placeholder="Brief professional description…" />
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-60 transition-all" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AgentShell>
  );
}
