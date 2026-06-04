import { Lead, PriorityLevel } from '@/lib/types';
import { createLead, getLeads, createNotification, createActivityLog } from '@/lib/services/aiLeadAgentService';

export function useLeadOperations() {
  /**
   * Calculate lead score based on simple rules
   * Returns score 0-100 and priority level
   */
  const calculateLeadScore = (data: Partial<Lead>): { score: number; priority: PriorityLevel; recommendation: string } => {
    let score = 0;

    // Rule 1: Service interest scoring (+25 for high-value services)
    const highValueServices = ['Second Passport', 'EU Residency', 'US Green Card', 'Banking'];
    if (data.serviceInterest && highValueServices.includes(data.serviceInterest)) {
      score += 25;
    }

    // Rule 2: Budget level (+25 for high budget)
    if (data.estimatedBudget && (data.estimatedBudget.includes('+') || data.estimatedBudget.includes('High'))) {
      score += 25;
    }

    // Rule 3: Urgency (+20 for immediate/this month)
    if (data.urgency && ['Immediate', 'This Month', 'Urgent'].includes(data.urgency)) {
      score += 20;
    }

    // Rule 4: Target regions (+10 for specific countries)
    const targetRegions = ['UAE', 'Singapore', 'Hong Kong', 'UK', 'Germany', 'Portugal', 'Malta', 'Cyprus', 'Canada'];
    if (data.country && targetRegions.includes(data.country)) {
      score += 10;
    }

    // Rule 5: Has phone or WhatsApp (+10)
    if (data.phone || data.whatsapp) {
      score += 10;
    }

    // Rule 6: Has email (+10)
    if (data.email) {
      score += 10;
    }

    // Determine priority level
    let priority: PriorityLevel = 'Low';
    let recommendation = 'Keep in nurture list';

    if (score >= 75) {
      priority = 'High';
      recommendation = 'Contact within 24 hours';
    } else if (score >= 40) {
      priority = 'Medium';
      recommendation = 'Send introduction message and follow up in 3 days';
    }

    return { score: Math.min(100, score), priority, recommendation };
  };

  /**
   * Add a single lead manually
   */
  const addLeadManually = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'priorityScore' | 'priorityLevel' | 'status' | 'aiRecommendedAction'>): Promise<Lead | null> => {
    try {
      const { score, priority, recommendation } = calculateLeadScore(leadData);

      const newLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
        ...leadData,
        sourceChannel: leadData.sourceChannel || 'Other',
        priorityScore: score,
        priorityLevel: priority,
        status: 'New',
        aiRecommendedAction: recommendation,
      };

      const created = await createLead(newLead as any);

      if (created) {
        // Create activity log
        await createActivityLog(
          'lead_found',
          `New Lead Added: ${leadData.fullName}`,
          `Lead manually added from ${leadData.sourceChannel || 'direct input'}`,
          created.id,
          priority
        );

        // Create notification if high priority
        if (priority === 'High') {
          await createNotification(
            'lead_hot',
            `🔥 Hot Lead: ${leadData.fullName}`,
            `High-priority lead added - ${leadData.companyName || leadData.fullName}. Service: ${leadData.serviceInterest}. Priority Score: ${score}%`,
            'urgent',
            created.id
          );
        }
      }

      return created;
    } catch (error) {
      console.error('Error adding lead:', error);
      return null;
    }
  };

  /**
   * Import leads from CSV and score them
   */
  const importLeadsFromCSV = async (csvContent: string): Promise<{ success: number; failed: number; errors: string[] }> => {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        return { success: 0, failed: 1, errors: ['CSV must have headers and at least one data row'] };
      }

      // Parse CSV headers (case-insensitive)
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const expectedHeaders = ['fullname', 'email', 'phone', 'country', 'serviceinterest', 'estimatedbudget', 'urgency', 'companyname', 'sourcechannel'];

      // Validate headers
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        return { success: 0, failed: 1, errors: [`Missing required columns: ${missingHeaders.join(', ')}. Expected: ${expectedHeaders.join(', ')}. Found: ${headers.join(', ')}}`] };
      }

      const results = { success: 0, failed: 0, errors: [] as string[] };

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim());

          // Skip empty rows
          if (values.every(v => !v)) continue;

          // Map values to fields
          const rowData: Record<string, string> = {};
          headers.forEach((header, idx) => {
            rowData[header] = values[idx] || '';
          });

          // Validate required fields
          if (!rowData.fullname || !rowData.email) {
            results.failed++;
            results.errors.push(`Row ${i + 1}: Missing fullName or email`);
            continue;
          }

          // Create lead object
          const leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'priorityScore' | 'priorityLevel' | 'status' | 'aiRecommendedAction'> = {
            fullName: rowData.fullname,
            email: rowData.email,
            phone: rowData.phone || undefined,
            whatsapp: undefined,
            country: rowData.country || 'Unknown',
            currentResidence: undefined,
            nationality: undefined,
            serviceInterest: rowData.serviceinterest || 'General',
            sourceChannel: 'Other',
            sourceUrl: undefined,
            companyName: rowData.companyname || undefined,
            estimatedBudget: rowData.estimatedbudget || 'Not specified',
            urgency: (rowData.urgency || 'Low') as 'High' | 'Medium' | 'Low',
            notes: undefined,
            aiSummary: undefined,
          };

          // Score and add
          const created = await addLeadManually(leadData);
          if (created) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`Row ${i + 1}: Failed to create lead`);
          }
        } catch (error) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Error importing CSV:', error);
      return { success: 0, failed: 1, errors: [error instanceof Error ? error.message : 'Unknown error'] };
    }
  };

  /**
   * Recalculate scores for all leads
   */
  const recalculateAllScores = async (): Promise<{ success: number; failed: number; updated: number }> => {
    try {
      const leads = await getLeads();
      let updated = 0;

      for (const lead of leads) {
        const { score, priority, recommendation } = calculateLeadScore(lead);

        // Only update if changed
        if (score !== lead.priorityScore || priority !== lead.priorityLevel) {
          await createActivityLog(
            'lead_scored',
            'Score Recalculated',
            `Lead score updated from ${lead.priorityScore} to ${score}`,
            lead.id,
            priority
          );
          updated++;

          // Create notification if priority changed to High
          if (priority === 'High' && lead.priorityLevel !== 'High') {
            await createNotification(
              'lead_hot',
              `🔥 Hot Lead: ${lead.fullName}`,
              `Lead priority changed to High after recalculation (Score: ${score}%)`,
              'urgent',
              lead.id
            );
          }
        }
      }

      return { success: 1, failed: 0, updated };
    } catch (error) {
      console.error('Error recalculating scores:', error);
      return { success: 0, failed: 1, updated: 0 };
    }
  };

  /**
   * Export leads to CSV
   */
  const exportLeadsToCSV = async (): Promise<string> => {
    try {
      const leads = await getLeads();

      // CSV headers
      const headers = ['Full Name', 'Email', 'Phone', 'Country', 'Service Interest', 'Budget', 'Urgency', 'Company', 'Status', 'Priority', 'Score', 'Last Contact'];

      // CSV rows
      const rows = leads.map(lead => [
        lead.fullName,
        lead.email,
        lead.phone || '',
        lead.country,
        lead.serviceInterest,
        lead.estimatedBudget,
        lead.urgency,
        lead.companyName || '',
        lead.status,
        lead.priorityLevel,
        lead.priorityScore,
        lead.lastContactAt ? new Date(lead.lastContactAt).toLocaleDateString() : '',
      ]);

      // Combine and escape CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row =>
          row.map(cell => {
            const cellStr = String(cell || '');
            // Escape quotes and wrap if contains comma
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(',')
        ),
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  };

  /**
   * Download CSV file
   */
  const downloadCSV = async () => {
    try {
      const csvContent = await exportLeadsToCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pluco-leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  /**
   * Export leads to Google Sheet via webhook
   */
  const exportLeadsToGoogleSheet = async (leadIds?: string[]): Promise<{ success: number; failed: number; message: string }> => {
    try {
      const allLeads = await getLeads();

      // Filter leads if specific IDs provided
      const leadsToExport = leadIds
        ? allLeads.filter(lead => leadIds.includes(lead.id))
        : allLeads;

      if (leadsToExport.length === 0) {
        return { success: 0, failed: 1, message: 'No leads to export' };
      }

      // Prepare lead data
      const leadsData = leadsToExport.map(lead => ({
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp,
        country: lead.country,
        nationality: lead.nationality,
        serviceInterest: lead.serviceInterest,
        sourceChannel: lead.sourceChannel,
        estimatedBudget: lead.estimatedBudget,
        urgency: lead.urgency,
        priorityScore: lead.priorityScore,
        priorityLevel: lead.priorityLevel,
        status: lead.status,
        aiRecommendedAction: lead.aiRecommendedAction,
        createdAt: lead.createdAt,
      }));

      // Call API route
      const response = await fetch('/api/leads/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leads: leadsData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Export error:', errorData);

        // Create failure notification
        for (const lead of leadsToExport) {
          await createNotification(
            'lead_hot',
            `❌ Export Failed: ${lead.fullName}`,
            `Failed to export lead to Google Sheet: ${errorData.error}`,
            'warning',
            lead.id
          );
        }

        return {
          success: 0,
          failed: leadsToExport.length,
          message: errorData.message || errorData.error || 'Export failed'
        };
      }

      // Create activity logs and notifications for successful exports
      for (const lead of leadsToExport) {
        await createActivityLog(
          'task_completed',
          'Lead Exported to Google Sheet',
          `Lead successfully exported: ${lead.fullName}`,
          lead.id,
          lead.priorityLevel
        );

        await createNotification(
          'message',
          `✅ Exported: ${lead.fullName}`,
          `Lead successfully exported to Google Sheet`,
          'success',
          lead.id
        );
      }

      return {
        success: leadsToExport.length,
        failed: 0,
        message: `Successfully exported ${leadsToExport.length} lead(s) to Google Sheet`
      };
    } catch (error) {
      console.error('Error exporting leads:', error);
      return {
        success: 0,
        failed: 1,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  return {
    calculateLeadScore,
    addLeadManually,
    importLeadsFromCSV,
    recalculateAllScores,
    exportLeadsToCSV,
    downloadCSV,
    exportLeadsToGoogleSheet,
  };
}
