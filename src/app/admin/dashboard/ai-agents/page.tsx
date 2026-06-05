'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Play, Pause, Settings, Eye, Bell, RefreshCw,
  CheckCircle, AlertCircle, ArrowLeft, X,
  Zap, Shield, Volume2, Timer, Target, Sliders,
  AlertTriangle, User, Phone, Mail, MapPin, Calendar,
  FileText, Clock, CheckSquare, Wifi, WifiOff
} from 'lucide-react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface CaseRow {
  'Date': string;
  'Lead ID': string;
  'Full Name': string;
  'Email': string;
  'Phone / WhatsApp': string;
  'Current Country of Residence': string;
  'Preferred Language': string;
  'Service Needed': string;
  'Urgency': string;
  'Family Members Names': string;
  'Family Members Numbers': string;
  'Preferred Contact Method': string;
  'Short Case Description': string;
  'Lead Status': string;
  'Assigned To': string;
  'Next Follow-Up Date': string;
  'Notes': string;
}

interface AgentSettings {
  processingSpeed: 'slow' | 'normal' | 'fast';
  notificationFrequency: 'minimal' | 'normal' | 'detailed';
  accuracyThreshold: number;
  autoEscalation: boolean;
  maxConcurrentTasks: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'New':          { bg: '#DBEAFE', color: '#1E40AF' },
  'Contacted':    { bg: '#FEF3C7', color: '#92400E' },
  'In Progress':  { bg: '#E9D5FF', color: '#6B21A8' },
  'Qualified':    { bg: '#DCFCE7', color: '#15803D' },
  'Serious':      { bg: '#FED7AA', color: '#B45309' },
  'Closed':       { bg: '#D1FAE5', color: '#065F46' },
  'Rejected':     { bg: '#FEE2E2', color: '#DC2626' },
};

const URGENCY_COLORS: Record<string, { bg: string; color: string; badge: string }> = {
  'Critical': { bg: '#FEE2E2', color: '#DC2626', badge: '🔴' },
  'High':     { bg: '#FEF3C7', color: '#B45309', badge: '🟠' },
  'Normal':   { bg: '#DBEAFE', color: '#1E40AF', badge: '🔵' },
  'Low':      { bg: '#DCFCE7', color: '#15803D', badge: '🟢' },
};

function getStatusStyle(status: string) {
  return STATUS_COLORS[status] || { bg: '#F3F4F6', color: '#6B7280' };
}

