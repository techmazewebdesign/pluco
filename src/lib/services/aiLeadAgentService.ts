import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Lead,
  AgentTask,
  AgentActivityLog,
  AgentNotification,
  LeadStatus,
  PriorityLevel,
  AgentTaskStatus,
} from '@/lib/types';

// ── Lead Operations ────────────────────────────────────────────────────
export async function getLeads(): Promise<Lead[]> {
  try {
    const q = query(
      collection(db, 'leads'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      lastContactAt: doc.data().lastContactAt?.toDate?.()?.toISOString(),
      nextFollowUpAt: doc.data().nextFollowUpAt?.toDate?.()?.toISOString(),
    } as Lead));
  } catch (error) {
    console.error('Error getting leads:', error);
    return [];
  }
}

export async function getLeadById(id: string): Promise<Lead | null> {
  try {
    const docRef = doc(db, 'leads', id);
    const docSnap = await getDocs(query(collection(db, 'leads'), where('id', '==', id)));
    if (docSnap.empty) return null;
    const data = docSnap.docs[0].data();
    return {
      id: docSnap.docs[0].id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Lead;
  } catch (error) {
    console.error('Error getting lead:', error);
    return null;
  }
}

export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead | null> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...leadData,
      createdAt: now,
      updatedAt: now,
    } as Lead;
  } catch (error) {
    console.error('Error creating lead:', error);
    return null;
  }
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<boolean> {
  try {
    const docRef = doc(db, 'leads', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating lead:', error);
    return false;
  }
}

export async function getHotLeads(): Promise<Lead[]> {
  try {
    const q = query(
      collection(db, 'leads'),
      where('priorityLevel', '==', 'High'),
      orderBy('priorityScore', 'desc'),
      limit(10)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Lead));
  } catch (error) {
    console.error('Error getting hot leads:', error);
    return [];
  }
}

// ── Agent Task Operations ──────────────────────────────────────────────
export async function getAgentTasks(): Promise<AgentTask[]> {
  try {
    const q = query(
      collection(db, 'agentTasks'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      startedAt: doc.data().startedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      completedAt: doc.data().completedAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
    } as AgentTask));
  } catch (error) {
    console.error('Error getting agent tasks:', error);
    return [];
  }
}

export async function createAgentTask(taskData: Omit<AgentTask, 'id' | 'createdAt'>): Promise<AgentTask | null> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'agentTasks'), {
      ...taskData,
      createdAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...taskData,
      createdAt: now,
    } as AgentTask;
  } catch (error) {
    console.error('Error creating agent task:', error);
    return null;
  }
}

export async function updateAgentTask(id: string, updates: Partial<AgentTask>): Promise<boolean> {
  try {
    const docRef = doc(db, 'agentTasks', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating agent task:', error);
    return false;
  }
}

// ── Activity Log Operations ────────────────────────────────────────────
export async function getActivityLogs(limit_count: number = 50): Promise<AgentActivityLog[]> {
  try {
    const q = query(
      collection(db, 'agentActivityLogs'),
      orderBy('createdAt', 'desc'),
      limit(limit_count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as AgentActivityLog));
  } catch (error) {
    console.error('Error getting activity logs:', error);
    return [];
  }
}

export async function createActivityLog(
  actionType: AgentActivityLog['actionType'],
  title: string,
  description: string,
  relatedLeadId?: string,
  priority: PriorityLevel = 'Medium'
): Promise<AgentActivityLog | null> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'agentActivityLogs'), {
      actionType,
      title,
      description,
      relatedLeadId,
      priority,
      createdAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      actionType,
      title,
      description,
      relatedLeadId,
      priority,
      createdAt: now,
    } as AgentActivityLog;
  } catch (error) {
    console.error('Error creating activity log:', error);
    return null;
  }
}

// ── Notification Operations ────────────────────────────────────────────
export async function getNotifications(): Promise<AgentNotification[]> {
  try {
    const q = query(
      collection(db, 'agentNotifications'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      readAt: doc.data().readAt?.toDate?.()?.toISOString(),
    } as AgentNotification));
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

export async function createNotification(
  type: AgentNotification['type'],
  title: string,
  message: string,
  severity: AgentNotification['severity'],
  relatedLeadId?: string,
  relatedTaskId?: string,
  actionUrl?: string
): Promise<AgentNotification | null> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'agentNotifications'), {
      type,
      title,
      message,
      severity,
      relatedLeadId,
      relatedTaskId,
      actionUrl,
      isRead: false,
      createdAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      type,
      title,
      message,
      severity,
      relatedLeadId,
      relatedTaskId,
      actionUrl,
      isRead: false,
      createdAt: now,
    } as AgentNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

export async function updateNotification(id: string, updates: Partial<AgentNotification>): Promise<boolean> {
  try {
    const docRef = doc(db, 'agentNotifications', id);
    await updateDoc(docRef, {
      ...updates,
      ...(updates.readAt && { readAt: Timestamp.now() }),
    });
    return true;
  } catch (error) {
    console.error('Error updating notification:', error);
    return false;
  }
}

