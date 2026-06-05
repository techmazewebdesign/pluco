import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { recipientUid, recipientEmail, type, title, message, link, data } = await req.json();

    if (!recipientUid || !recipientEmail || !type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification = await addDoc(collection(db, 'notifications'), {
      recipientUid,
      recipientEmail,
      type, // 'booking_request', 'booking_confirmed', 'booking_cancelled', etc.
      title,
      message,
      link,
      data,
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      notificationId: notification.id,
      message: 'Notification created successfully'
    });
  } catch (error: any) {
    console.error('=== NOTIFICATION CREATE ERROR ===');
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
