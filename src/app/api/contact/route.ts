import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('=== [CONTACT API REACHED] ===');
    const body = await req.json();

    // Validate required fields
    if (!body.fullName?.trim() || !body.email?.trim()) {
      console.error('[CONTACT API] Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get environment variables
    const googleScriptUrl = process.env.GOOGLE_LEADS_WEB_APP_URL;
    const googleSecret = process.env.GOOGLE_LEADS_SECRET;
    const resendApiKey = process.env.RESEND_API_KEY;

    console.log(`[CONTACT API] GOOGLE_SCRIPT_URL exists: ${!!googleScriptUrl}`);

    if (!googleScriptUrl || !googleSecret) {
      console.error('[CONTACT API] CRITICAL: Missing Google Apps Script configuration');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Map form fields according to specification
    const fullName = body.fullName || body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim();
    const email = body.email;
    const phone = body.phone || body.phoneWhatsapp || body.phoneNumber || body.whatsapp || '';
    const currentCountry = body.currentCountry || body.country || body.currentCountryOfResidence || '';
    const preferredLanguage = body.preferredLanguage || body.language || '';
    const serviceNeeded = body.serviceNeeded || body.service || body.areaOfInterest || '';
    const urgency = body.urgency || 'Normal';
    const familyMembersNames = body.familyMembersNames || body.familyMembers || body.familyMemberNames || '';
    const familyMembersNumber = body.familyMembersNumber || body.familyCount || body.familyMembersCount || '';
    const preferredContactMethod = body.preferredContactMethod || body.contactMethod || '';
    const message = body.message || body.shortCaseDescription || body.description || '';

    // Generate Lead ID and Date
    const date = new Date().toLocaleDateString('en-US'); // MM/DD/YYYY format
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create row array in exact Google Sheet order:
    // A: Date, B: Lead ID, C: Full Name, D: Email, E: Phone, F: Country, G: Language,
    // H: Service, I: Urgency, J: Family Names, K: Family Count, L: Contact Method, M: Message,
    // N: Status, O: Assigned To, P: Follow-Up, Q: Notes
    const rowData = [
      date,                    // A: Date
      leadId,                  // B: Lead ID
      fullName,               // C: Full Name
      email,                  // D: Email
      phone,                  // E: Phone / WhatsApp
      currentCountry,         // F: Current Country of Residence
      preferredLanguage,      // G: Preferred Language
      serviceNeeded,          // H: Service Needed
      urgency,                // I: Urgency
      familyMembersNames,     // J: Family Members Names
      familyMembersNumber,    // K: Family Members Number
      preferredContactMethod, // L: Preferred Contact Method
      message,                // M: Short Case Description
      'New',                  // N: Lead Status (default to New)
      '',                     // O: Assigned To (empty)
      '',                     // P: Next Follow-Up Date (empty)
      ''                      // Q: Notes (empty)
    ];

    // Step 1: Send to Google Sheets via Apps Script
    console.log('[CONTACT API] Sending to Google Sheet...');
    const googlePayload = {
      secret: googleSecret,
      row: rowData,
    };

    const gasResponse = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googlePayload),
    });

    let gasText = '';
    try {
      gasText = await gasResponse.text();
    } catch (e) {
      gasText = 'Unable to read response';
    }

    console.log(`[CONTACT API] Google Sheet response status: ${gasResponse.status}`);
    console.log(`[CONTACT API] Google Sheet response text: ${gasText}`);

    // CRITICAL: Only continue if Google Sheets succeeds
    if (!gasResponse.ok) {
      console.error('[CONTACT API] Google Sheet submission failed - NOT sending success response');
      return NextResponse.json(
        { success: false, error: 'Failed to save lead to database' },
        { status: 500 }
      );
    }

    console.log('[CONTACT API] Google Sheet submission succeeded');

    // Step 2: Send Email Notification (async, after Google Sheets succeeds)
    console.log('[CONTACT API] Sending email...');
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'noreply@plucogroup.com',
            to: 'info@plucogroup.com',
            subject: `New Enquiry from ${fullName}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Country:</strong> ${currentCountry || 'Not provided'}</p>
              <p><strong>Language:</strong> ${preferredLanguage || 'Not provided'}</p>
              <p><strong>Service:</strong> ${serviceNeeded || 'Not specified'}</p>
              <p><strong>Urgency:</strong> ${urgency}</p>
              <p><strong>Message:</strong></p>
              <p>${message || 'No message provided'}</p>
              <hr>
              <p>Lead ID: ${leadId}</p>
              <p>Submitted at: ${new Date().toISOString()}</p>
            `,
          }),
        });

        console.log('[CONTACT API] Email sent');
      } catch (emailError) {
        console.error('[CONTACT API] Email sending error:', emailError);
        // Don't fail - email is secondary to Google Sheets
      }
    }

    // Return success only after Google Sheets succeeds
    console.log('[CONTACT API] Contact form processed successfully');
    return NextResponse.json({
      success: true,
      message: 'Thank you. Your enquiry has been received. Our team will contact you shortly.',
      leadId,
    });
  } catch (error) {
    console.error('[CONTACT API] FATAL ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