function getUrgencyStyle(urgency: string) {
  return URGENCY_COLORS[urgency] || { bg: '#F3F4F6', color: '#6B7280', badge: '⚫' };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AIAgentsPage() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'active' | 'paused'>('active');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [alerts, setAlerts] = useState<{ id: string; msg: string; level: 'success' | 'warning' | 'error' }[]>([]);
  const [settings, setSettings] = useState<AgentSettings>({
    processingSpeed: 'normal',
    notificationFrequency: 'normal',
    accuracyThreshold: 95,
    autoEscalation: true,
    maxConcurrentTasks: 15,
  });

  // ── Load cases from sheet ──────────────────────────────────────────────────
  const loadCases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/agent/cases', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load cases');
      }

      setCases(data.cases || []);
      setIsConnected(true);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message || 'Could not connect to Google Sheet');
      setIsConnected(false);
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadCases(); }, [loadCases]);

  // ── Update case status in sheet ───────────────────────────────────────────
  const handleUpdateCase = async () => {
    if (!selectedCase) return;
    try {
      setIsUpdating(true);
      const res = await fetch('/api/agent/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          leadId: selectedCase['Lead ID'],
          status: updateStatus || selectedCase['Lead Status'],
          notes: updateNotes || selectedCase['Notes'],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      addAlert('✅ Case updated in Google Sheet', 'success');
      setShowCaseModal(false);
      await loadCases();
    } catch (err: any) {
      addAlert(`❌ Update failed: ${err.message}`, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const addAlert = (msg: string, level: 'success' | 'warning' | 'error') => {
    const id = String(Date.now());
    setAlerts(prev => [{ id, msg, level }, ...prev.slice(0, 9)]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 6000);
  };

  const openCase = (c: CaseRow) => {
    setSelectedCase(c);
    setUpdateStatus(c['Lead Status']);
    setUpdateNotes(c['Notes']);
    setShowCaseModal(true);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total: cases.length,
    new: cases.filter(c => c['Lead Status'] === 'New').length,
    inProgress: cases.filter(c => ['Contacted', 'In Progress', 'Qualified', 'Serious'].includes(c['Lead Status'])).length,
    closed: cases.filter(c => c['Lead Status'] === 'Closed').length,
    urgent: cases.filter(c => ['High', 'Critical'].includes(c['Urgency'])).length,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
              </Link>
              <div>
                <h1 className="text-2xl font-serif font-bold flex items-center gap-3" style={{ color: '#1E2430' }}>
                  <Bot className="w-7 h-7" style={{ color: '#C9A35A' }} />
                  Case Manager AI
                </h1>
                <p className="text-xs mt-1 flex items-center gap-2" style={{ color: '#5E6470' }}>
                  {isConnected ? (
                    <><Wifi className="w-3 h-3 text-green-500" /><span className="text-green-600 font-medium">Connected to Google Sheet</span></>
                  ) : (
                    <><WifiOff className="w-3 h-3 text-red-400" /><span className="text-red-500 font-medium">Not connected to Google Sheet</span></>
                  )}
                  {lastRefresh && <span className="text-gray-400 ml-2">· Last sync: {lastRefresh.toLocaleTimeString()}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadCases}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} style={{ color: '#5E6470' }} />
              </button>
              <button
                onClick={() => setAgentStatus(s => s === 'active' ? 'paused' : 'active')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Toggle agent"
              >
                {agentStatus === 'active'
                  ? <Pause className="w-5 h-5" style={{ color: '#C9A35A' }} />
                  : <Play className="w-5 h-5" style={{ color: '#C9A35A' }} />}
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
              <span className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={agentStatus === 'active' ? { backgroundColor: '#DCFCE7', color: '#15803D' } : { backgroundColor: '#FEF3C7', color: '#92400E' }}>
                {agentStatus === 'active' ? '🟢 Active' : '🟡 Paused'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating alerts */}
      {alerts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {alerts.map(a => (
            <motion.div key={a.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              className="px-4 py-3 rounded-lg shadow-lg text-sm font-medium"
              style={{
                backgroundColor: a.level === 'success' ? '#DCFCE7' : a.level === 'error' ? '#FEE2E2' : '#FEF3C7',
                color: a.level === 'success' ? '#15803D' : a.level === 'error' ? '#DC2626' : '#92400E',
              }}>
              {a.msg}
            </motion.div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error / connection state */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border flex items-start gap-3"
            style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
            <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#DC2626' }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#DC2626' }}>Google Sheet connection failed</p>
              <p className="text-xs mt-1" style={{ color: '#B91C1C' }}>{error}</p>
              <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                Set <code className="bg-red-50 px-1 rounded">GOOGLE_CASES_WEB_APP_URL</code> in your environment variables to connect.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Cases', value: stats.total, color: '#1E40AF', icon: FileText },
            { label: 'New', value: stats.new, color: '#C9A35A', icon: Bell },
            { label: 'In Progress', value: stats.inProgress, color: '#9333EA', icon: Clock },
            { label: 'Closed', value: stats.closed, color: '#15803D', icon: CheckCircle },
            { label: 'Urgent', value: stats.urgent, color: '#DC2626', icon: AlertTriangle },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
                <p className="text-xs font-semibold" style={{ color: '#1E2430' }}>{s.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Case list */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#1E2430' }}>
              <CheckSquare className="w-5 h-5" style={{ color: '#C9A35A' }} />
              Leads CRM — Google Sheet
            </h3>
            <span className="text-xs px-2 py-1 rounded font-bold" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
              {cases.length} case{cases.length !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin" />
              <p className="text-sm" style={{ color: '#5E6470' }}>Loading cases from Google Sheet…</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              {isConnected ? (
                <>
                  <Bot className="w-12 h-12 mb-4" style={{ color: '#CBD5E0' }} />
                  <h3 className="text-base font-bold mb-2" style={{ color: '#1E2430' }}>No real cases yet</h3>
                  <p className="text-sm" style={{ color: '#5E6470' }}>
                    Cases from your Leads CRM Google Sheet will appear here automatically.
                  </p>
                </>
              ) : (
                <>
                  <WifiOff className="w-12 h-12 mb-4" style={{ color: '#CBD5E0' }} />
                  <h3 className="text-base font-bold mb-2" style={{ color: '#DC2626' }}>Google Sheet not connected</h3>
                  <p className="text-sm max-w-md" style={{ color: '#5E6470' }}>
                    Follow the setup instructions to connect your Leads CRM Google Sheet to this agent.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    {['Lead ID', 'Client', 'Service', 'Country', 'Urgency', 'Status', 'Assigned To', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-bold" style={{ color: '#1E2430' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c, i) => {
                    const statusStyle = getStatusStyle(c['Lead Status']);
                    const urgencyStyle = getUrgencyStyle(c['Urgency']);
                    return (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => openCase(c)}>
                        <td className="px-4 py-3 font-mono font-bold" style={{ color: '#C9A35A' }}>{c['Lead ID'] || '—'}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold" style={{ color: '#1E2430' }}>{c['Full Name']}</p>
                          <p className="text-xs" style={{ color: '#9CA3AF' }}>{c['Email']}</p>
                        </td>
                        <td className="px-4 py-3" style={{ color: '#5E6470' }}>{c['Service Needed']}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1" style={{ color: '#5E6470' }}>
                            <MapPin className="w-3 h-3" />{c['Current Country of Residence']}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ backgroundColor: urgencyStyle.bg, color: urgencyStyle.color }}>
                            {urgencyStyle.badge} {c['Urgency']}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                            {c['Lead Status'] || 'New'}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: '#5E6470' }}>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />{c['Assigned To'] || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: '#9CA3AF' }}>{c['Date']}</td>
                        <td className="px-4 py-3">
                          <button className="px-2 py-1 text-xs rounded font-semibold hover:brightness-110"
                            style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                            Manage
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Agent Capabilities */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Agent Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Automatic enquiry analysis',
              'Case assignment tracking',
              'Status updates via Sheet',
              'Document tracking',
              'Client notifications',
              'Deadline reminders',
            ].map((cap, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#15803D' }} />
                <span className="text-xs" style={{ color: '#1E2430' }}>{cap}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Case Detail Modal ─────────────────────────────────────────────── */}
      {showCaseModal && selectedCase && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCaseModal(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: '#1E2430' }}>
                {selectedCase['Full Name']}
                <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                  {selectedCase['Lead ID']}
                </span>
              </h2>
              <button onClick={() => setShowCaseModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { icon: Mail, label: 'Email', value: selectedCase['Email'] },
                  { icon: Phone, label: 'Phone', value: selectedCase['Phone / WhatsApp'] },
                  { icon: MapPin, label: 'Country', value: selectedCase['Current Country of Residence'] },
                  { icon: Zap, label: 'Service', value: selectedCase['Service Needed'] },
                  { icon: User, label: 'Language', value: selectedCase['Preferred Language'] },
                  { icon: Calendar, label: 'Follow-Up', value: selectedCase['Next Follow-Up Date'] || '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                    <p className="flex items-center gap-1 mb-1" style={{ color: '#9CA3AF' }}>
                      <Icon className="w-3 h-3" />{label}
                    </p>
                    <p className="font-semibold" style={{ color: '#1E2430' }}>{value || '—'}</p>
                  </div>
                ))}
              </div>

              {/* Case description */}
              {selectedCase['Short Case Description'] && (
                <div className="p-3 rounded-lg border-l-4" style={{ backgroundColor: '#FFFBEB', borderColor: '#C9A35A' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#92400E' }}>Case Description</p>
                  <p className="text-xs" style={{ color: '#1E2430' }}>{selectedCase['Short Case Description']}</p>
                </div>
              )}

              {/* Update status */}
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: '#1E2430' }}>Update Status</label>
                <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A]">
                  {['New', 'Contacted', 'In Progress', 'Qualified', 'Serious', 'Closed', 'Rejected'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: '#1E2430' }}>Notes</label>
                <textarea value={updateNotes} onChange={e => setUpdateNotes(e.target.value)} rows={3}
                  placeholder="Add notes about this case..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9A35A] resize-none" />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex gap-3">
              <button onClick={() => setShowCaseModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
                style={{ color: '#5E6470' }}>Cancel</button>
              <button onClick={handleUpdateCase} disabled={isUpdating}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C', opacity: isUpdating ? 0.6 : 1 }}>
                {isUpdating ? 'Saving to Sheet…' : 'Save to Google Sheet'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Settings Modal ────────────────────────────────────────────────── */}
      {showSettingsModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSettingsModal(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: '#1E2430' }}>
                <Sliders className="w-5 h-5" style={{ color: '#C9A35A' }} />Agent Settings
              </h2>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  <Zap className="w-4 h-4 inline mr-2" style={{ color: '#C9A35A' }} />Processing Speed
                </label>
                <select value={settings.processingSpeed}
                  onChange={e => setSettings({ ...settings, processingSpeed: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                  <option value="slow">Slow (Quality Focus)</option>
                  <option value="normal">Normal (Balanced)</option>
                  <option value="fast">Fast (Speed Focus)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  <Volume2 className="w-4 h-4 inline mr-2" style={{ color: '#C9A35A' }} />Notifications
                </label>
                <select value={settings.notificationFrequency}
                  onChange={e => setSettings({ ...settings, notificationFrequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                  <option value="minimal">Minimal (Errors Only)</option>
                  <option value="normal">Normal (Important Only)</option>
                  <option value="detailed">Detailed (All Actions)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  <Target className="w-4 h-4 inline mr-2" style={{ color: '#C9A35A' }} />
                  Accuracy Threshold: <span style={{ color: '#C9A35A' }}>{settings.accuracyThreshold}%</span>
                </label>
                <input type="range" min="50" max="100" value={settings.accuracyThreshold}
                  onChange={e => setSettings({ ...settings, accuracyThreshold: parseInt(e.target.value) })}
                  className="w-full" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  <Timer className="w-4 h-4 inline mr-2" style={{ color: '#C9A35A' }} />
                  Max Concurrent Tasks: <span style={{ color: '#C9A35A' }}>{settings.maxConcurrentTasks}</span>
                </label>
                <input type="range" min="5" max="50" value={settings.maxConcurrentTasks}
                  onChange={e => setSettings({ ...settings, maxConcurrentTasks: parseInt(e.target.value) })}
                  className="w-full" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <label className="text-sm font-semibold flex items-center gap-2" style={{ color: '#1E2430' }}>
                  <Shield className="w-4 h-4" style={{ color: '#C9A35A' }} />Auto-Escalation
                </label>
                <button onClick={() => setSettings({ ...settings, autoEscalation: !settings.autoEscalation })}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ backgroundColor: settings.autoEscalation ? '#15803D' : '#E5E7EB' }}>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{ transform: settings.autoEscalation ? 'translateX(22px)' : 'translateX(2px)' }} />
                </button>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex gap-3">
              <button onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
                style={{ color: '#5E6470' }}>Cancel</button>
              <button onClick={() => { setShowSettingsModal(false); addAlert('✅ Settings saved', 'success'); }}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>Save Settings</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
