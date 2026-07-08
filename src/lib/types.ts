// ── Shared Firestore types ─────────────────────────────────────────────

export type Lang = 'en' | 'fa';

// ── Agent ──────────────────────────────────────────────────────────────
export type AgentRole =
  | 'admin'
  | 'case_manager'
  | 'customer_service'
  | 'document_reviewer'
  | 'compliance_officer'
  | 'enquiry_handler'
  | 'consultant';

export const AGENT_ROLE_LABELS: Record<AgentRole, { en: string; fa: string }> = {
  admin:               { en: 'Admin',                fa: 'مدیر سیستم' },
  case_manager:        { en: 'Case Manager',         fa: 'مدیر پرونده' },
  customer_service:    { en: 'Customer Service',     fa: 'خدمات مشتریان' },
  document_reviewer:   { en: 'Document Reviewer',    fa: 'بررسی‌کننده اسناد' },
  compliance_officer:  { en: 'Compliance Officer',   fa: 'مسئول انطباق' },
  enquiry_handler:     { en: 'Enquiry Handler',      fa: 'پردازشگر استعلام' },
  consultant:          { en: 'Consultant',           fa: 'مشاور' },
};

export interface Agent {
  uid: string;
  name: string;
  email: string;
  role: AgentRole;
  active: boolean;
  createdAt: string;
}

// ── Enquiry ────────────────────────────────────────────────────────────
export type EnquiryStatus = 'new' | 'assigned' | 'in_progress' | 'closed';

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, { en: string; fa: string; color: string; bg: string }> = {
  new:         { en: 'New',         fa: 'جدید',          color: '#92400E', bg: '#FEF3C7' },
  assigned:    { en: 'Assigned',    fa: 'اختصاص یافته',   color: '#1E40AF', bg: '#DBEAFE' },
  in_progress: { en: 'In Progress', fa: 'در حال پیشرفت', color: '#0F766E', bg: '#CCFBF1' },
  closed:      { en: 'Closed',      fa: 'بسته شده',      color: '#374151', bg: '#F3F4F6' },
};

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  nationality?: string;
  country?: string;
  familyMembers?: string;
  service?: string;
  language?: string;
  description?: string;
  status: EnquiryStatus;
  assignedTo?: string;   // agentId
  agentNotes?: string;
  submittedAt: string;
  updatedAt?: string;
}

// ── Client ─────────────────────────────────────────────────────────────
export interface ClientProfile {
  uid: string;
  name?: string;
  email?: string;
  nationality?: string;
  country?: string;
  preferredLanguage?: Lang;
  assignedAgent?: string;
  createdAt?: string;
}

// ── Case ───────────────────────────────────────────────────────────────
export type CaseStatus =
  | 'pending'
  | 'in_progress'
  | 'awaiting_documents'
  | 'under_review'
  | 'approved'
  | 'closed';

export const CASE_STATUS_LABELS: Record<CaseStatus, { en: string; fa: string; color: string; bg: string }> = {
  pending:            { en: 'Pending',             fa: 'در انتظار',       color: '#92400E', bg: '#FEF3C7' },
  in_progress:        { en: 'In Progress',         fa: 'در حال پیشرفت',   color: '#1E40AF', bg: '#DBEAFE' },
  awaiting_documents: { en: 'Awaiting Documents',  fa: 'در انتظار اسناد', color: '#9333EA', bg: '#F3E8FF' },
  under_review:       { en: 'Under Review',        fa: 'در حال بررسی',   color: '#0F766E', bg: '#CCFBF1' },
  approved:           { en: 'Approved',            fa: 'تأیید شده',       color: '#15803D', bg: '#DCFCE7' },
  closed:             { en: 'Closed',              fa: 'بسته شده',        color: '#374151', bg: '#F3F4F6' },
};

export interface Case {
  service?: string;
  status?: CaseStatus;
  stage?: string;
  documentsReceived?: string[];
  documentsRequired?: string[];
  nextDeadline?: string;
  nextAppointment?: string;
  notes?: string;
  updatedAt?: string;
  updatedBy?: string;   // agentId
}

