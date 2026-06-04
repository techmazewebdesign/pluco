'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Flame, Mail, Calendar, CheckCircle, Zap, TrendingUp,
  AlertCircle, Filter, Search, X, Phone, MapPin, Briefcase,
  DollarSign, Star, Clock, ArrowRight, AlertTriangle, Plus, Download, RefreshCw, Upload
} from 'lucide-react';
import { Lead, AgentTask, AgentActivityLog, AgentNotification, PriorityLevel, LEAD_EXPORT_STATUS_LABELS } from '@/lib/types';
import {
  getLeads,
  getAgentTasks,
  getActivityLogs,
  getNotifications,
  generateDemoLeads,
  generateDemoTasks
} from '@/lib/services/aiLeadAgentService';
import AddLeadModal from '@/components/admin/AddLeadModal';
import ImportCSVModal from '@/components/admin/ImportCSVModal';
import { useLeadOperations } from '@/lib/hooks/useLeadOperations';

interface PipelineStep {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Running' | 'Done' | 'Needs Review';
  count: number;
}

interface Activity {
  id: string;
  time: string;
  action: string;
  lead: string;
  service: string;
  priority: string;
  status: string;
  nextStep: string;
}

interface HotAlert {
  id: string;
  lead: string;
  company: string;
  reason: string;
  action: string;
  priority: 'Critical' | 'High' | 'Medium';
}

