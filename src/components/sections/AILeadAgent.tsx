'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Flame, Mail, Calendar, CheckCircle, Zap, TrendingUp,
  AlertCircle, Filter, Search, X, Phone, MapPin, Briefcase,
  DollarSign, Star, Clock, ArrowRight, ChevronDown
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  country: string;
  service: string;
  source: string;
  budget: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'Reviewed' | 'Message Prepared' | 'Contacted' | 'Follow-up Needed' | 'Consultation Ready' | 'Converted' | 'Not Relevant';
  assignedTo: string;
  lastContact: string;
  nextAction: string;
  company?: string;
}

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
  const [filterService, setFilterService] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const statCards = [
    { title: 'New Leads Found', value: 24, icon: Target, color: '#1E40AF', description: 'Today' },
    { title: 'Hot Leads', value: 8, icon: Flame, color: '#DC2626', description: 'Need action' },
    { title: 'Messages Prepared', value: 15, icon: Mail, color: '#0F766E', description: 'Ready to send' },
    { title: 'Follow-ups Due', value: 12, icon: Calendar, color: '#9333EA', description: 'Today' },
    { title: 'Consultations Ready', value: 5, icon: CheckCircle, color: '#15803D', description: 'Can book' },
    { title: 'Tasks Completed', value: 47, icon: Zap, color: '#C9A35A', description: 'Today' },
  ];

  const pipelineSteps: PipelineStep[] = [
    { id: '1', title: 'Target Client', description: 'Identify ideal clients', status: 'Done', count: 150 },
    { id: '2', title: 'Search Channels', description: 'Find leads online', status: 'Running', count: 85 },
    { id: '3', title: 'Collect Leads', description: 'Gather contact data', status: 'Running', count: 120 },
    { id: '4', title: 'Score Leads', description: 'Qualify leads', status: 'Done', count: 98 },
    { id: '5', title: 'Prepare Message', description: 'Create outreach', status: 'Running', count: 65 },
    { id: '6', title: 'Team Action', description: 'Manual follow-up', status: 'Pending', count: 32 },
    { id: '7', title: 'Consultation Booked', description: 'Meeting scheduled', status: 'Done', count: 18 },
  ];

  const recentActivities: Activity[] = [
    { id: '1', time: '02:15 PM', action: 'New Lead Found', lead: 'Sarah Johnson', service: 'EU Residency', priority: 'High', status: 'New', nextStep: 'Send introduction email' },
    { id: '2', time: '02:08 PM', action: 'Message Prepared', lead: 'Acme Corp', service: 'Business Setup', priority: 'Medium', status: 'Message Prepared', nextStep: 'Team review' },
    { id: '3', time: '01:45 PM', action: 'Lead Qualified', lead: 'Michael Chen', service: 'Investment', priority: 'High', status: 'Reviewed', nextStep: 'Prepare proposal' },
    { id: '4', time: '01:32 PM', action: 'Follow-up Scheduled', lead: 'Global Tech Ltd', service: 'Visa Sponsorship', priority: 'Medium', status: 'Follow-up Needed', nextStep: 'Call tomorrow 10 AM' },
    { id: '5', time: '01:15 PM', action: 'Consultation Booked', lead: 'Emma Wilson', service: 'Residency', priority: 'High', status: 'Consultation Ready', nextStep: 'Meeting at 3 PM' },
  ];

  const hotAlerts: HotAlert[] = [
    { id: '1', lead: 'John Patel', company: 'TechStart India', reason: 'High budget + urgent timeline', action: 'Call immediately', priority: 'Critical' },
    { id: '2', lead: 'Lisa Mueller', company: 'EU Consulting', reason: 'Decision maker available now', action: 'Send proposal today', priority: 'High' },
    { id: '3', lead: 'David Park', company: 'Asia Holdings', reason: 'Perfect fit + high engagement', action: 'Schedule consultation', priority: 'High' },
  ];

  const leads: Lead[] = [
    { id: '1', name: 'John Patel', country: 'India', service: 'Investment', source: 'LinkedIn', budget: '$500K+', priority: 'High', status: 'Reviewed', assignedTo: 'Ahmed', lastContact: '2h ago', nextAction: 'Send proposal', company: 'TechStart India' },
    { id: '2', name: 'Sarah Johnson', country: 'USA', service: 'EU Residency', source: 'Referral', budget: '$200K', priority: 'High', status: 'New', assignedTo: 'Unassigned', lastContact: '5m ago', nextAction: 'Send intro email', company: 'Self-employed' },
    { id: '3', name: 'Lisa Mueller', country: 'Germany', service: 'Business Setup', source: 'Google', budget: '$100K', priority: 'Medium', status: 'Message Prepared', assignedTo: 'Sofia', lastContact: '1d ago', nextAction: 'Call tomorrow', company: 'EU Consulting' },
    { id: '4', name: 'Michael Chen', country: 'Singapore', service: 'Investment', source: 'Email', budget: '$1M+', priority: 'High', status: 'Consultation Ready', assignedTo: 'Ahmed', lastContact: '3h ago', nextAction: 'Meeting booked', company: 'Asia Holdings' },
    { id: '5', name: 'Emma Wilson', country: 'UK', service: 'Visa Sponsorship', source: 'Website', budget: '$50K', priority: 'Medium', status: 'Contacted', assignedTo: 'Sofia', lastContact: 'Now', nextAction: 'Follow-up', company: 'Global Tech Ltd' },
    { id: '6', name: 'David Park', country: 'South Korea', service: 'Residency', source: 'LinkedIn', budget: '$300K', priority: 'High', status: 'Follow-up Needed', assignedTo: 'Ahmed', lastContact: '12h ago', nextAction: 'Schedule call', company: 'Park Industries' },
    { id: '7', name: 'Anna Rossi', country: 'Italy', service: 'Business Setup', source: 'Referral', budget: '$150K', priority: 'Low', status: 'Not Relevant', assignedTo: 'Unassigned', lastContact: '2d ago', nextAction: 'Archive', company: 'Rossi & Co' },
    { id: '8', name: 'Tom Anderson', country: 'Canada', service: 'Investment', source: 'Google', budget: '$250K', priority: 'Medium', status: 'Message Prepared', assignedTo: 'Sofia', lastContact: '6h ago', nextAction: 'Send documents', company: 'Anderson Ventures' },
  ];

  const filteredLeads = leads.filter(lead => {
    if (searchTerm && !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) && !lead.company?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterService !== 'All' && lead.service !== filterService) return false;
    if (filterPriority !== 'All' && lead.priority !== filterPriority) return false;
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
    if (filterSource !== 'All' && lead.source !== filterSource) return false;
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
    switch(status) {
      case 'New': return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'Reviewed': return { bg: '#FEF3C7', color: '#92400E' };
      case 'Message Prepared': return { bg: '#E9D5FF', color: '#6B21A8' };
      case 'Contacted': return { bg: '#DCFCE7', color: '#15803D' };
      case 'Follow-up Needed': return { bg: '#FED7AA', color: '#B45309' };
      case 'Consultation Ready': return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'Converted': return { bg: '#DCFCE7', color: '#15803D' };
      case 'Not Relevant': return { bg: '#F3F4F6', color: '#6B7280' };
      default: return { bg: '#F3F4F6', color: '#6B7280' };
    }
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

  return (
    <div style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold" style={{ color: '#071C3C' }}>
            🤖 AI Lead Agent Control Center
          </h2>
          <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
            Real-time lead generation and qualification automation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, i) => {
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
              {recentActivities.map((activity) => {
                const actColor = getStatusColor(activity.status);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" style={{ backgroundColor: actColor.bg, color: actColor.color }}>
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-bold" style={{ color: '#1E2430' }}>{activity.action}</p>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>{activity.time}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#5E6470' }}>
                        <span className="font-semibold">{activity.lead}</span> • {activity.service}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: getPriorityColor(activity.priority).bg, color: getPriorityColor(activity.priority).color }}>
                          {getPriorityColor(activity.priority).badge} {activity.priority}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: actColor.bg, color: actColor.color }}>
                          {activity.status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                          📋 {activity.nextStep}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Hot Alerts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#1E2430' }}>
              <Flame className="w-5 h-5" style={{ color: '#DC2626' }} />
              Hot Lead Alerts
            </h3>
            <div className="space-y-3">
              {hotAlerts.map((alert) => (
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
              ))}
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
                  {filterType === 'Service Interest' && ['EU Residency', 'Business Setup', 'Investment', 'Visa Sponsorship', 'Residency'].map(s => <option key={s} value={s}>{s}</option>)}
                  {filterType === 'Priority' && ['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                  {filterType === 'Status' && ['New', 'Reviewed', 'Message Prepared', 'Contacted', 'Follow-up Needed', 'Consultation Ready'].map(st => <option key={st} value={st}>{st}</option>)}
                  {filterType === 'Source' && ['LinkedIn', 'Referral', 'Google', 'Email', 'Website'].map(src => <option key={src} value={src}>{src}</option>)}
                  {filterType === 'Country' && ['India', 'USA', 'Germany', 'Singapore', 'UK', 'South Korea', 'Italy', 'Canada'].map(c => <option key={c} value={c}>{c}</option>)}
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
                  <th className="text-left px-3 py-3 font-bold" style={{ color: '#1E2430' }}>Next Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const priColor = getPriorityColor(lead.priority);
                  const statColor = getStatusColor(lead.status);
                  return (
                    <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">
                        <p className="font-semibold" style={{ color: '#1E2430' }}>{lead.name}</p>
                        {lead.company && <p style={{ color: '#5E6470' }}>{lead.company}</p>}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        <MapPin className="w-3 h-3 inline-block mr-1" />
                        {lead.country}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        <Briefcase className="w-3 h-3 inline-block mr-1" />
                        {lead.service}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>{lead.source}</td>
                      <td className="px-3 py-3">
                        <DollarSign className="w-3 h-3 inline-block mr-1" style={{ color: '#15803D' }} />
                        <span style={{ color: '#15803D', fontWeight: 'bold' }}>{lead.budget}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: priColor.bg, color: priColor.color }}>
                          {priColor.badge} {lead.priority}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: statColor.bg, color: statColor.color }}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        {lead.assignedTo === 'Unassigned' ? <span style={{ color: '#DC2626' }}>⚠️ {lead.assignedTo}</span> : lead.assignedTo}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#5E6470' }}>
                        <Clock className="w-3 h-3 inline-block mr-1" />
                        {lead.lastContact}
                      </td>
                      <td className="px-3 py-3" style={{ color: '#1E40AF', fontWeight: 'bold' }}>→ {lead.nextAction}</td>
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
    </div>
  );
}