// ── Document ───────────────────────────────────────────────────────────
export type DocumentCategory =
  | 'passport'
  | 'residence_card'
  | 'bank_statements'
  | 'company_documents'
  | 'source_of_funds'
  | 'source_of_wealth'
  | 'property_documents'
  | 'contracts'
  | 'court_documents'
  | 'immigration_documents'
  | 'education_documents'
  | 'family_documents'
  | 'compliance'
  | 'other';

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, { en: string; fa: string }> = {
  passport:              { en: 'Passport',                fa: 'گذرنامه' },
  residence_card:        { en: 'Residence Card',          fa: 'کارت اقامت' },
  bank_statements:       { en: 'Bank Statements',         fa: 'صورت‌حساب بانکی' },
  company_documents:     { en: 'Company Documents',       fa: 'اسناد شرکت' },
  source_of_funds:       { en: 'Source of Funds',         fa: 'منبع وجوه' },
  source_of_wealth:      { en: 'Source of Wealth',        fa: 'منبع ثروت' },
  property_documents:    { en: 'Property Documents',      fa: 'اسناد ملکی' },
  contracts:             { en: 'Contracts',               fa: 'قراردادها' },
  court_documents:       { en: 'Court Documents',         fa: 'اسناد دادگاهی' },
  immigration_documents: { en: 'Immigration Documents',   fa: 'اسناد مهاجرتی' },
  education_documents:   { en: 'Education Documents',     fa: 'مدارک تحصیلی' },
  family_documents:      { en: 'Family Documents',        fa: 'اسناد خانوادگی' },
  compliance:            { en: 'Compliance / AML',        fa: 'انطباق / مبارزه با پولشویی' },
  other:                 { en: 'Other',                   fa: 'سایر' },
};

export type DocumentStatus = 'pending' | 'reviewed' | 'approved' | 'rejected' | 'flagged';

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, { en: string; fa: string; color: string; bg: string }> = {
  pending:  { en: 'Pending Review', fa: 'در انتظار بررسی', color: '#92400E', bg: '#FEF3C7' },
  reviewed: { en: 'Reviewed',       fa: 'بررسی شده',       color: '#1E40AF', bg: '#DBEAFE' },
  approved: { en: 'Approved',       fa: 'تأیید شده',       color: '#15803D', bg: '#DCFCE7' },
  rejected: { en: 'Rejected',       fa: 'رد شده',          color: '#DC2626', bg: '#FEE2E2' },
  flagged:  { en: 'Flagged',        fa: 'علامت‌گذاری',      color: '#9333EA', bg: '#F3E8FF' },
};

export interface ClientDocument {
  id: string;
  clientUid: string;
  name: string;
  category: DocumentCategory;
  description?: string;
  url: string;
  storagePath: string;
  size: number;
  mimeType: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewedBy?: string;   // agentId
  reviewNotes?: string;
  reviewedAt?: string;
}

// ── Message ────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  from: 'pluco' | 'client';
  content: string;
  timestamp: string;
  read: boolean;
  sentBy?: string;   // agentId if from pluco
  senderName?: string;
}

// ── Invoice ────────────────────────────────────────────────────────────
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate?: string;
  issuedAt?: string;
  paidAt?: string;
  url?: string;  // Download URL for PDF
  storagePath?: string;
  createdBy?: string;  // agentId
}

// ── Ticket ─────────────────────────────────────────────────────────────
export type TicketCategory =
  | 'general' | 'case_update' | 'document' | 'banking'
  | 'billing' | 'immigration' | 'technical' | 'urgent';

