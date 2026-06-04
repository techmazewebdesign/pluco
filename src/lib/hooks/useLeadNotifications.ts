import { Lead } from '@/lib/types';
import { createNotification } from '@/lib/services/aiLeadAgentService';

export function useLeadNotifications() {
  /**
   * Check if a lead should trigger notifications based on rules
   * and create them if necessary
   */
  const checkAndCreateLeadNotifications = async (lead: Lead, previousStatus?: string) => {
    try {
      // Rule 1: High priority lead found
      if (lead.priorityLevel === 'High' && previousStatus !== lead.status) {
        await createNotification(
          'lead_hot',
          `🔥 Hot Lead Found: ${lead.fullName}`,
          `High-priority lead identified - ${lead.companyName || lead.fullName}. Service: ${lead.serviceInterest}. Priority Score: ${lead.priorityScore}%`,
          'urgent',
          lead.id
        );
      }

      // Rule 2: Consultation ready
      if (lead.status === 'Consultation Ready' && previousStatus !== 'Consultation Ready') {
        await createNotification(
          'consultation_ready',
          `✅ Consultation Ready: ${lead.fullName}`,
          `Lead is ready for consultation booking. Budget: ${lead.estimatedBudget}`,
          'urgent',
          lead.id
        );
      }

      // Rule 3: Follow-up due today
      if (lead.nextFollowUpAt) {
        const followUpDate = new Date(lead.nextFollowUpAt);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (
          followUpDate.toDateString() === today.toDateString() ||
          (followUpDate < tomorrow && followUpDate > today)
        ) {
          await createNotification(
            'follow_up_due',
            `📞 Follow-up Due Today: ${lead.fullName}`,
            `${lead.companyName ? `${lead.companyName} - ` : ''}${lead.fullName} needs follow-up. Service: ${lead.serviceInterest}`,
            'warning',
            lead.id
          );
        }
      }

      // Rule 4: New message prepared
      if (lead.status === 'Message Prepared' && previousStatus !== 'Message Prepared') {
        await createNotification(
          'message',
          `✉️ Message Prepared: ${lead.fullName}`,
          `Outreach message has been prepared and is ready to send.`,
          'info',
          lead.id
        );
      }

      // Rule 5: Lead converted
      if (lead.status === 'Converted' && previousStatus !== 'Converted') {
        await createNotification(
          'lead_found',
          `🎉 Lead Converted: ${lead.fullName}`,
          `Success! ${lead.fullName} has been converted to a client.`,
          'success',
          lead.id
        );
      }
    } catch (error) {
      console.error('Error creating lead notifications:', error);
    }
  };

  /**
   * Create a new lead found notification
   */
  const createNewLeadNotification = async (lead: Lead) => {
    try {
      await createNotification(
        'lead_found',
        `🎯 New Lead Found: ${lead.fullName}`,
        `New lead from ${lead.sourceChannel} - ${lead.companyName || lead.fullName}. Service: ${lead.serviceInterest}`,
        'info',
        lead.id
      );

      // Also check for immediate high-priority notification
      if (lead.priorityLevel === 'High') {
        await checkAndCreateLeadNotifications(lead);
      }
    } catch (error) {
      console.error('Error creating new lead notification:', error);
    }
  };

  /**
   * Create notification for failed task
   */
  const createTaskFailedNotification = async (taskTitle: string, errorMessage?: string) => {
    try {
      await createNotification(
        'task_failed',
        `❌ Task Failed: ${taskTitle}`,
        `Agent task failed. ${errorMessage ? `Error: ${errorMessage}` : 'Please review and retry.'}`,
        'warning'
      );
    } catch (error) {
      console.error('Error creating task failed notification:', error);
    }
  };

  /**
   * Create notification for CRM sync completion
   */
  const createCrmSyncNotification = async (resultCount: number) => {
    try {
      await createNotification(
        'system',
        '✅ CRM Sync Completed',
        `Successfully synced ${resultCount} leads to CRM system.`,
        'success'
      );
    } catch (error) {
      console.error('Error creating CRM sync notification:', error);
    }
  };

  return {
    checkAndCreateLeadNotifications,
    createNewLeadNotification,
    createTaskFailedNotification,
    createCrmSyncNotification,
  };
}
