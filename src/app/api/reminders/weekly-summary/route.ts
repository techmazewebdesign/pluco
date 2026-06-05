import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead } from '@/lib/types';

export const runtime = 'nodejs';

interface SummaryData {
  highPriorityLeads: Lead[];
  stalLeads: Lead[];
  totalLeads: number;
  conversions: number;
  weekSummary: {
    newLeads: number;
    contacted: number;
    converted: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all leads
    const leadsSnap = await getDocs(collection(db, 'leads'));
    const allLeads: Lead[] = leadsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as any
    }));

    // Filter high-priority leads not yet contacted
    const highPriorityLeads = allLeads.filter(
      lead => lead.priorityLevel === 'High' && lead.status === 'New'
    );

    // Filter stale leads (not updated for 7+ days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stalLeads = allLeads.filter(lead => {
      const lastUpdate = new Date(lead.updatedAt || lead.createdAt);
      return lead.status === 'New' && lastUpdate < sevenDaysAgo;
    });

    // Calculate week summary (last 7 days)
    const sevenDaysAgoTime = new Date();
    sevenDaysAgoTime.setDate(sevenDaysAgoTime.getDate() - 7);

    const newLeadsThisWeek = allLeads.filter(lead => {
      const createdDate = new Date(lead.createdAt);
      return createdDate > sevenDaysAgoTime;
    }).length;

    const contactedLeads = allLeads.filter(lead => lead.status === 'Contacted').length;
    const conversions = allLeads.filter(lead => lead.status === 'Converted').length;

    const summaryData: SummaryData = {
      highPriorityLeads,
      stalLeads,
      totalLeads: allLeads.length,
      conversions,
      weekSummary: {
        newLeads: newLeadsThisWeek,
        contacted: contactedLeads,
        converted: conversions
      }
    };

    return NextResponse.json(summaryData);
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
