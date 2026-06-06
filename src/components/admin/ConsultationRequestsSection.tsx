'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, Phone, Calendar, MessageSquare, Edit2 } from 'lucide-react';

interface ConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate?: string;
  preferredTime?: string;
  timezone: string;
  language: string;
  caseDescription: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'declined';
  adminNotes: string;
  createdAt: string;
}

export default function ConsultationRequestsSection() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'consultation_requests'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ConsultationRequest[];
      console.log('[Admin] consultation requests loaded:', data.length);
      setRequests(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error loading consultation requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId: string, updates: Partial<ConsultationRequest>) => {
    try {
      const ref = doc(db, 'consultation_requests', requestId);
      await updateDoc(ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      setEditingId(null);
      setEditNotes('');
      setEditStatus('');
      await loadRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading consultation requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Consultation Requests {pendingCount > 0 && <span className="ml-2 text-sm font-semibold text-red-600">({pendingCount} pending)</span>}
        </h2>
        <p className="text-gray-600 mt-1">Manage visitor consultation and booking requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-semibold text-blue-700">Total</p>
          <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm font-semibold text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-semibold text-green-700">Confirmed</p>
          <p className="text-2xl font-bold text-green-900">{requests.filter(r => r.status === 'confirmed').length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700">Contacted</p>
          <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'contacted').length}</p>
        </div>
      </div>

      {/* Requests Table */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No consultation requests yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Preferred</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{request.fullName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {request.email}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-700">{request.service}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 space-y-1">
                        {request.preferredDate && (
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {request.preferredDate} {request.preferredTime}
                          </p>
                        )}
                        <p>{request.timezone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === request.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="declined">Declined</option>
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          if (editingId === request.id) {
                            handleUpdateRequest(request.id, {
                              status: editStatus as any,
                              adminNotes: editNotes,
                            });
                          } else {
                            setEditingId(request.id);
                            setEditStatus(request.status);
                            setEditNotes(request.adminNotes);
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        {editingId === request.id ? 'Save' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expanded detail view for editing */}
      {editingId && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Case Description</p>
              <p className="text-sm text-gray-700">{requests.find(r => r.id === editingId)?.caseDescription}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">Language</p>
              <p className="text-sm text-gray-700">{requests.find(r => r.id === editingId)?.language}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">Admin Notes</p>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={3}
              placeholder="Add internal notes..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                handleUpdateRequest(editingId, {
                  status: editStatus as any,
                  adminNotes: editNotes,
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setEditNotes('');
                setEditStatus('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-sm font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
