'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Zap, Activity, BarChart3, AlertCircle, Clock, CheckCircle,
  Play, Pause, Settings, Eye, Trash2, Plus, TrendingUp, Users,
  FileText, MessageSquare, Bell, LogOut, RefreshCw, Edit
} from 'lucide-react';
import AgentShell from '@/components/agent/AgentShell';

interface AIAgent {
  id: string;
  name: string;
  type: 'case_manager' | 'document_processor' | 'communication' | 'analytics';
  status: 'active' | 'paused' | 'offline' | 'error';
  uptime: number;
  tasksCompleted: number;
  tasksInProgress: number;
  errorRate: number;
  lastActivity: string;
  description: string;
  capabilities: string[];
  performance: number;
}

interface AgentActivity {
  id: string;
  agentId: string;
  action: string;
  timestamp: string;
  details: string;
  status: 'success' | 'pending' | 'failed';
}

interface AgentAlert {
  id: string;
  agentId: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [view, setView] = useState<'overview' | 'monitor' | 'settings'>('overview');
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  // Initialize with default AI agent
  useEffect(() => {
    const defaultAgents: AIAgent[] = [
      {
        id: 'ai-case-manager-01',
        name: 'Case Manager AI',
        type: 'case_manager',
        status: 'active',
        uptime: 99.8,
        tasksCompleted: 347,
        tasksInProgress: 12,
        errorRate: 0.2,
        lastActivity: new Date().toISOString(),
        description: 'Smart automation for case processing and client management',
        capabilities: [
          'Automatic enquiry analysis',
          'Case assignment',
          'Status updates',
          'Document tracking',
          'Client notifications',
          'Deadline reminders'
        ],
        performance: 98
      }
    ];

    const defaultActivities: AgentActivity[] = [
      {
        id: '1',
        agentId: 'ai-case-manager-01',
        action: 'Processed Enquiry',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        details: 'Analysed and assigned case #ENQ-2026-0847 to Case Manager',
        status: 'success'
      },
      {
        id: '2',
        agentId: 'ai-case-manager-01',
        action: 'Sent Notification',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        details: 'Document deadline reminder sent to client (3 days remaining)',
        status: 'success'
      },
      {
        id: '3',
        agentId: 'ai-case-manager-01',
        action: 'Updated Status',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        details: 'Case #CASE-2026-0521 status changed to Under Review',
        status: 'success'
      },
      {
        id: '4',
        agentId: 'ai-case-manager-01',
        action: 'Generated Report',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        details: 'Weekly performance report generated (98% accuracy)',
        status: 'success'
      },
      {
        id: '5',
        agentId: 'ai-case-manager-01',
        action: 'Processing Documents',
        timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
        details: '5 documents being verified and categorized',
        status: 'pending'
      }
    ];

    const defaultAlerts: AgentAlert[] = [
      {
        id: '1',
        agentId: 'ai-case-manager-01',
        level: 'success',
        message: 'Case Manager AI is performing optimally',
        timestamp: new Date(Date.now() - 3000).toISOString(),
        read: false
      },
      {
        id: '2',
        agentId: 'ai-case-manager-01',
        level: 'info',
        message: 'Processed 5 new enquiries in last hour',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        read: false
      },
      {
        id: '3',
        agentId: 'ai-case-manager-01',
        level: 'warning',
        message: '2 documents require manual review due to quality',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false
      }
    ];

    setAgents(defaultAgents);
    setActivities(defaultActivities);
    setAlerts(defaultAlerts);
    setSelectedAgent(defaultAgents[0]);
    setUnreadAlerts(defaultAlerts.filter(a => !a.read).length);
  }, []);

