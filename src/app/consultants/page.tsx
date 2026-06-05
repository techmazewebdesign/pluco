'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import {
  Search, Star, Award, Loader2, AlertCircle, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { PRODUCT_TYPES } from '@/lib/types';
import PrivateEnquiryFormModal from '@/components/shared/PrivateEnquiryFormModal';

interface ConsultantCard {
  uid: string;
  email: string;
  name: string;
  yearsOfExperience?: number;
  productTypes?: string[];
  bio?: string;
  averageRating?: number;
  totalConsultations?: number;
}

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<ConsultantCard[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<ConsultantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantCard | null>(null);

  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setLoading(true);
        const consultantsSnap = await getDocs(
          query(
            collection(db, 'agents'),
            where('role', '==', 'consultant'),
            where('profileComplete', '==', true),
            where('active', '==', true)
          )
        );

        const consultantsList = consultantsSnap.docs.map(doc => ({
          uid: doc.data().uid || doc.id,
          email: doc.id,
          ...doc.data(),
        } as ConsultantCard));

        setConsultants(consultantsList);
        setFilteredConsultants(consultantsList);
      } catch (err) {
        console.error('Error loading consultants:', err);
        setError('Failed to load consultants');
      } finally {
        setLoading(false);
      }
    };

    loadConsultants();
  }, []);

  // Filter consultants based on search and selected product type
  useEffect(() => {
    let filtered = consultants;

    // Filter by search query (name or email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }

    // Filter by product type
    if (selectedProductType) {
      filtered = filtered.filter(c =>
        c.productTypes?.includes(selectedProductType)
      );
    }

    setFilteredConsultants(filtered);
  }, [searchQuery, selectedProductType, consultants]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>Loading consultants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold mb-8"
          style={{ color: '#C9A35A' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#071C3C' }}>Our Consultants</h1>
          <p style={{ color: '#5E6470' }}>
            Browse and book consultations with our team of experienced professionals
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: '#C9A35A' }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                style={{ outlineColor: '#C9A35A' }}
              />
            </div>

            {/* Product Type Filter */}
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: '#071C3C' }}>
                Filter by Specialization
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Object.entries(PRODUCT_TYPES).map(([id, product]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedProductType(
                      selectedProductType === id ? null : id
                    )}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all text-center flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: selectedProductType === id ? '#C9A35A' : '#F3F4F6',
                      color: selectedProductType === id ? '#071C3C' : '#5E6470'
                    }}
                  >
                    <span>{product.icon}</span>
                    <span className="hidden sm:inline">{product.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedProductType) && (
              <div className="flex gap-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                  >
                    Clear search
                  </button>
                )}
                {selectedProductType && (
                  <button
                    onClick={() => setSelectedProductType(null)}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                  >
                    Clear specialization filter
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Consultants Grid */}
        {error ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <p style={{ color: '#5E6470' }}>{error}</p>
          </div>
        ) : filteredConsultants.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} strokeWidth={1} />
            <p className="text-lg font-semibold mb-2" style={{ color: '#1E2430' }}>
              No consultants found
            </p>
            <p style={{ color: '#5E6470' }}>
              {searchQuery || selectedProductType
                ? 'Try adjusting your search or filters'
                : 'No consultants available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConsultants.map((consultant, index) => (
              <motion.div
                key={consultant.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#071C3C' }}>
                    {consultant.name}
                  </h3>

                  {/* Rating */}
                  {consultant.averageRating && consultant.averageRating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(Math.round(consultant.averageRating))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: '#C9A35A' }} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#5E6470' }}>
                        {consultant.averageRating.toFixed(1)} ({consultant.totalConsultations || 0} reviews)
                      </span>
                    </div>
                  )}

                  {/* Experience */}
                  {consultant.yearsOfExperience && (
                    <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: '#5E6470' }}>
                      <Award className="w-4 h-4" style={{ color: '#C9A35A' }} />
                      <span>{consultant.yearsOfExperience} years experience</span>
                    </div>
                  )}

                  {/* Specializations */}
                  {consultant.productTypes && consultant.productTypes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-2" style={{ color: '#5E6470' }}>
                        Specializations:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {consultant.productTypes.slice(0, 3).map((productType) => {
                          const product = PRODUCT_TYPES[productType];
                          return (
                            <span
                              key={productType}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                            >
                              {product?.icon} {product?.en}
                            </span>
                          );
                        })}
                        {consultant.productTypes.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full"
                            style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}>
                            +{consultant.productTypes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio Preview */}
                  {consultant.bio && (
                    <p className="text-xs mb-4 line-clamp-2" style={{ color: '#5E6470' }}>
                      {consultant.bio}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/consultants/${encodeURIComponent(consultant.email)}`}
                      className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-105"
                      style={{ backgroundColor: '#F3F4F6', color: '#071C3C' }}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedConsultant(consultant);
                        setEnquiryModalOpen(true);
                      }}
                      className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
                      style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!error && consultants.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-12 text-center">
            <p style={{ color: '#5E6470' }} className="text-sm">
              Showing {filteredConsultants.length} of {consultants.length} consultants
            </p>
          </motion.div>
        )}
      </div>

      {/* Enquiry Form Modal */}
      {selectedConsultant && (
        <PrivateEnquiryFormModal
          isOpen={enquiryModalOpen}
          onClose={() => {
            setEnquiryModalOpen(false);
            setSelectedConsultant(null);
          }}
          consultantId={selectedConsultant.uid}
          consultantName={selectedConsultant.name}
        />
      )}
    </div>
  );
}
