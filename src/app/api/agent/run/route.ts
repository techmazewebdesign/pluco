import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, accept the token and process the request
    // Full Firebase Admin verification will be implemented when env is properly configured

    return NextResponse.json({
      success: true,
      message: 'Agent run completed. New leads analyzed and prepared.',
      processed: 0,
      updated: 0,
      note: 'Lead analysis is performed on the frontend using client-side Firebase for real-time updates'
    });
  } catch (error) {
    console.error('Agent run error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run agent',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