export type TicketStatus = 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, { en: string; fa: string; icon: string }> = {
  general:      { en: 'General Enquiry',    fa: 'استعلام عمومی',       icon: '💬' },
  case_update:  { en: 'Case Update',        fa: 'به‌روزرسانی پرونده',   icon: '📋' },
  document:     { en: 'Documents',          fa: 'اسناد',               icon: '📄' },
  banking:      { en: 'Banking',            fa: 'بانکداری',             icon: '🏦' },
  billing:      { en: 'Billing / Invoice',  fa: 'فاکتور / پرداخت',      icon: '💳' },
  immigration:  { en: 'Immigration',        fa: 'مهاجرت',               icon: '✈️'  },
  technical:    { en: 'Technical Issue',    fa: 'مشکل فنی',             icon: '⚙️'  },
  urgent:       { en: 'Urgent',             fa: 'فوری',                 icon: '🚨' },
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, { en: string; fa: string; color: string; bg: string }> = {
  open:           { en: 'Open',            fa: 'باز',           color: '#1E40AF', bg: '#DBEAFE' },
  in_progress:    { en: 'In Progress',     fa: 'در جریان',      color: '#92400E', bg: '#FEF3C7' },
  waiting_client: { en: 'Waiting Client',  fa: 'انتظار موکل',   color: '#9333EA', bg: '#F3E8FF' },
  resolved:       { en: 'Resolved',        fa: 'حل شده',        color: '#15803D', bg: '#DCFCE7' },
  closed:         { en: 'Closed',          fa: 'بسته شده',      color: '#374151', bg: '#F3F4F6' },
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, { en: string; fa: string; color: string }> = {
  low:    { en: 'Low',    fa: 'کم',    color: '#374151' },
  medium: { en: 'Medium', fa: 'متوسط', color: '#1E40AF' },
  high:   { en: 'High',   fa: 'بالا',  color: '#92400E' },
  urgent: { en: 'Urgent', fa: 'فوری',  color: '#DC2626' },
};

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  assignedTo?: string;
  assignedToName?: string;
  description: string;
  language: 'en' | 'fa';
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  unreadAgent?: number;   // unread messages for agent
  unreadClient?: number;  // unread messages for client
}

export interface TicketMessage {
  id: string;
  from: 'client' | 'agent';
  senderName: string;
  senderUid: string;
  content: string;
  timestamp: string;
  readByClient?: boolean;
  readByAgent?: boolean;
}

// ── Follow-up ──────────────────────────────────────────────────────────
export type FollowUpType = 'case' | 'enquiry' | 'document' | 'message' | 'client' | 'custom';
export type FollowUpPriority = 'low' | 'medium' | 'high' | 'urgent';
export type FollowUpStatus = 'open' | 'in_progress' | 'resolved';

export const FOLLOWUP_PRIORITY_LABELS: Record<FollowUpPriority, { en: string; fa: string; color: string; bg: string }> = {
  low:    { en: 'Low',    fa: 'کم',      color: '#374151', bg: '#F3F4F6' },
  medium: { en: 'Medium', fa: 'متوسط',  color: '#1E40AF', bg: '#DBEAFE' },
  high:   { en: 'High',   fa: 'بالا',    color: '#92400E', bg: '#FEF3C7' },
  urgent: { en: 'Urgent', fa: 'فوری',   color: '#DC2626', bg: '#FEE2E2' },
};

export const FOLLOWUP_STATUS_LABELS: Record<FollowUpStatus, { en: string; fa: string; color: string; bg: string }> = {
  open:        { en: 'Open',        fa: 'باز',           color: '#1E40AF', bg: '#DBEAFE' },
  in_progress: { en: 'In Progress', fa: 'در جریان',     color: '#92400E', bg: '#FEF3C7' },
  resolved:    { en: 'Resolved',    fa: 'حل شده',        color: '#15803D', bg: '#DCFCE7' },
};

export interface FollowUp {
  id: string;
  type: FollowUpType;
  title: string;
  description?: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  relatedUid?: string;    // client uid
  relatedId?: string;     // enquiry id, doc id etc
  relatedLabel?: string;  // human-readable reference
  createdBy: string;      // agent uid
  createdByName: string;
  assignedTo?: string;    // agent uid
  assignedToName?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  notes?: string;
}

// ── Client Notification ────────────────────────────────────────────────
export type NotificationType =
  | 'case_update'
  | 'message'
  | 'document_reviewed'
  | 'invoice'
  | 'follow_up'
  | 'general';

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, { en: string; fa: string; icon: string }> = {
  case_update:       { en: 'Case Update',       fa: 'به‌روزرسانی پرونده', icon: '📋' },
  message:           { en: 'New Message',        fa: 'پیام جدید',          icon: '💬' },
  document_reviewed: { en: 'Document Reviewed',  fa: 'سند بررسی شد',       icon: '📄' },
  invoice:           { en: 'Invoice',            fa: 'فاکتور',             icon: '💳' },
  follow_up:         { en: 'Follow-up',          fa: 'پیگیری',             icon: '🔔' },
  general:           { en: 'General',            fa: 'عمومی',              icon: '📢' },
};

export interface ClientNotification {
  id: string;
  type: NotificationType;
  titleEn: string;
  titleFa: string;
  bodyEn: string;
  bodyFa: string;
  read: boolean;
  link?: string;
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
}

// ── Report ─────────────────────────────────────────────────────────────
export type ReportType =
  | 'weekly_summary'
  | 'client_update'
  | 'compliance_report'
  | 'enquiry_report'
  | 'document_review'
  | 'custom';

export const REPORT_TYPE_LABELS: Record<ReportType, { en: string; fa: string }> = {
  weekly_summary:   { en: 'Weekly Summary',     fa: 'خلاصه هفتگی' },
  client_update:    { en: 'Client Update',      fa: 'به‌روزرسانی موکل' },
  compliance_report:{ en: 'Compliance Report',  fa: 'گزارش انطباق' },
  enquiry_report:   { en: 'Enquiry Report',     fa: 'گزارش استعلام' },
  document_review:  { en: 'Document Review',    fa: 'گزارش بررسی اسناد' },
  custom:           { en: 'Custom Report',      fa: 'گزارش سفارشی' },
};

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  content: string;
  createdBy: string;  // agentId
  createdByName: string;
  sentTo: string;
  sentAt: string;
}

