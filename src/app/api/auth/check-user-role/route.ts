import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { email, firebaseUid } = await req.json();

    if (!email && !firebaseUid) {
      return NextResponse.json(
        { error: 'Email or firebaseUid is required' },
        { status: 400 }
      );
    }

    const userEmail = email?.toLowerCase();
    const results: { [key: string]: any } = {};

    // Check all 4 locations
    if (firebaseUid) {
      const agentByUidRef = doc(db, 'agents', firebaseUid);
      const agentByUidSnap = await getDoc(agentByUidRef);
      results['agents/{firebaseUid}'] = agentByUidSnap.exists() ? agentByUidSnap.data() : null;

      const userByUidRef = doc(db, 'users', firebaseUid);
      const userByUidSnap = await getDoc(userByUidRef);
      results['users/{firebaseUid}'] = userByUidSnap.exists() ? userByUidSnap.data() : null;
    }

    if (userEmail) {
      const agentByEmailRef = doc(db, 'agents', userEmail);
      const agentByEmailSnap = await getDoc(agentByEmailRef);
      results['agents/{email}'] = agentByEmailSnap.exists() ? agentByEmailSnap.data() : null;

      const userByEmailRef = doc(db, 'users', userEmail);
      const userByEmailSnap = await getDoc(userByEmailRef);
      results['users/{email}'] = userByEmailSnap.exists() ? userByEmailSnap.data() : null;
    }

    // Find which location has the user and what role
    let foundRole = 'user';
    let foundLocation = 'not found';

    for (const [location, data] of Object.entries(results)) {
      if (data) {
        foundRole = data.role || 'user';
        foundLocation = location;
        break;
      }
    }

    return NextResponse.json({
      email,
      firebaseUid,
      foundRole,
      foundLocation,
      allLocations: results,
      wouldRedirectTo: getRedirectUrl(foundRole),
    });
  } catch (error: any) {
    console.error('Error checking user role:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

function getRedirectUrl(role: string): string {
  const roleRoutes: { [key: string]: string } = {
    admin: '/admin/dashboard',
    consultant: '/consultant/dashboard',
    case_manager: '/case-manager/dashboard',
    customer_service: '/customer-service/dashboard',
    document_reviewer: '/document-reviewer/dashboard',
    compliance_officer: '/compliance-officer/dashboard',
    enquiry_handler: '/enquiry-handler/dashboard',
    user: '/dashboard',
    client: '/dashboard',
  };
  return roleRoutes[role] || '/dashboard';
}
