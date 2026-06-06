// Chatbot types and interfaces

export type ChatRole = 'user' | 'assistant' | 'system';
export type LeadStatus = 'new' | 'qualified' | 'needs-follow-up' | 'converted';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatSession {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  serviceInterest?: string;
  leadStatus: LeadStatus;
  assignedTo?: string;
  source: 'faq-chatbot';
  notes?: string;
}

export interface ChatbotMessage {
  role: ChatRole;
  content: string;
}