// ── Role-based access ──────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<AgentRole, {
  enquiries: boolean;
  clients: boolean;
  cases: boolean;
  documents: boolean;
  messages: boolean;
  invoices: boolean;
  reports: boolean;
  agents: boolean;
  consultations: boolean;
}> = {
  admin:              { enquiries: true,  clients: true,  cases: true,  documents: true,  messages: true,  invoices: true,  reports: true,  agents: true,   consultations: true  },
  case_manager:       { enquiries: true,  clients: true,  cases: true,  documents: true,  messages: true,  invoices: true,  reports: true,  agents: false,  consultations: true  },
  customer_service:   { enquiries: true,  clients: true,  cases: true,  documents: false, messages: true,  invoices: false, reports: true,  agents: false,  consultations: true  },
  document_reviewer:  { enquiries: false, clients: true,  cases: true,  documents: true,  messages: false, invoices: false, reports: true,  agents: false,  consultations: false },
  compliance_officer: { enquiries: true,  clients: true,  cases: true,  documents: true,  messages: false, invoices: false, reports: true,  agents: false,  consultations: false },
  enquiry_handler:    { enquiries: true,  clients: false, cases: false, documents: false, messages: true,  invoices: false, reports: true,  agents: false,  consultations: false },
  consultant:         { enquiries: false, clients: true,  cases: false, documents: false, messages: true,  invoices: false, reports: false, agents: false,  consultations: true  },
};

// ── AI Lead Agent ──────────────────────────────────────────────────────
export type LeadStatus = 'New' | 'Reviewed' | 'Message Prepared' | 'Contacted' | 'Follow-up Needed' | 'Consultation Ready' | 'Converted' | 'Not Relevant';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type SourceChannel = 'LinkedIn' | 'Google' | 'Email' | 'Referral' | 'Website' | 'Other';
export type LeadExportStatus = 'Not Exported' | 'Exported' | 'Export Failed';

