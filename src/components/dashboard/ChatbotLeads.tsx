'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MessageCircle, AlertCircle, Loader2, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { ChatSession } from '@/lib/types/chatbot';

export default function ChatbotLeads() {
  const [leads, setLeads] = useState<(ChatSession & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<(ChatSession & { id: string }) | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load recent chatbot leads
  useEffect(() => {
    const loadLeads = async () => {
      try {
        setIsLoading(true);
        const leadsQuery = query(
          collection(db, 'chatSessions'),
          where('source', '==', 'faq-chatbot'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        const snapshot = await getDocs(leadsQuery);
        const leadsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as ChatSession & { id: string }));

        setLeads(leadsData);
      } catch (err) {
        console.error('Error loading chatbot leads:', err);
        setError('Failed to load chatbot leads');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  const loadMessages = async (sessionId: string) => {
    try {
      setLoadingMessages(true);
      const messagesQuery = query(
        collection(db, 'chatSessions', sessionId, 'messages'),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(messagesQuery);
      const messagesData = snapshot.docs.map(doc => doc.data());
      setMessages(messagesData);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load conversation');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectLead = async (lead: ChatSession & { id: string }) => {
    setSelectedLead(lead);
    await loadMessages(lead.id);
  };

  const handleStatusChange = async (leadId: string, newStatus: any) => {
    try {
      const leadRef = doc(db, 'chatSessions', leadId);
      await updateDoc(leadRef, {
        leadStatus: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId
            ? { ...lead, leadStatus: newStatus }
            : lead
        )
      );

      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, leadStatus: newStatus } : null);
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
      setError('Failed to update lead status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: { bg: string; color: string; icon: string } } = {
      new: { bg: '#DBEAFE', color: '#1E40AF', icon: '🆕' },
      qualified: { bg: '#DCFCE7', color: '#15803D', icon: '✅' },
      'needs-follow-up': { bg: '#FEF3C7', color: '#92400E', icon: '⏱️' },
      converted: { bg: '#F3E8FF', color: '#9333EA', icon: '🎉' },
    };
    return colors[status] || colors.new;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E2430' }}>
            <MessageCircle className="w-5 h-5 inline mr-2" />
            Chatbot Leads
          </h3>

          {leads.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p style={{ color: '#5E6470' }}>No chatbot conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leads.map(lead => {
                const statusColor = getStatusColor(lead.leadStatus);
                const isSelected = selectedLead?.id === lead.id;

                return (
                  <motion.button
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: '#1E2430' }}>
                          {lead.visitorName || 'Anonymous Visitor'}
                        </p>
                        {lead.visitorEmail && (
                          <p className="text-xs text-gray-600 truncate">{lead.visitorEmail}</p>
                        )}
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                        }}
                      >
                        {statusColor.icon} {lead.leadStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {lead.serviceInterest && `Service: ${lead.serviceInterest}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleString()}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Lead Details */}
        {selectedLead ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E2430' }}>
              Lead Details
            </h3>

            <div className="space-y-4">
              {/* Contact Info */}
              <div>
                <p className="text-xs text-gray-600 mb-1">Name</p>
                <p className="font-semibold" style={{ color: '#1E2430' }}>
                  {selectedLead.visitorName || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-sm break-all" style={{ color: '#1E2430' }}>
                  {selectedLead.visitorEmail || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Phone</p>
                <p className="font-semibold" style={{ color: '#1E2430' }}>
                  {selectedLead.visitorPhone || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Service Interest</p>
                <p className="font-semibold" style={{ color: '#1E2430' }}>
                  {selectedLead.serviceInterest || 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['new', 'qualified', 'needs-follow-up', 'converted'].map(status => {
                    const statusColor = getStatusColor(status);
                    const isActive = selectedLead.leadStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedLead.id, status)}
                        className={`text-xs font-semibold px-3 py-1 rounded transition-all ${
                          isActive ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                        }}
                      >
                        {statusColor.icon} {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Created</p>
                <p className="text-sm" style={{ color: '#5E6470' }}>
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm" style={{ color: '#5E6470' }}>
                  {new Date(selectedLead.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Conversation */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-semibold mb-3" style={{ color: '#1E2430' }}>
                Conversation
              </h4>

              {loadingMessages ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#C9A35A' }} />
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-sm text-gray-600">No messages</p>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className="text-xs">
                        <p className="font-semibold mb-1" style={{ color: '#1E2430' }}>
                          {msg.role === 'user' ? 'Visitor' : 'Assistant'}
                        </p>
                        <p className="text-gray-700 bg-gray-50 p-2 rounded">
                          {msg.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center">
            <p style={{ color: '#5E6470' }}>Select a lead to view details and conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
