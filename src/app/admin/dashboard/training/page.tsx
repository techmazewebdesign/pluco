'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, BookOpen, Zap, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import { motion } from 'framer-motion';

export default function TrainingPage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'lead-agent' | 'case-agent' | 'automation' | 'checklist'>('overview');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setIsAdmin(true);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
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

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
          <p style={{ color: '#5E6470' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" style={{ color: '#5E6470' }} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#071C3C' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#C9A35A' }} />
                Agent Training Manual
              </h1>
              <p className="text-xs mt-1" style={{ color: '#5E6470' }}>Learn how to use PLUCO AI Agents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '📋 Overview', icon: BookOpen },
            { id: 'lead-agent', label: '🔥 Lead Agent', icon: Zap },
            { id: 'case-agent', label: '📋 Case Agent', icon: CheckCircle },
            { id: 'automation', label: '⚡ Automation', icon: Clock },
            { id: 'checklist', label: '✅ Checklist', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
              style={activeTab === tab.id ? { backgroundColor: '#C9A35A', color: '#071C3C' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* System Architecture */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E2430' }}>
                🏗️ System Architecture
              </h2>
              <div className="space-y-4">
                <svg className="w-full" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                  {/* Title */}
                  <text x="400" y="25" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                    PLUCO Lead Management System
                  </text>

                  {/* AI Lead Agent Box */}
                  <rect x="50" y="60" width="200" height="80" fill="#FFF8E8" stroke="#C9A35A" strokeWidth="2" rx="8" />
                  <text x="150" y="85" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                    🔥 AI Lead Agent
                  </text>
                  <text x="150" y="105" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Auto-scores leads
                  </text>
                  <text x="150" y="122" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Generates messages
                  </text>

                  {/* Case Manager Box */}
                  <rect x="300" y="60" width="200" height="80" fill="#DBEAFE" stroke="#1E40AF" strokeWidth="2" rx="8" />
                  <text x="400" y="85" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                    📋 Case Manager AI
                  </text>
                  <text x="400" y="105" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Tracks case pipeline
                  </text>
                  <text x="400" y="122" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Monitors deadlines
                  </text>

                  {/* Automation Box */}
                  <rect x="550" y="60" width="200" height="80" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" rx="8" />
                  <text x="650" y="85" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                    ⚡ Automation Layer
                  </text>
                  <text x="650" y="105" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Weekly reminders
                  </text>
                  <text x="650" y="122" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Email summaries
                  </text>

                  {/* Arrows down */}
                  <line x1="150" y1="140" x2="150" y2="160" stroke="#C9A35A" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <line x1="400" y1="140" x2="400" y2="160" stroke="#1E40AF" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <line x1="650" y1="140" x2="650" y2="160" stroke="#15803D" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* Google Sheet Box */}
                  <rect x="150" y="170" width="500" height="60" fill="#F8F9FA" stroke="#5E6470" strokeWidth="2" rx="8" />
                  <text x="400" y="195" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                    📊 Google Sheet Integration (Auto-Sync)
                  </text>
                  <text x="400" y="218" fontSize="12" textAnchor="middle" fill="#5E6470">
                    All leads, cases, and updates automatically exported for backup &amp; analysis
                  </text>

                  {/* Arrow marker definition */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#666" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF8E8' }}>
                    <Zap className="w-6 h-6" style={{ color: '#C9A35A' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Auto-Scoring</h3>
                </div>
                <p style={{ color: '#5E6470' }}>
                  Every lead scored 0-100 based on 6 criteria including service type, budget, urgency, and location.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <CheckCircle className="w-6 h-6" style={{ color: '#1E40AF' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>7-Stage Pipeline</h3>
                </div>
                <p style={{ color: '#5E6470' }}>
                  Cases move through Intake → Processing → Application → Review → Approval → Delivery → Follow-up.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                    <TrendingUp className="w-6 h-6" style={{ color: '#15803D' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#1E2430' }}>Smart Automation</h3>
                </div>
                <p style={{ color: '#5E6470' }}>
                  Weekly summaries, deadline alerts, and follow-up reminders sent automatically to both admins.
                </p>
              </div>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-[#071C3C] to-[#0B234A] rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">🚀 Quick Start (First Day)</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="font-bold">1.</span>
                  <span>Go to <code className="bg-black/30 px-2 py-1 rounded">/admin/dashboard/leads</code> and create your first test lead</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">2.</span>
                  <span>Watch it auto-score and appear in your Google Sheet within 30 seconds</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">3.</span>
                  <span>Click the lead and generate outreach messages</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">4.</span>
                  <span>Send a message and mark it as sent</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">5.</span>
                  <span>Update lead status as you progress through pipeline</span>
                </li>
              </ol>
            </div>
          </motion.div>
        )}

        {/* Lead Agent Tab */}
        {activeTab === 'lead-agent' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E2430' }}>
                🔥 AI Lead Agent - Complete Guide
              </h2>

              {/* Lead Scoring System */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1E2430' }}>How Leads Get Scored</h3>
                <svg className="w-full mb-6" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                  {/* Title */}
                  <text x="400" y="30" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                    Lead Scoring Formula (Max 100 Points)
                  </text>

                  {/* Scoring Criteria */}
                  <g>
                    {/* Service Type */}
                    <rect x="30" y="60" width="150" height="60" fill="#FFF8E8" stroke="#C9A35A" strokeWidth="2" rx="6" />
                    <text x="105" y="82" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                      Service Type
                    </text>
                    <text x="105" y="105" fontSize="12" textAnchor="middle" fill="#92400E">
                      +25 pts
                    </text>

                    {/* Budget */}
                    <rect x="210" y="60" width="150" height="60" fill="#DBEAFE" stroke="#1E40AF" strokeWidth="2" rx="6" />
                    <text x="285" y="82" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                      Budget
                    </text>
                    <text x="285" y="105" fontSize="12" textAnchor="middle" fill="#1E40AF">
                      +25 pts
                    </text>

                    {/* Urgency */}
                    <rect x="390" y="60" width="150" height="60" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" rx="6" />
                    <text x="465" y="82" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                      Urgency
                    </text>
                    <text x="465" y="105" fontSize="12" textAnchor="middle" fill="#92400E">
                      +20 pts
                    </text>

                    {/* Region */}
                    <rect x="570" y="60" width="150" height="60" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" rx="6" />
                    <text x="645" y="82" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                      Target Region
                    </text>
                    <text x="645" y="105" fontSize="12" textAnchor="middle" fill="#15803D">
                      +10 pts
                    </text>

                    {/* Contact Info */}
                    <rect x="30" y="150" width="150" height="60" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" rx="6" />
                    <text x="105" y="172" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                      Contact Info
                    </text>
                    <text x="105" y="195" fontSize="12" textAnchor="middle" fill="#DC2626">
                      +10 pts
                    </text>

                    {/* Email */}
                    <rect x="210" y="150" width="150" height="60" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" rx="6" />
                    <text x="285" y="172" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                      Email Provided
                    </text>
                    <text x="285" y="195" fontSize="12" textAnchor="middle" fill="#4F46E5">
                      +10 pts
                    </text>

                    {/* Total Score Box */}
                    <rect x="390" y="150" width="330" height="60" fill="#F3F4F6" stroke="#6B7280" strokeWidth="3" rx="6" />
                    <text x="555" y="172" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                      TOTAL SCORE
                    </text>
                    <text x="555" y="200" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#C9A35A">
                      0 - 100 Points
                    </text>
                  </g>

                  {/* Priority Levels */}
                  <text x="30" y="270" fontSize="15" fontWeight="bold" fill="#1E2430">Priority Levels:</text>

                  {/* High Priority */}
                  <rect x="30" y="290" width="220" height="70" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" rx="6" />
                  <text x="140" y="315" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#DC2626">
                    🔥 HIGH (75-100)
                  </text>
                  <text x="140" y="340" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Contact within 24 hours
                  </text>

                  {/* Medium Priority */}
                  <rect x="280" y="290" width="220" height="70" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" rx="6" />
                  <text x="390" y="315" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#92400E">
                    🟡 MEDIUM (45-74)
                  </text>
                  <text x="390" y="340" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Contact within 3-5 days
                  </text>

                  {/* Low Priority */}
                  <rect x="530" y="290" width="220" height="70" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" rx="6" />
                  <text x="640" y="315" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#15803D">
                    🟢 LOW (0-44)
                  </text>
                  <text x="640" y="340" fontSize="12" textAnchor="middle" fill="#5E6470">
                    Add to nurture list
                  </text>
                </svg>
              </div>

              {/* Lead Management Workflow */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1E2430' }}>Lead Management Workflow</h3>
                <svg className="w-full" viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg">
                  {/* Step 1 */}
                  <circle cx="80" cy="80" r="30" fill="#C9A35A" />
                  <text x="80" y="85" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">1</text>
                  <text x="80" y="130" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">Create Lead</text>
                  <text x="80" y="145" fontSize="11" textAnchor="middle" fill="#5E6470">Via form or</text>
                  <text x="80" y="158" fontSize="11" textAnchor="middle" fill="#5E6470">admin panel</text>

                  {/* Arrow 1 */}
                  <line x1="110" y1="80" x2="150" y2="80" stroke="#C9A35A" strokeWidth="3" />
                  <polygon points="160,80 150,75 150,85" fill="#C9A35A" />

                  {/* Step 2 */}
                  <circle cx="190" cy="80" r="30" fill="#C9A35A" />
                  <text x="190" y="85" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">2</text>
                  <text x="190" y="130" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">Auto-Score</text>
                  <text x="190" y="145" fontSize="11" textAnchor="middle" fill="#5E6470">AI calculates</text>
                  <text x="190" y="158" fontSize="11" textAnchor="middle" fill="#5E6470">0-100 score</text>

                  {/* Arrow 2 */}
                  <line x1="220" y1="80" x2="260" y2="80" stroke="#C9A35A" strokeWidth="3" />
                  <polygon points="270,80 260,75 260,85" fill="#C9A35A" />

                  {/* Step 3 */}
                  <circle cx="300" cy="80" r="30" fill="#C9A35A" />
                  <text x="300" y="85" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">3</text>
                  <text x="300" y="130" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">Export Sheet</text>
                  <text x="300" y="145" fontSize="11" textAnchor="middle" fill="#5E6470">Auto-sync to</text>
                  <text x="300" y="158" fontSize="11" textAnchor="middle" fill="#5E6470">Google Sheet</text>

                  {/* Arrow 3 */}
                  <line x1="330" y1="80" x2="370" y2="80" stroke="#C9A35A" strokeWidth="3" />
                  <polygon points="380,80 370,75 370,85" fill="#C9A35A" />

                  {/* Step 4 */}
                  <circle cx="410" cy="80" r="30" fill="#1E40AF" />
                  <text x="410" y="85" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">4</text>
                  <text x="410" y="130" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">Generate Msg</text>
                  <text x="410" y="145" fontSize="11" textAnchor="middle" fill="#5E6470">Create Email,</text>
                  <text x="410" y="158" fontSize="11" textAnchor="middle" fill="#5E6470">WhatsApp, LinkedIn</text>

                  {/* Arrow 4 */}
                  <line x1="440" y1="80" x2="480" y2="80" stroke="#1E40AF" strokeWidth="3" />
                  <polygon points="490,80 480,75 480,85" fill="#1E40AF" />

                  {/* Step 5 */}
                  <circle cx="520" cy="80" r="30" fill="#1E40AF" />
                  <text x="520" y="85" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">5</text>
                  <text x="520" y="130" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">Send Message</text>
                  <text x="520" y="145" fontSize="11" textAnchor="middle" fill="#5E6470">Copy & paste to</text>
                  <text x="520" y="158" fontSize="11" textAnchor="middle" fill="#5E6470">preferred channel</text>

                  {/* Arrow 5 */}
                  <line x1="550" y1="80" x2="590" y2="80" stroke="#1E40AF" strokeWidth="3" />
                  <polygon points="600,80 590,75 590,85" fill="#1E40AF" />

                  {/* Step 6 */}
                  <circle cx="630" cy="80" r="30" fill="#15803D" />
                  <text x="630" y="85" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">6</text>
                  <text x="630" y="130" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">Track Status</text>
                  <text x="630" y="145" fontSize="11" textAnchor="middle" fill="#5E6470">Update lead</text>
                  <text x="630" y="158" fontSize="11" textAnchor="middle" fill="#5E6470">progress stage</text>

                  {/* Arrow 6 */}
                  <line x1="660" y1="80" x2="700" y2="80" stroke="#15803D" strokeWidth="3" />
                  <polygon points="710,80 700,75 700,85" fill="#15803D" />

                  {/* Step 7 */}
                  <circle cx="740" cy="80" r="30" fill="#15803D" />
                  <text x="740" y="85" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">7</text>
                  <text x="740" y="130" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">Convert/Nurture</text>
                  <text x="740" y="145" fontSize="11" textAnchor="middle" fill="#5E6470">Move to case or</text>
                  <text x="740" y="158" fontSize="11" textAnchor="middle" fill="#5E6470">continue follow-up</text>

                  {/* Lead Status Flow at bottom */}
                  <text x="30" y="220" fontSize="12" fontWeight="bold" fill="#1E2430">Lead Status Flow:</text>
                  <text x="30" y="245" fontSize="11" fill="#5E6470">NEW → CONTACTED → FOLLOW-UP NEEDED → CONSULTATION READY → CONVERTED ✓ (or NOT RELEVANT)</text>

                  {/* Automation note */}
                  <rect x="30" y="260" width="820" height="25" fill="#FFF8E8" stroke="#C9A35A" strokeWidth="1" rx="4" />
                  <text x="45" y="278" fontSize="11" fill="#92400E">
                    💡 Tip: High-priority leads should be contacted within 24 hours for best conversion rates
                  </text>
                </svg>
              </div>

              {/* Message Generation */}
              <div className="bg-gradient-to-br from-[#FFF8E8] to-white rounded-lg p-6 border border-[#C9A35A]">
                <h3 className="text-lg font-bold mb-3" style={{ color: '#1E2430' }}>💬 Message Generation</h3>
                <p className="mb-4" style={{ color: '#5E6470' }}>
                  The system creates personalized messages in 3 channels:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="font-bold mb-2" style={{ color: '#1E2430' }}>📧 Email</p>
                    <p className="text-sm" style={{ color: '#5E6470' }}>Detailed, professional, includes timeline and services</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="font-bold mb-2" style={{ color: '#1E2430' }}>💬 WhatsApp</p>
                    <p className="text-sm" style={{ color: '#5E6470' }}>Casual, mobile-friendly, easy to respond to</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="font-bold mb-2" style={{ color: '#1E2430' }}>💼 LinkedIn</p>
                    <p className="text-sm" style={{ color: '#5E6470' }}>Professional network message, builds credibility</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Case Agent Tab */}
        {activeTab === 'case-agent' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E2430' }}>
                📋 Case Manager AI - Complete Guide
              </h2>

              {/* 7-Stage Pipeline */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1E2430' }}>7-Stage Case Pipeline</h3>
                <svg className="w-full" viewBox="0 0 900 450" xmlns="http://www.w3.org/2000/svg">
                  {/* Stage 1: Intake */}
                  <g>
                    <rect x="20" y="20" width="100" height="80" fill="#DBEAFE" stroke="#1E40AF" strokeWidth="2" rx="6" />
                    <text x="70" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1E2430">1. INTAKE</text>
                    <text x="70" y="65" fontSize="11" textAnchor="middle" fill="#5E6470">Client info</text>
                    <text x="70" y="80" fontSize="11" textAnchor="middle" fill="#5E6470">Documents</text>
                  </g>

                  {/* Arrow 1 */}
                  <line x1="120" y1="60" x2="150" y2="60" stroke="#1E40AF" strokeWidth="2" />
                  <polygon points="160,60 150,55 150,65" fill="#1E40AF" />

                  {/* Stage 2: Processing */}
                  <g>
                    <rect x="160" y="20" width="100" height="80" fill="#DBEAFE" stroke="#1E40AF" strokeWidth="2" rx="6" />
                    <text x="210" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1E2430">2. PROCESS</text>
                    <text x="210" y="65" fontSize="11" textAnchor="middle" fill="#5E6470">Review docs</text>
                    <text x="210" y="80" fontSize="11" textAnchor="middle" fill="#5E6470">Prepare forms</text>
                  </g>

                  {/* Arrow 2 */}
                  <line x1="260" y1="60" x2="290" y2="60" stroke="#1E40AF" strokeWidth="2" />
                  <polygon points="300,60 290,55 290,65" fill="#1E40AF" />

                  {/* Stage 3: Application */}
                  <g>
                    <rect x="300" y="20" width="100" height="80" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" rx="6" />
                    <text x="350" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1E2430">3. APPLY</text>
                    <text x="350" y="65" fontSize="11" textAnchor="middle" fill="#5E6470">Submit app</text>
                    <text x="350" y="80" fontSize="11" textAnchor="middle" fill="#5E6470">Follow-up</text>
                  </g>

                  {/* Arrow 3 */}
                  <line x1="400" y1="60" x2="430" y2="60" stroke="#92400E" strokeWidth="2" />
                  <polygon points="440,60 430,55 430,65" fill="#92400E" />

                  {/* Stage 4: Review */}
                  <g>
                    <rect x="440" y="20" width="100" height="80" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" rx="6" />
                    <text x="490" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1E2430">4. REVIEW</text>
                    <text x="490" y="65" fontSize="11" textAnchor="middle" fill="#5E6470">Govt review</text>
                    <text x="490" y="80" fontSize="11" textAnchor="middle" fill="#5E6470">More info</text>
                  </g>

                  {/* Arrow 4 */}
                  <line x1="540" y1="60" x2="570" y2="60" stroke="#92400E" strokeWidth="2" />
                  <polygon points="580,60 570,55 570,65" fill="#92400E" />

                  {/* Stage 5: Approval */}
                  <g>
                    <rect x="580" y="20" width="100" height="80" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" rx="6" />
                    <text x="630" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1E2430">5. APPROVAL</text>
                    <text x="630" y="65" fontSize="11" textAnchor="middle" fill="#5E6470">✓ Approved</text>
                    <text x="630" y="80" fontSize="11" textAnchor="middle" fill="#5E6470">Celebrate!</text>
                  </g>

                  {/* Arrow 5 */}
                  <line x1="680" y1="60" x2="710" y2="60" stroke="#15803D" strokeWidth="2" />
                  <polygon points="720,60 710,55 710,65" fill="#15803D" />

                  {/* Stage 6: Delivery */}
                  <g>
                    <rect x="720" y="20" width="100" height="80" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" rx="6" />
                    <text x="770" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#1E2430">6. DELIVERY</text>
                    <text x="770" y="65" fontSize="11" textAnchor="middle" fill="#5E6470">Send docs</text>
                    <text x="770" y="80" fontSize="11" textAnchor="middle" fill="#5E6470">Sign papers</text>
                  </g>

                  {/* Case Management Below */}
                  <text x="20" y="150" fontSize="14" fontWeight="bold" fill="#1E2430">At Each Stage:</text>

                  {/* Milestones */}
                  <rect x="20" y="170" width="200" height="120" fill="#F8F9FA" stroke="#5E6470" strokeWidth="1" rx="6" />
                  <text x="120" y="190" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">📅 Milestones</text>
                  <text x="30" y="210" fontSize="11" fill="#5E6470">• Set target dates</text>
                  <text x="30" y="228" fontSize="11" fill="#5E6470">• Assign owners</text>
                  <text x="30" y="246" fontSize="11" fill="#5E6470">• Track progress</text>
                  <text x="30" y="264" fontSize="11" fill="#5E6470">• Auto-reminders</text>
                  <text x="30" y="282" fontSize="11" fill="#5E6470">• Send updates</text>

                  {/* Documents */}
                  <rect x="240" y="170" width="200" height="120" fill="#F8F9FA" stroke="#5E6470" strokeWidth="1" rx="6" />
                  <text x="340" y="190" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">📄 Documents</text>
                  <text x="250" y="210" fontSize="11" fill="#5E6470">• Upload files</text>
                  <text x="250" y="228" fontSize="11" fill="#5E6470">• Track status</text>
                  <text x="250" y="246" fontSize="11" fill="#5E6470">• Request revisions</text>
                  <text x="250" y="264" fontSize="11" fill="#5E6470">• Mark complete</text>
                  <text x="250" y="282" fontSize="11" fill="#5E6470">• Archive</text>

                  {/* Communication */}
                  <rect x="460" y="170" width="200" height="120" fill="#F8F9FA" stroke="#5E6470" strokeWidth="1" rx="6" />
                  <text x="560" y="190" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">💬 Communication</text>
                  <text x="470" y="210" fontSize="11" fill="#5E6470">• Progress updates</text>
                  <text x="470" y="228" fontSize="11" fill="#5E6470">• Document requests</text>
                  <text x="470" y="246" fontSize="11" fill="#5E6470">• Deadline alerts</text>
                  <text x="470" y="264" fontSize="11" fill="#5E6470">• Good news!</text>
                  <text x="470" y="282" fontSize="11" fill="#5E6470">• Next steps info</text>

                  {/* Reports */}
                  <rect x="680" y="170" width="200" height="120" fill="#F8F9FA" stroke="#5E6470" strokeWidth="1" rx="6" />
                  <text x="780" y="190" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1E2430">📊 Reports</text>
                  <text x="690" y="210" fontSize="11" fill="#5E6470">• Progress %</text>
                  <text x="690" y="228" fontSize="11" fill="#5E6470">• Timeline forecast</text>
                  <text x="690" y="246" fontSize="11" fill="#5E6470">• Milestone status</text>
                  <text x="690" y="264" fontSize="11" fill="#5E6470">• Send to client</text>
                  <text x="690" y="282" fontSize="11" fill="#5E6470">• Internal summary</text>

                  {/* Best Practices */}
                  <rect x="20" y="320" width="860" height="100" fill="#FFF8E8" stroke="#C9A35A" strokeWidth="2" rx="6" />
                  <text x="450" y="345" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">✅ Best Practices</text>
                  <text x="30" y="370" fontSize="11" fill="#92400E">• Update status after every client interaction</text>
                  <text x="30" y="390" fontSize="11" fill="#92400E">• Send weekly updates during case processing</text>
                  <text x="30" y="410" fontSize="11" fill="#92400E">• Set realistic milestones (don't over-promise)</text>
                  <text x="450" y="370" fontSize="11" fill="#92400E">• Document everything (attach emails, notes)</text>
                  <text x="450" y="390" fontSize="11" fill="#92400E">• Alert clients 48 hours before deadlines</text>
                  <text x="450" y="410" fontSize="11" fill="#92400E">• Keep detailed notes for team handoffs</text>
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E2430' }}>
                ⚡ Weekly Automation & Reminders
              </h2>

              {/* Automation Flow */}
              <svg className="w-full mb-8" viewBox="0 0 900 350" xmlns="http://www.w3.org/2000/svg">
                <text x="450" y="30" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#1E2430">
                  Weekly Email Automation (Sent Every Monday 9 AM)
                </text>

                {/* Trigger */}
                <rect x="350" y="60" width="200" height="60" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" rx="6" />
                <text x="450" y="82" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">🔔 Trigger</text>
                <text x="450" y="105" fontSize="11" textAnchor="middle" fill="#5E6470">Every Monday 9 AM UTC</text>

                {/* Arrow down */}
                <line x1="450" y1="120" x2="450" y2="150" stroke="#4F46E5" strokeWidth="2" />
                <polygon points="450,160 445,150 455,150" fill="#4F46E5" />

                {/* Data Collection */}
                <rect x="250" y="160" width="400" height="80" fill="#F0FDF4" stroke="#15803D" strokeWidth="2" rx="6" />
                <text x="450" y="185" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">📊 Data Collection</text>
                <text x="450" y="210" fontSize="11" textAnchor="middle" fill="#5E6470">Analyzes last 7 days: new leads, contacts made, conversions</text>
                <text x="450" y="230" fontSize="11" textAnchor="middle" fill="#5E6470">Finds high-priority leads & stale leads (7+ days no contact)</text>

                {/* Arrow down */}
                <line x1="450" y1="240" x2="450" y2="270" stroke="#15803D" strokeWidth="2" />
                <polygon points="450,280 445,270 455,270" fill="#15803D" />

                {/* Email Sent */}
                <rect x="300" y="280" width="300" height="50" fill="#FFF8E8" stroke="#C9A35A" strokeWidth="2" rx="6" />
                <text x="450" y="305" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1E2430">✉️ Email Sent to Both Admins</text>
                <text x="450" y="320" fontSize="10" textAnchor="middle" fill="#92400E">info@plucogroup.com</text>
              </svg>

              {/* Email Contents */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#1E2430' }}>📧 What's in the Email?</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[#FFF8E8] to-white p-6 rounded-lg border border-[#C9A35A]">
                    <h4 className="font-bold mb-2" style={{ color: '#1E2430' }}>📈 Weekly Stats</h4>
                    <ul className="space-y-1 text-sm" style={{ color: '#5E6470' }}>
                      <li>✓ New leads added this week</li>
                      <li>✓ Leads contacted</li>
                      <li>✓ Conversions</li>
                      <li>✓ Total leads in system</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-[#FEE2E2] to-white p-6 rounded-lg border border-red-400">
                    <h4 className="font-bold mb-2" style={{ color: '#DC2626' }}>🔥 High Priority Leads (Top 5)</h4>
                    <ul className="space-y-1 text-sm" style={{ color: '#5E6470' }}>
                      <li>✓ Lead name and email</li>
                      <li>✓ Service interest & priority score</li>
                      <li>✓ Contact info</li>
                      <li>✓ Days since added</li>
                      <li>✓ Recommended: Contact within 24 hours</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-[#FEF3C7] to-white p-6 rounded-lg border border-yellow-400">
                    <h4 className="font-bold mb-2" style={{ color: '#92400E' }}>⏰ Follow-up Needed (Top 5)</h4>
                    <ul className="space-y-1 text-sm" style={{ color: '#5E6470' }}>
                      <li>✓ Leads not contacted in 7+ days</li>
                      <li>✓ Last contact date</li>
                      <li>✓ Current priority level</li>
                      <li>✓ Direct link to send follow-up</li>
                      <li>✓ Recommended: Send message today</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-[#DBEAFE] to-white p-6 rounded-lg border border-blue-400">
                    <h4 className="font-bold mb-2" style={{ color: '#1E40AF' }}>💡 Quick Actions</h4>
                    <ul className="space-y-1 text-sm" style={{ color: '#5E6470' }}>
                      <li>✓ Direct link to lead dashboard</li>
                      <li>✓ Link to case dashboard</li>
                      <li>✓ Link to message templates</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Manual Trigger */}
              <div className="bg-gradient-to-br from-[#071C3C] to-[#0B234A] text-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">🚀 Trigger Email Anytime (Manual)</h3>
                <p className="mb-4">Don't want to wait until Monday? Trigger the email immediately:</p>
                <div className="bg-black/30 p-4 rounded font-mono text-sm mb-4">
                  <p>fetch('/api/reminders/schedule-weekly')</p>
                  <p>  .then(r =&gt; r.json())</p>
                  <p>  .then(data =&gt; {'{}'}</p>
                  <p>    console.log('✅ Email sent!');</p>
                  <p>  {'}'});</p>
                </div>
                <p className="text-sm opacity-90">
                  Paste this in browser console (F12) on any admin page
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E2430' }}>
                ✅ Admin Daily & Weekly Checklist
              </h2>

              {/* Daily Checklist */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1E2430' }}>📅 Daily Checklist (15 minutes)</h3>
                <div className="space-y-3">
                  {[
                    { task: 'Check unread lead count', time: '2 min', action: 'Go to /admin/dashboard/leads' },
                    { task: 'Review high-priority leads', time: '3 min', action: 'Filter by Priority = High' },
                    { task: 'Contact hot leads', time: '5 min', action: 'Send WhatsApp/Email messages' },
                    { task: 'Update lead statuses', time: '3 min', action: 'Mark leads as Contacted' },
                    { task: 'Mark messages as sent', time: '2 min', action: 'Click "Mark Message Sent"' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#1E2430' }}>{item.task}</p>
                        <p className="text-sm" style={{ color: '#5E6470' }}>{item.action}</p>
                      </div>
                      <div className="text-sm font-medium" style={{ color: '#C9A35A' }}>{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Checklist */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1E2430' }}>🗓️ Weekly Checklist (Monday)</h3>
                <div className="space-y-3">
                  {[
                    { day: 'Monday 9 AM', task: 'Receive weekly summary email', action: 'Review stats and high-priority leads', time: '5 min' },
                    { day: 'Monday', task: 'Plan weekly outreach', action: 'Identify 5 hot leads to contact', time: '10 min' },
                    { day: 'Tue-Wed', task: 'Follow up with stale leads', action: 'Contact leads not reached in 7+ days', time: '15 min' },
                    { day: 'Wednesday', task: 'Review case deadlines', action: 'Send deadline reminders to clients', time: '10 min' },
                    { day: 'Thursday', task: 'Check conversion metrics', action: 'Calculate conversion rate for week', time: '5 min' },
                    { day: 'Friday', task: 'Plan next week', action: 'Set goals for outreach and conversions', time: '5 min' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-yellow-50 to-white rounded-lg border border-yellow-200">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#92400E' }}>{item.day}</p>
                        <p className="font-semibold" style={{ color: '#1E2430' }}>{item.task}</p>
                        <p className="text-sm" style={{ color: '#5E6470' }}>{item.action}</p>
                      </div>
                      <div className="text-sm font-medium" style={{ color: '#C9A35A' }}>{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Checklist */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1E2430' }}>📊 Monthly Checklist (End of Month)</h3>
                <div className="space-y-3">
                  {[
                    { task: 'Review conversion metrics', details: 'Calculate conversion rate, average close time' },
                    { task: 'Analyze lead sources', details: 'Which sources bring best quality leads?' },
                    { task: 'Update processes if needed', details: 'Are there bottlenecks? Improve them' },
                    { task: 'Review team performance', details: 'Who closed most deals? What worked?' },
                    { task: 'Plan next month strategy', details: 'Set conversion targets and outreach goals' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#1E2430' }}>{item.task}</p>
                        <p className="text-sm" style={{ color: '#5E6470' }}>{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-[#071C3C] to-[#0B234A] text-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">🔗 Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="https://www.plucogroup.com/admin/dashboard/leads" className="p-3 bg-white/10 rounded hover:bg-white/20 transition">
                    <p className="font-semibold">Lead Dashboard</p>
                    <p className="text-sm opacity-90">/admin/dashboard/leads</p>
                  </a>
                  <a href="https://www.plucogroup.com/admin/dashboard/ai-agents" className="p-3 bg-white/10 rounded hover:bg-white/20 transition">
                    <p className="font-semibold">Case Manager</p>
                    <p className="text-sm opacity-90">/admin/dashboard/ai-agents</p>
                  </a>
                  <a href="https://www.plucogroup.com/admin/dashboard/users" className="p-3 bg-white/10 rounded hover:bg-white/20 transition">
                    <p className="font-semibold">User Management</p>
                    <p className="text-sm opacity-90">/admin/dashboard/users</p>
                  </a>
                  <a href="https://www.plucogroup.com/admin/dashboard" className="p-3 bg-white/10 rounded hover:bg-white/20 transition">
                    <p className="font-semibold">Main Dashboard</p>
                    <p className="text-sm opacity-90">/admin/dashboard</p>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
