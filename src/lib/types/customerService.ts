// Customer Service Types & Interfaces

export type ExperienceLevel = 'junior' | 'mid' | 'senior';
export type Department = 'leads' | 'client-support' | 'documents' | 'bookings' | 'general';
export type AvailabilityStatus = 'available' | 'busy' | 'away' | 'offline';
export type InquiryStatus = 'new' | 'contacted' | 'waiting' | 'urgent' | 'resolved';

export interface CustomerServiceProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneWhatsApp: string;
  preferredLanguage: string;
  department: Department;
  experienceLevel: ExperienceLevel;
  roleTitle: string;
  profilePhoto?: string;
  availabilityStatus: AvailabilityStatus;
  notes?: string;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  assignedTo: string; // customer-service uid
  assignedToName: string;
  relatedInquiryId?: string;
  relatedBookingId?: string;
  relatedClientId?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: InquiryStatus;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CustomerServiceActivity {
  id: string;
  userId: string; // customer-service uid
  userName: string;
  activityType: 'inquiry_contacted' | 'ticket_created' | 'ticket_resolved' | 'note_added' | 'status_changed' | 'assignment' | 'follow_up';
  relatedId?: string; // ticket or inquiry ID
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AssignedInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  service: string;
  message: string;
  status: InquiryStatus;
  assignedTo: string; // customer-service uid
  assignedAt: string;
  lastContactedAt?: string;
  notes?: string;
}

export interface AssignedBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  service: string;
  status: 'pending' | 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  assignedTo: string; // customer-service uid
  createdAt: string;
  notes?: string;
}
