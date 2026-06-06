'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import {
  Mail, Phone, ExternalLink, Award, MapPin, Calendar, Star, Loader2, AlertCircle, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_TYPES } from '@/lib/types';

interface ConsultantProfile {
  uid: string;
  name: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  linkedin?: string;
  yearsOfExperience?: number;
  certifications?: string;
  productTypes?: string[];
  bio?: string;
  photo?: string;
  averageRating?: number;
  totalConsultations?: number;
  profileComplete: boolean;
  active: boolean;
}

export default function ConsultantProfilePage({
  params,
}: {
  params: { email: string };
}) {
  const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const decodedEmail = decodeURIComponent(params.email).toLowerCase();

  useEffect(() => {
    const loadConsultant = async () => {
      try {
        setLoading(true);
        const consultantRef = doc(db, 'agents', decodedEmail);
        const consultantSnap = await getDoc(consultantRef);

        if (consultantSnap.exists()) {
          const data = consultantSnap.data();
          if (data.role === 'consultant' && data.profileComplete && data.active) {
            setConsultant({
              uid: consultantSnap.id,
              ...data,
            } as ConsultantProfile);
          } else {
            setError('This consultant profile is not available');
          }
        } else {
          setError('Consultant not found');
        }
      } catch (err) {
        console.error('Error loading consultant:', err);
        setError('Failed to load consultant profile');
      } finally {
        setLoading(false);
      }
    };

    loadConsultant();
  }, [decodedEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>Loading consultant profile...</p>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold mb-8"
            style={{ color: '#C9A35A' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E2430' }}>Profile Not Found</h1>
            <p className="text-sm mb-6" style={{ color: '#5E6470' }}>{error}</p>
            <Link href="/consultants" className="inline-block px-6 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              View All Consultants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold mb-8"
          style={{ color: '#C9A35A' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Cover Section */}
          <div className="h-32" style={{ backgroundColor: '#071C3C' }}></div>

          {/* Profile Header */}
          <div className="px-6 py-8 sm:px-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 mb-6">
              {consultant.photo ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <img src={consultant.photo} alt={consultant.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl border-4 border-white shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F3F4F6' }}>
                  <span className="text-4xl font-bold" style={{ color: '#C9A35A' }}>
                    {consultant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#071C3C' }}>
                  {consultant.name}
                </h1>
                <div className="flex flex-wrap gap-3 items-center">
                  {consultant.averageRating && consultant.averageRating > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: '#F3F4F6' }}>
                      <div className="flex gap-1">
                        {[...Array(Math.round(consultant.averageRating))].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#C9A35A' }} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#1E2430' }}>
                        {consultant.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <div className="text-sm" style={{ color: '#5E6470' }}>
                    {consultant.totalConsultations} consultations completed
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {consultant.personalEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: '#C9A35A' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#5E6470' }}>Personal Email</p>
                    <a href={`mailto:${consultant.personalEmail}`} className="text-sm font-semibold"
                      style={{ color: '#071C3C' }}>
                      {consultant.personalEmail}
                    </a>
                  </div>
                </div>
              )}

              {consultant.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" style={{ color: '#C9A35A' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#5E6470' }}>Phone</p>
                    <a href={`tel:${consultant.phone}`} className="text-sm font-semibold"
                      style={{ color: '#071C3C' }}>
                      {consultant.phone}
                    </a>
                  </div>
                </div>
              )}

              {consultant.linkedin && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5" style={{ color: '#C9A35A' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#5E6470' }}>LinkedIn</p>
                    <a href={consultant.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold truncate" style={{ color: '#071C3C' }}>
                      View Profile
                    </a>
                  </div>
                </div>
              )}

              {consultant.yearsOfExperience && (
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5" style={{ color: '#C9A35A' }} />
                  <div>
                    <p className="text-xs" style={{ color: '#5E6470' }}>Experience</p>
                    <p className="text-sm font-semibold" style={{ color: '#071C3C' }}>
                      {consultant.yearsOfExperience} years
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="px-6 py-8 sm:px-8 space-y-8">
            {/* Bio */}
            {consultant.bio && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>About</h2>
                <p style={{ color: '#5E6470' }} className="leading-relaxed">
                  {consultant.bio}
                </p>
              </motion.div>
            )}

            {/* Specializations */}
            {consultant.productTypes && consultant.productTypes.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>Specializations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {consultant.productTypes.map((productType) => {
                    const product = PRODUCT_TYPES[productType];
                    return (
                      <div key={productType} className="flex items-center gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: '#F3F4F6' }}>
                        <div className="text-2xl">{product?.icon}</div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#071C3C' }}>
                            {product?.en || productType}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {consultant.certifications && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: '#071C3C' }}>Certifications</h2>
                <div className="space-y-2">
                  {consultant.certifications.split('\n').map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Award className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#C9A35A' }} />
                      <p style={{ color: '#5E6470' }} className="text-sm">
                        {cert.trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Link href={`/booking?consultant=${encodeURIComponent(consultant.email)}`}
                className="w-full block text-center px-6 py-3 rounded-lg font-semibold transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                Book a Consultation
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
