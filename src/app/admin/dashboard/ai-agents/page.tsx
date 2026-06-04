'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Play, Pause, Settings, Eye, Trash2, Plus, Bell, RefreshCw,
  CheckCircle, Clock, AlertCircle, TrendingUp, Activity, ArrowLeft, X,
  BarChart3, Zap, Shield, Volume2, Timer, Target, Sliders, LineChart,
  PieChart, CheckSquare, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

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
  settings?: {
    processingSpeed: 'slow' | 'normal' | 'fast';
    notificationFrequency: 'minimal' | 'normal' | 'detailed';
    accuracyThreshold: number;
    autoEscalation: boolean;
    maxConcurrentTasks: number;
  };
}

interface AgentActivity {
  id: string;
  agentId: string;
  action: string;
  timestamp: string;
  details: string;
  status: 'success' | 'pending' | 'failed';
  taskId?: string;
  duration?: number;
}

interface AgentAlert {
  id: string;
  agentId: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startedAt: string;
  estimatedCompletion: string;
  details: string;
}

export default function AIAgentsPage() {
  const { isRTL } = useLanguage();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [alerts, setAlerts] = useState<AgentAlert[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMonitorModal, setShowMonitorModal] = useState(false);
  const [settingsData, setSettingsData] = useState({
    processingSpeed: 'normal' as const,
    notificationFrequency: 'normal' as const,
    accuracyThreshold: 95,
    autoEscalation: true,
    maxConcurrentTasks: 15,
  });

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
        performance: 98,
        settings: {
          processingSpeed: 'normal',
          notificationFrequency: 'normal',
          accuracyThreshold: 95,
          autoEscalation: true,
          maxConcurrentTasks: 15,
        }
      }
    ];

    const defaultActivities: AgentActivity[] = [
      {
        id: '1',
        agentId: 'ai-case-manager-01',
        action: 'Processed Enquiry',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        details: 'Analysed and assigned case #ENQ-2026-0847 to Case Manager',
        status: 'success',
        duration: 45
      },
      {
        id: '2',
        agentId: 'ai-case-manager-01',
        action: 'Sent Notification',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        details: 'Document deadline reminder sent to client (3 days remaining)',
        status: 'success',
        duration: 12
      },
      {
        id: '3',
        agentId: 'ai-case-manager-01',
        action: 'Updated Status',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        details: 'Case #CASE-2026-0521 status changed to Under Review',
        status: 'success',
        duration: 8
      },
      {
        id: '4',
        agentId: 'ai-case-manager-01',
        action: 'Generated Report',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        details: 'Weekly performance report generated (98% accuracy)',
        status: 'success',
        duration: 120
      },
      {
        id: '5',
        agentId: 'ai-case-manager-01',
        action: 'Processing Documents',
        timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
        details: '5 documents being verified and categorized',
        status: 'pending',
        duration: 67
      }
    ];

    const defaultTasks: Task[] = [
      {
        id: 'task-001',
        name: 'Process Enquiry #ENQ-2026-0847',
        status: 'completed',
        priority: 'high',
        progress: 100,
        startedAt: new Date(Date.now() - 120 * 60000).toISOString(),
        estimatedCompletion: new Date(Date.now() - 75 * 60000).toISOString(),
        details: 'EU Residency case - Automatically assigned to EU Specialist'
      },
      {
        id: 'task-002',
        name: 'Verify Document Set - Case #2026-0521',
        status: 'in_progress',
        priority: 'high',
        progress: 65,
        startedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 10 * 60000).toISOString(),
        details: 'Checking 8 documents for completeness and authenticity'
      },
      {
        id: 'task-003',
        name: 'Send Deadline Reminders',
        status: 'in_progress',
        priority: 'medium',
        progress: 45,
        startedAt: new Date(Date.now() - 3 * 60000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 2 * 60000).toISOString(),
        details: 'Sending reminders to 15 clients with upcoming deadlines'
      },
      {
        id: 'task-004',
        name: 'Generate Weekly Report',
        status: 'pending',
        priority: 'medium',
        progress: 0,
        startedAt: new Date(Date.now() + 120 * 60000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 240 * 60000).toISOString(),
        details: 'Scheduled for 2:00 PM - Performance metrics analysis'
      },
      {
        id: 'task-005',
        name: 'Review Failed Document Upload',
        status: 'failed',
        priority: 'critical',
        progress: 10,
        startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
        estimatedCompletion: new Date(Date.now() - 20 * 60000).toISOString(),
        details: 'PDF validation failed - requires manual review'
      },
      {
        id: 'task-006',
        name: 'Process Case Status Updates',
        status: 'completed',
        priority: 'medium',
        progress: 100,
        startedAt: new Date(Date.now() - 240 * 60000).toISOString(),
        estimatedCompletion: new Date(Date.now() - 200 * 60000).toISOString(),
        details: 'Updated 23 cases based on document verification results'
      },
    ];

    const defaultAlerts: AgentAlert[] = [
      {
        id: '1',
        agentId: 'ai-case-manager-01',
        level: 'success',
        message: '✓ Case Manager AI is performing optimally',
        timestamp: new Date(Date.now() - 3000).toISOString(),
        read: false
      },
      {
        id: '2',
        agentId: 'ai-case-manager-01',
        level: 'info',
        message: 'ℹ Processed 5 new enquiries in last hour',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        read: false
      },
      {
        id: '3',
        agentId: 'ai-case-manager-01',
        level: 'warning',
        message: '⚠ 2 documents require manual review due to quality',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false
      },
      {
        id: '4',
        agentId: 'ai-case-manager-01',
        level: 'error',
        message: '✕ Failed to process document upload - PDF corrupted',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false
      },
    ];

    setAgents(defaultAgents);
    setActivities(defaultActivities);
    setAlerts(defaultAlerts);
    setTasks(defaultTasks);
    setSelectedAgent(defaultAgents[0]);
    setSettingsData(defaultAgents[0].settings || settingsData);
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
      message: agents.find(a => a.id === agentId)?.status === 'active' ? '⏸ Agent paused' : '▶ Agent resumed',
      timestamp: new Date().toISOString(),
      read: false
    };
    setAlerts([newAlert, ...alerts]);
    setUnreadAlerts(unreadAlerts + 1);

    if (selectedAgent?.id === agentId) {
      setSelectedAgent(agents.find(a => a.id === agentId) || null);
    }
  };

  const saveSettings = () => {
    if (selectedAgent) {
      setAgents(agents.map(a =>
        a.id === selectedAgent.id
          ? { ...a, settings: settingsData }
          : a
      ));
      setSelectedAgent({ ...selectedAgent, settings: settingsData });
    }
    setShowSettingsModal(false);

    const newAlert: AgentAlert = {
      id: String(Date.now()),
      agentId: selectedAgent?.id || '',
      level: 'success',
      message: '✓ Agent settings updated successfully',
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

  const getStatusColor = (status: AIAgent['status']) => {
    switch(status) {
      case 'active': return { bg: '#DCFCE7', color: '#15803D', dot: '🟢' };
      case 'paused': return { bg: '#FEF3C7', color: '#92400E', dot: '🟡' };
      case 'offline': return { bg: '#F3F4F6', color: '#6B7280', dot: '⚫' };
      case 'error': return { bg: '#FEE2E2', color: '#DC2626', dot: '🔴' };
      default: return { bg: '#F3F4F6', color: '#6B7280', dot: '⚫' };
    }
  };

  const getAlertColor = (level: AgentAlert['level']) => {
    switch(level) {
      case 'success': return { bg: '#DCFCE7', color: '#15803D', icon: '✓' };
      case 'info': return { bg: '#DBEAFE', color: '#1E40AF', icon: 'ℹ' };
      case 'warning': return { bg: '#FEF3C7', color: '#92400E', icon: '⚠' };
      case 'error': return { bg: '#FEE2E2', color: '#DC2626', icon: '✕' };
      default: return { bg: '#F3F4F6', color: '#6B7280', icon: '•' };
    }
  };

  const getTaskStatusColor = (status: Task['status']) => {
    switch(status) {
      case 'completed': return { bg: '#DCFCE7', color: '#15803D', icon: '✓', label: 'Completed' };
      case 'in_progress': return { bg: '#FEF3C7', color: '#92400E', icon: '⏳', label: 'In Progress' };
      case 'pending': return { bg: '#DBEAFE', color: '#1E40AF', icon: '◯', label: 'Pending' };
      case 'failed': return { bg: '#FEE2E2', color: '#DC2626', icon: '✕', label: 'Failed' };
      default: return { bg: '#F3F4F6', color: '#6B7280', icon: '•', label: 'Unknown' };
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch(priority) {
      case 'critical': return { bg: '#FEE2E2', color: '#DC2626', label: '🔴 Critical' };
      case 'high': return { bg: '#FEF3C7', color: '#92400E', label: '🟠 High' };
      case 'medium': return { bg: '#DBEAFE', color: '#1E40AF', label: '🔵 Medium' };
      case 'low': return { bg: '#DCFCE7', color: '#15803D', label: '🟢 Low' };
      default: return { bg: '#F3F4F6', color: '#6B7280', label: 'Unknown' };
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
              </Link>
              <div>
                <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430' }}>
                  <Bot className="w-7 h-7 inline-block mr-3" style={{ color: '#C9A35A' }} />
                  AI Agents Control Center
                </h1>
                <p className="text-xs mt-1" style={{ color: '#5E6470' }}>
                  Manage and monitor all AI agents in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 cursor-pointer" style={{ color: '#C9A35A' }} />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#DC2626' }}>
                    {unreadAlerts}
                  </span>
                )}
              </div>
              <button className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                <Plus className="w-4 h-4" />
                Add Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedAgent && (
          <>
            {/* Agent Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left - Agent Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: '#1E2430' }}>{selectedAgent.name}</h2>
                      <p className="text-sm mt-1" style={{ color: '#5E6470' }}>{selectedAgent.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => toggleAgentStatus(selectedAgent.id)}
                        className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Toggle agent status"
                      >
                        {selectedAgent.status === 'active' ? (
                          <Pause className="w-5 h-5" style={{ color: '#C9A35A' }} />
                        ) : (
                          <Play className="w-5 h-5" style={{ color: '#C9A35A' }} />
                        )}
                      </button>
                      <button
                        onClick={() => { setShowMonitorModal(true); }}
                        className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Monitor and view detailed metrics"
                      >
                        <Eye className="w-5 h-5" style={{ color: '#5E6470' }} />
                      </button>
                      <button
                        onClick={() => { setShowSettingsModal(true); }}
                        className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Configure agent settings"
                      >
                        <Settings className="w-5 h-5" style={{ color: '#5E6470' }} />
                      </button>
                      <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <Trash2 className="w-5 h-5" style={{ color: '#DC2626' }} />
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                      <p className="text-xs" style={{ color: '#5E6470' }}>Status</p>
                      <p className="text-sm font-bold mt-1" style={{ color: getStatusColor(selectedAgent.status).color }}>
                        {selectedAgent.status === 'active' ? '🟢 Active' : '🟡 Paused'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                      <p className="text-xs" style={{ color: '#5E6470' }}>Uptime</p>
                      <p className="text-sm font-bold mt-1" style={{ color: '#15803D' }}>{selectedAgent.uptime}%</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                      <p className="text-xs" style={{ color: '#5E6470' }}>Completed</p>
                      <p className="text-sm font-bold mt-1" style={{ color: '#1E40AF' }}>{selectedAgent.tasksCompleted}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                      <p className="text-xs" style={{ color: '#5E6470' }}>In Progress</p>
                      <p className="text-sm font-bold mt-1" style={{ color: '#9333EA' }}>{selectedAgent.tasksInProgress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Performance */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold" style={{ color: '#5E6470' }}>Uptime</span>
                      <span className="text-xs font-bold" style={{ color: '#15803D' }}>{selectedAgent.uptime}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: `${selectedAgent.uptime}%`, backgroundColor: '#15803D' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold" style={{ color: '#5E6470' }}>Accuracy</span>
                      <span className="text-xs font-bold" style={{ color: '#1E40AF' }}>98%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '98%', backgroundColor: '#1E40AF' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold" style={{ color: '#5E6470' }}>Error Rate</span>
                      <span className="text-xs font-bold" style={{ color: '#DC2626' }}>{selectedAgent.errorRate}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: `${selectedAgent.errorRate}%`, backgroundColor: '#DC2626' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tasks Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#1E2430' }}>
                    <CheckSquare className="w-5 h-5" style={{ color: '#C9A35A' }} />
                    Active Tasks & Queue
                  </h3>
                  <span className="text-xs px-2 py-1 rounded font-bold" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                    {tasks.length} Total
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {tasks.map((task) => {
                    const taskStatus = getTaskStatusColor(task.status);
                    const taskPriority = getPriorityColor(task.priority);
                    return (
                      <motion.div
                        key={task.id}
                        whileHover={{ backgroundColor: '#F9FAFB' }}
                        className="p-4 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" style={{ backgroundColor: taskStatus.bg, color: taskStatus.color }}>
                            {taskStatus.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>{task.name}</p>
                              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: taskPriority.bg, color: taskPriority.color }}>
                                {taskPriority.label}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: '#5E6470' }} className="mb-2">{task.details}</p>
                            <div className="flex items-center gap-4 text-xs" style={{ color: '#94A3B8' }}>
                              <span>{taskStatus.label}</span>
                              {(task.status === 'in_progress' || task.status === 'completed') && (
                                <span>Progress: {task.progress}%</span>
                              )}
                            </div>
                            {(task.status === 'in_progress' || task.status === 'completed') && (
                              <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#E5E7EB' }}>
                                <div className="h-1.5 rounded-full" style={{ width: `${task.progress}%`, backgroundColor: taskStatus.color }}></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Capabilities & Live Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Capabilities */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Capabilities</h3>
                  <div className="space-y-2">
                    {selectedAgent.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#15803D' }} />
                        <span className="text-sm" style={{ color: '#1E2430' }}>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Live Activity */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold" style={{ color: '#1E2430' }}>Live Activity</h3>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <RefreshCw className="w-4 h-4" style={{ color: '#5E6470' }} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {activities.filter(a => a.agentId === selectedAgent.id).map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" style={{
                            backgroundColor: activity.status === 'success' ? '#DCFCE7' : activity.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                            color: activity.status === 'success' ? '#15803D' : activity.status === 'pending' ? '#92400E' : '#DC2626'
                          }}>
                            {activity.status === 'success' && '✓'}
                            {activity.status === 'pending' && '⏳'}
                            {activity.status === 'failed' && '✕'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold" style={{ color: '#1E2430' }}>{activity.action}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#5E6470' }}>{activity.details}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                              {new Date(activity.timestamp).toLocaleTimeString()} {activity.duration && `(${activity.duration}s)`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Alerts & Notifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#1E2430' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: '#C9A35A' }} />
                  Alerts & Notifications
                </h3>
                {unreadAlerts > 0 && (
                  <button className="text-xs font-semibold" style={{ color: '#C9A35A' }}>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-100">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-10 h-10 mx-auto mb-2" style={{ color: '#CBD5E0' }} />
                    <p className="text-xs" style={{ color: '#94A3B8' }}>No alerts</p>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const alertStyle = getAlertColor(alert.level);
                    return (
                      <motion.div
                        key={alert.id}
                        whileHover={{ backgroundColor: '#F9FAFB' }}
                        className="p-4 flex items-start gap-3 transition-colors cursor-pointer"
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5" style={{ backgroundColor: alertStyle.bg, color: alertStyle.color }}>
                          {alertStyle.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold" style={{ color: '#1E2430' }}>{alert.message}</p>
                          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                            {new Date(alert.timestamp).toLocaleTimeString()}
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
          </>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowSettingsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>
                <Sliders className="w-5 h-5 inline-block mr-2" style={{ color: '#C9A35A' }} />
                Agent Settings
              </h2>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Processing Speed */}
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  <Zap className="w-4 h-4 inline-block mr-2" style={{ color: '#C9A35A' }} />
                  Processing Speed
                </label>
                <select
                  value={settingsData.processingSpeed}
                  onChange={(e) => setSettingsData({ ...settingsData, processingSpeed: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                >
                  <option value="slow">Slow (Quality Focus)</option>
                  <option value="normal">Normal (Balanced)</option>
                  <option value="fast">Fast (Speed Focus)</option>
                </select>
              </div>

              {/* Notification Frequency */}
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#1E2430' }}>
                  <Volume2 className="w-4 h-4 inline-block mr-2" style={{ color: '#C9A35A' }} />
                  Notification Frequency
                </label>
                <select
                  value={settingsData.notificationFrequency}
                  onChange={(e) => setSettingsData({ ...settingsData, notificationFrequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                >
                  <option value="minimal">Minimal (Errors Only)</option>
                  <option value="normal">Normal (Important Only)</option>
                  <option value="detailed">Detailed (All Actions)</option>
                </select>
              </div>

              {/* Accuracy Threshold */}
              <div>
                <label className="text-sm font-semibold block mb-3" style={{ color: '#1E2430' }}>
                  <Target className="w-4 h-4 inline-block mr-2" style={{ color: '#C9A35A' }} />
                  Accuracy Threshold: <span style={{ color: '#C9A35A' }}>{settingsData.accuracyThreshold}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settingsData.accuracyThreshold}
                  onChange={(e) => setSettingsData({ ...settingsData, accuracyThreshold: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs mt-2" style={{ color: '#5E6470' }}>Minimum confidence level for automated decisions</p>
              </div>

              {/* Max Concurrent Tasks */}
              <div>
                <label className="text-sm font-semibold block mb-3" style={{ color: '#1E2430' }}>
                  <Timer className="w-4 h-4 inline-block mr-2" style={{ color: '#C9A35A' }} />
                  Max Concurrent Tasks: <span style={{ color: '#C9A35A' }}>{settingsData.maxConcurrentTasks}</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={settingsData.maxConcurrentTasks}
                  onChange={(e) => setSettingsData({ ...settingsData, maxConcurrentTasks: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs mt-2" style={{ color: '#5E6470' }}>Maximum number of tasks to process simultaneously</p>
              </div>

              {/* Auto Escalation */}
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <label className="text-sm font-semibold flex items-center gap-2" style={{ color: '#1E2430' }}>
                  <Shield className="w-4 h-4" style={{ color: '#C9A35A' }} />
                  Auto-Escalation
                </label>
                <button
                  onClick={() => setSettingsData({ ...settingsData, autoEscalation: !settingsData.autoEscalation })}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ backgroundColor: settingsData.autoEscalation ? '#15803D' : '#E5E7EB' }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{ transform: settingsData.autoEscalation ? 'translateX(22px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                style={{ color: '#5E6470' }}
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Monitor Modal */}
      {showMonitorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowMonitorModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: '#1E2430' }}>
                <LineChart className="w-5 h-5 inline-block mr-2" style={{ color: '#C9A35A' }} />
                Agent Monitor & Metrics
              </h2>
              <button onClick={() => setShowMonitorModal(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Performance Metrics */}
              <div>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2430' }}>Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs" style={{ color: '#5E6470' }}>Current Load</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#1E40AF' }}>73%</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>12 of 15 slots used</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs" style={{ color: '#5E6470' }}>Avg Response Time</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#0F766E' }}>240ms</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Excellent</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs" style={{ color: '#5E6470' }}>Success Rate</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#15803D' }}>98.5%</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>5 failures today</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs" style={{ color: '#5E6470' }}>Uptime Today</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#15803D' }}>99.9%</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>1 restart event</p>
                  </div>
                </div>
              </div>

              {/* Hourly Activity */}
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: '#1E2430' }}>Hourly Activity (Last 24h)</h3>
                <div className="flex items-end justify-between h-32 p-4 rounded-lg border border-gray-200" style={{ backgroundColor: '#F8F9FA' }}>
                  {[65, 78, 45, 92, 73, 88, 52, 95, 68, 81, 45, 72, 85, 76, 90, 67, 89, 71, 94, 65, 88, 76, 82, 79].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-1 rounded-t" style={{ height: `${(h / 100) * 120}px`, backgroundColor: '#C9A35A' }}></div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: '#5E6470' }}>Peak usage: 12:00 PM (95 tasks)</p>
              </div>

              {/* Task Distribution */}
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: '#1E2430' }}>Task Distribution</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
                    <span className="text-xs font-semibold">✓ Completed</span>
                    <span className="text-xs font-bold" style={{ color: '#15803D' }}>347 (88%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                    <span className="text-xs font-semibold">⏳ In Progress</span>
                    <span className="text-xs font-bold" style={{ color: '#92400E' }}>12 (3%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
                    <span className="text-xs font-semibold">◯ Pending</span>
                    <span className="text-xs font-bold" style={{ color: '#1E40AF' }}>28 (7%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
                    <span className="text-xs font-semibold">✕ Failed</span>
                    <span className="text-xs font-bold" style={{ color: '#DC2626' }}>5 (1%)</span>
                  </div>
                </div>
              </div>

              {/* Top Capabilities by Usage */}
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: '#1E2430' }}>Top Capabilities by Usage</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">Case Assignment</span>
                      <span className="text-xs" style={{ color: '#C9A35A' }}>42%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '42%', backgroundColor: '#C9A35A' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">Document Tracking</span>
                      <span className="text-xs" style={{ color: '#1E40AF' }}>28%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '28%', backgroundColor: '#1E40AF' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">Status Updates</span>
                      <span className="text-xs" style={{ color: '#0F766E' }}>18%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '18%', backgroundColor: '#0F766E' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">Notifications</span>
                      <span className="text-xs" style={{ color: '#9333EA' }}>12%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div className="h-2 rounded-full" style={{ width: '12%', backgroundColor: '#9333EA' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
