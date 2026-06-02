// Helper to create a client notification from anywhere (agent actions)
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NotificationType } from '@/lib/types';

export async function createClientNotification(
  clientUid: string,
  type: NotificationType,
  titleEn: string,
  titleFa: string,
  bodyEn: string,
  bodyFa: string,
  options?: { link?: string; createdBy?: string; createdByName?: string }
) {
  try {
    await addDoc(collection(db, 'notifications', clientUid, 'items'), {
      type,
      titleEn, titleFa, bodyEn, bodyFa,
      read: false,
      link: options?.link || '',
      createdAt: new Date().toISOString(),
      createdBy: options?.createdBy || '',
      createdByName: options?.createdByName || 'PLUCO GROUP',
    });
  } catch (e) {
    console.error('Failed to create notification:', e);
  }
}

// Helper to create a follow-up flag from agent pages
export async function createFollowUp(data: {
  type: string;
  title: string;
  description?: string;
  priority: string;
  relatedUid?: string;
  relatedId?: string;
  relatedLabel?: string;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: string;
  notes?: string;
}) {
  try {
    const ref = await addDoc(collection(db, 'followups'), {
      ...data,
      status: 'open',
      createdAt: new Date().toISOString(),
    });
    return ref.id;
  } catch (e) {
    console.error('Failed to create follow-up:', e);
    throw e;
  }
}