  const toggleAgentStatus = (agentId: string) => {
    setAgents(agents.map(a =>
      a.id === agentId
        ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
        : a
    ));

    const newAlert: AgentAlert = {
      id: String(Date.now()),
      agentId,
      level: agents.find(a => a.id === agentId)?.status === 'active' ? 'warning' : 'success',
      message: `Agent ${agents.find(a => a.id === agentId)?.status === 'active' ? 'paused' : 'resumed'}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setAlerts([newAlert, ...alerts]);
    setUnreadAlerts(unreadAlerts + 1);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(alerts.map(a =>
      a.id === alertId ? { ...a, read: true } : a
    ));
    setUnreadAlerts(Math.max(0, unreadAlerts - 1));
  };

  const markAllAlertsAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
    setUnreadAlerts(0);
  };

  const getAgentColor = (type: AIAgent['type']) => {
    switch(type) {
      case 'case_manager': return '#1E40AF';
      case 'document_processor': return '#9333EA';
      case 'communication': return '#0F766E';
      case 'analytics': return '#EA580C';
      default: return '#5E6470';
    }
  };

  const getAlertColor = (level: AgentAlert['level']) => {
    switch(level) {
      case 'success': return { bg: '#DCFCE7', color: '#15803D', icon: CheckCircle };
      case 'info': return { bg: '#DBEAFE', color: '#1E40AF', icon: Activity };
      case 'warning': return { bg: '#FEF3C7', color: '#92400E', icon: AlertCircle };
      case 'error': return { bg: '#FEE2E2', color: '#DC2626', icon: AlertCircle };
      default: return { bg: '#F3F4F6', color: '#6B7280', icon: Activity };
    }
  };

  const getStatusColor = (status: AIAgent['status']) => {
    switch(status) {
      case 'active': return { bg: '#DCFCE7', color: '#15803D' };
      case 'paused': return { bg: '#FEF3C7', color: '#92400E' };
      case 'offline': return { bg: '#F3F4F6', color: '#6B7280' };
      case 'error': return { bg: '#FEE2E2', color: '#DC2626' };
      default: return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <AgentShell>
      <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold" style={{ color: '#1E2430' }}>
                  <Bot className="w-8 h-8 inline-block mr-3" style={{ color: '#C9A35A' }} />
                  AI Agent Control Center
                </h1>
                <p className="text-sm mt-2" style={{ color: '#5E6470' }}>
                  Monitor, control, and optimize your AI agents in real-time
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bell className="w-6 h-6" style={{ color: '#C9A35A' }} />
                  {unreadAlerts > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}>
                      {unreadAlerts}
                    </span>
                  )}
                </div>
                <button className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                  <Plus className="w-4 h-4" />
                  Add Agent
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Agents List */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>Active Agents</h2>
                  <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                    {agents.filter(a => a.status === 'active').length}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {agents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      className="p-4 cursor-pointer transition-colors"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFF8E8' }}>
                          <Bot className="w-5 h-5" style={{ color: getAgentColor(agent.type) }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>{agent.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.status === 'active' ? '#15803D' : '#9CA3AF' }}></div>
                            <p className="text-xs" style={{ color: '#5E6470' }}>
                              {agent.status === 'active' ? 'Online' : 'Paused'} • {agent.tasksInProgress} tasks
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0" style={getStatusColor(agent.status)}>
                          {agent.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Overall Performance</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs" style={{ color: '#5E6470' }}>Uptime</span>
                      <span className="text-xs font-bold" style={{ color: '#C9A35A' }}>99.8%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '99.8%', backgroundColor: '#15803D' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs" style={{ color: '#5E6470' }}>Accuracy</span>
                      <span className="text-xs font-bold" style={{ color: '#C9A35A' }}>98%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '98%', backgroundColor: '#15803D' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs" style={{ color: '#5E6470' }}>Error Rate</span>
                      <span className="text-xs font-bold" style={{ color: '#C9A35A' }}>0.2%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '0.2%', backgroundColor: '#DC2626' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Agent Details & Monitoring */}
            <div className="lg:col-span-2">
              {selectedAgent && (
                <>
                  {/* Agent Header */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold" style={{ color: '#1E2430' }}>{selectedAgent.name}</h2>
                        <p className="text-sm mt-1" style={{ color: '#5E6470' }}>{selectedAgent.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAgentStatus(selectedAgent.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Toggle agent"
                        >
                          {selectedAgent.status === 'active' ? (
                            <Pause className="w-5 h-5" style={{ color: '#C9A35A' }} />
                          ) : (
                            <Play className="w-5 h-5" style={{ color: '#C9A35A' }} />
                          )}
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
                          <Settings className="w-5 h-5" style={{ color: '#5E6470' }} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Monitor">
                          <Eye className="w-5 h-5" style={{ color: '#5E6470' }} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" style={{ color: '#DC2626' }} />
                        </button>
                      </div>
                    </div>

                    {/* Agent Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>Status</p>
                        <p className="text-lg font-bold mt-1" style={{ color: getStatusColor(selectedAgent.status).color }}>
                          {selectedAgent.status === 'active' ? '🟢 Active' : '🟡 Paused'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>Uptime</p>
                        <p className="text-lg font-bold mt-1" style={{ color: '#15803D' }}>{selectedAgent.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>Completed</p>
                        <p className="text-lg font-bold mt-1" style={{ color: '#1E40AF' }}>{selectedAgent.tasksCompleted}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: '#5E6470' }}>In Progress</p>
                        <p className="text-lg font-bold mt-1" style={{ color: '#9333EA' }}>{selectedAgent.tasksInProgress}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Capabilities */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#1E2430' }}>Capabilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedAgent.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#15803D' }} />
                          <span className="text-sm" style={{ color: '#1E2430' }}>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Activity Feed */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Live Activity</h3>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Refresh">
                        <RefreshCw className="w-4 h-4" style={{ color: '#5E6470' }} />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                      {activities.filter(a => a.agentId === selectedAgent.id).map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                              backgroundColor: activity.status === 'success' ? '#DCFCE7' : activity.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                              color: activity.status === 'success' ? '#15803D' : activity.status === 'pending' ? '#92400E' : '#DC2626'
                            }}>
                              {activity.status === 'success' && <CheckCircle className="w-4 h-4" />}
                              {activity.status === 'pending' && <Clock className="w-4 h-4" />}
                              {activity.status === 'failed' && <AlertCircle className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>{activity.action}</p>
                              <p className="text-xs mt-1" style={{ color: '#5E6470' }}>{activity.details}</p>
                              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                                {new Date(activity.timestamp).toLocaleTimeString('en-GB')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Alerts Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Alerts & Notifications</h3>
              {unreadAlerts > 0 && (
                <button onClick={markAllAlertsAsRead} className="text-xs font-semibold" style={{ color: '#C9A35A' }}>
                  Mark all as read
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E0' }} />
                  <p className="text-sm" style={{ color: '#94A3B8' }}>No alerts at the moment</p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const alertStyle = getAlertColor(alert.level);
                  const Icon = alertStyle.icon;
                  return (
                    <motion.div
                      key={alert.id}
                      whileHover={{ backgroundColor: '#F9FAFB' }}
                      className="p-4 flex items-start gap-4 transition-colors cursor-pointer"
                      onClick={() => markAlertAsRead(alert.id)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: alertStyle.color }} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>{alert.message}</p>
                        <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                          {new Date(alert.timestamp).toLocaleTimeString('en-GB')}
                        </p>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: '#C9A35A' }}></div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AgentShell>
  );
}
