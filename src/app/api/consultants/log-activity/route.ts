import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ActivityLog {
  consultantUid: string;
  consultantEmail: string;
  consultantName: string;
  bookingId?: string;
  clientUid?: string;
  clientEmail?: string;
  clientName?: string;
  actionType: 'meeting_created' | 'meeting_sent' | 'meeting_cancelled' | 'meeting_rescheduled' | 'profile_updated' | 'availability_set';
  details: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ActivityLog = await req.json();

    if (!body.consultantUid || !body.consultantEmail || !body.actionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const activity = await addDoc(collection(db, 'consultant_activities'), {
      ...body,
      ipAddress,
      userAgent,
      createdAt: serverTimestamp(),
      status: 'active'
    });

    return NextResponse.json({
      success: true,
      activityId: activity.id,
      message: 'Activity logged successfully'
    });
  } catch (error: any) {
    console.error('=== ACTIVITY LOG ERROR ===');
    console.error('Error:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