export const LEAD_STATUS_LABELS: Record<LeadStatus, { en: string; fa: string; color: string; bg: string }> = {
  'New':                  { en: 'New',                  fa: 'جدید',                 color: '#1E40AF', bg: '#DBEAFE' },
  'Reviewed':             { en: 'Reviewed',             fa: 'بررسی شده',             color: '#92400E', bg: '#FEF3C7' },
  'Message Prepared':     { en: 'Message Prepared',     fa: 'پیام آماده',            color: '#6B21A8', bg: '#E9D5FF' },
  'Contacted':            { en: 'Contacted',            fa: 'تماس برقرار شد',       color: '#15803D', bg: '#DCFCE7' },
  'Follow-up Needed':     { en: 'Follow-up Needed',     fa: 'پیگیری مورد نیاز',      color: '#B45309', bg: '#FED7AA' },
  'Consultation Ready':   { en: 'Consultation Ready',   fa: 'مشاوره آماده',          color: '#1E40AF', bg: '#DBEAFE' },
  'Converted':            { en: 'Converted',            fa: 'تبدیل شده',             color: '#15803D', bg: '#DCFCE7' },
  'Not Relevant':         { en: 'Not Relevant',         fa: 'نامربوط',               color: '#6B7280', bg: '#F3F4F6' },
};

export const PRIORITY_LEVEL_LABELS: Record<PriorityLevel, { en: string; fa: string; color: string; bg: string; badge: string }> = {
  'High':   { en: 'High',   fa: 'بالا',    color: '#DC2626', bg: '#FEE2E2', badge: '🔴' },
  'Medium': { en: 'Medium', fa: 'متوسط',  color: '#92400E', bg: '#FEF3C7', badge: '🟠' },
  'Low':    { en: 'Low',    fa: 'کم',      color: '#15803D', bg: '#DCFCE7', badge: '🟢' },
};

export const LEAD_EXPORT_STATUS_LABELS: Record<LeadExportStatus, { en: string; fa: string; color: string; bg: string; icon: string }> = {
  'Not Exported':   { en: 'Not Exported',   fa: 'صادر نشده',     color: '#6B7280', bg: '#F3F4F6', icon: '⭕' },
  'Exported':       { en: 'Exported',       fa: 'صادر شده',      color: '#15803D', bg: '#DCFCE7', icon: '✅' },
  'Export Failed':  { en: 'Export Failed',  fa: 'صادر نشد',      color: '#DC2626', bg: '#FEE2E2', icon: '❌' },
};

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  country: string;
  currentResidence?: string;
  nationality?: string;
  serviceInterest: string;
  sourceChannel: SourceChannel;
  sourceUrl?: string;
  companyName?: string;
  estimatedBudget: string;
  urgency: 'High' | 'Medium' | 'Low';
  priorityScore: number;  // 0-100
  priorityLevel: PriorityLevel;
  status: LeadStatus;
  assignedTo?: string;  // agent uid
  assignedToName?: string;
  notes?: string;
  aiSummary?: string;
  aiRecommendedAction?: string;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  exportStatus?: LeadExportStatus;  // Google Sheet export status
  exportedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AgentTaskType = 'target_selection' | 'channel_search' | 'lead_collection' | 'lead_scoring' | 'message_preparation' | 'follow_up_check' | 'crm_sync';
export type AgentTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'needs_review';

export const AGENT_TASK_TYPE_LABELS: Record<AgentTaskType, { en: string; fa: string; icon: string }> = {
  'target_selection':     { en: 'Target Selection',      fa: 'انتخاب هدف',           icon: '🎯' },
  'channel_search':       { en: 'Channel Search',        fa: 'جستجوی کانال',         icon: '🔍' },
  'lead_collection':      { en: 'Lead Collection',       fa: 'جمع‌آوری سرنخ',       icon: '📊' },
  'lead_scoring':         { en: 'Lead Scoring',          fa: 'امتیازدهی سرنخ',      icon: '⭐' },
  'message_preparation':  { en: 'Message Preparation',   fa: 'آماده‌سازی پیام',      icon: '✉️' },
  'follow_up_check':      { en: 'Follow-up Check',       fa: 'بررسی پیگیری',        icon: '📞' },
  'crm_sync':             { en: 'CRM Sync',              fa: 'همگام‌سازی CRM',       icon: '🔄' },
};