// ── Notification Rules ────────────────────────────────────────────────
export async function checkAndCreateNotificationsForLead(lead: Lead): Promise<void> {
  try {
    // Rule 1: High priority = urgent notification
    if (lead.priorityLevel === 'High') {
      await createNotification(
        'lead_hot',
        `🔥 Hot Lead: ${lead.fullName}`,
        `High priority lead found - ${lead.companyName || lead.fullName} interested in ${lead.serviceInterest}. Priority score: ${lead.priorityScore}%`,
        'urgent',
        lead.id
      );
    }

    // Rule 2: Consultation Ready status = urgent notification
    if (lead.status === 'Consultation Ready') {
      await createNotification(
        'consultation_ready',
        `✅ Consultation Ready: ${lead.fullName}`,
        `Lead is ready for consultation booking. Estimated budget: ${lead.estimatedBudget}`,
        'urgent',
        lead.id
      );
    }

    // Rule 3: Follow-up due today
    if (lead.nextFollowUpAt) {
      const followUpDate = new Date(lead.nextFollowUpAt);
      const today = new Date();
      if (followUpDate.toDateString() === today.toDateString()) {
        await createNotification(
          'follow_up_due',
          `📞 Follow-up Due: ${lead.fullName}`,
          `Follow-up is scheduled for today. Last contact was ${lead.lastContactAt ? new Date(lead.lastContactAt).toLocaleDateString() : 'unknown'}.`,
          'warning',
          lead.id
        );
      }
    }
  } catch (error) {
    console.error('Error checking and creating notifications for lead:', error);
  }
}

export async function checkAndCreateNotificationsForTask(task: AgentTask): Promise<void> {
  try {
    // Rule: Task failed = warning notification
    if (task.status === 'failed') {
      await createNotification(
        'task_failed',
        `❌ Task Failed: ${task.title}`,
        `${task.taskType} task failed. Error: ${task.errorMessage || 'Unknown error'}.`,
        'warning',
        undefined,
        task.id
      );
    }
  } catch (error) {
    console.error('Error checking and creating notifications for task:', error);
  }
}

// ── Demo Data Generation ───────────────────────────────────────────────
export function generateDemoLeads(): Lead[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'demo-lead-001',
      fullName: 'John Patel',
      email: 'john@techstart.com',
      phone: '+91-98765-43210',
      whatsapp: '+919876543210',
      country: 'India',
      currentResidence: 'Mumbai, India',
      nationality: 'Indian',
      serviceInterest: 'Investment',
      sourceChannel: 'LinkedIn',
      companyName: 'TechStart India',
      estimatedBudget: '$500K+',
      urgency: 'High',
      priorityScore: 95,
      priorityLevel: 'High',
      status: 'Reviewed',
      assignedTo: 'ahmed',
      assignedToName: 'Ahmed Hassan',
      notes: 'Very interested, high budget, decision maker available',
      aiSummary: 'High-value prospect with immediate investment needs',
      aiRecommendedAction: 'Call immediately with investment package',
      lastContactAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-lead-002',
      fullName: 'Sarah Johnson',
      email: 'sarah@email.com',
      country: 'USA',
      currentResidence: 'New York, USA',
      nationality: 'American',
      serviceInterest: 'EU Residency',
      sourceChannel: 'Referral',
      estimatedBudget: '$200K',
      urgency: 'High',
      priorityScore: 88,
      priorityLevel: 'High',
      status: 'New',
      notes: 'Referred by existing client, wants EU residency',
      aiSummary: 'Strong prospect for EU residency program',
      aiRecommendedAction: 'Send welcome email with program details',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-lead-003',
      fullName: 'Lisa Mueller',
      email: 'lisa@euconsulting.de',
      country: 'Germany',
      currentResidence: 'Berlin, Germany',
      nationality: 'German',
      serviceInterest: 'Business Setup',
      sourceChannel: 'Google',
      companyName: 'EU Consulting',
      estimatedBudget: '$100K',
      urgency: 'Medium',
      priorityScore: 72,
      priorityLevel: 'Medium',
      status: 'Message Prepared',
      assignedTo: 'sofia',
      assignedToName: 'Sofia Martinez',
      notes: 'Interested in Germany business setup',
      lastContactAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      nextFollowUpAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-lead-004',
      fullName: 'Michael Chen',
      email: 'michael@asia-holdings.sg',
      country: 'Singapore',
      currentResidence: 'Singapore',
      nationality: 'Singaporean',
      serviceInterest: 'Investment',
      sourceChannel: 'Email',
      companyName: 'Asia Holdings',
      estimatedBudget: '$1M+',
      urgency: 'High',
      priorityScore: 92,
      priorityLevel: 'High',
      status: 'Consultation Ready',
      assignedTo: 'ahmed',
      assignedToName: 'Ahmed Hassan',
      notes: 'Large investment, ready to book consultation',
      aiSummary: 'Premium prospect - consultation booking ready',
      aiRecommendedAction: 'Send consultation link and availability',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-lead-005',
      fullName: 'Emma Wilson',
      email: 'emma@globaltech.com',
      country: 'UK',
      currentResidence: 'London, UK',
      nationality: 'British',
      serviceInterest: 'Visa Sponsorship',
      sourceChannel: 'Website',
      companyName: 'Global Tech Ltd',
      estimatedBudget: '$50K',
      urgency: 'Medium',
      priorityScore: 65,
      priorityLevel: 'Medium',
      status: 'Contacted',
      assignedTo: 'sofia',
      assignedToName: 'Sofia Martinez',
      notes: 'Company visa sponsorship program',
      lastContactAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function generateDemoTasks(): AgentTask[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'demo-task-001',
      taskType: 'target_selection',
      title: 'Weekly Target Selection',
      description: 'Identifying target clients based on demographics and budget',
      status: 'completed',
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      resultCount: 150,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-task-002',
      taskType: 'channel_search',
      title: 'LinkedIn Search - Investment Services',
      description: 'Searching LinkedIn for investment-related leads',
      status: 'running',
      startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      resultCount: 85,
      createdAt: now,
    },
    {
      id: 'demo-task-003',
      taskType: 'lead_scoring',
      title: 'Automated Lead Scoring',
      description: 'Scoring and prioritizing collected leads',
      status: 'completed',
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
      resultCount: 98,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}
