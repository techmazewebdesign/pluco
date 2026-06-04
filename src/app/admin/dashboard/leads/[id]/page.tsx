'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, Copy, Edit2, Check, Calendar, MessageSquare, Flag, CheckCircle, AlertCircle, MapPin, Briefcase, DollarSign, TrendingUp, FileText, MessageCircle, Users, Plus, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Lead, AgentActivityLog } from '@/lib/types';
import { getLeadById, getActivityLogs, updateLead, createActivityLog, createNotification } from '@/lib/services/aiLeadAgentService';
import { motion } from 'framer-motion';
import { useMessageTemplates, GeneratedMessages } from '@/lib/hooks/useMessageTemplates';
import { useLeadOperations } from '@/lib/hooks/useLeadOperations';
import MessageTemplatesModal from '@/components/admin/MessageTemplatesModal';

interface LeadWithActivity extends Lead {
  activities?: AgentActivityLog[];
}

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, signOut, loading } = useAuth();
  const leadId = params.id as string;
  const { generateAndSaveMessages } = useMessageTemplates();
  const { markMessageAsSent } = useLeadOperations();

  const [isAdmin, setIsAdmin] = useState(false);
  const [lead, setLead] = useState<LeadWithActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis' | 'timeline' | 'messages' | 'notes'>('summary');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessages | null>(null);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);

  // Check admin and load lead
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        const userRole = idTokenResult.claims.role as string | undefined;
        if (userRole === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/admin/dashboard');
        }
      }).catch(() => {
        router.push('/admin/dashboard');
      });
    }
  }, [user, loading, router]);

  // Load lead data
  useEffect(() => {
    const loadData = async () => {
      if (!leadId || !isAdmin) return;

      try {
        setIsLoading(true);
        const leadData = await getLeadById(leadId);
        if (leadData) {
          const activities = await getActivityLogs(50);
          const leadActivities = activities.filter(a => a.relatedLeadId === leadId);
          setLead({ ...leadData, activities: leadActivities });
          setNotes(leadData.notes || '');
        } else {
          router.push('/admin/dashboard/leads');
        }
      } catch (error) {
        console.error('Error loading lead:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [leadId, isAdmin, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateLeadStatus = async (status: Lead['status']) => {
    if (!lead) return;

    try {
      setIsSaving(true);
      await updateLead(lead.id, { status, updatedAt: new Date().toISOString() });
      setLead({ ...lead, status });

      // Create activity log
      await createActivityLog(
        'lead_found',
        `Status Updated to ${status}`,
        `Lead status was updated to ${status}`,
        lead.id,
        lead.priorityLevel
      );

      // Create notification based on status
      if (status === 'Consultation Ready') {
        await createNotification(
          'consultation_ready',
          `Consultation Ready: ${lead.fullName}`,
          `Lead status updated to Consultation Ready`,
          'urgent',
          lead.id
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addNote = async () => {
    if (!lead || !newNote.trim()) return;

    try {
      setIsSaving(true);
      const updatedNotes = notes ? `${notes}\n\n---\n[${new Date().toLocaleString()}]\n${newNote}` : `[${new Date().toLocaleString()}]\n${newNote}`;
      await updateLead(lead.id, { notes: updatedNotes, updatedAt: new Date().toISOString() });
      setLead({ ...lead, notes: updatedNotes });
      setNotes(updatedNotes);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleGenerateMessages = async () => {
    if (!lead) return;

    try {
      setIsGeneratingMessages(true);
      const messages = await generateAndSaveMessages(lead);
      if (messages) {
        setGeneratedMessages(messages);
        setShowMessageModal(true);
      } else {
        alert('❌ Error generating messages');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error generating messages');
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const handleMarkMessageSent = async () => {
    if (!lead) return;

    try {
      const success = await markMessageAsSent(lead.id, lead.fullName, lead.priorityLevel);
      if (success) {
        // Reload lead to show updated status
        const updatedLead = await getLeadById(lead.id);
        if (updatedLead) {
          const activities = await getActivityLogs(50);
          const leadActivities = activities.filter(a => a.relatedLeadId === lead.id);
          setLead({ ...updatedLead, activities: leadActivities });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
          <p style={{ color: '#5E6470' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
          <p style={{ color: '#5E6470' }}>Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold" style={{ color: '#071C3C' }}>Lead Not Found</h1>
          <Link href="/admin/dashboard/leads" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return { bg: '#FEE2E2', color: '#DC2626', badge: '🔴' };
      case 'Medium': return { bg: '#FEF3C7', color: '#92400E', badge: '🟡' };
      case 'Low': return { bg: '#DCFCE7', color: '#15803D', badge: '🟢' };
      default: return { bg: '#F3F4F6', color: '#6B7280', badge: '⚫' };
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; color: string }> = {
      'New': { bg: '#DBEAFE', color: '#1E40AF' },
      'Reviewed': { bg: '#FEF3C7', color: '#92400E' },
      'Message Prepared': { bg: '#E9D5FF', color: '#6B21A8' },
      'Contacted': { bg: '#DCFCE7', color: '#15803D' },
      'Follow-up Needed': { bg: '#FED7AA', color: '#B45309' },
      'Consultation Ready': { bg: '#DBEAFE', color: '#1E40AF' },
      'Converted': { bg: '#DCFCE7', color: '#15803D' },
      'Not Relevant': { bg: '#F3F4F6', color: '#6B7280' },
    };
    return statusMap[status] || { bg: '#F3F4F6', color: '#6B7280' };
  };

  const priColor = getPriorityColor(lead.priorityLevel);
  const statColor = getStatusColor(lead.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard/leads" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#071C3C' }}>
                {lead.fullName}
              </h1>
              <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
                {lead.companyName || 'Individual'} • {lead.country}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
            style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold" style={{ color: '#5E6470' }}>Status</p>
            <p className="text-sm font-bold mt-2 flex items-center gap-2" style={{ color: statColor.color }}>
              <span className="text-lg">📋</span>
              {lead.status}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold" style={{ color: '#5E6470' }}>Priority</p>
            <p className="text-sm font-bold mt-2 flex items-center gap-2" style={{ color: priColor.color }}>
              <span className="text-lg">{priColor.badge}</span>
              {lead.priorityLevel} ({lead.priorityScore}%)
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold" style={{ color: '#5E6470' }}>Service</p>
            <p className="text-sm font-bold mt-2 flex items-center gap-2" style={{ color: '#1E2430' }}>
              <Briefcase className="w-4 h-4" />
              {lead.serviceInterest}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold" style={{ color: '#5E6470' }}>Budget</p>
            <p className="text-sm font-bold mt-2 flex items-center gap-2" style={{ color: '#15803D' }}>
              <DollarSign className="w-4 h-4" />
              {lead.estimatedBudget}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { id: 'summary', label: 'Summary', icon: '📋' },
              { id: 'analysis', label: 'AI Analysis', icon: '🤖' },
              { id: 'timeline', label: 'Timeline', icon: '📅' },
              { id: 'messages', label: 'Messages', icon: '✉️' },
              { id: 'notes', label: 'Notes', icon: '📝' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-[#C9A35A] text-[#C9A35A]'
                    : 'border-transparent text-[#5E6470] hover:text-[#1E2430]'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>📧 Email</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.email}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>📞 Phone</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>💬 WhatsApp</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.whatsapp || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Location Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>🌍 Nationality</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.nationality || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>🏠 Current Residence</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.currentResidence || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>📍 Country</p>
                        <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Lead Source</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: '#5E6470' }}>📌 Source Channel</p>
                      <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.sourceChannel}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#5E6470' }}>🔗 Source URL</p>
                      {lead.sourceUrl ? (
                        <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold mt-1 text-blue-600 hover:underline">
                          Visit Source
                        </a>
                      ) : (
                        <p className="text-sm font-semibold mt-1" style={{ color: '#5E6470' }}>Not provided</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Lead Qualification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: '#5E6470' }}>⚡ Urgency</p>
                      <p className="text-sm font-semibold mt-1" style={{ color: '#1E2430' }}>{lead.urgency}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#5E6470' }}>📊 Priority Score</p>
                      <div className="mt-1 w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                        <div className="h-2 rounded-full" style={{ width: `${lead.priorityScore}%`, backgroundColor: priColor.color }}></div>
                      </div>
                      <p className="text-xs font-semibold mt-1" style={{ color: priColor.color }}>{lead.priorityScore}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#1E2430' }}>
                    <TrendingUp className="w-4 h-4" />
                    Why This Lead Is Relevant
                  </h3>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                    <p style={{ color: '#5E6470' }}>
                      {lead.aiSummary || 'Analysis pending. Lead shows strong potential based on priority scoring and service interest alignment.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#1E2430' }}>
                    <AlertCircle className="w-4 h-4" />
                    Recommended Next Action
                  </h3>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF8E8' }}>
                    <p style={{ color: '#92400E' }}>
                      {lead.aiRecommendedAction || 'Prepare customized service proposal. Schedule consultation within 24 hours.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color: '#DC2626' }}>
                      ⚠️ Risk Level
                    </p>
                    <p className="text-sm" style={{ color: '#1E2430' }}>Low</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color: '#1E40AF' }}>
                      📋 Missing Info
                    </p>
                    <p className="text-sm" style={{ color: '#1E2430' }}>None critical</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color: '#15803D' }}>
                      ✓ Best Service
                    </p>
                    <p className="text-sm" style={{ color: '#1E2430' }}>{lead.serviceInterest}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {lead.activities && lead.activities.length > 0 ? (
                  lead.activities.map((activity, i) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>{activity.actionType}</p>
                        <p className="text-sm mt-1" style={{ color: '#5E6470' }}>{activity.description}</p>
                        <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94A3B8' }}>No activity recorded yet</p>
                )}
              </motion.div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Generate Messages Button */}
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerateMessages}
                    disabled={isGeneratingMessages}
                    className="px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: isGeneratingMessages ? '#CBD5E0' : '#C9A35A', color: '#071C3C' }}
                  >
                    <Zap className={`w-4 h-4 ${isGeneratingMessages ? 'animate-spin' : ''}`} />
                    {isGeneratingMessages ? 'Generating...' : 'Generate Messages'}
                  </button>
                </div>

                {/* Message Status */}
                {lead.status === 'Message Prepared' && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
                    <p className="text-sm font-semibold" style={{ color: '#15803D' }}>
                      ✅ Messages have been prepared and sent to this lead
                    </p>
                  </div>
                )}

                {generatedMessages ? (
                  <>
                    {/* Email Template */}
                    <div>
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#1E2430' }}>
                        📧 Email Message
                      </h3>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 font-mono text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#1E2430' }}>
                        {generatedMessages.email}
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedMessages.email)}
                        className="mt-3 px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
                        style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                      >
                        <Copy className="w-4 h-4" />
                        Copy Email
                      </button>
                    </div>

                    {/* WhatsApp Template */}
                    <div>
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#1E2430' }}>
                        💬 WhatsApp Message
                      </h3>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#1E2430' }}>
                        {generatedMessages.whatsapp}
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedMessages.whatsapp)}
                        className="mt-3 px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
                        style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                      >
                        <Copy className="w-4 h-4" />
                        Copy WhatsApp
                      </button>
                    </div>

                    {/* LinkedIn Template */}
                    <div>
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#1E2430' }}>
                        💼 LinkedIn Message
                      </h3>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#1E2430' }}>
                        {generatedMessages.linkedin}
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedMessages.linkedin)}
                        className="mt-3 px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
                        style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
                      >
                        <Copy className="w-4 h-4" />
                        Copy LinkedIn
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-lg border border-gray-200" style={{ backgroundColor: '#F3F4F6' }}>
                    <p style={{ color: '#5E6470' }}>
                      Click "Generate Messages" to create compliance-safe message templates for this lead based on their service interest and priority level.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: '#1E2430' }}>Add New Note</h3>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add internal notes about this lead..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A] resize-none"
                    rows={4}
                  />
                  <button
                    onClick={addNote}
                    disabled={isSaving}
                    className="mt-3 px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                    style={{ backgroundColor: isSaving ? '#CBD5E0' : '#C9A35A', color: '#071C3C' }}
                  >
                    {isSaving ? '💾 Saving...' : '💾 Save Note'}
                  </button>
                </div>

                {notes && (
                  <div>
                    <h3 className="text-sm font-bold mb-3" style={{ color: '#1E2430' }}>Previous Notes</h3>
                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 whitespace-pre-wrap text-xs leading-relaxed" style={{ color: '#1E2430' }}>
                      {notes}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#1E2430' }}>
            <Users className="w-4 h-4" />
            Team Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Reviewed', icon: '✓', action: 'Reviewed' },
              { label: 'Contacted', icon: '📞', action: 'Contacted' },
              { label: 'Message Prepared', icon: '✉️', action: 'Message Prepared' },
              { label: 'Follow-up Due', icon: '📅', action: 'Follow-up Needed' },
              { label: 'Consultation Ready', icon: '✅', action: 'Consultation Ready' },
              { label: 'Converted', icon: '🎉', action: 'Converted' },
            ].map((btn) => (
              <button
                key={btn.action}
                onClick={() => updateLeadStatus(btn.action as any)}
                disabled={isSaving || lead.status === btn.action}
                className="px-3 py-2 text-xs font-semibold rounded-lg transition-all text-center flex flex-col items-center gap-1"
                style={{
                  backgroundColor: lead.status === btn.action ? '#C9A35A' : '#F3F4F6',
                  color: lead.status === btn.action ? '#FFFFFF' : '#5E6470',
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Message Templates Modal */}
        <MessageTemplatesModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          messages={generatedMessages}
          leadName={lead.fullName}
          onMarkSent={handleMarkMessageSent}
        />
      </main>
    </div>
  );
}