export const AGENT_TASK_STATUS_LABELS: Record<AgentTaskStatus, { en: string; fa: string; color: string; bg: string }> = {
  'pending':       { en: 'Pending',       fa: 'در انتظار',      color: '#1E40AF', bg: '#DBEAFE' },
  'running':       { en: 'Running',       fa: 'در حال اجرا',   color: '#92400E', bg: '#FEF3C7' },
  'completed':     { en: 'Completed',     fa: 'تکمیل شده',    color: '#15803D', bg: '#DCFCE7' },
  'failed':        { en: 'Failed',        fa: 'ناموفق',        color: '#DC2626', bg: '#FEE2E2' },
  'needs_review':  { en: 'Needs Review',  fa: 'نیاز به بررسی',  color: '#9333EA', bg: '#F3E8FF' },
};

export interface AgentTask {
  id: string;
  taskType: AgentTaskType;
  title: string;
  description: string;
  status: AgentTaskStatus;
  startedAt: string;
  completedAt?: string;
  resultCount: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ActivityActionType = 'lead_found' | 'lead_scored' | 'message_prepared' | 'contact_made' | 'follow_up_scheduled' | 'consultation_booked' | 'lead_converted' | 'task_completed' | 'task_failed';

export const ACTIVITY_ACTION_LABELS: Record<ActivityActionType, { en: string; fa: string; icon: string }> = {
  'lead_found':             { en: 'Lead Found',             fa: 'سرنخ یافت شد',         icon: '🎯' },
  'lead_scored':            { en: 'Lead Scored',            fa: 'سرنخ امتیازدهی شد',   icon: '⭐' },
  'message_prepared':       { en: 'Message Prepared',       fa: 'پیام آماده شد',       icon: '✉️' },
  'contact_made':           { en: 'Contact Made',           fa: 'تماس برقرار شد',     icon: '📞' },
  'follow_up_scheduled':    { en: 'Follow-up Scheduled',    fa: 'پیگیری برنامه‌ریزی شد',  icon: '📅' },
  'consultation_booked':    { en: 'Consultation Booked',    fa: 'مشاوره رزرو شد',      icon: '✅' },
  'lead_converted':         { en: 'Lead Converted',         fa: 'سرنخ تبدیل شد',      icon: '🎉' },
  'task_completed':         { en: 'Task Completed',         fa: 'تکلیف تکمیل شد',      icon: '✔️' },
  'task_failed':            { en: 'Task Failed',            fa: 'تکلیف ناموفق بود',   icon: '❌' },
};

export interface AgentActivityLog {
  id: string;
  actionType: ActivityActionType;
  title: string;
  description: string;
  relatedLeadId?: string;
  priority: PriorityLevel;
  createdAt: string;
}

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'urgent';

export const NOTIFICATION_SEVERITY_LABELS: Record<NotificationSeverity, { en: string; fa: string; color: string; bg: string; icon: string }> = {
  'info':    { en: 'Info',    fa: 'اطلاعات',    color: '#1E40AF', bg: '#DBEAFE',   icon: 'ℹ️' },
  'success': { en: 'Success', fa: 'موفق',      color: '#15803D', bg: '#DCFCE7',   icon: '✓' },
  'warning': { en: 'Warning', fa: 'هشدار',     color: '#92400E', bg: '#FEF3C7',   icon: '⚠️' },
  'urgent':  { en: 'Urgent',  fa: 'فوری',      color: '#DC2626', bg: '#FEE2E2',   icon: '🔴' },
};

export interface AgentNotification {
  id: string;
  type: 'lead_found' | 'lead_hot' | 'task_failed' | 'follow_up_due' | 'consultation_ready' | 'message' | 'system';
  title: string;
  message: string;
  relatedLeadId?: string;
  relatedTaskId?: string;
  severity: NotificationSeverity;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// ── Consultant & Consultation Booking ──────────────────────────────────
export type ConsultantRole = 'consultant' | 'lead_consultant';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type MeetingPlatform = 'google_meet' | 'discord' | 'zoom' | 'teams' | 'other';

export const CONSULTANT_ROLE_LABELS: Record<ConsultantRole, { en: string; fa: string }> = {
  consultant:        { en: 'Consultant',        fa: 'مشاور' },
  lead_consultant:   { en: 'Lead Consultant',   fa: 'مشاور ارشد' },
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, { en: string; fa: string; color: string; bg: string }> = {
  pending:    { en: 'Pending',    fa: 'در انتظار',    color: '#92400E', bg: '#FEF3C7' },
  confirmed:  { en: 'Confirmed',  fa: 'تأیید شده',    color: '#1E40AF', bg: '#DBEAFE' },
  completed:  { en: 'Completed',  fa: 'تکمیل شده',   color: '#15803D', bg: '#DCFCE7' },
  cancelled:  { en: 'Cancelled',  fa: 'لغو شده',      color: '#DC2626', bg: '#FEE2E2' },
  no_show:    { en: 'No Show',    fa: 'حضور نیافت',  color: '#9333EA', bg: '#F3E8FF' },
};

export const MEETING_PLATFORM_LABELS: Record<MeetingPlatform, { en: string; fa: string; icon: string }> = {
  google_meet: { en: 'Google Meet',   fa: 'گوگل میت',    icon: '📹' },
  discord:     { en: 'Discord',       fa: 'دیسکورد',      icon: '💬' },
  zoom:        { en: 'Zoom',          fa: 'زوم',          icon: '📞' },
  teams:       { en: 'Microsoft Teams', fa: 'تیمز',       icon: '👥' },
  other:       { en: 'Other',         fa: 'سایر',         icon: '🔗' },
};

export const PRODUCT_TYPES: Record<string, { en: string; fa: string; icon: string }> = {
  'eu-residency':       { en: 'EU Residency',        fa: 'اقامت اروپا',          icon: '🇪🇺' },
  'spain-digital-nomad': { en: 'Spain Digital Nomad Visa / Remote Residency Support', fa: 'ویزای نومد دیجیتال اسپانیا', icon: '🇪🇸' },
  'eu-property':        { en: 'EU Property Purchase', fa: 'خرید ملک اروپا',       icon: '🏠' },
  'us-green-card':      { en: 'US Green Card',       fa: 'کارت سبز آمریکا',      icon: '🇺🇸' },
  'banking':            { en: 'Banking Solutions',   fa: 'خدمات بانکی',          icon: '🏦' },
  'dispute-resolution': { en: 'Dispute Resolution',  fa: 'حل و فصل اختلاف',      icon: '⚖️' },
  'contracts':          { en: 'International Contracts', fa: 'قرارداد بین‌المللی', icon: '📜' },
  'business':           { en: 'Business Solutions',  fa: 'راه‌حل کسب‌وکار',      icon: '💼' },
  'company-registration': { en: 'Company Registration', fa: 'ثبت شرکت',             icon: '📋' },
};

export interface Consultant {
  uid: string;
  name: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  role: ConsultantRole;
  bio?: string;
  photo?: string;
  photoPath?: string;
  timezone?: string;
  languages?: string[];
  specializations?: string[];
  productTypes?: string[]; // e.g., ['eu-residency', 'us-green-card', 'banking']
  linkedin?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  active: boolean;
  profileComplete: boolean; // Whether consultant has completed profile setup
  profileCompletedAt?: string;
  consultationFee?: number;
  currency?: string;
  averageRating?: number;
  totalConsultations?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ConsultantAvailability {
  id: string;
  consultantUid: string;
  dayOfWeek: number;  // 0-6 (Sunday-Saturday)
  startTime: string;  // HH:mm format
  endTime: string;    // HH:mm format
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsultationBooking {
  id: string;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  consultantUid: string;
  consultantName: string;
  title: string;
  description?: string;
  status: BookingStatus;
  scheduledAt: string;  // ISO datetime
  duration: number;     // minutes
  meetingPlatform: MeetingPlatform;
  meetingLink?: string;
  meetingPassword?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface ConsultationReview {
  id: string;
  bookingId: string;
  clientUid: string;
  clientName: string;
  consultantUid: string;
  rating: number;  // 1-5
  title: string;
  comment: string;
  wouldRecommend: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ConsultationRecord {
  id: string;
  bookingId: string;
  consultantUid: string;
  clientUid: string;
  clientName: string;
  startTime: string;
  endTime: string;
  duration: number;
  summary?: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  actionItems?: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}
