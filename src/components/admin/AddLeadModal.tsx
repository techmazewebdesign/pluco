'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLeadOperations } from '@/lib/hooks/useLeadOperations';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: () => void;
}

export default function AddLeadModal({ isOpen, onClose, onLeadAdded }: AddLeadModalProps) {
  const { addLeadManually } = useLeadOperations();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    serviceInterest: '',
    estimatedBudget: '',
    urgency: 'Low',
    companyName: '',
    sourceChannel: 'Other',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.country || !formData.serviceInterest) {
      alert('Please fill in all required fields (marked with *)');
      return;
    }

    try {
      setIsSaving(true);
      const result = await addLeadManually({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        country: formData.country,
        serviceInterest: formData.serviceInterest,
        estimatedBudget: formData.estimatedBudget || 'Not specified',
        urgency: formData.urgency,
        companyName: formData.companyName || undefined,
        sourceChannel: 'Other',
      } as any);

      if (result) {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          country: '',
          serviceInterest: '',
          estimatedBudget: '',
          urgency: 'Low',
          companyName: '',
          sourceChannel: 'Manual Entry',
        });
        alert('✅ Lead added successfully!');
        onLeadAdded();
        onClose();
      } else {
        alert('❌ Failed to add lead');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error adding lead');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>
            ➕ Add New Lead
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5" style={{ color: '#5E6470' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Patel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="India, UK, USA, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Service Interest *
            </label>
            <select
              name="serviceInterest"
              value={formData.serviceInterest}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
              required
            >
              <option value="">Select a service</option>
              <option value="Second Passport">Second Passport</option>
              <option value="EU Residency">EU Residency</option>
              <option value="US Green Card">US Green Card</option>
              <option value="Banking">Banking</option>
              <option value="Business Setup">Business Setup</option>
              <option value="Visa Sponsorship">Visa Sponsorship</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Estimated Budget
            </label>
            <select
              name="estimatedBudget"
              value={formData.estimatedBudget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
            >
              <option value="">Not specified</option>
              <option value="$50K">$50K</option>
              <option value="$100K">$100K</option>
              <option value="$200K">$200K</option>
              <option value="$500K">$500K</option>
              <option value="$1M+">$1M+</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Urgency
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="This Month">This Month</option>
              <option value="Immediate">Immediate</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: '#1E2430' }}>
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Corporation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
              style={{ color: '#5E6470' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
              style={{ backgroundColor: isSaving ? '#CBD5E0' : '#C9A35A', color: '#071C3C' }}
            >
              {isSaving ? '⏳ Adding...' : '✅ Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