export default function AILeadAgent() {
  const { recalculateAllScores, downloadCSV, exportLeadsToGoogleSheet } = useLeadOperations();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [activities, setActivities] = useState<AgentActivityLog[]>([]);
  const [notifications, setNotifications] = useState<AgentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showImportCSVModal, setShowImportCSVModal] = useState(false);

  const [filterService, setFilterService] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Load data from Firebase
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [leadsData, tasksData, activitiesData, notificationsData] = await Promise.all([
        getLeads(),
        getAgentTasks(),
        getActivityLogs(20),
        getNotifications(),
      ]);

      // Use demo data if no real data exists
      setLeads(leadsData.length > 0 ? leadsData : generateDemoLeads());
      setTasks(tasksData.length > 0 ? tasksData : generateDemoTasks());
      setActivities(activitiesData);
      setNotifications(notificationsData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      // Fallback to demo data on error
      setLeads(generateDemoLeads());
      setTasks(generateDemoTasks());
      setError('Using demo data - could not load from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecalculateScores = async () => {
    try {
      setIsRecalculating(true);
      const result = await recalculateAllScores();
      alert(`✅ Recalculation complete!\nUpdated: ${result.updated} leads`);
      await loadData(); // Reload data after recalculation
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error recalculating scores');
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      await downloadCSV();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error downloading CSV');
    }
  };

  const handleExportToGoogleSheet = async () => {
    try {
      setIsExporting(true);
      const result = await exportLeadsToGoogleSheet();
      if (result.success > 0) {
        alert(`✅ ${result.message}`);
        await loadData();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error exporting to Google Sheet');
    } finally {
      setIsExporting(false);
    }
  };

  // Compute stats
  const stats = [
    {
      title: 'New Leads Found',
      value: leads.filter(l => l.status === 'New').length,
      icon: Target,
      color: '#1E40AF',
      description: 'Today'
    },
    {
      title: 'Hot Leads',
      value: leads.filter(l => l.priorityLevel === 'High').length,
      icon: Flame,
      color: '#DC2626',
      description: 'Need action'
    },
    {
      title: 'Messages Prepared',
      value: leads.filter(l => l.status === 'Message Prepared').length,
      icon: Mail,
      color: '#0F766E',
      description: 'Ready to send'
    },
    {
      title: 'Follow-ups Due',
      value: leads.filter(l => {
        if (!l.nextFollowUpAt) return false;
        const followUpDate = new Date(l.nextFollowUpAt);
        const today = new Date();
        return followUpDate.toDateString() === today.toDateString();
      }).length,
      icon: Calendar,
      color: '#9333EA',
      description: 'Today'
    },
    {
      title: 'Consultations Ready',
      value: leads.filter(l => l.status === 'Consultation Ready').length,
      icon: CheckCircle,
      color: '#15803D',
      description: 'Can book'
    },
    {
      title: 'Tasks Completed',
      value: tasks.filter(t => t.status === 'completed').length,
      icon: Zap,
      color: '#C9A35A',
      description: 'Today'
    },
  ];

  const pipelineSteps: PipelineStep[] = [
    { id: '1', title: 'Target Client', description: 'Identify ideal clients', status: 'Done', count: leads.length },
    { id: '2', title: 'Search Channels', description: 'Find leads online', status: 'Running', count: leads.filter(l => l.status === 'New').length },
    { id: '3', title: 'Collect Leads', description: 'Gather contact data', status: 'Running', count: leads.filter(l => l.status === 'Reviewed').length },
    { id: '4', title: 'Score Leads', description: 'Qualify leads', status: 'Done', count: leads.filter(l => l.priorityScore >= 70).length },
    { id: '5', title: 'Prepare Message', description: 'Create outreach', status: 'Running', count: leads.filter(l => l.status === 'Message Prepared').length },
    { id: '6', title: 'Team Action', description: 'Manual follow-up', status: 'Running', count: leads.filter(l => l.status === 'Contacted').length },
    { id: '7', title: 'Consultation Booked', description: 'Meeting scheduled', status: 'Done', count: leads.filter(l => l.status === 'Consultation Ready').length },
  ];

  const hotLeads: HotAlert[] = leads
    .filter(l => l.priorityLevel === 'High')
    .slice(0, 3)
    .map(lead => ({
      id: lead.id,
      lead: lead.fullName,
      company: lead.companyName || 'Self-employed',
      reason: `Budget: ${lead.estimatedBudget} | Priority: ${lead.priorityScore}%`,
      action: lead.status === 'Consultation Ready' ? 'Send consultation link' : 'Call immediately',
      priority: lead.priorityScore > 90 ? 'Critical' : 'High'
    }));

  const filteredLeads = leads.filter(lead => {
    const services = ['EU Residency', 'Business Setup', 'Investment', 'Visa Sponsorship', 'Residency'];
    if (searchTerm && !lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) && !lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterService !== 'All' && lead.serviceInterest !== filterService) return false;
    if (filterPriority !== 'All' && lead.priorityLevel !== filterPriority) return false;
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
    if (filterSource !== 'All' && lead.sourceChannel !== filterSource) return false;
    if (filterCountry !== 'All' && lead.country !== filterCountry) return false;
    return true;
  });

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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending': return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'Running': return { bg: '#FEF3C7', color: '#92400E' };
      case 'Done': return { bg: '#DCFCE7', color: '#15803D' };
      case 'Needs Review': return { bg: '#FEE2E2', color: '#DC2626' };
      default: return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
          <p style={{ color: '#5E6470' }}>Loading AI Lead Agent data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#FEF3C7' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#92400E' }} />
              <p className="text-sm" style={{ color: '#92400E' }}>{error}</p>
            </div>
          )}
          <h2 className="text-3xl font-serif font-bold" style={{ color: '#071C3C' }}>
            🤖 AI Lead Agent Control Center
          </h2>
          <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
            Real-time lead generation and qualification automation • {leads.length} leads in database
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors hover:brightness-110"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
            <button
              onClick={() => setShowImportCSVModal(true)}
              className="px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              onClick={handleRecalculateScores}
              disabled={isRecalculating}
              className="px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#F3F4F6', color: '#5E6470', opacity: isRecalculating ? 0.6 : 1 }}
            >
              <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />
              {isRecalculating ? 'Recalculating...' : 'Recalculate Scores'}
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#F3F4F6', color: '#5E6470' }}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportToGoogleSheet}
              disabled={isExporting}
              className="px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#F3F4F6', color: '#5E6470', opacity: isExporting ? 0.6 : 1 }}
            >
              <Zap className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export to Google Sheet'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: card.color }}>
                    {card.value}
                  </span>
                </div>
                <p className="text-xs font-semibold" style={{ color: '#1E2430' }}>{card.title}</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{card.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pipeline Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6" style={{ color: '#1E2430' }}>Lead Generation Pipeline</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {pipelineSteps.map((step, i) => {
                const stepBadge = getStatusBadge(step.status);
                return (
                  <div key={step.id} className="flex-shrink-0 min-w-max">
                    <div className="border border-gray-200 rounded-lg p-4 text-center" style={{ width: '160px' }}>
                      <div className="flex justify-center mb-3">
                        <Zap className="w-5 h-5" style={{ color: '#C9A35A' }} />
                      </div>
                      <p className="text-xs font-bold" style={{ color: '#1E2430' }}>{step.title}</p>
                      <p className="text-xs mt-2" style={{ color: '#5E6470' }}>{step.description}</p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <span className="text-sm font-bold" style={{ color: '#1E2430' }}>{step.count}</span>
                      </div>
                      <span className="inline-block text-xs font-semibold px-2 py-1 rounded mt-2" style={{ backgroundColor: stepBadge.bg, color: stepBadge.color }}>
                        {step.status}
                      </span>
                    </div>
                    {i < pipelineSteps.length - 1 && (
                      <div className="text-center mt-4 text-gray-400">
                        <ArrowRight className="w-4 h-4 mx-auto" style={{ transform: 'rotate(90deg)' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity & Hot Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1E2430' }}>Recent Agent Activity</h3>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-bold" style={{ color: '#1E2430' }}>{activity.actionType}</p>
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{new Date(activity.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#5E6470' }}>{activity.description}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: getPriorityColor(activity.priority).bg, color: getPriorityColor(activity.priority).color }}>
                        {getPriorityColor(activity.priority).badge} {activity.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hot Alerts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#1E2430' }}>
              <Flame className="w-5 h-5" style={{ color: '#DC2626' }} />
              Hot Lead Alerts ({hotLeads.length})
            </h3>
            <div className="space-y-3">
              {hotLeads.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: '#94A3B8' }}>No hot leads at this time</p>
              ) : (
                hotLeads.map((alert) => (
                  <div key={alert.id} className="border border-amber-200 rounded-lg p-4" style={{ backgroundColor: '#FFFBEB' }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#1E2430' }}>{alert.lead}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#5E6470' }}>{alert.company}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded whitespace-nowrap" style={{
                        backgroundColor: alert.priority === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                        color: alert.priority === 'Critical' ? '#DC2626' : '#92400E'
                      }}>
                        {alert.priority === 'Critical' ? '🔴' : '🟠'} {alert.priority}
                      </span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: '#5E6470' }}>
                      💡 {alert.reason}
                    </p>
                    <p className="text-xs font-semibold mb-3" style={{ color: '#92400E' }}>
                      → {alert.action}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 text-xs font-semibold px-2 py-2 rounded transition-colors" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                        ✓ Mark Contacted
                      </button>
                      <button className="flex-1 text-xs font-semibold px-2 py-2 rounded border" style={{ borderColor: '#D1D5DB', color: '#5E6470' }}>
                        + Follow-up
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Lead List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Lead Database</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search name or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#C9A35A]"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" style={{ color: '#5E6470' }} />
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200">
            {['Service Interest', 'Priority', 'Status', 'Source', 'Country'].map((filterType) => (
              <div key={filterType} className="text-xs">
                <select
                  value={filterType === 'Service Interest' ? filterService : filterType === 'Priority' ? filterPriority : filterType === 'Status' ? filterStatus : filterType === 'Source' ? filterSource : filterCountry}
                  onChange={(e) => {
                    if (filterType === 'Service Interest') setFilterService(e.target.value);
                    else if (filterType === 'Priority') setFilterPriority(e.target.value);
                    else if (filterType === 'Status') setFilterStatus(e.target.value);
                    else if (filterType === 'Source') setFilterSource(e.target.value);
                    else if (filterType === 'Country') setFilterCountry(e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none"
                >
                  <option value="All">{filterType}</option>
                  {filterType === 'Service Interest' && leads.map(l => l.serviceInterest).filter((v, i, a) => a.indexOf(v) === i).map(s => <option key={s} value={s}>{s}</option>)}
                  {filterType === 'Priority' && ['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                  {filterType === 'Status' && leads.map(l => l.status).filter((v, i, a) => a.indexOf(v) === i).map(st => <option key={st} value={st}>{st}</option>)}
                  {filterType === 'Source' && leads.map(l => l.sourceChannel).filter((v, i, a) => a.indexOf(v) === i).map(src => <option key={src} value={src}>{src}</option>)}
                  {filterType === 'Country' && leads.map(l => l.country).filter((v, i, a) => a.indexOf(v) === i).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Name</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Country</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Service</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Source</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Budget</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Priority</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Status</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Assigned</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Last Contact</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Sheet Export</th>
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Next Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const priColor = getPriorityColor(lead.priorityLevel);
                  const statColor = getStatusColor(lead.status);
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/admin/dashboard/leads/${lead.id}`}
                    >
                      <td className="px-3 py-3">
                        <p className="font-semibold hover:underline" style={{ color: '#1E2430' }}>{lead.fullName}</p>
                        {lead.companyName && <p style={{ color: '#5E6470' }}>{lead.companyName}</p>}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        <MapPin className="w-3 h-3 inline-block mr-1" />
                        {lead.country}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        <Briefcase className="w-3 h-3 inline-block mr-1" />
                        {lead.serviceInterest}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>{lead.sourceChannel}</td>
                      <td className="px-3 py-3">
                        <DollarSign className="w-3 h-3 inline-block mr-1" style={{ color: '#15803D' }} />
                        <span style={{ color: '#15803D', fontWeight: 'bold' }}>{lead.estimatedBudget}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: priColor.bg, color: priColor.color }}>
                          {priColor.badge} {lead.priorityLevel}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: statColor.bg, color: statColor.color }}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        {lead.assignedToName === 'Unassigned' || !lead.assignedToName ? <span style={{ color: '#DC2626' }}>⚠️ Unassigned</span> : lead.assignedToName}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        <Clock className="w-3 h-3 inline-block mr-1" />
                        {lead.lastContactAt ? new Date(lead.lastContactAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-3 py-3">
                        {lead.exportStatus ? (
                          <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: LEAD_EXPORT_STATUS_LABELS[lead.exportStatus].bg, color: LEAD_EXPORT_STATUS_LABELS[lead.exportStatus].color }}>
                            {LEAD_EXPORT_STATUS_LABELS[lead.exportStatus].icon} {lead.exportStatus}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                            ⭕ Not Exported
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#1E40AF', fontWeight: 'bold' }}>→ {lead.aiRecommendedAction || 'No action'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs" style={{ color: '#5E6470' }}>
              Showing {filteredLeads.length} of {leads.length} leads
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors">← Previous</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors">Next →</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddLeadModal}
        onClose={() => setShowAddLeadModal(false)}
        onLeadAdded={loadData}
      />
      <ImportCSVModal
        isOpen={showImportCSVModal}
        onClose={() => setShowImportCSVModal(false)}
        onImportComplete={loadData}
      />
    </div>
  );
}
